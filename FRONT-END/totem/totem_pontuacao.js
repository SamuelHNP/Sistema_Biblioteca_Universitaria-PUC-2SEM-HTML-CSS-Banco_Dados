// URL base da API de pontuação no backend
const API_URL = "http://localhost:3000/api/pontuacao";

// Função chamada quando o usuário clica no botão "Consultar"
async function consultar() {

    // Captura o valor digitado no campo de RA e remove espaços extras
    const ra = document.getElementById("ra").value.trim();

    // Seleciona a div onde o resultado será exibido
    const resultado = document.getElementById("resultado");

    // Mensagem inicial enquanto consulta o servidor
    resultado.innerHTML = "Consultando...";
    resultado.style.color = "blue";

    try {
        // Faz a requisição para o backend buscando o RA informado
        const res = await fetch(`${API_URL}/${ra}`);

        // Converte a resposta do servidor em JSON
        const json = await res.json();

        // Se o servidor respondeu com erro (ex: RA não encontrado)
        if (!res.ok) {
            resultado.innerHTML = json.mensagem; // mostra mensagem de erro
            resultado.style.color = "red";
            return; // para a função e não executa abaixo
        }

        // Caso tenha encontrado o aluno, exibe suas informações
        resultado.innerHTML = `
            <strong>Nome:</strong> ${json.nome}<br>
            <strong>RA:</strong> ${json.ra}<br>
            <strong>Pontos:</strong> ${json.pontuacao}
        `;
        resultado.style.color = "green"; // cor de sucesso

    } catch (err) {
        // Em caso de falha na conexão com o servidor (backend desligado, erro no fetch)
        resultado.innerHTML = "Erro ao conectar ao servidor.";
        resultado.style.color = "red";
    }
}
