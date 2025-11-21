<template>
  <vxe-form title-width="130" title-align="right" :data="formData">
    <vxe-form-item title="Requester 申请人" field="requesterName" span="24">
      <template #default>{{ props.data.requesterName }}</template>
    </vxe-form-item>
    <vxe-form-item
      title="&nbsp;&nbsp;&nbsp;&nbsp;Project Name 项目名称"
      field="projectName"
      span="24"
    >
      <template #default>
        {{ props.data.projectName }}
      </template>
    </vxe-form-item>
    <vxe-form-item title="Lead" field="adminAccount" span="24">
      <template #default>
        <vxe-select
          v-model="formData.adminAccount"
          :options="adminOptions"
          placeholder="Lead"
          clearable
          filterable
        />
      </template>
    </vxe-form-item>
    <vxe-form-item title="Testers" field="testersAccount" span="24">
      <template #default>
        <vxe-select
          v-model="formData.testersAccount"
          :options="testersOptions"
          placeholder="Testers"
          clearable
          multiple
          filterable
          multi-char-overflow="-1"
        />
      </template>
    </vxe-form-item>
  </vxe-form>
</template>
<script setup lang="ts">
import {
  getUserOptionsByRoleId,
  assignRequest
} from "@/api/application/application";
import { onMounted, ref, watch } from "vue";
interface formVo {
  requestId: number;
  adminAccount: string;
  testersAccount: string[];
  operator: string;
}
const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  formType: {
    type: Boolean,
    default: true
  },
  operator: {
    type: String,
    default: ""
  }
});
const adminOptions = ref();
const testersOptions = ref();
const InitformData = () => {
  return {
    requestId: null,
    adminAccount: "",
    testersAccount: [],
    Operator: ""
  };
};
const formData = ref<formVo>(InitformData());
const handleSubmit = async () => {
  //分配成员
  formData.value.operator = props.operator;
  await assignRequest(formData.value);
  // 发送邮件
  // await SendEmail({
  //   flag: 0,
  //   systemUrl: null,
  //   requestId: formData.value.requestId
  // });
  formData.value = InitformData();
};
const getOptions = async () => {
  adminOptions.value = await getUserOptionsByRoleId({
    // roleName: "Project Leader",
    configCode: "role_project_leader",
    labCategory: props.data.labCategory
  });
  testersOptions.value = await getUserOptionsByRoleId({
    // roleName: "Tester",
    configCode: "role_tester",
    labCategory: props.data.labCategory
  });
};
onMounted(async () => {
  await getOptions();
  formData.value.requestId = props.data.id;
});
watch(
  () => props.data.id,
  async () => {
    if (props.data.id != null) {
      await getOptions();
    }
  },
  { immediate: true, deep: true }
);
defineExpose({ handleSubmit });
</script>
<style scoped lang="scss"></style>
