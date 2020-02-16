FROM nginx
COPY /build/ /var/share/nginx/html
EXPOSE 80/tcp
