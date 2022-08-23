<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="团队名称" style="width: 200px;" class="filter-item" clearable @change="handleFilter"/>
      <div>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="add()">
          添加
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" row-key="name">
      <el-table-column width="250px" label="团队名称">
        <template slot-scope="{row}">
          <span>
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="150px" label="团队编号">
        <template slot-scope="{row}">
          <span>{{ row.team_number }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" label="平台  ">
        <template slot-scope="{row}">
          <span>{{ platformList[row.platform_id - 1] }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" label="创建时间">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" size="mini" @click="edit(row.id)">
            编辑
          </el-button>
          <el-button v-waves size="mini" type="danger" @click="del(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加编辑对话框 -->
    <el-dialog   :title="title" :visible.sync="dialogVisible" width="80%" @close="dialogClose">
      <el-form label-width="100px" :model="form" :rules="rules" ref="ref">
        <el-form-item label="团队名称" prop="name">
          <el-input placeholder="团队名称" maxlength="100" clearable show-word-limit v-model="form.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="团队编号" prop="team_number">
          <el-input placeholder="团队编号" maxlength="20" clearable show-word-limit v-model="form.team_number"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台">
          <el-radio-group v-model="form.platform_id" size="medium">
            <el-radio border :label="1">天猫</el-radio>
            <el-radio border :label="2">京东</el-radio>
            <el-radio border :label="3">拼多多</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input placeholder="备注" type="textarea" maxlength="200" clearable show-word-limit v-model="form.remark"
          ></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="primary()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { teamIndex,ruleStatus,ruleOpen,ruleAffix,ruleUpdate,ruleStore,ruleEdit,ruleDestroy,ruleSorts,rulePidArr } from '@/api/admin/team.js'
import { teamIndex, teamAdd, teamEdit, teamUpdate, del} from '@/api/admin/team.js'
import "e-icon-picker/lib/symbol.js"; //基本彩色图标库
import 'e-icon-picker/lib/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css'; //font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库
export default {
  name: 'TeamIndex',
  data() {
    var checkSort = (rule, value, callback) => {
      // 定义正则表达式
      const regSort = /^[1-9]{1}[0-9]{0,10}$/;
      if (regSort.test(value)) {
        return callback();
      }
      callback(new Error("请输入排序（大于0的数字）!"));
    };
    return {
      icon: '',
      list: [],
      total:0,
      title:'',
      listQuery: {
        page: 1,
        limit: 10,
        name:""
      },
      listLoading: true,
      dialogVisible:false,
      platformList:[
        '天猫',
        '京东',
        '拼多多'
      ],
      value: [],
      form: {
        id: "",
        name: '',
        platform_id: 1,
        team_number: '',
        remark: '',
      },
      rules: {
        name: [
          { required: true, message: "请输入团队名称！", trigger: "blur" }
        ],
        team_number: [
          { required: true, message: "请输入团队编号！", trigger: "blur" }
        ]
      }
    }
  },
  async created() {
    await this.getList(this.listQuery)
  },
  methods: {
    // 获取表格列表
    async getList() {
      this.listLoading = true
      teamIndex(this.listQuery).then(response => {
        if(response.status === 20000){
          this.list = response.data.list
          this.total = response.data.total
        }
        this.listLoading = false
      })
    },
    // 监听添加编辑对话框的关闭事件
    dialogClose() {
      this.value = []
      this.form = {
        id: "",
        name: '',
        platform_id: 1,
        team_number: '',
        remark: '',
      }
    },
    // 添加编辑获取选择器值
    handleChange() {
      if (this.value.length > 0) {
        this.form.pid = this.value[this.value.length - 1];
        this.form.level = this.value.length + 1;
      } else {
        this.form.pid = 0;
        this.form.level = 1;
      }
    },
    add(){
      this.dialogVisible = true
      this.title = '添加'
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 添加编辑按钮
    primary() {
      this.$refs.ref.validate(valid => {
        if (valid) {
          if(this.form.id){
            teamUpdate(this.form).then(response => {
              if(response.status === 20000){
                this.$base.message({ message: response.message })
                this.dialogVisible = false
                this.getList()
              }
            })
          }else{
            teamAdd(this.form).then(response => {
              if(response.status === 20000){
                this.$base.message({ message: response.message })
                this.dialogVisible = false
                this.getList()
              }
            })
          }
        }
      })
    },
    // 打开编辑按钮对话框
    edit(id) {
      teamEdit({id:id}).then(response => {
        if(response.status === 20000){
          this.title = '编辑'
          this.dialogVisible = true
          this.form = response.data
          this.value = response.data.value
        }
      })
    },
    // 删除
    del(id) {
      this.$base.confirm(
        { content: "确定删除吗！" },
        () => {
          del({id:id}).then(response => {
            if(response.status === 20000){
              this.$base.message({ message: response.message })
              this.getList()
            }
          })
        }
      )
    },
  }
}
</script>
