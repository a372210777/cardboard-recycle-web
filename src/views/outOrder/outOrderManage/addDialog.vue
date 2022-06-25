<template>
  <div class="out-order-container">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      width="90%"
      title="新增"
      custom-class="out-order-dialog"
    >
      <h3 class="panel-title">出库物料</h3>
      <el-form
        ref="addForm"
        :model="formInline"
        :rules="rules"
        size="small"
        :inline="true"
        label-width="80px"
      >
        <el-form-item label="仓库" prop="warehouse">
          <el-select
            v-model="formInline.warehouse"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采购商" prop="warehouse">
          <el-select
            v-model="formInline.buyer"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in buyerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="承运商" prop="carrier">
          <el-select
            v-model="formInline.carrier"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in carrierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出库时间" prop="stockOutTime">
          <el-date-picker
            v-model="formInline.stockOutTime"
            type="date"
            clearable
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="物料" prop="material">
          <el-select
            v-model="formInline.material"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in materialList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="formInline.quantity" clearable />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select
            v-model="formInline.unit"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in dict.unit_of_weight"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="formInline.price" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textArea" v-model="formInline.remark" clearable />
        </el-form-item>
        <el-form-item label="" prop="">
          <el-button size="mini" type="primary" @click="addToList"
            >添加</el-button
          >
          <el-button size="mini" type="warning" @click="reset('addForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <div>
        <el-table ref="table" :data="addData" size="small" style="width: 100%;">
          <el-table-column prop="materialName" label="物料名称" />
          <el-table-column prop="quantity" label="数量" />
          <el-table-column prop="price" label="单价" />
          <el-table-column prop="unit" label="单位" />
          <el-table-column prop="warehouseName" label="仓库" />
          <el-table-column prop="stockOutTime" label="出库时间" />
          <el-table-column prop="buyerName" label="采购商" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" width="100px" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="delAddData(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <h3 class="panel-title">质检单</h3>
      <div>
        <el-form
          ref="checkForm"
          :model="checkForm"
          :rules="checkFormRules"
          size="small"
          :inline="true"
          label-width="80px"
        >
          <el-form-item label="物料" prop="material">
            <el-select
              v-model="checkForm.material"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in materialList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="毛重" prop="grossWeight">
            <el-input
              placeholder="请输入"
              v-model="checkForm.grossWeight"
              clearable
            />
          </el-form-item>
          <el-form-item label="皮重" prop="tareWeight">
            <el-input
              placeholder="请输入"
              v-model="checkForm.tareWeight"
              clearable
            />
          </el-form-item>
          <el-form-item label="净重" prop="netWeight">
            <el-input
              placeholder="请输入"
              v-model="checkForm.netWeight"
              clearable
            />
          </el-form-item>
          <el-form-item label="扣重" prop="deductWeight">
            <el-input
              placeholder="请输入"
              v-model="checkForm.deductWeight"
              clearable
            />
          </el-form-item>
          <el-form-item label="水分比例" prop="waterPercent">
            <el-input
              placeholder="请输入"
              v-model="checkForm.waterPercent"
              clearable
            />
          </el-form-item>
          <el-form-item label="杂物比例" prop="impurityPercent">
            <el-input
              placeholder="请输入"
              v-model="checkForm.impurityPercent"
              clearable
            />
          </el-form-item>
          <el-form-item label="杂纸比例" prop="incidentalPaperPercent">
            <el-input
              placeholder="请输入"
              v-model="checkForm.incidentalPaperPercent"
              clearable
            />
          </el-form-item>
          <el-form-item label="综合折率" prop="totalDeductPercent">
            <el-input
              placeholder="请输入"
              v-model="checkForm.totalDeductPercent"
              clearable
            />
          </el-form-item>
          <el-form-item label="折合重量" prop="warehouse">
            <el-input
              placeholder="请输入"
              v-model="checkForm.price"
              clearable
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              placeholder="请输入"
              v-model="checkForm.remark"
              clearable
            />
          </el-form-item>
          <el-form-item label="" prop="">
            <el-button size="mini" type="primary" @click="addToCheckList"
              >添加</el-button
            >
            <el-button size="mini" type="warning" @click="reset('checkForm')"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <el-table
          ref="table"
          :data="checkData"
          size="small"
          style="width: 100%;"
        >
          <el-table-column prop="materialName" label="物料" />
          <el-table-column prop="grossWeight" label="毛重" />
          <el-table-column prop="tareWeight" label="皮重" />
          <el-table-column prop="netWeight" label="净重" />
          <el-table-column prop="deductWeight" label="扣重" />
          <el-table-column prop="waterPercent" label="水分比例" />
          <el-table-column prop="impurityPercent" label="杂物比例" />
          <el-table-column prop="incidentalPaperPercent" label="杂纸比例" />
          <el-table-column prop="totalDeductPercent" label="综合折率" />
          <el-table-column prop="remark" label="折合重量" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" width="100px" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="delCheckData(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <h3 class="panel-title">托运单</h3>
        <el-form
          ref="transForm"
          :model="transForm"
          :rules="transFormRules"
          size="small"
          :inline="true"
          label-width="80px"
        >
          <el-form-item label="托运车数" prop="consignmentVehicles">
            <el-input
              placeholder="请输入"
              v-model.number="transForm.consignmentVehicles"
              clearable
            />
          </el-form-item>
          <el-form-item label="单车价格" prop="pricePerVehicle">
            <el-input
              placeholder="请输入"
              v-model="transForm.pricePerVehicle"
              clearable
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              placeholder="请输入"
              v-model="checkForm.remark"
              clearable
            />
          </el-form-item>

          <el-form-item label="" prop="">
            <el-button size="mini" type="warning" @click="reset('transForm')"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="addDialogVisible = false"
          >取消</el-button
        >
        <el-button :loading="loading" type="primary" @click="save"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import crudStockOutOrder from "@/api/outOrder/outOrderManage";
import {
  queryMaterial,
  queryWarehouse,
  queryCarrier,
  queryBuyer
} from "@/api/common";

import { generateRandom, deepClone } from "@/utils/index";
export default {
  name: "addDialog",

  dicts: ["unit_of_weight"],
  data() {
    return {
      addDialogVisible: false,
      detailDialog: false,
      addData: [], //新增table物料数据
      warehouseList: [], //仓库列表
      materialList: [], //物料数据
      buyerList: [], //采购商列表
      carrierList: [], //承运商列表
      loading: false,
      checkLoading: false,
      checkData: [], //质检单table数据

      formInline: {
        buyer: "", //采购商
        warehouse: "", //仓库ID
        carrier: "", //承运商
        stockOutTime: "", //出库时间
        material: "", //物料ID
        materialName: "",
        quantity: 0,
        price: "",
        remark: "",
        warehouseName: "",
        unit: ""
      },
      //质检单
      checkForm: {
        material: "", //物料
        grossWeight: "", //毛重
        tareWeight: "", //皮重
        netWeight: "", //净重
        deductWeight: "", //扣重
        impurityPercent: "", //杂物比列
        totalDeductPercent: "", //综合折率
        waterPercent: "", //水分比列
        incidentalPaperPercent: "", //杂纸比例
        weighingAttachment: "", //称重单附件
        remark: "" //备注
      },
      //托运单
      transForm: {
        consignmentVehicles: "", //托运车数
        pricePerVehicle: "800", //单车价格
        remark: ""
      },
      transFormRules: {
        consignmentVehicles: [
          { required: true, message: "托运车数不能为空", trigger: "blur" },
          { type: "number", message: "托运车数必须为数字值" }
        ],
        pricePerVehicle: [
          { required: true, message: "单车价格不能为空", trigger: "blur" }
        ]
      },
      checkFormRules: {
        material: [
          { required: true, message: "物料不能为空", trigger: "blur" }
        ],
        grossWeight: [
          { required: true, message: "毛重不能为空", trigger: "blur" }
        ],
        tareWeight: [
          { required: true, message: "皮重不能为空", trigger: "blur" }
        ],
        netWeight: [
          { required: true, message: "净重不能为空", trigger: "blur" }
        ],
        deductWeight: [
          { required: false, message: "扣重不能为空", trigger: "blur" }
        ],
        waterPercent: [
          { required: true, message: "水分比例不能为空", trigger: "blur" }
        ],
        impurityPercent: [
          { required: true, message: "杂物比例不能为空", trigger: "blur" }
        ],
        incidentalPaperPercent: [
          { required: true, message: "杂纸比例不能为空", trigger: "blur" }
        ],
        totalDeductPercent: [
          { required: true, message: "综合折率不能为空", trigger: "blur" }
        ]
      },
      rules: {
        stockOutTime: [
          { required: true, message: "出库时间不能为空", trigger: "blur" }
        ],
        buyer: [{ required: true, message: "采购商不能为空", trigger: "blur" }],
        warehouse: [
          { required: true, message: "仓库不能为空", trigger: "blur" }
        ],
        carrier: [
          { required: true, message: "承运商不能为空", trigger: "blur" }
        ],
        material: [
          { required: true, message: "物料不能为空", trigger: "blur" }
        ],
        quantity: [
          { required: true, message: "数量不能为空", trigger: "blur" }
        ],
        price: [{ required: true, message: "单价不能为空", trigger: "blur" }],
        unit: [{ required: true, message: "单位不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    "dict.unit_of_weight": {
      handler(val) {
        if (val && val.length) {
          this.formInline.unit = val[0].value;
        }
      },
      immediate: true
    }
  },
  mounted() {
    let params = {
      page: 0,
      size: 100
    };
    queryBuyer(params).then(res => {
      this.buyerList = res.content;
      if (this.buyerList.length) {
        this.formInline.buyer = this.buyerList[0].id;
      }
    });
    queryMaterial(params).then(res => {
      this.materialList = res.content;
      if (this.materialList.length) {
        this.formInline.material = this.materialList[0].id;
      }
    });
    queryWarehouse(params).then(res => {
      this.warehouseList = res.content;
      if (this.warehouseList.length) {
        this.formInline.warehouse = this.warehouseList[0].id;
      }
    });
    queryCarrier(params).then(res => {
      this.carrierList = res.content;
      if (this.carrierList.length) {
        this.formInline.carrier = this.carrierList[0].id;
      }
    });
  },
  methods: {
    //添加质检单
    addToCheckList() {
      this.$refs["checkForm"].validate(valid => {
        if (valid) {
          let materialItem = this.materialList.find(
            item => item.id == this.checkForm.material
          );
          this.checkForm.materialName = materialItem.name;
          this.checkForm.randomId = generateRandom();
          this.checkData.push(Object.assign({}, this.checkForm));
        }
      });
    },
    //删除质检数据
    delCheckData(data) {
      this.checkData = this.checkData.filter(item => {
        return item.randomId != data.randomId;
      });
    },

    showDialog(data = []) {
      this.addDialogVisible = true;
    },
    hideDialog() {
      this.addDialogVisible = false;
    },
    addToList(data) {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          let warehouseItem = this.warehouseList.find(
            item => item.id == this.formInline.warehouse
          );
          let materialItem = this.materialList.find(
            item => item.id == this.formInline.material
          );
          let buyerItem = this.buyerList.find(
            item => item.id == this.formInline.buyer
          );
          let carrierItem = this.carrierList.find(
            item => item.id == this.formInline.carrier
          );
          this.formInline.materialName = materialItem.name;
          this.formInline.warehouseName = warehouseItem.name;
          this.formInline.buyerName = buyerItem.name;
          this.formInline.carrierName = carrierItem.name;
          this.formInline.randomId = generateRandom();
          this.addData.push(Object.assign({}, this.formInline));
        }
      });
    },
    delAddData(data) {
      this.addData = this.addData.filter(item => {
        return item.randomId != data.randomId;
      });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
    },
    save() {
      if (!this.addData.length) {
        this.$message.warning("请先添加出库物料数据");
        return;
      }
      if (!this.checkData.length) {
        this.$message.warning("请先添加质检数据");
        return;
      }
      let isTransFormValid = false;
      this.$refs["transForm"].validate(valid => {
        isTransFormValid = valid;
      });
      if (!isTransFormValid) {
        this.$message.warning("托运单校验异常，请检查");
        return;
      }
      this.$confirm("确定要保存数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        let firstEle = this.addData[0];
        let submitData = {
          id: new Date().getTime(),
          stockOutTime: firstEle.stockOutTime,
          orderItems: [],
          buyer: {
            id: firstEle.buyer
          },
          carrier: {
            id: firstEle.carrier
          },
          warehouse: {
            id: firstEle.warehouse
          }
        };
        submitData.orderItems = deepClone(this.addData) || []; //入库单下的物料
        submitData.orderItems.forEach(item => {
          item.material = {
            id: item.material
          };
        });
        crudStockOutOrder
          .add(submitData)
          .then(res => {
            this.loading = false;
            this.addData = [];
            this.checkData = [];
            this.crud.refresh();
            this.addDialogVisible = false;
          })
          .catch(() => {
            this.loading = false;
            this.addDialogVisible = false;
          });
      });
    }
  }
};
</script>
<style lang="scss">
.out-order-container {
  .out-order-dialog {
    .el-dialog__body {
      max-height: 550px;
      overflow-y: scroll;
    }
  }
}
</style>
