// function randomBonus(arr) {
//   const rand = Math.floor(Math.random() * arr.length);
//   return arr[rand];
// }



function randomBonus(arr) {
  // const percentages = [20, 2, 20, 5, 20, 2, 28, 3];
  const percentages = [1, 1, 1, 1, 1, 1, 93, 1];
  // Перевіряємо, чи сума відсотків дорівнює 100
  const totalPercentage = percentages.reduce((sum, perc) => sum + perc, 0);
  if (totalPercentage !== 100) {
    throw new Error("Сума відсотків має дорівнювати 100");
  }

  // Перетворюємо відсотки в ймовірності
  const probabilities = percentages.map(perc => perc / 100);

  // Генеруємо випадкове число в діапазоні [0, 1)
  const random = Math.random();

  // Кумулятивна ймовірність
  let cumulative = 0;

  // Знаходимо відповідний елемент
  for (let i = 0; i < arr.length; i++) {
    cumulative += probabilities[i];
    if (random < cumulative) {
      return arr[i];
    }
  }
}

const arr = [
  "10 free spins to deposit",
  "120% to deposit",
  "10 free spins to deposit",
  "120% to deposit",
  "15 free spins to deposit",
  "120% to deposit",
  "No prize",
  "100% to deposit",
];

for (let i = 0; i < 10; i++) {
  console.log(randomBonus([
    "10 free spins to deposit",
    "120% to deposit",
    "10 free spins to deposit",
    "120% to deposit",
    "15 free spins to deposit",
    "120% to deposit",
    "No prize",
    "100% to deposit",
  ]));
}



module.exports = randomBonus;
