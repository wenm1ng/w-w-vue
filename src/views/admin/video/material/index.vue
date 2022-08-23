<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        class="filter-item"
        v-model.trim="listQuery.name"
        clearable
        placeholder="请输入产品名称"
        style="width: 200px"
        @change="handleFilter"
      ></el-input>
      <el-input
        class="filter-item"
        v-model.trim="listQuery.origin_url"
        clearable
        placeholder="请输入原路径"
        style="width: 200px"
        @change="handleFilter"
      ></el-input>
      <el-select
        v-model="listQuery.type"
        placeholder="请输入类型"
        clearable
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option label="视频" value="1"></el-option>
        <el-option label="图片" value="2"></el-option>
      </el-select>
      <s-date-picker
        @changeDateTime="eventStartTime"
        startPlaceholder="开始操作时间"
        endPlaceholder="结束操作时间"
      ></s-date-picker>
      <!-- 顶部搜索框组件 -->
      <div>
        <PullScroll
          :currentFather="currentFatherName"
          :default-selected="lot.lotId"
          :default-selected-str="lotStr"
          :fetch-method="getAssetsList"
          :fetch-format="fetchFormat"
          :fetch-params="fetchParams"
          :multiple="true"
          search-key="lotName"
          @selectedAsset="selectedValue"
        />
      </div>
      <el-row>
        <el-button
          v-waves
          icon="el-icon-search"
          class="filter-item"
          type="primary"
          @click="getList()"
        >
          查询
        </el-button>
        <el-button
          v-waves
          class="filter-item"
          type="warning"
          icon="el-icon-edit"
          @click="addMaterial"
        >
          添加
        </el-button>
        <el-button
          v-waves
          class="filter-item"
          type="danger"
          icon="el-icon-delete-solid"
          :disabled="multipleSelection.length === 0"
          @click="deleteMaterial"
        >
          删除
        </el-button>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          :disabled="multiple.length === 0"
          @click="operationLogDestroy"
        >
          下载
        </el-button>
      </el-row>
    </div>
    <div class="fix-fliter">
      <div class="ol" v-loading="listLoading">
        <div
          class="li"
          v-for="item in list"
          :key="item.url"
          @selection-change="handleSelectionChange"
        >
          <div class="img">
            <a target="_blank" @click="handlePictureCardPreview(item)">
              <img v-if="item.type === 2" :src="item.url" />
              <video v-else :src="item.url" type="video/mp4"></video>
            </a>
            <div class="checkbox">
              <el-checkbox-group
                v-model="currentChecked"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox :label="item">
                  <br />
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="name">
            <div>{{ item.name }}</div>
            <span>
              <el-button
                @click="editMaterial(item.id)"
                class="button"
                size="mini"
              >
                编辑
              </el-button>
            </span>
          </div>
          <div class="tag_list">
            <el-tag
              class="tag"
              type="info"
              v-for="val in item.tags"
              :key="val"
              >{{ val }}</el-tag
            >
          </div>
        </div>
      </div>
      <el-pagination
        style="margin-top: 20px"
        background
        @size-change="handle_size_change"
        @current-change="handle_current_change"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit"
      ></el-pagination>
      <!-- 添加/编辑对话框 -->
      <el-dialog
        :title="materialTitle"
        :visible.sync="fileFormDialog"
        :close-on-click-modal="false"
        width="40%"
        :before-close="handleClose"
      >
        <el-form label-width="100px" :model="form" :rules="rules" ref="form">
          <el-form-item label="产品名称" prop="name">
            <el-input
              v-model="form.name"
              style="width: 100%"
              placeholder="请输入产品名称"
              maxlength="50"
              clearable
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="文案" prop="remark">
            <el-input
              v-model="form.remark"
              style="width: 100%"
              placeholder="请输入文案"
              maxlength="50"
              clearable
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="标签" prop="tag_ids">
            <PullScroll
              :currentFather="currentFatherName"
              :default-selected="form.tag_ids"
              :default-selected-str="lotStr"
              :fetch-method="getAssetsList"
              :fetch-format="fetchFormat"
              :fetch-params="fetchParams"
              :multiple="true"
              search-key="lotName"
              @selectedAsset="chooseFormTagVal"  />
          </el-form-item>
          <el-form-item label="文件资源">
            <div>
              <!-- 上传缩略图显示 -->
              <el-upload
                :before-upload="beforeUpload"
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :http-request="uploadFile"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="uploadFileList"
              >
                <el-button
                  size="small"
                  type="primary"
                  v-show="!uploadFileList.length"
                  >点击上传</el-button
                >
              </el-upload>
              <el-form-item label="" v-if="showFileProgress">
                <el-progress type="line" :percentage="progressPercent" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" @click="resetForm('form')">重置</el-button>
          <el-button v-waves type="primary" @click="save('form')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 图片/视频预览 -->
      <el-dialog
        :close-on-click-modal="false"
        :title="filePreviewType === 1 ? '视频预览' : '图片预览' "
        :visible.sync="filePreviewVisible"
        width="30%"
        :append-to-body="true"
        @close="filePreviewClose"
      >
        <video
          v-if="filePreviewType === 1"
          :src="form.url"
          class="image_dialog"
          controls="controls"
          key="menuKey"
          style="width: 100%; height: 422px"
        >
          <source :src="form.url" type="video/mp4" />
        </video>
        <img
          v-else
          :src="form.url"
          class="image_dialog"
          style="width: 100%; height: 422px"
        />
      </el-dialog>
    </div>
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
import PullScroll from "@/components/PullScroll";

import { downloadfile } from "@/utils/fileExport.js";
export default {
  components: {
    PullScroll,
  },
  data() {
    return {
      // 当前使用子组件的父组件
      currentFatherName: "materialIndex",
      // 总数据数
      total: 0,
      // 添加素材前木有id
      hasId: "",
      // 上传文件列表
      uploadFileList: [],
      // 添加/编辑 弹框标题
      materialTitle: "",
      // 预览文件弹框-视频/图片
      filePreviewVisible: false,
      // 进度条百分比值
      progressPercent: 0,
      // 显示文件进度条
      showFileProgress: false,
      // 列表数据
      list: [],
      // 列表loading
      listLoading: true,
      currentChecked: [],
      multipleSelection: [],
      multiple: [],
      // 标签
      tags: [],
      // 文件预览类型
      filePreviewType: null,
      // 列表分页参数
      listQuery: {
        page: 1,
        limit: 20,
        name: "",
        created_at: "",
        origin_url: '',
        type: "",
        tag_ids: [],
      },
      // 添加/编辑表单入参
      form: {
        name: "",
        remark: "",
        type: null, // 1视频 2图片
        url: "",
        tag_ids: [],
        // 文件上传需要参数
        file_md5: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
        remark: [
          { required: true, message: "请输入文案", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
        tag_ids: [
          { required: true, message: "请选择标签名称", trigger: "change" },
        ],
        tag_ids: [
          { required: true, message: "请选择标签名称", trigger: "change" },
        ],
      },
      // 添加/编辑-表单弹框
      fileFormDialog: false,
      // 默认输入框设置的值
      defaultInputArr: [],
      // 搜索框下拉懒加载部分
      lot: {
        lotId: [], //选中的数据
      },
      lotStr: [], // 用于回显
      fetchFormat: (list = []) => {
        //  下拉框数据格式
        return list.map(({ lotName, lotId }) => ({
          label: lotName,
          value: lotId,
        }));
      },
      getAssetsList: searchMaterial,
      //  部分接口参数 其余参数在上面封装的组件内
      fetchParams:{
        page: 1,
        limit: 500,
      },
    };
  },
  async created() {
    await this.getList();
  },
  methods: {
    // 表格列表搜索
    handleFilter() {
      this.listQuery.page = 1;
      this.getList()
    },
    //外层搜索框选中的标签
    selectedValue(val){
      this.listQuery.tag_ids = val;
      this.getList();
    },
    // 内层表单-下拉框选中的标签
    chooseFormTagVal(val){
      this.form.tag_ids = val;
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
      var videolist = ["mp4", "m2v", "mkv"];
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
    // 文件移除操作
    handleRemove(file, fileList) {
      // 没有文件时隐藏进度条
      if (!fileList.length) {
        this.showFileProgress = false;
      }
      let resultArr = this.uploadFileList.filter((item) => {
        return item.url === file.url;
      });
      const url = resultArr[0].url;
      if (!this.hasId) {
        //当前是添加才能删除文件资源
        this.$nextTick(() => {
          deleteFileUrl({ url: url }).then((res) => {
            if (res.status === 20000) {
              this.$base.message({ message: res.message });
              this.form.url = "";
              this.uploadFileList = [];
            }
          });
        });
      }
    },
    // 文件限制
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制只能选择 ${fileList.length} 个文件`);
    },
    // 移除前
    beforeRemove(file) {
      // 编辑表单时，禁止删除文件资源（仅在添加表单时可删）
      if (this.hasId) {
        return false;
      } else {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    // 上传前
    beforeUpload(file) {
      this.progressPercent = 0;
      this.showFileProgress = true;
      let fd = new FormData();
      fd.append("file", file);
      let onUploadProgress = (progressEvent) => {
        //progressEvent.loaded:已上传文件大小
        //progressEvent.total:被上传文件的总大小
        let complete =
          (progressEvent.loaded / progressEvent.total).toFixed(2) * 100;
        this.progressPercent = complete;
      };
    },
    // 获取表格列表
    async getList() {
      this.listLoading = true;
      materialList(this.listQuery).then((res) => {
        if (res.status === 20000) {
          this.list = res.data.list;
          this.total = res.data.total;
        }
        this.listLoading = false;
      });
    },
    // 添加素材框-open
    addMaterial() {
      this.hasId = "";
      this.materialTitle = "添加素材";
      this.fileFormDialog = true;
      this.uploadFileList = [];
      // 添加/编辑表单入参
      (this.form = {
        name: "",
        remark: "",
        type: null, // 1视频 2图片
        url: "",
        tag_ids: [],
        // 文件上传需要参数
        file_md5: "",
      }),
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });
      if (!this.uploadFileList.length) {
        this.showFileProgress = false;
      }
    },
    // 编辑素材框-open
    editMaterial(id) {
      this.hasId = id;
      this.materialTitle = "编辑素材";
      this.fileFormDialog = true;
      materialInfo({ id: id }).then((res) => {
        if (res.status === 20000) {
          this.form = res.data;
          const obj = {};
          obj.name = res.data.name;
          obj.url = res.data.url;
          this.uploadFileList = [];
          this.uploadFileList.push(obj);
        }
      });
    },
    //添加/编辑素材-submit
    save(form) {
      this.$refs[form].validate((valid) => {
        if (valid && !this.form.url) {
          return this.$message.error("请选择文件资源！");
        }
        if (valid && this.hasId) {
          //编辑
          materialUpdate(this.form).then((res) => {
            if (res.status === 20000) {
              this.$base.message({ message: res.message });
              this.fileFormDialog = false;
              this.getList();
            }
            this.getList();
          });
        } else if (valid && !this.hasId) {
          //新增
          materiaAdd(this.form).then((res) => {
            if (res.status === 20000) {
              this.$base.message({ message: res.message });
              this.fileFormDialog = false;
              this.getList();
            }
          });
        }
      });
    },
    // 选中项
    handleCheckedCitiesChange(item) {
      this.multipleSelection = item;
      this.multiple = item;
    },

    // 删除素材
    deleteMaterial() {
      this.$base.confirm({ content: "确定要删除所选项吗？" }, () => {
        const ids = this.multipleSelection.map((item) => item.id);
        materialDelete({ id: ids }).then((res) => {
          if (res.status === 20000) {
            this.$base.message({ message: res.message });
            this.getList();
            this.currentChecked = [];
            this.multipleSelection = []; //需要将删除为空时置空
          }
        });
      });
    },
    //下载
    operationLogDestroy() {
      if (this.multiple.length <= 0) {
        this.$base.message({ message: "请选择需要下载的选项！" });
        return;
      } else {
        this.multiple.map(async (item) => {
          //路径写死了，实际是item.url
          await downloadfile(item.url, item.name);
          this.currentChecked = [];
          this.multiple = ""; //需要将下载为空时置空
        });
      }
    },
    // 重置表单
    resetForm(form) {
      this.uploadFileList = [];
      this.form = {};
      this.$refs[form].resetFields();
    },
    // 文件上传
    uploadFile(params) {
      this.progressPercent = 0;
      this.progressFlag = true;
      const _file = params.file;
      const formData = new FormData();
      formData.append("file", _file);
      let onUploadProgress = (progressEvent) => {
        //progressEvent.loaded:已上传文件大小
        //progressEvent.total:被上传文件的总大小
        let complete =
          (progressEvent.loaded / progressEvent.total).toFixed(2) * 100;
        this.progressPercent = complete;
      };

      console.log(formData);
      uploadImagePrograss(formData, onUploadProgress).then((res) => {
        if (res.status === 20000) {
          this.uploadFileList = [];
          this.uploadFileList.push({
            id: res.data.image_id,
            name: params.file.name,
            url: res.data.url,
          });
          // console.log(this.uploadFileList);
          // 获取服务返回的资源url
          this.form.url = res.data.url;
          this.form.file_md5 = res.data.file_md5;
          const fileType = this.matchFileType(this.form.url);
          if (fileType === "image") {
            this.form.type = 2;
          } else if (fileType === "video") {
            this.form.type = 1;
          }
        }
      });
    },
    // 根据文件类型进行预览
    handlePictureCardPreview(item) {
      this.form.url = item.url;
      this.filePreviewType = item.type;
      this.filePreviewVisible = true;
    },
    // 关闭图片or视频预览框
    filePreviewClose() {
      this.filePreviewVisible = false;
    },
    // 时间选择
    eventStartTime(val) {
      console.log(val);
      this.listQuery.created_at = val;
      this.handleFilter();
    },
    // 勾选项
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multiple = val;
    },
    // 添加or编辑弹框关闭
    handleClose() {
      this.fileFormDialog = false;
      this.form = {};
      this.$refs.form.resetFields();
    },
    // 当前每页多少条选择
    handle_size_change(pageSize) {
      this.listQuery.limit = pageSize;
      this.list = [];
      this.getList();
    },
    // 当前页码
    handle_current_change(page) {
      this.listQuery.page = page;
      this.list = [];
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.videoBox {
  width: 150px;
  height: 150px;
  position: relative;
  .operation {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #009688;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    cursor: pointer;
  }
}
.imageBox {
  width: 150px;
  height: 150px;
  position: relative;
  .operation {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #009688;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    cursor: pointer;
  }
}
.block {
  position: relative;
  display: inline-block;
}
.el-row {
  padding-top: 8px;
}
.fix-fliter {
  width: 100%;

  .ol {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    // border: 1px solid papayawhip;
  }

  .ol > .li {
    list-style-type: none;
    width: 200px;
    // height: 198px;
    position: relative;
    // border: 1px solid palevioletred;
  }
  .ol > .li:hover {
    background: rgba(236, 238, 237, 0.884);
  }
  .ol > .li:hover .button {
    display: inline;
    z-index: 1;
  }

  .tag_list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .tag {
    // width: 78px;
    // height: 24px;
    // line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .checkbox {
    position: absolute;
    top: 0px;
    left: 2px;
    // display: none;
  }
  .button {
    display: none;
    position: relative;
    left: 105px;
    top: -30px;
  }
  a {
    display: inline-block;
    width: 128px;
    height: 126px;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  video {
    object-fit: fill;
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  .name {
    height: 34px;
    font-size: 13px;
    line-height: 28px;
    font-family: "微软雅黑";
    color: rgb(88, 86, 86);
  }
  .name > div:nth-child(1) {
    width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

