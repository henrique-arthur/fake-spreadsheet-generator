<template>
  <Dialog v-model:visible="handlerVisibility" modal :style="{ width: '600px' }">
    <template #header>
      <h3>Opções da coluna</h3>
    </template>
    <div class="modal__main">
      <div class="input__grid p-float-label">
        <Dropdown
          input-id="fake-data-type"
          :options="fakeDataOptions"
          v-model="fakeDataType"
          option-value="type"
          option-label="label"
          placeholder="Escolha o tipo de dado"
        />
        <label for="fake-data-type">Escolha o tipo de dado</label>
      </div>
      <div v-if="isTextData">
        <div class="input__grid p-float-label">
          <InputText
            input-id="text-data"
            v-model="fakeDataRecipe.text"
            placeholder="Defina um texto padrão para a coluna"
          />
          <label for="text-data">Defina um texto padrão para a coluna</label>
        </div>
      </div>
      <div v-else-if="isPredefined">
        <div class="input__grid p-float-label">
          <Chips
            input-id="text-data"
            v-model="fakeDataRecipe.predefined.items"
            placeholder="Preencha com valores"
          />
          <label for="text-data">Preencha com valores</label>
        </div>
        <div class="checkbox__box">
          <Checkbox
            v-model="fakeDataRecipe.predefined.onlyOnePerLine"
            inputId="only-one-per-line"
            name="onePerLine"
            value="Somente um por linha?"
            binary
          />
          <label for="only-one-per-line" class="ml-2">
            Somente um por linha?
          </label>
        </div>
      </div>
      <div v-else-if="isDate">
        <div class="input__grid p-float-label">
          <Calendar
            input-id="calendar-data"
            v-model="fakeDataRecipe.date"
            date-format="dd/mm/yy"
            placeholder="Período de datas"
            selectionMode="range"
            :manualInput="false"
          />
          <label for="calendar-data">Período de datas</label>
        </div>
      </div>
      <div v-else-if="isStartHour" class="input__grid">
        <div class="input__grid p-float-label">
          <Calendar
            input-id="calendar-data"
            v-model="fakeDataRecipe.startHour.startPeriod"
            time-only
          />
          <label for="calendar-data">Gerar a partir de:</label>
        </div>
        <div class="input__grid p-float-label">
          <Calendar
            input-id="calendar-data"
            v-model="fakeDataRecipe.startHour.endPeriod"
            time-only
          />
          <label for="calendar-data">Até as:</label>
        </div>
      </div>
      <div v-else-if="isEndHour" class="input__grid">
        <div class="input__grid p-float-label">
          <Calendar
            input-id="calendar-data"
            v-model="fakeDataRecipe.endHour.startPeriod"
            time-only
          />
          <label for="calendar-data">Quantidade de horas a incrementar:</label>
        </div>
        <div class="input__grid p-float-label">
          <Calendar
            input-id="calendar-data"
            v-model="fakeDataRecipe.endHour.endPeriod"
            time-only
          />
          <label for="calendar-data">Até:</label>
        </div>
      </div>
      <Button label="Salvar" @click="saveColumnConfiguration" />
    </div>
  </Dialog>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Chips from "primevue/chips";
import Calendar from "primevue/calendar";
import Checkbox from "primevue/checkbox";

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(["update:visible", "save:column-configuration"]);

const fakeDataType = ref(null);
const fakeDataRecipe = reactive({
  text: null,
  predefined: {
    items: null,
    onlyOnePerLine: false,
  },
  date: null,
  startHour: {
    startPeriod: null,
    endPeriod: null,
  },
  endHour: {
    startPeriod: null,
    endPeriod: null,
  },
});

const fakeDataOptions = [
  {
    type: "text",
    label: "Texto",
  },
  {
    type: "predefined",
    label: "Valores predefinidos (ids)",
  },
  {
    type: "date",
    label: "Data",
  },
  {
    type: "startHour",
    label: "Hora de início",
  },
  {
    type: "endHour",
    label: "Hora de término",
  },
];

const isTextData = computed(() => fakeDataType.value === "text");

const isPredefined = computed(() => fakeDataType.value === "predefined");

const isDate = computed(() => fakeDataType.value === "date");

const isStartHour = computed(() => fakeDataType.value === "startHour");

const isEndHour = computed(() => fakeDataType.value === "endHour");

const handlerVisibility = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const saveColumnConfiguration = () => {
  const columnConfiguration = {
    type: fakeDataType.value,
    recipe: {
      [fakeDataType.value]: fakeDataRecipe[fakeDataType.value],
    },
  };

  emit("save:column-configuration", columnConfiguration);
};
</script>

<style lang="scss" scoped>
.modal__main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;

  .input__grid {
    display: grid;
    gap: 1.5rem;

    .p-chips {
      display: unset;
    }
  }

  .checkbox__box {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
}
</style>
