<template>
  <div>
    <div class="top-content">
      <el-card class="search-card">
        <div slot="header" class="clearfix">
          <span></span>
        </div>
        <div class="filter-container">
          <div class="filter-container">
            <el-select v-model="listQuery.plat_name" placeholder="请选择平台" clearable style="width: 200px" class="filter-item" @change="handleFilter">
              <el-option v-for="(item,index) in platformList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
            <el-select v-model="listQuery.name" placeholder="请选择账号" clearable style="width: 200px" class="filter-item" @change="handleFilter">
              <el-option v-for="(item,index) in accountList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
            <el-select v-model="listQuery.campaignname" placeholder="请选择计划组" clearable style="width: 200px" class="filter-item" @change="handleFilter">
              <el-option v-for="(item,index) in planGroupsList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
            <el-select v-model="listQuery.plan_name" placeholder="请选择计划名称" clearable style="width: 200px" class="filter-item" @change="handleFilter">
              <el-option v-for="(item,index) in planNameList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
            <s-date-picker :date="listQuery.created_at" @changeDateTime="eventStartTime"></s-date-picker>
              <el-button v-waves class="filter-item" style="margin-left:5px" type="info" icon="fa fa-refresh" @click="refresh">
                重置
              </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <div class="bottom-content">
      <el-card>
        <div class="tabs-css">
          <el-button class="down-btn" v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
            下载报表
          </el-button>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <!-- <el-tab-pane label="账户" name="1"></el-tab-pane>  -->
            <el-tab-pane label="计划" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <el-table
          :data="list"
          v-loading="listLoading"
          style="width: 100%;"
          :default-sort = "{prop: 'id', order: 'ascending'}"
        >
          <el-table-column
            prop="id"
            label="ID"
            align="center"
            sortable
            width="100">
          </el-table-column>
          <el-table-column
            prop="plat_name"
            label="平台"
            align="center"
            sortable
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="账号名称"
            align="center"
            sortable
            width="100">
          </el-table-column>
          <el-table-column
            prop="campaignname"
            label="计划组"
            align="center"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="plan_name"
            label="计划名称"
            align="center"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="collectioncost"
            label="消耗"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return a.collectioncost - b.collectioncost; }"
            width="100">
          </el-table-column>
          <el-table-column
            prop="ecpm"
            label="千万次展现成本"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return a.ecpm - b.ecpm; }"
            width="150">
          </el-table-column>
          <el-table-column
            prop="adctr"
            label="点击率"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="ecpc"
            label="点击单价"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return a.ecpc - b.ecpc; }"
            width="120">
          </el-table-column>
          <el-table-column
            prop="adpv"
            label="展现量"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="click"
            label="点击量"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="returnoninvestment"
            label="投资回报率"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            width="150">
          </el-table-column>
          <el-table-column
            prop="takeordervolume"
            label="拍下订单量"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            width="150">
          </el-table-column>
          <el-table-column
            prop="transactionvolume"
            label="成交订单量"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            width="150">
          </el-table-column>
          <el-table-column
            prop="transactionamount"
            label="成交订单金额"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return a.transactionamount - b.transactionamount; }"
            width="150">
          </el-table-column>
          <el-table-column
            prop="alipaycost"
            label="订单成本"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return a.alipaycost - b.alipaycost; }"
            width="100">
          </el-table-column>
          <el-table-column
            prop="takeorderamount"
            label="拍下订单金额"
            align="center"
            sortable
            :sort-method="(a, b) => { return a.takeorderamount - b.takeorderamount; }"
            :show-overflow-tooltip="true"
            width="150">
          </el-table-column>
          <el-table-column
            prop="pagearrive"
            label="转化数"
            align="center"
            sortable
            :sort-method="(a, b) => { return a.pagearrive - b.pagearrive; }"
            width="100">
          </el-table-column>
          <el-table-column
            prop="convertcost"
            label="转化成本"
            align="center"
            sortable
            :sort-method="(a, b) => { return a.convertcost - b.convertcost; }"
            width="100">
          </el-table-column>
          <el-table-column
            prop="addcartvolume"
            label="添加购物车量"
            align="center"
            sortable
            :sort-method="(a, b) => { return a.addcartvolume - b.addcartvolume; }"
            width="150">
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="创建时间"
            align="center"
            sortable
            :sort-method="(a, b) => { return a.created_at - b.created_at; }"
            width="150">
          </el-table-column>
        </el-table>
      </el-card>

      <el-pagination
        style="margin-top: 20px;"
        background
        @size-change="handle_size_change"
        @current-change="handle_current_change"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { monitorindex, accountSelect, planGroupsSelect, planNameSelect } from '@/api/admin/monitor'

  export default {
    data(){
      return {
        info: {},
        listLoading: true,
        downloadLoading: false,
        dataArr:['计划组', '计划', '创意'],
        // 分页参数
        listQuery: {
          page: 1,
          limit: 10,
          created_at:[],
          updated_at:[],
          plat_name: '',
          campaignname:'',
          name: '',
          plan_name:''
        },
        // 总数据条数
        total: 0,
        // 分页表格数据
        list: [],
        activeName: '2',
        // 平台筛选列表
        platformList: [{
          id: '1',
          name: '天猫'
        }, {
          id: '2',
          name: '京东'
        }, {
          id: '3',
          name: '其他'
        }],
        // 账号筛选列表
        accountList:[],
        // 计划组筛选列表
        planGroupsList:[],
        // 计划名称筛选列表
        planNameList:[],
      }
    },
    async created(){
      await this.getPlanList();
      await this.getAccountList();
      await this.getPlanGroups();
      await this.getPlanName();
    },
    methods:{
      eventStartTime(val){
        this.listQuery.created_at = val
        this.handleFilter()
      },
      // 搜索筛选
      handleFilter(){
        this.listQuery.page = 1;
        this.getPlanList();
      },
      // 重置
      refresh(){
        this.listQuery = {
          page: 1,
          limit: 10,
          created_at:[],
          updated_at:[],
          plat_name: '天猫',
          campaignname:'',
          name: '',
          plan_name:''
        }
        this.getPlanList();
      },
      // 账号下拉框数据
      async getAccountList(){
        accountSelect().then(res=>{
          if(res.status === 20000){
            var result = res.data || [];
            result = result.map((item, index)=>{
              return {
                id: index + 1,
                name: item
              }
            }) 
            this.accountList = result;
          }
        })
      },
      // 计划组下拉框数据
      async getPlanGroups(){
        planGroupsSelect().then(res=>{
          if(res.status === 20000){
            var plan_group = res.data || [];
            plan_group = plan_group.map((item, index)=>{
              return {
                id: index + 1,
                name: item
              }
            }) 
            this.planGroupsList = plan_group;
          }
        })
      },
      // 计划名称下拉框数据
      async getPlanName(){
        planNameSelect().then(res=>{
          if(res.status === 20000){
            var plan_name = res.data || [];
            plan_name = plan_name.map((item, index)=>{
              return {
                id: index + 1,
                name: item
              }
            }) 
            this.planNameList = plan_name;
          }
        })
      },
      // 计划列表 数据
      async getPlanList(){
        this.listLoading = true;
        monitorindex(this.listQuery).then(res=>{
          if(res.status === 20000){
            this.list = res.data.list || [];
            this.total = res.data.total || 0;
          }
          this.listLoading = false;
        })
      },
      // 当前每页多少条选择
      handle_size_change(pageSize) {
        this.listQuery.limit = pageSize
        this.list = []
        this.getPlanList()
      },
      // 当前页码
      handle_current_change(page) {
        this.listQuery.page = page
        this.list = []
        this.getPlanList()
      },
      // 下载报表
      handleDownload(){
        this.downloadLoading = true;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '平台','账号名称','计划组','计划名称','消耗','千万次展现成本','点击率','点击单价','展现量', '点击量', '投资回报率','拍下订单量','成交订单量','成交订单金额','订单成本','拍下订单金额', '转化数', '转化成本', '添加购物车量', '创建时间']
          const filterVal = ['id', 'plat_name','name','campaignname','plan_name','collectioncost','ecpm','adctr','ecpc','adpv','click','returnoninvestment','takeordervolume','transactionvolume','transactionamount','alipaycost','takeorderamount','pagearrive','convertcost','addcartvolume', 'created_at']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.$route.name
          })
          this.downloadLoading = false;
        })
      },
      formatJson(filterVal) {
        return this.list.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      // 点击面板
      handleClick(tab, event) {
        // console.log(tab, event);
        // console.log('当前面板' + tab.name);
      },
    }
  }
</script>


<style lang="scss" scoped>
  .top-content {
    padding: 20px;

    .search-card {
      margin-bottom: 20px;
    }

    .count-detail{
      ul>li {
        float: left;
        width: 348px;
        height: 60px;
        // background-color: yellow;
        margin-bottom: 20px;
        margin-right: 20px;
        list-style: none;
      }

      ul>li> span{
        display: block;
        margin-bottom: 5px;
      }

      span:nth-child(1){
        color:  black;
      }

      span:nth-child(2){
        color: black;
        font-weight: 700;
        font-size: 25px;
      }

      span.special-font{
        color: #385acc;
        font-weight: 700;
        font-size: 25px;
      }

      i.icolor{
        color: gray;
      }
    }
  }

  .bottom-content{
    padding: 20px;
    margin-top: -20px;
    .tabs-css{
      position: relative;
      .down-btn {
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 9999;
      }
    }
  }
</style>

