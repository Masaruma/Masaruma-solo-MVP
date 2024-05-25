const knex = require("knex");
// configをknexに統合
const knexConfig = require("./knexfile");
// knexfileの環境設定をどちらにするか決定
const environment = process.env.DATABASE_URL ? "production" : "development";

module.exports = knex(knexConfig[environment]);
