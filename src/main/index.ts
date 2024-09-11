import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import 'tdesign-vue-next/dist/reset.css';
import 'tdesign-vue-next/es/style/index.css';

createApp(App).use(createPinia()).mount('#app')
