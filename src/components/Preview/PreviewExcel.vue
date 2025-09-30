<template>
  <VxeLoading v-model="loading" />
  <div :style="{ width: '100%', padding: '10px' }" v-html="excelContent" />
</template>
<script setup lang="ts">
import * as XLSX from "xlsx";
import { ref, onMounted } from "vue";
import { previewFile } from "@/api/system/preview";
import { VxeLoading } from "vxe-pc-ui";
const props = defineProps({
  fileId: {
    type: Number
  }
});
const loading = ref(true);
const initExcel = async () => {
  loading.value = true;
  let result = await previewFile(props.fileId, 1);
  if (!result.data) {
    return;
  }
  loading.value = false;
  const arrayBuffer = result.data as ArrayBufferLike; // 类型断言
  let workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
  excelContent.value = XLSX.utils.sheet_to_html(worksheet);
};
const excelContent = ref();
onMounted(() => {
  initExcel();
});
</script>
<style lang="scss" scoped>
:deep table {
  width: 100%;
  border-collapse: collapse;
  td {
    border: 1px solid #ddd;
    border-collapse: collapse;
    padding: 5px;
    height: 30px;
    min-width: 50px;
  }
}
</style>
