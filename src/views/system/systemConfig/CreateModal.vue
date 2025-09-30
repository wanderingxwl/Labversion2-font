<script lang="ts" setup>
import { ref, nextTick, reactive } from "vue";
import { VxeFormPropTypes, VxeFormInstance } from "vxe-pc-ui";
import { getSingle, submitData } from "@/api/system/systemconfig";
const emits = defineEmits<{ (e: "reload"): void }>();
const vxeModalRef = ref();
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

interface AddSystemConfigInput {
  name: string;
  configCode: string;
  configValue: string;
  remark: string;
}
const formRef = ref<VxeFormInstance>();
const defaultFormData = () => {
  return {
    name: "",
    configCode: "",
    configValue: "",
    remark: ""
  };
};
const formData = ref<AddSystemConfigInput>(defaultFormData());
const formItems = ref<VxeFormPropTypes.Items>([
  {
    field: "name",
    title: "Config Name",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter config name." }
    }
  },
  {
    field: "configCode",
    title: "Config Code",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter config code." }
    }
  },
  {
    field: "configValue",
    title: "Config Value",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter config value." }
    }
  },
  {
    field: "remark",
    title: "Remark",
    span: 24,
    itemRender: {
      name: "$textarea",
      props: { placeholder: "Please enter remark." }
    }
  }
]);
const formRules = ref<VxeFormPropTypes.Rules>({
  name: [{ required: true, message: "Please enter config name." }],
  configCode: [{ required: true, message: "Please enter config code." }],
  configValue: [{ required: true, message: "Please enter config value" }]
});

const showAddModal = () => {
  showModal(`Add Configuration`);
  formData.value = defaultFormData();
  nextTick(() => {
    formRef.value.clearValidate();
  });
};
const showEditModal = (record: Recordable) => {
  showModal(`Edit Configuration->${record.name}`);
  nextTick(() => {
    formRef.value.clearValidate();
    getSingle(record.id).then((data: any) => {
      formData.value = data;
    });
  });
};
const showViewModal = (record: Recordable) => {
  showModal(`View Configuration->${record.name}`, false);
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
    :title="modalOptions.modalTitle"
  >
    <template #default>
      <vxe-form
        ref="formRef"
        :data="formData"
        :items="formItems"
        :rules="formRules"
        :titleWidth="100"
        :titleColon="true"
        :titleAlign="`right`"
      />
    </template>
    <template #footer>
      <vxe-button content="Close" @click="modalOptions.modalValue = false" />
      <vxe-button
        v-if="modalOptions.canSubmit"
        status="primary"
        content="Confirm"
        @click="handleSubmit"
      />
    </template>
  </vxe-modal>
</template>
