# 🧠 Back-end – [Desafio FullStack EPTA]

Este repositório contém a implementação de uma API back-end desenvolvida com **Node.js, TypeScript e Prisma**, focada em um ambiente de desenvolvimento. O projeto segue boas práticas de estruturação de código, organização de pastas e utilização de ferramentas modernas como Docker e PostgreSQL.
A aplicação gerencia autenticação de usuários por meio de JWT e o controle de veículos associados a esses usuários.

---

## 🚀 Tecnologias Utilizadas

[![My Skills](https://skillicons.dev/icons?i=ts,nodejs,express,postgres,prisma,docker,)](https://skillicons.dev)

---

## 📁 Estrutura Principal do Projeto

- 📦 **Prisma/**

  - 📂 `migrations/` – Migrações geradas automaticamente para o banco de dados
  - 📜 `schema.prisma` – Schema principal do Prisma, define os modelos e conexão com o banco
  - 📜 `seed.ts` – Script para popular o banco de dados com dados iniciais (seeds)
- 📦 **src/**

  - 📂 `controllers/` – Funções que lidam com as requisições e respostas da API
  - 📂 `middlewares/` – Middlewares de autenticação, validação e afins
  - 📂 `routes/` – Definição das rotas da aplicação
  - 📂 `services/` – Regras de negócio e lógica de processamento
  - 📂 `utils/` – Funções utilitárias e helpers reutilizáveis
  - 📜 `index.ts` – Ponto de entrada da aplicação (inicializa o servidor)
  - 📜 `prisma.ts` – Instância única do Prisma Client para uso no projeto
- 📜 `.env.example` – Arquivo modelo com as variáveis de ambiente necessárias
- 📜 `docker-compose.yml` – Arquivo de configuração do Docker (subir banco de dados)
- 📜 `package.json` – Gerenciador de dependências e scripts do projeto

---

## ⚙️ Configuração do Ambiente

A seguir estão as instruções para rodar o projeto localmente em ambiente de desenvolvimento. Certifique-se de ter o Node.js instalado em sua máquina.Com os passos abaixo, você será capaz de instalar as dependências, configurar as variáveis de ambiente, subir o banco de dados, aplicar as migrações, popular o banco e iniciar o servidor da aplicação.

### 1. Clonar o repositório

Clone o projeto com o comando:

```bash
git clone https://github.com/alyssonrafael/Desafio_EPTA_Fullstack
```

### 2. Entar no diretorio Backend

Navegue para o diretorio backend

```bash
cd Desafio_EPTA_Fullstack/backend
```

### 3. Instalar as dependências

Execute o comando:

```bash
npm install
```

### 4. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` com o comando:

```bash
cp .env.example .env
```

Em seguida, edite o `.env` com suas configurações locais, principalmente os dados de conexão com o banco. **Essa etapa é muito inportante**.

**ℹ️ Dica:** Assegure-se de utilizar um banco de dados de teste para rodar o projeto localmente.
Caso ainda não tenha um ambiente configurado, você pode seguir o passo abaixo para subir um banco de dados com Docker:

## 🐳 Subindo o Banco com Docker

Certifique-se de que o **Docker e o Docker-compose** esteja instalado e rodando.

Execute o comando:

```bash
docker-compose up -d
```

Isso criará e executará o container PostgreSQL com base nas configurações do seu `.env`.

---

## 🛠️ Prisma – Configuração e Migração

Com o banco de dados rodando, use o comando abaixo para criar a estrutura inicial do banco:

```bash
npx prisma migrate dev
```

Se quiser visualizar o banco via interface gráfica, execute:

```bash
npx prisma studio
```

Feito isso, seu banco de dados já estará rodando e configurado.
Se desejar popular com dados fictícios iniciais, siga o próximo passo:

---

## 🌱 Populando o Banco (Seed)

Você pode utilizar os scripts definidos no `package.json`:

- Para **resetar** o banco **(Atenção esse comando apaga todos os dados do banco de dados)**:

```bash
npm run db:reset
```

- Para **popular** o banco com dados ficticios iniciais (seeds):

```bash
npm run db:seed
```

---

## 🧪 Rodando o Projeto em Desenvolvimento

Para iniciar o servidor de desenvolvimento, rode:

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333` (ou na porta configurada no `.env`).

---

## ✅ Observações

⚠️ **Importante:** Este projeto foi desenvolvido com foco em demonstração técnica.

🔐 Todas as variáveis sensíveis estão isoladas no arquivo `.env`.
Certifique-se de configurar corretamente seu `.env` (a partir do `.env.example`) antes de iniciar o projeto, para garantir que tudo funcione como esperado.

## 📌 Endpoints da API

O inicio do endpoit é sempre o mesmo `http://localhost:3333/api` (ou na porta configurada no `.env`).

| Método | Rota                                 | Descrição                                                                      |
| ------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| POST    | `/auth/register`                   | Registra um novo usuário                                                        |
| POST    | `/auth/login`                      | Realiza login e retorna um token JWT                                             |
| GET     | `/users/get-user`                  | Retorna os dados do usuário autenticado                                         |
| POST    | `/vehicles/register`               | Cadastra um novo veículo vinculado ao usuário logado                           |
| GET     | `/vehicles/get-all`                | Lista todos os veículos do usuário autenticado                                 |
| PUT     | `/vehicles/update?vehicleId=id`    | Atualiza os dados de um veículo específico                                    |
| PUT     | `/vehicles/archive?vehicleId=id`   | Atualiza o campo is_Active para false indicando que o veículo não está ativo |
| PUT     | `/vehicles/unarchive?vehicleId=id` | Atualiza o campo is_Active para true indicando que o veículo está ativo      |
| DELETE  | `/vehicles/delete?vehicleId=id`    | Apaga permanentemente um veículo do banco                                      |

### 🔒 Todas as rotas (exceto login e registro) requerem autenticação via token JWT.

O token deve ser enviado no **header** `Authorization`, contendo **apenas o token** (sem o prefixo `Bearer`).
