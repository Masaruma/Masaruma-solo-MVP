const knex = require("../db/index");

module.exports = {
    get(req, res) {
        // 上位15件を取得なのでorder by
        console.log("getが通ってるよ");
        res.status(200).send({ value: "a" });
    },
    post(req, res) {
        console.log("ポストが通ってるよ");
        console.log("req: ", req.body);
        console.log("req: ", req.params.mode);
        console.log("req: ", typeof req.body);
        res.status(200).send({ ok: "ok" });
    },
};
