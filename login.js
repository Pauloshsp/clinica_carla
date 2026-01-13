// login.js

async function fazerLogin() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        // Agora usando a variável global API_URL do config.js
        const resposta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (dados.autorizado) {
            // Salva que o usuário está logado no navegador
            localStorage.setItem('logado', 'true');
            window.location.href = 'admin.html';
        } else {
            alert(dados.erro || "E-mail ou senha incorretos.");
        }
    } catch (erro) {
        console.error("Erro ao fazer login:", erro);
        alert("Erro de conexão com o servidor.");
    }
}