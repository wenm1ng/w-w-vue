<template>
  <el-dialog title="添加" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
    <!-- 主体区 -->
    <el-form label-width="100px" :model="addForm" :rules="addRules" ref="addRef">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名字" maxlength="20" clearable show-word-limit v-model="addForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input placeholder="描述" clearable show-word-limit v-model="addForm.desc"
        ></el-input>
      </el-form-item>

      <el-form-item label="是否热门" prop="is_hot">
        <el-radio-group v-model="addForm.is_hot" size="medium">
          <el-radio v-for="(item,index) in isHotList" :key="index" border :label="index">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="logo" prop="logo_id">
        <s-file-image
          :image_list="logoList"
          @confirmImsge="logoConfirmImsge"
          @deleteImsge="logoDelImsge">
        </s-file-image>
      </el-form-item>

      <el-form-item label="分类名称" prop="cat_id">
        <el-select
          v-model="addForm.cat_id"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
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


    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="addDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="add()">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import sFileImage from "@/components/common/sFileImage/sFileImage";
import {brandStore, getcate} from "@/api/admin/brand";

export default {
  name: "BrandAdd",
  props: ['isHotList'],
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      downloadLoading: false,
      addForm: {
        name: "",
        desc: "",
        is_hot: 0,
        cat_id: null,
        logo_id: 0,

      },
      addRules: {
        name: [
          {required: true, message: "请输入姓名！", trigger: "blur"},
          {min: 2, max: 20, message: "姓名长度在2到20个字符", trigger: "blur"}
        ],
        // cat_id: [
        //   {required: true, message: "选择分类！", trigger: "blur"},
        // ],

      },
      addValue: [],
      logoList: [],

      //选项
      addOption: [],
      OptionLoading: false,
    }
  },
  async created() {
    await this.remoteMethod();
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
        desc: "",
        is_hot: 0,
        cat_id: null,
        logo_id: 0,
      }
      this.addValue = []
      this.$refs.addRef.resetFields()
    },
    // 图片上传回调
    logoConfirmImsge(res) {
      this.addForm.logo_id = res[0].id
    }, logoDelImsge(res) {
      this.addForm.logo_id = null;
    },
    // 添加按钮
    add() {
      this.$refs.addRef.validate(valid => {
        if (valid) {
          brandStore(this.addForm).then(response => {
            if (response.status === 20000) {
              this.$base.message({message: response.message})
              this.addDialogVisible = false
              this.$emit('getList')
            }
          })
        }
      })
    },
    async remoteMethod(value) {
      this.OptionLoading = true
      getcate({name: value}).then(response => {
        if (response.status === 20000) {
          this.addOption = response.data
        }
        this.OptionLoading = false
      })
    },


  },
  components: {
    "s-file-image": sFileImage
  },
}
</script>

<style scoped>

</style>
