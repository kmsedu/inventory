import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const CategoryController = {
  detail: async function(req: Request, res: Response, next: NextFunction) {
    res.render("category_detail", { title: "Category Detail" });
  },
  list: async function(req: Request, res: Response, next: NextFunction) {
    res.render("category_list", { title: "Category List" });
  },
  create: async function(req: Request, res: Response, next: NextFunction) {
    res.render("category_create", { title: "Category create" });
  },
  update: async function(req: Request, res: Response, next: NextFunction) {
    res.render("category_create", { title: "Category update" });
  },
  delete: async function(req: Request, res: Response, next: NextFunction) {
    res.render("category_delete", { title: "Category delete" });
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
