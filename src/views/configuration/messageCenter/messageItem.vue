<template>
  <div class="container_messageItem">
    <template v-if="props.item.isRead == 0">
      <el-badge is-dot style="width: 100%">
        <div style="display: flex; flex-direction: column">
          <span class="message_title">
            {{ props.item.title }}
          </span>
          <span class="message_desc">
            {{ props.item.content }}
          </span>
          <span class="message_datetime">
            {{ props.item.createTime }}
          </span>
        </div>
      </el-badge>
    </template>
    <template v-else>
      <div style="display: flex; flex-direction: column">
        <span class="message_title">
          {{ props.item.title }}
        </span>
        <span class="message_desc">
          {{ props.item.content }}
        </span>
        <span class="message_datetime">
          {{ props.item.createTime }}
        </span>
      </div>
    </template>
  </div>
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  }
});
</script>
<style scoped lang="scss">
.container_messageItem {
  border-radius: 10px;
  padding: 5px 20px;
  width: 100%;
  // background-color: red;
  display: flex;
  // align-items: center;
  justify-content: center;
  flex-direction: column;
  .message_title {
    font-size: 22px;
    font-weight: bolder;
    color: #6a6b6b;
  }
  .message_desc {
    font-size: 14px;
    color: #bfbfbf;
  }
  .message_datetime {
    font-size: 12px;
    color: #bfbfbf;
  }
}
</style>
