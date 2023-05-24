import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

async function getAllItems(next: NextFunction) {
  return await prisma.item.findMany().catch((e) => next(e));
}

async function getAllCategories(next: NextFunction) {
  return await prisma.category.findMany().catch((e) => next(e));
}

async function getItem(id: string, next: NextFunction, categories?: boolean) {
  if (!!categories) {
    return await prisma.item
      .findUnique({ where: { id }, include: { categories: true } })
      .catch((e) => next(e));
  }
  return await prisma.item.findUnique({ where: { id } }).catch((e) => next(e));
}

async function getPage(
  req: Request,
  res: Response,
  next: NextFunction,
  pageType: string
) {
  switch (pageType) {
    case "index": {
      const items = await getAllItems(next);
      const categories = await getAllCategories(next);

      res.render("index", { title: "Home Page", items, categories });
      break;
    }
    case "list": {
      const items = await getAllItems(next);

      res.render("item_list", {
        title: "Item List",
        items,
      });
      break;
    }
    case "detail": {
      const item = await getItem(req.params.id, next, true);

      if (item !== null && item !== undefined) {
        res.render("item_detail", {
          title: item.name,
          item,
        });
      }
      break;
    }
    case "create": {
      const categories = await getAllCategories(next);

      res.render("item_create", {
        title: "Create item",
        categories,
      });
      break;
    }
    case "update": {
      const categories = await getAllCategories(next);
      const item = await getItem(req.params.id, next, true);

      res.render("item_create", {
        title: "Update item",
        categories,
        item,
      });
      break;
    }
    case "delete": {
      const item = await getItem(req.params.id, next);

      if (item !== null && item !== undefined) {
        res.render("item_delete", {
          title: `Delete item: ${item.name}`,
          item,
        });
      }
    }
    default:
  }
}

const ItemController = {
  index: async function (req: Request, res: Response, next: NextFunction) {
    await getPage(req, res, next, "index");
  },
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
    res.send("Item create POST");
  },
  updatePost: async function (req: Request, res: Response, next: NextFunction) {
    res.send("Item update POST");
  },
  deletePost: async function (req: Request, res: Response, next: NextFunction) {
    res.send("Item delete POST");
  },
};

export { ItemController };
