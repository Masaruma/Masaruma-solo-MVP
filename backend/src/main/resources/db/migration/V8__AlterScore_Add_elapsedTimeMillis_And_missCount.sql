ALTER TABLE score
    ADD COLUMN elapsed_time_millis INT  DEFAULT 0,
    ADD COLUMN miss_count INT DEFAULT 0;