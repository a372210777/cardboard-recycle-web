<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 详情 -->
      <el-dialog
        title="新建对账单"
        :visible.sync="dialogVisible"
        width="90%"
        :close-on-click-modal="false"
      >
        <div class="block">
          <span class="demonstration">对账时间</span>
          <el-date-picker
            @change="dateChange"
            v-model="yearMonth"
            type="month"
            placeholder="选择月"
          >
          </el-date-picker>
        </div>
        <el-table
          ref="table"
          :data="tableData"
          size="small"
          style="width: 100%;"
        >
          <el-table-column prop="remark" label="物料">
            <template slot-scope="scope">
              {{ scope.row.material.name }}
            </template>
          </el-table-column>
          <el-table-column label="物料类别">
            <template slot-scope="scope">
              {{ dict.label.material_category[scope.row.material.category] }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" />
          <el-table-column prop="purchasePrice" label="采购单价">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.purchasePrice"
                clearable
                @input="inpuChange(scope.row)"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="合计金额">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.totalAmount"
                clearable
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="对账结果">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.statementResult"
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
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.remark"
                clearable
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="save"
            >保存</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import crudBillReceipt from "@/api/billManage/billReceipt";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import { deepClone, debounce, dateFormat } from "@/utils/index";
const defaultForm = {
  id: null,
  stockInOrderId: null,
  materialId: null,
  quantity: null,
  unit: null,
  remark: null
};
export default {
  name: "StockInOrderItem",
  components: { pagination, crudOperation, rrOperation, udOperation },
  dicts: ["statement_result", "material_category"],
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: "入库单明细",
      url: "api/stockInOrderItem",
      idField: "id",
      sort: "id,desc",
      crudMethod: { ...crudBillReceipt }
    });
  },
  data() {
    return {
      yearMonth: "",
      dialogVisible: false,
      tableData: [],
      loading: false,
      timer: "",
      permission: {
        add: ["admin", "stockInOrderItem:add"],
        edit: ["admin", "stockInOrderItem:edit"],
        del: ["admin", "stockInOrderItem:del"]
      }
    };
  },
  mounted() {},
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },
    show(data = []) {
      this.dialogVisible = true;
    },
    hide() {
      this.dialogVisible = false;
    },
    dateChange(val) {
      if (val) {
        let year = val.getFullYear();
        let month = val.getMonth() + 1;
        let params = {
          year: year,
          month: month
        };
        crudBillReceipt
          .staticsByMonth(params)
          .then(res => {
            this.tableData = res;
            if (!res || !res.length) {
              this.$message.warning("当前月份无入库物料数据");
            }
          })
          .catch(() => {});
      }
    },
    inpuChange(row = {}) {
      if (!row.purchasePrice) {
        row.totalAmount = "";
        return;
      }
      if (!/^[0-9]+(.[0-9]+)?$/.test(row.purchasePrice)) {
        this.$message.error("请输入合法数字");
        return;
      }
      row.totalAmount = (row.purchasePrice * row.quantity).toFixed(3);
    },
    queryData() {
      let params = {
        year: new Date(this.yearMonth).getFullYear(),
        month: new Date(this.yearMonth).getMonth() + 1
      };
      return crudBillReceipt
        .queryData(params)
        .then(res => {
          return res;
        })
        .catch(() => {
          return null;
        });
    },
    async save() {
      if (!this.tableData.length) {
        this.$message.warning("当前月份无入库数据");
        return;
      }
      let res = await this.queryData();
      let isOk = true;
      if (res && res.content && res.content.length) {
        isOk = await this.$confirm(
          `当前月份下的对账记录已经存在，继续操作将覆盖原有记录`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      }
      if (isOk) {
        this.loading = true;
        let year = new Date(this.yearMonth).getFullYear();
        let month = new Date(this.yearMonth).getMonth() + 1;
        let params = {
          month: month,
          statementItems: deepClone(this.tableData),
          statementTime: dateFormat(new Date(), "yyyy-MM-dd"),
          year: year
        };
        crudBillReceipt
          .add(params)
          .then(res => {
            console.log(res);
            this.loading = false;
            this.dialogVisible = false;
            this.$emit("saveSuccess");
          })
          .catch(() => {
            this.loading = false;
          });
      }
    }
  }
};
</script>

<style scoped></style>
