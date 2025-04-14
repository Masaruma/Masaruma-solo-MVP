CREATE TABLE scores
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    score INT NOT NULL,
    user_id INT NOT NULL,
    game_mode_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_mode_id) REFERENCES game_modes(id)
);