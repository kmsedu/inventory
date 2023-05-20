import express from "express";

const app = express();

app.all("/*", (req) => {
  console.log(req.url);
});

app.listen(8000, () => {
  console.log("Listening on 8000");
});
