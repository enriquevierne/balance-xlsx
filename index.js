const xlsx = require("xlsx");
const express = require("express");
const bodyParser = require("body-parser");

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

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.get("/categories", (req, res) => {
  if (req.query.month && Object.keys(analitics).includes(req.query.month)) {
    const wb = xlsx.readFile(analitics[req.query.month]);
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
    const wb = xlsx.readFile(sintetics[month]);
    const ws = wb.Sheets["Relatório"];
    const data = xlsx.utils.sheet_to_json(ws);

    const uniqueCategories = controllerSintetics(month);

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

const parseData = (item) => {
  return {
    categoria: item.__EMPTY.slice(item.__EMPTY.indexOf("-") + 2),
    item: item.__EMPTY_4,
    price: parseFloat(item.__EMPTY_15),
  };
};

const filterAndCalculateTotal = (data) => {
  const filteredData = data.filter((item) => item.__EMPTY && item.__EMPTY_4 && !isNaN(item.__EMPTY_15));

  const total = filteredData.reduce((acc, item) => acc + parseFloat(item.__EMPTY_15), 0);

  return { filteredData, total };
};

const controllerSintetics = (month) => {
  const workbook = xlsx.readFile(sintetics[month]);
  const worksheet = workbook.Sheets["Relatório"];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  /* const { filteredData, total } = filterAndCalculateTotal(jsonData);

  const analytics = filteredData.map(parseData);

  return {
    month: month,
    analytics: analytics,
    balance: total,
  }; */
};

const controllerAnalitics = (month) => {
  const workbook = xlsx.readFile(analitics[month]);
  const worksheet = workbook.Sheets["Relatório"];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  const { filteredData, total } = filterAndCalculateTotal(jsonData);

  const analytics = filteredData.map(parseData);

  return {
    month: month,
    analytics: analytics,
    balance: total,
  };
};

app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});
