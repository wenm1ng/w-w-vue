<template>
  <div class="container">
    <div class="top-filter">
      <el-form
        :inline="true"
        :model="listQuery"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <template>
              <el-form-item label="关键词">
                <el-input
                  style="width:300px;"
                  clearable
                  prefix-icon="el-icon-search"
                  @change="onLoadData()"
                  v-model.trim="listQuery.search_column"
                  placeholder="文件名/剪辑名/产品名/人物"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="是否成片">
                <el-select
                  style="width:300px;"
                  @change="onLoadData()"
                  clearable
                  v-model="listQuery.category"
                  placeholder="请选择素材or成片"
                >
                  <el-option label="成片" value="1"></el-option>
                  <el-option label="素材" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日期">
                <s-date-picker
                  style="position:relative;top:4px;width:300px;"
                  :showType="showType"
                  :showValueFormat="showValueFormat"
                  @changeDateTime="chooseDate"
                  startPlaceholder="开始操作时间"
                  endPlaceholder="结束操作时间"
                ></s-date-picker>
              </el-form-item>
              <el-form-item class="top-btn">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="onLoadData()">查询</el-button>
                <el-button v-waves class="filter-item" type="info" icon="el-icon-refresh" @click="refresh">重置</el-button>
                <span v-show="!isOpen" class="open-btn" @click="openFilter">展开<i class="el-icon-arrow-down open-icon"></i></span>
                <span v-show="isOpen" class="close-btn" @click="closeFilter">收起<i class="el-icon-arrow-up close-icon"></i></span>
              </el-form-item>
              <template v-if="isOpen">
                <br />
                <el-form-item label="收集渠道">
                  <el-select
                    style="width:300px;"
                    @change="onLoadData()"
                    clearable
                    v-model="listQuery.from_type"
                    placeholder="请选择来源"
                  >
                    <el-option label="网络采集" value="1"></el-option>
                    <el-option label="拍摄（公司原创）" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="文件类型">
                  <el-select
                    style="width:300px;"
                    @change="onLoadData()"
                    clearable
                    v-model="listQuery.type"
                    placeholder="请选择文件类型"
                  >
                    <el-option
                      v-for="item in fileTypeList"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </template>
            <br />
            <template v-if="showFilter" >
              <div style="display:inline-block;">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addMaterial()">
                  添加素材
                </el-button>
                <el-button v-waves class="filter-item" type="success" icon="el-icon-thumb" @click="chooseTag">
                  标签筛选
                </el-button>
                <div style="display:inline-block;" v-show="tags.length">
                  <el-tag effect="dark" type="info" style="margin:0 10px;">已选标签</el-tag>
                  <el-tag @click="clearAllTag">清空</el-tag>
                  <el-tag
                    @close="delSelectedTag(item,i)"
                    style="margin:0 10px;"
                    v-for="(item,i) in tags"
                    :key="item.name"
                    closable
                    :type="item.type">
                    {{item.name}}
                  </el-tag>
                </div>
              </div>
            </template>
            <template v-else >
              <div style="display:inline-block;">
                <el-button type="primary" plain @click="onMultiAddTag( showLb ? selectedItems : checkboxData )">批量添加标签</el-button>
                <el-button type="primary" plain @click="onMultiDelTag( showLb ? selectedItems : checkboxData )">批量删除标签</el-button>
                <el-button type="primary" plain @click="onMultiDelete( showLb ? selectedItems : checkboxData )">批量删除</el-button>
                <el-button type="primary" plain @click="onMultiDownload( showLb ? selectedItems : checkboxData )">批量下载</el-button>
              </div>
            </template>
            <el-form-item style="float: right">
              <div class="rightBtn">
                <div class="iconBtn">
                  <span><i @click="checkBtn(1)" v-bind:class="showLb ? 'el-icon-s-fold showCheck' : 'el-icon-s-fold '"></i></span>
                  <span><i @click="checkBtn(2)" v-bind:class="showKp ? 'el-icon-menu showCheck' : 'el-icon-menu'"></i></span>
                </div>
                <div>
                  <el-button @click="plClick(1)" v-show="showKp & showFilter">批量操作</el-button>
                  <el-button @click="plClick(2)" v-show="showKp & !showFilter">取消操作</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="medium-container">
      <div v-show="showLb">
        <el-table
          class="table-container"
          :data="list"
          style="width: 100%"
          v-loading="loading"
          stripe
          border
          ref="table"
          @selection-change="onTableSelectChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="name" label="文件名" align="center"></el-table-column>
          <el-table-column prop="category" label="素材/成片" align="center">
            <template slot-scope="scope">
              {{ scope.row.category | categoryFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="文件类型" align="center">
            <template slot-scope="scope">
              {{ scope.row.type | formatFileType }}
            </template>
          </el-table-column>
          <el-table-column prop="from_type" label="收集渠道" align="center">
            <template slot-scope="scope">
              {{ scope.row.from_type | fromTypeFormat }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="素材标签" prop="tags">
            <template #default="{ row }">
              <span v-if="row.tags">
                <div
                  v-for="(item, index) in deleteRepeatArr(row.tags)"
                  :key="index"
                  style="margin-top: 3%"
                >
                  <el-tag v-if="item != ''">
                    {{ item }}
                  </el-tag>
                </div>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="资源库级别" align="center">
            <template slot-scope="scope">
              {{ scope.row.level | levelFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="download_num" label="下载量" align="center"></el-table-column>
          <el-table-column prop="created_at" label="上传时间" align="center"></el-table-column>
          <el-table-column width="160" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-waves type="primary" size="mini" @click="editMaterial(scope.row)">
                编辑
              </el-button>
              <el-button v-waves size="mini" type="success" @click="deleteMaterial(scope.row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="showKp" class="card-container">
        <input
          type="checkbox"
          name="nodeAll"
          id="btn1"
          @click="checkeds('nodeStr')"
        /><label style="padding-left: 5px" for="btn1">全选</label>
        <tableCard
          :dataCard="dataCard"
          :showCheckVal="showFilter"
          ref="dataCardTable"
          @clickCard="currentClickCard($event)"
          @editMaterialByCard="editMaterialByCard($event)"
          @cardSelectData="onCardSelectData"
        >
        </tableCard>
      </div>
      <!-- 缩略图-全选按钮 -->
      <div
        class="allBtn"
        style="display: inline-block; width: 120px; padding-top: 19px"
        v-show="showKp & !showFilter"
      >

      </div>
    </div>

    <!-- 添加/编辑-弹框 -->
    <material-dialog ref="materialForm" @success="onLoadData()"/>
    <!-- 标签筛选-弹框 -->
    <filter-tag-dialog ref="filterTag" :tagDeletedIds="lastIds" @success="getSelectedTag($event)"/>
    <!-- 批量添加/删除标签-弹框 -->
    <multiple-tag-dialog ref="multipleTag" @success="onLoadData()"/>
    <!-- 视频/图片预览 -->
    <material-preview-dialog ref="previewMaterial" />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="onLoadData" />
  </div>
</template>

<script>
// 批量下载所需依赖
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import axios from 'axios';

import {
  materialList,
  materialDelete,
  multipleTagDownload
} from "@/api/admin/viedo";
import tableCard from '@/components/tableCard';
import $ from 'jquery';
import materialDialog from './components/materialDialog.vue';
import filterTagDialog from './components/filterTagDialog.vue';
import multipleTagDialog from './components/multipleTagDialog.vue';
import materialPreviewDialog from './components/materialPreviewDialog.vue';

const getFile = url => {
    return new Promise((resolve, reject) => {
        axios({
            method:'get',
            url,
            responseType: 'arraybuffer'
        }).then(data => {
            resolve(data.data)
        }).catch(error => {
            reject(error.toString())
        })
    })
}
export default {
  data() {
    return {
      // 展示/收起
      isOpen: false,
      // 日期选择器显示类型及格式
      showType:'daterange',
      showValueFormat:'yyyy-MM-dd',
      // 显示筛选栏
      showFilter: true,
      // 列表形式
      showLb: true,
      // 卡片-缩略图形式
      showKp: false,
      checkboxData: [],
      total: 0,
      loading: false,
      checkList: [],
      checkListItem: [],
      // 列表查询参数
      listQuery: {
        // 关键词查询
        search_column: '',
        // 是否成片
        category: "",
        // 收集渠道
        from_type: "",
        // 文件类型-1视频 2图片 3标题 0其他
        type: "",
        // 搜索日期
        created_at: [],
        page: 1,
        limit: 10,
        // 已选标签id
        tag_ids:[]
      },
      // 文件类型
      fileTypeList: [
        {
          value: "1",
          label: "视频",
        },
        {
          value: "2",
          label: "图片",
        },
        {
          value: "3",
          label: "标题",
        },
        {
          value: "0",
          label: "其他",
        },
      ],
      // 列表形式
      list:[],
      // 缩略图形式
      dataCard:[],
      // 是否显示已选标签
      showTag: false,
      // 已选标签
      tags: [],
      // 当前删剩下的标签id数组
      lastIds:[],
    };
  },
  components:{
    tableCard,
    materialDialog,
    filterTagDialog,
    multipleTagDialog,
    materialPreviewDialog
  },
  async created () {
    await this.onLoadData();
  },
  filters:{
    // 文件类型
    formatFileType(val){
      const obj = {
        1: '视频',
        2: '图片',
        3: '标题',
        4: '其他'
      }
      return obj[val];
    },
    // 素材文件
    categoryFormat(val){
      const obj = {
        1: '成片',
        2: '素材'
      }
      return obj[val];
    },
    // 收集渠道
    fromTypeFormat(val){
      const obj = {
        1: '网络采集',
        2: '拍摄（公司原创）'
      }
      return obj[val];
    },
    // 资源库级别
    levelFormat(val){
      const obj = {
        1: '1级',
        2: '2级',
        3: '3级',
        4: '4级',
        5: '5级'
      }
      return obj[val];
    }
  },
  methods: {
    // 清空所有标签
    clearAllTag(){
      this.lastIds = [];
      this.tags = [];
      this.listQuery.tag_ids = [];
      this.$message.success('清空标签成功');
      this.onLoadData();
    },
    // 删除已选标签
    delSelectedTag(item,index){
      // 当前被删除的标签id
      let deletedId = item.id;
      // 删除后的标签id数组
      this.lastIds =  this.listQuery.tag_ids.filter(item => item != deletedId);
      console.log('lastIds--');
      console.log(this.lastIds);
      this.tags.splice(index,1);
      this.listQuery.tag_ids = this.lastIds;
      this.$message.success('删除标签成功');
      this.onLoadData();
    },
    // 展示
    openFilter(){
      this.isOpen = true;
    },
    // 收起
    closeFilter(){
      this.isOpen = false;
    },
    // 日期选择
    chooseDate(val){
      console.log('日期选择');
      console.log(val);
      this.listQuery.created_at = val;
      this.onLoadData();
    },
    // 列表模式-修改素材
    editMaterial(row){
      this.$refs.materialForm.init(row);
    },
    // 缩略图模式-修改素材
    editMaterialByCard(row){
      this.$refs.materialForm.init(row);
    },
    // 缩略图模式-点击卡片
    currentClickCard(row){
      // this.$message.warning('该功能开发中...');
      // console.log('缩略图模式-点击卡片');
      // console.log(row);
      this.$refs.previewMaterial.init(row);
    },
    // 删除素材
    deleteMaterial(id){
      const ids = [];
      ids.push(id);
      this.$base.confirm(
        { content: "确定删除吗！" },
        () => {
          materialDelete({ id:ids }).then(res=>{
            this.$base.message({ message: res.message })
            this.onLoadData();
          })
        }
      )
    },
    //全选
    checkeds(val) {
      // this.$emit('checkedss',val)
      let nodeAll = document.getElementsByName("nodeAll");
      this.$refs.dataCardTable.checkedss(nodeAll[0].checked);
    },
    // 卡片选中项
    onCardSelectData(selection) {
      this.checkboxData = selection;
    },
    // 加载列表数据
    onLoadData() {
      this.reset();
      this.loading = true;
      materialList(this.listQuery).then(res => {
        console.log(res);
        if(res.status === 20000){
          this.list = res.data.list || [];
          this.dataCard = res.data.list || [];
          this.total = res.data.total || 0;
        }
        this.loading = false;
      })
    },
    // 重置
    reset() {
      if (this.$refs.dataCardTable) {
        this.$refs.dataCardTable.checkList = [];
        this.$refs.dataCardTable.checkListItem = [];
      }
      $("input[name='nodeAll']").prop("checked", false);
      // let nodeAll = document.getElementsByName("nodeAll");
      // nodeAll.checked = false;
      this.selectedItems = [];
      this.showFilter = true;
    },
    // 列表搜索项重置
    refresh(){
      this.listQuery = {
        // 关键词查询
        search_column: '',
        // 是否成片
        category: "",
        // 收集渠道
        from_type: "",
        // 文件类型-1视频 2图片 3标题 0其他
        type: "",
        // 搜索日期
        created_at: [],
        page: 1,
        limit: 10,
        // 已选标签id
        tag_ids:[]
      }
      console.log(this.listQuery.created_at);
      this.listQuery.created_at = [];
      this.onLoadData();
    },
    // 选择日期
    onChangeDateRange(val) {
      if (val && val.length > 0) {
        this.$set(this.listQuery, "startTime", val[0]);
        this.$set(this.listQuery, "endTime", val[1]);
      }
      if (!val) {
        this.$set(this.listQuery, "startTime", undefined);
        this.$set(this.listQuery, "endTime", undefined);
      }
      this.onLoadData();
    },
    //点击一次选中，再点击一次取消选中
    checked(item) {
      if (this.checkList.indexOf(item.id) > -1) {
        let index = this.checkList.indexOf(item.id);
        this.checkList.splice(index, 1);
        this.checkListItem.splice(index, 1);
      } else {
        this.checkList.push(item.id);
        this.checkListItem.push(item)
      }
      // console.log("勾选数据",this.checkListItem)
    },
    // 列表选中项
    onTableSelectChange(selection) {
      this.selectedItems = selection;
      this.showFilter = selection.length === 0;
    },
    // 缩略图/列表切换
    checkBtn(val) {
      if (val == 1) {
        this.showLb = true;
        this.showKp = false;
        this.showFilter = true;
        this.selectedItems = [];
      } else {
        this.showLb = false;
        this.showKp = true;
        this.showFilter = true;
        this.selectedItems = [];
      }
      this.onLoadData();
    },
    // 批量操作btn
    plClick(val) {
      if (val == 1) {
        this.showFilter = false;
      } else {
        // this.showFilter = true;
        this.reset();
      }
    },
    // 添加素材
    addMaterial(){
      this.$refs.materialForm.init();
    },
    // 筛选素材
    chooseTag(){
      this.$refs.filterTag.init();
    },
    // 已选中标签
    getSelectedTag(val){
      const newTags = val.map(item=>{
        return {
          id: item.id,
          name: item.name,
          type: 'info'
        }
      })
      this.tags = newTags;
      // 当前选中的标签id数组
      this.listQuery.tag_ids = this.tags.map(item => item.id);
      this.onLoadData();
      this.lastIds = this.listQuery.tag_ids;
    },
    // 批量添加标签
    onMultiAddTag(rows){
      console.log('批量添加-rows');
      console.log(rows);
      this.$refs.multipleTag.init(rows, 'add');
    },
    // 批量删除标签
    onMultiDelTag(rows){
      this.$refs.multipleTag.init(rows, 'del');
    },
    // 批量删除
    onMultiDelete(rows){
      const ids = rows.map(item => item.id);
      this.$base.confirm(
        { content: "确定删除吗！" },
        () => {
          materialDelete({ id:ids }).then(res=>{
            console.log(res);
            this.$base.message({ message: res.message })
            this.onLoadData();
          })
        }
      )
    },
    // 批量下载
    onMultiDownload(rows) {
      console.log(rows);
      var arrImages = [];
      arrImages = rows.map(item =>{
        return {
          fileUrl: item.url,
          renameFileName: item.file_name
        }
      })

      // var arrImages=[]
      // //得到对应的url和文件名，存入数组
      // arrImages.push({fileUrl:fileUrl,renameFileName:renameFileName})

      // 准备文件打包
      // arrImages:文件list:[{fileUrl:文件url,renameFileName:文件名}]
      //  * filename 压缩包名
      const fileName = '拟个压缩包名';
      this.filesToRar(arrImages, fileName);

      // this.$message.warning('该功能开发中...');
      // console.log('准备批量下载');
      const ids = rows.map(item => item.id);
      console.log(ids);
      // 调接口-统计下载次数
      multipleTagDownload({ids: ids}).then(res=>{
        console.log(res);
        this.$base.message({ message: res.message })
        this.onLoadData();
      })
    },
    // 文件打包
    filesToRar(arrImages, filename) {
        let _this = this;
        let zip = new JSZip();
        let cache = {};
        let promises = [];
        _this.title = '正在加载压缩文件';
        const loading = this.$loading({
            lock: true,
            text: '正在加载压缩文件',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        for (let item of arrImages) {
            const promise = getFile(item.fileUrl).then(data => { // 下载文件, 并存成ArrayBuffer对象
                const file_name = item.renameFileName // 获取文件名
                zip.file(file_name, data, { binary: true }) // 逐个添加文件
                cache[file_name] = data
            })
            promises.push(promise);
        }
        Promise.all(promises).then(() => {
            zip.generateAsync({ type: "blob" }).then(content => {
                _this.title = '正在压缩';
                // 生成二进制流
                FileSaver.saveAs(content, filename); // 利用file-saver保存文件  自定义文件名
                _this.title = '压缩完成';
            });
                loading.close();
        }).catch(res=>{
            _this.$message.error('文件压缩失败');
            loading.close();
        });
    },
    // 列表显示的标签去重
    deleteRepeatArr(arr){
      // .new Set方法，返回是一个类数组，需要结合 ...运算符，转成真实数组
      return ([...new Set(arr)])
    // }
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  .top-filter {
    .top-btn {
      // margin:45px 0 0 50px;
      margin-left: 50px;
      .open-btn {
        display:inline-block;
        margin-left: 15px;
        color:#1890ff;
        font-size: 14px;
        cursor: pointer;
      }
      .open-icon {
        font-size: 15px;
        width: 18px;
        height: 18px;
        line-height: 18px;
        color:#1890ff;
        margin-left: 5px;
      }

      .close-btn {
        display:inline-block;
        margin-left: 15px;
        color:#1890ff;
        font-size: 14px;
        cursor: pointer;
      }
      .close-icon {
        font-size: 15px;
        width: 18px;
        height: 18px;
        line-height: 18px;
        color:#1890ff;
        margin-left: 5px;
      }
    }
    .rightBtn {
      display: inline-flex;
      float: right;
      margin-left: auto;

      .iconBtn {
        display: inline-block;
        margin-right: 9px;

        i {
          font-size: 26px;
          border: 1px solid #c0c4cc;
          padding: 6px 11px;
          color: #ccc;
          cursor: pointer;
        }

        i:hover {
          color: #409eff;
        }

        i.showCheck {
          color: #409eff;
        }
      }
    }
  }

  .medium-container {

  }
}
</style>
