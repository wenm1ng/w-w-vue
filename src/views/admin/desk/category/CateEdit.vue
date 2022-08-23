<template>
  <el-dialog title="编辑" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
    <!-- 主体区 -->
    <el-form label-width="100px" :model="editForm" :rules="editRules" ref="editRef">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名称" maxlength="20" clearable show-word-limit v-model="editForm.name"
        ></el-input>
      </el-form-item>

      <el-form-item label="上级分类" prop="parant_id">
        <el-select
          v-model="editForm.parant_id"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="OptionLoading">
          <el-option
            v-for="item in option"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="是否热门" prop="is_hot">
        <el-radio-group v-model="editForm.is_hot" size="medium">
          <el-radio v-for="(item,index) in param.isHotList" :key="index" border :label="index">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否隐藏" prop="is_show">
        <el-radio-group v-model="editForm.is_show" size="medium">
          <el-radio v-for="(item,index) in param.isShowList" :key="index" border :label="index">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>


    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="editDialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="update()">确 定</el-button>
      </span>
  </el-dialog>

</template>

<script>
import {cateEdit, cateStore, cateUpdate} from "@/api/admin/category";
import {getcate} from "@/api/admin/brand";

export default {
  name: "CateEdit",
  props: ['param'],
  data() {
    return {
      editDialogVisible: false,
      editForm: {
        id: "",
        name: "",
        is_hot: 0,
        is_show: 0,
        parant_id: null,
      },
      editRules: {
        name: [
          {required: true, message: "请输入姓名！", trigger: "blur"},
          {min: 2, max: 20, message: "姓名长度在2到20个字符", trigger: "blur"}
        ],
        isShow: [
          {required: true, message: "请输入昵称！", trigger: "blur"}
        ],
      },
      editValue: [],

      //选项
      option: [],
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
    async remoteMethod(value) {
      this.OptionLoading = true
      getcate({name: value}).then(response => {
        if (response.status === 20000) {
          this.option = response.data
        }
        this.OptionLoading = false
      })
    },

    // 打开编辑按钮对话框
    edit(id,row) {
      cateEdit({id: id}).then(response => {
        if (response.status === 20000) {
          this.editDialogVisible = true;
          this.editForm = response.data;

          if (this.editForm.parant_id===0){
            this.editForm.parant_id=null;
          }else{
            this.editForm.parant_id=row.parant_id;
          }
        }
      })
    },
    // 提交编辑数据
    update() {
      this.$refs.editRef.validate(valid => {
        if (valid) {
          cateUpdate(this.editForm).then(response => {
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
        is_hot: 0,
        is_show: 0,
        parant_id: null,
      }
      this.editValue = []
      this.$refs.editRef.resetFields()
    },
  },
  components: {},
}
</script>

<style scoped>

</style>
