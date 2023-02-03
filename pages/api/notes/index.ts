import Notes from '@/data/models/Note';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const GET = async () => {
        const obj = await Notes.find({}).populate('user');
        res.status(200).json(obj);
    };

    const PUT = async () => {
        const obj = new Notes(req.body);
        obj.active = true;
        await obj.save();

        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET, PUT });
}
