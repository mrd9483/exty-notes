import M from '@/data/models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal, { GetByIdGlobal } from '../../../utils/apiGlobal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id } = req.query;

    const GET = GetByIdGlobal<typeof M>(M, res, id as string);

    const POST = async () => {
        const obj = await M.updateOne({ _id: id }, {
            updated: Date.now,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            active: req.body.active,
        });

        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET, POST });
}
