import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const CategoryController = {
  list: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Categories list GET");
  },
  create: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Category create GET");
  },
  update: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Category update GET");
  },
  delete: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Category delete GET");
  },
  detail: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Category detail GET");
  },
  createPost: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Category create POST");
  },
  updatePost: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Category update POST");
  },
  deletePost: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Category delete POST");
  },
};

export { CategoryController };
