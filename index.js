const xlsx = require("xlsx");
const express = require("express");

const file = "./Balancetes_out.xlsx";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const array = [];
  const wb = xlsx.readFile(file);
  const ws = wb.Sheets["Relatório"];
  const data = xlsx.utils.sheet_to_json(ws);
  let total = 0

  data.map(item => {
    if(item.__EMPTY && item.__EMPTY_4 && item.__EMPTY_15){
      if(!isNaN(item.__EMPTY_15)) total = total + item.__EMPTY_15
      array.push({
        'categoria': item.__EMPTY,
        'item' : item.__EMPTY_4,
        'price' : item.__EMPTY_15,
        
                })
                array.push({'total' : total})
              }
            },
          ) 
          



  res.send(array);
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
