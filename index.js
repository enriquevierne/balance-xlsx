const xlsx = require("xlsx");
const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')

const app = express();
const port = 3000;

app.use(cors())

app.use(bodyParser.json());

const fixedExpenses = [
  "Combustível",
  "Impostos diversos",
  "Taxas diversas",
  "Plano Cooperativo Ibpaz",
  "Despesas diversas",
  "Prestação de serviços",
  "Ajuda de Custo",
  "Encargos",
  "Água",
  "Energia",
  "Telefone e internet",
  "Aluguel Imóvel",
  "Aquisições diversas"
]
const salariesExpenses = [
  "Salário",
  "Férias",
  "13º Salário",
]
const generalExpenses = [
  "Papelaria e Gráfica",
  "Eventos Igreja",
  "Mat. Didático",
  "Despesas Viagens",
]

const otherExpenses = [
  "Mat elétrico; hidráulico",
  "Construção Propriedade M. Preto",
  "Equipamentos som e acessórios",
]

const expenses = [{'Despesas Ordinárias': fixedExpenses}, {'Salários': salariesExpenses}, {'Gerais': generalExpenses}, {'Outras':otherExpenses}]

const analitics = {
  out: "./files/analitics_out.xlsx",
  nov: "./files/analitics_nov.xlsx",
  dez: "./files/analitics_dez.xlsx",
  jan: "./files/analitics_jan.xlsx",
  fev: "./files/analitics_fev.xlsx",
  mar: "./files/analitics_mar.xlsx",
};

const sintetics = {
  out: "./files/sintetics_out.xlsx",
  nov: "./files/sintetics_nov.xlsx",
  dez: "./files/sintetics_dez.xlsx",
  jan: "./files/sintetics_jan.xlsx",
  fev: "./files/sintetics_fev.xlsx",
  mar: "./files/data.xlsx",
};

app.get("/data", (req, res) => {
  const wb = xlsx.readFile("./files/data.xlsx");
  const ws = wb.Sheets["Relatório"];
  const data = xlsx.utils.sheet_to_json(ws);
  console.log(data)
  return res.send(data)
})


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
  const groups = sortCategory(analytics)

  return {
    month: month,
    analytics: groups,
    balance: total,
  };
};

const sortCategory = (array) => {
const obj = {fixed: [],
  salaries: [],
  general: [],
  others: []
}

  const data = array.map(item => {
    if(fixedExpenses.includes(item.categoria)){
      console.log(item.categoria);
     return obj.fixed.push(item)
    }
    if(salariesExpenses.includes(item.categoria)){
      console.log(item.categoria);
      return obj.salaries.push(item)
    }
    if(generalExpenses.includes(item.categoria)){
      console.log(item.categoria);
      return obj.general.push(item)
    }else{
      console.log(item.categoria);
      return obj.others.push(item)
    }
  })
  
return data
}



app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});
