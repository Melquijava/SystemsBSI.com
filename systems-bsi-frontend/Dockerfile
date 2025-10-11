# Conteúdo para systems-bsi-frontend/Dockerfile

FROM php:8.1-fpm-alpine

# Instala o Nginx
RUN apk update && apk add --no-cache nginx

# Remove a configuração padrão do Nginx para evitar conflitos
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa configuração de site personalizada para o local correto
COPY site.conf /etc/nginx/conf.d/

# Copia o script de inicialização
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Define o diretório de trabalho
WORKDIR /var/www/html

# Copia todos os arquivos do site para o diretório de trabalho
COPY . .

# Expõe a porta que o Nginx vai usar
EXPOSE 80

# Define o script que será executado quando o container iniciar
CMD ["start.sh"]