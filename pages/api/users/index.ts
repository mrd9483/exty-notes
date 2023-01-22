import User from '@/data/models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import DbConnection from '@/data/DbConnection';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await DbConnection();
    switch (req.method) {
        case 'GET': {
            const users = await User.find({});
            res.status(200).json(users);
            break;
        }
        case 'PUT':
            try {
                const newUser = new User(JSON.parse(req.body));
                await newUser.save();

                res.status(200).json(newUser);
            } catch (error) {
                res.status(500);
                throw new Error('Save for user failed: ' + error);
            }
            break;
        default:
            res.status(405);
    }
}
