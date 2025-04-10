import express from "express";
import cors from "cors";
import t from "./Routes/users.js";


const app = express();

app.use(express.json());
app.use(cors());

app.use('/', t);

app.listen(8801);