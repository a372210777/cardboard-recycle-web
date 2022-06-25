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
            v-model="month"
            type="month"
            placeholder="选择月"
          >
          </el-date-picker>
        </div>
        <el-table
          ref="table"
          :data="orderItems"
          size="small"
          style="width: 100%;"
        >
          <el-table-column prop="materialName" label="物料" />
          <el-table-column prop="materialName" label="物料类别" />
          <el-table-column prop="quantity" label="数量" />
          <el-table-column prop="remark" label="采购单价">
            <template slot-scope="scope">
              {{}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="合计金额">
            <template slot-scope="scope">
              {{}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="对账结果"></el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
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
      month: "",
      dialogVisible: false,
      orderItems: [],
      permission: {
        add: ["admin", "stockInOrderItem:add"],
        edit: ["admin", "stockInOrderItem:edit"],
        del: ["admin", "stockInOrderItem:del"]
      }
    };
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },
    show(data = []) {
      this.dialogVisible = true;
      this.orderItems = data;
      this.orderItems.forEach(element => {
        element.materialName = element.material.name;
      });
    },
    hide() {
      this.dialogVisible = false;
      this.orderItems = [];
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
            console.log("xxx==", res);
          })
          .catch(() => {});
      }
    },
    save() {}
  }
};
</script>

<style scoped></style>
