import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// =====================
// MODEL FIXED
// =====================
const MODEL = "models/gemini-2.5-flash";

// =====================
// ROUTE TEST
// =====================
app.get("/", (req, res) => {
  res.send("Gemini 2.5 Flash API aktif 🚀");
});

// =====================
// CHAT ROUTE
// =====================
app.post("/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({
        reply: "Message kosong",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // DEBUG (WAJIB kalau error)
    console.log("🔥 GEMINI RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    let text = "No response";

    if (data?.candidates?.length > 0) {
      text = data.candidates[0]?.content?.parts?.[0]?.text;
    }

    if (data?.error) {
      return res.status(500).json({
        reply: data.error.message,
      });
    }

    res.json({
      reply: text,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      reply: "Server error",
    });
  }
});

// =====================
app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000 🚀");
});