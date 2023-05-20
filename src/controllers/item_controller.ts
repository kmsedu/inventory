import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const ItemController = {
  index: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Index GET");
  },
  list: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Items list GET");
  },
  create: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Item create GET");
  },
  update: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Item update GET");
  },
  delete: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Item delete GET");
  },
  detail: async function(req: Request, res: Response, next: NextFunction) {
    res.send("Item detail GET");
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
