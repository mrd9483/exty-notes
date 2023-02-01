import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        EmailProvider({
            server: {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            },
            from: process.env.SMTP_FROM,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    session: {
        strategy: 'jwt',
    },
    logger: {
        error(code, metadata) {
            console.log({ type: 'inside error logger', code, metadata });
        },
        warn(code) {
            console.log({ type: 'inside warn logger', code });
        },
        debug(code, metadata) {
            console.log({ type: 'inside debug logger', code, metadata });
        },
    },
    callbacks: {
        async session({ session, user, token }) {
            console.log(session);
            console.log(token);

            session.userId = token.sub;
            session.userEmail = token.email;

            return session;
        }
    }
};
