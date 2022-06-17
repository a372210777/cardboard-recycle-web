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
              placeholder="请输入仓库名称"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
             <el-input
              v-model="query.code"
              clearable
              size="small"
              placeholder="请输入仓库编码"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <rrOperation />
          </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="仓库编码" prop="code">
            <el-input v-model="form.code" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库负责人">
            <el-input v-model="form.principal" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="form.contactPhone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库地址">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库地区" prop="area">
            <el-select v-model="form.area" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.region"
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
        <el-table-column prop="code" label="仓库编码" />
        <el-table-column prop="name" label="仓库名称" />
        <el-table-column prop="principal" label="仓库负责人" />
        <el-table-column prop="contactPhone" label="联系电话" />
        <el-table-column prop="address" label="仓库地址" />
        <el-table-column prop="area" label="仓库地区">
          <template slot-scope="scope">
            {{ dict.label.region[scope.row.area] }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','wmsBaseWarehouseInfo:edit','wmsBaseWarehouseInfo:del'])" label="操作" width="150px" align="center">
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
import crudWmsBaseWarehouseInfo from '@/api/baseData/warehouse/wmsBaseWarehouseInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import {valueToString} from '@/utils/index'
const defaultForm = { pkWarehouse: null, code: null, name: null, principal: null, contactPhone: null, address: null, area: null, createId: null, createTime: null, updateId: null, updateTime: null, isValid: null }
export default {
  name: 'WmsBaseWarehouseInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['region','status'],
  cruds() {
    return CRUD({ title: '仓库', url: 'api/wmsBaseWarehouseInfo', idField: 'pkWarehouse', sort: 'pkWarehouse,desc', crudMethod: { ...crudWmsBaseWarehouseInfo }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'wmsBaseWarehouseInfo:add'],
        edit: ['admin', 'wmsBaseWarehouseInfo:edit'],
        del: ['admin', 'wmsBaseWarehouseInfo:del']
      },
      rules: {
        code: [
          { required: true, message: '仓库编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '仓库名称不能为空', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '仓库地区不能为空', trigger: 'blur' }
        ]
      }    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.afterToEdit]() {
      valueToString(this.form,['settlementType','signType','status'])
      return true
    }
  }
}
</script>

<style scoped>

</style>
