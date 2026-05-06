const API_URL = 'http://localhost:3000'; 
const MAX_SCORE = 30;
const ADMIN_PASSWORD = "bike123";

const racer1 = document.getElementById('racer1');
const racer2 = document.getElementById('racer2');

const score1Input = document.getElementById('score1Input');
const score2Input = document.getElementById('score2Input');

const score1Text = document.getElementById('score1Text');
const score2Text = document.getElementById('score2Text');

const addPoints1 = document.getElementById('addPoints1');
const addPoints2 = document.getElementById('addPoints2');

const unlockBtn = document.getElementById('unlockBtn');
const controls = document.getElementById('controls');
const winnerBanner = document.getElementById('winnerBanner');

unlockBtn.addEventListener('click', () => {
    const password = document.getElementById('adminPassword').value;

    if (password === ADMIN_PASSWORD) {
        controls.classList.remove('locked');
        alert("Controles liberados 🔓");
    } else {
        alert("Senha incorreta 🚫");
    }
});

addPoints1.addEventListener('click', async () => {
    updateScore(score1Input, 2);
    await saveScores();
});

addPoints2.addEventListener('click', async () => {
    updateScore(score2Input, 2);
    await saveScores();
});

score1Input.addEventListener('input', async () => {
    moveRacers();
    await saveScores();
});

score2Input.addEventListener('input', async () => {
    moveRacers();
    await saveScores();
});

function updateScore(inputField, points) {
    let currentScore = parseInt(inputField.value) || 0;

    currentScore += points;

    if (currentScore > MAX_SCORE) {
        currentScore = MAX_SCORE;
    }

    if (currentScore < 0) {
        currentScore = 0;
    }

    inputField.value = currentScore;
    moveRacers();
}

function moveRacers() {
    const raceTrack = document.querySelector('.race-track');

    const trackWidth =
        raceTrack.clientWidth
        - racer1.clientWidth
        - 40;

    const score1 = parseInt(score1Input.value) || 0;
    const score2 = parseInt(score2Input.value) || 0;

    score1Text.textContent = `${score1} / ${MAX_SCORE}`;
    score2Text.textContent = `${score2} / ${MAX_SCORE}`;

    const distance1 = (score1 / MAX_SCORE) * trackWidth;
    const distance2 = (score2 / MAX_SCORE) * trackWidth;

    racer1.style.left = `${distance1}px`;
    racer2.style.left = `${distance2}px`;

    racer1.style.zIndex = score1 > score2 ? 2 : 1;
    racer2.style.zIndex = score2 > score1 ? 2 : 1;

    if (score1 >= MAX_SCORE) {
        winnerBanner.classList.remove('hidden');
        winnerBanner.innerHTML = "🏆 BRABO VENCEU O MÊS!";
    } else if (score2 >= MAX_SCORE) {
        winnerBanner.classList.remove('hidden');
        winnerBanner.innerHTML = "⚡ GABRIEL VENCEU O MÊS!";
    } else {
        winnerBanner.classList.add('hidden');
        winnerBanner.innerHTML = "";
    }
}

async function loadScores() {
    try {
        const response = await fetch(`${API_URL}/scores`);

        if (!response.ok) {
            throw new Error('Erro ao carregar pontuação');
        }

        const data = await response.json();

        score1Input.value = data.brabo ?? 0;
        score2Input.value = data.gabriel ?? 0;

        moveRacers();

    } catch (error) {
        console.error('Erro ao carregar pontuação:', error);
        moveRacers();
    }
}

async function saveScores() {
    try {
        const response = await fetch(`${API_URL}/scores`, {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': ADMIN_PASSWORD
            },

            body: JSON.stringify({
                brabo: Number(score1Input.value) || 0,
                gabriel: Number(score2Input.value) || 0
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar pontuação');
        }

    } catch (error) {
        console.error('Erro ao salvar pontuação:', error);
    }
}

loadScores();
