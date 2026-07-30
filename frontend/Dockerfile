FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache gettext
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY config.js.template /usr/share/nginx/html/config.js.template
EXPOSE 80
CMD envsubst < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js && nginx -g 'daemon off;'
