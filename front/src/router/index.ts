import { createRouter, createWebHistory } from "vue-router";
import { getProfile } from "../api/user.js";
import { getToken } from "../utils/request.js";
import { useUser } from "../store/user";
import { routes } from "./routes";


const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const hasToken = !!getToken();
  const { updateUser, clearUser } = useUser();


  if (to.meta.requiresAuth && !hasToken) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  }

  if (hasToken && ["/login", "/register"].includes(to.path)) {
    const redirect = typeof to.query.redirect === "string" ? to.query.redirect : "/";
    return redirect === to.fullPath ? "/" : redirect;
  }

  if (to.meta.requiresAdmin) {
    let identity = "";

    try {
      const result = await getProfile();
      if (result.data) {
        updateUser(result.data);
        identity = result.data.identity;
      }
    } catch (error) {
      clearUser();
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      };
    }

    if (identity !== "admin") {
      return "/";
    }
  }



  return true;
});

export default router;


