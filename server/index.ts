import { app } from "./src/app.js";
import { prisma } from "./src/config/prisma.js";

const PORT = 5000;

const start = async() : Promise<void> => {
    try{
        await prisma.$connect();
        console.log(" Connected to DB");

        app.listen(PORT, () => {
            console.log(`: Task Board running at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error(' Failed to connect to DB', error);
        process.exit(1);
    }
};

void start();