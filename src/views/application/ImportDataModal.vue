<template>
  <vxe-form vertical-align="center" title-align="right" :data="formData">
    <vxe-form-item
      title="Filename for export 导出文件名"
      field="fileName"
      span="24"
      :item-render="{ name: 'VxeInput' }"
    />
    <vxe-form-item
      vertical
      title="Select fields to export (defaults to all if none selected).请选择要导出的数据.(默认所有数据)"
    >
      <template #default>
        <vxe-table
          ref="tableRef"
          stripe="true"
          border
          size="medium"
          height="300"
          align="center"
          round="true"
          :row-config="{ isHover: true, drag: true }"
          :data="tableData"
        >
          <vxe-column type="checkbox" width="60" drag-sort />
          <vxe-column
            field="columnName"
            width="220"
            title="ColumnName 列字段"
            drag-sort
          />
        </vxe-table>
      </template>
    </vxe-form-item>
    <vxe-form-item span="24">
      <template #default>
        <vxe-button @click="handleImportData">Import Data-导出数据</vxe-button>
      </template>
    </vxe-form-item>
  </vxe-form>
</template>

<script setup>
import { getColumnsName, ImportData } from "@/api/application/application";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
const formDate = ref();
const tableData = ref();
const tableRef = ref();
const props = defineProps({
  searchParams: {
    type: Object
  }
});
//TODO 校验文件名是否有误
const handleImportData = async () => {
  var checkedColumnsName = tableRef.value.getCheckboxRecords();
  var requiredColumns = checkedColumnsName.map(item => item.columnName);
  await ImportData({
    ...props.searchParams,
    ...formDate.value,
    requiredColumns
  });
};

onMounted(async () => {
  tableData.value = await getColumnsName();
});
</script>
<style scoped lang="scss"></style>
