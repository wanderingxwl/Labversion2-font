<template>
  <el-dialog
    v-model="dialogVisible"
    title="User Info"
    :before-close="handleClose"
  >
    <el-form :model="formData">
      <el-form-item label="User Name 用户名">
        {{ UserInfo?.name }}
      </el-form-item>
      <el-form-item label="Dept. 部门">
        {{ UserInfo?.department }}
      </el-form-item>
      <el-form-item label="Email 邮件">
        {{ UserInfo?.email }}
      </el-form-item>
      <el-form-item label="Lab Category 实验室类型">
        <el-tag v-if="UserInfo?.labCategory == 1">
          Reliability Test-可靠性测试
        </el-tag>
        <el-tag v-else-if="UserInfo?.labCategory == 2">
          Failure Analysis-失效性分析
        </el-tag>
        <el-tag v-else>--</el-tag>
      </el-form-item>

      <el-form-item
        v-if="userPermission.sendEmail"
        label="Email Notification 邮件通知"
      >
        <el-radio-group v-model="formData.isSendEmail">
          <el-radio :value="1">Enable</el-radio>
          <el-radio :value="0">Disable</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="userPermission.delegation"
        label="Approval Authorization 审批授权"
        ><div style="display: flex; flex-direction: row; gap: 10px">
          <el-select
            v-model="selectedDelegator"
            value-key="value"
            filterable
            placeholder="Please select user."
          >
            <el-option
              v-for="item in userOptionList"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
          <el-button type="primary" circle size="samll" @click="handleAdd">
            <el-icon><Plus /></el-icon>
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-table v-if="userPermission.delegation" :data="delegationTableData">
      <el-table-column prop="delegateAccount" label="User Account" />
      <el-table-column prop="delegateName" label="Username" />
      <el-table-column label="Status">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isActive"
            :active-value="1"
            :inactive-value="0"
          />
        </template>
      </el-table-column>
      <el-table-column label="Operation">
        <template #default="scope">
          <el-button size="small" @click="handleDelete(scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script setup lang="ts">
import { EditEmailNotification, getTesterOptions } from "@/api/system/user";
import { useUserStoreHook } from "@/store/modules/user";
import { defineProps, ref, defineExpose, onMounted, watch } from "vue";
import { hasAuth } from "@/router/utils";
import { ElMessage } from "element-plus";
import {
  DelegationType,
  getPageList,
  updateDelegation
} from "@/api/system/delegation";
interface UserOptionType {
  label: string;
  value: string;
}
interface userPermission {
  sendEmail: boolean;
  delegation: boolean;
}
const props = defineProps({
  UserInfo: {
    type: Object,
    defuault: () => {}
  }
});
const userPermission = ref<userPermission>({
  sendEmail: true,
  delegation: true
});
const getUserPermiaasion = () => {
  userPermission.value.sendEmail = hasAuth("isSendEmail");
  userPermission.value.delegation = hasAuth("request.delegation");
};
const formData = ref({
  isSendEmail: 1
});
const dialogVisible = ref(false);
//Delegation_select
const userOptionList = ref<UserOptionType[]>([]);
const selectedDelegator = ref<UserOptionType | null>(null);
//Delegation_table
const delegationTableData = ref<DelegationType[]>([]);
//获取用户选项
const getUserOptions = async () => {
  userOptionList.value = await getTesterOptions(0);
};
//针对table
//获取授权情况
const getDelegation = async () => {
  const result = await getPageList({
    delegatorAccount: props.UserInfo.account
  });
  delegationTableData.value = result.items;
};
//处理保存授权
const handleDelegation = async () => {
  await updateDelegation(props.UserInfo.account, delegationTableData.value);
};
//添加授权
const handleAdd = () => {
  //不为空且不重复 可添加授权
  if (selectedDelegator.value.label == null) {
    ElMessage.warning("Please select a user first.  请先选择用户");
    return;
  }
  if (
    delegationTableData.value.some(
      item => item.delegateAccount == selectedDelegator.value.value
    )
  ) {
    ElMessage.warning(
      "The current user is already in the authorization list. Please do not add them again.  当前用户已在授权列表中请勿重复添加"
    );
    return;
  }
  delegationTableData.value.push({
    delegateAccount: selectedDelegator.value.value,
    delegateName: selectedDelegator.value.label,
    isActive: 1
  });
};
//删除授权
const handleDelete = (row): void => {
  delegationTableData.value = delegationTableData.value.filter(
    item => item.delegateAccount != row.delegateAccount
  );
};
const showUserInfoModal = () => {
  formData.value.isSendEmail = props.UserInfo.isSendEmail;
  dialogVisible.value = true;
};
const handleClose = async () => {
  if (userPermission.value.sendEmail) {
    await EditEmailNotification(formData.value.isSendEmail);
    const userStore = useUserStoreHook();
    const updatedUser = {
      ...userStore.currentUser,
      isSendEmail: formData.value.isSendEmail
    };
    userStore.setCurrentUser(updatedUser);
  }
  if (userPermission.value.delegation) {
    //关闭后统一处理授权
    await handleDelegation();
  }
  dialogVisible.value = false;
};
watch(
  () => dialogVisible.value,
  async () => {
    if (dialogVisible.value == true) {
      await getDelegation();
      selectedDelegator.value = null;
      getUserPermiaasion();
    }
  },
  { immediate: true, deep: true }
);
onMounted(async () => {
  //常量选项
  await getUserOptions();
});
defineExpose({ showUserInfoModal });
</script>
<style lang="scss" scoped></style>
