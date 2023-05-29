import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    if (!req.headers.referer) {
      cb(null, "error.png");
    } else {
      const refUrl = new URL(req.headers.referer);
      const id = refUrl.pathname.slice(6, refUrl.pathname.lastIndexOf("/"));

      cb(null, `${id}.png`);
    }
  },
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
});

const upload = multer({ storage: storage });
const app = express();

const UploadController = {
  post: app.post(
    "/upload",
    upload.single("image"),
    function (req: Request, res: Response, next: NextFunction) {
      console.log(req.file?.filename);
    }
  ),
};

export { UploadController };
