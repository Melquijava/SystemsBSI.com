#!/bin/sh

# Inicia o PHP-FPM em segundo plano
php-fpm &

# Inicia o Nginx em primeiro plano, para que ele seja o processo principal do container
nginx -g "daemon off;"