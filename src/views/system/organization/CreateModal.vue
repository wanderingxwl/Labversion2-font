<script lang="ts" setup>
import { ref, h, nextTick, reactive } from "vue";
import { VxeFormPropTypes, VxeFormInstance, VxeModalInstance } from "vxe-pc-ui";
import { ReOrganizationTreeSelect } from "@/components/ReOrganizationTreeSelect";
import { getSingle, submitData } from "@/api/system/organization";
const emits = defineEmits<{ (e: "reload"): void }>();
const vxeModalRef = ref<VxeModalInstance>();
const modalOptions = reactive<{
  modalValue: boolean;
  modalTitle: string;
  canSubmit: boolean;
}>({
  modalValue: false,
  modalTitle: "",
  canSubmit: true
});

const showModal = (title: string, canSubmit?: boolean): void => {
  modalOptions.modalTitle = title;
  modalOptions.modalValue = true;
  modalOptions.canSubmit = canSubmit ?? true;
};

interface AddOrganizationInput {
  name: string;
  leader: string;
  parentId: number | null;
  telephone: string;
  sort: number;
  remark: string;
}
const formRef = ref<VxeFormInstance>();
const defaultFormData = () => {
  return {
    name: "",
    leader: "",
    parentId: null,
    telephone: "",
    sort: 0,
    remark: ""
  };
};
const formData = ref<AddOrganizationInput>(defaultFormData());
const formItems = ref<VxeFormPropTypes.Items>([
  {
    field: "name",
    title: "Dept. 部门名称",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter Dept.. 请输入部门名称" }
    }
  },
  {
    field: "leader",
    title: "Leader 主管",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter leader. 请输入主管名" }
    }
  },
  {
    field: "parentId",
    title: "Parent Dept. \r\n上级部门",
    span: 24,
    slots: {
      default: ({ data }) => [
        h(ReOrganizationTreeSelect, {
          modelValue: data.parentId,
          onNodeClick(nodeData: Recordable) {
            formData.value.parentId = nodeData.id;
            formRef.value.validateField("parentId");
          }
        })
      ]
    }
  },
  {
    field: "telephone",
    title: "Tel. 电话",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter Tel. 请输入联系电话" }
    }
  },
  {
    field: "sort",
    title: "Sort",
    span: 24,
    itemRender: {
      name: "$input",
      props: { type: "number", placeholder: "" }
    }
  },
  {
    field: "remark",
    title: "Remark 备注",
    span: 24,
    itemRender: {
      name: "$textarea",
      props: { placeholder: "Please enter remark. 请输入备注" }
    }
  }
]);
const formRules = ref<VxeFormPropTypes.Rules>({
  name: [{ required: true, message: "Please enter Dept. 请输入部门名称" }],
  parentId: [
    { required: true, message: "Please select parent Dept. 请输入上级主管" }
  ]
});

const showAddModal = () => {
  showModal(`Add Dept. 添加部门`);
  formData.value = defaultFormData();
  nextTick(() => {
    formRef.value.clearValidate();
  });
};
const showEditModal = (record: Recordable) => {
  showModal(`Edit Dept. 编辑部门`);
  nextTick(() => {
    formRef.value.clearValidate();
    getSingle(record.id).then((data: any) => {
      formData.value = data;
    });
  });
};
const showViewModal = (record: Recordable) => {
  showModal(`View Dept. 查看部门`, false);
  nextTick(() => {
    formRef.value.clearValidate();
    getSingle(record.id).then((data: any) => {
      formData.value = data;
    });
  });
};
const handleSubmit = async () => {
  const validate = await formRef.value.validate();
  if (!validate) {
    submitData(formData.value).then(() => {
      modalOptions.modalValue = false;
      emits("reload");
    });
  }
};

defineExpose({ showAddModal, showEditModal, showViewModal });
</script>
<template>
  <vxe-modal
    ref="vxeModalRef"
    v-model="modalOptions.modalValue"
    width="600"
    height="500"
    showFooter
    :destroy-on-close="true"
    :title="modalOptions.modalTitle"
  >
    <template #default>
      <vxe-form
        ref="formRef"
        :data="formData"
        :items="formItems"
        :rules="formRules"
        :titleWidth="130"
        :titleColon="true"
        :titleAlign="`right`"
      />
    </template>
    <template #footer>
      <vxe-button
        content="Close 关闭"
        @click="modalOptions.modalValue = false"
      />
      <vxe-button
        v-if="modalOptions.canSubmit"
        status="primary"
        content="Confirm 确定"
        @click="handleSubmit"
      />
    </template>
  </vxe-modal>
</template>
