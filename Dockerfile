# --- Etapa 1: Configuração do PHP-FPM ---
# Use uma imagem oficial do PHP com FPM para processar os scripts
FROM php:8.1-fpm-alpine AS php_base

# Instalação de extensões do PHP (se necessário)
RUN docker-php-ext-install pdo pdo_mysql

# Define o diretório de trabalho
WORKDIR /var/www/html

# Copia os arquivos do projeto para o diretório de trabalho
COPY . .

# Garante permissão de escrita para o arquivo contador.txt
# A permissão 777 é ampla, mas é comum para testes.
RUN chmod 777 contador.txt

# --- Etapa 2: Configuração do Nginx ---
# Use uma imagem do Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Remove o arquivo de configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o arquivo de configuração do Nginx personalizado
COPY nginx.conf /etc/nginx/conf.d/

# Copia os arquivos da Etapa 1 para o diretório de serviço do Nginx
COPY --from=php_base /var/www/html /usr/share/nginx/html

# Expõe a porta 80 para acesso externo
EXPOSE 80

# Inicia o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]