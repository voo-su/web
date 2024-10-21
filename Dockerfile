FROM alpine:3.20 AS builder

RUN apk --no-cache add nodejs yarn

ENV PATH /usr/src/node_modules/.bin:$PATH

WORKDIR /usr/src/voo-su

COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build-only

FROM alpine:3.20

RUN apk --no-cache add nginx

COPY --from=builder /usr/src/voo-su/dist /usr/share/nginx/html

COPY --from=builder /usr/src/voo-su/docker-nginx-default.conf /etc/nginx/http.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
