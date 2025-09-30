const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "Login",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "loading...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  {
    path: "/linkView",
    name: "LinkView",
    meta: {
      title: "Link View",
      showLink: false,
      rank: 103
    },
    component: () => import("@/views/wait/Wait.vue")
  }
] satisfies Array<RouteConfigsTable>;
