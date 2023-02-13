import mongo from 'mongodb';
const { MongoClient } = mongo;

const MONGO_URL = process.env.MONGO_URL;

export const client = new MongoClient(MONGO_URL, { useNewUrlParser: true });

export async function connectDb() {
    try {
        await client.connect();
        // Confirm connection
        await client.db('admin').command({ ping: 1 });
        console.log('Connected to DB Success');
    } catch (e) {
        console.error(e);
        await client.close();
    }
}