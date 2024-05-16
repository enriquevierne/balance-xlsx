const { month } = req.query;
  if (month && Object.keys(sintetics).includes(month)) {
    return res.send(controllerSintetics(month));
  } else {
    return res.status(400).send({
      status: 400,
      error: "Mês não fornecido ou inválido",
    });
  }