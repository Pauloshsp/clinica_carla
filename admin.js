// admin.js

// 1. Segurança: Verifica se está logado
if (localStorage.getItem('logado') !== 'true') {
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('logado');
    window.location.href = 'login.html';
}

// 2. Carregar dados do banco (GET)
async function carregarDados() {
    try {
        const resposta = await fetch(`${API_URL}/pacientes`);
        const pacientes = await resposta.json();
        const tabela = document.getElementById('tabela-pacientes');
        let total = 0;
        
        tabela.innerHTML = '';
        pacientes.forEach(p => {
            total += parseFloat(p.valor_consulta || 0);
            tabela.innerHTML += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-6 py-4">${p.nome}</td>
                    <td class="px-6 py-4">
                        <input type="number" id="input-valor-${p.id}" value="${p.valor_consulta || 0}" class="border rounded p-1 w-20">
                        <button onclick="salvarValor('${p.id}')" class="text-blue-600 ml-2">💾</button>
                    </td>
                    <td class="px-6 py-4">
                        <input type="datetime-local" id="input-data-${p.id}" 
                            value="${p.data_consulta ? p.data_consulta.substring(0,16) : ''}" 
                            class="border rounded p-1">
                        <button onclick="salvarData('${p.id}')" class="text-green-600 ml-2">📅</button>
                        <button onclick="excluirPaciente('${p.id}')" class="text-red-600 ml-4 hover:text-red-800">🗑️</button>
                    </td>
                </tr>
            `;
        });
        document.getElementById('total-faturamento').innerText = 
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

// 3. Salvar Valor (PUT)
async function salvarValor(id) {
    const valor = document.getElementById(`input-valor-${id}`).value;
    await fetch(`${API_URL}/pacientes/${id}/valor`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor: valor })
    });
    alert("Valor salvo!");
    carregarDados();
}

// 4. Salvar Data (PUT)
async function salvarData(id) {
    const dataValue = document.getElementById(`input-data-${id}`).value;
    await fetch(`${API_URL}/pacientes/${id}/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataValue })
    });
    alert("Data agendada com sucesso!");
}

// 5. Excluir (DELETE)
async function excluirPaciente(id) {
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
        await fetch(`${API_URL}/pacientes/${id}`, { method: 'DELETE' });
        carregarDados();
    }
}

// Inicia a página carregando os dados
carregarDados();