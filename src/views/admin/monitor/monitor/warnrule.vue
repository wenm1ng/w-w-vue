<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" placeholder="请输入用户" style="width: 200px;" class="filter-item" clearable @change="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="请选择状态" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in statusList" :label="item" :key="index" :value="index"></el-option>
      </el-select>
      <el-select v-model="listQuery.plat_type" placeholder="请选择用户组" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in plat_typeList" :key="index" :label="item" :value="index"></el-option>
      </el-select>
      <s-date-picker :date="listQuery.created_at" @changeDateTime="eventStartTime"></s-date-picker>
      <div>
        <el-button v-waves class="filter-item" type="info" icon="fa fa-refresh" @click="refresh">
          重置
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="addWarnForm()">
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
      <el-table-column width="180px" align="center" label="用户">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="用户组">
        <template slot-scope="{row}">
          <span>{{ row.group_id }}</span>
        </template>
      </el-table-column>
       <el-table-column width="120px" align="left" label="投资回报率(roi)">
        <template slot-scope="{row}">
          <div style=" position:relative;">
            <span style="margin-left: 5px;">{{ row.returnoninvestment }}</span>
              <el-switch
                style="display:inline-block;position:absolute;right:10px;"
                v-model="row.key_sign[0]"
                active-color="#5FB878"
                inactive-color="#d2d2d2"
                :active-value="1"
                :inactive-value="0"
                @change="setStatus(row)"
              ></el-switch>
          </div>
        </template>
      </el-table-column>
       <el-table-column width="120px" align="left" label="消耗">
        <template slot-scope="{row}">
          <div style=" position:relative;">
            <span style="margin-left: 5px;">{{ row.collectioncost }}</span>
              <el-switch
                style="display:inline-block;position:absolute;right:10px;"
                v-model="row.key_sign[1]"
                active-color="#5FB878"
                inactive-color="#d2d2d2"
                :active-value="1"
                :inactive-value="0"
                @change="setStatus(row)"
              ></el-switch>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="left" label="余额提醒">
        <template slot-scope="{row}">
          <div style=" position:relative;">
            <span style="margin-left: 5px;">{{ row.balance }}</span>
              <el-switch
                style="display:inline-block;position:absolute;right:10px;"
                v-model="row.key_sign[2]"
                active-color="#5FB878"
                inactive-color="#d2d2d2"
                :active-value="1"
                :inactive-value="0"
                @change="setStatus(row)"
              ></el-switch>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="left" label="消耗/预算">
        <template slot-scope="{row}">
          <div style=" position:relative;">
            <span style="margin-left: 5px;">{{ row.budget || 0 }}</span>
              <el-switch
                style="display:inline-block;position:absolute;right:10px;"
                v-model="row.key_sign[3]"
                active-color="#5FB878"
                inactive-color="#d2d2d2"
                :active-value="1"
                :inactive-value="0"
                @change="setStatus(row)"
              ></el-switch>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="left" label="计划">
        <template slot-scope="{row}">
          <div style=" position:relative;">
            <span style="margin-left: 5px;">{{ row.plan || 0 }}</span>
              <el-switch
                style="display:inline-block;position:absolute;right:10px;"
                v-model="row.key_sign[4]"
                active-color="#5FB878"
                inactive-color="#d2d2d2"
                :active-value="1"
                :inactive-value="0"
                @change="setStatus(row)"
              ></el-switch>
          </div>
        </template>
      </el-table-column>
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
              active-color="#409eff"
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
          <el-button v-waves type="primary" size="mini" @click="editWarnForm(row.id)">
            编辑
          </el-button>
          <el-button v-waves size="mini" type="success" @click="deleteItem(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加/编辑对话框 -->
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="currentDialogVisible" width="30%" @close="currentDialogClose">
      <!-- 主体区 -->
      <el-form label-width="150px" :model="currentForm" :rules="currentRules" ref="currentRef">
        <el-form-item label="用户名称" prop="name">
          <el-input placeholder="请输入用户" style="width:300px" maxlength="20" clearable show-word-limit v-model.trim="currentForm.name"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户组" prop="group_id">
          <el-input placeholder="请输入用户组" style="width:300px" maxlength="20" clearable show-word-limit v-model.trim="currentForm.group_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="投资回报率(roi)" prop="returnoninvestment">
          <el-select style="margin-right:5px;width:300px" v-model="currentForm.returnoninvestment" clearable placeholder="投资回报率(roi) 1以下提醒">
            <el-option
              v-for="item in returnOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-switch
            class="switch_control"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(1,$event)"
            active-text="是"
            inactive-text="否"
            v-model="currentForm.return_sw">
          </el-switch>
          <span style="margin-left:5px;color:#92959b;">{{ currentForm.return_sw == 1 ? '开启提醒' : '不开启提醒' }}</span>
        </el-form-item>

         <el-form-item label="计划消耗" prop="budget">
          <el-select style="margin-right:5px;width:300px" v-model="currentForm.budget" clearable placeholder="计划消耗跑到预算的2/1提醒">
            <el-option
              v-for="item in costOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-switch
            class="switch_control"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(2,$event)"
            active-text="是"
            inactive-text="否"
            v-model="currentForm.budget_sw">
          </el-switch>
          <span style="margin-left:5px;color:#92959b;">{{ currentForm.budget_sw == 1 ? '开启提醒' : '不开启提醒' }}</span>
        </el-form-item>

        <el-form-item label="账户余额" prop="balance">
          <el-input placeholder="账户余额不足 提醒" style="margin-right:5px;width:300px" v-Int maxlength="20" clearable show-word-limit v-model.number.trim="currentForm.balance"
          ></el-input>
          <el-switch
            class="switch_control"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(3,$event)"
            active-text="是"
            inactive-text="否"
            v-model="currentForm.balance_sw">
          </el-switch>
          <span style="margin-left:5px;color:#92959b;">{{ currentForm.balance_sw == 1 ? '开启提醒' : '不开启提醒' }}</span>
        </el-form-item>

        <el-form-item label="单计划消耗提醒" prop="collectioncost">
          <el-select style="margin-right:5px;width:300px" v-model="currentForm.collectioncost" clearable placeholder="单计划消耗过1千 2千 3千 5千 1万 提醒">
            <el-option
              v-for="item in planCostOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
           <el-switch
            class="switch_control"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(4,$event)"
            active-text="是"
            inactive-text="否"
            v-model="currentForm.collectioncost_sw">
          </el-switch>
          <span style="margin-left:5px;color:#92959b;">{{ currentForm.collectioncost_sw == 1 ? '开启提醒' : '不开启提醒' }}</span>
        </el-form-item>

        <el-form-item label="计划提醒" prop="plan">
         <el-select style="margin-right:5px;width:300px" v-model="currentForm.plan" clearable placeholder="计划被拒审 提醒">
            <el-option
              v-for="item in planWarnOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-switch
            class="switch_control"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(5,$event)"
            active-text="是"
            inactive-text="否"
            v-model="currentForm.plan_sw">
          </el-switch>
          <span style="margin-left:5px;color:#92959b;">{{ currentForm.plan_sw == 1 ? '开启提醒' : '不开启提醒' }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="currentDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="save()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { rulesIndex,rulesStatus,rulesAdd,rulesEdit,rulesUpdate,rulesDelete } from '@/api/admin/warnrule'
// import {del} from "@/api/admin/team";
export default {
  name: 'storeIndex',
  data() {
    return {
      state: null,
      // 尚未添加到列表中的数据条没有id，据此判断 显示加/改
      hasId: '',
      // 弹框显示标题
      dialogTitle: '',
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
      // 提醒开关数组
      key_sign:[],
      // 弹框（添加与编辑）
      currentDialogVisible: false,
      // 导出状态
      downloadLoading: false,
      // 表单数据
      currentForm: {
        name: '',
        group_id:'',
        // 状态
        status: null,
        // 平台
        plat_type: null,
        // 投资回报率
        returnoninvestment:'',
        // 计划消耗
        budget:'',
        // 账户余额
        balance: '',
        // 单计划消耗
        collectioncost: '',
        plan: '',
        // 投资回报率提醒
        return_sw: 0,
        // 计划消耗提醒
        budget_sw: 0,
        // 账户余额不足提醒
        balance_sw: 0,
        // 单计划消耗提醒
        collectioncost_sw: 0,
        // 计划提醒
        plan_sw: 0
      },
      // 表单校验
      currentRules: {
        name: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 2, max: 20, message: "用户名称长度在2到20个字符", trigger: "blur" }
        ],
        group_id: [
          { required: true, message: "请输入用户组", trigger: "blur" },
          { min: 2, max: 20, message: "用户组长度在2到20个字符", trigger: "blur" }
        ],
        returnoninvestment: [{ required: true, message: '请选择投资回报率(roi)', trigger: 'change' }],
        budget: [{ required: true, message: '请选择计划消耗', trigger: 'change' }],
        balance: [
          { required: true, message: "请输入账户余额", trigger: "blur" },
          { min: 2, max: 20, message: "账户余额长度在2到20个字符", trigger: "blur" }
        ],
        collectioncost: [{ required: true, message: '请选择单计划消耗提醒', trigger: 'change' }],
        plan: [{ required: true, message: '请选择计划提醒', trigger: 'change' }]
      },
      addValue:[],
      editValue:[],
      plat_typeList:['未知','天猫','京东'],
      // 投资回报率下拉框
      returnOptions:[{
          value: '10',
          label: '10'
        }, {
          value: '20',
          label: '20'
        }, {
          value: '30',
          label: '30'
        }],
      // 计划消耗下拉框
      costOptions:[{
          value: '11',
          label: '11'
        }, {
          value: '22',
          label: '22'
        }, {
          value: '33',
          label: '33'
        }],
      // 单计划消耗提醒下拉框
      planCostOptions:[{
          value: '1000',
          label: '1000'
        }, {
          value: '1500',
          label: '1500'
        }, {
          value: '2000',
          label: '2000'
        }],
      // 计划提醒下拉框
      planWarnOptions:[{
          value: '13',
          label: '13'
        }, {
          value: '14',
          label: '14'
        }, {
          value: '15',
          label: '15'
        }],
        // 列表状态开关调整-入参
        switchStatus:{
          id: null,
          status: null,
          key_sign:[]
        }
    }
  },
  watch:{
    // 开关值监听
    key_sign(oldVal, newVal){
      console.log(oldVal, newVal);
    }
  },
  async created() {
    await this.getList();
  },
  methods: {
    // 表格顶部时间筛选
    eventStartTime(val){
      this.listQuery.created_at = val
      this.handleFilter()
    },
    // 获取表格列表数据
    async getList() {
      this.listLoading = true
      rulesIndex(this.listQuery).then(response => {
        console.log(response);
        if(response.status === 20000){
          this.list = response.data.list || [];
          this.total = response.data.total || 0;
        }
        this.listLoading = false;
      })
    },
    // 表格列表搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 表格顶部筛选重置
    refresh(){
      this.listQuery = {
        page: 1,
        limit: 10,
        // 用户名
        name:"",
        // 平台
        plat_type:null,
        // 状态
        status:null,
        created_at:[],
        updated_at:[]
      }
      this.getList()
    },
    // 监听添加/编辑对话框的关闭事件
    currentDialogClose() {
      this.currentForm = {
        // 用户名
        name: '',
        // 用户组
        group_id:'',
        // 投资回报率
        returnoninvestment:'',
        // 预算
        budget:'',
        // 账户余额
        balance: '',
        // 消耗
        collectioncost: '',
        // 计划
        plan: '',
        // 投资回报率提醒
        return_sw: 0,
        // 计划消耗提醒
        budget_sw: 0,
        // 账户余额不足提醒
        balance_sw: 0,
        // 单计划消耗提醒
        collectioncost_sw: 0,
        // 计划提醒
        plan_sw: 0
      }
      this.addValue = []
      this.$refs.currentRef.resetFields()
    },
    // 添加/编辑-确定按钮
    save() {
      this.$refs.currentRef.validate(valid => {
        if(valid && this.hasId){  //编辑
        console.log('你当前点的是编辑按钮~');
          // rulesUpdate(this.editForm).then(response => {
          //   if(response.status === 20000){
          //     this.$base.message({ message: response.message })
          //     this.currentDialogVisible = false
          //     this.getList()
          //   }
          // })
        }else if(valid && !this.hasId){ //新增
          console.log('你当前点的是新增按钮~');
          // rulesAdd(this.currentForm).then(response => {
          //   if(response.status === 20000){
          //     this.$base.message({ message: response.message })
          //     this.currentDialogVisible = false
          //     this.getList()
          //   }
          // })
        }
      })
    },
    // 状态调整
    setStatus(info) {
      this.switchStatus.id = info.id;
      this.switchStatus.status = info.status;
      this.switchStatus.key_sign = info.key_sign;
      rulesStatus(this.switchStatus).then(response => {
        if(response.status === 20000){
          this.$base.message({message:response.message})
        }else{
          info.status = info.status ? 0 : 1;
        }
      })
    },
    //删除数据表某行数据
    deleteItem(id){
      this.$base.confirm(
        { content: "确定删除吗！" },
        () => {
          rulesDelete({id:id}).then(response=>{
            console.log(response);
            this.$base.message({ message: response.message })
            this.currentDialogVisible = false
            this.getList()
          })
        }
      )
    },
    // 添加表单-对话框
    addWarnForm(){
      console.log('当前点的添加按钮');
      this.currentDialogVisible = true;
      this.hasId = "";
      this.dialogTitle = '添加';
      // 重置表单数据resetField方法
      this.$nextTick(()=>{
        // 重置表单数据
        this.currentForm = {
          // 用户名
          name: '',
          // 用户组
          group_id:'',
          // 投资回报率
          returnoninvestment:'',
          // 预算
          budget:'',
          // 账户余额
          balance: '',
          // 消耗
          collectioncost: '',
          // 计划
          plan: '',
          // 投资回报率提醒
          return_sw: 0,
          // 计划消耗提醒
          budget_sw: 0,
          // 账户余额不足提醒
          balance_sw: 0,
          // 单计划消耗提醒
          collectioncost_sw: 0,
          // 计划提醒
          plan_sw: 0
        };
        this.$refs.currentForm.resetFields();
      });
    },
    // 编辑表单-对话框
    editWarnForm(id) {
      console.log(id);
      this.hasId = id;
      this.dialogTitle = '编辑';
      this.currentDialogVisible = true;
      rulesEdit({id:id}).then(response => {
        console.log(response);
        if(response.status === 20000){
          // this.editForm = response.data
          // this.editValue = [response.data.province_id,response.data.city_id,response.data.county_id]
          var data = response.data;
          this.currentForm.name = data.name;
          this.currentForm.group_id = data.group_id;
          this.currentForm.returnoninvestment = data.returnoninvestment;
          this.currentForm.plan = data.plan;
          this.currentForm.budget = data.budget;
          this.currentForm.balance = data.name;
          this.currentForm.name = data.name;
        }
      })
    },
    // 导出数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '用户','用户组','投资回报率(roi)','消耗','余额提醒','消耗/预算','计划','状态','创建时间']
        const filterVal = ['id', 'name','group_id','returnoninvestment','collectioncost','balance','budget','plan','status','created_at']
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
        if(j === 'status'){
          return this.statusList[v[j]]
        } else {
          return v[j]
        }
      }))
    },
    // 判断用户点击的开关
    handleStatusChange(type, val){
      console.log(type,val);
      if(type === 1 ){
        console.log('他点的是投资回报率~');
        this.currentForm.return_sw = val;
      }else if(type === 2){
        console.log('他点的是计划消耗~');
        this.currentForm.budget_sw = val;
      }else if(type === 3){
        console.log('他点的是账户余额~');
        this.currentForm.balance_sw = val;
      }else if(type === 4){
        console.log('他点的是单计划消耗~');
        this.currentForm.collectioncost_sw = val;
      }else if(type === 5){
        console.log('他点的是计划提醒~');
        this.currentForm.plan_sw = val;
      }
    }
  }
}
</script>
<style>
.switch_control .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
}
/*打开时文字位置设置*/
.switch_control .el-switch__label--right {
    z-index: 1;
    right: 20px;
}
/*关闭时文字位置设置*/
.switch_control .el-switch__label--left {
    z-index: 1;
    left: 20px;
}
/*显示文字*/
.switch_control .el-switch__label.is-active {
    display: block;
}
/* .switch_control.el-switch .el-switch__core,
.el-switch .el-switch__label {
    width: 50px !important; 
} */
</style>