<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="所属楼层" prop="fkFloor">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="库区编码" prop="code">
            <el-input v-model="form.code" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="库区名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="库区类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.area_type"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
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
        <el-table-column prop="fkFloor" label="所属楼层" />
        <el-table-column prop="code" label="库区编码" />
        <el-table-column prop="name" label="库区名称" />
        <el-table-column prop="type" label="库区类型" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','wmsBaseWarehouseAreaInfo:edit','wmsBaseWarehouseAreaInfo:del'])" label="操作" width="150px" align="center">
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
import crudWmsBaseWarehouseAreaInfo from '@/api/baseData/storeArea/wmsBaseWarehouseAreaInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { pkWarehouseArea: null, fkFloor: null, code: null, name: null, type: null, status: null, createBy: null, createTime: null, updateBy: null, updateTime: null, isValid: null }
export default {
  name: 'WmsBaseWarehouseAreaInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['status','area_type'],
  cruds() {
    return CRUD({ title: '库区信息', url: 'api/wmsBaseWarehouseAreaInfo', idField: 'pkWarehouseArea', sort: 'pkWarehouseArea,desc', crudMethod: { ...crudWmsBaseWarehouseAreaInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'wmsBaseWarehouseAreaInfo:add'],
        edit: ['admin', 'wmsBaseWarehouseAreaInfo:edit'],
        del: ['admin', 'wmsBaseWarehouseAreaInfo:del']
      },
      rules: {
        fkFloor: [
          { required: true, message: '所属楼层不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '库区编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '库区名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '库区类型不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
