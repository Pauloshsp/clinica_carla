// agenda.js

document.addEventListener('DOMContentLoaded', async function() {
    const calendarEl = document.getElementById('calendar');
    
    // Se não encontrar o elemento do calendário, para o código aqui
    if (!calendarEl) return;

    try {
        // Buscamos os dados do nosso servidor usando a API_URL do config.js
        const resposta = await fetch(`${API_URL}/agenda`);
        const eventos = await resposta.json();

        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'pt-br',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            // O FullCalendar espera uma lista de objetos com 'title' e 'start'
            events: eventos, 
            eventClick: function(info) {
                alert('Paciente: ' + info.event.title);
            }
        });

        calendar.render();
    } catch (erro) {
        console.error("Erro ao carregar calendário:", erro);
        alert("Não foi possível carregar os compromissos.");
    }
});