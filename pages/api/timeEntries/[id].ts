import M from '@/data/models/TimeEntry';

import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal, { GetByIdGlobal } from '../../../utils/apiGlobal';
import ApiError from '@/utils/errors/ApiError';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id } = req.query;

    const GET = GetByIdGlobal<typeof M>(M, res, id as string);

    const POST = async () => {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError('Id is not fomatted correctly', 400);
        }

        const obj = await M.updateOne({ _id: id }, {
            updated: Date.now,
            entry: req.body.entry,
            date: req.body.date,
            user: req.body.user,
            hours: req.body.hours,
        });

        res.status(200).json(obj);
    };

    const DELETE = async () => {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError('Id is not fomatted correctly', 400);
        }

        const obj = await M.deleteOne({ _id: id });

        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET, POST, DELETE });
}
