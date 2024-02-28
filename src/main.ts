import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { components } from './Composants/index';
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
const app = createApp(App).use(PrimeVue).use(router);

Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
});

app.mount('#app');
