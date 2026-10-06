const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// "banco de dados" em memória
let produtos = [
  { id: 1, nome: "Teclado Mecanico", preco: 250.0, categoria: "periferico", estoque: 15 },
  { id: 2, nome: "Mouse Gamer", preco: 120.0, categoria: "periferico", estoque: 30 },
  { id: 3, nome: "Monitor 24pol", preco: 899.9, categoria: "monitor", estoque: 8 },
  { id: 4, nome: "Cadeira Gamer", preco: 1200.0, categoria: "movel", estoque: 5 },
  { id: 5, nome: "Notebook", preco: 3500.0, categoria: "computador", estoque: 3 },
];

let pedidos = [];
let clientes = [
  { id: 1, nome: "Ana Souza", tipo: "vip", cidade: "Campo Grande" },
  { id: 2, nome: "Bruno Lima", tipo: "normal", cidade: "Sao Paulo" },
  { id: 3, nome: "Carla Dias", tipo: "normal", cidade: "Curitiba" },
];

let proximoIdPedido = 1;

// ---------- PRODUTOS ----------

app.get("/produtos", function (req, res) {
  res.json(produtos);
});

app.post("/produtos", function (req, res) {
  var p = req.body;
  var novoId = produtos.length + 1;
  produtos.push({
    id: novoId,
    nome: p.nome,
    preco: p.preco,
    categoria: p.categoria,
    estoque: p.estoque,
  });
  res.json({ ok: true });
});

// ---------- CLIENTES ----------

app.get("/clientes", function (req, res) {
  res.json(clientes);
});

// ---------- PEDIDOS ----------
// ATENCAO: a rota abaixo concentra cadastro, validacao, calculo de frete,
// calculo de desconto e persistencia tudo junto - proposital para o exercicio.

app.post("/pedidos", function (req, res) {
  var body = req.body;

  // validacao toda misturada aqui, com duplicacao de checagens parecidas
  if (!body.clienteId) {
    return res.status(400).json({ erro: "cliente obrigatorio" });
  }
  if (body.itens == null) {
    return res.status(400).json({ erro: "itens obrigatorio" });
  }
  if (body.itens.length == 0) {
    return res.status(400).json({ erro: "itens obrigatorio" });
  }

  var cliente = null;
  for (var i = 0; i < clientes.length; i++) {
    if (clientes[i].id == body.clienteId) {
      cliente = clientes[i];
    }
  }
  if (cliente == null) {
    return res.status(400).json({ erro: "cliente nao encontrado" });
  }

  var itensPedido = [];
  var subtotal = 0;

  for (var j = 0; j < body.itens.length; j++) {
    var itemReq = body.itens[j];
    var produtoEncontrado = null;

    for (var k = 0; k < produtos.length; k++) {
      if (produtos[k].id == itemReq.produtoId) {
        produtoEncontrado = produtos[k];
      }
    }

    if (produtoEncontrado == null) {
      return res.status(400).json({ erro: "produto nao encontrado: " + itemReq.produtoId });
    }

    if (produtoEncontrado.estoque < itemReq.quantidade) {
      return res.status(400).json({ erro: "estoque insuficiente para " + produtoEncontrado.nome });
    }

    var precoItem = produtoEncontrado.preco * itemReq.quantidade;

    // desconto por quantidade, cheio de numero magico e condicional aninhada
    if (itemReq.quantidade >= 10) {
      precoItem = precoItem - precoItem * 0.15;
    } else {
      if (itemReq.quantidade >= 5) {
        precoItem = precoItem - precoItem * 0.1;
      } else {
        if (itemReq.quantidade >= 3) {
          precoItem = precoItem - precoItem * 0.05;
        }
      }
    }

    subtotal = subtotal + precoItem;

    itensPedido.push({
      produtoId: produtoEncontrado.id,
      nome: produtoEncontrado.nome,
      quantidade: itemReq.quantidade,
      precoUnitario: produtoEncontrado.preco,
      precoTotal: precoItem,
    });

    produtoEncontrado.estoque = produtoEncontrado.estoque - itemReq.quantidade;
  }

  // desconto de cliente vip duplica logica parecida com a de cima
  var descontoCliente = 0;
  if (cliente.tipo == "vip") {
    if (subtotal > 1000) {
      descontoCliente = subtotal * 0.1;
    } else {
      if (subtotal > 500) {
        descontoCliente = subtotal * 0.05;
      }
    }
  }

  // calculo de frete cheio de numero magico baseado na cidade
  var frete = 0;
  if (cliente.cidade == "Campo Grande") {
    frete = 15;
  } else if (cliente.cidade == "Sao Paulo") {
    frete = 25;
  } else if (cliente.cidade == "Curitiba") {
    frete = 30;
  } else {
    frete = 40;
  }

  if (subtotal > 300) {
    frete = 0;
  }

  var total = subtotal - descontoCliente + frete;

  var pedido = {
    id: proximoIdPedido,
    clienteId: cliente.id,
    clienteNome: cliente.nome,
    itens: itensPedido,
    subtotal: subtotal,
    descontoCliente: descontoCliente,
    frete: frete,
    total: total,
    status: "pendente",
    data: new Date().toISOString(),
  };

  proximoIdPedido = proximoIdPedido + 1;
  pedidos.push(pedido);

  res.json(pedido);
});

app.get("/pedidos", function (req, res) {
  res.json(pedidos);
});

app.get("/pedidos/:id", function (req, res) {
  var encontrado = null;
  for (var i = 0; i < pedidos.length; i++) {
    if (pedidos[i].id == req.params.id) {
      encontrado = pedidos[i];
    }
  }
  if (encontrado == null) {
    return res.status(404).json({ erro: "pedido nao encontrado" });
  }
  res.json(encontrado);
});

// atualiza status do pedido, com regras de transicao escritas em cascata de ifs
app.put("/pedidos/:id/status", function (req, res) {
  var novoStatus = req.body.status;
  var encontrado = null;

  for (var i = 0; i < pedidos.length; i++) {
    if (pedidos[i].id == req.params.id) {
      encontrado = pedidos[i];
    }
  }

  if (encontrado == null) {
    return res.status(404).json({ erro: "pedido nao encontrado" });
  }

  if (encontrado.status == "pendente") {
    if (novoStatus == "pago" || novoStatus == "cancelado") {
      encontrado.status = novoStatus;
    } else {
      return res.status(400).json({ erro: "transicao invalida" });
    }
  } else if (encontrado.status == "pago") {
    if (novoStatus == "enviado" || novoStatus == "cancelado") {
      encontrado.status = novoStatus;
    } else {
      return res.status(400).json({ erro: "transicao invalida" });
    }
  } else if (encontrado.status == "enviado") {
    if (novoStatus == "entregue") {
      encontrado.status = novoStatus;
    } else {
      return res.status(400).json({ erro: "transicao invalida" });
    }
  } else {
    return res.status(400).json({ erro: "pedido nao pode mudar de status" });
  }

  res.json(encontrado);
});

var PORTA = 3000;
app.listen(PORTA, function () {
  console.log("Servidor rodando na porta " + PORTA);
});
