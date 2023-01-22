import mongoose from 'mongoose';

const DbConnection = async () => mongoose.connect(process.env.DATABASE_URL);

export default DbConnection;
