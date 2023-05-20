import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const StockItemController = {
  list: async function(req: Request, res: Response, next: NextFunction) {
    res.send("StockItems list GET");
  },
  create: async function(req: Request, res: Response, next: NextFunction) {
    res.send("StockItem create GET");
  },
  update: async function(req: Request, res: Response, next: NextFunction) {
    res.send("StockItem update GET");
  },
  delete: async function(req: Request, res: Response, next: NextFunction) {
    res.send("StockItem delete GET");
  },
  detail: async function(req: Request, res: Response, next: NextFunction) {
    res.send("StockItem detail GET");
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
