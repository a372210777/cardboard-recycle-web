<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="所属仓库" prop="fkWarehouse">
            <el-select v-model="form.warehouseInfo.pkWarehouse" @change="warehouseChange" filterable placeholder="请选择" style="width: 370px;" >
              <el-option
                v-for="item in warehouseList"
                :key="item.pkWarehouse"
                :label="item.name"
                :value="item.pkWarehouse" />
            </el-select>
          </el-form-item>
               
          <el-form-item label="楼层编码" prop="code">
            <el-input v-model="form.code" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="楼层名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所在楼层" prop="floorNo">
            <el-input v-model="form.floorNo" style="width: 370px;" />
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
        <el-table-column prop="fkWarehouse" label="所属仓库" />
        <el-table-column prop="code" label="楼层编码" />
        <el-table-column prop="name" label="楼层名称" />
        <el-table-column prop="floorNo" label="所在楼层" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','wmsBaseFloorInfo:edit','wmsBaseFloorInfo:del'])" label="操作" width="150px" align="center">
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
import crudWmsBaseFloorInfo from '@/api/baseData/floor/wmsBaseFloorInfo'
import {getWarehouseList} from '@/api/baseData/warehouse/wmsBaseWarehouseInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import {valueToString} from '@/utils/index'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'


const defaultForm = { pkFloor: null, warehouseInfo: {pkWarehouse:null,code:null}, code: null, name: null, floorNo: null, status: null, createBy: null, createTime: null, updateBy: null, updateTime: null, isValid: null }
export default {
  name: 'WmsBaseFloorInfo',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['status'],
  cruds() {
    return CRUD({ title: '楼层信息', url: 'api/wmsBaseFloorInfo', idField: 'pkFloor', sort: 'pkFloor,desc', crudMethod: { ...crudWmsBaseFloorInfo }})
  },
  data() {
    return {
      warehouseList:[],
      permission: {
        add: ['admin', 'wmsBaseFloorInfo:add'],
        edit: ['admin', 'wmsBaseFloorInfo:edit'],
        del: ['admin', 'wmsBaseFloorInfo:del']
      },
      rules: {
        'warehouseInfo.pkWarehouse': [
          { required: true, message: '所属仓库不能为空', trigger: 'blur' }
        ],
        code: [
          { required: false, message: '楼层编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '楼层名称不能为空', trigger: 'blur' }
        ],
        floorNo: [
          { required: true, message: '所在楼层不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }    }
  },
  created() {
    this.getWarehouseList();
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    //打卡编辑框后事件回调
    [CRUD.HOOK.afterToEdit]() {
      valueToString(this.form,['status','warehouseInfo.pkWarehouse'])
      return true
    },
    //仓库切换
    warehouseChange(val){
      console.log(val)
      let warehouse = this.warehouseList.find((item)=>{
        return item.pkWarehouse == val
      })
      if(warehouse){
        this.form.warehouseInfo.code = warehouse.code;
      }

    },
    getWarehouseList(){
      let params = {page: 0,size: 200,sort: 'pkWarehouse,desc'}
      getWarehouseList(params).then((res)=>{
        console.log(res)
        this.warehouseList = res.content || []
      }).catch(()=>{

      })
    }
  }
}
</script>

<style scoped>

</style>
