<template>
  <vxe-loading v-model="loading" />
  <div class="pdf">
    <vue-pdf-embed
      ref="pdfRef"
      :source="state.url"
      class="vue-pdf-embed"
      width="850"
      :page="state.pageNum"
      :style="{ transform: 'scale(1)' }"
    />
  </div>
</template>

<script setup>
import VuePdfEmbed from "vue-pdf-embed";
import { ref, reactive, getCurrentInstance, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { previewFile } from "@/api/system/preview";
import { VxeLoading } from "vxe-pc-ui";
const router = useRouter();
const route = useRoute();
const loading = ref(true);
const props = defineProps({
  fileId: {
    type: Number
  }
});

const state = ref({
  url: "", // 预览pdf文件地址
  pageNum: 0, // 当前页面
  numPages: 0 // 总页数
});

const initPDF = async () => {
  loading.value = true;
  let result = await previewFile(props.fileId, 0);
  if (result.data != null) {
    loading.value = false;
    const blob = new Blob([result.data], { type: "application/pdf" });
    state.value.url = window.URL.createObjectURL(blob);
  }
};
onMounted(() => {
  initPDF();
});
</script>

<style lang="scss" scoped>
.pdf {
  width: 100%;
  padding-left: 70px;
}
</style>
