<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="请输入店铺名称" style="width: 200px;" class="filter-item" clearable @change="handleFilter"/>

      <el-select v-model="listQuery.status" placeholder="请选择状态" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in statusList" :label="item" :key="index" :value="index"></el-option>
      </el-select>
      <el-select v-model="listQuery.plat_type" placeholder="请选择平台" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in plat_typeList" :key="index" :label="item" :value="index"></el-option>
      </el-select>
      <s-date-picker :date="listQuery.created_at" @changeDateTime="eventStartTime"></s-date-picker>
      <div>
        <el-button v-waves class="filter-item" type="info" icon="fa fa-refresh" @click="refresh">
          重置
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="addDialogVisible = true">
          添加
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="店铺">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="平台">
        <template slot-scope="{row}">
          <span>{{ plat_typeList[row.plat_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="地址">
        <template slot-scope="{row}">
          <el-link type="success" :href="row.url" target="_blank">{{ row.url }}</el-link>
        </template>
      </el-table-column>

<!--      <el-table-column width="150px" align="center" label="地址">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.province_to.name?row.province_to.name:'' }}{{ row.city_to.name?row.city_to.name:'' }}{{ row.county_to.name?row.county_to.name:'' }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="80px">
        <template slot-scope="{row}">
          <el-tooltip
            effect="dark"
            :content="statusList[row.status]"
            placement="top"
            :enterable="false">
            <el-switch
              v-model="row.status"
              active-color="#5FB878"
              inactive-color="#d2d2d2"
              :active-value="1"
              :inactive-value="0"
              @change="setStatus(row)"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" size="mini" @click="edit(row.id)">
            编辑
          </el-button>
          <el-button v-waves size="mini" type="success" @click="storeDeletePwd(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加对话框 -->
    <el-dialog   title="添加" :visible.sync="addDialogVisible" width="80%" @close="addDialogClose">
      <!-- 主体区 -->
      <el-form label-width="100px" :model="addForm" :rules="addRules" ref="addRef">
        <el-form-item label="名称" prop="name">
          <el-input placeholder="请输入店铺名称" maxlength="20" clearable show-word-limit v-model="addForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺编号" prop="number">
          <el-input placeholder="请输入店铺编号" maxlength="50" clearable show-word-limit v-model="addForm.number"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺地址" prop="url">
          <el-input placeholder="请输入店铺地址" maxlength="100" clearable show-word-limit v-model="addForm.url"
          ></el-input>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="状态">
              <el-radio-group v-model="addForm.status" size="medium">
                <el-radio v-for="(item,index) in statusList" :key="index" border :label="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="平台">
              <el-radio-group v-model="addForm.plat_type" size="medium">
                <el-radio v-for="(item,index) in plat_typeList" :key="index" border :label="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="addDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="80%" @close="editDialogClose">
      <!-- 主体区 -->
      <el-form label-width="100px" :model="editForm" :rules="editRules" ref="editRef">
        <el-form-item label="名称" prop="name">
          <el-input placeholder="请输入店铺名称" maxlength="50" clearable show-word-limit v-model="editForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺编号" prop="number">
          <el-input placeholder="请输入店铺编号" maxlength="50" clearable show-word-limit v-model="editForm.number"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺地址" prop="url">
          <el-input placeholder="请输入店铺地址" maxlength="100" clearable show-word-limit v-model="editForm.url"
          ></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="状态">
              <el-radio-group v-model="editForm.status" size="medium">
                <el-radio v-for="(item,index) in statusList" :key="index" border :label="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="平台">
              <el-radio-group v-model="editForm.plat_type" size="medium">
                <el-radio v-for="(item,index) in plat_typeList" :key="index" border :label="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="editDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="update()" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { storeIndex,storeStatus,storeStore,storeEdit,storeUpdate,storeDeletePwd } from '@/api/admin/store'
import { getAreaData } from '@/api/admin/config'
import {del} from "@/api/admin/team";
export default {
  name: 'storeIndex',
  data() {
    return {
      statusList:['拉黑','正常'],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name:'',
        plat_type:null,
        status:null,
        created_at:[],
        updated_at:[]
      },
      addDialogVisible:false,
      editDialogVisible:false,
      downloadLoading: false,
      addForm: {
        name: "",
        number:"",
        status: 1,
        plat_type: 1,

      },
      editForm: {
        id: "",
        name: "",
        number:"",
        status: 1,
        plat_type: 1,
      },
      addRules: {
        plat_type: [
          { required: true, message: "请选择平台！", trigger: "change" }
        ],
        number: [
          { required: true, message: "请输入店铺编号！", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入店铺名称！", trigger: "blur" },
          { min: 2, max: 20, message: "店铺长度在2到20个字符", trigger: "blur" }
        ]
      },
      editRules: {
        number: [
          { required: true, message: "请输入店铺编号！", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入店铺名称！", trigger: "blur" },
          { min: 2, max: 20, message: "店铺长度在2到20个字符", trigger: "blur" }
        ]
      },
      areaData:[],
      searchValue:[],
      addValue:[],
      editValue:[],
      plat_typeList:['未知','天猫','京东']
    }
  },
  async created() {
    await this.getList()
    await this.getAreaData()
  },
  methods: {
    searchHandleChange() {
      this.handleFilter()
    },
    addHandleChange() {
    },
    editHandleChange() {
    },
    eventStartTime(val){
      this.listQuery.created_at = val
      this.handleFilter()
    },
    async getAreaData(){
      getAreaData().then(response => {
        if(response.status === 20000){
          this.areaData = response.data
        }
      })
    },
    // 获取表格列表
    async getList() {
      this.listLoading = true
      storeIndex(this.listQuery).then(response => {
        if(response.status === 20000){
          this.list = response.data.list
          this.total = response.data.total
        }
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置
    refresh(){
      this.listQuery = {
        page: 1,
        limit: 10,
        name:"",
        plat_type:null,
        status:null,
        created_at:[],
        updated_at:[]
      }
      this.getList()
    },
    // 监听添加对话框的关闭事件
    addDialogClose() {
      this.addForm = {
        phone:"",
        email: "",
        name:"",
        status: 1,
        plat_type: 1
      }
      this.addValue = []
      this.$refs.addRef.resetFields()
    },
    // 添加按钮
    add() {
      this.$refs.addRef.validate(valid => {
        if (valid) {
          storeStore(this.addForm).then(response => {
            if(response.status === 20000){
              this.$base.message({ message: response.message })
              this.addDialogVisible = false
              this.getList()
            }
          })
        }
      })
    },
    // 状态调整
    setStatus(info) {
      storeStatus({id:info.id,status:info.status}).then(response => {
        if(response.status === 20000){
          this.$base.message({message:response.message})
        }else{
          info.status = info.status?0:1
        }
      })
    },
    //删除店铺
    storeDeletePwd(id){
      this.$base.confirm(
        { content: "确定删除吗！" },
        () => {
          storeDeletePwd({id:id}).then(response=>{
            this.$base.message({ message: response.message })
            this.addDialogVisible = false
            this.getList()
          })
        }
      )





    },


    // 打开编辑按钮对话框
    edit(id) {
      storeEdit({id:id}).then(response => {
        if(response.status === 20000){
          this.editDialogVisible = true
          this.editForm = response.data
          this.editValue = [response.data.province_id,response.data.city_id,response.data.county_id]
        }
      })
    },
    // 提交编辑数据
    update() {
      this.$refs.editRef.validate(valid => {
        if (valid) {
          storeUpdate(this.editForm).then(response => {
            if(response.status === 20000){
              this.$base.message({ message: response.message })

              this.editDialogVisible = false
              this.getList()
            }
          })
        }
      })
    },
    // 监听编辑对话框的关闭事件
    editDialogClose() {
      this.editForm = {
        id: "",
        name:"",

        status: 1,
        plat_type: 1,
        number: ""
      }
      this.editValue = []
      this.$refs.editRef.resetFields()
    },

    // 导出数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['编号', '店铺名称','店铺编号','店铺地址','平台','状态','创建时间']
        const filterVal = ['id', 'name','number','url','plat_type','status','created_at']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.$route.name
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'addess') {
          return (v.province_to.name?v.province_to.name:'')+(v.city_to.name?v.city_to.name:'')+(v.county_to.name?v.county_to.name:'')
        }else if(j === 'plat_type'){
          return this.plat_typeList[v[j]]
        }else if(j === 'status'){
          return this.statusList[v[j]]
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
