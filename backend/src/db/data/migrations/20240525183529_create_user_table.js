/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    // スキーマ名と被るとうまくいかないかも。user.userのように修飾子を使う必要が出てくる
    return knex.schema.createTable("users", function (t) {
        // idカラムの作成
        t.increments("id").primary();
        // ユーザーカラムの作成
        t.string("user", 32).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("user");
};
