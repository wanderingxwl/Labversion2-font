<script lang="ts" setup>
import { ref, h, onBeforeMount, nextTick, reactive } from "vue";
import { VxeFormPropTypes, VxeSelect } from "vxe-pc-ui";
import { getSingle, submitData } from "@/api/configuration/testStandard";
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

interface AddTestStandardInput {
  value: string;
  lab: number | null;
  remark: string;
}
const formRef = ref();
const defaultFormData = () => {
  return {
    value: "",
    remark: "",
    lab: 1
  };
};
const formData = ref<AddTestStandardInput>(defaultFormData());
const formItems = ref<VxeFormPropTypes.Items>([
  {
    field: "value",
    title: "Test Standard 测试标准",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter test standard.请输入测试标准" }
    }
  },
  {
    field: "lab",
    title: "Lab 实验室",
    span: 24,
    slots: {
      default: ({ data }) => [
        h(VxeSelect, {
          options: [
            {
              label: "Reliability Test-可靠性测试",
              value: 1
            },
            {
              label: "Failure Analysis-失效分析",
              value: 2
            }
          ],
          placeholder: "Please select lab.请选择实验室",
          modelValue: data.lab,
          onChange(v) {
            data.lab = v.value;
          }
        })
      ]
    }
  },
  {
    field: "remark",
    title: "Remark 备注",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter remark.请输入备注" }
    }
  }
]);
const formRules = ref<VxeFormPropTypes.Rules>({
  value: [
    { required: true, message: "Please enter test standard.请输入测试标准" }
  ],
  lab: [{ required: true, message: "Please select lab.请选择实验室" }]
});

const showAddModal = () => {
  showModal(`Add Test Standard 增加测试标准`);
  formData.value = defaultFormData();
  nextTick(() => {
    formRef.value.clearValidate();
  });
};
const showEditModal = (record: Recordable) => {
  showModal(`Edit Test Standard 编辑测试标准`);
  nextTick(() => {
    formRef.value.clearValidate();
    getSingle(record.id).then((data: any) => {
      formData.value = data;
    });
  });
};
const showViewModal = (record: Recordable) => {
  showModal(`View Test Standard 查看测试标准`, false);
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

onBeforeMount(() => {
  // getAllList({ roleName: "" }).then((result: any) => {
  //   roleOptions.value = result;
  // });
});

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
