import express, { type Application, type NextFunction, type Request, type Response } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes/routes";
import notFound from "./app/middleware/notFound";
import { globalError } from "./app/middleware/globalError";


const app: Application = express();


app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router)

// app.use("/auth", AuthRouter)

app.get("/", (req: Request, res: Response) => {
     res.json("hello world");
});

app.use(notFound)
app.use(globalError)

export default app;