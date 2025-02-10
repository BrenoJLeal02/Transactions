const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("server.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
  setTimeout(() => next(), 500);
});

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server está rodando em http://localhost:3000");
});
