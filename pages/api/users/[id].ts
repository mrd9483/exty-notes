import User from '@/data/models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../utils/apiGlobal';
import ResourceNotFoundError from '@/utils/errors/ResourceNotFoundError';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id } = req.query;

    const GET = async () => {
        const obj = await User.findOne({ _id: id });

        if (obj !== null) {
            res.status(200).json(obj);
        } else {
            throw new ResourceNotFoundError();
        }
    };

    const POST = async () => {
        const obj = await User.updateOne({ _id: id }, {
            updated: Date.now,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            active: req.body.active
        });

        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET, POST });
}
