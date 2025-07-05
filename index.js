require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Нужно для обработки JSON-тела

// 🚀 Роут: /notify
app.post("/notify", async (req, res) => {
  const { user_id, name, date, time, specialist } = req.body;

  if (!user_id || !name || !date || !time || !specialist) {
    return res.status(400).send("⛔ Не хватает данных в теле запроса.");
  }

  const message = `🙌 ${name}, вы записаны на ${date} в ${time} ✅\nМастер: ${specialist}\n\n⚠️ Пожалуйста, не опаздывайте.`;

  try {
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;

    const response = await axios.post(
  telegramUrl,
  {
    chat_id: user_id,
    text: message,
  },
  {
    headers: {
      "Content-Type": "application/json; charset=utf-8", // ⬅️ Вот эта строка важна!
    },
  }
);

    console.log("📬 Уведомление отправлено:", response.data);
    res.status(200).send("✅ Уведомление успешно отправлено");
  } catch (error) {
    console.error("❌ Ошибка отправки в Telegram:");
    if (error.response) {
      console.error("Статус:", error.response.status);
      console.error("Ответ:", error.response.data);
    } else {
      console.error("Ошибка:", error.message);
    }
    res.status(500).send("❌ Ошибка при отправке в Telegram");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});
