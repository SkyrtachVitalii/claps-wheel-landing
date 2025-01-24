const targetDate = new Date('2023-12-31T23:59:59'); // Set your target date here

function updateTimer() {
    const now = new Date();
    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
        clearInterval(timerInterval);
        document.getElementById('timer').innerHTML = "Time's up!";
        return;
    }

    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    document.getElementById('timer').innerHTML = `${hours}:${minutes}:${seconds}`;
}

const timerInterval = setInterval(updateTimer, 1000);
updateTimer(); // Initial call to display the timer immediately