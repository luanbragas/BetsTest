# WililiDash

Dashboard premium de apostas esportivas com NestJS, React TSX, Tailwind e Supabase.

## Stack

- NestJS servindo API e o build do frontend
- React com TSX em `src/client`
- Vite compilando o frontend para `public`
- Componentes estilo shadcn/Radix para selects, botoes, cards e inputs
- Supabase Auth para login, criacao de conta e recuperacao de senha
- Supabase Postgres com RLS para cada usuario acessar apenas os proprios registros
- Tailwind CSS para a interface premium responsiva
- Parser de linguagem natural no backend para o WililiFlow

## Configuracao

Voce ja preencheu o `.env`. Ele deve conter:

```env
PORT=3000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-service-role
```

No Supabase, abra o SQL Editor e execute:

```text
supabase/schema.sql
```

Depois rode:

```bash
npm run dev
```

O Nest tenta abrir em `http://localhost:3000`. Se a porta estiver ocupada, ele sobe automaticamente na proxima porta livre e mostra a URL no terminal.

## Scripts

- `npm run dev`: compila o frontend TSX e inicia o Nest em watch
- `npm run build`: compila o frontend com Vite e o backend com TypeScript
- `npm run start`: roda a build do Nest em `dist`
- `npm run lint`: valida TypeScript do backend e do frontend TSX

## Deploy na Vercel

O projeto usa `vercel.json` para:

- compilar o React/Vite para `public`
- servir a SPA pelo `index.html`
- enviar `/api/*` para a funcao serverless do Nest em `api/index.ts`

No painel da Vercel, configure as Environment Variables:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-service-role
```

Depois faca um novo deploy. O endpoint `/api/health` deve retornar `supabaseConfigured: true`.

## Estrutura

- `src/client/src/pages/AuthPage.tsx`: pagina de login, criacao de conta e recuperacao
- `src/client/src/pages/DashboardPage.tsx`: container autenticado, estado compartilhado e navegacao
- `src/client/src/pages/app/OverviewPage.tsx`: visao geral mobile-first
- `src/client/src/pages/app/NewBetPage.tsx`: cadastro manual de aposta
- `src/client/src/pages/app/FlowPage.tsx`: registro inteligente WililiFlow
- `src/client/src/pages/app/OperationsPage.tsx`: tabela completa, filtros e CSV
- `src/client/src/pages/app/PerformancePage.tsx`: analise de desempenho
- `src/client/src/pages/app/FriendsPage.tsx`: amigos e lucro liquido por e-mail
- `src/client/src/pages/app/AdminPage.tsx`: cadastro de casas de aposta para o admin
- `src/client/src/components/ui`: componentes base estilo shadcn
- `src/client/src/components/bets`: componentes reutilizaveis de apostas
- `api/index.ts`: adaptador serverless do Nest para a Vercel
- `vercel.json`: rotas e output do deploy na Vercel
- `src/auth`: endpoints de autenticacao via Supabase Auth
- `src/bets`: CRUD de apostas e parser de linguagem natural
- `src/supabase`: cliente Supabase configurado pelo `.env`
- `supabase/schema.sql`: tabela `bets`, indices e policies RLS

## Funcionalidades

- Login, criacao de conta e recuperacao via Supabase Auth
- Dashboard com lucro, prejuizo, resultado liquido, operacoes e aproveitamento
- Filtros por periodo, plataforma e categoria
- Cadastro manual de operacoes
- Registro inteligente por texto em `/api/bets/flow`
- CRUD de apostas protegido por token Supabase
- Importacao/exportacao CSV
- Grafico de desempenho e melhor plataforma do periodo
- Amigos por e-mail com lucro liquido ja descontando perdas
- Painel admin liberado apenas para `luanbragash23@gmail.com`
- Casas de aposta pre-selecionadas e expansíveis pelo admin

## Observacao

Use a chave `anon` no frontend apenas. A `SUPABASE_SERVICE_ROLE_KEY` fica somente no backend e habilita amigos por e-mail e cadastro admin de casas.
