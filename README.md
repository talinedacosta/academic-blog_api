
# Tech Challenge - Academic Blog


#### Executando projeto com a imagem talinedacosta/fiap_academic_blog
Para executar o projeto no Docker utilizando a imagem talinedacosta/fiap_academic_blog, é necessário criar o arquivo docker-compose.yml e executar o comando docker-compose up -d

```bash
 # Etapa 1 - crie a pasta do projeto e o arquivo docker-compose.yml
  mkdir academic-blog
  cd academic-blog
  vim docker-compose.yml
```

```bash
  # Etapa 2 - adicione as informações a seguir dentro do docker-compose.yml
  services:
  db:
    container_name: academic_blog_db
    image: postgres:latest
    restart: always
    ports: 
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: academic_blog_db
    volumes:
      - academic_blog_db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - production_network

  api:
    container_name: academic_blog_api
    image: talinedacosta/fiap_academic_blog:latest
    build:
      context: .
    restart: always
    depends_on:
      db:
        condition: service_healthy
    environment:
      ENV: production
      PORT: 3000
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASS: 123456
      DB_NAME: academic_blog_db
      DB_NAME_TEST: academic_blog_db_test
      JWT_SECRET: academicblogapi2024
    ports:
      - "3000:3000"
    networks:
      - production_network

networks:
  production_network:
    driver: bridge

volumes:
  academic_blog_db_data:
```

```bash
  # Etapa 3 - rode o comando docker-compose up -d para baixar e rodar as imagens
  docker-compose up -d
```
 Pronto, verifique se a aplicação está rodando normalmente através dos comandos 
 ```bash
  # Logs da API
  docker compose logs api

  # Logs do Banco
  docker compose logs db
```
A API estará rodando na porta http://localhost:3000 e o banco na porta http://localhost:5432.

#### Executando projeto localmente
```bash
  # Etapa 1 - Clone o projeto
  git clone https://github.com/talinedacosta/academic-blog_api.git
  cd academic-blog_api
```

```bash
  # Etapa 2 - Crie um banco local
  docker run --name mypostgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=user \
  -p 5432:5432 \
  -d postgres:latest
```

Adicione o arquivo .env no projeto com base no .env.sample
- ENV=
- PORT=
- DB_HOST=
- DB_PORT=
- DB_USER=
- DB_PASS=
- DB_NAME=
- DB_NAME_TEST=
- JWT_SECRET=

```bash
  # Etapa 3 - Rode o projeto
  npm run start:dev
```
 
A API estará rodando na porta http://localhost:3000 e o banco na porta http://localhost:5432.


#### Executando testes do projeto
Crie uma database para testes baseada no banco que você criou anteriormente, informe o nome do banco no env DB_NAME_TEST.

```bash
  # Etapa 1 - Rode os testes
  npm run test
```

## Documentação da API

Com a aplicação rodando localmente, você poderá ver o swagger da aplicação através do link http://localhost:3000/api-docs/