/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex("pokemon_score").del();
    await knex("pokemon_score").insert([
        { user_id: 1, date: "2010-01-01 00:00:00", score: 100 },
        { user_id: 2, date: "2010-01-01 00:00:10", score: 103 },
        { user_id: 3, date: "2010-01-01 00:00:15", score: 102 },
    ]);
};
