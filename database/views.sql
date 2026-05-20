CREATE OR REPLACE VIEW v_sighting_dashboard AS
SELECT s.sighting_id, a.common_name AS animal, a.image_emoji, cs.threat_level,
       COALESCE(l.location_name, s.location_text) AS location, co.country_name,
       s.sighting_date, s.animal_count, u.username AS observer,
       s.is_verified, v.username AS verified_by_user
FROM sightings s
JOIN animals a               ON s.animal_id   = a.animal_id
JOIN conservation_statuses cs ON a.status_id  = cs.status_id
JOIN users u                 ON s.observer_id = u.user_id
LEFT JOIN locations l        ON s.location_id = l.location_id
LEFT JOIN countries co       ON l.country_id  = co.country_id
LEFT JOIN users v            ON s.verified_by = v.user_id;

CREATE OR REPLACE VIEW v_animal_threat_profile AS
SELECT a.animal_id, a.common_name, tc.class_name, cs.status_name, cs.threat_level,
       a.estimated_population,
       STRING_AGG(tt.threat_name || ' [' || at2.severity || ']', '; '
                  ORDER BY at2.severity DESC) AS threats,
       COUNT(tt.threat_id) AS threat_count
FROM animals a
JOIN taxonomic_classes tc     ON a.class_id  = tc.class_id
JOIN conservation_statuses cs ON a.status_id = cs.status_id
LEFT JOIN animal_threats at2  ON at2.animal_id = a.animal_id
LEFT JOIN threat_types tt     ON tt.threat_id  = at2.threat_id
GROUP BY a.animal_id, a.common_name, tc.class_name, cs.status_name, cs.threat_level, a.estimated_population;

CREATE OR REPLACE VIEW v_location_richness AS
SELECT l.location_id, l.location_name, c.country_name, l.area_km2,
       COUNT(DISTINCT ls.animal_id)  AS species_count,
       SUM(ls.resident_population)   AS resident_animals,
       COUNT(DISTINCT s.sighting_id) AS sightings
FROM locations l
JOIN countries c           ON l.country_id   = c.country_id
LEFT JOIN location_species ls ON ls.location_id = l.location_id
LEFT JOIN sightings s      ON s.location_id  = l.location_id
GROUP BY l.location_id, l.location_name, c.country_name, l.area_km2;

CREATE OR REPLACE VIEW v_active_programs AS
SELECT cp.program_name, cp.status, cp.start_date, cp.end_date, cp.budget_usd,
       l.location_name, a.common_name AS target_animal,
       a.estimated_population, pa.target_population,
       ROUND((a.estimated_population::NUMERIC / pa.target_population) * 100, 1) AS pct_achieved
FROM conservation_programs cp
LEFT JOIN locations l        ON cp.location_id = l.location_id
LEFT JOIN program_animals pa ON pa.program_id  = cp.program_id
LEFT JOIN animals a          ON pa.animal_id   = a.animal_id
WHERE cp.status IN ('Active','Planning');

CREATE OR REPLACE VIEW v_user_activity AS
SELECT u.user_id, u.username, r.role_name, u.last_login,
       COUNT(DISTINCT s.sighting_id) AS sightings_logged,
       COUNT(DISTINCT cp.program_id) AS programs_created
FROM users u
JOIN roles r ON u.role_id = r.role_id
LEFT JOIN sightings s              ON s.observer_id = u.user_id
LEFT JOIN conservation_programs cp ON cp.created_by = u.user_id
GROUP BY u.user_id, u.username, r.role_name, u.last_login;

