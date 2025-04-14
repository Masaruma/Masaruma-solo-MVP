const { setupExpressApp } = require("./server");

const server = setupExpressApp();
// rendar用のポート番号追記
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server listening on Port", PORT);
});
