import { NextApiRequest, NextApiResponse } from 'next';
import ApiError from './errors/ApiError';
import mongoose, { CallbackError, Document, Error, Model } from 'mongoose';
import ResourceNotFoundError from './errors/ResourceNotFoundError';

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

function GetByIdGlobal<T>(model: Model<T>, res: NextApiResponse, id: string, ...populate: string[]) {
    return async () => {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError('Id is not fomatted correctly', 400);
        }

        const obj = await model.findOne({ _id: id }).populate(populate);

        if (obj !== null) {
            res.status(200).json(obj);
        } else {
            throw new ResourceNotFoundError();
        }
    };
}

function saveApiGlobal<T>(model: Document<T>, res: NextApiResponse) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model.save((err: CallbackError, obj: any) => {
        if (err instanceof Error.ValidationError) handleValidationError(err, res);
        else res.status(200).json(obj);
    });
}

function globalDelete<T>(model: Model<T>, res: NextApiResponse, id: string) {
    return async () => {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new ApiError('Id is not fomatted correctly', 400);
        }

        const obj = await model.deleteOne({ _id: id });

        res.status(200).json(obj);
    };
}

function handleValidationError(err: Error.ValidationError, res: NextApiResponse) {
    const messages = [];
    for (const field in err.errors) {
        messages.push(err.errors[field].message);
    }
    res.status(422).json({ messages });
}

export { saveApiGlobal, GetByIdGlobal, globalDelete, handleValidationError };
