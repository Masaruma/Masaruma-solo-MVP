/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("pokemon_score", function (t) {
        // idカラムを作成
        t.increments("id").primary();
        // 整数のuseridを作成
        t.integer("user_id").notNullable();
        // 外部キーの設定
        t.foreign("user_id").references("id").inTable("users");
        t.timestamp("date");
        t.decimal("score", 32);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("pokemon_score");
};
