<template>
  <div class="material-form">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="isVisible"
      width="35%"
      @close="handleCancel"
    >
      <el-form style="padding:0 30px;" ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="文件名" prop="name" v-if="showFileNameInput">
          <el-input
            v-model="form.name"
            maxlength="8"
            placeholder="请输入文件名"
          ></el-input>
        </el-form-item>
        <el-form-item label="素材或成片" prop="category">
          <el-select
            style="width: 100%"
            filterable
            clearable
            v-model="form.category"
            placeholder="请选择素材或成片"
          >
            <el-option label="成片" value="1"></el-option>
            <el-option label="素材" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收集渠道" prop="from_type">
          <el-select
            style="width: 100%"
            filterable
            clearable
            v-model="form.from_type"
            placeholder="请选择收集渠道"
          >
            <el-option label="网络采集" value="1"></el-option>
            <el-option label="拍摄（公司原创）" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名字" prop="product_name">
          <el-input
            v-model="form.product_name"
            maxlength="8"
            placeholder="请输入文件名"
          ></el-input>
        </el-form-item>
        <el-form-item label="资源库级别" prop="level">
          <el-select
            style="width: 100%"
            filterable
            clearable
            v-model="form.level"
            placeholder="请选择资源库级别"
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签选择" prop="tag_ids">
          <el-select
            v-loading="tagLoading"
            style="width: 100%"
            filterable
            clearable
            multiple
            v-model="form.tag_ids"
            placeholder="请选择标签选择"
            @change="selectOptions"
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="!isEdit ? '资源上传': '文件列表'" :prop="!isEdit ? 'uploadMutiple' : ''" style="position:relative; margin-left:10px;">
          <!-- <el-upload
            ref="upload"
            class="upload-demo"
            :auto-upload="false"
            :on-success="getFiles"
            :on-change="getFiles"
            :file-list="fileList"
            action="#"
            :limit="5"
            drag
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload> -->
          <span class="warn-star" style="position:absolute;left:-110px;" v-if="!isEdit"></span>
          <el-upload
            v-if="!isEdit"
            ref="uploadMutiple"
            action="#"
            :show-file-list="false"
            :multiple="true"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">选择文件上传</el-button>
          </el-upload>
          <el-table :data="uploadFilesList" style="width: 100%">
            <el-table-column prop="name" width="150" :show-overflow-tooltip="true" label="名称">
              <template slot-scope="scope">
                <i style="color:#409EFF" class="el-icon-s-order" />{{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="上传状态" width="150">
              <template slot-scope="scope">
                <template v-if="scope.row.status==='success'">上传成功！</template>
                <template v-else-if="scope.row.status==='error'">上传失败!</template>
                <el-progress v-else :percentage="scope.row.progress" />
              </template>
            </el-table-column>
            <el-table-column width="100" prop="size" label="文件大小" v-if="!isEdit">
              <template slot-scope="scope">
                {{ scope.row.size | conver }}
              </template>
            </el-table-column>
            <el-table-column prop="name" width="180" :show-overflow-tooltip="true" label="操作"  v-if="!isEdit">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="delUploadFile(scope.row)">删除</el-button>
                <!-- <a :href="scope.row.url" class="downloadBtn">
                  <el-button type="primary" size="mini">下载</el-button>
                </a> -->
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <div style="float: right">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  materialList,
  materiaAdd,
  materialInfo,
  materialUpdate,
  materialDelete,
  searchMaterial,
  deleteFileUrl,
} from "@/api/admin/viedo";

import { uploadImagePrograss } from "@/api/admin/image";
export default {
  data() {
    return {
      tagLoading: false,
      isVisible: false,
      title: "新建",
      // // 文件限制最多上传数
      // maxFileCount: 5,
      // 隐藏文件删除下载btn
      hiddenFileBtn: false,
      // 批量上传时隐藏文件名
      showFileName: true,
      // 新建素材-入参
      form: {
        // 文件分辨率
        resolution:'',
        // 视频时长
        duration: 0,
        // 文件名
        name: "",
        // 素材或成片
        category: "1",
        // 收集渠道
        from_type: "1",
        // 产品名字
        product_name: "",
        // 标签选择
        tag_ids:[],
        // 上传文件
        urls:[],
        // 资源库级别
        level: "1",
        // 上传文件类型-1视频 2图片
        type: "",
      },
      // 上传文件
      fileList:[],
      forUpload:[],
      // 进度条百分比值
      progressPercent: 0,
      // 显示文件进度条
      showFileProgress: false,
      // 标签下拉框选项
      tagOptions:[],
      // 资源库级别下拉框
      levelOptions:[
        {
          value: "1",
          label: "1级",
        },
        {
          value: "2",
          label: "2级",
        },{
          value: "3",
          label: "3级",
        },{
          value: "4",
          label: "4级",
        },
        {
          value: "5",
          label: "5级",
        },
      ],
      rules: {
        name: [
          { required: true, message: "请输入文件名", trigger: "blur" },
        ],
        category: [
          {
            required: true,
            message: "请选择素材或成片",
            trigger: "blur",
          },
        ],  
        from_type: [
          {
            required: true,
            message: "请选择收集渠道",
            trigger: "blur",
          },
        ],
        product_name: [
          { required: true, message: "请输入产品名字", trigger: "blur" },
        ],
        tag_ids:[
          { required: true, message:"请输入标签选择", trigger: "blur" },
        ],
        level:[
          { required: true, message:"请选择资源库级别", trigger: "blur" },
        ]
      },
      isEdit: false,
      uploadFilesList:[],
      queryParams: {
        page: 1,
        limit: 500,
        search_value:''
      },
      // 是否显示表单文件名-输入框（上传1个时显示）
      showFileNameInput: true,
      // 编辑表单时获取到的列表项标签
      whenEditTags:[]
    };
  },
  filters: {
    // 文件大小格式化
    conver(limit) {
      if (!limit) return "-";
      var size = "";
      if (limit < 0.1 * 1024) {
        size = limit.toFixed(2) + "B";
      } else if (limit < 0.1 * 1024 * 1024) {
        size = (limit / 1024).toFixed(2) + "KB";
      } else if (limit < 0.1 * 1024 * 1024 * 1024) {
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
      } else {
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }
      var sizestr = size + "";
      var len = sizestr.indexOf(".");
      var dec = sizestr.substr(len + 1, 2);
      if (dec == "00") {
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
      }
      return sizestr;
    },
  },
  watch:{
    // 监听上传的文件
    uploadFilesList(newVal, oldVal){
      // console.log(newVal);
      if(newVal.length < 1 || newVal.length == 1){
        this.showFileNameInput = true;
        if(newVal.length){
          // 截取文件名前缀
          let fileName = newVal[0].name;
          let newFileName = fileName.split('.')[0];
          newVal.length == 1 ? this.form.name = newFileName : this.form.name = '';
          if(newVal.length == 1){
            this.form.name = newFileName;
            const fileType = this.matchFileType(newVal[0].url);
            if(fileType === "image"){
              this.form.type = 2;
            }else if(fileType === "video"){
              this.form.type = 1;
            }
          }else{
            // 批量上传时，文件名置空
            this.form.name = '';
          }
        }
      }else {
        this.showFileNameInput = false;
      }
    }
  },
  methods: {
    // 标签选中值
    selectOptions(val){
      console.log(val);
    },
    // 初始化
    init(data) {
      console.log('初始化窗口');
      console.log(data);
      // 置空上传文件列表
      this.uploadFilesList = [];
      if(data){
        console.log('有数据');
        // this.hiddenFileBtn = true;
        this.form = { ...data };
        this.form.from_type = data.from_type.toString();
        this.form.category = data.category.toString();
        this.form.level = data.level.toString();
        this.form.id = data.id;
        this.form.type = data.type;

        const editUploadUrl = [];
        // this.uploadFilesList = editUploadUrl.push({ url: data.url, progress: 100, status: 'success'});
        editUploadUrl.push({ url: data.url, name: data.name, progress: 100, status: 'success'});
        this.uploadFilesList = editUploadUrl;
        // 获取编辑表单时列表项已绑定的标签
        this.whenEditTags = data.tags;
      }else {
        console.log('没有数据');
        this.form.name = '';
        // this.form.tag_ids = [];
      }
      this.title = data ? "编辑素材" : "新建素材";
      this.isEdit = !!data;
      this.isVisible = true;
      this.getTagSelectList();
    },
    // 获取标签下拉框数据
    getTagSelectList(){
      this.tagLoading = true;
      searchMaterial(this.queryParams).then(res=>{
        if(res.status === 20000){
          var searchOptions = res.data.list || [];
          this.tagOptions = searchOptions.map(item=>{
            return {
              id: item.id,
              name: item.name
            }
          })
          this.tagLoading = false;
  
          // 编辑表单时，获取当前绑定的标签ids
          if(this.isEdit){
            this.tagLoading = true;
            let arr1 = this.whenEditTags;
            let arr2 = this.tagOptions;
            let arr3 = [];
            arr1.forEach(item =>{
              arr2.forEach(element =>{
                if(item == element.name){
                  arr3.push(element)
                }
              })
            })
            const editTags = arr3.map(item => item.id);
            this.$set(this.form, 'tag_ids', editTags);
            this.tagLoading = false;
          }
        }
      })
    },
    // 删除已上传文件
    delUploadFile(row){
      deleteFileUrl({ url: row.url }).then((res) => {
        if (res.status === 20000) {
          const resultArr = this.uploadFilesList.filter(item => item.uid != row.uid);
          this.uploadFilesList = resultArr;
          // console.log('最终的文件列表：');
          // console.log(this.uploadFilesList);
          this.$base.message({ message: res.message });
          this.form.name = '';
        }
      });
    },
    // 上传文件后缀名类型判断
    matchFileType(fileName) {
      // 后缀获取
      var suffix = '';
      // 获取类型结果
      var result = '';
      try {
        var flieArr = fileName.split(".");
        suffix = flieArr[flieArr.length - 1];
      } catch (err) {
        suffix = '';
      }
      // fileName无后缀返回 false
      if (!suffix) {
        result = false;
        return result;
      }
      // 图片格式
      var imglist = ["png", "jpg", "jpeg", "bmp", "gif"];
      // 进行图片匹配
      result = imglist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = "image";
        return result;
      }

      // 匹配 视频
      var videolist = ["mp4", "mpeg", "3gp", "avi", "m2v", "mkv"]; //后两个格式到时候问下要不要
      result = videolist.some(function (item) {
        return item == suffix;
      });
      if (result) {
        result = "video";
        return result;
      }
      // 其他 文件类型
      result = "other";
      return result;
    },
    // 上传前
    beforeUpload(file) {
      console.log('beforeUpload');
      console.log(file);
      const fileList = {}
      for(const key in file){
        fileList[key] = file[key]
      }
      console.log('fileList');
      console.log(fileList);
      //  status: uploading、success、error 文件上传状态
      //  progress 文件上传进度
      this.uploadFilesList.push({...fileList, progress: 0, status: 'uploading'})
      console.log('都选c');
      console.log(this.uploadFilesList);
      // 当前限制只能上传5个文件
      if(this.uploadFilesList.length > 5){
        this.uploadFilesList = this.uploadFilesList.slice(0,5);
        return this.$message.warning(`当前限制只能选择 ${this.uploadFilesList.length} 个文件`);
      }
      this.httpRequest(file, params =>{
        this.showProgress(fileList, params)
      })
      // 阻止 el-upload的默认上传
      return false;  
    },
    // 显示进度
    showProgress(file, params){
      const { progress, status } = params
      const arr = [...this.uploadFilesList].map(item => {
        if(item.uid === file.uid){
          item.progress = progress
          item.status = status
        }
        return item;
      })
      this.uploadFilesList = [...arr]

      // console.log('showProgress');
      // console.log(this.uploadFilesList);
    },
    async httpRequest(file, callback){
      // console.log(file);
      // 当上传文件只要1个时，将文件名自动填上
      if(this.uploadFilesList.length === 1){
        this.form.name = file.name;
      }
      const formData = new FormData();
      formData.append('file', file);
      // const params = formData;
      // console.log('httpRequest~');
      let progress = 0;
      let onUploadProgress = (progressEvent) => {
        //progressEvent.loaded:已上传文件大小
        //progressEvent.total:被上传文件的总大小
        progress =
          (progressEvent.loaded / progressEvent.total).toFixed(2) * 100;
        callback({ progress, status: 'uploading' })
      };

      
      uploadImagePrograss(formData, onUploadProgress)
      .then((res)=>{  //成功状态
        console.log(res);

        // const dataArr = [];
        // dataArr.push(...res.data);
        // console.log('dataArr');
        // console.log(dataArr);

        if(res.status === 20000){
          // console.log('上传成功');
          // console.log('成功后的文件：');
          // console.log(this.uploadFilesList);

        // const resultA = [...this.uploadFilesList, ...res.data]
        // console.log('resultA');
        // console.log(resultA);
        const resultArr = this.uploadFilesList.map((item)=>{
          return {
            name: item.name,
            progress: item.progress,
            size: item.size,
            status: item.status,
            type: item.type,
            uid: item.uid,
            file_md5: res.data.file_md5,
            image_id: res.data.image_id,
            url: res.data.url
          }
        })

        console.log(resultArr);

        this.uploadFilesList = resultArr;
        callback({ progress, status: 'success' })
        }
      })
      .catch(() => {  //失败状态
        callback({ progress, status: 'error' })
      })
    },
    // 弹框关闭
    handleCancel() {
      this.$refs.form && this.$refs.form.resetFields();
      this.isVisible = false;
      this.isEdit = false;
      // 关闭弹框后置空已选标签ids
      // this.form.tag_ids = [];
    },
    // 表单提交
    handleSubmit() {
      console.log('点了提交');
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(!this.uploadFilesList.length){
            return this.$message.error('请上传文件！')
          }else if(this.uploadFilesList.length > 1){
            this.form.name = '';
          }
          console.log(this.form);
          this.form.urls = this.uploadFilesList.map(item => {
            return {
              url: item.url,
              file_md5: item.file_md5,
              name: item.name
            }
          })

          // console.log('改造后的form');
          // console.log(this.form);

          if(this.isEdit){
            console.log('准备修改素材');
            // 编辑素材-不需要上传urls-已上传的资源文件
            // 删除urls这个属性
            // 使用ES6 的Reflect.deleteProperty() 移除对象属性
            Reflect.deleteProperty(this.form,'urls')
            const params = {
              // 额外参数
              duration: this.form.duration,
              resolution: this.form.resolution,
              id: this.form.id,
              type: this.form.type,
              name: this.form.name,
              category: this.form.category,
              from_type: this.form.from_type,
              product_name: this.form.product_name,
              level: this.form.level,
              tag_ids: this.form.tag_ids
            } 

            materialUpdate(params).then((res) => {
              if (res.status === 20000) {
                this.$base.message({ message: res.message });
                this.isVisible = false;
                this.$emit('success');
                this.form.tag_ids = [];
              }
            });
          }else {
            const params = {
              // 额外参数
              duration: this.form.duration,
              resolution: this.form.resolution,
              type: this.form.type,
              name: this.form.name,
              category: this.form.category,
              from_type: this.form.from_type,
              product_name: this.form.product_name,
              level: this.form.level,
              tag_ids: this.form.tag_ids,
              urls: this.form.urls
            } 
            //新增素材
            materiaAdd(params).then((res) => {
              if (res.status === 20000) {
                this.$base.message({ message: res.message });
                this.isVisible = false;
                this.$emit('success');
                this.uploadFilesList = [];
              }
            });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.material-form {
  // 加星提醒
  .warn-star::before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
    font-size: 17px;
  }
  .downloadBtn {
    margin-left: 10px;
    text-decoration: none;
    color: #66b1ff;
  }
}
</style>
