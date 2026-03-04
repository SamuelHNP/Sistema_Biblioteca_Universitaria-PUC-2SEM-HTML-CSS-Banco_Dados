// Importa a biblioteca mysql2 para criar conexões com o MySQL.
const mysql = require('mysql2');

// CONFIGURAÇÃO DA CONEXÃO

const db = mysql.createConnection({
    host: '',      
    user: '',           
    password: '', 
    database: 'sbu'         
});

/*
Tenta conectar ao banco de dados e retorna uma Promise.
 */
async function connectDB() {
    // Retorna uma nova Promise para poder usar ao iniciar o servidor.
    return new Promise((resolve, reject) => {
        // Tenta efetivamente conectar usando o objeto db criado acima.
        db.connect((err) => {
            // Se ocorrer um erro durante a conexão.
            if (err) {
                
                console.error('ERRO: Não foi possível conectar ao MySQL:', err.message);
                
                console.error('>> Verifique se o banco de dados "sbu" existe e se o MySQL está rodando.');
                
                return reject(err); 
            }
            // Se não houve erro, conexão estabelecida com sucesso.
            console.log('Conectado ao MySQL "sbu" com sucesso!');

            resolve(db);
        });
    });
}

// EXPORTAÇÃO

// Exporta o objeto de conexão (db) e a função connectDB para que outros arquivos
module.exports = { 
    db,         
    connectDB    // Função assíncrona para testar/conectar antes de iniciar o servidor
};
