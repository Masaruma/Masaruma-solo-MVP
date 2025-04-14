/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex("users").del();
    await knex("users").insert([
        { user: "sample1" },
        { user: "sample2" },
        { user: "sample3" },
    ]);
};
