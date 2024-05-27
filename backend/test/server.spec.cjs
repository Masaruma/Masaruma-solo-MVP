// chaiは4.2あたりじゃないとrequireできない
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const { setupExpressApp } = require("../src/server/server");
// knex
const config = require("../src/db/knexfile");
const knex = require("knex")(config.development);
// const knex = require("../src/db/index");

const server = setupExpressApp();
// idがどんどん増えていってしまう
describe("Game Score Server", () => {
    // テスト用データ
    let user = { user: "poipoi" };
    let score = {
        user_id: null,
        date: "2024-05-26T14:26:32.000Z",
        score: -10000000.0,
    };
    let insertedScore = null;
    let getData = {
        user: "poipoi",
        date: "2024-05-26T14:26:32.000Z",
        score: "-10000000.00", //文字列にしてないと小数点でハマった
    };
    beforeEach(async () => {
        request = chai.request(server).keepOpen();
        await knex.transaction(async (trx) => {
            const [newUserId] = await trx("users").insert(user).returning("id");
            console.log("newUserId: ", newUserId);
            [insertedScore] = await trx(`irasutoya_score`)
                .insert({
                    user_id: newUserId.id,
                    date: score.date,
                    score: score.score,
                })
                .returning("*");
        });

        // ここでデータ取得が必要
    });
    afterEach(async () => {
        await knex.transaction(async (trx) => {
            // score削除
            const [newUserId] = await trx("irasutoya_score")
                .where("score", score.score)
                .returning("user_id")
                .del()
                .catch(console.error);
            // use削除
            await trx("users")
                .where("id", newUserId.user_id)
                .returning("id")
                .del()
                .then((result) => {
                    console.log("removed test customer");
                })
                .catch(console.error);
        });
        insertedScore = null;

        request.close(() => {
            console.log("---------server is closed.---------");
        });
    });
    // getテスト
    // 新しいデータを挿入してそのデータをgetできるかをテストする。
    describe("getテスト", () => {
        it("挿入したテストデータがgetできるか", (done) => {
            request.get("/api/score/irasutoya").end((err, res) => {
                expect(res).to.have.status(200);
                delete res.body[0].id;
                console.log("res.body: ", res.body[0]);
                expect(JSON.stringify(res.body[0])).to.equal(
                    JSON.stringify(getData)
                );
                expect(err).to.be.null;
                done();
            });
        });
    });

    // postテスト
    describe("postテスト", () => {
        let post = {
            user: "testes",
            date: "2024-05-29T14:26:32.000Z",
            score: 20000000,
        };
        // test終了後のデータ削除処理
        after(async () => {
            await knex.transaction(async (trx) => {
                // score削除
                const [postedUserId] = await trx("irasutoya_score")
                    .where("score", post.score)
                    .returning("user_id")
                    .del()
                    .catch(console.error);
                // user削除
                await trx("users")
                    .where("id", postedUserId.user_id)
                    .returning("id")
                    .del()
                    .then((result) => {
                        console.log("removed test customer");
                    })
                    .catch(console.error);
            });
        });

        it("新規データをpostできるか", (done) => {
            request
                .post("/api/score/irasutoya")
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    console.log("res.body: ", res.body);
                    expect(JSON.stringify(res.body)).to.equal(
                        JSON.stringify({ ok: "ok" })
                    );
                    expect(err).to.be.null;
                    done();
                });
        });
    });
    // 実際にデータを挿入してそのデータが返ってくるか確認する!
});
