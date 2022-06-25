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
        <label class="el-form-item-label">对账年份</label>
        <el-input
          v-model="query.year"
          clearable
          placeholder="对账年份"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">对账月份</label>
        <el-input
          v-model="query.month"
          clearable
          placeholder="对账月份"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">对账时间</label>
        <el-input
          v-model="query.statementTime"
          clearable
          placeholder="对账时间"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
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
          <el-form-item label="对账年份" prop="year">
            <el-input v-model="form.year" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="对账月份" prop="month">
            <el-input v-model="form.month" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="对账人">
            <el-input v-model="form.createBy" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="对账时间" prop="statementTime">
            <el-input v-model="form.statementTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
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
        <el-table-column prop="id" label="对账单号" />
        <el-table-column prop="year" label="对账年份" />
        <el-table-column prop="month" label="对账月份" />
        <el-table-column prop="createBy" label="对账人" />
        <el-table-column prop="statementTime" label="对账时间" />
        <el-table-column prop="createTime" label="创建时间" />
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
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    let optShow = {
      add: false,
      edit: true,
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
    }
  }
};
</script>

<style scoped></style>
