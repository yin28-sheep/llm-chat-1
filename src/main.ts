// Components
import { createApp } from 'vue'
import {createPinia} from "pinia";
import App from './App.vue'

// Vuetify
// import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Markdown支持
import VueMarkdownIt from 'vue3-markdown-it'
import 'highlight.js/styles/github.css'

const vuetify = createVuetify({
    components,
    directives,
})
const app = createApp(App)
const pinia = createPinia()

// 注册插件
app.use(pinia)
app.use(vuetify)
app.component('VueMarkdownIt', VueMarkdownIt) // 使用component方法注册Markdown组件
app.mount('#app')

