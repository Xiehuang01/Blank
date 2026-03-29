import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Mail from "./pages/Mail.vue";
import Shop from "./pages/Shop.vue";
import Profile from "./pages/Profile.vue";
import Favorites from "./pages/Favorites.vue";
import PostDetail from "./pages/PostDetail.vue";
import Create from "./pages/Create.vue";
import Login from "./pages/Login.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/", component: Home },
  { path: "/mail", component: Mail },
  { path: "/shop", component: Shop },
  { path: "/profile", component: Profile },
  { path: "/favorites", component: Favorites },
  { path: "/post/:id", component: PostDetail },
  { path: "/create", component: Create },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
