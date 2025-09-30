<script lang="ts" setup>
import { ref, h, nextTick, reactive } from "vue";
import { VxeFormPropTypes, VxeInput, VxeSelect } from "vxe-pc-ui";
import {
  getOptions,
  getSingle,
  submitData
} from "@/api/configuration/auditLink";
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

interface AddAuditLinkInput {
  account: number | null;
  name: number | null;
  primaryAuditorAccount: number | null;
  secondaryAuditorAccount: number | null;
  remark: string;
}
interface optionsInput {
  accountOptions: [] | null;
  primaryOptions: [] | null;
  secondaryOptions: [] | null;
}
const options = ref<optionsInput>({
  accountOptions: [],
  primaryOptions: [],
  secondaryOptions: []
});
const formRef = ref();
const defaultFormData = () => {
  return {
    account: null,
    name: null,
    primaryAuditorAccount: null,
    secondaryAuditorAccount: null,
    remark: ""
  };
};
const currentFunction = ref();
const formData = ref<AddAuditLinkInput>(defaultFormData());
//全select
const formItems = ref<VxeFormPropTypes.Items>([
  {
    field: "account",
    title: "Submitter 提交者",
    span: 24,
    slots: {
      default: ({ data }) => [
        currentFunction.value == "add"
          ? h(VxeSelect, {
              options: options.value.accountOptions,
              placeholder: "Please select submitter. 请输入提交者",
              modelValue: data.account,
              async onChange(v) {
                data.account = v.value;
                data.primaryAuditorAccount = null;
                data.secondaryAuditorAccount = null;
                await getAuditLinkOption(data.account);
              }
            })
          : h(VxeInput, {
              modelValue: data.name,
              readonly: true
            })
      ]
    }
  },
  {
    field: "primaryAuditorAccount",
    title: "Primary Auditor \r\n 一级审核者",
    span: 24,
    slots: {
      default: ({ data }) => [
        h(VxeSelect, {
          options: options.value.primaryOptions,
          placeholder: "Please select primary auditor. 请选择一级审核者",
          modelValue: data.primaryAuditorAccount,
          onChange(v) {
            data.primaryAuditorAccount = v.value;
          }
        })
      ]
    }
  },
  {
    field: "secondaryAuditorAccount",
    title: "Secondary Auditor 二级审核者",
    span: 24,
    slots: {
      default: ({ data }) => [
        h(VxeSelect, {
          options: options.value.secondaryOptions,
          placeholder: "Please select secondary auditor. 请选择二级审核者",
          modelValue: data.secondaryAuditorAccount,
          onChange(v) {
            data.secondaryAuditorAccount = v.value;
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
      props: { placeholder: "Please enter remark. 请输入备注" }
    }
  }
]);
const formRules = ref<VxeFormPropTypes.Rules>({
  account: [
    {
      required: true,
      message: "Please select submitte. 请输入提交者"
    }
  ],
  primaryAuditorAccount: [
    {
      required: true,
      message: "Please select primary auditor. 请输入一级审核者"
    }
  ],
  secondaryAuditorAccount: [
    {
      required: true,
      message: "Please select secondary auditor. 请输入二级审核者"
    }
  ]
});

const showAddModal = async () => {
  currentFunction.value = "add";
  await getAuditLinkOption(-1);
  showModal(`Add Review Steps 增加审批流程`);
  formData.value = defaultFormData();
  nextTick(() => {
    formRef.value.clearValidate();
  });
};
const showEditModal = async (record: Recordable) => {
  await getAuditLinkOption(record.account);
  showModal(`Edit Review Steps 编辑审批流程`);
  currentFunction.value = "edit";
  nextTick(() => {
    formRef.value.clearValidate();
    getSingle(record.id).then((data: any) => {
      console.log(data);
      formData.value = data;
    });
  });
};
// const showViewModal = (record: Recordable) => {
//   showModal(`View Review Steps 查看审批流程`, false);
//   nextTick(() => {
//     formRef.value.clearValidate();
//     getSingle(record.id).then((data: any) => {
//       formData.value = data;
//     });
//   });
// };
const handleSubmit = async () => {
  const validate = await formRef.value.validate();
  if (!validate) {
    submitData(formData.value).then(() => {
      modalOptions.modalValue = false;
      emits("reload");
    });
  }
};
const getAuditLinkOption = async account => {
  var result = await getOptions(account);
  if (result.accountOptions != null && account == -1) {
    options.value.accountOptions = result.accountOptions;
  }
  if (result.primaryOptions != null) {
    options.value.primaryOptions = result.primaryOptions;
  }
  if (result.secondaryOptions != null) {
    options.value.secondaryOptions = result.secondaryOptions;
  }
  console.log(options.value);
};
defineExpose({ showAddModal, showEditModal });
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
        :titleWidth="150"
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
