// INDEX.HTML

async function enviarAgendamento() {
    const nomeInput = document.querySelector('input[type="text"]').value;
    const telefoneInput = document.querySelector('input[type="tel"]').value;

    if (!nomeInput || !telefoneInput) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        // Usamos o API_URL que definimos no config.js
        const resposta = await fetch(`${API_URL}/agendar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nomeInput, telefone: telefoneInput })
        });

        if (resposta.ok) {
            const mensagem = encodeURIComponent(`Olá! Meu nome é ${nomeInput}. Gostaria de agendar uma avaliação na clínica.`);
            // Usamos o NUMERO_DA_CLINICA que definimos no config.js
            const urlWhatsapp = `https://wa.me/${NUMERO_DA_CLINICA}?text=${mensagem}`;

            window.open(urlWhatsapp, '_blank');
            alert("Dados salvos e redirecionando para o WhatsApp!");
        } else {
            alert("Erro ao salvar os dados no sistema.");
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("O sistema está temporariamente indisponível. Tente novamente em instantes.");
    }
}

// async function enviarAgendamento() {
//     const nomeInput = document.querySelector('input[type="text"]').value;
//     const telefoneInput = document.querySelector('input[type="tel"]').value;
            
//     // 1. O número do WhatsApp da sua clínica (ex: 55 + DDD + Numero)
//     const NUMERO_DA_CLINICA = "88994602909"; 

//     try {
//         // 2. Primeiro, enviamos para o seu Banco de Dados (Node.js)
//         const resposta = await fetch('${API_URL}/agendar', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ nome: nomeInput, telefone: telefoneInput })
//         });

//         if (resposta.ok) {
//             // 3. Se salvou no banco, agora preparamos a mensagem do WhatsApp
//             const mensagem = encodeURIComponent(`Olá! Meu nome é ${nomeInput}. Gostaria de agendar uma avaliação na clínica.`);
//             const urlWhatsapp = `https://wa.me/${NUMERO_DA_CLINICA}?text=${mensagem}`;

//             // 4. Abre o WhatsApp em uma nova aba
//             window.open(urlWhatsapp, '_blank');
                    
//             alert("Dados salvos e redirecionando para o WhatsApp!");
//         } else {
//             alert("Erro ao salvar os dados no sistema.");
//         }
//     } catch (erro) {
//         alert("O servidor está desligado. Ligue o 'node server.js' no terminal.");
//             }
// }

//LOGIN.HTML

// async function fazerLogin() {
//     const email = document.getElementById('email').value;
//     const senha = document.getElementById('senha').value;

//     const resposta = await fetch('${API_URL}/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, senha })
//     });

//     const dados = await resposta.json();

//     if (dados.autorizado) {
//         // Salva que o usuário está logado no navegador
//         localStorage.setItem('logado', 'true');
//         window.location.href = 'admin.html';
//     } else {
//         alert(dados.erro);
//     }
// }

//ADMIN.HTML

// Verifica se o usuário passou pelo login
// if (localStorage.getItem('logado') !== 'true') {
//     window.location.href = 'login.html';
// }

// Opcional: Função de Logout
// function logout() {
//     localStorage.removeItem('logado');
//     window.location.href = 'login.html';
// }

// async function salvarValor(id) {
//     const valor = document.getElementById(`input-${id}`).value;
//     await fetch(`${API_URL}/pacientes/${id}/valor`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ valor: valor })
//     });
//     alert("Valor salvo!");
//     carregarDados();
// }

// async function carregarDados() {
//     const resposta = await fetch('${API_URL}/pacientes');
//     const pacientes = await resposta.json();
//     const tabela = document.getElementById('tabela-pacientes');
//     let total = 0;
            
//     tabela.innerHTML = '';
//     pacientes.forEach(p => {
//         total += parseFloat(p.valor_consulta || 0);
//         // Dentro do seu pacientes.forEach no admin.html
//         tabela.innerHTML += `
//             <tr class="border-b hover:bg-gray-50">
//                 <td class="px-6 py-4">${p.nome}</td>
//                 <td class="px-6 py-4">
//                     <input type="number" id="input-valor-${p.id}" value="${p.valor_consulta}" class="border rounded p-1 w-20">
//                     <button onclick="salvarValor('${p.id}')" class="text-blue-600 ml-2">💾</button>
//                 </td>
//                 <td class="px-6 py-4">
//                     <input type="datetime-local" id="input-data-${p.id}" 
//                         value="${p.data_consulta ? p.data_consulta.substring(0,16) : ''}" 
//                         class="border rounded p-1">
//                     <button onclick="salvarData('${p.id}')" class="text-green-600 ml-2">📅</button>
//                     <button onclick="excluirPaciente('${p.id}')" class="text-red-600 ml-4 hover:text-red-800">🗑️</button>
//                 </td>
//             </tr>
//         `;
//     });
//     document.getElementById('total-faturamento').innerText = 
//         new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
// }

// async function salvarData(id) {
//     const dataValue = document.getElementById(`input-data-${id}`).value;
//     await fetch(`${API_URL}/pacientes/${id}/data`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ data: dataValue })
//     });
//     alert("Data agendada com sucesso!");
// }

// async function excluirPaciente(id) {
//     if (confirm("Tem certeza que deseja excluir este paciente?")) {
//         await fetch(`${API_URL}/pacientes/${id}`, { method: 'DELETE' });
//         carregarDados(); // Atualiza a lista
//     }
// }

// carregarDados();

// //AGENDA.HTML

// document.addEventListener('DOMContentLoaded', async function() {
//     const calendarEl = document.getElementById('calendar');
            
//     // Buscamos os dados do nosso servidor
//     const resposta = await fetch('${API_URL}/agenda');
//     const eventos = await resposta.json();

//     const calendar = new FullCalendar.Calendar(calendarEl, {
//         initialView: 'dayGridMonth',
//         locale: 'pt-br',
//         headerToolbar: {
//             left: 'prev,next today',
//             center: 'title',
//             right: 'dayGridMonth,timeGridWeek,timeGridDay'
//         },
//         events: eventos, // Aqui o calendário carrega os dados do banco!
//         eventClick: function(info) {
//             alert('Paciente: ' + info.event.title);
//         }
//     });

//     calendar.render();
// });
1
2
3
4
5
6
7
8
9
10