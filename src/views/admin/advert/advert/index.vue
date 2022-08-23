<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.advertiser_id"
        placeholder="账户ID"
        style="width: 200px"
        class="filter-item"
        clearable
        @change="queryFilter"
      />
      <el-input
        v-model="query.platform"
        placeholder="请选择平台"
        clearable
        style="width: 200px"
        class="filter-item"
        @change="queryFilter"
      >
      </el-input>
      <el-input
        v-model="query.name"
        placeholder="名称"
        clearable
        style="width: 200px"
        class="filter-item"
        @change="queryFilter"
      >
      </el-input>
      <s-date-picker
        @changeDateTime="eventStartTime"
        startPlaceholder="开始操作时间"
        endPlaceholder="结束操作时间"
      ></s-date-picker>
      <div>
        <!-- <el-button
          v-waves
          class="filter-item"
          type="info"
          icon="fa fa-refresh"
          @click="refresh"
        >
          重置
        </el-button> -->
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          @click="addDialogVisible = true"
        >
          新增
        </el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
        >
          导出
        </el-button>
        -->
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="listitem"
      border
      fit
      style="width: 100%"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="账号ID" width="100px" prop="id">
      </el-table-column>
      <el-table-column width="60px" align="center" label="平台" prop="platform">
      </el-table-column>
      <el-table-column width="220px" align="center" label="	名称" prop="name">
      </el-table-column>
      <el-table-column width="300px" align="center" label="	数据" prop="data">
        <el-link @click="getinfo">text </el-link>
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
        width="180px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button v-waves type="primary" size="mini" @click="edit(row)">
            修改
          </el-button>

          <el-button v-waves size="mini" type="danger" @click="Destroy(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="query.page"
      :limit.sync="query.limit"
      @pagination="getList"
    />
    <el-dialog
      title="添加广告投放信息"
      :visible.sync="addDialogVisible"
      width="42%"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="账户ID"
          :label-width="formLabelWidth"
          prop="admin_id"
        >
          <el-input
            v-model="form.admin_id"
            autocomplete="off"
            style="width: 40%"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="平台"
          :label-width="formLabelWidth"
          prop="platform"
        >
          <el-input
            v-model="form.platform"
            autocomplete="off"
            style="width: 40%"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="广告名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            style="width: 40%"
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
      title="修改广告信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账户ID" :label-width="formLabelWidth">
          <el-input
            v-model="editForm.advertiser_id"
            autocomplete="off"
            style="width: 40%"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台" :label-width="formLabelWidth">
          <el-input
            v-model="editForm.platform"
            autocomplete="off"
            style="width: 40%"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告名称" :label-width="formLabelWidth">
          <el-input
            v-model="editForm.name"
            autocomplete="off"
            style="width: 40%"
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
    <el-dialog
      title="数据详情"
      :visible.sync="dialogVisible"
      width="80%"
      @close="dialogClose"
    >
      <el-form label-width="100px">
        <el-form-item label="请求参数">
          <json-editor ref="jsonEditor" v-model="info.create" />
        </el-form-item>
        <el-form-item label="信息">
          <json-editor ref="jsonEditor" v-model="info.tiktok_set" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="addDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑"
      :visible.sync="editDialogVisible"
      width="80%"
      @close="editDialogClose"
    >
      <!-- 主体区 -->
      <el-form
        label-width="100px"
        :model="editForm"
        :rules="addRules"
        ref="editRef"
      >
        <el-form-item label="管理账号ID" prop="admin_id" label-width="120px">
          <el-input
            placeholder="请输入管理账号ID"
            type="number"
            clearable
            v-model="editForm.admin_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告投放名称" prop="name" label-width="120px">
          <el-input
            placeholder="请输入广告投放名称"
            maxlength="20"
            clearable
            v-model="editForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属平台" prop="platform" label-width="120px">
          <el-input
            placeholder="请输入所属平台"
            clearable
            type="number"
            v-model="editForm.platform"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="广告账户ID"
          prop="advertiser_id"
          label-width="120px"
        >
          <el-input
            placeholder="请输入广告账户ID"
            type="number"
            clearable
            v-model="editForm.advertiser_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告组" prop="group_id" label-width="120px">
          <el-input
            placeholder="请输入广告组"
            maxlength="20"
            clearable
            v-model="editForm.group_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告计划" prop="campaign_id" label-width="120px">
          <el-input
            placeholder="请输入广告计划"
            maxlength="50"
            clearable
            v-model="editForm.campaign_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告创意" prop="creative_id" label-width="120px">
          <el-input
            placeholder="请输入广告创意"
            maxlength="50"
            clearable
            v-model="editForm.creative_id"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="editDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="update()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Advertisementitem,
  Advertisement,
  Advertadd,
  Advertremove,
  Advertment,
} from "@/api/admin/advertisement";
import JsonEditor from "@/components/JsonEditor";
export default {
  name: "Advertisementitem",
  components: { JsonEditor },
  data() {
    return {
      listitem: [],
      total: 0,
      listLoading: true,
      dialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      downloadLoading: false,
      dialogTableVisible: false,
      id: "",
      form: {
        name: "",
        admin_id: "",
        created_at: "",
        platform: "",
        campaign_id: null,
      },
      rules: {
        admin_id: [
          { required: true, message: "请输入账户id", trigger: "blur" },
          { min: 1, max: 3, message: "长度在 3个数字 ", trigger: "blur" },
        ],
        platform: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, max: 3, message: "长度在 1 到 3 个字符", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "100px",
      info: {
        create: {},
        tiktok_set: {},
      },
      query: {
        page: 1,
        limit: 10,
        advertiser_id: "",
        name: "",
        platform: "",
      },
      editForm: {
        advertiser_id: "",
        name: "",
        platform: "",
      },
      multipleSelection: [],
    };
  },
  async created() {
    await this.getList(this.query);
  },
  methods: {
    // 监听添加对话框的关闭事件
    addDialogClose() {
      this.addForm = {
        admin_id: null,
        group_id: null,
        campaign_id: null,
        creative_id: null,
        platform: null,
        name: "",
      };

      this.$refs.addRef.resetFields();
    },
    // 添加按钮
    add() {
      this.$refs.addRef.validate((valid) => {
        if (valid) {
          console.log(this.addForm);
          createAd(this.addForm).then((response) => {
            console.log(response);
            if (response.status === 20000) {
              this.$base.message({ message: response.message });
              this.addDialogVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    // 打开编辑按钮对话框
    edit(id) {
      console.log("修改id：" + id);
      adInfo({ id: id }).then((response) => {
        if (response.status === 20000) {
          this.editDialogVisible = true;
          var resData = response.data.list.find((item) => item.id === id);
          this.editForm = resData;
        }
      });
    },
    // 提交编辑数据
    update() {
      this.$refs.editRef.validate((valid) => {
        if (valid) {
          adItemUpdate(this.editForm).then((response) => {
            if (response.status === 20000) {
              this.$base.message({ message: response.message });
              this.editDialogVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    // 监听编辑对话框的关闭事件
    editDialogClose() {
      this.$refs.editRef.resetFields();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    eventStartTime(val) {
      this.query.created_at = val;
      // this.queryFilter();
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
      Advertisementitem().then((res) => {
        if (res.status === 20000) {
          this.listitem = res.data.list;
          this.total = res.data.total;
        }
        this.listLoading = false;
      });
    },
    // 搜索查询
    queryFilter() {
      this.listLoading = true;
      Advertisement(this.query).then((res) => {
        if (res.status === 20000) {
          this.listitem = res.data.list;
          console.log(this.listitem);
          this.total = res.data.total;
          console.log(this.total);
          // this.getList();
        }
        this.listLoading = false;
      });
    },
    //添加
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          Advertadd(this.form).then((res) => {
            if (res.status === 20000) {
              this.$base.message({ message: res.message });
              this.addDialogVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    // 重置
    // refresh() {
    //   this.query = {
    //     page: 1,
    //     limit: 10,
    //     url: null,
    //     method: null,
    //     username: null,
    //     url: null,
    //     created_at: [],
    //   };
    //   this.getList();
    // },
    // 监听添加对话框的关闭事件
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    // 导出数据
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "编号",
          "管理员",
          "操作描述",
          "操作路由",
          "请求方式",
          "IP",
          "操作时间",
        ];
        const filterVal = [
          "id",
          "admin_one",
          "content",
          "url",
          "method",
          "ip",
          "created_at",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.$route.name,
        });
        this.downloadLoading = false;
      });
    },
    // // 状态调整
    // setStatus(info) {
    //   productStatus({id:info.id,status:info.status}).then(response => {
    //     if(response.status === 20000){
    //       this.$base.message({message:response.message})
    //     }else{
    //       info.status = info.status?0:1
    //     }
    //   })
    // },
    // 导出数据
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "编号",
          "管理员",
          "操作描述",
          "操作路由",
          "请求方式",
          "IP",
          "操作时间",
        ];
        const filterVal = [
          "id",
          "admin_one",
          "content",
          "url",
          "method",
          "ip",
          "created_at",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.$route.name,
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "admin_one") {
            return v[j].username;
          } else {
            return v[j];
          }
        })
      );
    },
    // 打开编辑按钮对话框
    edit(data) {
      this.editDialogVisible = true;
      this.editForm = data;
    },
    // 提交编辑数据
    update() {
      this.$refs.editRef.validate((valid) => {
        if (valid) {
          Advertment(this.editForm).then((res) => {
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
        Advertremove({ id: id }).then((res) => {
          console.log("fff", id);
          if (res.status === 20000) {
            this.$base.message({ message: res.message });
            this.getList();
          }
        });
      });
    },
    getinfo(info) {
      this.dialogVisible = true;
      info.create = JSON.parse(info.data.create);
      info.tiktok_set = JSON.parse(info.data.tiktok_set);
    },
    // 监听添加编辑对话框的关闭事件
    dialogClose() {
      this.info = {
        create: "",
        tiktok_set: "",
      };
    },
    // 监听编辑对话框的关闭事件
    editDialogClose() {
      this.$refs.editRef.resetFields();
    },
  },
};
</script>
