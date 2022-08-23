<template>
  <el-dialog title="添加" :visible.sync="addDialogVisible" width="40%" @close="addDialogClose">
    <!-- 主体区 -->
      <el-form label-width="100px" :model="Form" :rules="Rules" ref="addRef">
        <el-form-item label="真实姓名" prop="real_name">
          <el-input  placeholder="真实姓名" maxlength="20" clearable show-word-limit v-model="Form.real_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理员账号" prop="user_id">
          <el-select
            v-model="Form.user_id"
            remote
            clearable
            reserve-keyword
            placeholder="请选择关联管理员"
            :remote-method="remoteMethod2"
            :loading="OptionLoading">
            <el-option
              v-for="item in adminOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台" prop="platform_id">
          <el-select
            v-model="Form.platform_id"
            remote
            clearable
            reserve-keyword
            placeholder="请选择平台"
            :remote-method="remoteMethod"
            :loading="OptionLoading">
            <el-option
              v-for="item in platformOption"
              :key="item.id"
              :label="item.platform_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="第三方账号" prop="username">
          <el-input
            type="textarea"
            clearable
            placeholder="第三方账号多个用,号拼接"
            v-model="Form.username"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="提醒手机号" prop="phone">
          <el-input
            type="textarea"
            clearable
            placeholder="提醒手机号多个用,号拼接(数量要与第三方账号匹配)"
            v-model="Form.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否提醒">
          <el-radio-group v-model="Form.is_alert" size="medium">
            <el-radio v-for="(item,index) in param.StatusList" :key="index" border :label="index">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否使用">
          <el-radio-group v-model="Form.status" size="medium">
            <el-radio v-for="(item,index) in param.StatusList" :key="index" border :label="index">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="addDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="add()">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import {GegPlatform, SecUserStore} from "@/api/admin/SecUser";
import {adminIndex} from "@/api/admin/admin";

export default {
  name: "SecUserAdd",
  props: ['param'],
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      downloadLoading: false,
      Form: {
        real_name: "",
        platform_id: null,
        username: "",
        phone: "",
        user_id: null,
        status: 0,
        is_alert: 0,

      },
      Rules: {
        real_name: [
          {required: true, message: "请输入名字！", trigger: "blur"},
          {min: 2, max: 20, message: "姓名长度在2到20个字符", trigger: "blur"}
        ],
        platform_id: [
          {required: true, message: "请选择平台！", trigger: "blur"},
        ],

      },
      addValue: [],

      //选项
      platformOption: [],
      //管理员列表
      adminOption: [],
      OptionLoading: false,
    }
  },
  async created() {
    await this.remoteMethod();
    await this.remoteMethod2();
  },
  methods: {
    showDialog() {
      this.addDialogVisible = true;
    },
    // 监听添加对话框的关闭事件
    addDialogClose() {
      this.Form = {
        id: '',
        name: "",
        desc: "",
        is_hot: 0,
        cat_id: null,
        logo_id: 0,
      }
      this.addValue = []
      this.$refs.addRef.resetFields()
    },

    // 添加按钮
    add() {
      this.$refs.addRef.validate(valid => {
        if (valid) {
          SecUserStore(this.Form).then(response => {
            if (response.status === 20000) {
              this.$base.message({message: response.message})
              this.addDialogVisible = false
              this.$emit('getList')
            }
          })
        }
      })
    },
    //平台选项
    async remoteMethod(value) {
    //   this.OptionLoading = true
      GegPlatform({page:1,limit:1000}).then(response => {
        if (response.status === 20000) {
          this.platformOption = response.data.list
        }
        this.OptionLoading = false
      })

    },
    //管理员列表
    async remoteMethod2(value) {
    //   this.OptionLoading = true
      adminIndex({page:1,limit:1000}).then(response => {
        if (response.status === 20000) {
          this.adminOption = response.data.list
        }
        this.OptionLoading = false
      })

    },


  },
  components: {
  },
}
</script>

<style scoped>

</style>
