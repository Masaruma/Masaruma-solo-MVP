ALTER TABLE score
    ADD COLUMN game_level_id INT default 1,
    ADD FOREIGN KEY (game_level_id) REFERENCES game_levels(id);