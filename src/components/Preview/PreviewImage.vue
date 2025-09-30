<template>
  <vxe-loading v-model="loading" />
  <img v-if="correct" class="image_viewer" :src="url" />
  <span v-else>There is an error in the image.</span>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { previewFile } from "@/api/system/preview";
const props = defineProps({
  fileId: {
    type: Number
  }
});
const url = ref("#");
const loading = ref(false);
const correct = ref(true);
const InitImage = async () => {
  loading.value = true;
  let result = await previewFile(props.fileId, 1);
  if (result.data != null) {
    const base64 = btoa(
      new Uint8Array(result.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    url.value = `data:image/jpeg;base64,${base64}`;
    correct.value = true;
  } else {
    correct.value = false;
  }
  loading.value = false;
};
onMounted(() => {
  InitImage();
});
</script>
<style lang="scss" scoped>
.image_viewer {
  width: 100%;
  object-fit: cover;
}
</style>
