import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

function handleErrors(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.code && error.code.includes("PUG")) {
    res.render("error", { title: "Pug compilation error", error });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2023": {
        console.error(error.message);

        const requestId = req.path.slice(req.path.lastIndexOf("/") + 1);
        error.message = `Invalid ID: ${requestId} - Unable to get page information.`;

        res.render("error", {
          title: error.name,
          error,
        });
      }
    }
  }
  res.redirect("/404");
}

export { handleErrors };
