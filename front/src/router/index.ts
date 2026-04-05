import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "../utils/request.js";
import { routes } from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const hasToken = !!getToken();

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

  return true;
});

export default router;


