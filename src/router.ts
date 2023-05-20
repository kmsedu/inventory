import express from "express";

const router = express.Router();

// Index GET
router.get("/", itemController.index);

// Item GET routing
router.get("/items", itemController.list);
router.get("/item/create", itemController.create);
router.get("/item/:id/update", itemController.update);
router.get("/item/:id/delete", itemController.delete);
router.get("/item/:id", itemController.detail);

// Item POST routing
router.post("/item/create", itemController.createPost);
router.post("/item/:id/update", itemController.updatePost);
router.post("/item/:id/delete", itemController.deletePost);

// Category GET routing
router.get("/categories", categoryController.list);
router.get("/category/create", categoryController.create);
router.get("/category/:id/update", categoryController.update);
router.get("/category/:id/delete", categoryController.delete);
router.get("/category/:id", categoryController.detail);

// Category POST routing
router.post("/category/create", categoryController.createPost);
router.post("/category/:id/update", categoryController.updatePost);
router.post("/category/:id/delete", categoryController.deletePost);

// StockItem GET routing
router.get("/stockitems", stockItemController.list);
router.get("/stockitem/create", stockItemController.create);
router.get("/stockitem/:id/update", stockItemController.update);
router.get("/stockitem/:id/delete", stockItemController.delete);
router.get("/stockitem/:id", stockItemController.detail);

// StockItem POST routing
router.post("/stockitem/create", stockItemController.createPost);
router.post("/stockitem/:id/update", stockItemController.updatePost);
router.post("/stockitem/:id/delete", stockItemController.deletePost);
