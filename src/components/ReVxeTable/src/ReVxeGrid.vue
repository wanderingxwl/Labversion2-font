<script lang="tsx" setup>
import { h, onMounted, reactive, ref } from "vue";
import { VxeGridPropTypes, VxePagerEvents } from "vxe-table";
import { VxeButton } from "vxe-pc-ui";
import { hasAuth } from "@/router/utils";
import { useUserStoreHook } from "@/store/modules/user";
const props = withDefaults(
  defineProps<{
    applicationFlag: boolean;
    rowKey?: string;
    searchParams?: any;
    request?: (params) => Promise<any>;
    columns: Array<any>;
    operateColumnWidth?: number;
    customTableActions?: VxeGridPropTypes.Columns<any> | any;
    customToolbarActions?: VxeGridPropTypes.ToolbarConfig;
    functions?: Record<string, string>;
    treeConfig?: any;
    isLoad: boolean;
  }>(),
  {
    isLoad: true, // Setting the default value for Isload
    applicationFlag: false
  }
);

const emits = defineEmits<{
  (e: "handleAdd"): void;
  (e: "handleDelete", data: Recordable[]): void;
  (e: "handleEdit", data: Recordable): void;
  (e: "handleView", data: Recordable): void;
  (e: "handleAudit", data: Recordable): void;
  (e: "handleCancel", data: Recordable): void;
  (e: "handleReject", data: Recordable): void;
  (e: "handleAssign", data: Recordable): void;
  (e: "handleStamp", data: Recordable): void;
  (e: "handlePreview", data: Recordable): void;
  (e: "handleWithdraw", data: Recordable): void;
  (e: "handleResubmit", data: Recordable): void;
  (e: "handleReUploadReport", data: Recordable): void;
  (e: "handleDraft", data: Recordable): void;
}>();
//权限控制
const actionColumns: VxeGridPropTypes.Columns<any> =
  props.customTableActions ?? [
    {
      title: "Operate 操作",
      field: "operate",
      align: "center",
      fixed: `right`,
      width:
        props.operateColumnWidth ?? Object.keys(props.functions).length * 80,
      slots: {
        default: ({ row }) => [
          hasAuth(props.functions["view"])
            ? h(VxeButton, {
                status: "warning",
                mode: "text",
                icon: "vxe-icon-file-txt",
                content: "View 查看",
                onClick() {
                  emits(`handleView`, row);
                }
              })
            : null,
          hasAuth(props.functions["edit"]) &&
          (!props.applicationFlag ||
            row.status == 3 ||
            useUserStoreHook().currentUser.permissions.includes(
              "system.request"
            ))
            ? h(VxeButton, {
                status: "primary",
                icon: "vxe-icon-edit",
                mode: "text",
                content: "Edit 编辑",
                onClick() {
                  emits("handleEdit", row);
                }
              })
            : null,
          hasAuth(props.functions["delete"])
            ? h(VxeButton, {
                status: "danger",
                mode: "text",
                icon: "vxe-icon-delete",
                content: "Delete 删除",
                onClick() {
                  emits(`handleDelete`, row);
                }
              })
            : null,
          hasAuth(props.functions["audit"]) &&
          row.status == 4 &&
          useUserStoreHook().currentUser.permissions.includes("request.audit_1")
            ? h(VxeButton, {
                status: "danger",
                mode: "text",
                icon: "vxe-icon-user",
                content: "Reviewer 审核",
                onClick() {
                  emits(`handleAudit`, row);
                }
              })
            : null,
          hasAuth(props.functions["audit"]) &&
          row.status == 5 &&
          useUserStoreHook().currentUser.permissions.includes("request.audit_2")
            ? h(VxeButton, {
                status: "danger",
                mode: "text",
                icon: "vxe-icon-user",
                content: "Approval 审核",
                onClick() {
                  emits(`handleAudit`, row);
                }
              })
            : null,
          hasAuth(props.functions["cancel"]) &&
          (row.status == 0 || row.status == 7)
            ? h(VxeButton, {
                status: "danger",
                mode: "text",
                icon: "vxe-icon-square-close",
                content: "Cancel 取消",
                onClick() {
                  emits(`handleCancel`, row);
                }
              })
            : null,
          hasAuth(props.functions["reject"])
            ? h(VxeButton, {
                status: "danger",
                mode: "text",
                icon: "vxe-icon-square-close",
                content: "Reject 拒绝",
                onClick() {
                  emits(`handleReject`, row);
                }
              })
            : null,
          hasAuth(props.functions["assign"]) && row.status == 0
            ? h(VxeButton, {
                status: "primary",
                mode: "text",
                icon: "vxe-icon-send",
                content: "Assign 分配",
                onClick() {
                  emits(`handleAssign`, row);
                }
              })
            : null,
          hasAuth(props.functions["stamp"]) &&
          row.status == 6 &&
          row.reportFormType != 3 &&
          row.reportFormType != 4
            ? h(VxeButton, {
                status: "danger",
                mode: "text",
                icon: "vxe-icon-dropper",
                content: "Stamp 盖章",
                onClick() {
                  emits(`handleStamp`, row);
                }
              })
            : null,
          hasAuth(props.functions["preview"]) && row.status == 6
            ? h(VxeButton, {
                status: "primary",
                mode: "text",
                icon: "vxe-icon-file",
                content: "Preview Report 预览报告",
                onClick() {
                  emits(`handlePreview`, row);
                }
              })
            : null,
          hasAuth(props.functions["withdraw"]) && row.status == 4
            ? h(VxeButton, {
                status: "danger",
                mode: "text",
                icon: "vxe-icon-user",
                content: "Withdraw 撤回",
                onClick() {
                  emits(`handleWithdraw`, row);
                }
              })
            : null,
          hasAuth(props.functions["resubmit"]) && row.status != 7
            ? h(VxeButton, {
                status: "primary",
                mode: "text",
                icon: "vxe-icon-add",
                content: "resubmit 重新提交",
                onClick() {
                  emits(`handleResubmit`, row);
                }
              })
            : null,
          hasAuth(props.functions["reupload"]) &&
          row.status > 3 &&
          row.status < 7
            ? h(VxeButton, {
                status: "warning",
                mode: "text",
                icon: "vxe-icon-add",
                content: "Re-upload Report 重新上传报告",
                onClick() {
                  emits(`handleReUploadReport`, row);
                }
              })
            : null,
          hasAuth(props.functions["draft"]) && row.status == 7
            ? h(VxeButton, {
                status: "warning",
                mode: "text",
                icon: "vxe-icon-empty",
                content: "Edit Draft 编辑草稿",
                onClick() {
                  emits(`handleDraft`, row);
                }
              })
            : null
        ]
      }
    }
  ];

const gridColumns = props.columns.concat(actionColumns);
const pager = reactive({
  total: 0,
  pageIndex: 1,
  pageSize: 10
});

const toolbarConfig: VxeGridPropTypes.ToolbarConfig =
  props.customToolbarActions ?? {
    slots: {
      buttons: () => [
        hasAuth(props.functions["add"])
          ? h(VxeButton, {
              icon: "vxe-icon-add",
              status: "primary",
              content: "Add 添加",
              onClick() {
                emits(`handleAdd`);
              }
            })
          : null
      ]
    },
    custom: true
  };

const treeOption = props.treeConfig ?? {};

const data = ref<[]>([]);
const loading = ref(false);

const loadData = async () => {
  //loading.value = true;
  props.request({ ...pager, ...props.searchParams }).then(result => {
    loading.value = false;
    const { pageIndex, total, items } = result;
    data.value = items;
    pager.total = total;
    pager.pageIndex = pageIndex;
  });
};
const handlePageChange: VxePagerEvents.PageChange = ({
  currentPage,
  pageSize
}) => {
  pager.pageIndex = currentPage;
  pager.pageSize = pageSize;
  loadData();
};
onMounted(() => {
  if (props.isLoad) {
    loadData();
  }
});
defineExpose({ loadData });
</script>
<template>
  <vxe-grid
    :max-height="650"
    :min-height="650"
    :columns="gridColumns"
    :tree-config="treeOption"
    :data="data"
    :loading="loading"
    :row-config="{ keyField: props.rowKey ?? 'id', isHover: true }"
    :toolbar-config="toolbarConfig"
    :resizable="true"
  >
    <template #pager>
      <!--使用 pager 插槽-->
      <vxe-pager
        v-model:current-page="pager.pageIndex"
        v-model:page-size="pager.pageSize"
        :layouts="[
          'Sizes',
          'PrevJump',
          'PrevPage',
          'Number',
          'NextPage',
          'NextJump',
          'FullJump',
          'Total'
        ]"
        :total="pager.total"
        @page-change="handlePageChange"
      />
    </template>
  </vxe-grid>
</template>
