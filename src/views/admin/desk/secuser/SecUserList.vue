<template>

  <div id="app-container">
    <el-card>
      <div class="filter-container">
        <el-input v-model="listQuery.name" placeholder="分类名称" style="width: 200px;" class="filter-item" clearable
                  @change="handleFilter"/>

        <el-divider direction="vertical"></el-divider>
        <el-select v-model="listQuery.status" placeholder="是否使用" clearable style="width: 200px" class="filter-item"
                   @change="handleFilter">
          <el-option v-for="(item,index) in StatusList" :key="index" :label="item" :value="index"></el-option>
        </el-select>

        <el-divider direction="vertical"></el-divider>
        <s-date-picker :date="listQuery.created_at" @changeDateTime="eventStartTime"></s-date-picker>

        <!--      按钮-->
        <div>
          <el-button v-waves class="filter-item" type="primary" @click="getList()">
            查询
          </el-button>

          <el-button v-waves class="filter-item" type="info" icon="fa fa-refresh" @click="refresh">
            重置
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="addDialog()">
            添加
          </el-button>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                     @click="handleDownload">
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
        <el-table-column width="120px" align="center" label="真实姓名">
          <template slot-scope="{row}">
            <span>{{ row.real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="center" label="管理账号名">
          <template slot-scope="{row}">
            <span>{{ row?.get_admin_user?.name }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="第三方账号">
          <template slot-scope="{row}">
            <span>{{ row.username }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="第三方平台名称">
          <template slot-scope="{row}">
            <span>{{ row.get_platform.platform_name }}</span>
          </template>
        </el-table-column>


        <el-table-column align="center" label="是否提醒" prop="is_alert" width="80">
          <template slot-scope="{row}">
            <el-tooltip
              effect="dark"
              :content="StatusList[row.is_alert]"
              placement="top"
              :enterable="false">
              <el-switch
                v-model="row.is_alert"
                active-color="#5FB878"
                inactive-color="#d2d2d2"
                :active-value="1"
                :inactive-value="0"
                @change="setStatus({id:row.id,is_alert:row.is_alert})"
              ></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column align="center" label="是否使用" prop="status" width="80">
          <template slot-scope="{row}">
            <el-tooltip
              effect="dark"
              :content="StatusList[row.status]"
              placement="top"
              :enterable="false">
              <el-switch
                v-model="row.status"
                active-color="#5FB878"
                inactive-color="#d2d2d2"
                :active-value="1"
                :inactive-value="0"
                @change="setStatus({id:row.id,status:row.status})"
              ></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>


        <el-table-column width="160px" align="center" label="提醒手机号">
          <template slot-scope="{row}">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>

        <el-table-column width="160px" align="center" label="创建时间">
          <template slot-scope="{row}">
            <span>{{ row.created_at }}</span>
          </template>
        </el-table-column>
        <el-table-column width="160px" align="center" label="修改时间">
          <template slot-scope="{row}">
            <span>{{ row.updated_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-waves type="primary" size="mini" @click="showEditDialog(row.id)">
              编辑
            </el-button>
            <el-button v-waves type="danger" size="mini" @click="delHandle(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <!--    addDialog-->
    <SecUser-add ref="addRefAdd" @getList="getList()" :param="{StatusList}"/>
    <!--    editDialog-->
        <SecUser-edit ref="addRefEdit" @getList="getList()"  :param="{StatusList}"/>
  </div>
</template>

<script>
import SecUserAdd from "./SecUserAdd";
import SecUserEdit from "./SecUserEdit";
import {SecUserIndex, SecUsercDestroy, SecUserStatus} from "@/api/admin/SecUser";

export default {
  name: "SecUserList",
  data() {


    return {
      list: [],
      total: 0,
      host: '',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        real_name: "",
        platform_id: null,
        username: "",
        phone: "",
        user_id: null,
        status: 0,
        is_alert: 0,
        created_at: [],
        updated_at: []
      },
      downloadLoading: false,
      searchValue: [],
      StatusList: ['否', '是'],
    }
  },
  async created() {
    await this.getList()
  },
  computed: {},
  methods: {
    eventStartTime(val) {
      this.listQuery.created_at = val
      this.handleFilter()
    },
    // 获取表格列表
    async getList() {
      this.listLoading = true
      SecUserIndex(this.listQuery).then(response => {
        if (response.status === 20000) {
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
    refresh() {
      this.listQuery = {
        page: 1,
        limit: 10,
        real_name: "",
        platform_id: null,
        username: "",
        phone: "",
        user_id: null,
        status: 0,
        is_alert: 0,
        created_at: [],
        updated_at: []
      }
      this.getList()
    },
    addDialog() {
      this.$refs.addRefAdd.showDialog();
    },
    showEditDialog(id) {
      this.$refs.addRefEdit.edit(id);
    },
    delHandle(id) {
      SecUsercDestroy({id: id}).then(response => {
        if (response.status === 20000) {
          this.$base.message({message: response.message});
          this.getList();
        }
      })

    },
    // 状态调整
    setStatus(info) {
      SecUserStatus(info).then(response => {
        if (response.status === 20000) {
          this.$base.message({message: response.message})
        }
      })
      // SecUserStatus({id: info.id, status: info.status,key:"status"}).then(response => {
      //   if (response.status === 20000) {
      //     this.$base.message({message: response.message})
      //   } else {
      //     info.status = info.status ? 0 : 1
      //   }
      // })

    },
    // 导出数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['编号', '真实名称',    '平台名称',     '管理账号',         '第三方账号', '创建时间']
        const filterVal = ['id', 'real_name','get_platform','get_admin_user', 'username', 'created_at',]
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
        console.log('vv',v)
        console.log('jj',j)
        if (j === 'get_admin_user') {
          return v[j]?.name
        } else if (j === 'status') {
          return this.StatusList[v[j]]
        } else if (j === 'get_platform') {
          return v[j]?.platform_name
        } else {
          return v[j]
        }
      }))
    }
  },
  components: {
    SecUserEdit,
    SecUserAdd,
  },
}
</script>

<style scoped>

</style>
