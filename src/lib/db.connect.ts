import mongoose from "mongoose";

type connectionObject = {
    isConected?: number;
};

const connection: connectionObject = {};

async function dbConnection(): Promise<void> {
    if (connection.isConected) {
        return;
    }

    try {
        const connect = await mongoose.connect(process.env.MONGO_DB as string);

        connection.isConected = connect.connections[0].readyState;
    } catch (error) {
        process.exit(1);
    }
}

export default dbConnection;
