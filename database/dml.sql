INSERT INTO roles (role_name, can_write, can_delete, can_admin) VALUES
  ('Administrator', TRUE, TRUE, TRUE),
  ('Researcher',    TRUE, FALSE, FALSE),
  ('Field Ranger',  TRUE, FALSE, FALSE),
  ('Guest',         FALSE, FALSE, FALSE);

INSERT INTO users (username, email, password_hash, role_id, last_login) VALUES
  ('Adam',       'adam@wildlife.com',       'adam123',       1, '2025-04-01 08:00:00'),
  ('Omar',       'omar@wildlife.com',       'omar123',       1, '2025-04-02 09:15:00'),
  ('Majdouline', 'majdouline@wildlife.com', 'majdouline123', 2, '2025-04-03 10:00:00'),
  ('Hanae',      'hanae@wildlife.com',      'hanae123',      2, '2025-04-04 11:30:00'),
  ('Bachair',    'bachair@wildlife.com',    'bachair123',    3, '2025-04-05 07:00:00'),
  ('Farid',      'farid@wildlife.com',      'farid123',      3, '2025-04-06 06:45:00'),
  ('guest',      'guest@wildlife.com',      'guest',         4, NULL);

INSERT INTO conservation_statuses (iucn_code, status_name, threat_level) VALUES
  ('CR','Critically Endangered','Critical'),
  ('EN','Endangered',           'Endangered'),
  ('VU','Vulnerable',           'High'),
  ('NT','Near Threatened',      'Medium'),
  ('LC','Least Concern',        'Low');

INSERT INTO taxonomic_classes (class_name) VALUES ('Mammalia'),('Aves'),('Reptilia');

INSERT INTO countries (country_name, iso_code, continent) VALUES
  ('Morocco','MA','Africa'), ('Kenya','KE','Africa'),   ('Rwanda','RW','Africa'),
  ('Tanzania','TZ','Africa'),('Namibia','NA','Africa'),  ('South Africa','ZA','Africa'),
  ('India','IN','Asia'),     ('China','CN','Asia');

INSERT INTO animals (common_name, scientific_name, class_id, status_id, estimated_population, habitat_description, diet_type, image_emoji, created_by) VALUES
  ('African Elephant',  'Loxodonta africana',        1,3,415000,'Savannas of sub-Saharan Africa',       'Herbivore','🐘',1),
  ('Bengal Tiger',      'Panthera tigris tigris',     1,2,  2500,'Dense forests of Indian subcontinent', 'Carnivore','🐯',1),
  ('Mountain Gorilla',  'Gorilla beringei beringei',  1,1,  1063,'Virunga volcanic mountains',           'Herbivore','🦍',1),
  ('Giant Panda',       'Ailuropoda melanoleuca',     1,3,  1864,'Bamboo forests of Sichuan, China',     'Herbivore','🐼',1),
  ('Green Sea Turtle',  'Chelonia mydas',             3,2,200000,'Tropical oceans worldwide',            'Herbivore','🐢',2),
  ('Black Rhino',       'Diceros bicornis',           1,1,  5630,'Savannas of eastern/southern Africa',  'Herbivore','🦏',1),
  ('Bornean Orangutan', 'Pongo pygmaeus',             1,1,104700,'Tropical rainforests of Borneo',       'Omnivore', '🦧',2),
  ('Snow Leopard',      'Panthera uncia',             1,3,  6500,'Mountain ranges of Central Asia',      'Carnivore','🐆',3),
  ('Barbary Macaque',   'Macaca sylvanus',            1,2,  8000,'Atlas Mountains cedar forests',        'Omnivore', '🐒',3),
  ('Northern Bald Ibis','Geronticus eremita',         2,1,   500,'Semi-arid cliffs, Morocco',            'Omnivore', '🦩',3);

INSERT INTO threat_types (threat_name, category) VALUES
  ('Ivory poaching',        'Poaching'),
  ('Deforestation',         'Habitat Loss'),
  ('Climate change',        'Climate Change'),
  ('Ocean plastics',        'Pollution'),
  ('Rhino horn trade',      'Poaching'),
  ('Disease outbreaks',     'Disease'),
  ('Agricultural expansion','Habitat Loss');

INSERT INTO animal_threats (animal_id, threat_id, severity) VALUES
  (1,1,'Critical'),(1,7,'High'),    (2,2,'High'),(2,1,'Critical'),
  (3,6,'High'),    (3,2,'Critical'),(4,2,'High'),(4,3,'Moderate'),
  (5,4,'High'),    (5,3,'Moderate'),(6,5,'Critical'),(6,7,'High'),
  (7,2,'Critical'),(8,3,'High'),    (9,2,'High'),(10,2,'Critical');

INSERT INTO locations (location_name, country_id, latitude, longitude, area_km2, location_type, established_year) VALUES
  ('Toubkal National Park',        1, 31.5000,  -7.5000,   380,'National Park',  1942),
  ('Souss-Massa National Park',    1, 30.1000,  -9.6000,   338,'National Park',  1991),
  ('Amboseli National Park',       2, -2.6389,  37.2533,   392,'National Park',  1977),
  ('Masai Mara National Reserve',  2, -1.4931,  35.1432,  1510,'Game Reserve',   1961),
  ('Ranthambore National Park',    7, 26.0173,  76.5026,   392,'National Park',  1980),
  ('Volcanoes National Park',      3, -1.4675,  29.4925,   160,'National Park',  1925),
  ('Sichuan Panda Sanctuary',      8, 30.5728, 103.0143,  9245,'UNESCO Site',    2006),
  ('Serengeti National Park',      4, -2.3333,  34.8333, 14750,'National Park',  1951),
  ('Etosha National Park',         5,-18.8556,  16.3317, 22270,'National Park',  1907),
  ('Kruger National Park',         6,-24.0111,  31.4853, 19485,'National Park',  1898);

INSERT INTO location_species (location_id, animal_id, is_primary, resident_population) VALUES
  (1,9,TRUE,250),(2,10,TRUE,60),(3,1,TRUE,900),(4,1,TRUE,1400),
  (5,2,TRUE, 65),(6,3,TRUE,604),(7,4,TRUE,300),(8,1,FALSE,2600),
  (9,6,TRUE,200),(10,6,FALSE,80);

INSERT INTO sightings (animal_id, location_id, location_text, observer_id, sighting_date, animal_count, notes, is_verified, verified_by, verified_at) VALUES
  (1, 3,'Amboseli National Park, Kenya',      1,'2025-03-15',45,'Healthy herd with many calves',        TRUE,2,'2025-03-16 09:00:00'),
  (2, 5,'Ranthambore National Park, India',   5,'2025-03-10', 3,'Mother with two cubs near lake',       TRUE,2,'2025-03-11 11:00:00'),
  (3, 6,'Volcanoes National Park, Rwanda',    2,'2025-03-05',12,'Family group including silverback',    TRUE,1,'2025-03-06 08:00:00'),
  (1, 4,'Masai Mara, Kenya',                 3,'2025-03-18',28,'Crossing the river',                   TRUE,1,'2025-03-19 10:00:00'),
  (4, 7,'Sichuan Province, China',            4,'2025-03-12', 2,'Feeding on bamboo shoots',             TRUE,2,'2025-03-13 12:00:00'),
  (6, 9,'Etosha National Park, Namibia',      6,'2025-03-08', 5,'Mother and calf at waterhole',         TRUE,1,'2025-03-09 09:00:00'),
  (9, 1,'Toubkal National Park, Morocco',     1,'2025-03-20',15,'Group feeding on cedar trees',         FALSE,NULL,NULL),
  (10,2,'Souss-Massa National Park, Morocco', 3,'2025-03-17', 8,'Nesting season on coastal cliffs',     TRUE,2,'2025-03-18 08:30:00'),
  (8,NULL,'Hindu Kush Mountains',             5,'2025-02-20', 2,'Tracks confirmed by camera trap',      FALSE,NULL,NULL),
  (7,NULL,'Kinabalu Park, Borneo',            4,'2025-02-25', 6,'Three adults, two juveniles foraging', TRUE,3,'2025-02-26 10:00:00');


INSERT INTO conservation_programs (program_name, start_date, end_date, budget_usd, location_id, status, created_by) VALUES
  ('Atlas Primate Shield',    '2023-01-01','2027-12-31', 850000,1,'Active',    1),
  ('Ibis Recovery Initiative','2022-06-01','2026-05-31', 620000,2,'Active',    2),
  ('Elephant Corridor Kenya', '2024-03-01', NULL,       2400000,3,'Active',    1),
  ('Project Bengal',          '2021-01-01','2025-12-31',1800000,5,'Active',    3),
  ('Gorilla Health Watch',    '2020-07-01','2025-06-30', 950000,6,'Completed', 2);

INSERT INTO program_animals (program_id, animal_id, target_population) VALUES
  (1,9,12000),(2,10,900),(3,1,600000),(4,2,4000),(5,3,1500);

UPDATE animals   SET estimated_population = 430000,  updated_at = NOW() WHERE common_name = 'African Elephant';
UPDATE sightings SET animal_count = 6, notes = 'Re-counted: mother, calf and 4 sub-adults' WHERE sighting_id = 6;
UPDATE sightings SET is_verified = TRUE, verified_by = 2, verified_at = NOW() WHERE sighting_id = 9;
DELETE FROM location_species WHERE location_id = 8 AND animal_id = 7;

