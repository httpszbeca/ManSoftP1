# Sistema de Pedidos (versão "legada")

Sistema simples de gerenciamento de pedidos, com back-end em Node.js/Express
e front-end em HTML/CSS/JS puro, criado propositalmente com problemas de
manutenibilidade comuns em código legado — ideal para praticar refatoração
em disciplinas de manutenção de software.

## Estrutura

```
sistema-pedidos/
├── backend/
│   ├── server.js       # API REST (Express), dados em memória
│   └── package.json
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Como rodar

### Back-end
```bash
cd backend
npm install
npm start
```
O servidor sobe em `http://localhost:3000`.

### Front-end
Basta abrir o arquivo `frontend/index.html` diretamente no navegador
(ou servir a pasta com qualquer servidor estático). Ele consome a API
em `http://localhost:3000`.

## Funcionalidades

- Listagem e cadastro de produtos
- Listagem de clientes
- Criação de pedidos com cálculo de desconto por quantidade, desconto de
  cliente VIP e frete por cidade
- Listagem de pedidos e transição de status (pendente → pago → enviado → entregue,
  ou cancelado)

## Proposta do exercício

O código funciona, mas foi escrito de propósito com vários problemas típicos
de manutenção de software (os chamados "code smells"): métodos longos que
fazem coisa demais, lógica de negócio misturada com as rotas HTTP, trechos de
código duplicados, números e strings "mágicos" espalhados, nomes de variáveis
pouco descritivos, condicionais aninhadas em excesso, uso de `var` e
comparação com `==`, e falta de separação em camadas (rotas / regras de
negócio / dados).

Sua tarefa é analisar o back-end e o front-end, identificar esses pontos de
baixa manutenibilidade e refatorá-los aplicando técnicas como:

- Extract Method / Extract Function
- Replace Magic Number/String with Named Constant
- Remove Duplicated Code
- Introduce Guard Clauses
- Separar responsabilidades em camadas (ex.: controllers, services, repositories)
- Melhorar nomes de variáveis e funções
- Substituir cascatas de `if/else` por estruturas mais claras (ex.: mapas de
  transição de estado, polimorfismo, tabelas de regras)

Recomenda-se documentar, antes e depois, os smells encontrados e as técnicas
aplicadas — isso costuma ser parte da entrega em trabalhos de manutenção de
software.
