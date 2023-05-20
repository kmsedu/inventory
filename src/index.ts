import express from "express";
import { router } from "../src/router";
const app = express();

app.use("/", router);

app.listen(8000, () => {
  console.log("Listening on 8000");
});
