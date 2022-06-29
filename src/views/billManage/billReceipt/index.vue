<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">对账单号</label>
        <el-input
          v-model="query.id"
          clearable
          placeholder="对账单号"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">对账时间</label>
        <el-date-picker
          @change="dateChange"
          type="month"
          v-model="statementTime"
          clearable
          placeholder="请选择"
        >
        </el-date-picker>
        <label class="el-form-item-label">对账结果</label>
        <el-select
          v-model="query.statementResult"
          filterable
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in dict.statement_result"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <el-button
          slot="left"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="showDialog"
        >
          新建对账单
        </el-button>
      </crudOperation>
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="80px"
        >
          <el-form-item label="物料名称" prop="material.name">
            <el-input
              v-model="form.material.name"
              filterable
              clearable
              disabled
              placeholder="请选择"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="数量" prop="quantity">
            <el-input
              v-model="form.quantity"
              filterable
              clearable
              disabled
              placeholder="请选择"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="单价" prop="purchasePrice">
            <el-input
              v-model="form.purchasePrice"
              filterable
              clearable
              placeholder="请选择"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="对账结果" prop="statementResult">
            <el-select
              v-model="form.statementResult"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in dict.statement_result"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              filterable
              clearable
              placeholder="请选择"
              type="textarea"
              maxlength="500"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button
            :loading="crud.status.cu === 2"
            type="primary"
            @click="crud.submitCU"
            >确认</el-button
          >
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="对账单号">
          <template slot-scope="scope">
            {{ scope.row.statement.id }}
          </template>
        </el-table-column>
        <el-table-column prop="year" label="对账时间">
          <template slot-scope="scope">
            {{ scope.row.statement.year + "-" + scope.row.statement.month }}
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="对账人">
          <template slot-scope="scope">
            {{ scope.row.statement.createBy }}
          </template>
        </el-table-column>
        <el-table-column prop="statementTime" label="对账时间">
          <template slot-scope="scope">
            {{ scope.row.statement.statementTime }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="物料名称">
          <template slot-scope="scope">
            {{ scope.row.material.name }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="数量">
          <template slot-scope="scope">
            {{ scope.row.quantity }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="单价">
          <template slot-scope="scope">
            {{ scope.row.purchasePrice }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="对账结果">
          <template slot-scope="scope">
            {{ dict.label.statement_result[scope.row.statementResult] }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPer(['admin', 'statement:edit', 'statement:del'])"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
    <addDialog ref="addDialog"></addDialog>
  </div>
</template>

<script>
import crudStatement from "@/api/billManage/billReceipt";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import addDialog from "./addDialog";
const defaultForm = {
  id: null,
  year: null,
  month: null,
  createBy: null,
  statementTime: null,
  createTime: null,
  updateBy: null,
  updateTime: null,
  deleted: null
};
export default {
  name: "Statement",
  components: {
    pagination,
    crudOperation,
    rrOperation,
    udOperation,
    addDialog
  },
  dicts: ["material_category", "statement_result"],
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    let optShow = {
      add: false,
      edit: false,
      del: true,
      download: true,
      reset: true
    };
    return CRUD({
      optShow,
      title: "结算单",
      url: "api/statement",
      idField: "id",
      sort: "id,desc",
      crudMethod: { ...crudStatement }
    });
  },
  data() {
    return {
      statementTime: "", //对账时间
      permission: {
        add: ["admin", "statement:add"],
        edit: ["admin", "statement:edit"],
        del: ["admin", "statement:del"]
      },
      rules: {
        year: [
          { required: true, message: "对账年份不能为空", trigger: "blur" }
        ],
        month: [
          { required: true, message: "对账月份不能为空", trigger: "blur" }
        ],
        statementTime: [
          { required: true, message: "对账时间不能为空", trigger: "blur" }
        ]
      },
      queryTypeOptions: [
        { key: "id", display_name: "对账单号" },
        { key: "year", display_name: "对账年份" },
        { key: "month", display_name: "对账月份" },
        { key: "statementTime", display_name: "对账时间" }
      ]
    };
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },
    showDialog() {
      this.$refs.addDialog.show();
    },
    dateChange(val) {
      if (val) {
        this.query.year = new Date(val).getFullYear();
        this.query.month = new Date(val).getMonth() + 1;
      } else {
        this.query.year = null;
        this.query.month = null;
      }
    }
  }
};
</script>

<style scoped></style>
