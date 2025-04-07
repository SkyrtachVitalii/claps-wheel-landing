document
  .getElementById("enterEmail__btn")
  .addEventListener("click", checkValidEmailAndcheckBonusExistence);

document.querySelector(".wheel__btn").addEventListener("click", mainSpinWheel);
document.querySelector(".btn__spinWheel").addEventListener("click", mainSpinWheel);



document.getElementById("playerEmail").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    checkBonusExistence();
  }
});

function blockwheelSpinBtn() {
  document.querySelector(".wheel__btn").style.pointerEvents = "none";
  document.querySelector(".btn__spinWheel").style.pointerEvents = "none";
  document.querySelector(".wheel__btn").removeEventListener("click", mainSpinWheel);
  document.querySelector(".btn__spinWheel").removeEventListener("click", mainSpinWheel);
}

function showBonus(bonusData) {
  document.querySelector(".wheelContainer").style.display = "none";
  bonusData.bonus === "No prize" ? showNoBonus() : showBonusAside(bonusData);
}

function showBonusAside(bonusData) {
  document.querySelector(".victory").style.display = "flex";
  document.querySelector(".victory__prizeVal").innerText = bonusData.bonus;
}
function showNoBonus() {
  document.querySelector(".noPrize").style.display = "flex";
  setInterval(updateCountdown, 1000);
}

async function getBonus(user) {
  try {
    const response = await fetch("http://localhost:4000/get-bonus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Запит не вдався");
    }

    return await response.json();
  } catch (error) {
    console.error("Помилка:", error);
  }
}

function defineBonusSectorDegree(bonus) {
  const sectors = [
    {
      minDegree: 0,
      maxDegree: 22.5,
      value: "10 free spins to deposit",
      sectorDegree: 0,
    },
    {
      minDegree: 22.6,
      maxDegree: 67.5,
      value: "120% to deposit",
      sectorDegree: 45,
    },
    {
      minDegree: 67.6,
      maxDegree: 112.5,
      value: "10 free spins to deposit",
      sectorDegree: 90,
    },
    {
      minDegree: 112.6,
      maxDegree: 157.5,
      value: "120% to deposit",
      sectorDegree: 135,
    },
    {
      minDegree: 157.6,
      maxDegree: 202.5,
      value: "15 free spins to deposit",
      sectorDegree: 180,
    },
    {
      minDegree: 202.6,
      maxDegree: 247.5,
      value: "120% to deposit",
      sectorDegree: 225,
    },
    { minDegree: 247.6, maxDegree: 292.5, value: "No prize", sectorDegree: 270 },
    {
      minDegree: 292.6,
      maxDegree: 337.5,
      value: "100% to deposit",
      sectorDegree: 315,
    },
    {
      minDegree: 337.5,
      maxDegree: 360,
      value: "10 free spins to deposit",
      sectorDegree: 360,
    },
  ];
  
  for (const sector of sectors) {
    if (sector.value === bonus) {
      return -sector.sectorDegree;
    }
  }
}

function spinWheel(rotationDegree) {
  let wheel = document.querySelector(".wheel__sectors");
  wheel.style.transition = "transform 4s ease-in-out";
  wheel.style.transform =
    "translate(-50%, -50%) rotate(" + rotationDegree + "deg)";
}

function mainSpinWheel() {
  const user = {
    name: document.getElementById("playerEmail").value,
  };

  getBonus(user).then((bonusData) => {
    const customWheelRotation = 5;
    blockwheelSpinBtn();

    const randomRotation = 360 * customWheelRotation;
    const bonusSectorDegree = defineBonusSectorDegree(bonusData.bonus);

    if (bonusSectorDegree !== null) {
      let finalRotation = 0;
      finalRotation += randomRotation + bonusSectorDegree;
      spinWheel(finalRotation);
      setTimeout(() => {
        showBonus(bonusData);
      }, 5000);
    }
  });
}

document.querySelectorAll(".containerCloseButton").forEach((button) => {
  button.addEventListener("click", closeBtn);
});

function closeBtn() {
  this.closest("aside").style.display = "none";
}

function getEmail() {
  const email = document.getElementById("playerEmail").value;
  return email;
}

async function checkValidEmailAndcheckBonusExistence() {
  const email = getEmail();
  if (email === "") {
    alert("Please, enter your email");
    return;
  } else {
    if (!isEmailValid(email)) {
      alert("Please, enter valid email");
    } else {
      const bonusExistance = await checkBonusExistence(email);
      if (bonusExistance.userExist == false) {
        document.querySelector(".wheelContainer").style.display = "flex";
      } else if (bonusExistance.bonusExist == false) {
        document.querySelector(".wheelContainer").style.display = "flex";
      } else {
        document.querySelector(".bonusReceived").style.display = "flex";
        setInterval(updateCountdown, 1000);
      }
    }
  }
}

function isEmailValid(value) {
  const EMAIL_REGEXP =/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
  return EMAIL_REGEXP.test(value);
}

async function checkBonusExistence(email) {
  const user = {
    name: email,
  };
  try {
    const response = await fetch("http://localhost:4000/check-bonus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Запит не вдався");
    }

    return await response.json();
  } catch (error) {
    console.error("Помилка:", error);
  }
}

function updateCountdown() {
  const now = new Date(); // Поточна дата та час
  const midnight = new Date(now); // Створюємо нову дату для опівночі
  midnight.setHours(24, 0, 0, 0); // Встановлюємо час на опівночі

  const diff = midnight - now; // Різниця в мілісекундах

  if (diff <= 0) {
    document.getElementById("countdown").textContent = "Опівніч вже настала!";
    return;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document
    .querySelectorAll(".btn__timer")
    .forEach(
      (element) => (element.textContent = `${hours}:${minutes}:${seconds}`)
    );

  console.log(`${hours}:${minutes}:${seconds}`);
}
