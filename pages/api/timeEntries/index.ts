import M from '@/data/models/TimeEntry';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal, { handleValidationError } from '../../../utils/apiGlobal';
import { Error } from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const GET = async () => {
        const obj = await M.find({}).populate('user');
        res.status(200).json(obj);
    };

    const PUT = async () => {
        const obj = new M(req.body);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await obj.save((err: Error.ValidationError, obj: any) => {
            if (err instanceof Error.ValidationError) handleValidationError(err, res);
            else res.status(200).json(obj);
        });
    };

    await apiGlobal(req, res, { GET, PUT });
}
