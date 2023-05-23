import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

async function getCategory(id: string, next: NextFunction) {
  return await prisma.category
    .findUnique({ where: { id }, include: { items: true } })
    .catch((e) => next(e));
}

async function getAllCategories(next: NextFunction) {
  return await prisma.category
    .findMany({ include: { items: true } })
    .catch((e) => next(e));
}

async function getPage(
  req: Request,
  res: Response,
  next: NextFunction,
  pageType: string
) {
  const categories = await prisma.category
    .findMany({
      include: {
        items: true,
      },
    })
    .catch((e) => next(e));

  if (categories !== null && categories !== undefined) {
    switch (pageType) {
      case "detail": {
        const category = await getCategory(req.params.id, next);

        if (category !== null && category !== undefined) {
          res.render("category_detail", { title: category.name, category });
        }
        break;
      }
      case "list": {
        const categories = await getAllCategories(next);

        if (categories !== null && categories !== undefined) {
          const itemCounts = categories.map((category) => {
            return category.itemIds.length;
          });

          res.render("category_list", {
            title: "Category List",
            categories,
            itemCounts,
          });
        }
        break;
      }
      case "create": {
        res.render("category_create", { title: "Category create" });
        break;
      }
      case "update": {
        const category = await getCategory(req.params.id, next);

        if (category !== null && category !== undefined) {
          res.render("category_create", {
            title: "Category Update",
            category,
          });
        }
        break;
      }
      case "delete": {
        const category = await getCategory(req.params.id, next);

        if (category && category.items.length > 0) {
          const e = new Error("Category still contains items");
          res.render("category_detail", {
            title: category.name,
            category,
            error: e,
          });
          return;
        }
        res.render("category_delete", { title: "Delete Category" });
        break;
      }
      default:
    }
  }
}

const CategoryController = {
  detail: async function (req: Request, res: Response, next: NextFunction) {
    await getPage(req, res, next, "detail");
  },
  list: async function (req: Request, res: Response, next: NextFunction) {
    await getPage(req, res, next, "list");
  },
  create: async function (req: Request, res: Response, next: NextFunction) {
    await getPage(req, res, next, "create");
  },
  update: async function (req: Request, res: Response, next: NextFunction) {
    await getPage(req, res, next, "update");
  },
  delete: async function (req: Request, res: Response, next: NextFunction) {
    await getPage(req, res, next, "delete");
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
