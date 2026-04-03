import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// Apply theme on load
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount("#root");
