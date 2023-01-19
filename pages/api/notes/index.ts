import Note from '@/data/models/Note'
import type { NextApiRequest, NextApiResponse } from 'next'
import DbConnection from '@/data/DbConnection'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await DbConnection();
    switch (req.method) {
        case "GET":
            const notes = await Note.find({}).populate('user');
            res.status(200).json(notes);
        case "PUT":
            try {
                const newNote = new Note(JSON.parse(req.body));
                await newNote.save();

                res.status(200).json(newNote);
            } catch (error) {
                res.status(500);
                throw new Error("Save for note failed" + error);
            }
        default:
            res.status(405);
    }
}
