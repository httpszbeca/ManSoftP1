var API_URL = "http://localhost:3000";
var listaDeProdutosCarregada = [];
var listaDeClientesCarregada = [];
var contadorDeLinhasDeItem = 0;

function mostrarAba(nome) {
  document.getElementById("aba-produtos").style.display = "none";
  document.getElementById("aba-novoPedido").style.display = "none";
  document.getElementById("aba-pedidos").style.display = "none";

  document.getElementById("aba-" + nome).style.display = "block";

  if (nome == "produtos") {
    carregarProdutos();
  }
  if (nome == "novoPedido") {
    carregarProdutosParaSelect();
    carregarClientesParaSelect();
  }
  if (nome == "pedidos") {
    carregarPedidos();
  }
}

// -------- PRODUTOS --------

function carregarProdutos() {
  fetch(API_URL + "/produtos")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      listaDeProdutosCarregada = data;
      var html = "";
      for (var i = 0; i < data.length; i++) {
        html =
          html +
          '<div class="produto-card"><b>' +
          data[i].nomeProduto +
          "</b><br/>Preco: R$ " +
          data[i].precoProduto.toFixed(2) +
          "<br/>Categoria: " +
          data[i].categoria +
          "<br/>Estoque: " +
          data[i].estoque +
          "</div>";
      }
      document.getElementById("listaProdutos").innerHTML = html;
    });
}

function carregarProdutosParaSelect() {
  fetch(API_URL + "/produtos")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      listaDeProdutosCarregada = data;
    });
}

function carregarClientesParaSelect() {
  fetch(API_URL + "/clientes")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      listaDeClientesCarregada = data;
      var select = document.getElementById("selectCliente");
      var html = "";
      for (var i = 0; i < data.length; i++) {
        html =
          html +
          '<option value="' +
          data[i].id +
          '">' +
          data[i].clienteNome +
          " (" +
          data[i].tipo +
          ")</option>";
      }
      select.innerHTML = html;
    });
}

// -------- NOVO PEDIDO --------

function adicionarLinhaItem() {
  contadorDeLinhasDeItem = contadorDeLinhasDeItem + 1;
  var id = contadorDeLinhasDeItem;

  var div = document.createElement("div");
  div.className = "linha-item";
  div.id = "linha-" + id;

  var opcoes = "";
  for (var i = 0; i < listaDeProdutosCarregada.length; i++) {
    opcoes =
      opcoes +
      '<option value="' +
      listaDeProdutosCarregada[i].id +
      '">' +
      listaDeProdutosCarregada[i].nomeProduto +
      "</option>";
  }

  div.innerHTML =
    '<select id="produto-' +
    id +
    '">' +
    opcoes +
    '</select> Qtd: <input type="number" id="qtd-' +
    id +
    '" value="1" style="width:50px" />' +
    ' <button onclick="removerLinha(' +
    id +
    ')">remover</button>';

  document.getElementById("itensPedido").appendChild(div);
}

function removerLinha(id) {
  var el = document.getElementById("linha-" + id);
  el.parentNode.removeChild(el);
}

function enviarPedido() {
  var clienteId = document.getElementById("selectCliente").value;
  var itens = [];

  for (var i = 1; i <= contadorDeLinhasDeItem; i++) {
    var selectEl = document.getElementById("produto-" + i);
    var qtdEl = document.getElementById("qtd-" + i);
    if (selectEl != null && qtdEl != null) {
      itens.push({
        produtoId: parseInt(selectEl.value),
        quantidade: parseInt(qtdEl.value),
      });
    }
  }

  fetch(API_URL + "/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clienteId: parseInt(clienteId), itens: itens }),
  })
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      if (data.erro) {
        document.getElementById("resultadoPedido").innerHTML =
          '<p style="color:red">Erro: ' + data.erro + "</p>";
      } else {
        document.getElementById("resultadoPedido").innerHTML =
          '<p style="color:green">Pedido #' +
          data.id +
          " criado! Total: R$ " +
          data.total.toFixed(2) +
          "</p>";
      }
    });
}

// -------- PEDIDOS --------

function carregarPedidos() {
  fetch(API_URL + "/pedidos")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      var html = "";
      for (var i = 0; i < data.length; i++) {
        var pedido = data[i];
        var itensHtml = "";
        for (var j = 0; j < pedido.itens.length; j++) {
          itensHtml =
            itensHtml +
            "<li>" +
            pedido.itens[j].quantidade +
            "x " +
            pedido.itens[j].nomeProduto +
            " - R$ " +
            pedido.itens[j].precoTotal.toFixed(2) +
            "</li>";
        }

        html =
          html +
          '<div class="pedido-card">' +
          "<b>Pedido #" +
          pedido.id +
          "</b> - " +
          pedido.clienteNome +
          ' - <span class="status-' +
          pedido.status +
          '">' +
          pedido.status +
          "</span><br/>" +
          "<ul>" +
          itensHtml +
          "</ul>" +
          "Subtotal: R$ " +
          pedido.subtotal.toFixed(2) +
          " | Desconto: R$ " +
          pedido.descontoCliente.toFixed(2) +
          " | Frete: R$ " +
          pedido.frete.toFixed(2) +
          " | <b>Total: R$ " +
          pedido.total.toFixed(2) +
          "</b><br/>" +
          gerarBotoesDeStatus(pedido) +
          "</div>";
      }
      document.getElementById("listaPedidos").innerHTML = html;
    });
}

function gerarBotoesDeStatus(pedido) {
  var botoes = "";
  if (pedido.status == "pendente") {
    botoes =
      botoes +
      '<button onclick="mudarStatus(' +
      pedido.id +
      ",'pago')\">Marcar como pago</button> " +
      '<button onclick="mudarStatus(' +
      pedido.id +
      ",'cancelado')\">Cancelar</button>";
  } else if (pedido.status == "pago") {
    botoes =
      botoes +
      '<button onclick="mudarStatus(' +
      pedido.id +
      ",'enviado')\">Marcar como enviado</button>";
  } else if (pedido.status == "enviado") {
    botoes =
      botoes +
      '<button onclick="mudarStatus(' +
      pedido.id +
      ",'entregue')\">Marcar como entregue</button>";
  }
  return botoes;
}

function mudarStatus(id, novoStatus) {
  fetch(API_URL + "/pedidos/" + id + "/status", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: novoStatus }),
  })
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      carregarPedidos();
    });
}

// carrega produtos assim que a pagina abre
carregarProdutos();
