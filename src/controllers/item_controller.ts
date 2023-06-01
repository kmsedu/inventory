import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import validator from "validator";
import { ObjectId } from "bson";
const prisma = new PrismaClient();

export const id = {
  string: new ObjectId().toString(),
};

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

async function getFormCategories(req: Request) {
  const formCategories = [];
  const selectedCategories = [];

  for (const key of Object.keys(req.body)) {
    if (
      key !== "name" &&
      key !== "description" &&
      key !== "price" &&
      key !== "id"
    ) {
      formCategories.push(key);
    }
  }

  for (const categoryName of formCategories) {
    const dbCategory = await prisma.category.findUnique({
      where: { name: categoryName },
    });
    if (dbCategory) {
      selectedCategories.push(dbCategory);
    }
  }

  return { formCategories, selectedCategories };
}

async function cleanCategories(itemId: string): Promise<void> {
  const categoriesToClean = await prisma.category.findMany({
    where: {
      itemIds: {
        hasSome: itemId,
      },
    },
  });

  const cleanCategories = categoriesToClean.map((cat) => {
    cat.itemIds = cat.itemIds.filter((id) => {
      return id !== itemId;
    });
    return cat;
  });

  for (const cleanCategory of cleanCategories) {
    await prisma.category.update({
      where: {
        id: cleanCategory.id,
      },
      data: {
        itemIds: cleanCategory.itemIds,
      },
    });
  }
}

async function getPage(
  req: Request,
  res: Response,
  next: NextFunction,
  pageType: string
) {
  switch (pageType) {
    case "index": {
      id.string = new ObjectId().toString();
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

      if (item && item.description) {
        item.description = validator.unescape(item.description);
      }

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

      const newItem = {
        id: id.string.toString(),
      };

      res.render("item_create", {
        title: "Create item",
        categories,
        item: newItem,
      });
      break;
    }
    case "update": {
      const categories = await getAllCategories(next);
      const item = await getItem(req.params.id, next, true);

      if (item && item.description) {
        item.description = validator.unescape(item.description);
      }

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
  createPost: [
    body("name", "Name can not be empty").trim().notEmpty().escape(),
    body("price", "Price must be a float").toFloat().notEmpty(),
    body("description", "Description must not be empty")
      .trim()
      .notEmpty()
      .escape(),

    async function (req: Request, res: Response, next: NextFunction) {
      const formCategories = await getFormCategories(req);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const newItem = {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          categories: formCategories.selectedCategories,
          categoryIds: formCategories.selectedCategories.map((cat) => cat.id),
          id: req.body.id,
        };

        res.render("item_create", {
          title: "Create item",
          item: newItem,
          categories: await getAllCategories(next),
          errors: errors.array(),
        });
      } else {
        const categoryIds = formCategories.selectedCategories.map(
          (cat) => cat.id
        );
        const connectIds = categoryIds.map((id) => {
          return { id };
        });

        console.log(connectIds);

        await prisma.item.create({
          data: {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            categoryIds,
            categories: {
              connect: connectIds,
            },
            id: req.body.id,
          },
        });

        id.string = new ObjectId().toString();
        res.redirect("/items");
      }
    },
  ],
  updatePost: [
    body("name", "Name can not be empty").trim().notEmpty().escape(),
    body("price", "Price must be a float").toFloat().notEmpty(),
    body("description", "Description must not be empty")
      .trim()
      .notEmpty()
      .escape(),

    async function (req: Request, res: Response, next: NextFunction) {
      const formCategories = await getFormCategories(req);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const newItem = {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          categoryIds: formCategories.selectedCategories.map((cat) => cat.id),
        };

        res.render("item_create", {
          title: "Update item",
          item: newItem,
          categories: await getAllCategories(next),
          errors: errors.array(),
        });
      } else {
        const categoryIds = formCategories.selectedCategories.map((cat) => {
          return cat.id;
        });

        await cleanCategories(req.params.id);

        await prisma.item.update({
          where: {
            id: req.params.id,
          },
          data: {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            categoryIds: categoryIds,
            categories: {
              updateMany: {
                where: {
                  id: {
                    in: categoryIds,
                  },
                },
                data: {
                  itemIds: {
                    push: req.params.id,
                  },
                },
              },
            },
          },
        });

        res.redirect("/items");
      }
    },
  ],
  deletePost: async function (req: Request, res: Response, next: NextFunction) {
    await cleanCategories(req.params.id);
    await prisma.item.delete({ where: { id: req.params.id } });

    res.redirect("/items");
  },
};

export { ItemController };
