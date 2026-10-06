# Sistema de Pedidos — Versão Limpa

## Estrutura

```
sistema-pedidos/
├── backend/
│   ├── server.js        # monta o app Express e conecta as rotas
│   ├── produtos.js        # dados, busca e rotas de Produto
│   ├── clientes.js         # dados, busca e rotas de Cliente
│   ├── pedidos.js           # dados, cálculos, regras e rotas de Pedido
│   ├── .eslintrc.json
│   ├── .prettierrc
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── GLOSSARIO.md
```

## As 6 premissas aplicadas

1. **Verificadores de estilo e formatadores** — ESLint com o guia de
   estilo Airbnb (`eslint-config-airbnb-base`) integrado ao Prettier.
2. **Nomes legíveis** — variáveis e funções com nomes que revelam seu
   propósito (`novoProduto`, `dadosPedido`, `criarPedido`, etc.).
3. **Sem números mágicos** — valores de desconto, frete e limites de
   quantidade viraram constantes nomeadas, declaradas dentro das funções
   que as usam.
4. **Linguagem ubíqua** — vocabulário do domínio (Cliente, Produto,
   Pedido, Status do Pedido...) padronizado em todo o sistema; ver
   `GLOSSARIO.md`.
5. **Funções coesas e desacopladas** — lógica dividida em funções
   pequenas de responsabilidade única, e o próprio projeto dividido em
   um arquivo por entidade (`produtos.js`, `clientes.js`, `pedidos.js`).
6. **Fluxos de execução separados** — rotas com lógica relevante
   envolvidas em `try/catch`, separando o tratamento de erros
   inesperados do fluxo normal.

## Como rodar

### Back-end

```bash
cd backend
npm install
npm start
```

Servidor em `http://localhost:3000`.

Para checar estilo e formatação:

```bash
npx eslint . --fix
npx prettier --write .
```

### Front-end

Abra `frontend/index.html` no navegador (com o back-end já rodando), ou
sirva por um servidor estático:

```bash
cd frontend
npx serve .
# ou
python3 -m http.server 5500
```

## Documentação

- `GLOSSARIO.md` — vocabulário do domínio (linguagem ubíqua).
