FROM nginx:alpine

# Remove o nginx.conf padrão e copia o seu
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos do site
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
