function randomBonus(arr) {
  const rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
}

module.exports = randomBonus;
