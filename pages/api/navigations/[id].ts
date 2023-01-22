import Navigation from '@/data/models/Navigation';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const {id} = req.query;

    const POST = async () => {
        const obj = await Navigation.updateOne({_id:id}, {
            updated: Date.now,
            title: req.body.title
        });

        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { POST });
}
