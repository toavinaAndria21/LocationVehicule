import express from "express";
import router from "./routes/routes";
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.json());
app.use(router)

export default app;