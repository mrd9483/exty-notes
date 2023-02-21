import M from '@/data/models/Note';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id, titlesOnly } = req.query;

    const GET = async () => {

        const proj = titlesOnly ? { title: true } : {};
        const obj = await M.find({ user: id, active: true }, proj).exec();
        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET });
}
