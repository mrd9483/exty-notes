import Navigation from '@/data/models/Navigation';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { userId } = req.query;

    const GET = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (userId !== null) {
            query.user = userId;
        }

        const obj = await Navigation.find(query).exec();
        res.status(200).json(obj);
    };

    const PUT = async () => {
        const obj = new Navigation(req.body);
        await obj.save();

        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET, PUT });
}
