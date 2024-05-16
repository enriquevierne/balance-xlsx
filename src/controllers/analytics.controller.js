const analitics = {
    out: "./analitics_out.xlsx",
    nov: "./analitics_nov.xlsx",
    dez: "./analitics_dez.xlsx",
    jan: "./analitics_jan.xlsx",
    fev: "./analitics_fev.xlsx",
    mar: "./analitics_mar.xlsx",
  };

const parseDataAnalitcs = (item) => {
    return {
      categoria: item.__EMPTY.slice(item.__EMPTY.indexOf("-") + 2),
      item: item.__EMPTY_4,
      price: parseFloat(item.__EMPTY_15),
    };
  };
  
   
  const filterAndCalculateTotalAnalitics = (data) => {
    const filteredData = data.filter((item) => item.__EMPTY && item.__EMPTY_4 && !isNaN(item.__EMPTY_15));
  
    const total = filteredData.reduce((acc, item) => acc + parseFloat(item.__EMPTY_15), 0);
  
    return { filteredData, total };
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

  export default {controllerAnalitics}
