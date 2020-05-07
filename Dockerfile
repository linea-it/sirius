FROM node:8.10 as builder

COPY . /app

WORKDIR /app

RUN yarn -v

RUN yarn --ignore-optional

RUN yarn run build


# Ngnix
FROM nginx:latest

# Make /var/cache/nginx/ writable by non-root users
RUN chgrp nginx /var/cache/nginx/
RUN chmod -R g+w /var/cache/nginx/

# Write the PID file to a location where regular users have write access.
RUN sed --regexp-extended --in-place=.bak 's%^pid\s+/var/run/nginx.pid;%pid /var/tmp/nginx.pid;%' /etc/nginx/nginx.conf

COPY --from=builder /app/build /var/www/developer-interface
RUN chgrp nginx /var/www/developer-interface
RUN chmod -R g+w /var/www/developer-interface

USER nginx