<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.platform_name" placeholder="请输入平台名称" style="width: 200px;" class="filter-item" clearable @change="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="请选择状态" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option label="禁用" value="0"></el-option>
        <el-option label="启用" value="1"></el-option>
      </el-select>
      <s-date-picker :date="listQuery.created_at" @changeDateTime="eventStartTime"></s-date-picker>
      <div>
        <el-button v-waves class="filter-item" type="info" icon="fa fa-refresh" @click="refresh">
          重置
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addDialogVisible = true">
          新建
        </el-button>
        <el-button v-waves class="filter-item" type="danger" :disabled="multipleSelection.length===0" icon="el-icon-delete" @click="operationLogDestroyAll">
          删除
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
      </div>

    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column align="center" label="序号" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="平台名称">
        <template slot-scope="{row}">
          <span>{{ row.platform_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="260px" align="center" label="备注">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="80">
        <template slot-scope="{row}">
          <el-tooltip
            effect="dark"
            :content="row.status===1 ? '启用' : '禁用'"
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
      <el-table-column label="操作" align="center" width="350px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" size="mini" @click="edit(row.id)">
            修改
          </el-button>
          <el-button v-waves type="primary" size="mini" @click="getAuthList(row.id)">
            授权账号列表
          </el-button>
          <el-button v-waves size="mini" type="danger" @click="platformDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加对话框 -->
    <el-dialog   title="新建" :visible.sync="addDialogVisible" width="80%" @close="addDialogClose">
      <!-- 主体区 -->
      <el-form label-width="100px" :model="addForm" :rules="addRules" ref="addRef">
        <el-form-item label="平台名称" prop="platform_name">
          <el-input placeholder="请输入平台名称" maxlength="20" clearable show-word-limit v-model="addForm.platform_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input placeholder="请输入商品备注" clearable show-word-limit v-model="addForm.remark"
          ></el-input>
        </el-form-item>
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
        <el-form-item label="平台名称" prop="platform_name">
          <el-input placeholder="请输入平台名称" maxlength="20" clearable show-word-limit v-model="editForm.platform_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input placeholder="请输入商品备注" clearable show-word-limit v-model="editForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="editDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="update()" >确 定</el-button>
      </span>
    </el-dialog>

    <!--平台授权列表弹窗-->
    <el-dialog   title="授权账号" :visible.sync="authDialogVisible" width="80%" @close="authDialogClose">
      <!-- 主体区 -->
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="toAuth()">
          授权
        </el-button>
      </div>
      <el-table v-loading="platformListLoading" :data="authList" ref="authRef" border :fit="true" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column align="center" label="编号" width="80px">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="center" label="平台名称">
          <template slot-scope="{row}">
            <span>{{ row.platform.platform_name ? row.platform.platform_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="250px" align="center" label="户名称">
          <template slot-scope="{row}">
            <span>{{ row.account_name}}</span>
          </template>
        </el-table-column>
        <el-table-column width="250px" align="center" label="授权有效期">
          <template slot-scope="{row}">
            <span>{{ row.access_token_time }}</span>
          </template>
        </el-table-column>
        <el-table-column width="250px" align="center" label="创建时间">
          <template slot-scope="{row}">
            <span>{{ row.created_at }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="status" width="80">
          <template slot-scope="{row}">
            <el-tooltip
              effect="dark"
              :content="row.status===1 ? '启用' : '禁用'"
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
            <el-button v-waves type="primary" size="mini" @click="toAuth()">
              重新授权
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {
    platformList,
    platformStatus,
    platformAdd,
    platformInfo,
    platformUpdate,
    platformDelete
  } from '@/api/admin/platform'
  import {
    getThirdAuthList,getAuthUrl
  } from '@/api/admin/auth'
  export default {
    name: 'PlatformIndex',
    components: {

    },
    data() {
      return {
        list: null,
        authList: null,
        platformId: 0,
        total: 0,
        authTotal: 0,
        authUrl: '',
        listLoading: true,
        platformListLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          platform_name:'',
          status:null,
          created_at:[],
          updated_at:[]
        },
        imageList:[],
        barcodeList:[],
        multipleSelection:[],
        addDialogVisible:false,
        editDialogVisible:false,
        urlDialogVisible:false,
        authDialogVisible:false,
        downloadLoading: false,
        addForm: {
          platform_name: "",
          // platform_type: "",
          remark: "",
        },
        editForm: {
          id: "",
          platform_name: "",
          // platform_type: "",
          remark: "",
        },
        addRules: {
          platform_name: [
            { required: true, message: "请输入平台名称！", trigger: "blur" },
            { min: 2, max: 20, message: "名称长度在2到20个字符", trigger: "blur" }
          ],
        },
        editRules: {
          platform_name: [
            { required: true, message: "请输入平台名称！", trigger: "blur" },
            { min: 2, max: 20, message: "名称长度在2到20个字符", trigger: "blur" }
          ],
        },
        projectList:[],
      }
    },
    async created() {
      await this.getList()
    },
    methods: {
      toAuth(){
        this.getAuthUrl();
        // window.location.href = this.authUrl;
      },
      getAuthList(platformId){
        this.platformListLoading = true
        this.platformId = platformId
        getThirdAuthList({platform_id: platformId, page: 1, limit: 10}).then(response => {
          if(response.status === 20000){
            this.authList = response.data.list
            this.authTotal = response.data.total
          }
          this.platformListLoading = false
          this.authDialogVisible = true
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      operationLogDestroyAll() {
        if(this.multipleSelection.length<=0){
          this.$base.message({ message: '请选择需要删除的选项！' })
          return
        }
        const idArr = this.multipleSelection.map((item, index) => {return item.id})
        this.$base.confirm(
          { content: "确定要删除所选项吗！" },
          () => {
            platformDelete({id:idArr}).then(response => {
              if(response.status === 20000){
                this.$base.message({ message: response.message })
                this.getList()
              }
            })
          }
        )
      },
      eventStartTime(val){
        this.listQuery.created_at = val
        this.handleFilter()
      },
      // 获取表格列表
      async getList() {
        this.listLoading = true
        platformList(this.listQuery).then(response => {
          if(response.status === 20000){
            this.list = response.data.list
            this.total = response.data.total
          }
          this.listLoading = false
        })
      },
      getAuthUrl() {
        getAuthUrl().then(response => {
          if(response.status === 20000){
            this.authUrl = response.data.url
            window.open(this.authUrl, '_blank');
          }
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
          platform_name:"",
          status:null,
          created_at:[],
          updated_at:[]
        }
        this.getList()
      },
      // 监听添加对话框的关闭事件
      addDialogClose() {
        this.$refs.addRef.resetFields()
      },
      authDialogClose() {
        this.platformId = 0
      },
      // 添加按钮
      add() {
        this.$refs.addRef.validate(valid => {
          if (valid) {
            platformAdd(this.addForm).then(response => {
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
        platformStatus({id:info.id,status:info.status}).then(response => {
          if(response.status === 20000){
            this.$base.message({message:response.message})
          }else{
            info.status = info.status?0:1
          }
        })
      },
      // 打开编辑按钮对话框
      edit(id) {
        platformInfo({id:id}).then(response => {
          if(response.status === 20000){
            this.editDialogVisible = true
            this.editForm = response.data
          }
        })
      },
      // 提交编辑数据
      update() {
        this.$refs.editRef.validate(valid => {
          if (valid) {
            platformUpdate(this.editForm).then(response => {
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
        this.$refs.editRef.resetFields()
      },
      // 初始化密码
      platformDelete(id) {
        this.$base.confirm(
          { content: "确定要删除该条数据吗？" },
          () => {
            platformDelete({id:[id]}).then(response => {
              if(response.status === 20000){
                this.$base.message({ message: response.message })
                this.getList()
              }
            })
          }
        )
      },
      // 导出数据
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '品牌','商品名称','图片','规格','条码','链接','价格','备注','创建时间']
          const filterVal = ['id', 'brand_name','platform_name','image_url','platform_type','barcode_url','platform_url','price','remark','created_at']
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
          if (j === 'brand_name') {
            return v[j].name
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
