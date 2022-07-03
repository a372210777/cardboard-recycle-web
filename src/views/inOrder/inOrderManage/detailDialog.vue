<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 详情 -->
      <el-dialog
        title="物料明细"
        :visible.sync="dialogVisible"
        width="800px"
        :close-on-click-modal="false"
      >
        <el-table
          ref="table"
          :data="orderItems"
          size="small"
          style="width: 100%;"
        >
          <el-table-column prop="id" label="物料编码" />
          <el-table-column prop="materialName" label="物料" />
          <el-table-column prop="quantity" label="数量" />
          <el-table-column prop="unitPrice" label="单价（元）" />
          <el-table-column prop="unit" label="单位" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
        <!--分页组件-->
        <pagination />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import crudStockInOrderItem from "@/api/inOrder/inOrderManage/stockInOrderItem";
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
      crudMethod: { ...crudStockInOrderItem }
    });
  },
  data() {
    return {
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
    showDialog(data = []) {
      this.dialogVisible = true;
      this.orderItems = data;
      console.log("xxxx", data);
      this.orderItems.forEach(element => {
        element.materialName = element.material.name;
      });
    },
    hideDialog() {
      this.dialogVisible = false;
      this.orderItems = [];
    }
  }
};
</script>

<style scoped></style>
