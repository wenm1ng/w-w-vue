<template>
  <div>
      <panel-group :info="info" @handleSetLineChartData="handleSetLineChartData" />
      <div class="chart-container">
        <log-charts></log-charts>
      </div>
<!--      <el-row>-->
<!--        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 24}" style="padding-right:8px;margin-bottom:30px;">-->
<!--          <el-table :data="list" style="width: 100%;padding: 15px;">-->
<!--            <el-table-column label="当前服务器信息" min-width="200" prop="name"></el-table-column>-->
<!--            <el-table-column label="" min-width="200" prop="value"></el-table-column>-->
<!--          </el-table>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <div class="app-container">
      <div class="filter-container">
        <s-date-picker :date="listQuery.created_at" @changeDateTime="eventStartTime"></s-date-picker>
        <div>
          <el-button v-waves class="filter-item" type="info" icon="fa fa-refresh" @click="refresh">
            重置
          </el-button>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            查找
          </el-button>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="账户" name="account">账户</el-tab-pane>
          <el-tab-pane label="计划" name="plan">计划</el-tab-pane>
        </el-tabs>
      </div>
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column align="center" label="序号" width="80px">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" label="账户名">
            <template slot-scope="{row}">
              <span>{{ row.type_name }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" label="报警类型">
            <template slot-scope="{row}">
              <span>{{ row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column width="130px" align="center" label="报警值">
            <template slot-scope="{row}">
              <span>{{ row.values }}</span>
            </template>
          </el-table-column>
          <el-table-column width="160px" align="center" label="报警时间">
            <template slot-scope="{row}">
              <span>{{ row.created_at }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { dashboardIndex,planPushList } from '@/api/admin/auth'
import PanelGroup from './components/PanelGroup'
import LogCharts from './components/LogCharts'
// import {productList} from "@/api/admin/poroduct";
export default {
  name: 'DashboardIndex',
  components: {
    PanelGroup,
    LogCharts
  },
  data() {
    return {
      info: {},
      list:[],
      planList: [],
      accountList: [],
      searchData:{},
      listLoading: true,
      downloadLoading: false,
      dataArr:['计划组', '计划', '创意'],
      // 分页参数
      listQuery: {
        page: 1,
        limit: 10,
        type: 1
      },
      // 总数据条数
      total: 0,
      activeName: 'account'
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    // 获取表格列表
    getList() {
      // dashboardIndex().then(response => {
      //   if(response.status === 20000){
      //       this.info = response.data.info
      //       this.list = response.data.list
      //   }
      // })
      planPushList(this.listQuery).then(response => {
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
    eventStartTime(val){
      this.listQuery.created_at = val
      this.handleFilter()
    },
    // 重置
    refresh(){
      this.listQuery = {
        page: 1,
        limit: 10,
        created_at:[],
        type: this.listQuery.type
      }
      this.getList()
    },
    rowClick(row){
      // console.log(row.id);
      this.$router.push('/admin/dashboard');
    },
    // 获取报警列表
    async getPushList() {
      planPushList(this.searchData).then(response => {
        if(response.status === 20000){
          this.total = response.data.total
          this.list = response.data.list
        }
      })
    },
    handleSetLineChartData(e){
      // console.log(e)
    },
    handleClick(tab, event) {
      // console.log(tab.name);
      if(tab.name === 'account'){
        this.listQuery.type = 1;
      }else{
        this.listQuery.type = 2;
      }
      this.getList()
    }
  }
}
</script>
