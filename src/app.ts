import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes";
import { errorHandler, rateLimiter } from "./middlewares";
import { ApiError } from "./utils";

const app = express();

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new ApiError({
            statusCode: 403,
            code: "FORBIDDEN",
            message: "Forbidden by CORS policy",
          })
        );
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimiter());

// default route
app.get("/", (req, res) => {
  res.send("Welcome to Cloud-IO!");
});

// api routes
app.use("/api", router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  throw new ApiError({
    statusCode: 404,
    code: "NOT_FOUND",
    message: "Route not found",
  });
});

// error handler
app.use(errorHandler);

export default app;
