<template>
  <el-dialog title="编辑" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
    <!-- 主体区 -->
    <el-form label-width="100px" :model="editForm"
             :rules="editRules"
             ref="editRef">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名称" maxlength="20" clearable show-word-limit v-model="editForm.name"
        ></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="desc">
        <el-input placeholder="描述" clearable show-word-limit v-model="editForm.desc"
        ></el-input>
      </el-form-item>

      <el-form-item label="是否热门" prop="is_hot">
        <el-radio-group v-model="editForm.is_hot" size="medium">
          <el-radio v-for="(item,index) in isHotList" :key="index" border :label="index">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="logo" prop="logo_id">
        <s-file-image :image_list="logoList" @confirmImsge="logoConfirmImsge"></s-file-image>
      </el-form-item>

      <el-form-item label="分类名称" prop="cat_id">
        <el-select
          v-model="editForm.cat_id"
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
        <el-button v-waves @click="editDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="update()">确 定</el-button>
      </span>
  </el-dialog>

</template>

<script>
import {brandEdit, brandUpdate, getcate} from "@/api/admin/brand";
import sFileImage from "@/components/common/sFileImage/sFileImage";

export default {
  name: "BrandEdit",
  props: ['host', 'isHotList'],
  data() {
    return {
      editDialogVisible: false,
      editForm: {
        id: "",
        name: "",
        desc: "",
        is_hot: 0,
        cat_id: null,
        logo_id: 0,
      },
      editRules: {
        name: [
          {required: true, message: "请输入姓名！", trigger: "blur"},
        ],
      },
      editValue: [],
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
      this.editDialogVisible = true;
    },
    // 打开编辑按钮对话框
    edit(id) {
      brandEdit({id: id}).then(response => {
        console.log(response)
        if (response.status === 20000) {
          this.editDialogVisible = true
          this.editForm = response.data
          this.logoList = [
            {
              id: response.data.logo_id,
              url: this.host + response.data.getimg.url,
            }
          ]
        }
      })
    },
    // 提交编辑数据
    update() {
      this.$refs.editRef.validate(valid => {
        if (valid) {
          brandUpdate(this.editForm).then(response => {
            if (response.status === 20000) {
              this.$base.message({message: response.message})
              this.editDialogVisible = false
              this.$emit('getList')
            }
          })
        }
      })
    },
    // 监听编辑对话框的关闭事件
    editDialogClose() {
      this.editForm = {
        id: "",
        name: "",
        desc: "",
        is_hot: 0,
        cat_id: null,
        logo_id: 0,
      }
      this.editValue = []
      this.$refs.editRef.resetFields()
    },

    async remoteMethod(value) {
      this.OptionLoading = true
      getcate({name: value}).then(response => {
        if (response.status === 20000) {
          console.log(response)
          this.addOption = response.data
        }
        this.OptionLoading = false
      })
    },
    // 图片上传回调
    logoConfirmImsge(res) {
      this.editForm.logo_id = res[0].id
    },
  },
  components: {
    "s-file-image": sFileImage
  },
}
</script>

<style scoped>

</style>
