<template>
  <div>
    <div class="top-content">
      <el-card class="search-card">
        <div slot="header" class="clearfix">
          <span>账户名称：用户汇总报表</span>
        </div>
        <div>

   <el-select
    v-model="listQuery.media_id"
     placeholder="请选择平台"
      clearable style="width:30%"
       class="filter-item"
        ref="newText"
        @change="dropDownBox">
              <el-option v-for="(item,index) in platformList"
               :key="index"
                :label="item.name"
                :value="item.id" />
            </el-select>

          <el-select
            v-model="valuesList"
            multiple
            filterable
            remote
            clearable
            style="width:70%"
            reserve-keyword
            @change="selectAll"
            @clear="clearAll"
            placeholder="请输入账号名称查询">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>数据汇总</span>
        </div>
        <div class="count-detail">
          <ul>
            <li>
              <span>消耗（元）<i class="el-icon-question icolor"></i></span>
              <span class="special-font">{{info.cost}}</span>
            </li>
            <li>
              <span>投资回报率<i class="el-icon-question icolor"></i></span>
              <span>{{info.returnoninvestment}}</span>
            </li>
            <li>
              <span>拍下订单量<i class="el-icon-question icolor"></i></span>
              <span>{{info.takeordervolume}}</span>
            </li>
            <li>
              <span>成交订单量<i class="el-icon-question icolor"></i></span>
              <span>{{info.transactionvolume}}</span>
            </li>
            <li>
              <span>成交订单金额（元）<i class="el-icon-question icolor"></i></span>
              <span>{{info.transactionamount}}</span>
            </li>
            <li>
              <span>订单成本（元）<i class="el-icon-question icolor"></i></span>
              <span>{{info.alipaycost}}</span>
            </li>
            <li>
              <span>拍下订单金额（元）<i class="el-icon-question icolor"></i></span>
              <span>{{info.takeorderamount}}</span>
            </li>
            <li>
              <span>千次展现成本（元）<i class="el-icon-question icolor"></i></span>
              <span>{{info.ecpm}}</span>
            </li>
            <li>
              <span>点击率<i class="el-icon-question icolor"></i></span>
              <span>{{info.adctr}}</span>
            </li>
            <li>
              <span>点击单价（元）<i class="el-icon-question icolor"></i></span>
              <span>{{info.ecpc}}</span>
            </li>
            <li>
              <span>展现量<i class="el-icon-question icolor"></i></span>
              <span>{{info.adpv}}</span>
            </li>
            <li>
              <span>点击量<i class="el-icon-question icolor"></i></span>
              <span>{{info.click}}</span>
            </li>
            <li>
              <span>转化数<i class="el-icon-question icolor"></i></span>
              <span>{{info.pagearrive}}</span>
            </li>
            <li>
              <span>转化成本（元）<i class="el-icon-question icolor"></i></span>
              <span>{{info.convertcost}}</span>
            </li>
            <li>
              <span>添加购物车量<i class="el-icon-question icolor"></i></span>
              <span>{{info.addcartvolume}}</span>
            </li>
          </ul>
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
              <el-tab-pane label="账户" name="1"></el-tab-pane>
              <!-- <el-tab-pane label="计划" name="2"></el-tab-pane> -->
            </el-tabs>
          </div>
         <el-table
          :data="list"
          v-loading="listLoading"
          style="width: 100%;"
          :row-class-name="tableRowClassName"
          @row-click="rowClick"
          :highlight-current-row="true"
          :default-sort = "{prop: 'id', order: 'ascending'}"
          >
          <el-table-column
            prop="id"
            label="ID"
            align="center"
            sortable
            width="100">
            <el-table-column align="center" label="" prop="id" width="100" :show-overflow-tooltip="true">
              <template slot="header" />
            </el-table-column>
          </el-table-column>


          <el-table-column
            prop="media_name"
            label="数据来源"
            align="center"
            sortable
            width="200">
             <el-table-column align="center" label="" prop="media_name" width="100" :show-overflow-tooltip="true">
              <template slot="header" />
            </el-table-column>
          </el-table-column>


          <el-table-column
            prop="name"
            label="账号名称"
            align="center"
            sortable
            width="200">
             <el-table-column align="center" label="" prop="name" width="250" :show-overflow-tooltip="true">
              <template slot="header" />
            </el-table-column>
          </el-table-column>

            <el-table-column
            prop="created_at"
            label="抓取时间"
            align="center"
            sortable
            width="200">
             <el-table-column align="center" label="" prop="created_at" width="160" :show-overflow-tooltip="true">
              <template slot="header" />
            </el-table-column>
          </el-table-column>

          <el-table-column
            prop="collectioncost"
            label="消耗"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return specialNum(a.collectioncost) - specialNum(b.collectioncost); }"
            width="150">
            <el-table-column align="center" label="消耗" width="150" prop="collectioncost" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model.number.trim="query.collectioncost" size="mini" placeholder="请输入" @change="inputChange" @blur="searchReport(1)" @keyup.enter.native="searchReport(1)"/>
              </template>
            </el-table-column>
          </el-table-column>

           <el-table-column
            prop="ecpm"
            label="千万次展现成本"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return specialNum(a.ecpm) - specialNum(b.ecpm); }"
            width="150">
            <el-table-column align="center" label="千万次展现成本" width="150" prop="ecpm" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.ecpm" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
           <el-table-column
            prop="adctr"
            label="点击率"
            align="center"
            sortable
            :sort-method="(a, b) => { return specialNum(a.adctr) - specialNum(b.adctr); }"
            :show-overflow-tooltip="true"
            width="100">
            <el-table-column align="center" label="点击率" width="100" prop="adctr" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.adctr" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="ecpc"
            label="点击单价"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return specialNum(a.ecpc) - specialNum(b.ecpc); }"
            width="120">
            <el-table-column align="center" label="点击单价" width="120" prop="ecpc" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.ecpc" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
           <el-table-column
            prop="adpv"
            label="展现量"
            align="center"
            sortable
            :sort-method="(a, b) => { return specialNum(a.adpv) - specialNum(b.adpv); }"
            :show-overflow-tooltip="true"
            width="100">
            <el-table-column align="center" label="展现量" width="100" prop="adpv" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.adpv" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
           <el-table-column
            prop="click"
            label="点击量"
            align="center"
            sortable
            :sort-method="(a, b) => { return specialNum(a.click) - specialNum(b.click); }"
            :show-overflow-tooltip="true"
            width="100">
            <el-table-column align="center" label="点击量" width="100" prop="click" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.click" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="returnoninvestment"
            label="投资回报率"
            align="center"
            sortable
            :sort-method="(a, b) => { return specialNum(a.returnoninvestment) - specialNum(b.returnoninvestment); }"
            :show-overflow-tooltip="true"
            width="150">
            <el-table-column align="center" label="投资回报率" width="150" prop="returnoninvestment" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.returnoninvestment" size="mini" placeholder="请输入" @change="inputChange" @blur="searchReport(2)" @keyup.enter.native="searchReport(2)"/>
              </template>
            </el-table-column>
          </el-table-column>
           <el-table-column
            prop="takeordervolume"
            label="拍下订单量"
            align="center"
            sortable
            :sort-method="(a, b) => { return specialNum(a.takeordervolume) - specialNum(b.takeordervolume); }"
            :show-overflow-tooltip="true"
            width="150">
            <el-table-column align="center" label="拍下订单量" width="150" prop="takeordervolume" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.takeordervolume" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
           <el-table-column
            prop="transactionvolume"
            label="成交订单量"
            align="center"
            sortable
            :sort-method="(a, b) => { return specialNum(a.transactionvolume) - specialNum(b.transactionvolume); }"
            :show-overflow-tooltip="true"
            width="150">
            <el-table-column align="center" label="成交订单量" width="150" prop="transactionvolume" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.transactionvolume" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="transactionamount"
            label="成交订单金额"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return specialNum(a.transactionamount) - specialNum(b.transactionamount); }"
            width="150">
            <el-table-column align="center" label="成交订单金额" width="150" prop="transactionamount" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.transactionamount" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="alipaycost"
            label="订单成本"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return specialNum(a.alipaycost) - specialNum(b.alipaycost); }"
            width="100">
            <el-table-column align="center" label="订单成本" width="150" prop="alipaycost" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.alipaycost" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
           <el-table-column
            prop="takeorderamount"
            label="拍下订单金额"
            align="center"
            sortable
            :show-overflow-tooltip="true"
            :sort-method="(a, b) => { return specialNum(a.takeorderamount) - specialNum(b.takeorderamount); }"
            width="150">
            <el-table-column align="center" label="拍下订单金额" width="150" prop="takeorderamount" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.takeorderamount" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="pagearrive"
            label="转化数"
            align="center"
            sortable
            :sort-method="(a, b) => { return specialNum(a.pagearrive) - specialNum(b.pagearrive); }"
            width="100">
            <el-table-column align="center" label="转化数" width="150" prop="pagearrive" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.pagearrive" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="convertcost"
            label="转化成本"
            align="center"
            sortable
            :sort-method="(a, b) => { return specialNum(a.convertcost) - specialNum(b.convertcost); }"
            width="100">
            <el-table-column align="center" label="转化成本" width="150" prop="convertcost" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.convertcost" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="addcartvolume"
            label="添加购物车量"
            align="center"
            sortable
            :sort-method="(a, b) => { return specialNum(a.addcartvolume) - specialNum(b.addcartvolume); }"
            width="150">
            <el-table-column align="center" label="添加购物车量" width="150" prop="addcartvolume" :show-overflow-tooltip="true">
              <template #header>
                <el-input v-Int v-model="query.addcartvolume" size="mini" placeholder="请输入" disabled @change="inputChange"/>
              </template>
            </el-table-column>
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

      <!-- 告警音 -->
      <audio ref="audioTip" style="display:none;">
        <source :src="audio.src">
      </audio>

      <el-button style="display: none;" plain @click="open">偏移的消息</el-button>
    </div>
  </div>
</template>

<script>
import { searchInput, accountList, reportList, warningList, setWarningVal } from '@/api/bigdata/accountlist'

export default {
  data(){
    return {
      media_id:103,
      info: {},
      listLoading: true,
      downloadLoading: false,
      dataArr:['计划组', '计划', '创意'],
      // 分页参数
      listQuery: {
        page: 1,
        limit: 10,
        str: '',
        media_id:103,
      },
      // 总数据条数
      total: 0,
      // 分页表格数据
      list: [],
      activeName: '1',
      // 搜索框键入数组
      valuesList: [],
      // 服务端返回搜索数据
      options: [],
      optionsCopy: [],
      // 底部分页表头筛选栏
        // 平台筛选列表
        platformList: [{
          id: 103,
          name: '头条'
        }, {
          id: 104,
          name: '广点通'
        }, {
          id: 105,
          name: '快手'
        }],
      query: {
        // 消耗
        collectioncost: '',
        // 千万次展现成本
        ecpm: '',
        // 点击率
        adctr: '',
        // 点击单价
        ecpc: '',
        // 展现量
        adpv: '',
        // 点击量
        click: '',
        // 投资回报率
        returnoninvestment: '',
        // 拍下订单量
        takeordervolume: '',
        // 成交订单量
        transactionvolume: '',
        // 成交订单金额
        transactionamount:'',
        // 订单成本
        alipaycost:'',
        // 拍下订单金额
        takeorderamount:'',
        // 转化数
        pagearrive:'',
        // 转化成本
        convertcost:'',
        // 添加购物车量
        addcartvolume:''
      },
      // 预警参数
      warningQuery:{
        name: '',
        field_name: '',
        values: ''
      },
      // 输入框输入后过滤的数组
      filterInputArr:[],
      // 预警提示弹窗文字信息
      warningInfo: '',
      // 页面4分钟请求一次接口-清除定时器setInterVal
      timer: null,
      // input框输入0.5s后触发-清除定时器
      timmer: null,
      // 预警提示音
      audio:{    //消息通知
        src:require("@/assets/audio/why.mp3"),
      },
      // 默认输入框设置的值
      defaultInputArr:[],
    }
  },
  async created(){
    await this.getReportList();
    await this.getAccountList();
    await this.searchList();
    await this.setDeaultInputVal();
  //  await this.dropDownBox();
  },
  mounted(){
    // 四分钟请求一次接口
    this.timer = setInterval(() => {
      this.searchList();
      this.getReportList();
      this.getAccountList();
    },240000);
  },
  beforeDestroy(){
    this.$once('hook:beforeDestroy',()=>{
      clearInterval(this.timer)
    })
  },
  methods:{
    // 打开偏移预警提示信息
    open() {
      this.$notify({
        title: '预警提示',
        message: this.warningInfo,
        offset: 100
      });
    },

    //下拉框触发
    dropDownBox(){
      if(this.listQuery.media_id){
      this.getReportList();
      this.getAccountList();
      this.searchList();
      this.setDeaultInputVal();
      }
      
    },
    // 关闭音乐
    closeMusic(){
      this.$refs.audioTip.pause();
      this.$refs.audioTip.load();
    },
    // 设置默认input框值
    setDeaultInputVal(){
      setWarningVal().then((res)=>{
        this.defaultInputArr = res.data;
        this.defaultInputArr.forEach((item)=>{
          if(item.fie_name === 'collectioncost'){
            this.query.collectioncost = item.values;
          }else if(item.fie_name === 'returnoninvestment'){
            this.query.returnoninvestment = item.values;
          }
        })
        this.inputChange();
      })
    },
    //播放提示音
    playAudio(){
      this.$refs.audioTip.play();
    },
    rowClick(row){
      // console.log(row.id);
      this.$router.push('/report/index');
    },
    // 表格列筛选排序时去掉千分符/去掉%号
    specialNum(val){
      if(val.includes('%')){
        let dealVal = this.toPoint(val);
        return dealVal;
      }else{
        let dealVal = this.moneyDelete(val);
        return dealVal;
      }
    },
    // 去掉表格中百分号数值
    toPoint(percent){
        var str=percent.replace("%","");
        str= str/100;
      return str;
    },
    // 去掉添加的千分符
    moneyDelete(num){
      if(num&&num!=undefined&&num!=null){
        let _num = num;
        _num = _num.toString();
        _num = _num.replace(/,/gi,'');
        return _num;
      }else{
        return num;
      }
    },
    async searchList(){
       searchInput({media_id:this.listQuery.media_id}).then(res=>{
        this.options = res.data.map((item, index) => {
          return {
            id: index + 1,
            value: item
          }
        });
      })
    },
    async getReportList(){
      this.listLoading = true;
      reportList(this.listQuery).then(res=>{
        // console.log(res);
        if(res.status === 20000){
          this.list = res.data.list || [];
          this.total = res.data.total || 0;
        }
        this.listLoading = false;
      })
    },
    async getAccountList(){
      accountList({media_id:this.listQuery.media_id}).then(res=>{
        if(res.status === 20000){
          // console.log(res);
          this.info = res.data.info;
        }
      })
    },
    // 当前每页多少条选择
    handle_size_change(pageSize) {
      this.listQuery.limit = pageSize
      this.list = []
      this.getReportList()
      this.setDeaultInputVal();
    },
    // 当前页码
    handle_current_change(page) {
      this.listQuery.page = page
      this.list = []
      this.getReportList()
      this.setDeaultInputVal();
    },
    // 下载报表
    handleDownload(){
      this.downloadLoading = true;
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID','数据来源','账号名称','消耗','千万次展现成本','点击率','点击单价','展现量', '点击量', '投资回报率','拍下订单量','成交订单量','成交订单金额','订单成本','拍下订单金额', '转化数', '转化成本', '添加购物车量']
        const filterVal = ['id','metia_name','name','collectioncost','ecpm','adctr','ecpc','adpv','click','returnoninvestment','takeordervolume','transactionvolume','transactionamount','alipaycost','takeorderamount','pagearrive','convertcost','addcartvolume']
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
        return v[j];
      }))
    },
    // 点击面板
    handleClick(tab, event) {
      console.log(tab, event);
      console.log('当前面板' + tab.name);
    },
    // 搜索框输入选中项
    selectAll(val) {
      const valArr = [];
      this.optionsCopy = [...this.options];
      this.optionsCopy.forEach(item => {
        valArr.push(item.value);
      })

      // 选择搜索出的结果后
      if (this.options.length < this.optionsCopy.length) {
        if (val[0] === '0') {
          const duplicatedValues = [...new Set(this.valuesList)].filter(item => val.includes(item)).splice(1);
          this.valuesList = duplicatedValues;
        }
      }

      this.listQuery.str = this.valuesList;
      this.listQuery.page = 1;
      this.getReportList();
    },
    clearAll() {
      this.valuesList = [];
    },
    // 表头输入框 只能限制输入正整数-已绑自定义指令
    inputChange(){
      if(this.query.collectioncost || this.query.returnoninvestment){
        this.filterInputArr = this.list.filter(item =>{
          return this.moneyDelete(item.collectioncost) > Number(this.query.collectioncost)
          &&
          (this.toPoint(item.returnoninvestment) * 100 > 0 ? this.toPoint(item.returnoninvestment) * 100 : 1) > Number(this.query.returnoninvestment)
        })

        // 筛选到匹配的项才进行遍历
        if(!this.filterInputArr.length == 0){
          // 将input框中匹配项的账户名称显示出来
          var warnArr = [];
          this.filterInputArr.forEach(item => {
            warnArr.push(item.name)
          });
          this.warningInfo = warnArr.join(',');
          this.open();
        }
      }
    },
    // 在input框按回车或失去焦点触发【需求搁置：待甲方确认是否 将input框自定义设置的值发到后台。】
    searchReport(type){
      if(type === 1){
        // console.log('当前按的是消耗选项~');
        // 消耗选项-按回车
        // this.warningQuery.name = '消耗';
        // this.warningQuery.values = this.query.collectioncost;
        // this.warningQuery.field_name = 'collectioncost';
        // warningList(this.warningQuery).then((res)=>{
        //   // console.log(res);
        // })
      }else if(type === 2){
        // console.log('当前按的是回报率选项~');
        // 投资回报率选项-按回车
        // this.warningQuery.name = '投资回报率';
        // this.warningQuery.values = this.query.returnoninvestment;
        // this.warningQuery.field_name = 'returnoninvestment';
        // warningList(this.warningQuery).then((res)=>{
        //   // console.log(res);
        // })
      }
    },
    // 符合项行高亮显示
    tableRowClassName({row}){
      if(this.query.collectioncost && this.query.returnoninvestment){
        var condition1 = parseFloat(this.moneyDelete(row.collectioncost)) > this.query.collectioncost;
        var condition2 = this.toPoint(row.returnoninvestment)*100 > this.query.returnoninvestment;
        if(condition1 && condition2){
          return 'warning-row';
        }
      }else if(this.query.collectioncost){
        var result = parseFloat(this.moneyDelete(row.collectioncost));
        if(result > parseFloat(this.query.collectioncost)){
          return 'warning-row';
        }
      }else if(this.query.returnoninvestment){
        var result = this.toPoint(row.returnoninvestment)*100;
        if(result > this.query.returnoninvestment){
          return 'warning-row';
        }
      }
      return '';
    }
  }
}
</script>

<style>
  .el-table .warning-row td {
  background: #f5f7fa !important;
  color: #385acc;
}
</style>

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
      font-size: 22px;
    }

    span.special-font{
      color: #385acc;
      font-weight: 700;
      font-size: 22px;
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

 .warning-div {
   height: 35px;
   line-height: 35px;
  //  background-color: pink;
   margin-bottom: 5px;
 }
}
</style>

