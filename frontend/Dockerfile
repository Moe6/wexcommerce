# syntax=docker/dockerfile:1

FROM node:lts-alpine AS build
WORKDIR /lebobeautyco/frontend
COPY ./frontend ./
COPY ./frontend/.env.docker .env
COPY ./packages /lebobeautyco/packages
RUN npm install --force
# Increase memory limit for Next.js build
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npm run build

CMD ["npm", "start"]
EXPOSE 8006
