import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

const CategoryController = {
  detail: async function (req: Request, res: Response, next: NextFunction) {
    const category = await prisma.category
      .findUnique({
        where: { id: req.params.id },
        include: { items: true },
      })
      .catch((e) => next(e));

    if (category !== null && category) {
      res.render("category_detail", {
        title: category.name,
        category,
      });
    }
  },
  list: async function (req: Request, res: Response, next: NextFunction) {
    const categories = await prisma.category.findMany().catch((e) => next(e));

    if (categories !== null && categories) {
      const itemCounts = categories.map((category) => {
        return category.itemIds.length;
      });

      res.render("category_list", {
        title: "Category List",
        categories,
        itemCounts,
      });
    }
  },
  create: async function (req: Request, res: Response, next: NextFunction) {
    res.render("category_create", { title: "Category create" });
  },
  update: async function (req: Request, res: Response, next: NextFunction) {
    res.render("category_create", { title: "Category update" });
  },
  delete: async function (req: Request, res: Response, next: NextFunction) {
    res.render("category_delete", { title: "Category delete" });
  },
  createPost: async function (req: Request, res: Response, next: NextFunction) {
    res.send("Category create POST");
  },
  updatePost: async function (req: Request, res: Response, next: NextFunction) {
    res.send("Category update POST");
  },
  deletePost: async function (req: Request, res: Response, next: NextFunction) {
    res.send("Category delete POST");
  },
};

export { CategoryController };
