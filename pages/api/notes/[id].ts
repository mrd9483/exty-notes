import M from '@/data/models/Note';

import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../utils/apiGlobal';
import ResourceNotFoundError from '@/utils/errors/ResourceNotFoundError';
import ApiError from '@/utils/errors/ApiError';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id } = req.query;



    const GET = async () => {

        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError('Id is not fomatted correctly', 400);
        }

        const obj = await M.findOne({ _id: id });

        if (obj !== null) {
            res.status(200).json(obj);
        } else {
            throw new ResourceNotFoundError();
        }
    };

    const POST = async () => {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError('Id is not fomatted correctly', 400);
        }

        const obj = await M.updateOne({ _id: id }, {
            updated: Date.now,
            note: req.body.note,
            slug: req.body.slug,
            user: req.body.user,
            title: req.body.title
        });

        res.status(200).json(obj);
    };

    await apiGlobal(req, res, { GET, POST });
}
