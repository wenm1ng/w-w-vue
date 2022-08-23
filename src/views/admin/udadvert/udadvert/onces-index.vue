<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.plan_name"
        placeholder="计划名称"
        style="width: 200px"
        class="filter-item"
        clearable
        @change="handleFilter"
      />
      <div>
        <!--        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="add()">
          添加
        </el-button>-->
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      row-key="plan_name"
    >
      <el-table-column width="250px" label="账户名称">
        <template slot-scope="{ row }">
          <span>
            {{ row.advertiser_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="250px" label="广告组名称">
        <template slot-scope="{ row }">
          <span>
            {{ row.campaign_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="250px" label="计划名称">
        <template slot-scope="{ row }">
          <span>
            {{ row.plan_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="150px" label="平台">
        <template slot-scope="{ row }">
          <span>{{ row.platform }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" label="创建时间">
        <template slot-scope="{ row }">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button v-waves type="primary" size="mini" @click="edit(row.id)">
            编辑
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
    <!-- 添加编辑对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="72%"
      @close="dialogClose"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px" :model="form" :rules="rules" ref="ref">
        <el-row type="flex">
          <el-col :span="10">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span
                  style="
                    font-size: 16px;
                    font-weight: 600;
                    color: rgb(223, 130, 145);
                  "
                  >头条广告详情</span
                >
              </div>
              <div class="udadvert-info">
                <div class="d-flex">
                  <span class="info-title">计划名称:</span>
                  <span class="info-desc">{{ form.plan_name }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">优化目标:</span>
                  <span class="info-desc">{{ form.optimize_target }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">直达链接:</span>
                  <span class="info-desc">{{ form.link_content }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">自研落地页:</span>
                  <span class="info-desc">{{ form.optimize_id }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">投放位置:</span>
                  <span class="info-desc">{{ form.province_user }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">性别:</span>
                  <span class="info-desc">{{ form.delivery_platform }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">区域省市:</span>
                  <span class="info-desc">{{ form.delivery_province }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">投放用户区域:</span>
                  <span class="info-desc">{{ form.release_user_area }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">性别:</span>
                  <span class="info-desc">{{ form.sex }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">年龄:</span>
                  <span class="info-desc">{{ form.age }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">行为前置:</span>
                  <span class="info-desc">{{ form.behavior_category }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">行为类目词:</span>
                  <span class="info-desc">{{ form.xingqu_keyword }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">兴趣类目词:</span>
                  <span class="info-desc">{{ form.interest_category }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">兴趣关键词:</span>
                  <span class="info-desc">{{ form.interest_keysword }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">手机平台:</span>
                  <span class="info-desc">{{ form.iphone_platform }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">设备类型:</span>
                  <span class="info-desc">{{ form.device_type }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">网络:</span>
                  <span class="info-desc">{{ form.network }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">过滤用户:</span>
                  <span class="info-desc">{{ form.except_user }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">智能放量:</span>
                  <span class="info-desc">{{ form.ai_scale }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">投放场景:</span>
                  <span class="info-desc">{{ form.launch_scenario }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">日预算:</span>
                  <span class="info-desc">{{ form.day_budget }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">投放时段:</span>
                  <span class="info-desc">{{ form.launch_timestmp }}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">目标转化出价:</span>
                  <span class="info-desc">{{ form.conversion_bid }}</span>
                </div>
                <div class="d-flex1">
                  <span class="info-title1">有效触点:</span>
                  <span class="info-desc1">{{ form.others_link }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <!-- <el-form-item label="计划名称" prop="name">
          <el-input placeholder="计划名称" disabled="disabled" maxlength="100" clearable show-word-limit v-model="form.plan_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="优化目标" prop="optimize_target">
          <el-input placeholder="优化目标"  clearable show-word-limit v-model="form.optimize_target"
          ></el-input>
        </el-form-item>
        <el-form-item label="直达链接">
          <el-input placeholder="直达链接"  clearable show-word-limit v-model="form.link_content"
          ></el-input>
        </el-form-item>
        <el-form-item label="自研落地页" prop="optimize_id">
          <el-input placeholder="自研落地页" clearable show-word-limit v-model="form.optimize_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="投放位置" prop="delivery_platform">
          <el-input placeholder="投放位置" clearable show-word-limit v-model="form.delivery_platform"
          ></el-input>
        </el-form-item>
        <el-form-item label="区域省市" prop="delivery_province">
          <el-input placeholder="区域省市" clearable show-word-limit v-model="form.delivery_province"
          ></el-input>
        </el-form-item>
        <el-form-item label="投放用户区域" prop="release_user_area">
          <el-input placeholder="投放用户区域" clearable show-word-limit v-model="form.release_user_area"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="description">
          <el-input placeholder="性别" clearable show-word-limit v-model="form.sex"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="description">
          <el-input placeholder="年龄" clearable show-word-limit v-model="form.age"
          ></el-input>
        </el-form-item>
        <el-form-item label="行为前置" prop="behavioral_interest">
          <el-input placeholder="行为前置" clearable show-word-limit v-model="form.behavioral_interest"
          ></el-input>
        </el-form-item>
        <el-form-item label="行为类目词" prop="behavior_category">
          <el-input placeholder="行为词" type="textarea" clearable show-word-limit v-model="form.behavior_category"
          ></el-input>
        </el-form-item>
        <el-form-item label="行为关键词" prop="behavior_keysword">
          <el-input placeholder="行为词" type="textarea" clearable show-word-limit v-model="form.behavior_keysword"
          ></el-input>
        </el-form-item>
        <el-form-item label="兴趣类目词" prop="interest_category">
          <el-input placeholder="兴趣词" type="textarea" clearable show-word-limit v-model="form.interest_category"
          ></el-input>
        </el-form-item>
        <el-form-item label="兴趣关键词" prop="interest_keysword">
          <el-input placeholder="兴趣词" clearable type="textarea" show-word-limit v-model="form.interest_keysword"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机平台" prop="iphone_platform">
          <el-input placeholder="手机平台" clearable show-word-limit v-model="form.iphone_platform"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="device_type">
          <el-input placeholder="设备类型" clearable show-word-limit v-model="form.device_type"
          ></el-input>
        </el-form-item>
        <el-form-item label="网络" prop="network">
          <el-input placeholder="网络" clearable show-word-limit v-model="form.network"
          ></el-input>
        </el-form-item>
        <el-form-item label="过滤用户" prop="except_user">
          <el-input placeholder="过滤已转化用户" clearable show-word-limit v-model="form.except_user"
          ></el-input>
        </el-form-item>
        <el-form-item label="智能放量" prop="ai_scale">
          <el-input placeholder="智能放量" clearable show-word-limit v-model="form.ai_scale"
          ></el-input>
        </el-form-item>
        <el-form-item label="投放场景" prop="launch_scenario">
          <el-input placeholder="投放场景" clearable show-word-limit v-model="form.launch_scenario"
          ></el-input>
        </el-form-item>

        <el-form-item label="日预算" prop="day_budget">
          <el-input placeholder="日预算" clearable show-word-limit v-model="form.day_budget"
          ></el-input>
        </el-form-item>

        <el-form-item label="投放时段" prop="launch_timestmp">
          <el-input placeholder="投放时段" clearable show-word-limit v-model="form.launch_timestmp"
          ></el-input>
        </el-form-item>
        <el-form-item label="目标转化出价" prop="conversion_bid">
          <el-input placeholder="目标转化出价" clearable show-word-limit v-model="form.conversion_bid"
          ></el-input>
        </el-form-item>
        <el-form-item label="有效触点" prop="others_link">
          <el-input placeholder="有效触点" clearable show-word-limit v-model="form.others_link"
          ></el-input>
        </el-form-item> -->
          <el-col :span="14">
            <el-form-item label="账户id" prop="udadvertiser_id">
              <el-input
                placeholder="账户id"
                clearable
                show-word-limit
                v-model="form.udadvertiser_id"
              ></el-input>
            </el-form-item>
            <el-form-item label="广告组id" prop="udcampaign_id">
              <el-input
                placeholder="广告组id"
                clearable
                show-word-limit
                v-model="form.udcampaign_id"
              ></el-input>
            </el-form-item>
            <!--        <el-form-item label="生成数量" prop="numbers">
          <el-input placeholder="生成数量" clearable show-word-limit v-model="form.numbers"
          ></el-input>
        </el-form-item>-->

            <el-form-item label="创意类型" prop="creative_type">
              <el-select
                v-model="form.creative_type"
                placeholder="请选择创意类型"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option label="程序化创意" value="程序化创意"></el-option>
                <el-option label="自定义创意" value="自定义创意"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="基础组件" prop="component_id">
              <el-input
                placeholder="基础组件ID"
                clearable
                show-word-limit
                v-model="form.component_id"
              ></el-input>
            </el-form-item>
            <el-form-item label="创意组件" prop="creative_component_id">
              <el-input
                placeholder="创意组件ID"
                clearable
                show-word-limit
                v-model="form.creative_component_id"
              ></el-input>
            </el-form-item>
            <el-form-item label="创意来源" prop="creative_source">
              <el-input
                placeholder="创意来源"
                value="天猫-"
                clearable
                show-word-limit
                v-model="form.creative_source"
              ></el-input>
            </el-form-item>

            <el-form-item label="落地页id" prop="land_link_id">
              <el-input
                placeholder="落地页链接id"
                clearable
                show-word-limit
                v-model="form.land_link_id"
              ></el-input>
            </el-form-item>

            <el-form-item label="创意分类" prop="creative_category">
              <!--          <el-input placeholder="创意分类"  clearable show-word-limit v-model="form.creative_category"
          ></el-input>-->
              <el-cascader
                :options="categoryList"
                placeholder="默认顶级"
                :props="{
                  expandTrigger: 'hover',
                  value: 'id',
                  label: 'values',
                  // multiple: true,
                  // checkStrictly: true
                }"
                v-model="value"
                @change="handleChange"
                clearable
                style="width: 100%"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="视频地址" prop="dir_video_link">
              <el-input
                placeholder="视频地址"
                clearable
                show-word-limit
                v-model="form.dir_video_link"
              ></el-input>
            </el-form-item>
            <el-form-item label="创意标题" prop="creative_title">
              <el-input
                placeholder="创意标题"
                clearable
                height="100px"
                show-word-limit
                type="textarea"
                v-model="form.creative_title"
              ></el-input>
            </el-form-item>
            <el-form-item label="标题数量" prop="creative_title_nums">
              <el-input
                placeholder="标题数量"
                clearable
                show-word-limit
                v-model="form.creative_title_nums"
              ></el-input> </el-form-item
            ><el-form-item label="创意标签" prop="creative_label">
              <el-input
                placeholder="创意标签"
                clearable
                show-word-limit
                type="textarea"
                v-model="form.creative_label"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import {
  udadvertOncesIndex,
  udadvertOncesDetails,
  udadvertOncesUpdate,
  getCategoryList,
} from "@/api/admin/udadvert.js";
export default {
  name: "oncesIndex",
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
      icon: "",
      title: "",
      total: 0,
      list: [],
      categoryList: [],
      listQuery: {
        page: 1,
        limit: 10,
        plan_name: "",
      },
      listLoading: true,
      dialogVisible: false,
      value: [],
      form: {
        id: "",
        udcampaign_name: "",
        numbers: "",
        dir_link: "",
        udcampaign_id: "",
        udadvertiser_name: "",
        udadvertiser_id: "",
      },
      rules: {
        udadvertiser_id: [
          { required: true, message: "请输入账户id！", trigger: "blur" },
        ],
        dir_video_link: [
          { required: true, message: "请输入视频文件路径！", trigger: "blur" },
        ],
        creative_type: [
          { required: true, message: "请选择创意类型！", trigger: "blur" },
        ],
        creative_title: [
          { required: true, message: "请输入创意标题！", trigger: "blur" },
        ],
        creative_label: [
          { required: true, message: "请输入创意标签！", trigger: "blur" },
        ],
        creative_source: [
          { required: true, message: "请输入创意来源！", trigger: "blur" },
        ],
        land_link_id: [
          { required: true, message: "落地页链接id！", trigger: "blur" },
        ],
        udcampaign_id: [
          { required: true, message: "请输入广告组id！", trigger: "blur" },
        ],
      },
    };
  },
  async created() {
    await this.getList(this.listQuery);
  },
  methods: {
    // 获取表格列表
    async getList() {
      this.listLoading = true;
      udadvertOncesIndex(this.listQuery).then((response) => {
        if (response.status === 20000) {
          this.list = response.data.list;
          this.total = response.data.total;
        }
        this.listLoading = false;
      });
    },
    // 获取表格列表
    async getCategory() {
      this.listLoading = true;
      getCategoryList().then((response) => {
        if (response.status === 20000) {
          this.categoryList = response.data;
        }
        this.listLoading = false;
      });
    },
    // 监听添加编辑对话框的关闭事件
    dialogClose() {
      this.value = [];
      this.uform = {
        id: "",
        name: "",
        platform_id: 1,
        team_number: "",
        remark: "",
      };
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
    add() {
      this.dialogVisible = true;
      this.title = "添加";
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 添加编辑按钮
    primary() {
      this.$refs.ref.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            udadvertOncesUpdate(this.form).then((response) => {
              if (response.status === 20000) {
                this.$base.message({ message: response.message });
                this.dialogVisible = false;
                this.getCategory();
              }
            });
          } else {
            teamAdd(this.form).then((response) => {
              if (response.status === 20000) {
                this.$base.message({ message: response.message });
                this.dialogVisible = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    // 打开编辑按钮对话框
    edit(id) {
      udadvertOncesDetails({ id: id }).then((response) => {
        if (response.status === 20000) {
          this.title = "编辑";
          this.dialogVisible = true;
          this.form = response.data;
          this.value = response.data.value;
          this.getCategory();
        }
      });
    },
    // 删除
    del(id) {
      this.$base.confirm({ content: "确定删除吗！" }, () => {
        del({ id: id }).then((response) => {
          if (response.status === 20000) {
            this.$base.message({ message: response.message });
            this.getList();
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.box-card {
  width: 100%;
}
.udadvert-info {
  .d-flex {
    height: 25px;
    line-height: 25px;
    display: flex;
    width: 100%;

    .info-title {
      display: block;
      width: 108px;
      font-size: 14px;
      text-align: center;
      font-family: 微软雅黑;
      font-weight: 600;
      width: 20%;
    }
    .info-desc {
      display: block;
      width: 245px;
      width: 80%;
      overflow: hidden;
      font-size: 13px;
      word-wrap: break-word;
    }
  }
  .d-flex1 {
    height: 70px;
    line-height: 18px;
    display: flex;
    width: 100%;

    .info-title1 {
      display: block;
      width: 108px;
      font-size: 14px;
      text-align: center;
      font-family: 微软雅黑;
      font-weight: 600;
      width: 20%;
    }
    .info-desc1 {
      display: block;
      width: 245px;
      font-size: 13px;
      width: 80%;
    }
  }
}
</style>