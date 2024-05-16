const xlsx = require("xlsx");
const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')

const app = express();
const port = 3000;

app.use(cors())

app.use(bodyParser.json());
const analitics = {
  out: "./analitics_out.xlsx",
  nov: "./analitics_nov.xlsx",
  dez: "./analitics_dez.xlsx",
  jan: "./analitics_jan.xlsx",
  fev: "./analitics_fev.xlsx",
  mar: "./analitics_mar.xlsx",
};
const sintetics = {
  out: "./sintetics_out.xlsx",
  nov: "./sintetics_nov.xlsx",
  dez: "./sintetics_dez.xlsx",
  jan: "./sintetics_jan.xlsx",
  fev: "./sintetics_fev.xlsx",
  mar: "./sintetics_mar.xlsx",
};


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
app.get("/sintetic", (req, res) => {
  const { month } = req.query;
  if (month && Object.keys(sintetics).includes(month)) {
    return res.send(controllerSintetics(month));
  } else {
    return res.status(400).send({
      status: 400,
      error: "Mês não fornecido ou inválido",
    });
  }
});

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

const parseDataAnalitcs = (item) => {
  return {
    categoria: item.__EMPTY.slice(item.__EMPTY.indexOf("-") + 2),
    item: item.__EMPTY_4,
    price: parseFloat(item.__EMPTY_15),
  };
};

const parseDataSintetics = (item) => {
  return {
    item: item.__EMPTY,
    price: parseFloat(item.__EMPTY_12),
  };
};


const filterAndCalculateTotalAnalitics = (data) => {
  const filteredData = data.filter((item) => item.__EMPTY && item.__EMPTY_4 && !isNaN(item.__EMPTY_15));

  const total = filteredData.reduce((acc, item) => acc + parseFloat(item.__EMPTY_15), 0);

  return { filteredData, total };
};

const filterAndCalculateTotalSintetics = (data) => {
  const filteredData = data.filter((item) => item.__EMPTY && item.__EMPTY_12);

  const total = filteredData.reduce((acc, item) => acc + parseFloat(item.__EMPTY_12), 0);

  return { filteredData, total };
};

const controllerSintetics = (month) => {
  const workbook = xlsx.readFile(sintetics[month]);
  const worksheet = workbook.Sheets["Relatório"];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  const { filteredData, total } = filterAndCalculateTotalSintetics(jsonData);

  const payload = filteredData.map(parseDataSintetics);

  return {
    payload: payload,
    total: total
  };
};

const controllerAnalitics = (month) => {
  const workbook = xlsx.readFile(analitics[month]);
  const worksheet = workbook.Sheets["Relatório"];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  const { filteredData, total } = filterAndCalculateTotalAnalitics(jsonData);

  const analytics = filteredData.map(parseDataAnalitcs);

  return {
    month: month,
    analytics: analytics,
    balance: total,
  };
};

app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});
