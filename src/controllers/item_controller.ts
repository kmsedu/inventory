import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

const ItemController = {
  index: async function(req: Request, res: Response, next: NextFunction) {
    const items = await prisma.item.findMany({}).catch(next);
    const categories = await prisma.category.findMany({}).catch(next);

    res.render("index", {
      title: "Home page",
      items,
      categories,
    });
  },
  list: async function(req: Request, res: Response, next: NextFunction) {
    const items = await prisma.item.findMany({}).catch(next);

    res.render("item_list", {
      items,
    });
  },
  detail: async function(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    if (id === null) {
      const err = new Error("ID not found");
      next(err);
    }

    const item = await prisma.item.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
      },
    });

    if (item !== null) {
      res.render("item_detail", {
        title: item.name,
        item,
      });
    }
  },
  create: async function(req: Request, res: Response, next: NextFunction) {
    res.render("item_create", { title: "Item create" });
  },
  update: async function(req: Request, res: Response, next: NextFunction) {
    res.render("item_create", { title: "Item update" });
  },
  delete: async function(req: Request, res: Response, next: NextFunction) {
    res.render("item_delete", { title: "Confirm item deletion" });
  },
  createPost: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Item create POST");
  },
  updatePost: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Item update POST");
  },
  deletePost: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Item delete POST");
  },
};

export { ItemController };
