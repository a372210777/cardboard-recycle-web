<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :modal="false" :modal-append-to-body='false' :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="站点名称" prop="stationName">
            <el-input v-model="form.stationName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="省市区">
            <el-input v-model="form.provinceAndCity" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="form.contactName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="form.contactPhone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.memo" style="width: 370px;" />
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
        <el-table-column prop="stationName" label="站点名称" />
        <el-table-column prop="provinceAndCity" label="省市区" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="contactName" label="联系人" />
        <el-table-column prop="contactPhone" label="联系电话" />
        <el-table-column prop="memo" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','wmsBaseSupplierContactInfo:edit','wmsBaseSupplierContactInfo:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudWmsBaseSupplierContactInfo from '@/api/baseData/supplier/wmsBaseSupplierContactInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { "supplier": {"pkSupplier": null},stationName: null, provinceAndCity: null, address: null, contactName: null, contactPhone: null, memo: null,  }
export default {
  name: 'WmsBaseSupplierContactInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '供应商联系人',queryOnPresenterCreated:false, url: 'api/wmsBaseSupplierContactInfo', idField: 'pkSupplierContact', sort: 'pkSupplierContact,desc', crudMethod: { ...crudWmsBaseSupplierContactInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'wmsBaseSupplierContactInfo:add'],
        edit: ['admin', 'wmsBaseSupplierContactInfo:edit'],
        del: ['admin', 'wmsBaseSupplierContactInfo:del']
      },
      rules: {
        stationName: [
          { required: true, message: '站点名称不能为空', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '创建人id不能为空', trigger: 'blur' }
        ]
      }    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    beforeCreate() {
       this.crud.query.fkSupplier = this.pkSupplier
    },
    setSupplier(data){
      this.crud.query.fkSupplier = data.pkSupplier
      this.crud.toQuery()
    }
  }
}
</script>

<style scoped>

</style>
