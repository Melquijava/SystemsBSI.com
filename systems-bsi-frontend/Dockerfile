# Conteúdo FINAL e EXPLÍCITO para systems-bsi-frontend/Dockerfile

# Use a imagem oficial e leve do Nginx
FROM nginx:stable-alpine

# 1. Remova completamente a pasta de conteúdo padrão do Nginx
RUN rm -rf /usr/share/nginx/html

# 2. Recrie a pasta vazia
RUN mkdir /usr/share/nginx/html

# 3. Copie sua configuração personalizada do Nginx para o container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 4. Copie todo o conteúdo do seu site (o "." representa a pasta systems-bsi-frontend)
# para a pasta recém-criada e vazia.
COPY . /usr/share/nginx/html