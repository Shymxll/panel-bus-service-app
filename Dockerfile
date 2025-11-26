
# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /user/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /user/src/app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=build /user/src/app/dist ./dist

EXPOSE 6001

CMD ["npx", "serve", "-s", "dist", "-l", "6001"]