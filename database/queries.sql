-- SQL Queries
-- List out info animals with conservation status
SELECT a.common_name, a.scientific_name, cs.status_name, cs.threat_level, a.estimated_population
FROM animals a JOIN conservation_statuses cs ON a.status_id = cs.status_id
ORDER BY cs.status_id, a.common_name;


-- List out info of animals listed more than once GROUP BY + HAVING
SELECT a.common_name, COUNT(s.sighting_id) AS sightings,
       SUM(s.animal_count) AS total_seen, MAX(s.sighting_date) AS last_seen
FROM animals a LEFT JOIN sightings s ON a.animal_id = s.animal_id
GROUP BY a.animal_id, a.common_name
HAVING COUNT(s.sighting_id) > 1
ORDER BY sightings DESC;


-- Full sighting details alongside observer role using INNER JOIN
SELECT s.sighting_id, a.common_name,
       COALESCE(l.location_name, s.location_text) AS location,
       u.username AS observer, r.role_name, s.sighting_date, s.animal_count, s.is_verified
FROM sightings s
INNER JOIN animals   a ON s.animal_id   = a.animal_id
INNER JOIN users     u ON s.observer_id = u.user_id
INNER JOIN roles     r ON u.role_id     = r.role_id
LEFT  JOIN locations l ON s.location_id = l.location_id
ORDER BY s.sighting_date DESC;


-- List out animals with their program coverage using FULL OUTER JOIN
SELECT a.common_name, cp.program_name
FROM animals a
FULL OUTER JOIN program_animals pa ON a.animal_id  = pa.animal_id
FULL OUTER JOIN conservation_programs cp ON pa.program_id = cp.program_id
ORDER BY a.common_name;


-- List out animals info with an active program
SELECT common_name, scientific_name FROM animals
WHERE animal_id IN (
    SELECT pa.animal_id FROM program_animals pa
    JOIN conservation_programs cp ON pa.program_id = cp.program_id
    WHERE cp.status = 'Active');


-- PL Blocks
-- A function logging sightings with validation
CREATE OR REPLACE FUNCTION sp_log_sighting(
    p_animal_id   INT,  p_location  TEXT,
    p_observer    INT,  p_date      DATE,
    p_count       INT,  p_notes     TEXT
) RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
    v_loc_id    INT;
    v_new_id    INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM wildlife.animals WHERE animal_id = p_animal_id) THEN
        RETURN 'ERROR: Animal not found.';
    END IF;
    IF p_date > CURRENT_DATE THEN
        RETURN 'ERROR: Future date not allowed.';
    END IF;

    SELECT location_id INTO v_loc_id FROM wildlife.locations
    WHERE location_name ILIKE '%' || p_location || '%' LIMIT 1;

    INSERT INTO wildlife.sightings (animal_id, location_id, location_text, observer_id, sighting_date, animal_count, notes)
    VALUES (p_animal_id, v_loc_id, p_location, p_observer, p_date, p_count, p_notes)
    RETURNING sighting_id INTO v_new_id;

    INSERT INTO wildlife.audit_log (table_name, record_id, action, performed_by, details)
    VALUES ('sightings', v_new_id, 'INSERT', p_observer,
            'Animal #' || p_animal_id || ' count=' || p_count);

    RETURN 'SUCCESS: Sighting #' || v_new_id || ' logged.';
EXCEPTION WHEN OTHERS THEN
    RETURN 'ERROR: ' || SQLERRM;
END;
$$;


-- A function reeturning human-readable coordinates
CREATE OR REPLACE FUNCTION fn_coords(p_lat NUMERIC, p_lng NUMERIC)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT ABS(ROUND(p_lat,4)) || '°' || CASE WHEN p_lat >= 0 THEN 'N' ELSE 'S' END
        || ' ' ||
           ABS(ROUND(p_lng,4)) || '°' || CASE WHEN p_lng >= 0 THEN 'E' ELSE 'W' END;
$$;

-- Country wildlife state as a set-returning function
CREATE OR REPLACE FUNCTION fn_country_report(p_country TEXT)
RETURNS TABLE (
    country      TEXT, parks BIGINT, total_km2 NUMERIC,
    species      BIGINT, sightings BIGINT, critical_species BIGINT
) LANGUAGE sql STABLE AS $$
    SELECT c.country_name,
           COUNT(DISTINCT l.location_id),
           ROUND(SUM(l.area_km2)),
           COUNT(DISTINCT ls.animal_id),
           COUNT(DISTINCT s.sighting_id),
           COUNT(DISTINCT CASE WHEN cs.threat_level = 'Critical' THEN a.animal_id END)
    FROM wildlife.countries c
    JOIN wildlife.locations l         ON l.country_id   = c.country_id
    LEFT JOIN wildlife.location_species ls ON ls.location_id = l.location_id
    LEFT JOIN wildlife.animals a      ON a.animal_id    = ls.animal_id
    LEFT JOIN wildlife.conservation_statuses cs ON cs.status_id = a.status_id
    LEFT JOIN wildlife.sightings s    ON s.location_id  = l.location_id
    WHERE c.country_name = p_country
    GROUP BY c.country_name;
$$;

-- A trigger function that auto-escalates IUCN status when population drops
CREATE OR REPLACE FUNCTION trg_population_escalate()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_new_status INT;
BEGIN
    IF NEW.estimated_population IS DISTINCT FROM OLD.estimated_population THEN
        v_new_status := CASE
            WHEN NEW.estimated_population <   250 THEN 1  -- CR
            WHEN NEW.estimated_population <  2500 THEN 2  -- EN
            WHEN NEW.estimated_population < 10000 THEN 3  -- VU
            ELSE OLD.status_id
        END;
        IF v_new_status <> OLD.status_id THEN
            NEW.status_id := v_new_status;
            INSERT INTO wildlife.audit_log (table_name, record_id, action, details)
            VALUES ('animals', NEW.animal_id, 'UPDATE',
                    'Status escalated: pop ' || OLD.estimated_population || '->' || NEW.estimated_population);
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- A procedure checking whether the user can delete an animal or not
CREATE OR REPLACE PROCEDURE DeleteAnimalSecure(
    p_animal_id INT,
    p_user_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_can_delete BOOLEAN;
BEGIN
    SELECT r.can_delete
    INTO v_can_delete
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.user_id = p_user_id;

    IF NOT v_can_delete THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    DELETE FROM animals
    WHERE animal_id = p_animal_id;

    INSERT INTO audit_log(
        table_name,
        record_id,
        action,
        performed_by,
        details
    )
    VALUES(
        'animals',
        p_animal_id,
        'DELETE',
        p_user_id,
        'Animal deleted securely'
    );

    RAISE NOTICE 'Animal deleted';
END;
$$;

SELECT sp_log_sighting(
    1,
    'Serengeti',
    1,
    '2026-05-17',
    5,
    'Observed near watering hole'
);

SELECT fn_coords(-33.9249, 18.4241);
SELECT *
FROM fn_country_report('Kenya');
CALL DeleteAnimalSecure(2,1);





