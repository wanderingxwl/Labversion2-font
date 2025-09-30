import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import briefcase from "@iconify-icons/ep/briefcase";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/configuration",
  name: "configuration",
  component: Layout,
  meta: {
    icon: useRenderIcon(briefcase),
    title: "Configuration\r\n配置",
    permissions: ["configuration"],
    rank: 0
  },
  children: [
    {
      path: "/configuration/test_item",
      name: "configuration_test_item",
      meta: {
        title: "Test Item\r\n测试项",
        permissions: ["configuration.testitem"]
      },
      component: () => import("@/views/configuration/testItem/index.vue")
    },
    {
      path: "/configuration/test_standard",
      name: "configuration_test_standard",
      meta: {
        title: "Test Standard\r\n测试标准",
        permissions: ["configuration.testStandard"]
      },
      component: () => import("@/views/configuration/testStandard/index.vue")
    }
    // {
    //   path: "/configuration/audit_link",
    //   name: "configuration_audit_link",
    //   meta: {
    //     title: "Audit Link\r\n审核流程",
    //     permissions: ["configuration.auditLink"]
    //   },
    //   component: () => import("@/views/configuration/auditLink/index.vue")
    // }
  ]
} as RouteConfigsTable;
