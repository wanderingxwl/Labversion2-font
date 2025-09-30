<script lang="ts" setup>
import { h, reactive, ref } from "vue";
import { getPageList, deleteData } from "@/api/system/role";
import { ReVxeGrid } from "@/components/ReVxeTable";
import { VxeButton, VxeUI } from "vxe-pc-ui";
import FunModal from "./FunModal.vue";
import CreateModal from "./CreateModal.vue";

const funModalRef = ref();
const reVxeGridRef = ref();
const columns = [
  { type: "checkbox", title: "", width: 60, align: "center" },
  {
    title: "Id",
    field: "id",
    minWidth: 100
  },
  {
    title: "Role Name 角色",
    field: "name",
    minWidth: 100
  },
  {
    title: "Desc. 描述",
    field: "description",
    minWidth: 150
  },
  {
    title: "Remark 备注",
    field: "remark",
    minWidth: 150
  },
  {
    title: "Functions 权限",
    field: "funtions",
    align: "center",
    width: 200,
    slots: {
      default: ({ row }) =>
        h(VxeButton, {
          size: "mini",
          content: "Bound Function 绑定权限",
          status: "success",
          onClick() {
            funModalRef.value.showFunction(row);
          }
        })
    }
  }
];
const formRef = ref();

const handleInitialFormParams = () => ({
  name: ""
});
const formItems = [
  {
    field: "name",
    title: "Role Name 角色名",
    span: 6,
    itemRender: { name: "$input", props: { placeholder: "Role Name 角色名" } }
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
const formData = reactive<{ name: string }>(handleInitialFormParams());

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
    "Are you sure you want to delete this?\r\n你确定你要删除这个角色吗？"
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
const functions: Record<string, string> = {
  add: "system.role.add",
  edit: "system.role.edit",
  view: "system.role.view",
  delete: "system.role.delete"
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
    <FunModal ref="funModalRef" />
    <CreateModal ref="createModalRef" @reload="handleSearch" />
  </div>
</template>
