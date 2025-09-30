<!-- <template>
  <template v-if="dialogVisiable">
    <el-dialog
      v-model="dialogVisiable"
      :title="`Are you sure you want to reject ${record.projectName}?`"
    >
      <el-form>
        <el-form-item label="Rejection reason">
          <el-input
            v-model="rejectedReason"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirm">Confirm </el-button>
        <el-button @click="dialogVisiable = false"> Cancel </el-button>
      </template>
    </el-dialog>
  </template>
</template>
<script setup lang="ts">
import { rejectRequest } from "@/api/application/application";
import { ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
const rejectedReason = ref<string>();
const emits = defineEmits(["reload"]);
const dialogVisiable = ref(false);
const record = ref();
const handleConfirm = async () => {
  await rejectRequest({
    requestId: record.value.id,
    remark: rejectedReason.value,
    operator: useUserStoreHook()?.currentUser?.name
  });
  dialogVisiable.value = false;
  emits("reload");
};
const showDialog = recordParams => {
  record.value = recordParams;
  dialogVisiable.value = true;
};
defineExpose({ showDialog });
</script>
<style scoped lang="scss"></style> -->
<template>
  <div />
</template>
<script></script>
