import M from '@/data/models/Task';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal, { saveApiGlobal } from '../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const GET = async () => {
        const { incompletedOnly } = req.query;
        const query = { isComplete: { $ne: true } };

        const obj = await M.find(incompletedOnly === 'true' ? query : {}).populate('user');
        res.status(200).json(obj);
    };

    const PUT = async () => { saveApiGlobal<typeof M>(new M(req.body), res); };

    await apiGlobal(req, res, { GET, PUT });
}
