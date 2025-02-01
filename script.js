let timer;
let isRunning = false;
let startTime;
let elapsedTime = 0;

// Legjobb és legrosszabb idő tárolása
let bestTime = null;
let worstTime = null;
let bestScramble = "";
let worstScramble = "";

// Lehetséges forgatások
const moves = ["U", "U'", "L", "L'", "R", "R'", "D", "D'", "F", "F'", "B", "B'"];

// Véletlenszerű scramble generálása
function generateScramble() {
    let scramble = [];
    let previousSide = ""; // Az előző forgatás oldalának nyomon követése

    for (let i = 0; i < 25; i++) {
        let randomMove;
        let randomSide;
        do {
            // Véletlenszerű forgatás választása
            const randomIndex = Math.floor(Math.random() * moves.length);
            randomMove = moves[randomIndex];
            randomSide = randomMove[0]; // A forgatás oldala (pl. 'U', 'L', stb.)
        } while (
            // Ellenőrizzük, hogy az új forgatás ne tartozzon ugyanahhoz az oldalhoz
            randomSide === previousSide
        );

        // Ha a forgatás nem tartalmaz vesszőt, véletlenszerűen hozzáadunk egy 2-est
        if (!randomMove.includes("'")) {
            if (Math.random() < 0.25) { // 50% esély a 2-es hozzáadására
                randomMove = "2" + randomMove;
            }
        }

        // Forgatás hozzáadása a scramble-hez
        scramble.push(randomMove);
        previousSide = randomSide; // Az előző forgatás oldalának frissítése
    }

    return scramble.join(" "); // Szóközzel elválasztva visszaadja
}

// Timer formázása (csak másodpercek, tizedesjegyekkel)
function formatTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000); // Egész másodpercek
    let centiseconds = Math.floor((milliseconds % 1000) / 10); // Század másodperc

    return `${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

// Timer frissítése
function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    document.getElementById('timerDisplay').textContent = formatTime(elapsedTime);
}

// Legjobb és legrosszabb idő frissítése
function updateBestWorstTimes(scramble) {
    const currentTime = elapsedTime;

    // Legjobb idő frissítése
    if (bestTime === null || currentTime < bestTime) {
        bestTime = currentTime;
        bestScramble = scramble; // Store the scramble for the best time
        document.querySelector('.BestWorst').innerHTML = `<span class="best-time" data-scramble="${bestScramble}">Best Time: ${formatTime(bestTime)}</span> <span class="worst-time" data-scramble="${worstScramble}">Worst Time: ${formatTime(worstTime)}</span>`;
    }

    // Legrosszabb idő frissítése
    if (worstTime === null || currentTime > worstTime) {
        worstTime = currentTime;
        worstScramble = scramble; // Store the scramble for the worst time
        document.querySelector('.BestWorst').innerHTML = `<span class="best-time" data-scramble="${bestScramble}">Best Time: ${formatTime(bestTime)}</span> <span class="worst-time" data-scramble="${worstScramble}">Worst Time: ${formatTime(worstTime)}</span>`;
    }
}

// Timer indítása vagy leállítása
function toggleTimer() {
    if (isRunning) {
        // Timer leállítása
        clearInterval(timer);
        isRunning = false;

        // Legjobb és legrosszabb idő frissítése
        const currentScramble = document.getElementById('scrambleDisplay').textContent;
        updateBestWorstTimes(currentScramble);

        // Új scramble generálása és kiírása
        const scramble = generateScramble();
        document.getElementById('scrambleDisplay').textContent = scramble;
    } else {
        // Timer újraindítása 0-ról
        elapsedTime = 0; // Nullázzuk az eltelt időt
        startTime = Date.now(); // Új kezdőidő
        timer = setInterval(updateTimer, 10);
        isRunning = true;
    }
}

window.onload = function () {
    const initialScramble = generateScramble();
    document.getElementById('scrambleDisplay').textContent = initialScramble;
};

// Kattintásra vagy space-re reagálás
document.addEventListener('click', toggleTimer);
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isRunning) {
        event.preventDefault(); // Megakadályozza, hogy a space görgetést triggereljen
        document.getElementById('timerDisplay').classList.add('active'); // Szín változtatása
    }
});
document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Megakadályozza, hogy a space görgetést triggereljen
        document.getElementById('timerDisplay').classList.remove('active'); // Eredeti szín visszaállítása
        toggleTimer(); // Timer indítása vagy leállítása
    }
});
