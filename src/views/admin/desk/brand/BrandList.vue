<template>
  <div id="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="分类名称"
        style="width: 200px"
        class="filter-item"
        clearable
        @change="handleFilter"
      />

      <el-divider direction="vertical"></el-divider>
      <el-select
        v-model="listQuery.is_hot"
        placeholder="是否热门"
        clearable
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="(item, index) in isHotList"
          :key="index"
          :label="item"
          :value="index"
        ></el-option>
      </el-select>

      <el-divider direction="vertical"></el-divider>
      <s-date-picker
        :date="listQuery.created_at"
        @changeDateTime="eventStartTime"
      ></s-date-picker>

      <!--      按钮-->
      <div>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          @click="getList()"
        >
          查询
        </el-button>

        <el-button
          v-waves
          class="filter-item"
          type="info"
          icon="fa fa-refresh"
          @click="refresh"
        >
          重置
        </el-button>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          @click="addDialog()"
        >
          添加
        </el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >
          导出
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="编号" width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="品牌名称">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="logo">
        <template slot-scope="{ row }">
          <el-avatar :src="getUrl(row, host)" shape="square" size="small">
          </el-avatar>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="描述">
        <template slot-scope="{ row }">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="分类名称">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否热门" prop="is_hot" width="80">
        <template slot-scope="{ row }">
          <el-tooltip
            effect="dark"
            :content="isHotList[row.is_hot]"
            placement="top"
            :enterable="false"
          >
            <el-switch
              v-model="row.is_hot"
              active-color="#5FB878"
              inactive-color="#d2d2d2"
              :active-value="1"
              :inactive-value="0"
              @change="setStatus(row)"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="{ row }">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="修改时间">
        <template slot-scope="{ row }">
          <span>{{ row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            v-waves
            type="primary"
            size="mini"
            @click="showEditDialog(row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-waves
            type="danger"
            size="mini"
            @click="delHandle(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!--    addDialog-->
    <brand-add ref="addRefAdd" @getList="getList()" :isHotList="isHotList" />
    <!--    editDialog-->
    <brand-edit
      ref="addRefEdit"
      @getList="getList()"
      :isHotList="isHotList"
      :host="host"
    />
  </div>
</template>

<script>
import BrandAdd from "./BrandAdd";
import BrandEdit from "./BrandEdit";
import { brandIndex, brandcDestroy, brandStatus } from "@/api/admin/brand";

export default {
  name: "BrandList",
  data() {
    return {
      list: [],
      total: 0,
      host: "",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: null,
        is_hot: null,
        created_at: [],
        updated_at: [],
      },
      downloadLoading: false,
      searchValue: [],
      isShowList: ["正常", "隐藏"],
      isHotList: ["否", "是"],
    };
  },
  async created() {
    await this.getList();
  },
  computed: {
    getUrl: function () {
      return (row, host) => {
        if (row.getimg && row.getimg.url) {
          return host + row.getimg.url;
        } else {
          return "";
        }
      };
    },
  },
  methods: {
    eventStartTime(val) {
      this.listQuery.created_at = val;
      this.handleFilter();
    },
    // 获取表格列表
    async getList() {
      this.listLoading = true;
      brandIndex(this.listQuery).then((response) => {
        if (response.status === 20000) {
          this.list = response.data.list;
          this.total = response.data.total;
          this.host = response.data.host;
        }
        this.listLoading = false;
      });
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 重置
    refresh() {
      this.listQuery = {
        page: 1,
        limit: 10,
        name: null,
        is_hot: null,
        created_at: [],
        updated_at: [],
      };
      this.getList();
    },
    addDialog() {
      this.$refs.addRefAdd.showDialog();
    },
    showEditDialog(id) {
      this.$refs.addRefEdit.edit(id);
    },
    delHandle(id) {
      brandcDestroy({ id: id }).then((response) => {
        if (response.status === 20000) {
          this.$base.message({ message: response.message });
          this.getList();
        }
      });
    },
    // 状态调整
    setStatus(info) {
      brandStatus({ id: info.id, is_hot: info.is_hot }).then((response) => {
        if (response.status === 20000) {
          this.$base.message({ message: response.message });
        } else {
          info.is_hot = info.is_hot ? 0 : 1;
        }
      });
    },
    // 导出数据
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["编号", "名称", "修改时间", "创建时间"];
        const filterVal = ["id", "name", "updated_at", "created_at"];
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
          if (j === "isHot") {
            return this.isHot[v[j]];
          } else if (j === "status") {
            return this.isShow[v[j]];
          } else {
            return v[j];
          }
        })
      );
    },
  },
  components: {
    BrandEdit,
    BrandAdd,
  },
};
</script>

<style scoped>
</style>
