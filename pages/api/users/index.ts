import User from '@/data/models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const GET = async () => {
        const obj = await User.find({});
        res.status(200).json(obj);
    };

    const PUT = async () => {
        const obj = new User(req.body);
        await obj.save();
 
        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET, PUT });
}
