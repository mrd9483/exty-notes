import DbConnection from '@/data/DbConnection';
import M from '@/data/models/Template';

import apiGlobal, { GetByIdGlobal, globalDelete } from '@/utils/apiGlobal';
import ApiError from '@/utils/errors/ApiError';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id } = req.query;

    const GET = GetByIdGlobal<typeof M>(M, res, id as string);
    const DELETE = globalDelete<typeof M>(M, res, id as string);

    const POST = async () => {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError('Id is not fomatted correctly', 400);
        }

        const obj = await M.updateOne({ _id: id }, {
            updated: Date.now(),
            shortcut: req.body.shortcut,
            template: req.body.template
        });

        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET, POST, DELETE });
}
