const xlsx = require("xlsx");
const express = require("express");

const file = "./Balancete.xlsx";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const wb = xlsx.readFile(file)
  const ws = wb.Sheets["Relatório"]
  const data = xlsx.utils.sheet_to_json(ws)

  res.send(data)
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
