import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import 'tdesign-vue-next/dist/reset.css';
import 'tdesign-vue-next/es/style/index.css';
import '@/styles/base.scss'

createApp(App).use(createPinia()).mount('#app')
