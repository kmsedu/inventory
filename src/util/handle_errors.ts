import { Request, Response, NextFunction } from "express";

function handleErrors(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.message && error.message === "Invalid URL") {
    res.redirect("/404");
    next();
    return;
  }

  res.render("error", { title: "Error", error });
}

export { handleErrors };
