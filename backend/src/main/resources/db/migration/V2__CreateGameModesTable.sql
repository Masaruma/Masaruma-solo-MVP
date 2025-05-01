CREATE TABLE game_modes
(
    id   SERIAL PRIMARY KEY,
    game_name VARCHAR(255) NOT NULL UNIQUE
);