<script lang="ts" setup>
import { reactive, ref, h } from "vue";
import { getPageList, deleteData, stop, normal } from "@/api/system/user";
import { ReVxeGrid } from "@/components/ReVxeTable";
import CreateModal from "./CreateModal.vue";
import { VxeButton, VxeTag, VxeUI } from "vxe-pc-ui";
const reVxeGridRef = ref();
const columns = [
  { type: "checkbox", title: "", width: 60, align: "center" },
  {
    title: "Name 用户名",
    field: "name",
    minWidth: 130
  },
  {
    title: "Account 账号",
    field: "account",
    minWidth: 130
  },
  {
    title: "Dept. 部门",
    field: "organizationName",
    minWidth: 130
  },
  {
    title: "Role Name 角色",
    field: "roleName",
    minWidth: 100
  },
  {
    title: "Lab Category 实验室",
    field: "labCategory",
    minWidth: 130,
    slots: {
      default: ({ row }) =>
        row.labCategory === 0
          ? h(
              VxeTag,
              {
                status: "primary",
                size: "mini"
              },
              { default: () => h("span", "--") }
            )
          : row.labCategory == 1
            ? h(
                VxeTag,
                {
                  status: "success",
                  size: "mini"
                },
                { default: () => h("span", "Reliability Test-可靠性测试") }
              )
            : h(
                VxeTag,
                {
                  status: "danger",
                  size: "mini"
                },
                { default: () => h("span", "Failure Analysis-失效分析") }
              )
    }
  },
  {
    title: "Email 邮箱",
    field: "email",
    minWidth: 150
  },
  {
    title: "Status 状态",
    field: "status",
    minWidth: 150,
    slots: {
      default: ({ row }) =>
        row.status === 0
          ? h(
              VxeButton,
              {
                status: "success",
                size: "mini",
                onClick: () => {
                  handleChangeStatus(row);
                }
              },
              { default: () => h("span", "Normal-正常") }
            )
          : h(
              VxeButton,
              {
                status: "danger",
                size: "mini",
                onClick: () => {
                  handleChangeStatus(row);
                }
              },
              { default: () => h("span", "Stop-停用") }
            )
    }
  },
  {
    title: "Remark 备注",
    field: "remark",
    minWidth: 150
  }
];
const formRef = ref();

const handleInitialFormParams = () => ({
  name: "",
  account: "",
  status: null
});
const formItems = [
  {
    field: "name",
    title: "Name 用户名",
    span: 6,
    itemRender: { name: "$input", props: { placeholder: "Name 用户名" } }
  },
  {
    field: "account",
    title: "Account 账户",
    span: 6,
    itemRender: { name: "$input", props: { placeholder: "Account 账户" } }
  },
  {
    field: "status",
    title: "Status 状态",
    span: 6,
    itemRender: {
      name: "$select",
      props: {
        options: [
          { label: "ALL-所有", value: null },
          { label: "Normal-正常", value: "0" },
          { label: "Stop-停用", value: "1" }
        ],
        placeholder: "Status 状态"
      }
    }
  },
  {
    span: 6,
    itemRender: {
      name: "$buttons",
      children: [
        {
          props: {
            type: "submit",
            icon: "vxe-icon-search",
            content: "Search 搜索",
            status: "primary"
          }
        },
        {
          props: { type: "reset", icon: "vxe-icon-undo", content: "Reset 重置" }
        }
      ]
    }
  }
];
const formData = reactive<{
  name: string;
  account: string;
  status: number | null;
}>(handleInitialFormParams());

const handleSearch = () => {
  reVxeGridRef.value.loadData();
};

const createModalRef = ref();
const handleAdd = () => {
  createModalRef.value.showAddModal();
};
const handleEdit = (record: Recordable) => {
  createModalRef.value.showEditModal(record);
};
const handleDelete = async (record: Recordable) => {
  const type = await VxeUI.modal.confirm(
    "Are you sure you want to delete this?\r\n你确定要删除这个用户吗？"
  );
  if (type == "confirm") {
    deleteData(record.id).then(() => {
      handleSearch();
    });
  }
};
const handleView = (record: Recordable) => {
  createModalRef.value.showViewModal(record);
};
const handleChangeStatus = async (record: Recordable) => {
  if (record.status == 0) {
    await stop(record.id);
  } else {
    await normal(record.id);
  }
  handleSearch();
};
const functions: Record<string, string> = {
  add: "system.user.add",
  edit: "system.user.edit",
  view: "system.user.view",
  delete: "system.user.delete"
};
</script>
<template>
  <div>
    <el-card :shadow="`never`">
      <vxe-form
        ref="formRef"
        :data="formData"
        :items="formItems"
        @submit="handleSearch"
        @reset="handleInitialFormParams"
      />
    </el-card>
    <el-card :shadow="`never`" class="table-card">
      <ReVxeGrid
        ref="reVxeGridRef"
        :request="getPageList"
        :functions="functions"
        :searchParams="formData"
        :columns="columns"
        @handleAdd="handleAdd"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @handleView="handleView"
      />
    </el-card>
    <CreateModal ref="createModalRef" @reload="handleSearch" />
  </div>
</template>
