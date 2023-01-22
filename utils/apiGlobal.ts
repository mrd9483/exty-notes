import { NextApiRequest, NextApiResponse } from 'next';
import ApiError from './errors/ApiError';

export default async function apiGlobal(req: NextApiRequest, res: NextApiResponse, actions: { [key: string]: () => Promise<void> }) {
    try {
        // check an action exists with request.method else throw method not allowed
        if (!Object.keys(actions).includes(req.method as string)) {
            console.log('method not allowed');
            throw new ApiError('Method not allowed', 405);
        }
        // run the action matching the request.method
        await actions[req.method as string]();
    } catch (err) {
        if (err instanceof ApiError) {
            res.status(err.errorCode).send(err.message);
        } else {
            res.status(500).send('Internal server error');
            console.error((err as Error));
        }
    }
}
