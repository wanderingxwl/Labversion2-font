<template>
  <el-dialog
    v-model="dialogVisible"
    title="Please select the stamped report format."
    width="400"
  >
    <el-radio-group v-model="radio" style="margin: 30px 0">
      <el-radio :value="0" size="large">
        <template #default>
          <img :src="getlandscapeIcon()" alt="logo" />
        </template>
      </el-radio>
      <el-radio :value="1" size="large">
        <template #default>
          <img :src="getporaitIcon()" alt="logo" />
        </template>
      </el-radio>
    </el-radio-group>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleComfirm"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useNav } from "@/layout/hooks/useNav";
const dialogVisible = ref(false);
const radio = ref<number>(0);
const emits = defineEmits(["handleCompleted"]);
const { getlandscapeIcon, getporaitIcon } = useNav();
const showDialog = () => {
  dialogVisible.value = true;
};
const handleComfirm = () => {
  emits("handleCompleted", radio.value);
  dialogVisible.value = false;
};
defineExpose({ showDialog });
</script>
<style lang="scss" scoped>
img {
  // width: 100px;
  height: 80px;
}
</style>
