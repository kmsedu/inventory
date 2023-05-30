import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import multer from "multer";

import fs from "fs";

const upload = multer({ dest: "public/images/" });
const app = express();

const UploadController = {
  post: app.post(
    "/upload",
    upload.single("image"),
    function (req: Request, res: Response, next: NextFunction) {
      if (req.file) {
        fs.rename(
          req.file.path,
          `${req.file.destination}${req.body.id}.png`,
          () => {}
        );
      }
      if (req.headers.referer) {
        res.redirect(req.headers.referer);
      } else {
        res.redirect("/");
      }
    }
  ),
};

export { UploadController };
