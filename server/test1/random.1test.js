const random = require("../random");

test('random function should count occurrences of "No prize" in 100 calls', () => {
    let noPrizeCount = 0;

    for (let i = 0; i < 100; i++) {
        if (random() === "No prize") {
            noPrizeCount++;
        }
    }

    console.log(`"No prize" appeared ${noPrizeCount} times`);

    // Перевіряємо, що значення "No prize" з'являється хоча б один раз
    expect(noPrizeCount).toBeGreaterThan(0);
});