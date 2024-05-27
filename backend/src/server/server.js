const express = require("express");
const path = require("path");

// model= DBとやりとりする関数のインポート=データの取り出しは別ファイルここにはjsondataのみが入ってくるイメージ
const controller = require("../model/modelAndController.js");
// modelでknexは完結させるべきなのか、server.jsで統合して考えるべきなのか

const app = express();
// ====認証処理=====

const setupExpressApp = () => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/", express.static(path.join(__dirname, "../../dist/")));
    app.get("/api/score/:mode", controller.get);

    app.post("/api/score/:mode", controller.post);
    require("./passport")(app);
    // ここ？

    return app;
};

module.exports = { setupExpressApp };
