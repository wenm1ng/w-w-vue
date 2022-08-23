<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="请输入账号" style="width: 200px;" class="filter-item" clearable @change="handleFilter"/>
      <el-select v-model="listQuery.group_id" placeholder="请选择权限组" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in groupList" :key="index" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.project_id" placeholder="请选择所属项目" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in projectList" :key="index" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.department_id" placeholder="请选择部门" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in departmentList" :key="index" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="请选择状态" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option label="禁用" value="0"></el-option>
        <el-option label="启用" value="1"></el-option>
      </el-select>
      <s-date-picker :date="listQuery.created_at" @changeDateTime="eventStartTime"></s-date-picker>
      <div>
        <el-button v-waves class="filter-item" type="info" icon="fa fa-refresh" @click="refresh">
          重置
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="toAuth">
          授权
        </el-button>
      </div>

    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
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
      <el-table-column width="150px" align="center" label="户名称">
        <template slot-scope="{row}">
          <span>{{ row.account_name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="授权有效期">
        <template slot-scope="{row}">
          <span>{{ row.access_token_time }}</span>
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
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" size="mini" @click="edit(row.id)">
            重新授权
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加对话框 -->
    <el-dialog   title="添加" :visible.sync="addDialogVisible" width="80%" @close="addDialogClose">
      <!-- 主体区 -->
      <el-form label-width="100px" :model="addForm" :rules="addRules" ref="addRef">
        <el-form-item label="权限组" prop="group_id">
          <el-select v-model="addForm.group_id" placeholder="请选择权限组" filterable clearable style="width:100%">
            <el-option v-for="(item,index) in groupList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="addForm.project_id" placeholder="请选择所属项目" filterable clearable style="width:100%">
            <el-option v-for="(item,index) in projectList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入姓名" maxlength="20" clearable show-word-limit v-model="addForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department_id">
          <!--          <el-select v-model="addForm.department_id" placeholder="请选择所属部门" filterable clearable style="width:100%">-->
          <!--            <el-option v-for="(item ,index) in departmentList" :key="index" :label="item.name" :value="item.id"></el-option>-->
          <!--          </el-select>-->
          <div class="container">
            <cy-tree-select v-model="addForm.department_id" :data="departmentList" style="width: 240px;"></cy-tree-select>
          </div>
        </el-form-item>
        <el-form-item label="岗位" prop="post_name">
          <el-input placeholder="请输入岗位" maxlength="20" clearable show-word-limit v-model="addForm.post_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input placeholder="请输入手机号" maxlength="11" clearable show-word-limit v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input placeholder="请输入账号" maxlength="14" clearable show-word-limit v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" maxlength="14" clearable show-word-limit v-model="addForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input type="password" placeholder="请输入确认密码" maxlength="14" clearable show-word-limit v-model="addForm.password_confirmation"
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
        <el-form-item label="权限组" prop="group_id">
          <el-select v-model="editForm.group_id" placeholder="请选择权限组" filterable clearable style="width:100%">
            <el-option v-for="(item ,index) in groupList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="editForm.project_id" placeholder="请选择所属项目" filterable clearable style="width:100%">
            <el-option v-for="(item ,index) in projectList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入姓名" maxlength="20" clearable show-word-limit v-model="editForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department_id">
          <!--          <el-select v-model="editForm.department_id" placeholder="请选择所属部门" filterable clearable style="width:100%">-->
          <!--            <el-option v-for="(item ,index) in departmentList" :key="index" :label="item.name" :value="item.id"></el-option>-->
          <!--          </el-select>-->
          <div class="container">
            <cy-tree-select v-model="editForm.department_id" :data="departmentList" style="width: 240px;"></cy-tree-select>
          </div>
        </el-form-item>
        <el-form-item label="岗位" prop="post_name">
          <el-input placeholder="请输入岗位" maxlength="20" clearable show-word-limit v-model="editForm.post_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input placeholder="请输入手机号" maxlength="11" clearable show-word-limit v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input placeholder="请输入账号" maxlength="14" clearable show-word-limit v-model="editForm.username"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="editDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="update()" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { adminIndex,adminStatus,adminStore,adminEdit,adminUpdate,adminUpdatePwd } from '@/api/admin/admin'
  import { getGroupList,getDepartmentList } from '@/api/admin/group'
  import { getProjectList } from '@/api/admin/project'
  import CyTreeSelect from '@/components/common/selectTree/CyTreeSelect'
  import {getToken, getTokenType} from "@/utils/auth";

  export default {
    name: 'AdminIndex',
    components: {
      "cy-tree-select": CyTreeSelect,
    },
    data() {
      var checkPhone = (rule, value, callback) => {
        // 定义正则表达式
        const regPhone = /^1[3|4|5|6|7|8][0-9]{9}$/;
        if (regPhone.test(value)) {
          return callback();
        }
        callback(new Error("请输入正确的手机号!"));
      };
      var checkUsername = (rule, value, callback) => {
        // 定义正则表达式
        const regUsername = /^[a-zA-Z0-9]{4,14}$/;
        if (regUsername.test(value)) {
          return callback();
        }
        callback(new Error("账号必须4到14位的数字或字母!"));
      };
      var checkPassword = (rule, value, callback) => {
        // 定义正则表达式
        const regPassword = /^[a-zA-Z0-9]{4,14}$/;
        if (regPassword.test(value)) {
          return callback();
        }
        callback(new Error("密码必须4到14位的数字或字母!"));
      };
      var checkPasswordConfirmation = (rule, value, callback) => {
        if (value !== this.addForm.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          return callback();
        }
      };
      return {
        importUrl:process.env.VUE_APP_BASE_API + '/admin/admin/import',
        headerObj: {
          apikey : process.env.VUE_APP_BASE_API_KEY,
          Authorization: getTokenType()+ ' ' + getToken()
        },
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          group_id:null,
          project_id:null,
          username:'',
          status:null,
          created_at:[],
          updated_at:[]
        },
        groupList:[],
        addDialogVisible:false,
        editDialogVisible:false,
        downloadLoading: false,
        importLoading: false,
        addForm: {
          group_id: "",
          project_id:"",
          name: "",
          phone: "",
          username: "",
          password: "",
          password_confirmation: ""
        },
        editForm: {
          id: "",
          group_id: "",
          project_id:"",
          name: "",
          phone: "",
          username: ""
        },
        addRules: {
          group_id: [
            { required: true, message: "请选择权限组！", trigger: "change" }
          ],
          project_id: [
            { required: true, message: "请选择所属项目！", trigger: "change" }
          ],
          name: [
            { required: true, message: "请输入姓名！", trigger: "blur" },
            { min: 2, max: 20, message: "姓名长度在2到20个字符", trigger: "blur" }
          ],
          department_id: [
            { required: true, message: "请选择部门！", trigger: "change" }
          ],
          post_name: [
            { required: true, message: "请输入岗位！", trigger: "blur" }
          ],
          phone: [
            { required: true, message: "请输入手机号！", trigger: "blur" },
            { validator: checkPhone, trigger: "blur" }
          ],
          username: [
            { required: true, message: "请输入账号！", trigger: "blur" },
            { validator: checkUsername, trigger: "blur" }
          ],
          password: [
            { required: true, message: "请输入密码！", trigger: "blur" },
            { validator: checkPassword, trigger: "blur" }
          ],
          password_confirmation: [
            { required: true, message: "请输入确认密码！", trigger: "blur" },
            { validator: checkPasswordConfirmation, trigger: "blur" }
          ]
        },
        editRules: {
          group_id: [
            { required: true, message: "请选择权限组！", trigger: "change" }
          ],
          project_id: [
            { required: true, message: "请选择所属项目！", trigger: "change" }
          ],
          name: [
            { required: true, message: "请输入姓名！", trigger: "blur" },
            { min: 2, max: 20, message: "姓名长度在2到20个字符", trigger: "blur" }
          ],
          department_id: [
            { required: true, message: "请选择部门！", trigger: "change" }
          ],
          post_name: [
            { required: true, message: "请选择岗位！", trigger: "change" }
          ],
          phone: [
            { required: true, message: "请输入手机号！", trigger: "blur" },
            { validator: checkPhone, trigger: "blur" }
          ],
          username: [
            { required: true, message: "请输入账号！", trigger: "blur" },
            { validator: checkUsername, trigger: "blur" }
          ]
        },
        projectList:[],
        groupList:[],
        departmentList:[],
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]

      }
    },
    async created() {
      await this.getList()
      await this.getGroupList()
      await this.getProjectList()
      await this.getDepartmentList()
    },
    methods: {
      //导入成功
      importSuccess(response){
        let data = JSON.parse(response.message);
        this.$base.message({ message: data.message, type: 'success' })
        this.getList();
      },
      //导入失败
      importFail(response){
        let data = JSON.parse(response.message);
        this.$base.message({ message: data.message, type: 'error' })
      },
      eventStartTime(val){
        console.log(val);
        this.listQuery.created_at = val
        this.handleFilter()
      },
      // 获取权限组列表
      async getGroupList(){
        getGroupList().then(response => {
          if(response.status === 20000){
            this.groupList = response.data
          }
        })
      },
      async getDepartmentList(){
        getDepartmentList().then(response => {
          if(response.status === 20000){
            this.departmentList = response.data
          }
        })
      },

      // 获取项目列表
      async getProjectList(){
        getProjectList().then(response => {
          if(response.status === 20000){
            this.projectList = response.data
          }
        })
      },
      // 获取表格列表
      async getList() {
        this.listLoading = true
        adminIndex(this.listQuery).then(response => {
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
          group_id:null,
          project_id:null,
          username:'',
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
      // 添加按钮
      add() {
        this.$refs.addRef.validate(valid => {
          if (valid) {
            adminStore(this.addForm).then(response => {
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
        adminStatus({id:info.id,status:info.status}).then(response => {
          if(response.status === 20000){
            this.$base.message({message:response.message})
          }else{
            info.status = info.status?0:1
          }
        })
      },
      // 打开编辑按钮对话框
      edit(id) {
        adminEdit({id:id}).then(response => {
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
            adminUpdate(this.editForm).then(response => {
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
      adminUpdatePwd(id) {
        this.$base.confirm(
          { content: "确定要初始化该管理员的密码为（123456）吗！" },
          () => {
            adminUpdatePwd({id:id}).then(response => {
              if(response.status === 20000){
                this.$base.message({ message: response.message })
              }
            })
          }
        )
      },
      // 导出数据
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['编号', '权限组','姓名','手机号','账号','创建时间','状态']
          const filterVal = ['id', 'auth_groups','name','phone','username','created_at','status']
          const data = this.formatJson(filterVal)
          console.log(data);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.$route.name
          })
          this.downloadLoading = false
        })
      },
      //导入模板下载
      templateDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['姓名', '手机号','所属部门','岗位','登录账号','权限组']
          const data = [['文帅','18888888888','IT部','PHP开发工程师','test1','测试权限组']]
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '导入模板'
          })
          this.downloadLoading = false
        })
      },
      /**
       * 导入数据
       */
      importData(){

      },
      formatJson(filterVal) {
        return this.list.map(v => filterVal.map(j => {
          if (j === 'auth_groups') {
            return v[j].name
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
