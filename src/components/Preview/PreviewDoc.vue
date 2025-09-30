<template>
  <VxeLoading v-model="loading" />
  <div ref="docRef" class="doc-content" />
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { VxeLoading } from "vxe-pc-ui";
import * as docx from "docx-preview";
import { previewFile } from "@/api/system/preview";
const props = defineProps({
  fileId: {
    type: Number
  }
});
const docRef = ref();
const loading = ref(true);
const initDoc = async () => {
  loading.value = true;
  let result = await previewFile(props.fileId, 0);
  if (!result.data) {
    return;
  } else {
    loading.value = false;
    docx.renderAsync(result.data, docRef.value);
  }
  //获取doc
  //   let result = await proxy.Request({
  //   url: props.url,
  //   responseType: "blob",
  // });
  // if (!result) {
  //   return;
  // }
  // docx.renderAsync(result, docRef.value);
};
onMounted(() => {
  initDoc();
});
</script>
<style lang="scss" scoped>
.doc-content {
  margin: 0px auto;
  :deep .docx-wrapper {
    z-index: 3000;
    background: #fff;
    padding: 10px 0px;
  }

  :deep .docx-wrapper > section.docx {
    margin-bottom: 0px;
  }
}
</style>
