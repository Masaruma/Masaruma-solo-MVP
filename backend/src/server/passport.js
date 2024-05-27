const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const flash = require("express-flash");

module.exports = function (app) {
    // セッションの設定
    app.use(
        session({
            secret: "secret",
            resave: false,
            saveUninitialized: false,
        })
    );

    // Passportの初期化
    app.use(passport.initialize());
    app.use(passport.session());

    // express-flashミドルウェアの使用
    app.use(flash());

    const users = [
        { id: 1, username: "DIG", password: "DIG" },
        { id: 2, username: "dig", password: "dig" },
    ];
    // シリアライズ
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    //   でシリアライズ
    passport.deserializeUser((id, done) => {
        const user = users.find((u) => u.id === id);
        done(null, user);
    });
    passport.use(
        new LocalStrategy((username, password, done) => {
            const user = users.find((user) => user.username === username);
            if (!user) {
                console.log("間違い1");
                return done(null, false, { message: "Incorrect username." });
            }
            if (user.password !== password) {
                console.log("間違い2");

                return done(null, false, { message: "Incorrect password." });
            }
            console.log("あってるよ");

            return done(null, user);
        })
    );
    app.get("/login", (req, res) => {
        // ログインページをレンダリングする処理
        console.log("ログイン処理され");

        res.sendStatus(404);
    });

    // ログインルートの定義

    app.post(
        "/login",
        passport.authenticate("local", {
            // successRedirect: "/login",
            failureRedirect: "/login",
            failureFlash: false,
        }),
        (req, res) => {
            console.log("ログイン処理されてるよ");
            res.sendStatus(200);
        }
    );
};
