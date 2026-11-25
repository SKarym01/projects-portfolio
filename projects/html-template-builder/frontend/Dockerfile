FROM node:20 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . /usr/src/app
RUN npm run build -- --base-href /

FROM nginx:1.27
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/custom-nginx.conf /etc/nginx/conf.d/
COPY --from=build /usr/src/app/dist/project/browser /usr/share/nginx/html

