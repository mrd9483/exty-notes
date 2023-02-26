import M from '@/data/models/Task';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id, returnComplete } = req.query;
    const completeClean = returnComplete ?? false;

    const GET = async () => {
        const obj = await M.find({ user: id, isComplete: completeClean }).exec();
        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET });
}
