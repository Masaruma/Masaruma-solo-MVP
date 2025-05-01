ALTER TABLE score
    ADD COLUMN game_level_id INT,
    ADD FOREIGN KEY (game_level_id) REFERENCES game_level(id);