import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  body,
  validationResult,
  type ValidationError,
} from "express-validator";
import { id } from "./item_controller";
import { ObjectId } from "bson";
import validator from "validator";

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
  pageType: string,
  validationErrors?: ValidationError[]
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
          category.description = validator.unescape(category.description);
          res.render("category_detail", {
            title: category.name,
            category,
          });
        }
        break;
      }
      case "list": {
        const categories = await getAllCategories(next);

        if (categories !== null && categories !== undefined) {
          for (const category of categories) {
            category.description = validator.unescape(category.description);
          }
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
        id.string = new ObjectId().toString();
        if (validationErrors && validationErrors.length > 0) {
          const newCategory = {
            name: req.body.name,
            description: req.body.description,
          };

          res.render("category_create", {
            title: "Create category",
            category: newCategory,
            validationErrors,
          });
          return;
        } else {
          res.render("category_create", { title: "Category create" });
        }
        break;
      }
      case "update": {
        if (validationErrors && validationErrors.length > 0) {
          const newCategory = {
            name: req.body.name,
            description: req.body.description,
          };

          res.render("category_create", {
            title: "Update Category",
            category: newCategory,
            validationErrors,
          });
        }
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
        res.render("category_delete", { title: "Delete Category", category });
        break;
      }
      case "createPost": {
        await prisma.category.create({
          data: {
            name: req.body.name,
            description: req.body.description,
          },
        });

        res.redirect("/categories");
        break;
      }
      case "updatePost": {
        await prisma.category.update({
          where: {
            id: req.params.id,
          },
          data: {
            name: req.body.name,
            description: req.body.description,
          },
        });

        res.redirect("/categories");
        break;
      }
      case "deletePost": {
        await prisma.category
          .delete({
            where: {
              id: req.params.id,
            },
          })
          .catch((e) => next(e));

        res.redirect("/categories");
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
  createPost: [
    body("name", "Name can not be empty").trim().notEmpty().escape(),
    body("description", "Description can not be empty")
      .trim()
      .notEmpty()
      .escape(),

    async function (req: Request, res: Response, next: NextFunction) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await getPage(req, res, next, "create", errors.array());
      } else {
        await getPage(req, res, next, "createPost");
      }
    },
  ],
  updatePost: [
    body("name", "Name can not be empty").trim().notEmpty().escape(),
    body("description", "Description can not be empty")
      .trim()
      .notEmpty()
      .escape(),

    async function (req: Request, res: Response, next: NextFunction) {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        await getPage(req, res, next, "update", errors.array());
      } else {
        await getPage(req, res, next, "updatePost");
      }
    },
  ],
  deletePost: async function (req: Request, res: Response, next: NextFunction) {
    await getPage(req, res, next, "deletePost");
  },
};

export { CategoryController };
