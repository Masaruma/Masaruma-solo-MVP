// ルートディレクトリの.envがいるならこのパスの指定でOK
require("dotenv").config({
    path: "./.env",
});

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// このファイルは npx knex initで作成できる
module.exports = {
    development: {
        client: "pg",
        connection: {
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            // timezone: "Asia/Tokyo",
        },
        migrations: {
            directory: "./data/migrations",
        },
        seeds: { directory: "./data/seeds" },
    },
    production: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: "./data/migrations",
        },
        seeds: { directory: "./data/seeds" },
    },
};
