<template>
  <div class="app-container">
    <div class="filter-container" style="width: 100%">
      <el-input
        placeholder="请输入任务编号"
        style="width: 200px"
        v-model="input"
        clearable
      >
      </el-input>
      <el-input
        placeholder="请输入名称"
        style="width: 180px"
        v-model="input"
        clearable
      >
      </el-input
      ><el-input
        placeholder="请输入发布人"
        style="width: 180px"
        v-model="input"
        clearable
      >
      </el-input>
      <el-select
        v-model="value"
        clearable
        placeholder="全部"
        style="width: 170px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-select
        v-model="value"
        clearable
        placeholder="全部"
        style="width: 180px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <s-date-picker
        startPlaceholder="开始操作时间"
        endPlaceholder="结束操作时间"
      ></s-date-picker>
      <div>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button
          type="success"
          icon="el-icon-edit"
          @click="dialogFormVisible = true"
          >新增</el-button
        >
        <el-button type="info" icon="el-icon-refresh">重置</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      :header-cell-style="tableHeaderColor"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column
        label="任务编号"
        width="160"
        fixed="left"
        sortable
        prop="data"
      >
      </el-table-column>
      <el-table-column prop="data" label="任务名称" width="180">
      </el-table-column>

      <el-table-column prop="data" label="需求数量" width="120">
      </el-table-column>
      <el-table-column prop="data" label="需求店铺" width="120">
      </el-table-column>
      <el-table-column prop="data" label="发布人" width="100">
      </el-table-column>
      <el-table-column
        prop="data"
        label="任务描述"
        width="250"
        show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column prop="data" label="预计完成时间" width="160">
      </el-table-column>
      <el-table-column prop="data" label="设计师" width="100">
      </el-table-column>
      <el-table-column prop="data" label="任务类型" width="100">
      </el-table-column>
      <el-table-column prop="data" label="当前审批节点" width="120">
      </el-table-column>
      <el-table-column
        prop="bindStatus"
        label="实例状态"
        align="center"
        sortable
        width="120"
      >
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.bindStatus == '1'
                ? ''
                : scope.row.bindStatus == '0'
                ? 'danger'
                : 'success'
            "
            disable-transitions
            >{{
              scope.row.bindStatus == "1"
                ? "已完成"
                : scope.row.bindStatus == "0"
                ? "运行中"
                : "已终止"
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="data" label="创建时间" width="200" sortable>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template>
          <el-button
            type="text"
            size="small"
            style="color: darkorange; font-size: 14px"
            >详情</el-button
          >
          <el-button
            type="text"
            size="small"
            style="color: royalblue; font-size: 14px"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            style="color: peru; font-size: 14px"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <span class="demonstration"></span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="任务管理列表添加"
      :visible.sync="dialogFormVisible"
      style="width: 100%"
    >
      <el-form :model="formlist" :rules="rules">
        <el-form-item
          label="任务名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="formlist.name"
            autocomplete="off"
            placeholder="请输入任务名称"
            style="width: 70%"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="任务类型"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-select
            v-model="formlist.region"
            placeholder="请选择任务类型"
            style="width: 70%"
            clearable
          >
            <el-option label="平面设计" value="shanghai"></el-option>
            <el-option label="买家秀" value="beijing"></el-option>
            <el-option label="店铺日常" value="shang"></el-option>
            <el-option label="视频文案" value="beij"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="任务描述"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            type="textarea"
            style="width: 70%"
            :autosize="{ minRows: 6, maxRows: 12 }"
            placeholder="请输入任务描述"
            v-model="textarea"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="截至时间"
          :label-width="formLabelWidth"
          style="width: 77.2%"
          prop="name"
        >
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" align="center"> - </el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                placeholder="选择时间"
                style="width: 100%"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="参考文件路径"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入(建议文件路径也写在这里)参考文件路径"
            v-model="textarea"
            style="width: 70%"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="上传文件" :label-width="formLabelWidth">
          <el-upload multiple :limit="3" :file-list="fileList">
            <el-button size="small" type="primary" class="el-icon-upload">
              点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" @click="submitForm('formlist')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('formlist')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      textarea: "",
      total: 0,
      value: "",
      currentPage: 4,
      fileList: [{}],
      options: [
        { value: "选项1", label: "黄金糕" },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      tableData: [
        {
          data: "123456789",
          bindStatus: 0,
        },
        {
          data: "123456789",
          bindStatus: 2,
        },
        {
          data: "123456789",
          bindStatus: 2,
        },
        {
          data: "123456789",
          bindStatus: 0,
        },
        {
          data: "123456789",
          bindStatus: 2,
        },
        {
          data: "123456789",
          bindStatus: 1,
        },
        {
          data: "123456789",
          bindStatus: 0,
        },
        {
          data: "123456789",
          bindStatus: 0,
        },
        {
          data: "123456789",
          bindStatus: 1,
        },
        {
          data: "123456789",
          bindStatus: 1,
        },
      ],
      formlist: {
        name: "",
        region: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      dialogFormVisible: false,
      formLabelWidth: "220px",
    };
  },
  created: {},
  methods: {
    tableHeaderColor({ rowIndex }) {
      if (rowIndex === 0) {
        return "background-color: #F0F0F1;color:black;font-size:14px;font-weight: 600;text-align:center";
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleClick(row) {
      // console.log(row);
      this.$router.push("/admin/task/services/detail");
    },
  },
};
</script>

<style>
.el-pagination {
  width: 50%;
  text-align: center;
  padding-top: 50px;
}
</style>