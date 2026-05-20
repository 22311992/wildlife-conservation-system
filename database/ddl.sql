CREATE TABLE roles (
    role_id    SERIAL   PRIMARY KEY,
    role_name  VARCHAR(50)   NOT NULL UNIQUE,
    can_write  BOOLEAN       NOT NULL DEFAULT FALSE,
    can_delete BOOLEAN       NOT NULL DEFAULT FALSE,
    can_admin  BOOLEAN       NOT NULL DEFAULT FALSE
);

CREATE TABLE users (
    user_id       SERIAL        PRIMARY KEY,
    username      VARCHAR(50)   NOT NULL UNIQUE,
    email         VARCHAR(120)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role_id       SMALLINT      NOT NULL REFERENCES roles(role_id) ON UPDATE CASCADE,
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    last_login    TIMESTAMP     NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE conservation_statuses (
    status_id    SERIAL  PRIMARY KEY,
    iucn_code    CHAR(2)      NOT NULL UNIQUE,
    status_name  VARCHAR(50)  NOT NULL,
    threat_level VARCHAR(20)  NOT NULL CHECK (threat_level IN ('Low','Medium','High','Endangered','Critical'))
);


CREATE TABLE taxonomic_classes (
    class_id   SERIAL PRIMARY KEY,
    class_name VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE countries (
    country_id   SERIAL PRIMARY KEY,
    country_name VARCHAR(80) NOT NULL UNIQUE,
    iso_code     CHAR(2)     NOT NULL UNIQUE,
    continent    VARCHAR(20) NOT NULL CHECK (continent IN ('Africa','Asia','Europe','North America','South America','Oceania'))
);

CREATE TABLE animals (
    animal_id            SERIAL        PRIMARY KEY,
    common_name          VARCHAR(100)  NOT NULL,
    scientific_name      VARCHAR(150)  NOT NULL UNIQUE,
    class_id             SMALLINT      NOT NULL REFERENCES taxonomic_classes(class_id),
    status_id            SMALLINT      NOT NULL REFERENCES conservation_statuses(status_id),
    estimated_population INT           CHECK (estimated_population >= 0),
    habitat_description  VARCHAR(300)  NOT NULL DEFAULT '',
    diet_type            VARCHAR(15)   NOT NULL DEFAULT 'Herbivore' CHECK (diet_type IN ('Herbivore','Carnivore','Omnivore')),
    image_emoji          VARCHAR(10)   NOT NULL DEFAULT '🦁',
    created_by           INT           NOT NULL REFERENCES users(user_id),
    created_at           TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE threat_types (
    threat_id   SERIAL PRIMARY KEY,
    threat_name VARCHAR(80) NOT NULL,
    category    VARCHAR(20) NOT NULL CHECK (category IN ('Habitat Loss','Poaching','Climate Change','Disease','Pollution','Other'))
);

CREATE TABLE animal_threats (
    animal_id INT      NOT NULL REFERENCES animals(animal_id)     ON DELETE CASCADE,
    threat_id SMALLINT NOT NULL REFERENCES threat_types(threat_id),
    severity  VARCHAR(10) NOT NULL DEFAULT 'Moderate'
              CHECK (severity IN ('Low','Moderate','High','Critical')),
    PRIMARY KEY (animal_id, threat_id)
);


CREATE TABLE locations (
    location_id      SERIAL        PRIMARY KEY,
    location_name    VARCHAR(150)  NOT NULL,
    country_id       SMALLINT      NOT NULL REFERENCES countries(country_id),
    latitude         NUMERIC(9,6)  NOT NULL CHECK (latitude  BETWEEN -90  AND  90),
    longitude        NUMERIC(9,6)  NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    area_km2         NUMERIC(10,2) NOT NULL CHECK (area_km2 > 0),
    location_type    VARCHAR(25)   NOT NULL CHECK (location_type IN
                       ('National Park','Game Reserve','Wildlife Sanctuary','Marine Reserve','UNESCO Site')),
    established_year SMALLINT      NULL
);

CREATE TABLE location_species (
    location_id         INT     NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE,
    animal_id           INT     NOT NULL REFERENCES animals(animal_id)     ON DELETE CASCADE,
    is_primary          BOOLEAN NOT NULL DEFAULT FALSE,
    resident_population INT     NULL,
    PRIMARY KEY (location_id, animal_id)
);

CREATE TABLE sightings (
    sighting_id   SERIAL        PRIMARY KEY,
    animal_id     INT           NOT NULL REFERENCES animals(animal_id),
    location_id   INT           NULL     REFERENCES locations(location_id) ON DELETE SET NULL,
    location_text VARCHAR(200)  NOT NULL DEFAULT '',
    observer_id   INT           NOT NULL REFERENCES users(user_id),
    sighting_date DATE          NOT NULL,
    animal_count  INT      NOT NULL DEFAULT 1 CHECK (animal_count >= 1),
    notes         TEXT          NULL,
    is_verified   BOOLEAN       NOT NULL DEFAULT FALSE,
    verified_by   INT           NULL REFERENCES users(user_id) ON DELETE SET NULL,
    verified_at   TIMESTAMP     NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE conservation_programs (
    program_id   SERIAL        PRIMARY KEY,
    program_name VARCHAR(150)  NOT NULL UNIQUE,
    start_date   DATE          NOT NULL,
    end_date     DATE          NULL,
    budget_usd   NUMERIC(14,2) CHECK (budget_usd >= 1000),
    location_id  INT           NULL REFERENCES locations(location_id) ON DELETE SET NULL,
    status       VARCHAR(15)   NOT NULL DEFAULT 'Planning'
                 CHECK (status IN ('Planning','Active','Completed','Suspended')),
    created_by   INT           NOT NULL REFERENCES users(user_id)
);

CREATE TABLE program_animals (
    program_id        INT NOT NULL REFERENCES conservation_programs(program_id) ON DELETE CASCADE,
    animal_id         INT NOT NULL REFERENCES animals(animal_id),
    target_population INT NULL,
    PRIMARY KEY (program_id, animal_id)
);

CREATE TABLE audit_log (
    log_id       BIGSERIAL   PRIMARY KEY,
    table_name   VARCHAR(60) NOT NULL,
    record_id    INT         NOT NULL,
    action       VARCHAR(10) NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
    performed_by INT         NULL,
    details      TEXT        NULL,
    performed_at TIMESTAMP   NOT NULL DEFAULT NOW()
);
