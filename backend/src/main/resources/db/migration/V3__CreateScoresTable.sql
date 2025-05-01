CREATE TABLE score
(
    id SERIAL PRIMARY KEY,
    game_score INT NOT NULL,
    user_id INT NOT NULL,
    game_mode_id INT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_mode_id) REFERENCES game_modes(id)
);