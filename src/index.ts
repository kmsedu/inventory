import express from "express";
import { router } from "../src/router";
const app = express();

// Set up server
app.set("views", "./src/views/");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use("/", router);

app.listen(8000, () => {
  console.log("Listening on 8000");
});
