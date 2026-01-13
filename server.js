// require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DO BANCO DE DADOS
const isProduction = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false // O Supabase Pooler já lida com a segurança na porta 5432/6543
});

// const pool = new Pool({
//     // Usa a URL do Render se estiver online, ou o seu computador se estiver offline
//     connectionString: isProduction || 'postgres://postgres:1234@localhost:5432/sistema_carla',
//     ssl: isProduction ? { rejectUnauthorized: false } : false
// });

// --- ROTAS DO SISTEMA ---

// 1. Receber agendamento do site
app.post('/agendar', async (req, res) => {
    const { nome, telefone } = req.body;
    try {
        const novoPaciente = await pool.query(
            'INSERT INTO pacientes (nome, telefone) VALUES ($1, $2) RETURNING *',
            [nome, telefone]
        );
        res.status(200).json({ mensagem: "Agendamento recebido com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao salvar no banco" });
    }
});

// 2. Listar todos os pacientes
app.get('/pacientes', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM pacientes ORDER BY data_cadastro DESC');
        res.status(200).json(resultado.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar pacientes" });
    }
});

// 3. Atualizar valor da consulta
app.put('/pacientes/:id/valor', async (req, res) => {
    const { id } = req.params;
    const { valor } = req.body;
    try {
        await pool.query('UPDATE pacientes SET valor_consulta = $1 WHERE id = $2', [valor, id]);
        res.status(200).json({ mensagem: "Valor atualizado!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao salvar valor" });
    }
});

// 4. Login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, senha]);
        if (usuario.rows.length > 0) {
            res.status(200).json({ autorizado: true });
        } else {
            res.status(401).json({ erro: "E-mail ou senha incorretos" });
        }
    } catch (err) {
        res.status(500).json({ erro: "Erro no servidor" });
    }
});

// 5. Dados para a Agenda
app.get('/agenda', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT nome as title, data_consulta as start, id FROM pacientes WHERE data_consulta IS NOT NULL');
        res.status(200).json(resultado.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar agenda" });
    }
});

// 6. Atualizar data da consulta
app.put('/pacientes/:id/data', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    try {
        await pool.query('UPDATE pacientes SET data_consulta = $1 WHERE id = $2', [data, id]);
        res.status(200).json({ mensagem: "Data agendada!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao salvar data" });
    }
});

// 7. Excluir paciente
app.delete('/pacientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);
        res.status(200).json({ mensagem: "Paciente removido!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao excluir" });
    }
});

// ROTA DE EMERGÊNCIA PARA CRIAR TABELAS
app.get('/setup-banco', async (req, res) => {
    try {
        // Cria a tabela de pacientes
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pacientes (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                telefone VARCHAR(20) NOT NULL,
                valor_consulta DECIMAL(10,2),
                data_consulta TIMESTAMP,
                data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Cria a tabela de usuários
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(100) NOT NULL
            );
        `);

        // Cria o seu usuário de teste (Mude o email e senha aqui!)
        await pool.query(`
            INSERT INTO usuarios (email, senha) 
            VALUES ('admin@teste.com', '123456')
            ON CONFLICT (email) DO NOTHING;
        `);

        res.send("<h1>Tabelas criadas com sucesso!</h1>");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao criar tabelas: " + err.message);
    }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
// O Render define a porta automaticamente. Se não houver, usa a 10000.
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});