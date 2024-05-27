const express = require("express");
const path = require("path");
let passport = require("passport");
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

    // =======認証処理======
    const users = [
        { id: 1, username: "DIG", password: "DIG" },
        { id: 2, username: "dig", password: "dig" },
    ];
    let LocalStrategy = require("passport-local").Strategy;
    passport.use(
        new LocalStrategy(function (username, password, done) {
            // ここで username と password を確認して結果を返す
            const user = users.find((user) => user.username === username);
            const pass = users.find((user) => user.password === password);
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            } else if (!pass) {
                return done(null, false, { message: "Incorrect username." });
            }
            return done(null, user);
        })
    );
    // ====認証処理=====
    app.use(passport.initialize());
    // ===GETした場合の処理
    app.get("/login", function (req, res) {
        res.sendStatus(200);
    });
    // 第２引数にユーザーネームとパスワードが渡される
    app.post("/login", passport.authenticate("local"), function (req, res) {
        // 認証成功するとここが実行される
        console.log("a");
        res.sendStatus(200);
    });
    return app;
};

module.exports = { setupExpressApp };
