#!/bin/sh

# Corrige permissões do socket do PHP-FPM, uma causa comum de erros 502.
# Esta etapa é preventiva mas muito importante.
chown -R www-data:www-data /var/run

# Inicia o PHP-FPM em modo daemon (em segundo plano).
php-fpm -D

# Inicia o Nginx em modo foreground (em primeiro plano).
# O container permanecerá ativo enquanto o Nginx estiver rodando.
nginx -g "daemon off;"