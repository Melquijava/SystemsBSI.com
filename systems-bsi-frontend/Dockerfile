# Conteúdo FINAL para systems-bsi-frontend/Dockerfile

# Use a imagem oficial e leve do Nginx
FROM nginx:stable-alpine

# Copie sua configuração personalizada do Nginx para o container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# IMPORTANTE: Remove todo o conteúdo padrão do Nginx (a página de boas-vindas)
RUN rm -rf /usr/share/nginx/html/*

# Copie todos os seus arquivos (index.html, assets/, etc.) para a pasta limpa do Nginx
COPY . /usr/share/nginx/html