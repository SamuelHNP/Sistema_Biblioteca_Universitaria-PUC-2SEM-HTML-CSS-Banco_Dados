// URL base da API onde o backend está rodando
const API_URL = 'http://localhost:3000/api/alunos';

// ---------------------------
// FUNÇÕES DO MODAL
// ---------------------------
function mostrarModal(mensagem) {
    const modal = document.getElementById('modal');
    const modalTexto = document.getElementById('modal-texto');
    const btnOk = document.getElementById('btn-ok');

    modalTexto.innerHTML = mensagem;
    modal.style.display = 'flex';

    btnOk.onclick = () => modal.style.display = 'none';
}

// ---------------------------
// FUNÇÃO PARA LIMPAR CAMPOS INVÁLIDOS
// ---------------------------
function limparErros() {
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('campo-invalido');
    });
}

// ---------------------------
// FUNÇÃO DE VALIDAÇÃO SIMPLES PARA LOGIN
// ---------------------------
function validarCamposLogin(ra, cpf) {
    let valido = true;
    limparErros();

    if (!ra) {
        document.getElementById('ra').classList.add('campo-invalido');
        valido = false;
    }
    if (!cpf) {
        document.getElementById('cpf').classList.add('campo-invalido');
        valido = false;
    }

    return valido;
}

// ---------------------------
// ENVIO DO FORMULÁRIO DE LOGIN
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".formulario");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const ra = document.getElementById("ra").value.trim();
        const cpf = document.getElementById("cpf").value.trim();

        // Validação simples
        if (!validarCamposLogin(ra, cpf)) {
            mostrarModal("Preencha RA e CPF!");
            return;
        }

        try {
            const resposta = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ra, cpf })
            });

            const data = await resposta.json();

            if (!resposta.ok) {
                // Caso RA ou CPF estejam incorretos
                mostrarModal(data.mensagem || "RA ou CPF inválidos");
                return;
            }

            // Login bem-sucedido → redireciona para a página do totem
            mostrarModal("Login realizado com sucesso!");
            setTimeout(() => {
                window.location.href = "../totem/totem_autoatendimento.html";
            }, 1500);

        } catch (erro) {
            mostrarModal("Erro ao conectar ao servidor");
            console.error("Erro de rede:", erro);
        }
    });
});
