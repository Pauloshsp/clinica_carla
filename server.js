const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão com o Banco de Dados
const { Pool } = require('pg');

// Se existir a variável na nuvem, ele usa ela. Se não, usa o seu localhost (para testes).
const isProduction = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: isProduction || 'postgres://postgres:1234@localhost:5432/sistema_carla',
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Rota para receber o agendamento do site
app.post('/agendar', async (req, res) => {
    const { nome, telefone } = req.body;

    try {
        // Insere o paciente no banco de dados
        const novoPaciente = await pool.query(
            'INSERT INTO pacientes (nome, telefone) VALUES ($1, $2) RETURNING *',
            [nome, telefone]
        );
        
        console.log("Paciente cadastrado:", novoPaciente.rows[0]);
        res.status(200).json({ mensagem: "Agendamento recebido com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao salvar no banco" });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000!");
});

// Rota para LISTAR todos os pacientes cadastrados
app.get('/pacientes', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM pacientes ORDER BY data_cadastro DESC');
        res.status(200).json(resultado.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar pacientes" });
    }
});

// Rota para atualizar o valor da consulta de um paciente
app.put('/pacientes/:id/valor', async (req, res) => {
    const { id } = req.params;
    const { valor } = req.body;

    try {
        await pool.query(
            'UPDATE pacientes SET valor_consulta = $1 WHERE id = $2',
            [valor, id]
        );
        res.status(200).json({ mensagem: "Valor atualizado!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao salvar valor" });
    }
});

// Rota de Login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
            [email, senha]
        );

        if (usuario.rows.length > 0) {
            // Se achou o usuário, retorna sucesso
            res.status(200).json({ mensagem: "Login realizado!", autorizado: true });
        } else {
            res.status(401).json({ erro: "E-mail ou senha incorretos" });
        }
    } catch (err) {
        res.status(500).json({ erro: "Erro no servidor" });
    }
});

// Rota para o Calendário
app.get('/agenda', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT nome as title, data_consulta as start, id FROM pacientes WHERE data_consulta IS NOT NULL');
        res.status(200).json(resultado.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar agenda" });
    }
});

app.put('/pacientes/:id/data', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    try {
        await pool.query(
            'UPDATE pacientes SET data_consulta = $1 WHERE id = $2',
            [data, id]
        );
        res.status(200).json({ mensagem: "Data agendada!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao salvar data" });
    }
});

app.delete('/pacientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);
        res.status(200).json({ mensagem: "Paciente removido!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao excluir" });
    }
});