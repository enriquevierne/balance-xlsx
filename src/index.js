const xlsx = require("xlsx");
const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')

const app = express();
const port = 3000;

app.use(cors())

app.use(bodyParser.json());

app.get("/categories", (req, res) => {
  const { month } = req.query;
  if (month && Object.keys(analitics).includes(month)) {
    const wb = xlsx.readFile(analitics[month]);
    const ws = wb.Sheets["Relatório"];
    const data = xlsx.utils.sheet_to_json(ws);

    const uniqueCategories = extractUniqueCategories(data);

    return res.send({
      categories: uniqueCategories,
      length: uniqueCategories.length,
    });
  } else {
    return res.status(400).send({
      error: "Mês não fornecido ou inválido",
    });
  }
});

app.use("/summarized", );

app.get("/analitic", (req, res) => {
  const { month } = req.query;
  if (month && Object.keys(analitics).includes(month)) {
    return res.send(controllerAnalitics(month));
  } else {
    return res.status(400).send({
      status: 400,
      error: "Mês não fornecido ou inválido",
    });
  }
});

const extractUniqueCategories = (data) => {
  return data
    .filter((item) => item.__EMPTY && item.__EMPTY_4 && !isNaN(item.__EMPTY_15))
    .map((item) => item.__EMPTY.slice(item.__EMPTY.indexOf("-") + 2))
    .filter((category, index, self) => self.indexOf(category) === index);
};


app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});
