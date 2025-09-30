<script lang="ts" setup>
import { reactive, ref, h } from "vue";
import { getPageList, deleteData } from "@/api/configuration/testItem";
import { ReVxeGrid } from "@/components/ReVxeTable";
import CreateModal from "./CreateModal.vue";
import { VxeTag, VxeUI } from "vxe-pc-ui";
const reVxeGridRef = ref();
const columns = [
  { type: "checkbox", title: "", width: 60, align: "center" },
  {
    title: "Test Item 测试项",
    field: "itemDesc",
    minWidth: 200
  },
  {
    title: "Unit 单位",
    field: "unit",
    minWidth: 100
  },
  {
    title: "Lab Cost 价格",
    field: "cost_per",
    minWidth: 100
  },
  {
    title: "Lab 实验室",
    field: "labCategory",
    minWidth: 150,
    slots: {
      default: ({ row }) =>
        row.labCategory === 1
          ? h(
              VxeTag,
              {
                status: "success",
                size: "mini"
              },
              { default: () => h("span", "Reliality Test-可靠性测试") }
            )
          : row.labCategory == 2
            ? h(
                VxeTag,
                {
                  status: "danger",
                  size: "mini",
                  onClick: () => {}
                },
                { default: () => h("span", "Failure Analysis-失效分析") }
              )
            : h(
                VxeTag,
                {
                  status: "info",
                  size: "mini"
                },
                { default: () => h("span", "ALL") }
              )
    }
  }
];
const formRef = ref();

const handleInitialFormParams = () => ({
  desc: "",
  unit: "",
  cost_per: "",
  labCategory: 0
});
const formItems = [
  {
    field: "desc",
    title: "Test Item 测试项",
    span: 6,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter test item.请输入测试项" }
    }
  },
  {
    field: "labCategory",
    title: "Lab 实验室",
    span: 6,
    itemRender: {
      name: "$select",
      props: {
        options: [
          { label: "ALL-所有", value: 0 },
          { label: "Reliality Test-可靠性测试", value: 1 },
          { label: "Failure Analysis-失效分析", value: 2 }
        ],
        placeholder: "Please select lab.请选择实验室"
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
  desc: string;
  unit: string;
  cost_per: string;
  labCategory: number | null;
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
    "Are you sure you want to delete this?\r\n你确定你想删除这个测试项？"
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
  add: "configuration.testitem.add",
  edit: "configuration.testitem.edit",
  view: "configuration.testitem.view",
  delete: "configuration.testitem.delete"
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
