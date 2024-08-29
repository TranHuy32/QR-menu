import { Router } from "express";
import { getchatBot } from "../../../services/chatBotClientServices";

const route = Router();

const chatBotRoutes = (app) => {
    app.use("/chat", route);
    route.post("/", async (req, res, next) => {
        try {
            const chatBot = await getchatBot(req);
            res.status(200).json({ status: 200, chatBot: chatBot });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "no chat bot" });
        }
    })
}
export default chatBotRoutes

