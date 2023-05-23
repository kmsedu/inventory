import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

async function getCategory(
  categoryList: Prisma.CategoryGetPayload<{ include: { items: true } }>[],
  searchTerm: string,
  next: NextFunction
) {
  const target = categoryList.find((category) => category.id === searchTerm);

  if (!target || target === null) {
    return next(new Error("No category matches this ID"));
  }

  return target;
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

  if (!categories || categories.length === 0) {
    const e = new Error("No categories found in DB");
    next(e);
    return;
  }

  switch (pageType) {
    case "detail": {
      const category = await getCategory(categories, req.params.id, next).catch(
        (e) => next(e)
      );
      if (category) {
        res.render("category_detail", { title: category.name, category });
      }
      break;
    }
    case "list": {
      const itemCounts = categories.map((category) => {
        return category.itemIds.length;
      });

      res.render("category_list", {
        title: "Category List",
        categories,
        itemCounts,
      });
      break;
    }
    case "create": {
      res.render("category_create", { title: "Category create" });
      break;
    }
    case "update": {
      const category = await getCategory(categories, req.params.id, next);
      res.render("category_create", {
        title: "Category Update",
        category,
      });
      break;
    }
    case "delete": {
      const category = await getCategory(categories, req.params.id, next).catch(
        (e) => next(e)
      );

      if (category && category.items.length > 0) {
        const e = new Error(
          "Cannot delete category, category still contains items"
        );
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
