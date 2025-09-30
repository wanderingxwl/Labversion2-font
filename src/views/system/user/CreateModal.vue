<script lang="ts" setup>
import { ref, h, onBeforeMount, nextTick, reactive } from "vue";
import { VxeFormPropTypes, VxeSelect } from "vxe-pc-ui";
import { ReOrganizationTreeSelect } from "@/components/ReOrganizationTreeSelect";
import { getAllList } from "@/api/system/role";
import { getSingle, submitData } from "@/api/system/user";
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

interface AddUserInput {
  name: string;
  account: string;
  password: string;
  roleId: number | null;
  organizationId: number | null;
  telephone: string;
  email: string;
  remark: string;
  labCategory: number;
}
const formRef = ref();
const defaultFormData = () => {
  return {
    name: "",
    account: "",
    password: "",
    roleId: null,
    organizationId: null,
    telephone: "",
    email: "",
    remark: "",
    labCategory: 0
  };
};
const formData = ref<AddUserInput>(defaultFormData());
const roleOptions = ref<any[]>();
const formItems = ref<VxeFormPropTypes.Items>([
  {
    field: "name",
    title: "Name 用户名",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter name.请输入用户名" }
    }
  },
  {
    field: "account",
    title: "Account 账号",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter account.请输入账号" }
    }
  },
  {
    field: "labCategory",
    title: "Lab 实验室",
    span: 24,
    itemRender: {
      name: "$select",
      props: {
        options: [
          {
            label: "Other（general users and the chief lab manager...）-其他",
            value: 0
          },
          { label: "Reliability Test-可靠性测试", value: 1 },
          { label: "Failure Analysis-失效分析", value: 2 }
        ],
        placeholder: "Please select lab.请选择实验室"
      }
    }
  },
  {
    field: "roleId",
    title: "Role 角色",
    span: 24,
    slots: {
      default: ({ data }) => [
        h(VxeSelect, {
          options: roleOptions.value,
          optionProps: {
            value: "id",
            label: "name"
          },
          placeholder: "Please select role.请输入角色",
          modelValue: data.roleId,
          onChange(v) {
            data.roleId = v.value;
          }
        })
      ]
    }
  },
  {
    field: "organizationId",
    title: "Dept. 部门",
    span: 24,
    slots: {
      default: ({ data }) => [
        h(ReOrganizationTreeSelect, {
          modelValue: data.organizationId,
          onNodeClick(nodeData: Recordable) {
            formData.value.organizationId = nodeData.id;
            formRef.value.validateField("organizationId");
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
      props: { placeholder: "Please enter Tel.请输入电话" }
    }
  },
  {
    field: "email",
    title: "Email 邮箱",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter email.请输入邮箱" }
    }
  },
  {
    field: "remark",
    title: "Remark 备注",
    span: 24,
    itemRender: {
      name: "$textarea",
      props: { placeholder: "Please enter remark.请输入备注" }
    }
  }
]);
const formRules = ref<VxeFormPropTypes.Rules>({
  name: [{ required: true, message: "Please enter name.请输入用户名" }],
  account: [
    { required: true, message: "Please enter account.请输入账号" },
    {
      min: 3,
      message: "Input must be at least 3 characters long.输入不少于3个字符"
    }
  ],
  roleId: [{ required: true, message: "Please select role.请选择角色" }],
  organizationId: [
    { required: true, message: "Please selet Dept..请选择部门" }
  ],
  labCategory: [{ required: true, message: "Please select lab.请选择实验室" }]
});

const showAddModal = () => {
  showModal(`Add User 添加用户`);
  formData.value = defaultFormData();
  nextTick(() => {
    formRef.value.clearValidate();
  });
};
const showEditModal = (record: Recordable) => {
  showModal(`Edit User 编辑用户`);
  nextTick(() => {
    formRef.value.clearValidate();
    getSingle(record.id).then((data: any) => {
      formData.value = data;
    });
  });
};
const showViewModal = (record: Recordable) => {
  showModal(`View User 查看用户`, false);
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
  getAllList({ roleName: "" }).then((result: any) => {
    roleOptions.value = result;
  });
});

defineExpose({ showAddModal, showEditModal, showViewModal });
</script>
<template>
  <vxe-modal
    ref="vxeModalRef"
    v-model="modalOptions.modalValue"
    width="600"
    height="600"
    showFooter
    :title="modalOptions.modalTitle"
  >
    <template #default>
      <vxe-form
        ref="formRef"
        :data="formData"
        :items="formItems"
        :rules="formRules"
        :titleWidth="120"
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
