<template>
  <el-dialog title="添加" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
    <!-- 主体区 -->
    <el-form label-width="100px" :model="addForm" :rules="addRules" ref="addRef">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名字" maxlength="20" clearable show-word-limit v-model="addForm.name"
        ></el-input>
      </el-form-item>

      <el-form-item label="上级分类" prop="parant_id">
        <el-select
          v-model="addForm.parant_id"
          filterable
          remote
          reserve-keyword
          placeholder="请选择分类"
          :remote-method="remoteMethod"
          :loading="OptionLoading">
          <el-option
            v-for="item in addOption"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否热门">
        <el-radio-group v-model="addForm.is_hot" size="medium">
          <el-radio v-for="(item,index) in param.isHotList" :key="index" border :label="index">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否隐藏">
        <el-radio-group v-model="addForm.is_show" size="medium">
          <el-radio v-for="(item,index) in param.isShowList" :key="index" border :label="index">{{ item }}</el-radio>
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
import {cateStore} from "@/api/admin/category";
import {getcate} from "@/api/admin/brand";

export default {
  name: "CateAdd",
  // props: ['isShowList','isHotList','cateOption'],
  props: ['param'],
  data() {
    return {
      addDialogVisible: false,
      downloadLoading: false,
      addForm: {
        name: "",
        is_hot: 0,
        is_show: 0,
        parant_id: null,
      },
      addRules: {
        name: [
          {required: true, message: "请输入姓名！", trigger: "blur"},
          {min: 2, max: 20, message: "姓名长度在2到20个字符", trigger: "blur"}
        ],
        isShow: [
          {required: true, message: "请输入昵称！", trigger: "blur"}
        ],

      },
      addValue: [],
      //选项
      addOption: [],
      OptionLoading: false,
    }
  },
  created() {
    this.remoteMethod(null);
  },
  methods: {
    showDialog() {
      this.addDialogVisible = true;
    },
    // 监听添加对话框的关闭事件
    addDialogClose() {
      this.addForm = {
        id: '',
        name: "",
        is_hot: 0,
        is_show: 0,
        parant_id: null,
      }
      this.addValue = []
      this.$refs.addRef.resetFields()
    },
    // 添加按钮
    add() {
      this.$refs.addRef.validate(valid => {
        if (valid) {
          cateStore(this.addForm).then(response => {
            if (response.status === 20000) {
              this.$base.message({message: response.message})
              this.addDialogVisible = false
              this.$emit('getList')
            }
          })
        }
      })
    },
    remoteMethod(value) {
      this.OptionLoading = true
      getcate({name: value}).then(response => {
        if (response.status === 20000) {
          this.addOption = response.data
        }
        this.OptionLoading = false
      })
    },
  },
  components: {},
}
</script>

<style scoped>

</style>
