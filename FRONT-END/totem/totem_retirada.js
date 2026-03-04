// ===================== URL DAS APIs =====================
// Endereço da rota que registra retirada de livros
const API_URL = "http://localhost:3000/api/retirada";

// Endereço da rota que lista somente os livros disponíveis
const API_LIVROS = "http://localhost:3000/api/livros/disponiveis";


/**
 * Remove todas as marcações de erro dos campos input.
 * Usado antes de validar ou exibir novas mensagens de erro.
 */
function limparErros() {
    document.querySelectorAll("input").forEach(c => c.classList.remove("campo-invalido"));
}

/**
 * Exibe um modal de mensagem na tela.
 * @param {string} msg - Texto a ser mostrado dentro do modal.
 */
function mostrarModal(msg) {
    const modal = document.getElementById("modal");
    const texto = document.getElementById("modal-texto");
    const ok = document.getElementById("btn-ok");

    texto.innerHTML = msg; // insere a mensagem
    modal.style.display = "flex"; // exibe o modal

    // botão OK fecha o modal
    ok.onclick = () => modal.style.display = "none";
}

/**
 * Valida os campos RA e código do livro.
 * Marca como inválido caso estejam vazios.
 * @returns {boolean} - true se está tudo correto, false se algo está errado.
 */
function validarCampos() {
    limparErros();

    let ra = document.getElementById("ra");
    let codigo = document.getElementById("codigo");

    let valido = true;

    // RA deve ser preenchido
    if (ra.value.trim() === "") {
        ra.classList.add("campo-invalido");
        valido = false;
    }

    // Código do livro deve ser preenchido
    if (codigo.value.trim() === "") {
        codigo.classList.add("campo-invalido");
        valido = false;
    }

    return valido;
}


// ===================== LISTA DE LIVROS DISPONÍVEIS =====================

/**
 * Busca no backend a lista de livros disponíveis e exibe no HTML.
 * É chamada ao carregar a página e após cada retirada.
 */
async function carregarLivros() {
    const lista = document.getElementById("lista-livros");

    // Mensagem inicial enquanto carrega
    lista.innerHTML = '<li>Carregando livros...</li>';

    try {
        const response = await fetch(API_LIVROS);

        // Caso o servidor tenha retornado erro (404, 500, etc)
        if (!response.ok) {
            console.error("Erro na resposta do servidor:", response.status, response.statusText);
            lista.innerHTML = '<li>Não foi possível carregar os livros.</li>';
            return;
        }

        const livros = await response.json();

        // Garante que o retorno é um array válido
        if (!Array.isArray(livros)) {
            console.error("Resposta do servidor não é um array:", livros);
            lista.innerHTML = '<li>Não foi possível carregar os livros.</li>';
            return;
        }

        // Se não existir nenhum livro disponível
        if (livros.length === 0) {
            lista.innerHTML = '<li>Nenhum livro disponível</li>';
            return;
        }

        // Limpa antes de preencher
        lista.innerHTML = '';

        // Cria um <li> para cada livro disponível
        livros.forEach(livro => {
            const item = document.createElement("li");
            item.textContent = `Código: ${livro.codigo} - Título: ${livro.titulo}`;
            lista.appendChild(item);
        });

    } catch (error) {
        // Erros como: servidor offline, rota errada, internet desligada etc.
        console.error("Erro ao carregar livros:", error);
        lista.innerHTML = '<li>Não foi possível carregar os livros.</li>';
    }
}


// ===================== ENVIO DO FORMULÁRIO =====================

/**
 * Evento acionado quando o usuário envia o formulário de retirada.
 * Faz validação, envia para o backend e mostra mensagens para o usuário.
 */
document.getElementById("form-retirada").addEventListener("submit", async (e) => {
    e.preventDefault(); // impede recarregamento da página
    limparErros();

    // Se algum campo estiver inválido, exibe mensagem e cancela
    if (!validarCampos()) {
        mostrarModal("Preencha todos os campos corretamente.");
        return;
    }

    // Monta o objeto para enviar ao backend
    const dados = {
        ra: document.getElementById("ra").value,
        codigo: document.getElementById("codigo").value
    };

    try {
        // Envia os dados via POST
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dados)
        });

        // Lê o JSON da resposta
        const json = await resposta.json();

        // Se o servidor retornou erro (400, 404, 409, etc)
        if (!resposta.ok) {
            mostrarModal(json.mensagem || "Erro ao registrar retirada.");
            return;
        }

        // Deu certo 
        mostrarModal("Retirada registrada com sucesso!");

        document.getElementById("form-retirada").reset();

        // Atualiza lista após a retirada (livro deixa de estar disponível)
        carregarLivros();

    } catch (erro) {
        // Erro de conexão com backend (servidor offline, rota errada etc)
        console.error("Erro ao enviar retirada:", erro);
        mostrarModal("Falha ao conectar ao servidor.");
    }
});


// ===================== INICIALIZAÇÃO DA PÁGINA =====================

/**
 * Quando a página termina de carregar,
 * automaticamente carrega os livros disponíveis.
 */
window.addEventListener("DOMContentLoaded", () => {
    carregarLivros();
});
