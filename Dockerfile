# Usa uma imagem oficial do PHP com FPM
FROM php:8.1-fpm-alpine

# Instala o Nginx e outras dependências
RUN apk add --no-cache nginx

# Define o diretório de trabalho
WORKDIR /var/www/html

# Copia os arquivos do seu projeto
COPY . .

# Garante permissão de escrita para o arquivo contador.txt
RUN chmod 777 contador.txt

# Copia sua configuração personalizada do Nginx, sem remover nada antes
COPY nginx.conf /etc/nginx/conf.d/

# Copia o script de inicialização
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expõe a porta 80
EXPOSE 80

# Define o script como o ponto de entrada do container
CMD ["/usr/local/bin/start.sh"]