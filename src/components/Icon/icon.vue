<template>
  <VxeIcon :name="fileTypeMap[fileType]" />
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { VxeIcon } from "vxe-pc-ui";
const props = defineProps({
  fileType: {
    type: Number
  }
});
const fileTypeMap = {
  other: "file",
  exe: "file-excel",
  image: "file-image",
  pdf: "file-pdf",
  txt: "file-txt",
  doc: "file-word"
};
// const fileTypeMap = {
//   0: { desc: "目录", icon: "folder" },
//   1: { desc: "图片", icon: "image" },
//   2: { desc: "exe", icon: "pdf" },
//   3: { desc: "doc", icon: "word" },
//   4: { desc: "excel", icon: "excel" },
//   5: { desc: "纯文本", icon: "txt" },
//   6: { desc: "压缩包", icon: "zip" },
//   7: { desc: "其他文件", icon: "others" }
// };
</script>
<style scoped lang="scss"></style>
