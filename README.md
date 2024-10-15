
# Tech Challenge - Academic Blog

#### Executando projeto com a imagem talinedacosta/fiap_academic_blog
Para executar o projeto no Docker utilizando a imagem talinedacosta/fiap_academic_blog, é necessário criar o arquivo docker-compose.yml e executar o comando docker-compose up -d

Crie a pasta do projeto e o arquivo docker-compose.yml

```bash
  mkdir academic-blog
  cd academic-blog
  vim docker-compose.yml
```
Adicione as informações a seguir dentro do docker-compose.yml

```bash
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

Rode o comando docker-compose up -d para baixar e rodar as imagens

```bash
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

Clone o projeto

```bash
  git clone https://github.com/talinedacosta/academic-blog_api.git
```

Entre no diretório do projeto

```bash
  cd academic-blog_api
```

Instale as dependências

```bash
  npm install
```

Crie um banco local

```bash
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

Inicie o servidor

```bash
  npm run start:dev
```
 
A API estará rodando na porta http://localhost:3000 e o banco na porta http://localhost:5432.

## Rodando os testes

Crie uma database para testes baseada no banco que você criou anteriormente, informe o nome do banco no env DB_NAME_TEST.
Para rodar os testes, rode o seguinte comando

```bash
  npm run test
```

## Documentação da API

Com a aplicação rodando localmente, você poderá ver o swagger da aplicação através do link http://localhost:3000/api-docs/

### User
#### Criar usuário

```http
  POST /user
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório**. Nome completo do usuário. |
| `email` | `string` | **Obrigatório**. E-mail do usuário. |
| `password` | `string` | **Obrigatório**. Senha. |
| `role_id` | `number` | **Obrigatório**. Permissão do usuário. |

Para criar um usuário é necessário enviar o tipo de permissão que ele terá, a propriedade de chama **role_id** e ela tem duas opções

| id   | description       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `1` | `teacher` | usuário pode realizar todas as operações no sistema. |
| `2` | `student` | usuário pode apenas visualizar posts. |


#### Acessar o sistema

```http
  POST /user/login
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email` | `string` | **Obrigatório**. E-mail do usuário. |
| `password` | `string` | **Obrigatório**. Senha |

Utilize o token que retorna na rota login para fazer ações no sistema. 

#### Encontre um usuário pelo ID

```http
  GET /user/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization bearer` | `jwt` | **Obrigatório** |


#### Deletar um usuário pelo ID
Todos os posts que o usuário criou também serão removidos.

```http
  DELETE /user/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization bearer` | `jwt` | **Obrigatório** |

### Posts
#### Criar posts

```http
  POST /posts
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization bearer` | `jwt` | **Obrigatório** |
| `title` | `string` | **Obrigatório**. Título do post. |
| `content` | `jwt` | **Obrigatório**. Conteúdo do post. |

#### Atualizar um post pelo ID

```http
  PUT /posts/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization bearer` | `jwt` | **Obrigatório** |
| `title` | `string` | **Obrigatório**. Título do post. |
| `content` | `jwt` | **Obrigatório**. Conteúdo do post. |

#### Deletar um post pelo ID

```http
  DELETE /posts/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization bearer` | `jwt` | **Obrigatório** |

#### Encontrar posts por busca de termo

```http
  GET /posts/search?search={termo}
```

#### Encontrar um post pelo ID

```http
  GET /posts/:id
```

#### Encontrar todos posts

```http
  GET /posts
```

#### Encontrar todos posts (apenas permissão de teacher)

```http
  GET /posts/admin
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `Authorization bearer` | `jwt` | **Obrigatório** |