const xlsx = require("xlsx");
const express = require("express");
const { default: OpenAI } = require("openai");

const file = "./Balancete.xlsx";

const app = express();
app.use(express.json());
const port = 3000;

app.post("/", async (req, res) => {
  const content = await api(req.body.content);

  return res.status(200).json({"content": content});
});

const api = async (msg) => {
  const openai = new OpenAI({
    baseURL: "http://localhost:11434/v1/",
    apiKey: "ollama",
  });

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: msg }],
    model: "llama3",
    stream: false,
  });
  return chatCompletion.choices[0].message.content;
};

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
