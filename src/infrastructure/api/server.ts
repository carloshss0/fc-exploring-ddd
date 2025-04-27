import { app } from "./express";
import dotenv from "dotenv";

dotenv.config();

const port: number = Number(process.env.Port) || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
