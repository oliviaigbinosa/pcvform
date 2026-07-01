import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Suppress TypeScript error when importing .vue single-file components
// as declarations may not be picked up in some setups
// @ts-ignore
import App from './pcvForm.vue'
import './styles.css'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
