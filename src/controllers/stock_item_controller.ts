import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const StockItemController = {
  detail: async function(req: Request, res: Response, next: NextFunction) {
    res.render("stock_item_detail", { title: "Stock Item Detail" });
  },
  list: async function(req: Request, res: Response, next: NextFunction) {
    res.render("stock_item_list", { title: "Stock Item List" });
  },
  create: async function(req: Request, res: Response, next: NextFunction) {
    res.render("stock_item_create", { title: "Stock Item Create" });
  },
  update: async function(req: Request, res: Response, next: NextFunction) {
    res.render("stock_item_create", { title: "Stock Item Update" });
  },
  delete: async function(req: Request, res: Response, next: NextFunction) {
    res.render("stock_item_delete", { title: "Stock Item Delete" });
  },
  createPost: async function(req: Request, res: Response, next: NextFunction) {
    res.send("StockItem create POST");
  },
  updatePost: async function(req: Request, res: Response, next: NextFunction) {
    res.send("StockItem update POST");
  },
  deletePost: async function(req: Request, res: Response, next: NextFunction) {
    res.send("StockItem delete POST");
  },
};

export { StockItemController };
