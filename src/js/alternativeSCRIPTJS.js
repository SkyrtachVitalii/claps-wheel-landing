(() => {
  class EmailValidator {
    static isValid(email) {
      const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return EMAIL_REGEXP.test(email);
    }
  }
  class Agreement {
    constructor(id, gameInstance) {
      this.agreement = document.getElementById(id);
      this.gameInstance = gameInstance;

      this.agreement.addEventListener("change", () => {
        this.gameInstance.validateForm();
      });
    }

    get isChecked() {
      return this.agreement.checked;
    }
  }

  class BonusManager {
    static mainUrl = "http://localhost:4000";
    // static mainUrl = "https://test-your-luck-on-claps.replit.app";
    // static mainUrl = "https://7c64075a-37c4-4e03-a733-a0fec2fb0ed0-00-2pvyzoxq5y2yv.riker.replit.dev";

    static async checkBonus(email) {
      try {
        const checkBonusUrl = `${BonusManager.mainUrl}/check-bonus`;
        const response = await fetch(checkBonusUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: email }),
        });

        if (!response.ok) throw new Error("Запит не вдався");
        return await response.json();
      } catch (error) {
        console.error("Помилка:", error);
        throw error;
      }
    }

    static async getBonus(email, agreement) {
      try {
        const getBonusUrl = `${BonusManager.mainUrl}/get-bonus`;
        const response = await fetch(getBonusUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: email, agreement: agreement }),
        });

        if (!response.ok) throw new Error("Запит не вдався");
        return await response.json();
      } catch (error) {
        console.error("Помилка:", error);
        throw error;
      }
    }
  }

  class UIManager {
    static showBonus(bonus) {
      document.querySelector(".wheelContainer").style.display = "none";
      bonus === "No prize"
        ? UIManager.showNoBonus()
        : UIManager.showBonusAside(bonus);
    }

    static showBonusAside(bonus) {
      document.querySelector(".victory").style.display = "flex";
      document.querySelector(".victory__prizeVal").innerText = bonus;
    }

    static showNoBonus() {
      document.querySelector(".noPrize").style.display = "flex";
      setInterval(UIManager.updateCountdown, 1000);
    }

    static updateCountdown() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight - now;
      if (diff <= 0) {
        document.getElementById("countdown").textContent =
          "Опівніч вже настала!";
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
    }
  }

  class Wheel {
    constructor(selector) {
      this.wheel = document.querySelector(selector);
      this.rotationDegree = 0;
    }

    spin(rotationDegree) {
      this.wheel.style.transition = "transform 4s ease-in-out";
      this.wheel.style.transform = `translate(-50%, -50%) rotate(${rotationDegree}deg)`;
    }

    static defineBonusSectorDegree(bonus) {
      const sectors = [
        { value: "10 free spins to deposit", sectorDegree: 0 },
        { value: "120% to deposit", sectorDegree: 45 },
        { value: "10 free spins to deposit", sectorDegree: 90 },
        { value: "115% to deposit", sectorDegree: 135 },
        { value: "15 free spins to deposit", sectorDegree: 180 },
        { value: "120% to deposit", sectorDegree: 225 },
        { value: "No prize", sectorDegree: 270 },
        { value: "100% to deposit", sectorDegree: 315 },
        { value: "10 free spins to deposit", sectorDegree: 360 },
      ];
      const sector = sectors.find((s) => s.value === bonus);
      return sector ? -sector.sectorDegree : 0;
    }
  }

  class Game {
    constructor() {
      this.agreement = new Agreement("agreement", this);
      this.wheel = new Wheel(".wheel__sectors");
      this.submitBtn = document.getElementById("enterEmail__btn");
      this.emailInput = document.getElementById("playerEmail");
      this.initEventListeners();
      this.validateForm();
    }

    initEventListeners() {
      this.emailInput.addEventListener("input", () => this.validateForm());

      this.agreement.agreement.addEventListener("change", () =>
        this.validateForm()
      );
      document
        .getElementById("enterEmail__btn")
        .addEventListener("click", () =>
          this.checkValidEmailAndcheckBonusExistence()
        );
      document
        .querySelector(".wheel__btn")
        .addEventListener("click", () => this.mainSpinWheel());
      document
        .querySelector(".btn__spinWheel")
        .addEventListener("click", () => this.mainSpinWheel());

      document.querySelectorAll(".btn__spinAgain").forEach((button) =>
        button.addEventListener("click", (event) => {
          event.target.closest("aside").style.display = "none";
          document.getElementById("wheel").style.display = "flex";
        })
      );

      document.querySelectorAll(".containerCloseButton").forEach((button) =>
        button.addEventListener("click", (event) => {
          event.target.closest("aside").style.display = "none";
        })
      );

      document
        .querySelector(".enterEmail__form")
        .addEventListener("submit", (event) => {
          event.preventDefault();
          this.checkValidEmailAndcheckBonusExistence();
        });
    }

    validateForm() {
      const email = this.emailInput.value.trim();
      const isValidEmail = EmailValidator.isValid(email);
      const isChecked = this.agreement.isChecked;

      this.submitBtn.disabled = !(isValidEmail && isChecked);
    }

    async checkValidEmailAndcheckBonusExistence() {
      const email = document.getElementById("playerEmail").value;

      if (!this.agreement.isChecked) {
        alert("Please, confirm agreement");
        return;
      }
      if (!email) {
        alert("Please, enter your email");
        return;
      }
      if (!EmailValidator.isValid(email)) {
        alert("Please, enter a valid email");
        return;
      }

      const bonusExistence = await BonusManager.checkBonus(email);
      if (
        !bonusExistence.userExist ||
        (bonusExistence.bonusExist === false && bonusExistence.spinsAmount < 2)
      ) {
        document.querySelector(".wheelContainer").style.display = "flex";
      } else {
        document.querySelector(".bonusReceived").style.display = "flex";
      }
    }

    async mainSpinWheel() {

      if (this.isSpinning) return;
      this.isSpinning = true;
      
      const email = document.getElementById("playerEmail").value;
      const spinButton = document.querySelector(".wheel__btn");
      const spinButton2 = document.querySelector(".btn__spinWheel");
      spinButton.disabled = true;
      spinButton2.disabled = true;
      if (!EmailValidator.isValid(email)) {
        alert("Please enter your email first to proceed.");
        return;
      }

      try {
        const bonusData = await BonusManager.getBonus(
          email,
          this.agreement.isChecked
        );
  
        if (!bonusData) return;
  
        const customWheelRotation = 5;
        const randomRotation = 360 * customWheelRotation;
        const bonusSectorDegree = Wheel.defineBonusSectorDegree(bonusData.bonus);
  
        if (bonusSectorDegree !== null) {
          this.wheel.spin(randomRotation + bonusSectorDegree);
          setTimeout(() => {
            UIManager.showBonus(bonusData.bonus);
            spinButton.disabled = false;
            spinButton2.disabled = false;
            this.isSpinning = false;
          }, 5000);
          setTimeout(() => {
            this.resetWheel();
          }, 5001);
        }
      } catch (error) {
        console.error("Error spinning wheel:", error);
        spinButton.disabled = false;
        spinButton2.disabled = false;
      }


    }

    resetWheel() {
      this.wheel.wheel.style.transform = "translate(-50%, -50%) rotate(0deg)";
    }
  }

  // const game = new Game();
  window.game = new Game();
})();
