<script lang="ts" setup>
import { ref, h, onBeforeMount, nextTick, reactive } from "vue";
import { VxeFormPropTypes, VxeSelect } from "vxe-pc-ui";
import { getSingle, submitData } from "@/api/configuration/testItem";
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

interface AddTestItemInput {
  itemDesc: string;
  unit: string;
  cost_per: number | null;
  labCategory: number | null;
}
const formRef = ref();
const defaultFormData = () => {
  return {
    itemDesc: "",
    unit: "",
    cost_per: null,
    labCategory: 1
  };
};
const formData = ref<AddTestItemInput>(defaultFormData());
const formItems = ref<VxeFormPropTypes.Items>([
  {
    field: "itemDesc",
    title: "Test Item 测试项",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter test item.请输入测试项" }
    }
  },
  {
    field: "unit",
    title: "Unit 单位",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter unit.请输入单位" }
    }
  },
  {
    field: "cost_per",
    title: "Lab Cost 单价",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter lab cost.请输入单价" }
    }
  },
  {
    field: "labCategory",
    title: "Lab 实验室",
    span: 24,
    slots: {
      default: ({ data }) => [
        h(VxeSelect, {
          options: [
            {
              label: "Reliability Test",
              value: 1
            },
            {
              label: "FA",
              value: 2
            }
          ],
          placeholder: "Please select lab.请选择实验室",
          modelValue: data.labCategory,
          onChange(v) {
            data.labCategory = v.value;
          }
        })
      ]
    }
  }
]);
const formRules = ref<VxeFormPropTypes.Rules>({
  itemDesc: [
    { required: true, message: "Please enter test item.请输入测试项" }
  ],
  unit: [{ required: true, message: "Please enter unit.请输入单位" }],
  cost_per: [{ required: true, message: "Please enter lab cost.请输入单价" }],
  LabCategory: [{ required: true, message: "Please select lab.请选择实验室" }]
});

const showAddModal = () => {
  showModal(`Add Test Item 增加测试项`);
  formData.value = defaultFormData();
  nextTick(() => {
    formRef.value.clearValidate();
  });
};
const showEditModal = (record: Recordable) => {
  showModal(`Edit Test Item编辑测试项->${record.name}`);
  nextTick(() => {
    formRef.value.clearValidate();
    getSingle(record.id).then((data: any) => {
      formData.value = data;
    });
  });
};
const showViewModal = (record: Recordable) => {
  showModal(`View Test Item查看测试项->${record.name}`, false);
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
        :titleWidth="100"
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
