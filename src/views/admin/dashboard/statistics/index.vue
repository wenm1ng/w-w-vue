<template>
  <div class="app-container">
    <div class="statistics-container">
      <span class="box">团队名称:</span>
      <el-select
        v-model="listQuery.team_name"
        filterable
        placeholder="请选择团队名称"
        clearable
        style="width: 260px"
        @visible-change="visibleChange"
        @change="handleChange"
      >
        <el-option v-for="item in accOunt" :key="item" :value="item">
        </el-option>
      </el-select>
      <span class="box">fail: </span>
      <el-date-picker
        v-model="listQuery.begin_time"
        type="datetime"
        :default-value="defaultTime"
        :showType="showType"
        :value-format="showValueFormat"
        @change="startTime"
        style="width: 200px; position: relative; top: 1px"
        placeholder="Select date"
      >
      </el-date-picker>
      <i> &ensp;-&ensp;</i>
      <el-date-picker
        v-model="listQuery.end_time"
        type="datetime"
        :showType="showType"
        placeholder="Select date"
        :value-format="showValueFormat"
        @change="endTime"
        style="width: 200px; position: relative; top: 1px"
      ></el-date-picker>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left: 20px"
        @click="getList()"
        >搜索</el-button
      >
      <el-button
        v-waves
        class="filter-item"
        type="info"
        icon="el-icon-refresh"
        @click="refresh"
        >重置</el-button
      >
      <span v-show="!Spread" class="Spread-btn" @click="openFilter"
        >展开<i class="el-icon-arrow-down Spread-icon"></i
      ></span>
      <span v-show="Spread" class="close-btn" @click="closeFilter"
        >收起<i class="el-icon-arrow-up close-icon"></i
      ></span>
      <template v-if="Spread">
        <br />
        <span class="box">平台名称:</span>
        <!-- <el-input
          style="width: 260px"
          placeholder="请输入平台名称"
          clearable
          v-model.trim="listQuery.platform_name"
          @change="handleFilter"
        ></el-input> -->
        <el-select
          v-model="listQuery.platform_name"
          filterable
          placeholder="请选择平台名称"
          clearable
          style="width: 260px"
          @change="handleFilter"
        >
          <el-option
            v-for="(item, index) in accountList"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </template>
      <br />
      <el-button
        v-waves
        type="success"
        class="el-icon-download"
        style="margin: 10px"
        @click="handleDownload"
        >导出</el-button
      >
    </div>
    <el-tabs type="border-card" style="width: 100%">
      <el-table
        :data="list"
        border
        style="width: 100%"
        v-loading="listLoading"
        :header-cell-style="tableHeaderColor"
      >
        <el-table-column prop="id" label="ID" width="80" align="center">
        </el-table-column>
        <el-table-column
          prop="advertiser_name"
          label="子账户名字/产品"
          width="300"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="platform_name"
          label="平台名"
          width="160"
          sortable
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="ext2"
          label="团队名"
          width="200"
          sortable
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="real_name"
          label="真实姓名"
          width="156"
          sortable
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="cost"
          label="消耗"
          width="200"
          sortable
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="roi"
          label="ROI"
          width="160"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column
          prop="money"
          label="账户余额"
          width="160"
          sortable
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="更新时间"
          width="220"
          sortable
          align="center"
        >
        </el-table-column>
      </el-table>
    </el-tabs>
    <pagination
      background
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { statisticsList, TeamList } from "@/api/admin/statistics";
export default {
  data() {
    return {
      //时间选择器格式
      showType: "datetimerange",
      showValueFormat: "yyyy-MM-dd",
      //当前时间
      defaultTime: new Date(),
      // 展示/收起
      Spread: false,
      //列表数据
      list: [],
      // 平台筛选列表
      accountList: [
        {
          id: "1",
          name: "智投手",
        },
        {
          id: "2",
          name: "千手",
        },
        {
          id: "3",
          name: "自研",
        },
      ],
      //查询数据
      accOunt: [],
      //分页
      total: 0,
      listLoading: true,
      // 页面详情参数
      listQuery: {
        page: 1,
        limit: 10,
        begin_time: new Date(), //开始时间 or(默认当天时间)
        end_time: "", //结束时
        platform_name: "", //平台名称
        team_name: "", //团队名称
      },
    };
  },
  async created() {
    await this.getList();
    await this.visibleChange();
  },
  methods: {
    //设置表头样式对齐方式
    tableHeaderColor({ rowIndex }) {
      if (rowIndex === 0) {
        return "background-color: White ;color:#1890FF;font-size:15px;font-weight: 600;text-align:center";
      }
    },
    //列表数据请求
    getList() {
      this.listLoading = true;
      statisticsList(this.listQuery).then((res) => {
        if (res.status === 20000) {
          this.list = res.data.list;
          this.total = res.data.total;
        }
        this.listLoading = false;
      });
    },
    //列表搜索
    visibleChange() {
      TeamList().then((res) => {
        if (res.status === 20000) {
          this.accOunt = res.data;
        }
      });
    },
    //团队选择
    handleChange(val) {
      this.listQuery.team_name = val;
      this.getList();
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 开始日期选择
    startTime(val) {
      this.listQuery.begin_time = val;
    },
    //结束日期选择
    endTime(val) {
      this.listQuery.end_time = val;
      // this.getList();
    },
    //重置
    refresh() {
      this.listQuery = {
        page: 1,
        limit: 10,
        begin_time: null, //开始时间
        end_time: null, //结束时间
        platform_name: null, //平台名称
        team_name: null, //团队名称
      };
      this.getList();
    },
    //导出excel表格
    handleDownload() {
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "id",
          "子账户名字",
          "平台名称",
          "团队名称",
          "真实姓名",
          "消耗",
          "ROI",
          "账户名称",
          "更新时间",
        ];
        const filterVal = [
          "id",
          "advertiser_name",
          "platform_name",
          "ext2",
          "real_name",
          "cost",
          "roi",
          "money",
          "created_at",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.$route.name,
        });
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    // 展示
    openFilter() {
      this.Spread = true;
    },
    // 收起
    closeFilter() {
      this.Spread = false;
    },
  },
};
</script>
<style  lang="scss" scoped>
.statistics-container {
  .box {
    color: rgb(114, 112, 112);
    font-size: 14px;
    padding: 0 10px 0 30px;
    font-family: 微软雅黑;
  }
}
.Spread-btn {
  margin-left: 15px;
  color: #1890ff;
  font-size: 14px;
  cursor: pointer;
}
.close-btn {
  display: inline-block;
  margin-left: 15px;
  color: #1890ff;
  font-size: 14px;
  cursor: pointer;
}
</style>