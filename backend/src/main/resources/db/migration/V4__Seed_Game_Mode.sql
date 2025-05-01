INSERT INTO game_modes (game_name)
VALUES
    ('irasutoya'),
    ('pokemon')
    ON CONFLICT (game_name) DO NOTHING;