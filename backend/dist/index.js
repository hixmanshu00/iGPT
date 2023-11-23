import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
const PORT = process.env.PORT || 5000;
// connection and listeners
connectToDatabase().then(() => {
    app.listen(PORT, () => console.log('server open and connected to database'));
    app.get('/', (req, res) => {
        res.send('Chat API');
    });
}).catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map