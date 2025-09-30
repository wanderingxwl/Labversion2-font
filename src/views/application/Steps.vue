<template>
  <div style="height: 300px; max-width: 600px">
    <el-steps direction="vertical" :active="props.StepsDetail.length - 1">
      <template v-for="item in props.StepsDetail">
        <el-step :title="item.title" :icon="item.icon">
          <template #description>
            <div class="desc">
              <div class="operator">
                <span class="operator_title"> Operator: </span>
                <span class="operator_name">
                  {{ item.operator }}
                </span>
              </div>
              <div class="note">
                {{ item.note }}
              </div>
            </div>
          </template>
        </el-step>
      </template>
    </el-steps>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  StepsDetail: {
    type: Array,
    default: () => []
  }
});
</script>
<style scoped lang="scss"></style>
