<template>
  <div class="test">
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="visible"
      @close="onClose"
      width="40%"
    >
      <el-form ref="form" :rules="rules" :model="formData" style="margin-top:10px;padding:20px 30px 0 10px;">
        <el-form-item label="标签选择" prop="tag_ids" label-width="100px">
          <el-select
            style="width: 100%"
            filterable
            clearable
            multiple
            collapse-tags
            @change="chooseTag"
            v-model="formData.tag_ids"
            placeholder="请选择标签选择"
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-tag
            @close="delSelectedTag(item,i)"
            style="margin: 0 10px;"
            v-for="(item,i) in tags"
            :key="item.name"
            closable
            type="info">
            {{item.name}}
          </el-tag>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchMaterial,
  multipleTagAction
} from "@/api/admin/viedo";
export default {
  data() {
    return {
      title: "",
      visible: false,
      formData: {
        // 下拉框选中的标签ids
        tag_ids:[]
      },
      rules: {
        tag_ids:[
          { required: true, message:"请输入标签选择", trigger: "blur" },
        ],
      },
      // 标签下拉选项
      tagOptions: [],
      // 已选标签展示
      tags: [],
      // 已选下拉框标签ids
      currentTagIds:[],
      queryParams: {
        page: 1,
        limit: 500,
        search_value:''
      },
      // 当前被移除的标签id
      currentDeletedId:'',
      // 当前弹框
      currentDialog:'',
      // 当前操作的列表项id
      tableSelectedIds:[]
    };
  },
  watch:{
    // 监听下拉框已选标签
    'formData.tag_ids':{
      deep: true,
      handler:function(newV, oldV){
        if(newV){
          this.formData.tag_ids = newV;
        }
      }
    }
  },

  methods: {
    init(data, type) {
      this.visible = true;
      // 重置下展示的标签
      this.tags = [];
      // 当前列表项选中的ids
      const ids = data.map(item => item.id);
      this.tableSelectedIds = ids;
      if(type === 'add'){
        this.title = '请选择添加的标签';
        this.currentDialog = 'add';
      }else if(type === 'del'){
        this.title = '请选择删除的标签';
        this.currentDialog = 'del';
      }
      this.getTagSelectList();
    },
    // 获取标签下拉框数据
    getTagSelectList(){
      searchMaterial(this.queryParams).then(res=>{
        var searchOptions = res.data.list || [];
        this.tagOptions = searchOptions.map(item=>{
          return {
            id: item.id,
            name: item.name
          }
        })
      })
    },
    // 选中标签
    chooseTag(val){
      //选中的标签ids
      this.currentTagIds = val;
      // 当有已选标签时，过滤出当前已选项
      this.tags = this.tagOptions.filter(item=>{
        return this.currentTagIds.indexOf(item.id)!= -1;
      })
    },
    // 删除标签
    delSelectedTag(item,index){
      // 当前被删除的标签id
      this.currentDeletedId = item.id;
      const result = this.formData.tag_ids.filter(item => item != this.currentDeletedId);
      this.formData.tag_ids = result;
      const tags_result = this.tags.filter(item => item.id != this.currentDeletedId);
      this.tags.splice(index,1);
      this.tags = tags_result;
      this.$message.success('删除标签成功');
    },
    onClose() {
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.formData = {};
      this.visible = false;
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 接口请求入参
          const params = {
            // 列表选中项ids
            ids: this.tableSelectedIds,
            // 批量+-类型--1新增 2删除
            type: this.currentDialog == 'add' ? 1 : 2,
            // 批量+-后剩下的标签ids
            tag_ids: this.formData.tag_ids
          }

          // 因为批量+-素材标签用的同一个接口，所以此处不做当前表单的判断
          multipleTagAction(params).then(res=>{
            if(res.status === 20000){
              this.$message.success('操作成功')
            }
          })
          this.$emit("success");
          this.onClose();
        }
      });
    },
  },
};
</script>
