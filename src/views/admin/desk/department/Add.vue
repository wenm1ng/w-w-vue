<template>
  <el-dialog :title="showTitle" :visible.sync="addDialogVisible" width="40%" @close="addDialogClose">
    <!-- 主体区 -->
    <el-form label-width="100px" :model="addForm" :rules="addRules" ref="addRef">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名字" maxlength="20" clearable show-word-limit v-model="addForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="desc" v-show="false">
        <el-input placeholder="desc" maxlength="20" clearable show-word-limit v-model="addForm.name"
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="addDialogVisible = false">取 消</el-button>
        <el-button v-if="!is_edit" v-waves type="primary" @click="add()">确 定</el-button>
        <el-button v-else v-waves type="primary" @click="edit()">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import {departmentStore, departmentUpdate} from "@/api/admin/department";

export default {
  name: "Add",
  props: ['params'],
  data() {
    return {
      addDialogVisible: false,
      addForm: {
        parant_id: '0',
        name: "",

      },
      addRules: {
        name: [
          {required: true, message: "请输入姓名！", trigger: "blur"},
          {min: 2, max: 20, message: "姓名长度在2到20个字符", trigger: "blur"}
        ],

      },
      addValue: [],
      is_edit: false,
    }
  },
  async created() {
  },
  methods: {
    showDialog(node, is_edit) {
      this.addDialogVisible = true;
      if (is_edit) {
        this.addForm.id = node.id;
        this.addForm.name = node.name;
        this.is_edit = true;
      } else {
        this.addForm.parant_id = node.id;
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClose() {
      this.addForm = {
        parant_id: null,
        name: "",
        id: null,

      }
      this.addValue = []
      this.is_edit = false
      this.$refs.addRef.resetFields()
    },

    // 添加按钮
    add() {
      this.addDialogVisible = true;
      this.$refs.addRef.validate(valid => {
        if (valid) {
          departmentStore(this.addForm).then(response => {
            if (response.status === 20000) {
              this.$base.message({message: response.message})
              this.addDialogVisible = false
              this.$emit('getList')
            }
          })
        }
      })
    },
    edit() {
      this.addDialogVisible = true;
      this.$refs.addRef.validate(valid => {
        if (valid) {
          departmentUpdate(this.addForm).then(response => {
            if (response.status === 20000) {
              this.$base.message({message: response.message})
              this.addDialogVisible = false
              this.$emit('getList')
            }
          })
        }
      })
    },


  },
  components: {},
  computed: {
    showTitle() {
      return this.is_edit ? '编辑' : '添加'
    }
  }
}
</script>

<style scoped>

</style>
