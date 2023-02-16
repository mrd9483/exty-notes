import M from '@/data/models/Navigation';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id } = req.query;

    const GET = async () => {
        const obj = await M.findOne({ user: id }).exec();
        res.status(200).json(obj);
    };

    const PATCH = async () => {
        const obj = await M.findOne({ user: id }).exec();
        if (obj !== null) {
            obj.notes.push({ note: req.body.note, title: req.body.title });
            obj.save();
        }

        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET, PATCH });
}
