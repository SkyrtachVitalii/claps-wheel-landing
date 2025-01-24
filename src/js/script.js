document.getElementById("enterEmail__btn").addEventListener("click", checkValidEmailAndcheckBonusExistence);
const emailInput = document.getElementById("playerEmail");
const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
let wheel = document.querySelector(".wheel__sectors");
let wheelSpinBtn = document.querySelector(".wheel__btn");
let buttonSpinBtn = document.querySelector(".btn__spinWheel");

const sectors = [
    { minDegree: 0, maxDegree: 22.5, value: "10 free spins to deposit", sectorDegree: 0 },
    { minDegree: 22.6, maxDegree: 67.5, value: "120% to deposit", sectorDegree: 45 },
    { minDegree: 67.6, maxDegree: 112.5, value: "10 free spins to deposit", sectorDegree: 90 },
    { minDegree: 112.6, maxDegree: 157.5, value: "120% to deposit", sectorDegree: 135 },
    { minDegree: 157.6, maxDegree: 202.5, value: "15 free spins to deposit", sectorDegree: 180 },
    { minDegree: 202.6, maxDegree: 247.5, value: "120% to deposit", sectorDegree: 225 },
    { minDegree: 247.6, maxDegree: 292.5, value: "No prize", sectorDegree: 270 },
    { minDegree: 292.6, maxDegree: 337.5, value: "100% to deposit", sectorDegree: 315 },
    { minDegree: 337.5, maxDegree: 360, value: "10 free spins to deposit", sectorDegree: 360 },
]

emailInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        checkBonusExistence();
    }
});

function blockwheelSpinBtn() {
    wheelSpinBtn.style.pointerEvents = 'none';
    buttonSpinBtn.style.pointerEvents = 'none';
    wheelSpinBtn.removeEventListener("click", mainSpinWheel);
    buttonSpinBtn.removeEventListener("click", mainSpinWheel);
}

function showBonus( bonusData) {
    document.querySelector(".wheelContainer").style.display = "none";
    bonusData.bonus === "No prize" ? showNoBonus() : showBonusAside(bonusData);

}

function showBonusAside(bonusData){
    document.querySelector(".victory").style.display = "flex";
    document.querySelector(".victory__prizeVal").innerText = bonusData.bonus;
}
function showNoBonus(){
    document.querySelector(".noPrize").style.display = "flex";
    // document.querySelector(".victory__prizeVal").innerText = bonus;
}

async function getBonus(user) {
    try {
        const response = await fetch('http://localhost:3000/get-bonus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            throw new Error('Запит не вдався');
        }

        return await response.json();
    } catch (error) {
        console.error('Помилка:', error);
    }
}

function defineBonusSectorDegree(bonus) {
    for (const sector of sectors) {
        if (sector.value === bonus) {
            return -sector.sectorDegree;
        }
    }
}

function spinWheel(rotationDegree) {
    wheel.style.transition = "transform 4s ease-in-out";
    wheel.style.transform = "translate(-50%, -50%) rotate(" + rotationDegree + "deg)";
}

let finalRotation = 0;
let prevDegree = 0;

wheelSpinBtn.addEventListener("click", mainSpinWheel);
buttonSpinBtn.addEventListener("click", mainSpinWheel);

function mainSpinWheel () {
    console.log("mainSpinWheel");
    
    const user = {
        name: document.getElementById("playerEmail").value
    };
    console.log(user);
    

    getBonus(user).then(bonusData => {
        const customWheelRotation = 5;
        blockwheelSpinBtn();

        const randomRotation = 360 * customWheelRotation;
        const bonusSectorDegree = defineBonusSectorDegree(bonusData.bonus);

        if (bonusSectorDegree !== null) {
            finalRotation += randomRotation + bonusSectorDegree;
            spinWheel(finalRotation);
            setTimeout(() => {
                showBonus(bonusData);
            }, 5000);
        }
    });
};

document.querySelectorAll(".containerCloseButton").forEach(button => {
    button.addEventListener("click", closeBtn);
})

function closeBtn(){
    this.closest('aside').style.display = "none";
}

function getEmail() {
    const email = document.getElementById("playerEmail").value;
    return email;
}

function checkValidEmailAndcheckBonusExistence(){
    const email = getEmail();
    if (email === "") {
        alert("Please, enter your email");
        return;
    } else {
        // isEmailValid(email) ? document.querySelector(".wheelContainer").style.display = "flex" : alert("Please, enter valid email");
        if (!isEmailValid(email)){
            alert("Please, enter valid email");
        } else {
            document.querySelector(".wheelContainer").style.display = "flex";
        }
    }
}

function isEmailValid(value) {
    return EMAIL_REGEXP.test(value);
}

async function checkBonusExistence(email){
    try {
        const response = await fetch('http://localhost:3000/get-bonus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            throw new Error('Запит не вдався');
        }

        return await response.json();
    } catch (error) {
        console.error('Помилка:', error);
    }
}

