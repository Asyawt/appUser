import App from './App'
import { createSSRApp } from 'vue'
//引入公用样式
import './Common-style/style.css'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
