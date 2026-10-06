const fs = require("fs");
const path = require("path");

const pastaAlvo = __dirname;

function limparArquivo(caminho) {
  const conteudoOriginal = fs.readFileSync(caminho, "utf8");

  const conteudoLimpo = conteudoOriginal.replace(
    // eslint-disable-next-line no-control-regex
    /[^\x09\x0A\x0D\x20-\x7E\u00C0-\u00FF]/g,
    ""
  );

  if (conteudoLimpo !== conteudoOriginal) {
    fs.writeFileSync(caminho, conteudoLimpo, "utf8");
    console.log("Limpo:", caminho);
  }
}

function percorrerPasta(pasta) {
  const itens = fs.readdirSync(pasta, { withFileTypes: true });
  itens.forEach((item) => {
    const caminhoCompleto = path.join(pasta, item.name);
    if (item.isDirectory() && item.name !== "node_modules") {
      percorrerPasta(caminhoCompleto);
    } else if (item.isFile() && item.name.endsWith(".js")) {
      limparArquivo(caminhoCompleto);
    }
  });
}

percorrerPasta(pastaAlvo);
console.log("Concluído.");
