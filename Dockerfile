FROM node:22-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY app ./app
USER node
EXPOSE 5001
CMD ["node", "app/server.js"]
