-- T1: Grants logging in and verifying a sighting automically
BEGIN;
  SAVEPOINT sp_sighting;
  INSERT INTO sightings (animal_id, location_id, location_text, observer_id, sighting_date, animal_count, notes)
  VALUES (2, 5, 'Ranthambore Zone 4', 5, CURRENT_DATE, 1, 'Solo male at waterhole');

  UPDATE sightings SET is_verified=TRUE, verified_by=2, verified_at=NOW()
  WHERE sighting_id = (SELECT MAX(sighting_id) FROM sightings);

  UPDATE location_species SET resident_population = resident_population + 1
  WHERE location_id = 5 AND animal_id = 2;
COMMIT;

-- T2: Create program and assign an animal (savepoint allows partial rollback)
BEGIN;
  SAVEPOINT sp_program;
  INSERT INTO conservation_programs (program_name, start_date, budget_usd, location_id, status, created_by)
  VALUES ('Rhino Resurgence Africa','2025-06-01',3200000,9,'Planning',1);

  INSERT INTO program_animals (program_id, animal_id, target_population)
  VALUES ((SELECT MAX(program_id) FROM conservation_programs), 6, 10000);
  -- ROLLBACK TO SAVEPOINT sp_program;  -- uncomment to undo on validation failure
COMMIT;

-- T3: Annual 2% population update with safety rollback pattern
BEGIN;
  SAVEPOINT sp_pop;
  UPDATE animals SET estimated_population = ROUND(estimated_population * 1.02)
  WHERE status_id IN (SELECT status_id FROM conservation_statuses WHERE threat_level IN ('High','Medium','Low'));
  -- ROLLBACK TO SAVEPOINT sp_pop;  -- uncomment if post-update check fails
COMMIT;


-- ============================================================
-- SECTION 7 — AUTHORIZATION
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'wcs_admin')      THEN CREATE ROLE wcs_admin      LOGIN PASSWORD 'Admin$2025!';      END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'wcs_researcher')  THEN CREATE ROLE wcs_researcher  LOGIN PASSWORD 'Research$2025!';  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'wcs_ranger')      THEN CREATE ROLE wcs_ranger      LOGIN PASSWORD 'Ranger$2025!';      END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'wcs_guest')       THEN CREATE ROLE wcs_guest       LOGIN PASSWORD 'Guest$2025!';       END IF;
END $$;

GRANT ALL PRIVILEGES ON SCHEMA wildlife TO wcs_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA wildlife TO wcs_admin;

GRANT USAGE ON SCHEMA wildlife TO wcs_researcher;
GRANT SELECT ON ALL TABLES IN SCHEMA wildlife TO wcs_researcher;
GRANT INSERT, UPDATE ON wildlife.animals, wildlife.sightings, wildlife.conservation_programs TO wcs_researcher;

GRANT USAGE ON SCHEMA wildlife TO wcs_ranger;
GRANT SELECT ON ALL TABLES IN SCHEMA wildlife TO wcs_ranger;
GRANT INSERT, UPDATE ON wildlife.sightings TO wcs_ranger;

GRANT USAGE ON SCHEMA wildlife TO wcs_guest;
GRANT SELECT ON wildlife.animals, wildlife.sightings, wildlife.locations,
               wildlife.conservation_statuses, wildlife.conservation_programs TO wcs_guest;
-- Explicitly deny users table to guests (no GRANT = no access in PostgreSQL)
