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
import Settings from "../pages/Settings.vue";
import PersonalInfo from "../pages/PersonalInfo.vue";
import AccountManagement from "../pages/AccountManagement.vue";
import CheckIn from "../pages/CheckIn.vue";

export const routes: RouteRecordRaw[] = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/", component: Home },
  { path: "/mail", component: Mail },
  { path: "/shop", component: Shop },
  { path: "/profile", component: Profile },
  { path: "/my-stamps", component: MyStamps },
  { path: "/favorites", component: Favorites },
  { path: "/post/:id", component: PostDetail },
  { path: "/create", component: Create },
  { path: "/outbox", component: Outbox },
  { path: "/settings", component: Settings },
  { path: "/personal-info", component: PersonalInfo },
  { path: "/account-management", component: AccountManagement },
  { path: "/checkin", component: CheckIn },
];

