import { createApp } from 'vue'
import 'weui/dist/style/weui.css'
import './styles.css'
import App from './App.vue'
import './lib/theme'
import { router } from './router'

const app = createApp(App)
app.use(router)
router.isReady().then(() => app.mount('#app'))
