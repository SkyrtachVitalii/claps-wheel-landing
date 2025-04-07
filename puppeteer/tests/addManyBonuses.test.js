jest.setTimeout(300000); // Тайм-аут на 5 хвилин (300000 мс)
const puppeteer = require("puppeteer");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Тест надсилання 100 запитів", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false }); // Використовуйте `headless: false`, якщо хочете бачити браузер
    page = await browser.newPage();
    await page.goto("http://127.0.0.1:5501"); // Змінити на ваш локальний сервер
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Виконати 100 запитів на сервер", async () => {
    console.log("Починаємо тест...");
    await delay(500);
    for (let i = 1; i <= 1; i++) {
      const email = `${i}testemail.v.skyrtach@claps.com`;
      await delay(500);

      // Очистка поля email
      await page.focus("#playerEmail");
      await page.click("#playerEmail", { clickCount: 3 });
      await page.keyboard.press("Backspace");
      await page.type("#playerEmail", "");
      await delay(500);

      // Заповнення email
      await page.focus("#playerEmail");
      await page.click("#playerEmail", { clickCount: 3 });
      await page.keyboard.press("Backspace");
      await page.type("#playerEmail", email);
      // Викликаємо input подію, щоб validateForm спрацювала
      await page.evaluate(() => {
        const emailInput = document.querySelector("#playerEmail");
        emailInput.dispatchEvent(new Event("input", { bubbles: true }));
      });

      // Активуємо "Agreement"
      await delay(500);
      await page.evaluate(() => {
        const checkbox = document.querySelector("input#agreement");
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      });

      // Надсилання форми
      await delay(500);
      await page.click("#enterEmail__btn");
      console.log(`Запит з email ${email} надіслано`);

      // Чекаємо появи колеса та кнопки spin
      await page.waitForSelector(".btn__spinWheel", {
        visible: true,
        timeout: 5000,
      });

      await delay(500); // трошки почекати

      // Натискаємо кнопку spin
      await page.click(".btn__spinWheel");
      console.log(`Натиснули spin для ${email}`);

      await delay(15000); // Затримка 15 секунд між запитами
    }
  });
});
