<template>
  <vxe-loading v-model="loading" />
  <div class="others">
    <div class="body-content">
      <div>
        <vxe-icon :name="props.fileInfo.ext == '.zip' ? 'file-zip' : 'file'" />
      </div>
      <div class="file-name">{{ props.fileInfo.fileName }}</div>
      <div class="tips">该类型的文件暂不支持预览，请下载后查看</div>
      <div class="download-btn">
        <vxe-button type="info" @click="downloadMethod">点击下载</vxe-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { VxeButton, VxeIcon, VxeLoading } from "vxe-pc-ui";
import { download } from "@/api/system/profileSystem";
const router = useRouter();
const route = useRoute();
const props = defineProps({
  fileInfo: {
    type: Object
  }
});

//下载文件
const downloadMethod = async () => {
  let result = await download(props.fileInfo.id);
  if (!result) {
    return;
  }
  window.location.href = result;
};
</script>

<style lang="scss" scoped>
.others {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  .body-content {
    text-align: center;
    .file-name {
      font-weight: bold;
    }
    .tips {
      color: #999898;
      margin-top: 5px;
      font-size: 13px;
    }
    .download-btn {
      margin-top: 20px;
    }
  }
}
</style>
