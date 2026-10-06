FROM node:20-alpine

WORKDIR /app

COPY monolith/package.json ./
RUN npm install --omit=dev

COPY monolith/*.js ./

RUN mkdir /data && chown node /data

ENV PORT=8080
ENV DATA_DIR=/data

EXPOSE 8080

USER node

CMD ["node", "server.js"]