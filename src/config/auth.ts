export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default',
    expiresInShort: '1d',
    expiresInNever: '999 years',
  },
};
