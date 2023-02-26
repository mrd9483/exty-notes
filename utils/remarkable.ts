import { Remarkable, ItemResponse } from 'remarkable-typescript';

export default class RemarkableClient {

    static async register(code: string): Promise<string> {
        const client = new Remarkable();
        const deviceToken = await client.register({ code });

        return deviceToken;
    }
}

console.log(RemarkableClient.register('avwtmjon'));
