// BACK-END/database.js (CÓDIGO CORRETO PARA MYSQL/mysql2 - BANCO: sbu)

const mysql = require('mysql2');

// -----------------------------------------------------
// 1. CONFIGURAÇÃO DA CONEXÃO
// -----------------------------------------------------

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',      // Endereço do seu servidor MySQL (padrão)
    user: 'root',           // Seu usuário do MySQL
    password: 'Samu25052006*',           // Sua senha do MySQL (deixe em branco se for o padrão XAMPP/WAMP sem senha)
    database: 'sbu'         // <<<<<<< CORRIGIDO: Nome do seu banco de dados é 'sbu'
});


// -----------------------------------------------------
// 2. FUNÇÃO PARA CONECTAR E TESTAR
// -----------------------------------------------------

/**
 * Tenta conectar ao banco de dados e retorna uma Promise.
 */
async function connectDB() {
    return new Promise((resolve, reject) => {
        db.connect((err) => {
            if (err) {
                // Se der erro (ex: credenciais erradas, MySQL não rodando)
                console.error('ERRO: Não foi possível conectar ao MySQL:', err.message);
                // Adiciona um aviso sobre o nome do banco
                console.error('>> Verifique se o banco de dados "sbu" existe e se o MySQL está rodando.');
                return reject(err); 
            }
            console.log('Conectado ao MySQL "sbu" com sucesso!');
            resolve(db); // A conexão está pronta para uso
        });
    });
}

// -----------------------------------------------------
// 3. EXPORTAÇÃO
// -----------------------------------------------------

// Exporta o objeto de conexão (db) e a função de teste (connectDB)
module.exports = { 
    db, 
    connectDB 
};