// dolar

const url = "https://economia.awesomeapi.com.br/last/";
const coins = "USD-BRL,EUR-BRL";

fetch(url + coins)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const dolarReal = data.USDBRL;
    const euroReal = data.EURBRL;

    let estaData = new Date(dolarReal.create_date);

    document.getElementById("title").innerHTML = dolarReal.name;
    document.getElementById("thisdate").innerHTML = estaData.toLocaleString();
    document.getElementById("maxvalue").innerHTML = parseFloat(
      dolarReal.high
    ).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
    document.getElementById("minvalue").innerHTML = parseFloat(
      dolarReal.low
    ).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  });


  
// search bar

// Função para realizar a pesquisa
function search() {
  // Obtém o texto da barra de pesquisa
  let textToSearch = document.getElementById("text-to-search").value;

  // Escapa caracteres especiais para usar na expressão regular
  textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Cria uma expressão regular com a opção "gi" (global e insensível a maiúsculas/minúsculas)
  let pattern = new RegExp(textToSearch, "gi");

  // Chama a função para destacar o texto
  highlightText(pattern);
}

// Função para destacar o texto em um parágrafo
function highlightText(pattern) {
  let paragraph = document.getElementById("paragraph");
  let originalText = paragraph.textContent;

  // Remove quaisquer marcações anteriores
  let highlightedText = originalText.replace(/<\/?mark>/gi, "");

  // Aplica a marcação ao texto correspondente
  highlightedText = highlightedText.replace(
    pattern,
    (match) => `<mark>${match}</mark>`
  );

  // Define o conteúdo do parágrafo
  paragraph.textContent = "";
  paragraph.innerHTML = highlightedText;
}
