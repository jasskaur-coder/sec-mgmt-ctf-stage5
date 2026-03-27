const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const FLAG = "FLAG{jwt_kid_confusion_and_recursive_bypass_2026}";

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFwwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE9I6vYpSdg9S9I6vYpSdg9S9I6vYp
Sdg9S9I6vYpSdg9S9I6vYpSdg9S9I6vYpSdg9S9I6vYpSdg9S9I6vYpSdg9A==
-----END PUBLIC KEY-----`;

const typeDefs = gql`
  type Query {
    sys_health: String!
    _internal_vault(resourceId: String!): String
  }
`;

const resolvers = {
  Query: {
    sys_health: () => "v5.2.1-hardened. PKI established. See /static/pub.pem for verification.",
    
    _internal_vault: (_, { resourceId }, context) => {
      
      if (!context.user || context.user.role !== 'admin') {
        throw new Error("Forbidden: Elevated access required.");
      }

      let sanitized = resourceId.replace(/\.\.\//g, ""); 

      try {
        const targetPath = path.join(__dirname, 'logs', sanitized);
        return fs.readFileSync(targetPath, 'utf8');
      } catch (err) {
        return `ERROR: Resource not found at ./logs/${sanitized}. Note: Static secret files are deprecated; flags are now in system_secrets.txt`;
      }
    }
  }
};

const authMiddleware = (req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) return { user: { role: 'guest' } };

  try {
    const decodedToken = jwt.decode(token, { complete: true });
  
    if (!decodedToken || !decodedToken.header || decodedToken.header.kid !== 'v5_legacy_key') {
      return { user: { role: 'guest' } };
    }
    const verifiedUser = jwt.verify(token, PUBLIC_KEY);
    return { user: verifiedUser };
  } catch (err) {
    return { user: { role: 'guest' } };
  }
};

async function startServer() {
  const app = express();
  app.use(cors({
    exposedHeaders: ['X-System-Notice']
  }));

  app.use((req, res, next) => {
    res.setHeader('X-System-Notice', 'Legacy Auth Active: kid "v5_legacy_key" required for vault access.');
    next();
  });

  app.get('/static/pub.pem', (req, res) => {
    res.type('text/plain');
    res.send(PUBLIC_KEY);
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => authMiddleware(req),
    introspection: true 
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
  
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

    fs.writeFileSync(path.join(__dirname, 'system_secrets.txt'), `--- INTERNAL VAULT ---\nACCESS_LEVEL: ADMIN\nFLAG: ${FLAG}`);
  
    console.log(`\n🚀 CSC_NITJ CTF Server Running`);
    console.log(`🔗 Backend: http://localhost:4000/graphql`);
  });
}

startServer();
