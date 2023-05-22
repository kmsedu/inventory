import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { wrap } from "module";

const prisma = new PrismaClient();

const CategoryController = {
  detail: async function(req: Request, res: Response, next: NextFunction) {
    if (req.params.id === null) {
      const err = new Error("No ID parameter found in URL");
      const httpError = { ...err, status: 200 };
      next(httpError);
    }

    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });

    if (category !== null) {
      res.render("category_detail", {
        title: category.name,
        category,
      });
    }
  },
  list: async function(req: Request, res: Response, next: NextFunction) {
    const categories = await prisma.category.findMany();

    if (categories.length !== 0) {
      const itemCounts = categories.map((category) => {
        return category.itemIds.length;
      });

      res.render("category_list", {
        title: "Category List",
        categories,
        itemCounts,
      });
      return;
    }

    const err = new Error("Categories not found");
    const httpError = { ...err, status: 404 };

    next(httpError);
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
