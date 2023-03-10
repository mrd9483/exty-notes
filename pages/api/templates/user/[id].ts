import M from '@/data/models/Template';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id } = req.query;

    const GET = async () => {
        const obj = await M.find({ user: id }).exec();
        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET });
}
