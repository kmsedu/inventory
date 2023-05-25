import express from "express";
import { router } from "../src/router";
import { handleErrors } from "./util/handle_errors";
const app = express();

// Set up server
app.set("views", "./src/views/");
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use(router);

app.use(handleErrors);

app.listen(8000, () => {
  console.log("Listening on 8000");
});
