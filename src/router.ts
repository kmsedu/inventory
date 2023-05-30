import express from "express";
import { ItemController } from "./controllers/item_controller";
import { CategoryController } from "./controllers/category_controller";
import { UploadController } from "./controllers/upload_controller";

const router = express.Router();

// Index GET
router.get("/", ItemController.index);

// Item GET routing
router.get("/items", ItemController.list);
router.get("/item/create", ItemController.create);
router.get("/item/:id/update", ItemController.update);
router.get("/item/:id/delete", ItemController.delete);
router.get("/item/:id", ItemController.detail);

// Item POST routing
router.post("/item/create", ItemController.createPost);
router.post("/item/:id/update", ItemController.updatePost);
router.post("/item/:id/delete", ItemController.deletePost);

// Category GET routing
router.get("/categories", CategoryController.list);
router.get("/category/create", CategoryController.create);
router.get("/category/:id/update", CategoryController.update);
router.get("/category/:id/delete", CategoryController.delete);
router.get("/category/:id", CategoryController.detail);

// Category POST routing
router.post("/category/create", CategoryController.createPost);
router.post("/category/:id/update", CategoryController.updatePost);
router.post("/category/:id/delete", CategoryController.deletePost);

// Upload route
router.post("/upload", UploadController.post);

// 404 Route
router.get("/404", (req, res, next) => {
  const error = new Error("404 Not Found");
  res.status(404).render("error", {
    title: "404 Not Found",
    error,
  });
});

router.get("*", (req, res, next) => {
  const err = new Error("Invalid URL");
  next(err);
});

export { router };
