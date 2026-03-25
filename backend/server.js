const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// 🛡️ THE KEY: Normally an RSA Public Key, but we'll use it for HS256 confusion
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFwwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE9I6vYpSdg9S9I6vYpSdg9S9I6vYp
Sdg9S9I6vYpSdg9S9I6vYpSdg9S9I6vYpSdg9S9I6vYpSdg9S9I6vYpSdg9A==
-----END PUBLIC KEY-----`;

// 🔓 Endpoint to "leak" the public key
app.get('/static/pub.pem', (req, res) => res.send(PUBLIC_KEY));

const authenticate = (req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  if (!token) return { role: 'guest' };

  try {
    // 🧨 VULNERABILITY #1: ALGORITHM CONFUSION
    // We don't specify ['RS256']. If the attacker changes the header to 'HS256',
    // jwt.verify will treat the PUBLIC_KEY string as a symmetric HMAC secret.
    return jwt.verify(token, PUBLIC_KEY); 
  } catch (e) {
    return { role: 'guest' };
  }
};

const typeDefs = gql`
  type Query {
    _internal_vault(resourceId: String!): String
    sys_health: String
  }
`;

const resolvers = {
  Query: {
    sys_health: () => "v5.2.1-hardened. Public Key Registry active at /static/pub.pem",
    
    _internal_vault: (_, { resourceId }, context) => {
      if (context.user.role !== 'admin') throw new Error("Forbidden: Elevated access required.");

      // 🧨 VULNERABILITY #2: RECURSIVE FILTER BYPASS
      // We "sanitize" by removing ../ once. 
      // Attacker uses "....//" which becomes "../" after one pass.
      let sanitized = resourceId.replace(/\.\.\//g, ""); 

      try {
        const targetPath = path.join(__dirname, 'logs', sanitized);
        return fs.readFileSync(targetPath, 'utf8');
      } catch (err) {
        return "ERROR: Resource isolated or missing.";
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: false, // 🔒 HIDDEN: Forces participants to find queries in frontend code
  context: ({ req }) => ({ user: authenticate(req) })
});

async function start() {
  await server.start();
  server.applyMiddleware({ app });
  app.listen(4000, () => console.log('🚀 Hardened Backend @ Port 4000'));
}
start();