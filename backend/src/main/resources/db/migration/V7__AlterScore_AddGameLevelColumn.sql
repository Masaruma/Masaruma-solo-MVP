ALTER TABLE score
    ADD COLUMN number_of_cards_id INT,
    ADD FOREIGN KEY (number_of_cards_id) REFERENCES number_of_cards(id);