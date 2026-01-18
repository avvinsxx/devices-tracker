import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { CoTruck, CoWarning, CoCamera, CoCaretBottom, CoOptions } from 'oh-vue-icons/icons'

import App from './App.vue'
import './global.css'

addIcons(CoTruck, CoCaretBottom, CoOptions, CoWarning, CoCamera)

const app = createApp(App)

app.component('v-icon', OhVueIcon)
app.use(createPinia())

app.mount('#app')
