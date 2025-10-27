<template>
  <vxe-modal
    ref="vxeModalRef"
    v-model="modalOptions.modalValue"
    width="90vw"
    height="90vh"
    :title="modalOptions.modalTitle"
    @close="handleCloseWindownWithFileClean"
    ><template v-if="formData.records">
      <div
        style="
          height: 90%;
          max-width: 600px;
          position: absolute;
          left: 20px;
          top: 40px;
        "
      >
        <Steps :StepsDetail="formData.records" />
      </div>
    </template>

    <div
      :style="{
        backgroundColor: 'white',
        margin: '10px',
        padding: '30px',
        marginLeft:
          formData.records != null && formData.records.length > 0
            ? '300px'
            : '0px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        border: '2px solid rgb(199.5, 201, 204)'
      }"
    >
      <header>
        <applicationHeader
          v-if="modalOptions.modalValue"
          :applicationType="labCategory"
        />
      </header>
      <main>
        <vxe-form
          ref="formRef"
          :rules="
            currentFunction == 'edit' && formData.status != 7
              ? rules1_edit
              : rules1_apply
          "
          class="form"
          title-align="right"
          title-width="190"
          :data="formData"
          :readonly="
            currentFunction == 'view' ||
            currentFunction == 'audit' ||
            currentFunction == 'reupload'
          "
          border
        >
          <vxe-form-item
            title="Requester Information 需求者信息"
            span="24"
            title-align="center"
            title-bold
            title-width="1200"
          />
          <vxe-form-item
            title="Requester 申请人"
            field="requesterName"
            span="12"
          />
          <vxe-form-item
            title="Cost Center 成本中心"
            field="costCenter"
            span="12"
            :item-render="{
              name: 'VxeInput',
              props: {
                placeholder: 'Please enter CC. 请输入成本中心'
              }
            }"
          />
          <vxe-form-item
            title="Application Date 申请日期"
            field="applicationDate"
            span="12"
          />
          <vxe-form-item
            title="CC Owner 成本中心主管"
            field="ccOwner"
            span="12"
            :item-render="{
              name: 'VxeInput',
              props: {
                placeholder: 'Please enter CC owner. 请输入成本中心主管'
              }
            }"
          />
          <vxe-form-item
            title="Call No. 联系号码"
            field="tel"
            span="12"
            :item-render="{
              name: 'VxeInput',
              props: {
                placeholder: 'Please enter Tel. 请输入联系电话'
              }
            }"
          />
          <!-- <vxe-form-item
            title="Work Cell 工作坊"
            field="workCell"
            span="12"
            :item-render="WCItemRender"
          >
           
          </vxe-form-item> -->
          <vxe-form-item title="Work Cell 工作坊" field="workCell" span="12">
            <template #default>
              <el-tag
                v-if="
                  currentFunction == 'view' ||
                  currentFunction == 'audit' ||
                  currentFunction == 'reupload'
                "
                >{{ formData.workCell }}</el-tag
              >
              <el-select
                v-else
                v-model="formData.workCell"
                placeholder="Please select or enter WC. 请选择或输入WC"
                allow-create
                filterable
                clearable
              >
                <el-option
                  v-for="item in WCOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Department 部门" field="dept" span="12" />
          <vxe-form-item
            v-if="
              formData.status != 0 &&
              formData.status != 1 &&
              formData.status != 2 &&
              formData.status != 7
            "
            title="Application No."
            field="applicationNo"
            span="12"
            :item-render="{
              name: 'VxeInput',
              props: {
                placeholder: 'Please enter ApplicationNo.请输入申请编号'
              }
            }"
          />
        </vxe-form>
        <vxe-form
          ref="formRef2"
          :rules="
            currentFunction == 'edit'
              ? rules2_edit
              : formData.labCategory == 1
                ? rules2_apply_Rel
                : rules2_apply_FA
          "
          vertical-align="center"
          border
          title-align="right"
          title-width="190"
          :data="formData"
          :readonly="
            currentFunction == 'view' ||
            currentFunction == 'audit' ||
            currentFunction == 'reupload'
          "
        >
          <vxe-form-item
            title-width="1200"
            title="Sample Information 样品信息"
            span="24"
            title-bold
            title-align="center"
          />
          <vxe-form-item
            title="Project Name 项目名称"
            field="projectName"
            span="4"
            :item-render="{
              name: 'VxeInput',
              props: {
                placeholder: 'project name 请输入项目名称'
              }
            }"
            vertical
            title-align="center"
          />
          <vxe-form-item
            title="Sample Type 样品类型"
            field="sampleType"
            span="4"
            :item-render="{
              name: 'VxeInput',
              props: {
                placeholder: 'sample type 请输入样品类型'
              }
            }"
            vertical
            title-align="center"
          />
          <vxe-form-item
            title="Sample Model/Specification 样品型号/规格"
            field="sampleModel"
            span="8"
            :item-render="{
              name: 'VxeInput',
              props: {
                placeholder: 'Please enter smaple model. 请输入样品型号'
              }
            }"
            vertical
          />
          <vxe-form-item
            title="Sample Q'TY 样品数量"
            field="sampleQuantity"
            span="4"
            :item-render="{
              name: 'VxeInput',
              props: {
                type: 'number',
                min: 1,
                max: 1000
              }
            }"
            vertical
          />
          <vxe-form-item
            title="Build Phase 制造阶段"
            field="buildPhase"
            span="4"
            :item-render="{
              name: 'VxeInput',
              props: {
                placeholder: 'build phase 请输入制造阶段'
              }
            }"
            vertical
          />

          <vxe-form-item title="Test Item 测试项目" span="24" :item-render="{}">
            <!-- <template #title>
              <el-tooltip :visible="visibleCost">
                <template #content>
                  <span>{{ formData.cost }}$</span>
                </template>
                <span @click="showCost" @mouseleave="visibleCost = false"
                  >Test Item 测试项目
                </span>
              </el-tooltip>
            </template> -->
            <template #default>
              <!-- 仅展示 -->
              <template
                v-if="currentFunction != 'add' && currentFunction != 'edit'"
              >
                <el-table
                  stripe
                  :summary-method="getSummaries"
                  border
                  :data="testItemTable"
                >
                  <!-- :span-method="mergeColumns" -->
                  <el-table-column
                    align="center"
                    prop="itemDesc"
                    label="Test Item 测试项"
                  />
                  <el-table-column
                    align="center"
                    prop="usage"
                    label="Quantity 数量"
                  >
                    <template #default="{ row }">
                      {{ row.usage }}
                      <span style="font-size: 12px"
                        >{{ row.unitDisplay }}
                      </span>

                      <!-- <template v-if="row.id != 1">
                        {{ row.usage }}
                        <span style="font-size: 12px"
                          >{{ row.unitDisplay }}
                        </span>
                      </template>
                      <template v-else>
                        {{ formData.testItemDesc }}
                      </template> -->
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="
                      formData.status != 0 &&
                      formData.status != 1 &&
                      formData.status != 2 &&
                      formData.status != 3 &&
                      formData.status != 7
                    "
                    prop="cost_total"
                    align="center"
                    label="Cost($) 价格"
                  >
                    <!-- <template #default="{ row }">
                      <span v-if="row.id != 1">
                        {{ (row.usage / row.limit) * row.cost }}
                      </span>
                      <span v-else
                        ><span> {{ formData.testItemDescCost }}$ </span></span
                      >
                    </template> -->
                  </el-table-column>
                  <el-table-column
                    prop="usage"
                    label="Unit 单位"
                    align="center"
                  >
                    <template #default="{ row }">
                      <el-tag>{{ row.unit ? row.unit : "--" }} </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <!-- 可编辑 -->
              <template v-else>
                <div style="display: flex; flex-direction: column; gap: 10px">
                  <el-table
                    stripe
                    :summary-method="getSummaries"
                    show-summary
                    border
                    :data="testItemTable"
                  >
                    <!-- :span-method="mergeColumns" -->
                    <el-table-column
                      align="center"
                      prop="itemDesc"
                      label="Test Item 测试项"
                      width="350"
                    />
                    <el-table-column
                      align="center"
                      prop="unitDisplay"
                      label="Quantity 数量"
                    >
                      <template #default="{ row }">
                        <el-input
                          v-model="row.usage"
                          type="number"
                          @input="handleUsageChange(row)"
                        >
                          <template #suffix>
                            {{ row.unitDisplay }}
                          </template>
                        </el-input>
                        <!-- <el-input v-if="row.id != 1" v-model="row.usage">
                          <template #suffix>
                            {{ row.unitDisplay }}
                          </template>
                        </el-input>
                        <span v-else>
                          <el-input
                            v-model="formData.testItemDesc"
                            placeholder="Please enter Other-请输入其他测试项"
                          />
                        </span> -->
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="currentFunction == 'edit' && formData.status == 3"
                      align="center"
                      label="Cost($) 价格"
                    >
                      <template #default="{ row }">
                        <span>
                          <el-input v-model="row.cost_total" type="number" />
                        </span>
                        <!-- <span>
                          <el-input v-model="row.cost_total" type="number" />
                        </span> -->
                        <!-- <span v-if="row.id != 1">
                          <el-input v-model="row.cost_total" type="number" />
                        </span>
                        <span>
                          <el-input v-model="row.cost_total" type="number" />
                        </span> -->

                        <!-- <span v-if="row.id != 1">
                          {{ (row.usage / row.limit) * row.cost }}
                        </span>
                        <span v-else
                          ><el-input
                            v-model="formData.testItemDescCost"
                            placeholder="请输入其他测试项Cost"
                          >
                            <template #suffix> $ </template>
                          </el-input></span
                        > -->
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="unit"
                      label="Unit 单位"
                      width="100"
                    >
                      <template #default="{ row }">
                        <el-tag v-if="row.id != 1">
                          {{ row.unit }}
                        </el-tag>
                        <span v-else> -- </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="Operation 操作"
                      width="100"
                    >
                      <template #default="{ row }">
                        <el-button
                          type="danger"
                          link
                          @click="removeTestItem(row.itemDesc)"
                          >Remove 移除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button style="width: 100%" @click="showTestItemAddDialog">
                    Add Item 增加测试项
                  </el-button>
                </div>
              </template>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="Background 失效背景"
            field="background"
            span="24"
          >
            <template #default>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-direction: row;
                  gap: 10px;
                "
              >
                <vxe-textarea
                  v-model="formData.backgroundDesc"
                  placeholder="Please enter background. 请输入失效背景"
                  :autosize="{ minRows: 2 }"
                />
                <vxe-upload
                  v-model="formData.backgroundFileList"
                  :show-tip="false"
                  tip-text="background"
                  show-download-button
                  show-preview
                  show-progress
                  show-error-status
                  :download-method="downloadMethod"
                  :upload-method="UploadMethod"
                  :remove-method="RemoveMethod"
                  :preview-method="previewMethod"
                  :more-config="{
                    maxCount: 1,
                    layout: 'horizontal'
                  }"
                  button-text="Click or drag to upload 点击或拖拽上传"
                  multiple
                />
              </div>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Test Condition 测试条件" span="24">
            <template #default>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-direction: row;
                  gap: 10px;
                "
              >
                <vxe-textarea
                  v-model="formData.testConditionDesc"
                  placeholder="Please enter test condition. 请输入测试条件"
                  :autosize="{ minRows: 2 }"
                />
                <vxe-upload
                  v-model="formData.testConditionFileList"
                  :show-tip="false"
                  tip-text="testCondition"
                  show-download-button
                  show-preview
                  show-progress
                  show-error-status
                  :download-method="downloadMethod"
                  :upload-method="UploadMethod"
                  :remove-method="RemoveMethod"
                  :preview-method="previewMethod"
                  :more-config="{
                    maxCount: 1,
                    layout: 'horizontal'
                  }"
                  button-text="Click or drag to upload 点击或拖拽上传"
                  multiple
                />
              </div>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="Test Standard 测试标准"
            field="testStandard"
            span="12"
          >
            <template #default>
              <el-select
                v-model="formData.testStandard"
                :disabled="
                  currentFunction == 'view' ||
                  currentFunction == 'audit' ||
                  currentFunction == 'reupload'
                "
                value-key="value"
                clearable
                filterable
                allow-create
                multiple
                placeholder="test standard.请选择测试标准"
              >
                <el-option
                  v-for="item in testStandardOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              /></el-select>
              <!-- <vxe-select
                v-model="formData.testStandard"
                :options="testStandardOptions"
                clearable
                allow-create
                filterable
                multiple
                placeholder="test standard.请选择测试标准"
              /> -->
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="Conclusion 是否判定"
            field="conclusion"
            span="6"
            :item-render="ConclusionRadioGroup"
          />
          <vxe-form-item
            title="Get back samples 取回样品"
            field="isBack"
            span="24"
            :item-render="BackSampleRadioGroup"
          />
          <!-- <vxe-form-item
            title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Acceptance Criteria 判定标准"
            field="acceptanceCriteria"
            span="24"
            :item-render="{
              name: 'VxeTextarea',
              props: {
                autosize: { minRows: 4, maxRows: 8 },
                maxlength: 500,
                showWordCount: true,
                placeholder: 'Please enter acceptance criteria. 请输入判定标准'
              }
            }"
          /> -->
          <vxe-form-item
            title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Acceptance Criteria 判定标准"
            field="acceptanceCriteria"
            span="24"
            :item-render="{
              // name: 'VxeTextarea',
              // props: {
              //   autosize: { minRows: 4, maxRows: 8 },
              //   maxlength: 500,
              //   showWordCount: true,
              //   placeholder: 'Please enter acceptance criteria. 请输入判定标准'
              // }
            }"
          >
            <template #default>
              <vxe-textarea
                v-model="formData.acceptanceCriteria"
                placeholder="Please enter acceptance criteria. 请输入判定标准"
                max-length="500"
                show-word-count
                :autosize="{ minRows: 4, maxRows: 8 }"
              /> </template
          ></vxe-form-item>

          <vxe-form-item
            title="Report Form 报告类型"
            field="reportFormType"
            span="24"
            :item-render="ReportTypeRadioGroup"
          />
          <vxe-form-item
            v-if="
              formData.status != 0 &&
              formData.status != 1 &&
              formData.status != 2 &&
              formData.status != 7
            "
            title="Confirmed by Laboratory 实验室确认人"
            field="confirmingPerson"
            span="6"
          >
            <template #default>
              <vxe-select
                v-model="formData.confirmingPerson"
                :options="LaboratorOptions"
                clearable
                filterable
                placeholder="请选择确认人"
              />
            </template>
          </vxe-form-item>
          <vxe-form-item
            v-if="
              formData.status != 0 &&
              formData.status != 1 &&
              formData.status != 2 &&
              formData.status != 7
            "
            title="Sample Received Time 样品接收时间"
            field="sampleReceivedTime"
            span="6"
            title-width="150"
            :item-render="{ name: 'VxeDatePicker' }"
          />
          <vxe-form-item
            v-if="
              formData.status != 0 &&
              formData.status != 1 &&
              formData.status != 2 &&
              formData.status != 7
            "
            title="Estimated Completion Time预计完成时间"
            field="completionTime"
            span="6"
            :item-render="{ name: 'VxeDatePicker' }"
          />

          <vxe-form-item
            v-if="
              formData.status != 0 &&
              formData.status != 1 &&
              formData.status != 2 &&
              formData.status != 7
            "
            title-width="60"
            title="Remark 备注"
            field="remark"
            span="6"
            :item-render="{
              name: 'VxeTextarea',
              props: { autosize: { minRows: 2, maxRows: 4 } }
            }"
          />
          <vxe-form-item
            v-if="formData.status != 0 && formData.status != 7"
            title="Report"
            span="24"
          >
            <template #default>
              <vxe-upload
                v-model="formData.reportFileList"
                :readonly="
                  currentFunction != 'edit' && currentFunction != 'reupload'
                "
                :show-tip="false"
                tip-text="report"
                show-download-button
                show-preview
                show-progress
                :file-types="
                  formData.reportFormType == 1 || formData.reportFormType == 2
                    ? ['pdf']
                    : ['pdf', 'xlsx', 'zip', 'rar']
                "
                show-error-status
                :download-method="downloadMethod"
                :upload-method="UploadMethod"
                :remove-method="RemoveMethod"
                :preview-method="previewMethod"
                :more-config="{
                  layout: 'horizontal'
                }"
                button-text="Click or drag to upload 点击或拖拽上传"
                multiple
              />
            </template>
          </vxe-form-item>
          <!-- <vxe-form-item
            v-if="formData.status != 0 && formData.reportFormType != 4"
            title="Report"
            span="24"
          >
            <template #default>
              <vxe-upload
                v-model="formData.reportFileList"
                :show-tip="false"
                tip-text="report"
                show-download-button
                show-preview
                show-progress
                :limit-count="1"
                :file-types="['pdf', 'xlsx']"
                show-error-status
                :download-method="downloadMethod"
                :upload-method="UploadMethod"
                :remove-method="RemoveMethod"
                :preview-method="previewMethod"
                :more-config="{
                  layout: 'horizontal'
                }"
              />
            </template>
          </vxe-form-item> -->
          <vxe-form-item align="center" span="24" :item-render="{}">
            <template #default>
              <vxe-button v-if="currentFunction == 'view'" @click="handleExport"
                >Export 导出</vxe-button
              >

              <vxe-button
                v-if="
                  currentFunction == 'add' ||
                  (currentFunction == 'edit' && route.meta.tag != 'admin') ||
                  currentFunction == 'reupload'
                "
                type="submit"
                status="primary"
                content="Submit 提交"
                @click="handleSubmit(false)"
              />
              <vxe-button
                v-if="currentFunction == 'add'"
                type="reset"
                content="Reset 重置"
                @click="resetFormData()"
              />
              <!-- 不做状态改变 -->
              <vxe-button
                v-if="currentFunction == 'edit' || currentFunction == 'add'"
                type="primary"
                content="Save 保存"
                @click="handleSubmit(true)"
              />
              <template
                v-if="
                  currentFunction == 'audit' &&
                  (formData.status == 5 || formData.status == 4)
                "
              >
                <el-button type="success" @click="handleAudit()">
                  Pass 通过
                </el-button>
                <el-button type="danger" @click="handleRejectAudit()">
                  Reject 拒绝
                </el-button>
              </template>
            </template>
          </vxe-form-item>
        </vxe-form>
      </main>
      <footer>
        <applicationFooter />
      </footer>
    </div>
  </vxe-modal>
  <!-- <el-dialog v-model="remarkVisiable" title="Enter rejection reason">
    <span>Rejection Reason：</span>
    <el-input
      v-model="remark"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
    />
    <template #footer>
      <el-button @click="remarkVisiable = false"> Cancel </el-button>
      <el-button type="primary" @click="handleRejectAudit()">
        Confirm
      </el-button>
    </template>
  </el-dialog> -->
  <el-dialog v-model="testItemAddVisiable" title="Add Test Item-添加测试项">
    <el-form
      ref="testItemRef"
      label-width="150"
      label-position="right"
      :rules="rule2testItem"
      :model="TestItemForm"
    >
      <el-form-item label="Test Item 测试项" prop="id">
        <el-select
          v-model="testItem"
          placeholder="Please select test item. 请选择测试项"
          value-key="id"
          filterable
          @change="handleTestItemSelect"
        >
          <el-option
            v-for="item in testItemRealOptions"
            :key="item.id"
            :value="item"
            :label="item.itemDesc"
          />
        </el-select>
      </el-form-item>
      <!-- 数量 -->
      <!-- <el-form-item v-if="testItem.id != 1" label="Quantity 数量" prop="usage">
        <el-input-number
          v-model="testItem.usage"
          style="width: 280px"
          controls-position="right"
          placeholder="Please enter Qty. 请输入数量"
        />
      </el-form-item> -->
      <!-- 其他描述 -->
      <el-form-item
        v-if="testItem != null && testItem.id == 1"
        label="Desc. 描述"
        prop="desc"
      >
        <el-input
          v-model="TestItemForm.desc"
          placeholder="请输入其他测试项具体描述"
        />
      </el-form-item>
      <el-form-item label="Quantity 数量" prop="usage">
        <el-input
          v-model="TestItemForm.usage"
          type="number"
          style="width: 280px"
          controls-position="right"
          placeholder="Please enter Qty. 请输入数量"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="testItemAddVisiable = false">Cancel-取消</el-button>
        <el-button type="primary" @click="handleTestItemAdd">
          Confirm-确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <Preview ref="previewRef" />
</template>
<script setup lang="ts">
import {
  VxeButton,
  VxeForm,
  VxeFormItem,
  VxeFormItemPropTypes,
  VxeUploadPropTypes,
  VxeFormInstance,
  VxeUI
} from "vxe-pc-ui";

import { ref, reactive, onMounted, nextTick, h } from "vue";
import {
  auditRejectRequest,
  auditRequest,
  ExportWord,
  getSingle,
  getUserOptionsByRoleId,
  submitData,
  reuploadReport
} from "@/api/application/application";
import Preview from "@/components/Preview/Preview.vue";
import applicationHeader from "./applicationHeader.vue";
import applicationFooter from "./applicationFooter.vue";
import { GetNowDate } from "@/utils/time";
import { getWorkCellOption } from "@/api/system/organization";
import { getTestItemOptions } from "@/api/configuration/testItem";
import { getTestStandardOptions } from "@/api/configuration/testStandard";
import {
  addFileList,
  deleteData,
  deleteDataByIds,
  download
} from "@/api/system/profileSystem";
import Steps from "./Steps.vue";
import { ElMessage, ElInput } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { useRoute } from "vue-router";
import {
  rule2testItem,
  rules1_apply,
  rules1_edit,
  rules2_apply_FA,
  rules2_apply_Rel,
  rules2_edit
} from "./static/rules.js";

const route = useRoute();
const props = defineProps({
  userInfo: {
    type: Object
  },
  applicationType: {
    type: Number,
    default: null
  }
});

const labCategory = ref();
const testItemRef = ref();
const formData = ref<FormDataVO>({
  id: null,
  // testItemDescCost: 0,
  labCategory: 0,
  requesterName: "",
  requesterAccount: "",
  costCenter: "",
  applicationDate: "",
  ccOwner: "",
  tel: "",
  workCell: "",
  dept: "",
  applicationNo: "",
  projectName: "",
  sampleType: "",
  sampleQuantity: 0,
  buildPhase: "",
  sampleModel: "",
  testItemList: [],
  // testItemDesc: "",
  backgroundDesc: "",
  backgroundFileIds: [],
  backgroundFileList: [],
  testConditionDesc: "",
  testConditionFileIds: [],
  testConditionFileList: [],
  testStandard: [],
  testStandardOther: [],
  conclusion: 0,
  isBack: 1,
  acceptanceCriteria: "",
  reportFormType: 1,
  confirmingPerson: "",
  sampleReceivedTime: "",
  completionTime: "",
  remark: "",
  reportFileList: [],
  reportFileIds: [],
  status: 0,
  cost: 0,
  records: []
});

const emits = defineEmits<{
  (e: "reload"): void;
}>();
// const formData.status = ref(0);
// const stampPdfRef = ref();
const vxeModalRef = ref();
const testItemTable = ref([]);
const oldTestItemNum = ref(0);
// const handleTestItemChange = value => {
//   if (value.length > oldTestItemNum.value && value.length > 0) {
//     var option = value[value.length - 1];
//     option.usage = 0;
//     testItemTable.value.push(option);
//     oldTestItemNum.value = value.length;
//   }
// };
// const handleRemoveTag = tagValue => {
//   testItemTable.value = testItemTable.value.filter(
//     item => item.id != tagValue.id
//   );
//   oldTestItemNum.value--;
// };
const removeTestItem = desc => {
  testItemTable.value = testItemTable.value.filter(
    item => item.itemDesc != desc
  );
  // formData.value.testItemList = formData.value.testItemList.filter(
  //   item => item.id != id
  // );
  oldTestItemNum.value--;
};

// const mergeColumns = ({ row, column, rowIndex, columnIndex }) => {
//   if (currentFunction.value != "edit") {
//     if (row.itemDesc === "Other") {
//       if (columnIndex === 1) {
//         return {
//           rowspan: 1,
//           colspan: 2 // 合并指定内容列
//         };
//       }
//       if (columnIndex == 2) {
//         return {
//           rowspan: 0,
//           colspan: 0
//         };
//       }
//     }
//   }
// };

const getSummaries = param => {
  if (currentFunction.value == "edit" && formData.value.status == 3) {
    const { columns, data } = param;
    const sums = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h("div", { style: { textDecoration: "underline" } }, [
          "Total Cost（For reference only）"
        ]);
        return;
      }
      if (index == 2) {
        formData.value.cost = data.reduce((prev, curr) => {
          if (curr.cost_total == null) {
            curr.cost_total = 0;
          }
          // if (curr.id != 1) {
          return (
            // prev + (Number(curr.usage) / Number(curr.limit)) * Number(curr.cost)
            prev + Number(curr.cost_total)
          );
          // } else {
          // return prev;
          // }
        }, 0);
        // sums[index] = Number(formData.value.testItemDescCost) + temp;
        sums[index] = `${formData.value.cost}$`;
        // sums[index] += formData.value.testItemDescCost;
        // if (currentFunction.value == "add") {
        //   sums[index] = `${data.reduce((prev, curr) => {
        //     if (curr.id != 1) {
        //       return prev + (curr.usage / curr.limit) * curr.cost;
        //     } else {
        //       return prev;
        //     }
        //   }, 0)}`;
        // } else {
        //   if (currentFunction.value == "edit") {
        //     sums[index] = `${data.reduce((prev, curr) => {
        //       if (curr.id != 1) {
        //         return prev + (curr.usage / curr.limit) * curr.cost;
        //       } else {
        //         return prev;
        //       }
        //     }, 0)}`;
        //     sums[index] += formData.value.testItemDescCost;
        //   }
        // }
      } else {
        sums[index] = "--";
      }
    });

    return sums;
  } else return;
};
const TestItemForm = ref({
  usage: null,
  desc: null
});
const handleTestItemSelect = testItemSelected => {
  TestItemForm.value = {
    cost_per: testItemSelected.cost_per,
    id: testItemSelected.id,
    itemDesc: testItemSelected.itemDesc,
    labeCategory: testItemSelected.labeCategory,
    limit: testItemSelected.limit,
    unit: testItemSelected.unit,
    unitDisplay: testItemSelected.unitDisplay
  };
};
const testItemAddVisiable = ref(false);
const testItem = ref();
function filterByProperty(sourceArray, targetArray, property) {
  const result = [];

  for (let i = 0; i < targetArray.length; i++) {
    let found = false;
    if (targetArray[i][property] != 1) {
      for (let j = 0; j < sourceArray.length; j++) {
        if (targetArray[i][property] === sourceArray[j][property]) {
          found = true;
          break;
        }
      }
    }
    if (!found) {
      result.push(targetArray[i]);
    }
  }

  return result;
}
const InitTestItemForm = () => {
  testItem.value = null;
  TestItemForm.value = {
    id: null,
    usage: null,
    desc: null
  };
};
const showTestItemAddDialog = () => {
  testItemRealOptions.value = filterByProperty(
    testItemTable.value,
    testItemOptions.value,
    "id"
  );
  InitTestItemForm();
  testItemAddVisiable.value = true;
};
//处理添加测试项
const handleTestItemAdd = async () => {
  if (TestItemForm.value == null) return;
  if (TestItemForm.value.id == null) {
    ElMessage.warning("Test Item-测试项不可为空");
    return;
  }
  if (TestItemForm.value.usage == null) {
    ElMessage.warning("Quantity-用量不可为空");
    return;
  }
  if (TestItemForm.value.id == 1) {
    if (TestItemForm.value.itemDesc == null) {
      ElMessage.warning("其他测试项描述不可为空");
      return;
    } else {
      var tempItemDesc = `${TestItemForm.value.itemDesc}-${TestItemForm.value.desc} `;
      //遍历查找是否有重复Other测试项
      var duplicate = testItemTable.value.find(
        item => item.itemDesc == tempItemDesc
      );
      if (duplicate != null) {
        ElMessage.warning("测试项重复请检查");
        return;
      }
      TestItemForm.value.itemDesc = tempItemDesc;
    }
  }
  if (TestItemForm.value.cost_per != null) {
    TestItemForm.value.cost =
      TestItemForm.value.cost_per * TestItemForm.value.usage;
  }

  testItemTable.value.push(TestItemForm.value);
  testItemAddVisiable.value = false;
  nextTick(() => testItemRef.value.clearValidate());
};
const modalOptions = reactive<{
  modalValue: boolean;
  modalTitle: string;
  canSubmit: boolean;
  showModalFlag: boolean;
}>({
  modalValue: false,
  modalTitle: "",
  canSubmit: true,
  showModalFlag: false
});

const showModal = (title?: string, canSubmit?: boolean): void => {
  updatedFileIds.value = [];
  deletedFileId.value = [];
  modalOptions.modalTitle = title;
  modalOptions.modalValue = true;
  modalOptions.canSubmit = canSubmit ?? true;
  modalOptions.showModalFlag = true;
};
const closeModal = () => {
  emits("reload");
  modalOptions.modalValue = false;
  modalOptions.showModalFlag = false;
  currentFunction.value = "";
};
const currentFunction = ref();
const InitApplyInfo = () => {
  formData.value.applicationDate = GetNowDate();
  //每个resubmit的request的ID都是新的，没有重复利用requestID的道理
  formData.value.id = null;
  formData.value.applicationNo = "";
  formData.value.confirmingPerson = "";
  formData.value.sampleReceivedTime = "";
  formData.value.completionTime = "";
  formData.value.remark = "";
  formData.value.reportFileIds = [];
  formData.value.reportFileList = [];
  formData.value.backgroundFileIds = [];
  formData.value.backgroundFileList = [];
  formData.value.testConditionFileIds = [];
  formData.value.testConditionFileList = [];
  formData.value.status = 0;
  labCategory.value = formData.value.labCategory;
  testItemTable.value = formData.value.testItemList;
};
const showAddModal = async record => {
  currentFunction.value = "add";
  // updatedFileIds.value = [];
  if (record == null) {
    labCategory.value = props.applicationType;
    formData.value = await InitformData();
  } else {
    formData.value = await getSingle(record.id);
    InitApplyInfo();
  }

  testItemOptions.value = await getTestItemOptions({
    labCategory: labCategory.value
  });
  testStandardOptions.value = await getTestStandardOptions(labCategory.value);
  showModal();
  nextTick(() => {
    formRef.value.clearValidate();
    formRef2.value.clearValidate();
  });
};
const showViewModal = async requestId => {
  currentFunction.value = "view";
  formData.value = await getSingle(requestId);
  testItemTable.value = formData.value.testItemList;

  labCategory.value = formData.value.labCategory;
  LaboratorOptions.value = await getUserOptionsByRoleId({
    // roleName: "Project Leader",
    configCode: "role_project_leader",
    labCategory: labCategory.value
  });
  //todo
  testStandardOptions.value = await getTestStandardOptions(labCategory.value);
  formData.value.testStandard = formData.value.testStandard.concat(
    formData.value.testStandardOther
  );
  showModal();
};
const showEditModal = async (requestId, isLink) => {
  console.log(requestId);
  formData.value = await getSingle(requestId);
  if (isLink) {
    if (formData.value.status != 3) {
      showViewModal(requestId);
      return;
    }
  }
  currentFunction.value = "edit";
  labCategory.value = formData.value.labCategory;
  testItemTable.value = formData.value.testItemList;
  testItemOptions.value = await getTestItemOptions({
    labCategory: labCategory.value
  });
  LaboratorOptions.value = await getUserOptionsByRoleId({
    // roleName: "Project Leader",
    configCode: "role_project_leader",
    labCategory: labCategory.value
  });
  testStandardOptions.value = await getTestStandardOptions(labCategory.value);
  formData.value.testStandard = formData.value.testStandard.concat(
    formData.value.testStandardOther
  );

  showModal();
  nextTick(() => {
    formRef.value.clearValidate();
    formRef2.value.clearValidate();
  });
};
const showAuditModal = async data => {
  currentFunction.value = "audit";
  formData.value = await getSingle(data.id);
  testItemTable.value = formData.value.testItemList;
  labCategory.value = formData.value.labCategory;
  LaboratorOptions.value = await getUserOptionsByRoleId({
    // roleName: "Project Leader",
    configCode: "role_project_leader",
    labCategory: labCategory.value
  });
  testStandardOptions.value = await getTestStandardOptions(labCategory.value);
  formData.value.testStandard = formData.value.testStandard.concat(
    formData.value.testStandardOther
  );
  showModal();
};
const handleAudit = async () => {
  await auditRequest({
    requestId: formData.value.id,
    operator: useUserStoreHook().currentUser?.name
  });
  // if (result) {
  //   if (formData.value.status == 5) {
  //     if (
  //       formData.value.reportFormType != 4 &&
  //       formData.value.reportFormType != 3
  //     ) {
  //       await stampPdf({ flag: 1, requestId: formData.value.id });
  //     }
  //   }
  // }
  // emits("reload");
  // modalOptions.modalValue = false;
  // currentFunction.value = "";
  closeModal();
};

const rejectReason = ref();
const handleRejectAudit = async () => {
  rejectReason.value = "";
  const modalResult = await VxeUI.modal.confirm({
    iconStatus: "info",
    title: "Reject Request-拒绝审核通过",
    message:
      "Are you sure you want to reject this request? 你确定要拒绝审核通过？",
    slots: {
      default: params => [
        h("div", { style: "padding-right: 10px;" }, [
          h(
            "p",
            { style: "margin-bottom: 8px;" },
            `Please enter reject reason 请输入拒绝 ${formData.value.projectName}_${formData.value.applicationNo} 理由：`
          ),
          h(ElInput, {
            modelValue: rejectReason.value,
            placeholder: "Reject Reason 拒绝理由",
            type: "textarea",
            rows: 5,
            onInput: (val: string) => {
              rejectReason.value = val;
            }
          })
        ])
      ]
    }
  });
  if (modalResult == "confirm") {
    await auditRejectRequest({
      requestId: formData.value.id,
      rejectReason: rejectReason.value,
      operator: useUserStoreHook()?.currentUser?.name
    });
    // emits("reload");
    // modalOptions.modalValue = false;
    // currentFunction.value = "";
    closeModal();
  }
};
const showReuploadModal = async (record: Recordable) => {
  currentFunction.value = "reupload";
  // updatedFileIds.value = [];
  formData.value = await getSingle(record.id);
  // 初始化 selectedObjects
  labCategory.value = formData.value.labCategory;
  testItemTable.value = formData.value.testItemList;
  testItemOptions.value = await getTestItemOptions({
    labCategory: labCategory.value
  });
  LaboratorOptions.value = await getUserOptionsByRoleId({
    // roleName: "Project Leader",
    configCode: "role_project_leader",
    labCategory: labCategory.value
  });
  testStandardOptions.value = await getTestStandardOptions(labCategory.value);
  formData.value.testStandard = formData.value.testStandard.concat(
    formData.value.testStandardOther
  );

  showModal();
  nextTick(() => {
    formRef.value.clearValidate();
    formRef2.value.clearValidate();
  });
};

const formRef = ref<VxeFormInstance>();
const formRef2 = ref<VxeFormInstance>();
interface Option {
  label: string;
  value: string;
}
interface FormDataVO {
  id: number | null;
  requesterName: string;
  requesterAccount: string;
  costCenter: string;
  applicationDate: string;
  ccOwner: string;
  tel: string;
  workCell: string;
  dept: string;
  applicationNo: string;
  projectName: string;
  sampleType: string;
  sampleQuantity: number;
  buildPhase: string;
  sampleModel: string;
  testItemList: [];
  // testItemDesc: string;
  // testItemDescCost: number;
  backgroundDesc: string;
  backgroundFileIds: string[];
  backgroundFileList: VxeUploadPropTypes.ModelValue | object[];
  testConditionDesc: string;
  testConditionFileList: VxeUploadPropTypes.ModelValue | object[];
  testConditionFileIds: string[];
  testStandard: [];
  testStandardOther: [];
  conclusion: number;
  isBack: number;
  acceptanceCriteria: string;
  reportFormType: number;
  confirmingPerson: string;
  sampleReceivedTime: string;
  completionTime: string;
  remark: string;
  reportFileIds: string[];
  reportFileList: VxeUploadPropTypes.ModelValue | object[];
  labCategory: number;
  status: number;
  cost: number;
  records: [];
}
const WCOptions = ref();
// const WCItemRender = reactive<VxeFormItemPropTypes.ItemRender>({
//   name: "VxeSelect",
//   options: [],
//   props: {
//     placeholder: "Please select WC.请选择工作坊"
//   }
// });
const testItemOptions = ref([]);
const testStandardOptions = ref();
const testItemRealOptions = ref();
const LaboratorOptions = ref<Option[]>();
const ConclusionRadioGroup = reactive<VxeFormItemPropTypes.ItemRender>({
  name: "VxeRadioGroup",
  props: {
    type: "button"
  },
  options: [
    { label: "是", value: 1 },
    { label: "否", value: 0 }
  ]
});
const BackSampleRadioGroup = reactive<VxeFormItemPropTypes.ItemRender>({
  name: "VxeRadioGroup",
  props: {
    type: "button"
  },
  options: [
    { label: "取回", value: 1 },
    { label: "不取回", value: 0 }
  ]
});
const ReportTypeRadioGroup = reactive<VxeFormItemPropTypes.ItemRender>({
  name: "VxeRadioGroup",
  props: {
    type: "button"
  },
  options: [
    { label: "简易报告", value: 1 },
    { label: "正式报告", value: 2 },
    { label: "客制报告", value: 3 },
    { label: "不出报告（仅提供试验数据）", value: 4 }
  ]
});
const updatedFileIds = ref([]);
const handleCloseWindownWithFileClean = async () => {
  if (
    updatedFileIds.value != null &&
    updatedFileIds.value.length > 0 &&
    modalOptions.showModalFlag
  ) {
    await deleteDataByIds({ id: formData.value.id, Ids: updatedFileIds.value });
  }
  modalOptions.showModalFlag = modalOptions.modalValue;
};
const handleFile = CombineFlag => {
  if (
    formData.value.backgroundFileList != null &&
    formData.value.backgroundFileList.length > 0
  ) {
    formData.value.backgroundFileIds = formData.value.backgroundFileList.map(
      item => item.id
    );
  } else {
    formData.value.backgroundFileIds = [];
  }
  if (
    formData.value.testConditionFileList != null &&
    formData.value.testConditionFileList.length > 0
  ) {
    formData.value.testConditionFileIds =
      formData.value.testConditionFileList.map(item => item.id);
  } else {
    formData.value.testConditionFileIds = [];
  }
  if (
    formData.value.reportFileList != null &&
    formData.value.reportFileList.length > 0
  ) {
    formData.value.reportFileIds = formData.value.reportFileList.map(
      item => item.id
    );
  } else {
    formData.value.reportFileIds = [];
  }
  if (CombineFlag) {
    return formData.value.backgroundFileIds
      .concat(formData.value.testConditionFileIds)
      .concat(formData.value.reportFileIds)
      .map(Number);
  }
};
const handleSubmit = async (save: boolean) => {
  try {
    if (currentFunction.value == "reupload") {
      //获取文件id
      var reportListIds = formData.value.reportFileList.map(item => item.id);
      //上传新报告
      await reuploadReport({
        deletedFileId,
        requestId: formData.value.id,
        reportListIds
      });
      // emits("reload");
      // modalOptions.modalValue = false;
      // currentFunction.value = "";
      // deletedFileId.value = [];
      closeModal();
      return;
    }
    //处理上传文件
    handleFile(false);
    //分割其他测试项
    formData.value.testStandardOther = [];
    formData.value.testItemList = testItemTable.value;
    if (formData.value.testStandard.length > 0) {
      formData.value.testStandardOther = formData.value.testStandard.filter(
        item => typeof item == "string"
      );
      formData.value.testStandard = formData.value.testStandard.filter(
        item => typeof item == "number"
      );
    }
    // if (testItemTable.value.some(item => item.id == 1)) {
    //   formData.value.testItemList = testItemTable.value.filter(
    //     item => item.id != 1
    //   );
    // } else {
    //   formData.value.testItemList = testItemTable.value;
    //   // formData.value.testItemDesc = "";
    // }
    //上传or保存（区别是否改变状态）
    if (save) {
      // if (formData.value.reportFormType == 4) {
      //   //删除report
      //   formData.value.reportFileIds.map(item => {
      //     deletedFileId.value.push(item);
      //   });
      //   formData.value.reportFileList = [];
      //   formData.value.reportFileIds = [];
      // }
      //save 不改变状态
      await submitData({
        ...formData.value,
        save: save,
        deletedFileIds: deletedFileId.value,
        operator: useUserStoreHook()?.currentUser?.name
      });
      // emits("reload");
      // modalOptions.modalValue = false;
      // currentFunction.value = "";
      closeModal();
    } else {
      //递进下一个
      //通过currentFunction来判断改变的状态是什么
      //判定是否符合表单rules
      await formRef.value.validate(async valid => {
        if (valid == null) {
          formRef2.value.validate(async valid2 => {
            if (valid2 == null) {
              if (
                formData.value.testItemList == null ||
                formData.value.testItemList.length == 0
              ) {
                ElMessage.error(
                  "Please select at least one test item. 请选择至少一项测试项"
                );
                return;
              }
              switch (formData.value.status) {
                //生成
                case 0:
                  await submitData(formData.value);
                  break;
                // case 1:
                //   await submitData(formData.value);
                //   break;
                //edit reupload submit not for save
                default:
                  // if (formData.value.reportFormType != 4) {
                  if (
                    formData.value.reportFileList == null ||
                    formData.value.reportFileList.length == 0
                  ) {
                    ElMessage.error(
                      "	Please upload the report. 请上传测试报告或测试数据"
                    );
                    return;
                  }
                  // } else {
                  //   //删除report
                  //   formData.value.reportFileIds.map(item => {
                  //     deletedFileId.value.push(item);
                  //   });
                  //   formData.value.reportFileList = [];
                  //   formData.value.reportFileIds = [];
                  // }
                  await submitData({
                    ...formData.value,
                    save: save,
                    deletedFileIds: deletedFileId.value,
                    operator: useUserStoreHook()?.currentUser?.name
                  });
                  break;
              }
              // emits("reload");
              // modalOptions.modalValue = false;
              // currentFunction.value = "";
              closeModal();
            } else {
              let errorMessage = "";
              for (const field in valid) {
                errorMessage += `${field}、`;
              }
              ElMessage.error({
                message: `${errorMessage}-Does not meet form requirements.`
              });
            }
          });
        } else {
          let errorMessage = "";
          for (const field in valid) {
            errorMessage += `${field}、`;
          }
          ElMessage.error({
            message: `${errorMessage}-Does not meet form requirements.`
          });
        }
      });
    }
    // currentFunction.value = "";
  } catch (e) {}
};
const downloadMethod: VxeUploadPropTypes.DownloadMethod = async ({
  option
}) => {
  try {
    if (option.id != null) {
      await download(option.id);
    } else {
      const blob = await fetch(option.url).then(response => response.blob());
      await VxeUI.saveFile({
        filename: option.name,
        content: blob
      });
    }
    VxeUI.modal.message({
      content: `${option.name}-Download successful.`,
      status: "success"
    });
  } catch (e) {
    VxeUI.modal.message({
      content: `${option.name}-Download failed.`,
      status: "error"
    });
  }
};

const UploadMethod: VxeUploadPropTypes.UploadMethod = async ({
  $upload,
  file,
  option
}) => {
  try {
    const formFileData = new FormData();
    formFileData.append("files", file);
    //添加文件至服务器请求
    let fileIds = await addFileList(formFileData);
    // }
    option.id = fileIds[0];
    updatedFileIds.value.push(fileIds[0]);
    VxeUI.modal.message({
      content: `${option.name}-Upload successful 上传成功`,
      status: "success"
    });
  } catch (e) {
    switch ($upload.props.tipText) {
      case "background":
        formData.value.backgroundFileList =
          formData.value.backgroundFileList.filter(
            item => item.name !== option.name
          );
        break;
      case "testCondition":
        formData.value.testConditionFileList =
          formData.value.testConditionFileList.filter(
            item => item.name !== option.name
          );
        break;
      case "report":
        formData.value.reportFileList = formData.value.reportFileList.filter(
          item => item.name !== option.name
        );
        break;
      default:
        break;
    }
    //删除上传失败文件列表
    VxeUI.modal.message({
      content: `${option.name}-Upload failed 上传失败`,
      status: "error"
    });
  }
};
const deletedFileId = ref([]);
const RemoveMethod = async ({ option }) => {
  try {
    if (formData.value.status == 0) {
      await deleteData(option.id);
      VxeUI.modal.message({
        content: `${option.name}-Deletion successful.`,
        status: "success"
      });
    } else {
      deletedFileId.value.push(option.id);
    }
  } catch (e) {
    VxeUI.modal.message({
      content: `${option.name}-Deletion failed`,
      status: "error"
    });
  }
};

onMounted(async () => {
  if (formData.value.status == 0) {
    await getOptions();
    labCategory.value = props.applicationType;
  }
});
// 0: 初始化
// 1：测试中
// 2：审核/完成
const getOptions = async () => {
  // WCItemRender.options = await getWorkCellOption();
  WCOptions.value = await getWorkCellOption();
  // testItemOptions.value = await getTestItemOptions({
  //   labCategory: props.applicationType
  // });
};
const resetFormData = async () => {
  var FileIds = handleFile(true);
  if (FileIds.length > 0) {
    await deleteDataByIds(FileIds);
  }
  formData.value = {
    testStandardOther: [],
    // testItemDescCost: 0,
    labCategory: props.applicationType,
    requesterName: props.userInfo.name,
    requesterAccount: props.userInfo.account,
    costCenter: "",
    applicationDate: GetNowDate(),
    ccOwner: "",
    tel: "",
    workCell: "",
    dept: props.userInfo.department,
    applicationNo: "",
    projectName: "",
    sampleType: "",
    sampleQuantity: 0,
    buildPhase: "",
    sampleModel: "",
    testItemList: [],
    // testItemDesc: "",
    backgroundDesc: "",
    backgroundFileList: [],
    backgroundFileIds: [],
    testConditionDesc: "",
    testConditionFileList: [],
    testConditionFileIds: [],
    testStandard: [],
    conclusion: 0,
    isBack: 1,
    acceptanceCriteria: "",
    reportFormType: 1,
    confirmingPerson: "",
    sampleReceivedTime: "",
    completionTime: "",
    remark: "",
    reportFileList: [],
    reportFileIds: [],
    status: 0,
    cost: 0
  };
  testItemTable.value = [];
  oldTestItemNum.value = 0;
};
const InitformData = async () => {
  testItemTable.value = [];
  oldTestItemNum.value = 0;
  return {
    // testItemDescCost: 0,
    cost: 0,
    labCategory: props.applicationType ? props.applicationType : 0,
    requesterName: props.userInfo.name,
    requesterAccount: props.userInfo.account,
    costCenter: "",
    applicationDate: GetNowDate(),
    ccOwner: "",
    tel: "",
    workCell: "",
    dept: props.userInfo.department,
    applicationNo: "",
    projectName: "",
    sampleType: "",
    sampleQuantity: 0,
    buildPhase: "",
    sampleModel: "",
    testItemList: [],
    // testItemDesc: "",
    backgroundDesc: "",
    backgroundFileList: [],
    backgroundFileIds: [],
    testConditionDesc: "",
    testConditionFileList: [],
    testConditionFileIds: [],
    testStandard: [],
    conclusion: 0,
    isBack: 1,
    acceptanceCriteria: "",
    reportFormType: 1,
    confirmingPerson: "",
    sampleReceivedTime: "",
    completionTime: "",
    remark: "",
    reportFileList: [],
    reportFileIds: [],
    status: 0
  };
  // formData.value.backgroundDesc = "";
  // formData.value.testConditionDesc = "";
};
defineExpose({
  showAddModal,
  showViewModal,
  showAuditModal,
  showEditModal,
  showReuploadModal
});
//预览
const previewRef = ref();
const previewMethod = params => {
  previewRef.value.showPreview(params, false);
};
const handleUsageChange = row => {
  row.cost_total = row.usage * row.cost_per;
};
const handleExport = async () => {
  await ExportWord(formData.value.id);
  // modalOptions.modalValue = false;
  // closeModal();
};
</script>
<style lang="scss" scoped></style>
