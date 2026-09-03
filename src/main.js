import { applyTheme, readTheme } from '@/utils/theme'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.css'

applyTheme(readTheme())

createApp(App).use(router).mount('#app')
