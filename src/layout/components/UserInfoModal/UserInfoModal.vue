<template>
  <el-dialog v-model="dialogVisble" title="User Info">
    {{ props.UserInfo }}
    <el-form />
  </el-dialog>
</template>
<script setup lang="ts">
import { defineProps, ref, defineExpose } from "vue";
const props = defineProps({
  UserInfo: {
    type: Object,
    defuault: () => {}
  }
});
const dialogVisble = ref(false);
const showUserInfoModal = () => {
  dialogVisble.value = true;
};
defineExpose({ showUserInfoModal });
</script>
<style lang="scss" scoped></style>
