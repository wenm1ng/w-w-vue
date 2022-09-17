<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickName" placeholder="请输入用户昵称" style="width: 200px;" class="filter-item" clearable @change="handleFilter"/>
      <el-select v-model="listQuery.type" placeholder="请选择类型" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="请选择状态" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option label="封禁" value="0"></el-option>
        <el-option label="正常" value="1"></el-option>
      </el-select>
<!--      <s-date-picker :date="listQuery.create_at" @changeDateTime="eventStartTime"></s-date-picker>-->
      <el-form-item label="日期">
        <s-date-picker
          style="position:relative;top:4px;width:300px;"
          :showType="showType"
          :showValueFormat="showValueFormat"
          @changeDateTime="chooseDate"
          startPlaceholder="开始操作时间"
          endPlaceholder="结束操作时间"
        ></s-date-picker>
      </el-form-item>
      <div>
        <el-button v-waves class="filter-item" type="info" icon="fa fa-refresh" @click="refresh">
          重置
        </el-button>
        <el-button v-waves class="filter-item" type="danger" :disabled="multipleSelection.length===0" icon="el-icon-delete" @click="operationLogDestroyAll">
          删除
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出
        </el-button>
        <!--        <upload-file :url="{uploadUrl}"/>-->
      </div>

    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column align="center" label="序号" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="600px" align="center" label="评论内容">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="用户昵称">
        <template slot-scope="{row}">
          <span>{{ row.user_info.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="用户头像">
        <template slot-scope="{row}">
          <el-popover placement="top-start" title="" trigger="hover">
            <img :src="row.user_info.avatarUrl" alt="" style="width: 200px;">
            <img slot="reference" :src="row.user_info.avatarUrl" style="width: 30px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="150px"  align="center" label="描述">
        <template slot-scope="{row}">
          <span style="white-space:nowrap;
text-overflow:ellipsis;
overflow:hidden;">{{ row.type === 1 ? 'wa评论' : '帮助评论'}}</span>
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
          <el-button v-waves size="mini" type="danger" @click="commentDel(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
  import { getCommentList,getWaInfo,getVersionList,getOcList,getTabList,addWa,updateWa,waStatus,commentStatus,commentDel} from '@/api/admin/wa'
  import { getProjectList } from '@/api/admin/project'
  import sFileImage from '@/components/common/sFileImage/sFileImage'
  import Tinymce from '@/components/common/Tinymce/index'
  import UploadFile from '@/components/Upload/uploadFile'
  export default {
    name: 'ProductIndex',
    components: {
      "s-file-image": sFileImage,
      Tinymce,
      "upload-file": UploadFile
    },
    data() {
      var checkUrl = (rule, value, callback) => {
        // 验证URL
        const regPhone = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
        if (regPhone.test(value)) {
          return callback();
        }
        callback(new Error("请输入正确的url!"));
      };
      var checkDecimal = (rule, value, callback) => {
        // 验证小数
        const regPhone = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
        if (regPhone.test(value)) {
          return callback();
        }
        callback(new Error("请输入正确的价格!"));
      };
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
        // 日期选择器显示类型及格式
        showType:'daterange',
        showValueFormat:'yyyy-MM-dd',
        uploadUrl:process.env.VUE_APP_BASE_API + '/admin/upload/fileImage',
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          nickName: '',
          status: '',
          type:'',
          create_at:[],
        },
        typeList:[{"name":"wa","id":1},{"name":"帮助回答","id":2}],
        statusList:[{"name":"正常","id":1},{"name":"封禁","id":0}],
        ocList:[],
        tabList:[],
        imageList:[],
        barcodeList:[],
        multipleSelection:[],
        addDialogVisible:false,
        editDialogVisible:false,
        urlDialogVisible:false,
        downloadLoading: false,
        addForm: {
          version: 1,
          title: "",
          occupation: "",
          tips: "",
          tt_id: 0,
          images:[],
          description:"",
          wa_content:"",
          status:0
        },
        editForm: {
          id: "",
          version: "",
          title: "",
          occupation: "",
          tips: "",
          tt_id: 0,
          images:[],
          description:"",
          wa_content:""
        },
        addRules: {
          version: [
            { required: true, message: "请选择版本", trigger: "change" }
          ],
          images: [
            { required: true, message: "请上传图片！", trigger: "change" }
          ],
          tips: [
            { required: true, message: "请输入标签！", trigger: "change" }
          ],
          title: [
            { required: true, message: "请输入标题！", trigger: "change" }
          ],
          description: [
            { required: true, message: "请输入描述！", trigger: "change" }
          ],
          wa_content: [
            { required: true, message: "请输入字符串！", trigger: "change" }
          ],
        },
        editRules: {
          version: [
            { required: true, message: "请选择版本", trigger: "change" }
          ],
          images: [
            { required: true, message: "请上传图片！", trigger: "change" }
          ],
          title: [
            { required: true, message: "请输入标题！", trigger: "change" }
          ],
          tips: [
            { required: true, message: "请输入标签！", trigger: "change" }
          ],
          description: [
            { required: true, message: "请输入描述！", trigger: "change" }
          ],
          wa_content: [
            { required: true, message: "请输入字符串！", trigger: "change" }
          ],
        },
        projectList:[],
      }
    },
    async created() {
      await this.getList()
      // await this.getVersionList()
      // await this.getOcList();
      // await this.getTabList();
    },
    methods: {
      // 日期选择
      chooseDate(val){
        console.log('日期选择');
        console.log(val);
        this.listQuery.create_at = val;
        this.onLoadData();
      },
      //选中版本
      selectVersion(val){
        console.log(val);
      },
      // 图片上传回调
      confirmAddImageUrl(res) {
        console.log(res)
        this.addForm.images = res
      },
      confirmEditImageUrl(res) {
        this.editForm.images = res
      },
      deleteImsgeAdd(){
        this.addForm.image_url = ''
      },
      deleteImsgeEdit(){
        this.editForm.image_url = ''
      },
      // deleteImsge(){
      //   this.editForm.barcode_url = ''
      // },
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
            productDelete({id:idArr}).then(response => {
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
        getCommentList(this.listQuery).then(response => {
          if(response.status === 20000){
            this.list = response.data.list
            this.total = response.data.total
          }
          this.listLoading = false
        })
      },
      async commentDel(id) {
        commentDel({id:[id]}).then(response => {
          if(response.status === 20000){
            this.$base.message({message:response.message})
            this.getList();
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
          product_name:"",
          brand_id:null,
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
            addWa(this.addForm).then(response => {
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
        commentStatus({id:info.id,status:info.status}).then(response => {
          if(response.status === 20000){
            this.$base.message({message:response.message})
          }else{
            info.status = info.status?0:1
          }
        })
      },
      // 打开编辑按钮对话框
      edit(id) {
        getWaInfo({id:id}).then(response => {
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
            updateWa(this.editForm).then(response => {
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
      productDelete(id) {
        this.$base.confirm(
          { content: "确定要删除该条数据吗？" },
          () => {
            productDelete({id:[id]}).then(response => {
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
          const filterVal = ['id', 'brand_name','product_name','image_url','product_type','barcode_url','product_url','price','remark','created_at']
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
