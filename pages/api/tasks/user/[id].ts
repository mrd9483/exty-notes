import M from '@/data/models/Task';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id, incompletedOnly } = req.query;

    const GET = async () => {
        const obj = await M.find({ user: id, isComplete: { $ne: incompletedOnly === 'true' } }).exec();
        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET });
}
