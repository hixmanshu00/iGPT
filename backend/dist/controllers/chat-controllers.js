import User from "../models/User.js";
import { configureOpenAI } from "../config/opnenai-config.js";
import { OpenAIApi } from "openai";
export const generateChatCompletion = async (req, res, next) => {
    const { message, id } = req.body;
    try {
        const user = await User.findById(id);
        if (!user)
            return res
                .status(401)
                .json({ message: "User not registered OR Token malfunctioned" });
        // grab chats of user
        const chats = user.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        // send all chats with new one to openAI API
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);
        // get latest response
        const chatResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chats,
        });
        user.chats.push(chatResponse.data.choices[0].message);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error.response);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).send("User not registered or token malfunctioned");
        }
        return res.status(200).json({ message: "ok", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(401).send("User not registered or token malfunctioned");
        }
        //@ts-ignore
        user.chats = [];
        user.save();
        return res.status(200).json({ message: "ok" });
    }
    catch (error) {
        return res.status(500).json({ message: "error", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map