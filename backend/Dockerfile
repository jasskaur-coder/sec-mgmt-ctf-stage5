FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN chown -R node:node /usr/src/app
USER node
EXPOSE 4000
CMD ["node", "server.js"]
