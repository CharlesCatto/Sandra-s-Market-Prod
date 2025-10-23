-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Table user
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    birthdate DATE,
    phone_number VARCHAR(20),
    sold INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table christmas_market
CREATE TABLE christmas_market (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location GEOGRAPHY (Point) NOT NULL,
    address VARCHAR(255) NOT NULL,
    number_of_exponents INTEGER NOT NULL,
    number_of_craftsmen INTEGER NOT NULL,
    place_type VARCHAR(20) CHECK (
        place_type IN (
            'church',
            'main_square',
            'sport_hall',
            'other'
        )
    ) NOT NULL,
    animation_type JSONB,
    animals_forbidden BOOLEAN DEFAULT FALSE,
    exposition BOOLEAN DEFAULT FALSE,
    santa_present BOOLEAN DEFAULT FALSE,
    restauration VARCHAR(10) CHECK (
        restauration IN (
            'food',
            'drink',
            'both',
            'none'
        )
    ) DEFAULT 'none',
    usual_days JSONB,
    user_id INTEGER NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index spatial pour les recherches géographiques
CREATE INDEX idx_christmas_market_location ON christmas_market USING GIST (location);

-- Index pour améliorer les performances
CREATE INDEX idx_christmas_market_user_id ON christmas_market (user_id);

CREATE INDEX idx_christmas_market_place_type ON christmas_market (place_type);