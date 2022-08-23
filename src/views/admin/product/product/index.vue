<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.product_name" placeholder="请输入商品名称" style="width: 200px;" class="filter-item" clearable @change="handleFilter"/>
      <el-select v-model="listQuery.brand_id" placeholder="请选择品牌" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in brandList" :key="index" :label="item.name" :value="item.id" />
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
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addDialogVisible = true">
          新建
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
      <el-table-column width="150px" align="center" label="品牌">
        <template slot-scope="{row}">
          <span>{{ row.product_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="商品名称">
        <template slot-scope="{row}">
          <span>{{ row.product_name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="图片">
        <template slot-scope="{row}">
          <el-popover placement="top-start" title="" trigger="hover">
            <img :src="row.image_url" alt="" style="width: 200px;">
            <img slot="reference" :src="row.image_url" style="width: 100px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="130px" align="center" label="规格">
        <template slot-scope="{row}">
          <span>{{ row.product_type }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="条码">
        <template slot-scope="{row}">
          <el-popover placement="top-start" title="" trigger="hover">
            <img :src="row.barcode_url" alt="" style="width: 200px;">
            <img slot="reference" :src="row.barcode_url" style="width: 100px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="链接">
        <template slot-scope="{row}">
          <el-link type="success" @click="urlDialogVisible = true">{{ row.product_url }}</el-link>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="价格">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="备注">
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
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" size="mini" @click="edit(row.id)">
            修改
          </el-button>
          <el-button v-waves size="mini" type="danger" @click="productDelete(row.id)">
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
        <el-form-item label="品牌" prop="brand">
          <el-select v-model="addForm.brand_id" placeholder="请选择品牌" filterable clearable style="width:100%">
            <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="product_name">
          <el-input placeholder="请输入商品名称" maxlength="20" clearable show-word-limit v-model="addForm.product_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <s-file-image :image_list="imageList" @confirmImsge="confirmAddImageUrl" clearable @deleteImsge="deleteImsgeAdd"></s-file-image>
        </el-form-item>
        <el-form-item label="规格" prop="product_type">
          <el-input placeholder="请输入规格" clearable show-word-limit v-model="addForm.product_type"></el-input>
        </el-form-item>
        <el-form-item label="商品条码">
          <s-file-image :image_list="barcodeList" @confirmImsge="confirmAddBarCodeUrl" clearable @deleteImsge="deleteBarImsgeAdd"></s-file-image>
        </el-form-item>
        <el-form-item label="商品链接" prop="product_url">
          <el-input type="url" placeholder="请输入商品链接" clearable show-word-limit v-model="addForm.product_url"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input type="number" placeholder="请输入商品价格" clearable show-word-limit v-model="addForm.price"
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
        <el-form-item label="品牌" prop="brand">
          <el-select v-model="editForm.brand_id" placeholder="请选择品牌" filterable clearable style="width:100%">
            <el-option v-for="item in [{'id':1,'name':'芝华士'},{'id':2,'name':'杰克丹尼'}]" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="product_name">
          <el-input placeholder="请输入商品名称" maxlength="20" clearable show-word-limit v-model="editForm.product_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <s-file-image :image_list="editForm.image_url ? [{'url':editForm.image_url}] : []" @confirmImsge="confirmEditImageUrl" clearable @deleteImsge="deleteImsgeEdit"></s-file-image>
        </el-form-item>
        <el-form-item label="规格" prop="product_type">
          <el-input placeholder="请输入规格" clearable show-word-limit v-model="editForm.product_type"></el-input>
        </el-form-item>
        <el-form-item label="商品条码">
          <s-file-image :image_list="editForm.image_url ? [{'url':editForm.barcode_url}] : []" @confirmImsge="confirmEditBarCodeUrl" clearable @deleteImsge="deleteBarImsgeEdit"></s-file-image>
        </el-form-item>
        <el-form-item label="商品链接" prop="product_url">
          <el-input type="url" placeholder="请输入商品链接" clearable show-word-limit v-model="editForm.product_url"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input type="number" placeholder="请输入商品价格" clearable show-word-limit v-model="editForm.price"
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

    <!-- 链接弹窗 -->
    <el-dialog title="链接弹窗" :visible.sync="urlDialogVisible" width="80%" @close="editDialogClose">
      <!-- 主体区 -->
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column align="center" label="序号" width="80px">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="品牌">
          <template slot-scope="{row}">
            <span>{{ row.product_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="商品名称">
          <template slot-scope="{row}">
            <span>{{ row.product_name}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="center" label="图片">
          <template slot-scope="{row}">
            <el-popover placement="top-start" title="" trigger="hover">
              <img :src="row.image_url" alt="" style="width: 200px;">
              <img slot="reference" :src="row.image_url" style="width: 100px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="130px" align="center" label="规格">
          <template slot-scope="{row}">
            <span>{{ row.product_type }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="center" label="条码">
          <template slot-scope="{row}">
            <el-popover placement="top-start" title="" trigger="hover">
              <img :src="row.barcode_url" alt="" style="width: 200px;">
              <img slot="reference" :src="row.barcode_url" style="width: 100px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="160px" align="center" label="链接">
          <template slot-scope="{row}">
            <el-link type="success">{{ row.product_url }}</el-link>
          </template>
        </el-table-column>
        <el-table-column width="160px" align="center" label="价格">
          <template slot-scope="{row}">
            <span>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column width="160px" align="center" label="备注">
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
        <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-waves type="primary" size="mini" @click="edit(row.id)">
              编辑
            </el-button>
            <el-button v-waves size="mini" type="danger" @click="productDelete(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {
    productList,
    productStatus,
    productAdd,
    productInfo,
    productUpdate,
    productDelete
  } from '@/api/admin/poroduct'
  import { getGroupList } from '@/api/admin/group'
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
        uploadUrl:process.env.VUE_APP_BASE_API + '/admin/upload/fileImage',
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          brand_id:null,
          product_name:'',
          status:null,
          created_at:[],
          updated_at:[]
        },
        brandList:[{'id':1,'name':'芝华士'},{'id':2,'name':'杰克丹尼'}],
        imageList:[],
        barcodeList:[],
        multipleSelection:[],
        addDialogVisible:false,
        editDialogVisible:false,
        urlDialogVisible:false,
        downloadLoading: false,
        addForm: {
          product_name: "",
          brand_id: "",
          product_type: "",
          product_url: "",
          price: "",
          remark: "",
          image_url:"",
          barcode_url:""
        },
        editForm: {
          id: "",
          product_name: "",
          brand_id: "",
          product_type: "",
          product_url: "",
          price: "",
          remark: "",
          image_url:"",
          barcode_url:""
        },
        addRules: {
          group_id: [
            { required: true, message: "请选择权限组！", trigger: "change" }
          ],
          project_id: [
            { required: true, message: "请选择所属项目！", trigger: "change" }
          ],
          product_name: [
            { required: true, message: "请输入商品名称！", trigger: "blur" },
            { min: 2, max: 20, message: "名称长度在2到20个字符", trigger: "blur" }
          ],
          product_url: [
            { required: true, message: "请输入商品链接！", trigger: "blur" },
            { validator: checkUrl, trigger: "blur" }
          ],
          price: [
            { required: true, message: "请输入商品价格！", trigger: "blur" },
            { validator: checkDecimal, trigger: "blur" }
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
            { required: true, message: "请输入名称！", trigger: "blur" },
            { min: 2, max: 20, message: "名称长度在2到20个字符", trigger: "blur" }
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
      }
    },
    async created() {
      await this.getList()
    },
    methods: {
      // 图片上传回调
      confirmAddImageUrl(res) {
        console.log(res);
        this.addForm.image_url = res[0].url
      },
      confirmAddBarCodeUrl(res) {
        console.log(res);
        this.addForm.barcode_url = res[0].url
      },
      confirmEditImageUrl(res) {
        console.log(res);
        this.editForm.image_url = res[0].url
      },
      confirmEditBarCodeUrl(res) {
        console.log(res);
        this.editForm.barcode_url = res[0].url
      },
      deleteImsgeAdd(){
        this.addForm.image_url = ''
      },
      deleteBarImsgeAdd(){
        this.addForm.barcode_url = ''
      },
      deleteImsgeEdit(res){
        console.log(res)
        console.log(111111111);
        this.editForm.image_url = ''
      },
      deleteBarImsgeEdit(){
        this.editForm.barcode_url = ''
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
        productList(this.listQuery).then(response => {
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
            productAdd(this.addForm).then(response => {
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
        productStatus({id:info.id,status:info.status}).then(response => {
          if(response.status === 20000){
            this.$base.message({message:response.message})
          }else{
            info.status = info.status?0:1
          }
        })
      },
      // 打开编辑按钮对话框
      edit(id) {
        productInfo({id:id}).then(response => {
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
            productUpdate(this.editForm).then(response => {
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
