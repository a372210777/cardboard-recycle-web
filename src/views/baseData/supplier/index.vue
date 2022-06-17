<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
       <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.name"
              clearable
              size="small"
              placeholder="请输入供应商名称"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
             <el-input
              v-model="query.code"
              clearable
              size="small"
              placeholder="请输入供应商编码"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <rrOperation />
          </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <el-button
          slot="right"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          size="mini"
          :loading="templateDownloadLoading"
          @click="downloadTemplate"
        >导入模板下载</el-button>
      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="编码" prop="code">
            <el-input v-model="form.code" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="简称" prop="shortName">
            <el-input v-model="form.shortName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="全称" prop="fullName">
            <el-input v-model="form.fullName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="结算周期（月）
            ">
            <el-input v-model="form.settlementCycle" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="结算日">
            <el-input v-model="form.settlementDays" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="签约类型">
            <el-select v-model="form.signType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.supplier_sign_type"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式">
            <el-select v-model="form.settlementType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.supplier_settlement_type"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="责任客服">
            <el-input v-model="form.fkUser" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.status"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="code" label="编码" />
        <el-table-column prop="shortName" label="简称" />
        <el-table-column prop="fullName" label="全称" />
        <el-table-column prop="settlementCycle" label="结算周期（月）" min-width="100"/>
        <el-table-column prop="settlementDays" label="结算日" />
        <el-table-column prop="signType" label="签约类型">
          <template slot-scope="scope">
            {{ dict.label.supplier_sign_type[scope.row.signType] }}
          </template>
        </el-table-column>
        <el-table-column prop="settlementType" label="结算方式">
          <template slot-scope="scope">
            {{ dict.label.supplier_settlement_type[scope.row.settlementType] }}
          </template>
        </el-table-column>
        <el-table-column prop="fkUser" label="责任客服" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','wmsBaseSupplierInfo:edit','wmsBaseSupplierInfo:del'])" label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            >
             <el-button  type="primary" icon="el-icon-user" size="mini" @click="addContact(scope.row)"/>
            </udOperation>
           
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
      <el-dialog :close-on-click-modal="false"  :visible.sync="contactDialogVisible" :title="'联系人'" width="80%">
        <contactDialog ref="contactDialog" ></contactDialog>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import crudWmsBaseSupplierInfo from '@/api/baseData/supplier/wmsBaseSupplierInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import {valueToString} from '@/utils/index'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import contactDialog from './contactDialog'

const defaultForm = { pkSupplier: null, code: null, shortName: null, fullName: null, settlementCycle: null, settlementDays: null, signType: null, settlementType: null, fkUser: null, status: null, createId: null, createTime: null, updateId: null, updateTime: null, isValid: null }
export default {
  name: 'WmsBaseSupplierInfo',
  components: { pagination, crudOperation, rrOperation, udOperation,contactDialog },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['status', 'supplier_sign_type', 'supplier_settlement_type'],
  cruds() {
    return CRUD({ title: '供应商', url: 'api/wmsBaseSupplierInfo', idField: 'pkSupplier', sort: 'pkSupplier,desc', crudMethod: { ...crudWmsBaseSupplierInfo }})
  },
  data() {
    return {
      contactDialogVisible:false,
      templateDownloadLoading:false,
      permission: {
        add: ['admin', 'wmsBaseSupplierInfo:add'],
        edit: ['admin', 'wmsBaseSupplierInfo:edit'],
        del: ['admin', 'wmsBaseSupplierInfo:del']
      },
      rules: {
        code: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '简称不能为空', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '全称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
      }    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
      
    },
    //打卡编辑框后事件回调
    [CRUD.HOOK.afterToEdit]() {
      valueToString(this.form,['settlementType','signType','status'])
      return true
      
    },
    addContact(row={}){
      this.contactDialogVisible = true
      this.$nextTick(()=>{
        this.$refs.contactDialog.setSupplier(row)
      })
    },
    //下载模板
    downloadTemplate(){
      this.templateDownloadLoading = true
      crudWmsBaseSupplierInfo.downloadTemp().then(()=>{
        this.templateDownloadLoading = false
      }).catch(()=>{
        this.templateDownloadLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
