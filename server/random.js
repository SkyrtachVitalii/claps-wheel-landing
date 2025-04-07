function getRandomBonus(...args) {
  const arr = [
    "10 free spins to deposit",
    "120% to deposit",
    "10 free spins to deposit",
    "115% to deposit",
    "15 free spins to deposit",
    "120% to deposit",
    "No prize",
    "100% to deposit",
  ];

  let percentages;
  if (args.length === 0) {
    // percentages = [20, 20, 10, 5, 5, 10, 20, 10];
    percentages = [0, 0, 0, 0, 0, 0, 100, 0];
    // percentages = [0, 0, 0, 100, 0, 0, 0, 0];
  } else if (args.length === 1) {
    // percentages = [20, 25, 10, 10, 10, 10, 0, 15];
    percentages = [0, 0, 100, 0, 0, 0, 0, 0];
  } else {
    console.log("Invalid number of arguments");
    
  }
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

module.exports = { getRandomBonus };
