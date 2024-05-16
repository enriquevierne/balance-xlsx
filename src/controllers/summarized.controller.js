const sintetics = {
    out: "./sintetics_out.xlsx",
    nov: "./sintetics_nov.xlsx",
    dez: "./sintetics_dez.xlsx",
    jan: "./sintetics_jan.xlsx",
    fev: "./sintetics_fev.xlsx",
    mar: "./sintetics_mar.xlsx",
  };

const parseDataSintetics = (item) => {
    return {
      item: item.__EMPTY,
      price: parseFloat(item.__EMPTY_12),
    };
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

  export default {controllerSintetics}
