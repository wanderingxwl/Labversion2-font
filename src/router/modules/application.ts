import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Collection from "@iconify-icons/ep/collection";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/request",
  name: "request",
  component: Layout,
  meta: {
    icon: useRenderIcon(Collection),
    title: "Requests\r\n申请",
    permissions: ["request"],
    rank: 0
  },
  children: [
    {
      path: "/request/user_request",
      name: "request_submit",
      meta: {
        title: "My Requests\r\n我的申请",
        permissions: ["request.add_request"],
        tag: "application"
      },
      component: () => import("@/views/application/index.vue")
    },
    {
      path: "/request/lab_view",
      name: "request_view",
      meta: {
        title: "View Requests\r\n查看申请",
        permissions: ["request.view_lab"],
        tag: "view"
      },
      component: () => import("@/views/application/index.vue")
    },
    {
      path: "/request/assign",
      name: "request_assign",
      meta: {
        title: "Assign Requests\r\n分配申请",
        permissions: ["request.assign"],
        tag: "assign"
      },
      component: () => import("@/views/application/index.vue")
    },
    {
      path: "/request/edit",
      name: "request_edit",
      meta: {
        title: "Workspace\r\n工作空间",
        permissions: ["request.edit"],
        tag: "edit"
      },
      component: () => import("@/views/application/index.vue")
    },
    {
      path: "/request/audit_1",
      name: "request_audit_1",
      meta: {
        title: "Workspace\r\n工作空间",
        permissions: ["request.audit_1"],
        tag: "audit_1"
      },
      component: () => import("@/views/application/index.vue")
    },
    {
      path: "/request/audit_2",
      name: "request_audit_2",
      meta: {
        title: "Workspace\r\n工作空间",
        permissions: ["request.audit_2"],
        tag: "audit_2"
      },
      component: () => import("@/views/application/index.vue")
    },
    {
      path: "/request/stampCnas",
      name: "request_stampCnas",
      meta: {
        title: " CNAS Stamp\r\n盖章",
        permissions: ["request.stamp"],
        tag: "stamp"
      },
      component: () => import("@/views/application/index.vue")
    }
  ]
} as RouteConfigsTable;
