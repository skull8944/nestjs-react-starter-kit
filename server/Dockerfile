FROM node:22.12.0-slim

ENV LANG=C.UTF-8 \
  TZ=Asia/Taipei

WORKDIR /app

COPY . .

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl nginx

ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# prisma section
RUN npm run prisma:generate

# 創建所需的 nginx 目錄並設置權限
RUN mkdir -p /var/log/nginx /var/lib/nginx /var/lib/nginx/tmp /run/nginx /etc/nginx/conf.d \
  && chmod -R 777 /var/log/nginx /var/lib/nginx /run/nginx /etc/nginx /var/lib/nginx/tmp /etc/nginx/conf.d

COPY nginx.conf /etc/nginx/nginx.conf

RUN chmod +x /app/entrypoint.sh

EXPOSE 8080/tcp

# CMD sh -c "npm run prisma:deploy && npm run start:prod"
CMD ["/bin/sh", "-c", "nginx && ./entrypoint.sh"]
