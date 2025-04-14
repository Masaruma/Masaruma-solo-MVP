require("dotenv").config({
    path: "./.env",
});

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// このファイルは npx knex initで作成できる
// user指定がおかしい。.envが反応しない。
module.exports = {
    development: {
        client: "postgresql",
        connection: {
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,

            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        },
        migrations: {
            directory: "./data/migrations",
        },
        seeds: { directory: "./data/seeds" },
    },
    production: {
        client: "postgresql",
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: "./data/migrations",
        },
        seeds: { directory: "./data/seeds" },
    },
};
