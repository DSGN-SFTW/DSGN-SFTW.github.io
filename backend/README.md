# 4code

Version 1.0.0

### Copyright (c)

Backend - Arthur Carneiro da Rocha Menezes

### Getting Started

Clone the project

```bash
git clone https://github.com/DSGN-SFTW/DSGN-SFTW.github.io.git
```

### Description

Essa API serve para o CRUD e autenticacao no site do projeto 4code.

### Hierarchy

- **/backend** - Diretorio onde a api do backend se encontra;
  - **/src** - Diretorio dos arquivos de desenvolvimento;
  - **/models** Diretorio dos modelos;
  - **/routes** Diretorio das rotas.

### Prerequisites

- [NodeJS 12.x](https://nodejs.org/download/release/v12.16.1/)
- [npm](https://www.npmjs.com)
- [Serverless framework](https://serverless.com)

### Usage

No diretorio /backend, instale todas as dependencias.

```bash
npm install
```

Para desenvolvimento

```bash
serverless offline
```

### Deployment

#### Docker

Executa a Dockerfile

```bash
docker build .
```

#### NPM

```
  npm run deploy
```

### Built With

---

- [Serverless Framework](https://serverless.com)
- [AWS Lambda](aws.amazon.com/lambda/)
- [AWS API Gateway](aws.amazon.com/api-gateway/)
