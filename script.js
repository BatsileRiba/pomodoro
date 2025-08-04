const minutesColumn = document.querySelector(".minutes .highlight");
const secondsColumn = document.querySelector(".seconds .static");
const remMin = document.querySelector(".remainingMinutes .remMin");
const remSec = document.querySelector(".remainingSeconds .remSec");

let selectedMinutes = 0;
let selectedSeconds = 0; 
let countdownActive = false;
let isPaused = false; 
let countdownInterval;

const maximumMinutes = 120;

function createSequence(max = maximumMinutes) {
    const sequence = [];
    for (let i = 0; i <= max; i++) {
        sequence.push(i.toString().padStart(2, '0'));
    }
    return sequence;
}

const sequence = createSequence();
const secondSequence = createSequence(59);

function updateMinutes() {
    minutesColumn.textContent = sequence[selectedMinutes];
}
function updateSeconds() {
    secondsColumn.textContent = secondSequence[selectedSeconds];
}

minutesColumn.parentElement.addEventListener('wheel', (event) => {
    if (!countdownActive) {
        event.preventDefault();
        selectedMinutes = (selectedMinutes + (event.deltaY > 0 ? 1 : -1) + sequence.length) % sequence.length;
        updateMinutes();
    }
});

secondsColumn.parentElement.addEventListener('wheel', (event) => {
    if (!countdownActive) {
        event.preventDefault();
        selectedSeconds = (selectedSeconds + (event.deltaY > 0 ? 1 : -1) + 60) % 60;
        updateSeconds();
    }
});

document.getElementById("ten").addEventListener("click", () => {
    if (!countdownActive) {
        selectedMinutes = 10;
        selectedSeconds = 0;
        updateMinutes();
        updateSeconds();
    }
});

document.getElementById("twentyFive").addEventListener("click", () => {
    if (!countdownActive) {
        selectedMinutes = 25;
        selectedSeconds = 0;
        updateMinutes();
        updateSeconds();
    }
});

document.getElementById("sixty").addEventListener("click", () => {
    if (!countdownActive) {
        selectedMinutes = 60;
        selectedSeconds = 0;
        updateMinutes();
        updateSeconds();
    }
});

document.getElementById("confirm").addEventListener("click", () => {
    if (!countdownActive) {
        countdownActive = true;
        isPaused = false;
        disableButtons(true);
        document.getElementById("pause").textContent = "Pause Pomodoro";

        let remainingMinutes = selectedMinutes;
        let remainingSeconds = selectedSeconds;

        remMin.textContent = remainingMinutes.toString().padStart(2, '0');
        remSec.textContent = remainingSeconds.toString().padStart(2, '0');

        countdownInterval = setInterval(() => {
            if (!isPaused) {
                if (remainingMinutes === 0 && remainingSeconds === 0) {
                    clearInterval(countdownInterval);
                    showCongratsModal();
                    countdownActive = false;
                    disableButtons(false);
                    document.getElementById("pause").textContent = "Pause Pomodoro";
                } else {
                    if (remainingSeconds === 0) {
                        remainingMinutes--;
                        remainingSeconds = 59;
                    } else {
                        remainingSeconds--;
                    }
                    remMin.textContent = remainingMinutes.toString().padStart(2, '0');
                    remSec.textContent = remainingSeconds.toString().padStart(2, '0');
                }
            }
        }, 1000);
    }
});

document.getElementById("pause").addEventListener("click", () => {
    if (countdownActive) {
        isPaused = !isPaused;
        document.getElementById("pause").textContent = isPaused ? "Resume Pomodoro" : "Pause Pomodoro";
    }
});

document.getElementById("Reset").addEventListener("click", () => {
    clearInterval(countdownInterval);
    countdownActive = false;
    isPaused = false;

    selectedMinutes = 0;
    selectedSeconds = 0;
    remMin.textContent = "00";
    remSec.textContent = "00";
    updateMinutes();
    updateSeconds();
    disableButtons(false);
    document.getElementById("pause").textContent = "Pause Pomodoro";
});

function disableButtons(disable) {
    const buttons = document.querySelectorAll(".btn1, .btn2, .btn3, #confirm");
    buttons.forEach(button => {
        button.disabled = disable;
    });
}

updateMinutes();
updateSeconds();

function showCongratsModal() {
    const modal = document.getElementById("congratsModal");
    modal.style.display = "flex";

    document.querySelector(".close-btn").onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

let startY = null;

minutesColumn.parentElement.addEventListener("touchstart", (event) => {
    if (!countdownActive) {
        startY = event.touches[0].clientY;
    }
});

minutesColumn.parentElement.addEventListener("touchmove", (event) => {
    if (!countdownActive && startY !== null) {
        let currentY = event.touches[0].clientY;
        let deltaY = currentY - startY;

        if (Math.abs(deltaY) > 20) {
            selectedMinutes = (selectedMinutes + (deltaY > 0 ? 1 : -1) + sequence.length) % sequence.length;
            updateMinutes();
            startY = currentY; 
        }
    }
});

secondsColumn.parentElement.addEventListener("touchstart", (event) => {
    if (!countdownActive) {
        startY = event.touches[0].clientY;
    }
});

secondsColumn.parentElement.addEventListener("touchmove", (event) => {
    if (!countdownActive && startY !== null) {
        let currentY = event.touches[0].clientY;
        let deltaY = currentY - startY;

        if (Math.abs(deltaY) > 20) {
            selectedSeconds = (selectedSeconds + (deltaY > 0 ? 1 : -1) + 60) % 60;
            updateSeconds();
            startY = currentY;
        }
    }
});
