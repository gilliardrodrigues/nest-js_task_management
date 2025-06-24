FROM node:22.16-alpine

# Instala bash (opcional, útil para debug ou shells)
RUN apk add --no-cache bash

# Define diretório de trabalho
WORKDIR /usr/src/app

# Copia apenas arquivos de dependência para cache otimizado
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Compila o projeto NestJS (gera a pasta dist/)
RUN npm run build

# Expõe a porta padrão usada pelo NestJS
EXPOSE 3000

# Executa o app compilado
CMD ["node", "dist/main.js"]