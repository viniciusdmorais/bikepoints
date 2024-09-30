const racer1 = document.getElementById('racer1');
const racer2 = document.getElementById('racer2');

const score1Input = document.getElementById('score1Input');
const score2Input = document.getElementById('score2Input');

const addPoints1 = document.getElementById('addPoints1');
const addPoints2 = document.getElementById('addPoints2');
const saveScores = document.getElementById('saveScores');

const dayOfWeekElement = document.getElementById('dayOfWeek');

// Carregar pontuações ao abrir a página
window.onload = loadScores;

addPoints1.addEventListener('click', function() {
    updateScore(score1Input, 2);
});

addPoints2.addEventListener('click', function() {
    updateScore(score2Input, 2);
});

saveScores.addEventListener('click', saveScoresToFile);

score1Input.addEventListener('input', moveRacers);
score2Input.addEventListener('input', moveRacers);

function updateScore(inputField, points) {
    let currentScore = parseInt(inputField.value) || 0;
    currentScore += points;

    if (currentScore > 10) {
        currentScore = 10;
        alert("Pontuação máxima atingida!");
    }

    inputField.value = currentScore;
    moveRacers();
}

function moveRacers() {
    const trackWidth = document.querySelector('.race-track').clientWidth - racer1.clientWidth;

    const score1 = parseInt(score1Input.value) || 0;
    const score2 = parseInt(score2Input.value) || 0;

    const distance1 = (score1 / 10) * trackWidth;
    const distance2 = (score2 / 10) * trackWidth;

    racer1.style.transform = `translateX(${distance1}px)`;
    racer2.style.transform = `translateX(${distance2}px)`;

    if (score1 === 10) {
        alert("Brabo venceu!");
        resetRace();
    } else if (score2 === 10) {
        alert("Gabriel venceu!");
        resetRace();
    }
}

function resetRace() {
    score1Input.value = '0';
    score2Input.value = '0';
    
    moveRacers();
}

function getDayOfWeek() {
    const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const currentDate = new Date();
    const dayIndex = currentDate.getDay();
    return daysOfWeek[dayIndex];
}

dayOfWeekElement.textContent = getDayOfWeek();

function saveScoresToFile() {
    const scores = {
        ciclista1: parseInt(score1Input.value) || 0,
        ciclista2: parseInt(score2Input.value) || 0,
        dia: getDayOfWeek()
    };

    // Cria um Blob com os dados JSON
    const blob = new Blob([JSON.stringify(scores, null, 4)], { type: 'application/json' });
    
    // Cria um link temporário para download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pontuacoes.json'; // Nome do arquivo que será baixado
    link.click();
    
    URL.revokeObjectURL(link.href); // Limpa o objeto URL após o download
}

// Função para carregar pontuações do arquivo JSON
function loadScores() {
    fetch('pontuacoes.json')
        .then(response => {
            if (!response.ok) throw new Error('Arquivo não encontrado');
            return response.json();
        })
        .then(data => {
            score1Input.value = data.ciclista1 || 0;
            score2Input.value = data.ciclista2 || 0;
            moveRacers(); // Atualiza a posição dos ciclistas
        })
        .catch(error => console.error('Erro ao carregar pontuações:', error));
}