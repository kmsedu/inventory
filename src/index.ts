import * as http from "http";

const server: http.Server = http.createServer((req, res) => {
  console.log("Got Request");
  printRequest(req, res);
});

const printRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
  console.log(req.url);
  res.end(
    `Server functional, received ${req.method
    } request at ${new Date().toString()}`
  );
};

server.listen(8000, () => {
  console.log("Listening on port 8000");
});
