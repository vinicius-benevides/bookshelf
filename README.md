# BookShelf

Aplicacao fullstack para catalogar livros, gerenciar estante pessoal e avaliar titulos. O projeto inclui API REST em Node.js/Express com MongoDB e aplicativo mobile em React Native (Expo) com React Query.

## Sumario
- Visao geral
- Tecnologias
- Arquitetura
- Banco de dados
- Principais fluxos
- Endpoints
- Aplicativo mobile
- Como rodar
- Estrutura de pastas

## Visao geral
- API Express com autenticacao JWT, cadastro/login e CRUD de livros.
- Avaliacao de livros (media e quantidade), com rating do usuario preservado.
- Estante do usuario com status: na estante, lendo, finalizado.
- App mobile com listagem, detalhes, avaliacao por estrelas, adicao/remocao na estante e colapsamento de secoes.

## Tecnologias
- Backend: Node.js, Express, TypeScript, Mongoose/MongoDB, JWT, Multer (uploads), Swagger para docs.
- Mobile: React Native (Expo), TypeScript, React Navigation, React Query, Axios, Ionicons.
- Ferramentas: ESLint/Prettier (se configurados), dotenv para variaveis de ambiente.

## Arquitetura (alto nivel)
```
[Mobile app] -- HTTP/JSON --> [API Express] -- Mongoose --> [MongoDB]
```
- Autenticacao: login/register retornam JWT; middleware popula `req.userId` para rotas protegidas.
- Livros: CRUD basico (lista, detalhes, criar), upload opcional de capa ou URL.
- Avaliacao: PATCH /books/:id/rating grava/atualiza score do usuario e recalcula media/contagem.
- Estante: colecao propria (shelfentries) liga usuario ao livro e status.

## Banco de dados (MongoDB)
Collections principais:
- `users`: { name, email (unique), password (hash), timestamps }
- `books`: { title, author, description?, coverImageUrl?, createdBy?, ratings: [{ user, score }] , timestamps }
- `shelfentries`: { user, book, status: 'not_started' | 'reading' | 'finished', timestamps }

Derivados computados na API (aggregate):
- `ratingAvg`: media de `ratings.score`.
- `ratingCount`: tamanho de `ratings`.
- `userRating`: score do usuario autenticado (quando solicitado com userId).
- `inShelf`: booleano se o livro ja esta na estante do usuario.

## Principais fluxos (simplificados)
- Registro: valida name/email/password, regex basico de email, checa duplicidade, cria usuario, retorna JWT.
- Login: valida credenciais, retorna JWT.
- Listar livros: agrega ratingAvg/ratingCount e marca inShelf (se user presente).
- Detalhe: devolve dados do livro, ratingAvg/ratingCount, userRating e inShelf.
- Avaliar livro: PATCH salva/atualiza rating do usuario e devolve media/contagem.
- Estante: endpoints para listar, adicionar, trocar status e remover; app agrupa por status e permite colapsar secoes.

## Endpoints (principais)
Prefixo: `/api`
- `POST /auth/register` – cria conta (name, email, password), valida email, retorna JWT + user.
- `POST /auth/login` – autentica, retorna JWT + user.
- `GET /books?search=&sort=date|title|rating` – lista livros (agregado com rating).
- `GET /books/:id` – detalhe com rating e userRating.
- `POST /books` – cria livro (multipart ou coverUrl).
- `PATCH /books/:id/rating` – avalia/atualiza nota (0-5).
- `GET /shelf` – lista estante do usuario.
- `POST /shelf` – adiciona livro à estante.
- `PATCH /shelf/:bookId` – altera status.
- `DELETE /shelf/:bookId` – remove da estante.

Swagger: verificar `api/src/docs/swagger.ts` para definicoes e exemplos.

## Aplicativo mobile (Expo)
- Listagem de livros com busca e ordenacao; rating e botao de adicionar lado a lado.
- Detalhes: botoes de acao, avaliacao por estrela clicavel, desabilita salvar se nota igual à anterior.
- Estante: secoes colapsaveis com chevron, botoes de status apenas para estados diferentes, botao flutuante de remover.
- Cadastro/login: campos sem auto-capitalizacao; keyboard avoiding em formularios e cadastro de livros.

## Como rodar
### Requisitos
- Node.js >= 18
- MongoDB rodando local ou instancia acessivel
- Expo CLI (para rodar mobile) e ambiente Android/iOS ou Expo Go

### Backend (api)
```bash
cd api
cp .env.example .env   # se existir; configure MONGODB_URI, JWT_SECRET, PORT etc.
npm install
npm run dev            # ou npm start
```
- Servico padrao: `http://localhost:3000/api`
- Uploads de capa: pastas/config conforme `multer` (ver middlewares e controllers).

### Mobile (mobile)
```bash
cd mobile
npm install
npm start              # expo start
```
- Configure `mobile/src/services/api.ts` para apontar para o host da API (ex.: `http://localhost:3000/api` ou IP da rede).
- Rodar em device/emulador via Expo Go ou `expo run:android` / `expo run:ios` se configurado.

## Estrutura de pastas (resumo)
- `api/src/controllers` – handlers de rotas (auth, book, shelf).
- `api/src/repositories` – acesso a dados (book, user, shelf).
- `api/src/models` – schemas Mongoose.
- `api/src/routes` – definicao de rotas Express.
- `api/src/docs` – swagger.
- `mobile/src/screens` – telas (auth, books, shelf).
- `mobile/src/components` – componentes reutilizaveis (Button, Input, BookCard etc.).
- `mobile/src/hooks` – hooks de dados (React Query) e auth.
- `mobile/src/services` – api client/axios e endpoints.

## Diagramas (texto)
### Relacao de dados
```
User 1 - n ShelfEntry n - 1 Book
Book 1 - n Rating (subdocument: { user, score })
```

### Fluxo de avaliacao (sequencia)
```
App -> API PATCH /books/:id/rating (JWT, score)
API -> MongoDB: find book, upsert rating by user, save
API -> App: retorna ratingAvg/ratingCount atualizados
App: invalida cache (React Query) e refaz book/list
```

### Fluxo de estante (adicionar)
```
App -> POST /shelf (bookId)
API: cria ShelfEntry { user, book, status: not_started }
API -> App: retorna shelf entry
App: invalida/lista estante e atualiza UI
```

## Observacoes
- Ratings sao armazenados no documento do livro; medias calculadas via aggregate e retornadas nas respostas.
- Campos de URL de capa podem vir de upload (multer) ou de um link fornecido pelo usuario.
- Autenticacao obrigatoria para rotas de livros (criar, avaliar) e estante.

