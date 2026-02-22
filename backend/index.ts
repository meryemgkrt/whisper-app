import app from "./src/app";
import { connectDB } from "./src/config/database";
import { createServer } from "http"
import { initializeSocket } from "./src/utils/sockets";


const PORT = process.env.PORT || 5000;

const server = createServer(app);

initializeSocket(server)

connectDB()
.then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

})
.catch((err)=>{
    console.error("Failed to connect to the database", err);
    process.exit(1);
});
    