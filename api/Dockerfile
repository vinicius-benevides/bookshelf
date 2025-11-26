FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY .env.example ./

RUN npm run build
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3333

CMD ["node", "dist/server.js"]
