import mongoose from "mongoose";


// * 0 = disconnected
// * 1 = connected
// * 2 = connecting
// * 3 = disconnecting

const mongoConnection = {
    isConnected: 0
}

export const connect = async () => {
    if (mongoConnection.isConnected) {
        console.log('connection already established');
        return;
    }
    if (mongoose.connections.length > 0) {
        mongoConnection.isConnected = mongoose.connections[0].readyState;
        if (mongoConnection.isConnected === 1) {
            console.log('connection already established');
            return;
        }
        await mongoose.disconnect();
    }
    await mongoose.connect(process.env.MONGODB_URI || '', {});
    mongoConnection.isConnected = 1;
    console.log('connection established, URI:', process.env.MONGODB_URI);
}

export const disconnect = async () => {
    if (process.env.NODE_ENV === 'development') return

    if (mongoConnection.isConnected === 0) {
        console.log('connection already disconnected');
        return;
    }
    await mongoose.disconnect();
    mongoConnection.isConnected = 0;
    console.log('connection disconnected');
}