import M from '@/data/models/Task';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal, { GetByIdGlobal, saveApiGlobal } from '../../../utils/apiGlobal';
import mongoose from 'mongoose';
import ApiError from '@/utils/errors/ApiError';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id } = req.query;

    const GET = GetByIdGlobal<typeof M>(M, res, id as string, 'taskType');

    const POST = async () => {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError('Id is not fomatted correctly', 400);
        }

        const { setComplete } = req.query;

        if (setComplete) {
            const n = await M.findOne({ _id: id });
            if (n !== null) {
                n.isComplete = !n.isComplete;
                if (n.isComplete) {
                    n.dateCompleted = new Date();
                } else {
                    n.dateCompleted = null;
                }

                saveApiGlobal(n, res);
            } else {
                res.status(404);
            }
        } else {
            throw new ApiError('Method not allowed', 405);
        }
    };

    await apiGlobal(req, res, { GET, POST });
}
