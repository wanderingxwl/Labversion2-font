import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Setting from "@iconify-icons/ep/setting";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system",
  name: "system",
  component: Layout,
  meta: {
    icon: useRenderIcon(Setting),
    title: "Management\r\n管理",
    permissions: ["system"],
    rank: 3
  },
  children: [
    {
      path: "/system/user",
      name: "system_user",
      meta: {
        title: "User\r\n用户管理",
        permissions: ["system.user"]
      },
      component: () => import("@/views/system/user/index.vue")
    },
    {
      path: "/system/application",
      name: "system_application",
      meta: {
        title: "Requests\r\n申请单管理",
        permissions: ["system.request"],
        tag: "admin"
      },
      component: () => import("@/views/application/index.vue")
    },
    {
      path: "/system/role",
      name: "system_role",
      meta: {
        title: "Role\r\n角色管理",
        permissions: ["system.role"]
      },
      component: () => import("@/views/system/role/index.vue")
    },
    {
      path: "/system/function",
      name: "system_function",
      meta: {
        title: "Func.\r\n方法管理",
        permissions: ["system.function"]
      },
      component: () => import("@/views/system/function/index.vue")
    },
    {
      path: "/system/organization",
      name: "system_organization",
      meta: {
        title: "Dept.\r\n部门管理",
        permissions: ["system.organization"]
      },
      component: () => import("@/views/system/organization/index.vue")
    },
    {
      path: "/system/config",
      name: "system_config",
      meta: {
        title: "System Settings\r\n系统设定",
        permissions: ["system.systemconfig"]
      },
      component: () => import("@/views/system/systemConfig/index.vue")
    }
  ]
} as RouteConfigsTable;
