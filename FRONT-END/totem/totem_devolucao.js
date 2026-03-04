// ============================
// URL da API de devolução
// ============================
const API_URL_DEV = "http://localhost:3000/api/devolucao"; 
// Esta URL aponta para a rota do backend responsável por registrar devoluções.
// Se a rota mudar, você só precisa alterar aqui.


// ============================
// Função para limpar erros visuais
// ============================
function limparErros() {
    document.querySelectorAll("input").forEach(i => i.classList.remove("campo-invalido"));
    // Remove a classe CSS de erro ("campo-invalido") dos inputs.
    // Isso garante que, ao tentar enviar novamente, os erros visuais sejam resetados.
}


// ============================
// Função para exibir o modal
// ============================
function mostrarModal(msg) {
    const modal = document.getElementById("modal");
    const txt = document.getElementById("modal-texto");
    const ok = document.getElementById("btn-ok");

    txt.innerHTML = msg;        // Define o texto da mensagem no modal
    modal.style.display = "flex"; // Exibe o modal

    ok.onclick = () => modal.style.display = "none"; 
    // O botão OK fecha o modal quando clicado.
}


// ============================
// Validação dos campos do formulário
// ============================
function validarCampos() {
    limparErros(); // Limpa erros antes de validar

    const ra = document.getElementById("ra");
    const codigo = document.getElementById("codigo");
    let valido = true;

    // Verifica se o RA está vazio
    if (ra.value.trim() === "") {
        ra.classList.add("campo-invalido"); // adiciona borda vermelha
        valido = false;
    }

    // Verifica se o código do livro está vazio
    if (codigo.value.trim() === "") {
        codigo.classList.add("campo-invalido");
        valido = false;
    }

    return valido; // retorna true se tudo estiver válido
}


// ============================
// Evento principal: Envio do formulário de devolução
// ============================
document.getElementById("form-devolucao").addEventListener("submit", async (e) => {
    e.preventDefault(); // impede recarregar a página

    // Validação dos dados
    if (!validarCampos()) {
        mostrarModal("Preencha corretamente o RA e o código do livro.");
        return;
    }

    // Dados enviados ao backend
    const dados = {
        ra: document.getElementById("ra").value.trim(),
        codigo: document.getElementById("codigo").value.trim()
    };

    try {
        // Envia um request POST para registrar a devolução
        const resposta = await fetch(API_URL_DEV, {
            method: "POST", // método usado para enviar dados
            headers: {"Content-Type": "application/json"}, // indica que está enviando JSON
            body: JSON.stringify(dados) // transforma o objeto JS em JSON
        });

        const json = await resposta.json(); // recebe resposta da API em JSON

        // Se o servidor retornar erro (status != 200)
        if (!resposta.ok) {
            mostrarModal(json.mensagem || "Erro ao processar devolução.");
            return;
        }

        // Se chegou aqui → sucesso
        mostrarModal(json.mensagem || "Devolução registrada com sucesso!");

        // Limpa o formulário após devolver
        document.getElementById("form-devolucao").reset();

    } catch (err) {
        // Erro de conexão com backend
        console.error("Erro na devolução:", err);
        mostrarModal("Não foi possível conectar ao servidor.");
    }
});
