const knex = require("../db/index");
//

module.exports = {
    async get(req, res) {
        // 上位10件を取得なのでorder by
        // console.log("getが通ってるよ");
        console.log("req: ", req.params.mode);
        const mode = req.params.mode;

        const score = await knex
            .select(
                `${mode}_score.id`,
                "users.user",
                `${mode}_score.date`,
                `${mode}_score.score`
            )
            .from(`${mode}_score`)
            .join("users", "users.id", `${mode}_score.user_id`)
            .orderBy(`${mode}_score.score`, "asc")
            .limit(10)
            .catch((err) => console.error(err));
        // res.send(score);
        res.status(200).send(score);
    },
    async post(req, res) {
        console.log("postが通ってるよ");
        // console.log("req: ", req.params.mode);
        const mode = req.params.mode;
        const { user, date, score } = req.body;
        try {
            await knex.transaction(async (trx) => {
                const [newUserId] = await trx("users")
                    .insert({ user })
                    .returning("id");
                console.log("newUserId: ", newUserId);
                await trx(`${mode}_score`).insert({
                    user_id: newUserId.id,
                    date,
                    score,
                });
            });
            res.status(200).send({ ok: "ok" });
        } catch (err) {
            console.error(err);
            res.status(500).send({ err });
        }
    },
};
