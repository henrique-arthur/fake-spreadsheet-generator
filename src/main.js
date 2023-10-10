import "primevue/resources/themes/mdc-light-indigo/theme.css"
import "primevue/resources/primevue.min.css"
import { createApp } from 'vue';
import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config';
import App from './App.vue'

const app = createApp(App);
app
  .use(PrimeVue)
  .use(ToastService)
  .mount('#app');