<template>
  <div class="container_notice">
    <messageList
      ref="messageListRef"
      :list="list"
      class="list"
      @view-detail="ViewDetail"
    />
    <messageDetail :message-info="messageInfo" :item="item" class="detail" />
  </div>
</template>
<script setup>
import messageList from "./messageList.vue";
import messageDetail from "./messageDetail.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getNoticeDetail } from "@/api/application/application";
const route = useRoute();
const messageListRef = ref();
const messageInfo = ref();
const item = ref();

const ViewDetail = async params => {
  item.value = params;
  messageInfo.value = await getNoticeDetail({
    recordId: item.value.recordId,
    requestId: item.value.requestID
  });
};
</script>
<style scoped lang="scss">
.container_notice {
  // width: 80vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 20px 0;
  gap: 35px;
  height: 100%;
  .list {
    // background-color: aqua;
    width: 30%;
    height: 100%;
    background-color: #ffffff;
  }
  .detail {
    background-color: #ffffff;
    border-radius: 10px;
    // background-color: rgb(255, 174, 0);
    width: 65%;
    height: 100%;
  }
}
</style>
