import Navigation from '@/data/models/Navigation';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await DbConnection();
    switch (req.method) {
        case 'GET': {
            const obj = await Navigation.find({}).populate('user');
            res.status(200).json(obj);
            break;
        }
        case 'PUT':
            try {
                const obj = new Navigation(JSON.parse(req.body));
                await obj.save();

                res.status(200).json(obj);
            } catch (error) {
                res.status(500);
                throw new Error('Save for note failed' + error);
            }
            break;
        default:
            res.status(405);
    }
}
