# run environment
FROM nginx:stable-alpine
COPY build/ /usr/share/nginx/html/
# replace the default ngix config with the custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]