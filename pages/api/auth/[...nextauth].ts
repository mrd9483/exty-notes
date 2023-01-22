import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
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
