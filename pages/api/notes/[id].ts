import M from '@/data/models/Note';

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

        const n = await M.findOne({ _id: id });
        if (n !== null) {
            n.updated = new Date();
            n.note = req.body.note ?? n.note;
            n.slug = req.body.slug ?? n.slug;
            n.title = req.body.title ?? n.title;
            
            res.status(200).json(await n.save());
        } else {
            res.status(404);
        }
    };

    const DELETE = async () => {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError('Id is not fomatted correctly', 400);
        }

        const obj = await M.updateOne({ _id: id }, {
            active: false,
        });

        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET, POST, DELETE });
}
