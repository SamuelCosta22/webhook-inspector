# 🔍 Webhook Inspector

Um sistema completo para capturar, inspecionar e monitorar requisições de webhooks em tempo real.

## 📋 Sobre o Projeto

O Webhook Inspector é uma ferramenta que permite capturar e analisar todas as requisições HTTP recebidas, facilitando o desenvolvimento e debug de integrações com webhooks. Ideal para testar APIs de terceiros, validar payloads e monitorar chamadas HTTP.

## 🚀 Tecnologias Utilizadas

### Backend (API)
- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Fastify** - Framework web de alta performance
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM TypeScript-first
- **Zod** - Validação de schemas
- **Docker** - Containerização do PostgreSQL
- **Swagger/Scalar** - Documentação automática da API

### Frontend (Web)
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **pnpm** - Gerenciador de pacotes

### Arquitetura
- **Monorepo** - Workspaces com pnpm
- **API RESTful** - Endpoints documentados
- **CORS habilitado** - Suporte para diferentes origens

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- pnpm 9.15.4+ instalado
- Docker e Docker Compose instalados

### Passo a passo

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd webhook-inspector
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` dentro da pasta `api/`:

```bash
cd api
cp .env.example .env  # Se existir, ou crie manualmente
```

Conteúdo do arquivo `.env`:
```env
NODE_ENV=
PORT=
DATABASE_URL=
```

4. **Inicie o banco de dados PostgreSQL**
```bash
cd api
docker-compose up -d
```

5. **Execute as migrações do banco de dados**
```bash
cd api
pnpm db:migrate
```

## 🎮 Como Usar

### Iniciar o Backend (API)

```bash
cd api
pnpm dev
```

A API estará disponível em:
- **API**: http://localhost:3333
- **Documentação**: http://localhost:3333/docs

### Iniciar o Frontend (Web)

Em outro terminal:

```bash
cd web
pnpm dev
```

O frontend estará disponível em: http://localhost:5173

## 📚 Endpoints da API

### Listar Webhooks
```
GET /api/webhooks?limit=20
```

Lista todos os webhooks capturados com paginação.

**Parâmetros de query:**
- `limit` (opcional): Número de resultados (1-100, padrão: 20)

### Documentação Completa

Acesse http://localhost:3333/docs para ver a documentação interativa completa da API com Swagger.

## 🛠️ Scripts Disponíveis

### Workspace Raiz
```bash
pnpm install        # Instala dependências de todos os workspaces
```

### API (pasta api/)
```bash
pnpm dev           # Inicia servidor em modo desenvolvimento
pnpm start         # Inicia servidor em produção
pnpm format        # Formata código com Biome
pnpm db:generate   # Gera migrations do Drizzle
pnpm db:migrate    # Executa migrations
pnpm db:studio     # Abre interface visual do banco de dados
```

### Web (pasta web/)
```bash
pnpm dev           # Inicia servidor de desenvolvimento
pnpm build         # Builda para produção
pnpm preview       # Preview da build de produção
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: webhooks

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | text | Identificador único (UUIDv7) |
| method | text | Método HTTP (GET, POST, etc) |
| pathname | text | Caminho da requisição |
| ip | text | Endereço IP de origem |
| statusCode | integer | Código de status da resposta |
| contentType | text | Tipo do conteúdo |
| contentLength | integer | Tamanho do conteúdo |
| queryParams | jsonb | Parâmetros de query |
| headers | jsonb | Headers da requisição |
| body | text | Corpo da requisição |
| createdAt | timestamp | Data de criação |

## 🔧 Ferramentas de Desenvolvimento

### Visualizar Banco de Dados

Para abrir uma interface visual do banco de dados:

```bash
cd api
pnpm db:studio
```

### Formatação de Código

O projeto usa Biome para formatação:

```bash
cd api
pnpm format
```

## 🐳 Docker

O projeto inclui um `docker-compose.yml` para o PostgreSQL:

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Logs
docker-compose logs -f
```

## 📂 Estrutura do Projeto

```
webhook-inspector/
├── api/                    # Backend API
│   ├── src/
│   │   ├── db/            # Configuração do banco
│   │   │   ├── schema/    # Schemas Drizzle
│   │   │   └── migrations/ # Migrações SQL
│   │   ├── routes/        # Rotas da API
│   │   ├── server.ts      # Servidor Fastify
│   │   └── env.ts         # Validação de env vars
│   ├── docker-compose.yml # PostgreSQL
│   └── package.json
├── web/                    # Frontend React
│   ├── src/
│   │   ├── app.tsx        # Componente principal
│   │   └── main.tsx       # Entry point
│   └── package.json
├── package.json           # Workspace raiz
└── pnpm-workspace.yaml    # Configuração do workspace
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

---

**Desenvolvido com ❤️ e TypeScript**

