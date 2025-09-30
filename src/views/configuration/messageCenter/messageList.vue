<template>
  <div class="container_messageList">
    <el-empty v-if="list.length == 0" description="Nothing" />
    <el-scrollbar v-else style="width: 100%; padding-top: 5px">
      <messageItem
        v-for="(item, index) in list"
        :key="index"
        class="messageItem"
        :class="{ active: activeIndex === index }"
        :item="item"
        @click="setActive(index, item)"
      />
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getByAccount } from "@/api/system/notice";
import messageItem from "./messageItem.vue";
import { useUserStoreHook } from "@/store/modules/user";
import { useNotificationStore } from "@/store/modules/noticeUnreadNum";
const emits = defineEmits(["ViewDetail"]);

const activeIndex = ref(null);
const list = ref([]);
const InitMessgeList = async () => {
  list.value = await getByAccount(useUserStoreHook()?.currentUser?.account);
};
onMounted(async () => {
  await InitMessgeList();
});
const setActive = (index, item) => {
  activeIndex.value = index;
  emits("ViewDetail", item);
  if (item.isRead == 0) {
    useNotificationStore()?.decrementUnreadCount();
    list.value[index].isRead = 1;
  }
};
defineExpose({ setActive });
</script>

<style scoped lang="scss">
.container_messageList {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 0 10px;

  .messageItem {
    transition: 0.5s linear;
    border: 1px solid transparent; /* 选中高亮的边框颜色 */
  }

  .messageItem:hover {
    cursor: pointer;
    transform: scale(1.02);
  }

  .messageItem.active {
    background-color: #f0f0f0; /* 选中高亮的背景颜色 */
    border: 1px solid #d2e8ff; /* 选中高亮的边框颜色 */
    color: #409eff !important;
  }
}
</style>
