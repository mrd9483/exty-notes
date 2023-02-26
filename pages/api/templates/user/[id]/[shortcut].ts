import M from '@/data/models/Template';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';
import apiGlobal from '../../../../../utils/apiGlobal';
import ResourceNotFoundError from '@/utils/errors/ResourceNotFoundError';

//api/templates/[userId]/[shortcut]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await DbConnection();

    const { id, shortcut } = req.query;

    const GET = async () => {

        const obj = await M.findOne({ user: id, shortcut }).exec();
        if (obj !== null) {
            res.status(200).json(obj);
        } else {
            throw new ResourceNotFoundError();
        }
    };

    await apiGlobal(req, res, { GET });
}
