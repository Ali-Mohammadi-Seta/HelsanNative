# build environment
FROM nexus-registry.picsepehr.org/node/node:20.19.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./

ARG VITE_SOCKET_DOMAIN
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_BEHDASHT_CALLBACK_URL
ENV VITE_BEHDASHT_CALLBACK_URL=$VITE_BEHDASHT_CALLBACK_URL
ARG VITE_PROJECT_VERSION
ENV VITE_PROJECT_VERSION=$VITE_PROJECT_VERSION

RUN yarn install --frozen-lockfile 
COPY . ./
RUN yarn build

# production environment
FROM nexus-registry.picsepehr.org/nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

