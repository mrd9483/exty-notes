// @ts-check

/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withAxiom } = require('next-axiom');

const nextConfig = withAxiom({
  reactStrictMode: true,
});

module.exports = nextConfig;
