<template>
  <div>
    <header>
      <h1>Gerador de planilhas</h1>
      <label for="spreadSheetLength">Quantidade de linhas</label>
      <input
        v-model="spreadSheetLength"
        id="spreadSheetLength"
        type="number"
        name="numero de linhas"
        min="1"
        max="100000"
      />
      <button @click="handleAddColumn">Adicionar Coluna</button>
    </header>

    <div>
      <table>
        <tr>
          <th v-for="(column, index) in columns" :key="index">
            <span
              @click="handleShowHeaderInput(index)"
              v-if="column.config.hideInput"
            >
              {{ column.header }}
            </span>
            <div class="column__options" v-else>
              <select
                name="type"
                id="type"
                placeholder="Tipo de dado fake"
                v-model="headerSelectValue"
              >
                <option
                  v-for="option in columnFakeDataOptions"
                  :key="option.type"
                  :value="option.type"
                >
                  {{ option.value }}
                </option>
              </select>

              <input
                v-model="headerInputValue"
                placeholder="Nome do cabeçalho"
                @keyup.enter="
                  saveColumnFakerInfo(
                    headerInputValue,
                    headerSelectValue,
                    index
                  )
                "
              />
              <button
                @click="
                  saveColumnFakerInfo(
                    headerInputValue,
                    headerSelectValue,
                    index
                  )
                "
              >
                salvar
              </button>
            </div>
          </th>
        </tr>
        <tr v-for="item in [0, 1, 2, 3, 4]" :key="item">
          <td v-for="(column, index) in columns" :key="index">
            {{ `Coluna ${item} Linha ${index}` }}
          </td>
        </tr>
      </table>

      <button @click="generateSpreadSheet(columns, spreadSheetLength)">
        Gerar planilha
      </button>

      <pre>{{ columns }}</pre>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { generateSpreadSheet } from "../actions/generateSpreadSheet";

const columns = reactive([]);

const headerInputValue = ref("");
const headerSelectValue = ref("text");
const spreadSheetLength = ref(10);

const columnFakeDataOptions = [
  {
    type: "text",
    value: "Texto",
  },
  {
    type: "predefined_itens",
    value: "Valores predefinidos(ids)",
  },
  {
    type: "number",
    value: "Número",
  },
  {
    type: "date",
    value: "Data",
  },
  {
    type: "timezone",
    value: "Timezone",
  },
  {
    type: "start_hour",
    value: "Hora de início",
  },
  {
    type: "end_hour",
    value: "Hora de término",
  },
];

const handleAddColumn = () => {
  columns.push({
    header: "Nova coluna",
    randomDataType: "text",
    fake: ["nada"],
    config: {
      hideInput: false,
    },
  });
};

const handleShowHeaderInput = (index) => {
  columns[index].config.hideInput = false;
  headerInputValue.value = columns[index].header;
};

const saveColumnFakerInfo = (data, dataType, index) => {
  columns[index].header = data;
  columns[index].randomDataType = dataType;
  columns[index].config.hideInput = true;

  localStorage.setItem("columns", JSON.stringify(columns));
};

onMounted(() => {
  const columnsFromLocalStorage = JSON.parse(localStorage.getItem("columns"));

  if (columnsFromLocalStorage) {
    columns.splice(0, columns.length, ...columnsFromLocalStorage);
  }
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

/* Estilos para o cabeçalho da tabela */
th {
  background-color: #333;
  color: #fff;
  font-weight: bold;
}

th .column__options {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* Estilos para linhas pares */
tr:nth-child(even) {
  background-color: #f2f2f2;
}

/* Estilos para linhas ímpares */
tr:nth-child(odd) {
  background-color: #fff;
}

/* Estilos para as células da tabela */
td,
th {
  padding: 8px;
  border: 1px solid #ccc;
  text-align: left;
}
</style>
