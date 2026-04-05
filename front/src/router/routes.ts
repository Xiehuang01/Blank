import { RouteRecordRaw } from "vue-router";
import Home from "../pages/Home.vue";
import Mail from "../pages/Mail.vue";
import Shop from "../pages/Shop.vue";
import Profile from "../pages/Profile.vue";
import MyStamps from "../pages/MyStamps.vue";
import Favorites from "../pages/Favorites.vue";
import PostDetail from "../pages/PostDetail.vue";
import Create from "../pages/Create.vue";
import Outbox from "../pages/Outbox.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import ForgotPassword from "../pages/ForgotPassword.vue";
import Settings from "../pages/Settings.vue";
import PersonalInfo from "../pages/PersonalInfo.vue";
import AccountManagement from "../pages/AccountManagement.vue";
import CheckIn from "../pages/CheckIn.vue";

const requiresAuth = { requiresAuth: true };

export const routes: RouteRecordRaw[] = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/", component: Home, meta: { keepAlive: true } },
  { path: "/mail", component: Mail, meta: { keepAlive: true } },
  { path: "/shop", component: Shop },
  { path: "/profile", component: Profile, meta: requiresAuth },
  { path: "/my-stamps", component: MyStamps, meta: requiresAuth },
  { path: "/favorites", component: Favorites, meta: requiresAuth },
  { path: "/post/:id", component: PostDetail },
  { path: "/create", component: Create, meta: requiresAuth },
  { path: "/outbox", component: Outbox, meta: requiresAuth },
  { path: "/settings", component: Settings, meta: requiresAuth },
  { path: "/personal-info", component: PersonalInfo, meta: requiresAuth },
  { path: "/account-management", component: AccountManagement, meta: requiresAuth },
  { path: "/checkin", component: CheckIn, meta: requiresAuth },
];


