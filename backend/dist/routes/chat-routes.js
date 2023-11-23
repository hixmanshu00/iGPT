import { Router } from "express";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats, generateChatCompletion, sendChatsToUser } from "../controllers/chat-controllers.js";
const chatRoutes = Router();
chatRoutes.post("/new", validate(chatCompletionValidator), generateChatCompletion);
chatRoutes.get("/all-chats/:id", sendChatsToUser);
chatRoutes.delete("/delete/:id", deleteChats);
export default chatRoutes;
//# sourceMappingURL=chat-routes.js.map