import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Mail from "./pages/Mail.vue";
import Shop from "./pages/Shop.vue";
import Profile from "./pages/Profile.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/mail", component: Mail },
  { path: "/shop", component: Shop },
  { path: "/profile", component: Profile },
  { path: "/create", component: Home }, // Fallback for create route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
