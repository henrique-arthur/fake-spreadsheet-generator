export const generateFakeColumn = (column, amount) => {

  switch (column.fake_type) {
    case "text":
      return generateText(column.fake_config, amount)
    case "predefined":
      return generatePredefined(column.fake_config, amount)

    case "date":
      return generateDate(column.fake_config, amount)

    case "startHour":
      return generateStartHour(column.fake_config, amount)

    case "endHour":
      return generateEndHour(column.fake_config, amount)

  }
}

const generateText = (config, amount) => {
  const result = []
  for (let i = 0; i < amount; i++) {
    result.push(config.text)
  }
  return result
}

const generatePredefined = (config, amount) => {
  const { onlyOnePerLine, items } = config.predefined
  const result = []
  for (let i = 0; i < amount; i++) {
    if (onlyOnePerLine) {
      result.push(items[Math.floor(Math.random() * items.length)])
    } else {
      const randomAmount = Math.floor(Math.random() * items.length) || 1
      const randomItems = []
      for (let j = 0; j < randomAmount; j++) {
        randomItems.push(items[Math.floor(Math.random() * items.length)])
      }
      result.push(randomItems.join(","))
    }
  }
  return result
}

const generateDate = (config, amount) => {
  const starDate = new Date(config.date[0])
  const endDate = new Date(config.date[1])
  // Verifique se as datas de início e fim são objetos Date válidos.
  if (!(starDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error("As datas de início e fim devem ser objetos Date válidos.");
  }

  // Verifique se a data de início é anterior à data de fim.
  if (starDate >= endDate) {
    throw new Error("A data de início deve ser anterior à data de fim.");
  }

  const randomDates = [];

  for (let i = 0; i < amount; i++) {
    const randomTimestamps = starDate.getTime() + Math.random() * (endDate.getTime() - starDate.getTime());

    const randomFormatedDate = formatDate(new Date(randomTimestamps));
    randomDates.push(randomFormatedDate);
  }

  return randomDates;
}

const generateStartHour = (config, amount) => {
  const { startHour } = config
  // Obtém os valores de hora em milissegundos para as datas fornecidas
  const startHourToCalculate = new Date(startHour.startPeriod).getTime();
  const endHourToCalculate = new Date(startHour.endPeriod).getTime();

  const randomDates = [];

  for (let i = 0; i < amount; i++) {
    // Gere um valor de hora aleatório entre as duas datas
    const randomHour = Math.random() * (endHourToCalculate - startHourToCalculate) + startHourToCalculate;

    // Crie um novo objeto Date com a hora aleatória gerada
    randomDates.push(formatTime(new Date(randomHour)));
  }

  return randomDates;
}

const generateEndHour = (config, amount) => {
  const { endHour, startHoursArray } = config
  // Obtém os valores de hora em milissegundos para as datas fornecidas
  const startHourToCalculate = new Date(endHour.startPeriod).getTime();
  const endHourToCalculate = new Date(endHour.endPeriod).getTime();

  const randomDates = [];

  for (let i = 0; i < amount; i++) {
    // Gere um valor de hora aleatório entre as duas datas
    const randomHour = Math.random() * (endHourToCalculate - startHourToCalculate) + startHourToCalculate;

    // Soma o valor de startHoursArray[i] com o valor de randomHour
    const sum = startHoursArray[i].getTime() + randomHour;

    // Crie um novo objeto Date com a hora aleatória gerada e somada
    randomDates.push(formatTime(new Date(sum)));
  }

  return randomDates;
}

const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  return `${day}/${month}/${year}`;
}

const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};