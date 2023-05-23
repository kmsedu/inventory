import { Request, Response, NextFunction } from "express";

function handleErrors(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);

  if (error.message && error.message === "Invalid URL") {
    res.redirect("/404");
    next();
  }

  res.render("error", { title: "Error", error });
}

export { handleErrors };
