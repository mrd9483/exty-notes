import M from '@/data/models/TimeEntry';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id, dateFrom, dateTo } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { user: id };

    if (dateFrom !== undefined && dateTo !== undefined) {
        query.date = { $gte: dateFrom, $lte: dateTo };
    }

    const GET = async () => {
        const obj = await M.find(query).sort('date').exec();
        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET });
}
