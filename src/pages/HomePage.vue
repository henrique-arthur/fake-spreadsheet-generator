<template>
  <main>
    <header>
      <div class="text__header">
        <h1>Gerador de planilhas</h1>
      </div>
      <div class="button__header">
        <div class="rows__length__selector">
          <label for="spreadSheetLength">Quantidade de linhas</label>
          <InputText
            v-model="spreadSheetLength"
            id="spreadSheetLength"
            type="number"
            name="numero de linhas"
            min="1"
            max="100000"
          />
        </div>
        <Button label="Adicionar Coluna" @click="handleAddColumn" />
      </div>
    </header>

    <div class="content">
      <table>
        <tr>
          <th v-for="(column, index) in columns" :key="index">
            <span
              @click="handleShowHeaderInput(index)"
              v-if="column.config.hideInput"
            >
              {{ column.header }}
              <button @click="deleteColumn(index)">excluir coluna</button>
            </span>
            <div class="column__options" v-else>
              <InputText
                v-model="headerInputValue"
                placeholder="Nome do cabeçalho"
                @keyup.enter="startConfigurateColumn(headerInputValue, index)"
              />
              <Button
                label="Configurar coluna"
                @click="startConfigurateColumn(headerInputValue, index)"
              />
            </div>
          </th>
        </tr>
        <tr v-for="(column, rowsIndex) in sampleData" :key="rowsIndex">
          <td v-for="(col, index) in Object.values(column)" :key="index">
            {{ col }}
          </td>
        </tr>
      </table>

      <div class="content__footer">
        <Button
          label="Gerar planilha"
          severity="success"
          @click="generateSpreadSheet(columns, spreadSheetLength)"
        />
      </div>
    </div>

    <ColumnOptionModal
      :visible="isOptionModalVisible"
      @update:visible="isOptionModalVisible = false"
      @save:column-configuration="saveColumnConfiguration"
    />
  </main>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import {
  generateSpreadSheet,
  transformIntoArrayOfRows,
} from "../actions/generateSpreadSheet";
import ColumnOptionModal from "../components/ColumnOptionsModal/ColumnOptionsModal.vue";
import { generateFakeColumn } from "../actions/generateFakeData";

const toast = useToast();

const columns = reactive([]);

const AMOUNT_OF_SAMPLE_COLUMNS = 10;
const headerInputValue = ref("");
const sampleData = ref([]);
const spreadSheetLength = ref(10);
const isOptionModalVisible = ref(false);
const modalOpenedForColumnIndex = ref(null);

const handleAddColumn = () => {
  columns.push({
    header: "Nova coluna",
    fake_type: "text",
    fake_config: {},
    config: {
      hideInput: false,
    },
  });
};

const handleShowHeaderInput = (index) => {
  if (!columns[index]) return;

  columns[index].config.hideInput = false;
  headerInputValue.value = columns[index].header;
};

const deleteColumn = (index) => {
  columns.splice(index, 1);
  updateLocalStorage();
  generateSampleData();
};

const isValidConfig = (index) => {
  if (columns[index].fake_type === "endHour") {
    const alreadyHaveStartHourColumn = columns.some(
      (column) => column.fake_type === "startHour"
    );

    if (!alreadyHaveStartHourColumn) {
      toast.add({
        severity: "warn",
        summary: "Coluna de hora final",
        detail:
          "Você precisa ter uma coluna de hora inicial para poder configurar a coluna de hora final",
        life: 3000,
      });
      return false;
    }

    return true;
  }

  return true;
};

const startConfigurateColumn = (headerText, index) => {
  columns[index].header = headerText;
  columns[index].config.hideInput = true;
  modalOpenedForColumnIndex.value = index;
  isOptionModalVisible.value = true;
};

const saveColumnConfiguration = (columnConfiguration) => {
  const atualEditingColumnIndex = modalOpenedForColumnIndex.value;

  if (!isValidConfig(atualEditingColumnIndex)) return;

  columns[atualEditingColumnIndex].fake_type = columnConfiguration.type;
  columns[atualEditingColumnIndex].fake_config = columnConfiguration.recipe;

  isOptionModalVisible.value = false;

  generateSampleData();

  toast.add({
    severity: "info",
    summary: "Coluna configurada com sucessso",
    detail: "Configurações da coluna salvas com sucesso",
    life: 3000,
  });

  updateLocalStorage();

  modalOpenedForColumnIndex.value = null;
};

const updateLocalStorage = () => {
  localStorage.setItem("columns", JSON.stringify(columns));
};

const generateSampleData = () => {
  const header = [];
  const randomRows = [];

  columns.forEach((column) => {
    randomRows.push(generateFakeColumn(column, AMOUNT_OF_SAMPLE_COLUMNS));
    header.push(column.header);
  });

  sampleData.value = transformIntoArrayOfRows(randomRows, header);
  console.log(sampleData.value);
};

onMounted(() => {
  const columnsFromLocalStorage = JSON.parse(localStorage.getItem("columns"));

  if (columnsFromLocalStorage) {
    columns.splice(0, columns.length, ...columnsFromLocalStorage);
    generateSampleData();
  }
});
</script>

<style lang="scss" scoped>
main {
  header,
  .content {
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;
  }
}

header {
  margin-bottom: 1rem;
  .text__header {
    text-align: center;
  }

  .button__header {
    display: flex;
    justify-content: space-between;
  }
}

.content__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

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
