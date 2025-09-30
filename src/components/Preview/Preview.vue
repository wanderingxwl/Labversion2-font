<template>
  <Windown
    :show="windowshow"
    :title="fileInfo.name"
    :file-type="fileInfo.fileType"
    @close="closeWindow"
  >
    <PreviewImage v-if="fileInfo.fileType == 0" :file-id="fileInfo.id" />
    <PreviewDownload v-if="fileInfo.fileType == 4" :file-info="fileInfo" />
    <PreviewDoc v-if="fileInfo.fileType == 1" :file-id="fileInfo.id" />
    <PreviewExcel v-if="fileInfo.fileType == 2" :file-id="fileInfo.id" />
    <PreviewPDF v-if="fileInfo.fileType == 3" :file-id="fileInfo.id" />
  </Windown>
</template>
<script setup lang="ts">
import PreviewImage from "@/components/Preview/PreviewImage.vue";
import PreviewDoc from "./PreviewDoc.vue";
import PreviewDownload from "./PreviewDownload.vue";
import PreviewExcel from "./PreviewExcel.vue";
import PreviewPDF from "./PreviewPDF.vue";
import Windown from "./Windown.vue";

import { onBeforeMount, ref } from "vue";
const fileInfo = ref<{
  name: string;
  id: number;
  fileType: number;
  ext: string;
}>();
const emits = defineEmits(["closePreview"]);
const windowshow = ref(false);
const closeWindow = () => {
  windowshow.value = false;
  emits("closePreview");
};
const mimeType = ref();
const getFileTypeMap = () => {
  if (fileInfo.value.ext != null) {
    switch (fileInfo.value.ext.toLowerCase()) {
      case ".jpg":
        mimeType.value = "image/jpg";
        return 0;
      case ".jpeg":
        mimeType.value = "image/jpeg";
        return 0;
      case ".png":
        mimeType.value = "image/png";
        return 0;
      case ".gif":
        mimeType.value = "image/gif";
        return 0;
      case ".bmp":
        mimeType.value = "image/bmp";
        return 0;
      case ".doc":
        return 1;
      case ".docx":
        return 1;
      case ".xls":
        return 2;
      case ".xlsx":
        return 2;
      case ".pdf":
        return 3;
      default:
        return 4;
    }
  } else {
    return 4;
  }
};

const showPreview = (params, flag) => {
  if (flag) {
    fileInfo.value.id = params;
    fileInfo.value.name = "report";
    fileInfo.value.ext = ".pdf";
  } else {
    if (params.option.type != null) {
      fileInfo.value.name = params.option.name.split(".")[0];
      fileInfo.value.ext = `.${params.option.type}`;
      fileInfo.value.id = params.option.id;
    } else {
      fileInfo.value = params.option;
    }
  }
  fileInfo.value.fileType = getFileTypeMap();
  windowshow.value = true;
};
defineExpose({ showPreview });
onBeforeMount(() => {
  fileInfo.value = {
    ext: ".doc",
    name: "init",
    fileType: 1,
    id: 0
  };
});
</script>
<style lang="scss" scoped></style>
