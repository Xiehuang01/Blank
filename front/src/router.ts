import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Mail from "./pages/Mail.vue";
import Shop from "./pages/Shop.vue";
import Profile from "./pages/Profile.vue";
import MyStamps from "./pages/MyStamps.vue";
import PostDetail from "./pages/PostDetail.vue";
import Create from "./pages/Create.vue";
import Outbox from "./pages/Outbox.vue";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/", component: Home },
  { path: "/mail", component: Mail },
  { path: "/shop", component: Shop },
  { path: "/profile", component: Profile },
  { path: "/my-stamps", component: MyStamps },
  { path: "/post/:id", component: PostDetail },
  { path: "/create", component: Create },
  { path: "/outbox", component: Outbox },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
