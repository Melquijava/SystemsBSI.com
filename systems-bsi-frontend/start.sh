#!/bin/sh

# Inicia o PHP-FPM em segundo plano (daemon)
php-fpm -D

# Inicia o Nginx em primeiro plano (foreground)
# Este comando mantém o container rodando
nginx -g "daemon off;"