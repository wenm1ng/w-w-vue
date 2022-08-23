<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="名称"
        style="width: 200px"
        class="filter-item"
        clearable
        @change="queryFilter"
      />

      <s-date-picker
        @changeDateTime="eventStartTime"
        startPlaceholder="开始操作时间"
        endPlaceholder="结束操作时间"
      ></s-date-picker>
      <div>
        <el-button
          v-waves
          icon="el-icon-search"
          class="filter-item"
          type="primary"
          @click="getList()"
        >
          查询
        </el-button>
        <el-button
          v-waves
          class="filter-item"
          type="warning"
          icon="el-icon-edit"
          @click="addDialogVisible = true"
        >
          新增
        </el-button>
      </div>
    </div>
    <el-table
      :data="list"
      v-loading="listLoading"
      border
      fit
      style="width: 100%"
      highlight-current-row
      :default-sort="{ prop: 'id', order: 'ascending' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        label="ID"
        width="100px"
        prop="id"
        sortable
      >
      </el-table-column>
      <el-table-column width="220px" align="center" label="	名称" prop="name">
      </el-table-column>
      <el-table-column
        width="200px"
        align="center"
        label="创建时间"
        prop="created_at"
      >
      </el-table-column>
      <el-table-column
        width="200px"
        align="center"
        label="更新时间"
        prop="updated_at"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="220px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button v-waves type="primary" size="mini" @click="edit(row.id)">
            修改
          </el-button>

          <el-button v-waves size="mini" type="danger" @click="Destroy(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <span class="demonstration"></span>
      <el-pagination
        background
        style="margin: 40px 60px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 添加对话框 -->
    <el-dialog
      title="添加素材标签名称"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
        onsubmit="return false"
      >
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input
            v-model="form.name"
            autocomplete="off"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('form')"
            :before-close="handleClose"
            >立即创建</el-button
          >
          <el-button type="info" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="修改素材标签信息"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editRef"
        label-width="100px"
        class="demo-ruleForm"
        onsubmit="return false"
      >
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input
            v-model="editForm.name"
            autocomplete="off"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-waves @click="editDialogVisible = false"
            >取 消</el-button
          >
          <el-button v-waves type="primary" @click="update()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  viedotitem,
  viedoadd,
  viedoedit,
  viedoemove,
  viedoreupdate,
} from "@/api/admin/viedo";

export default {
  name: "viedotitem",
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      dialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        name: "",
        created_at: [],
        updated_at: [],
      },
      form: {
        name: "",
        admin_id: "",
        created_at: "",
        platform: "",
        campaign_id: null,
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 5 到 30 个字符",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "100px",

      editForm: {
        id: "",
        name: "",
      },
      multipleSelection: [],
    };
  },
  async created() {
    await this.getList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    eventStartTime(val) {
      this.listQuery.created_at = val;
      this.queryFilter();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 获取表格列表
    async getList() {
      this.listLoading = true;
      viedotitem(this.listQuery).then((res) => {
        if (res.status === 20000) {
          this.list = res.data.list;
          this.total = res.data.total;
        }
        this.listLoading = false;
      });
    },
    // 搜索查询
    queryFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    //添加
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          viedoadd(this.form).then((res) => {
            if (res.status === 20000) {
              this.$base.message({ message: res.message });
              this.addDialogVisible = false;
              this.getList();
              this.form = {
                name: "",
              };
            }
          });
        }
      });
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    // 监听添加对话框的关闭事件
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 打开编辑按钮对话框
    edit(id) {
      viedoedit({ id: id }).then((res) => {
        if (res.status === 20000) {
          this.editDialogVisible = true;
          this.editForm = res.data;
        }
      });
    },
    // 提交编辑数据
    update() {
      this.$refs.editRef.validate((valid) => {
        if (valid) {
          viedoreupdate(this.editForm).then((res) => {
            if (res.status === 20000) {
              this.$base.message({ message: res.message });
              this.editDialogVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    // 删除
    Destroy(id) {
      this.$base.confirm({ content: "确定要删除该项吗！" }, () => {
        viedoemove({ id: id }).then((res) => {
          if (res.status === 20000) {
            this.$base.message({ message: res.message });
            this.getList();
          }
        });
      });
    },
    // 监听编辑对话框的关闭事件
    editDialogClose() {
      this.$refs.editRef.resetFields();
    },
    handleSizeChange(pageSize) {
      this.listQuery.limit = pageSize;
      this.list = [];
      this.getList();
    },
    handleCurrentChange(page) {
      this.listQuery.page = page;
      this.list = [];
      this.getList();
    },
  },
};
</script>


<style>
</style>
