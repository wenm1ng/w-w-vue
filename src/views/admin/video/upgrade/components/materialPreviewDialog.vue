<template>
  <div class="test">
    <el-dialog
      :close-on-click-modal="false"
      :title="fileId"
      :visible.sync="visible"
      @close="onClose"
      width="40%"
    >
      <el-card class="box-card">
        <div slot="header" class="">
          <span style="font-size:18px;">素材详情</span>
        </div>
        <div class="material-box">
          <span class="material-title">标题名：</span><span>{{ fileDetail.name }}</span>
          <span class="material-title ml-30">素材或成片：</span><span>{{ fileDetail.category == 1 ? '成片' : '素材' }}</span>
          <br />
          <span class="material-title">文件名：</span><span>{{ fileDetail.file_name }}</span>
          <span class="material-title ml-30">分辨率：</span><span>{{ fileDetail.resolution }}</span>
          <span class="material-title ml-30">时长：</span><span>{{ fileDetail.duration }}s</span>
          <br />
          <span class="material-title">文件类型：</span><span>{{ fileDetail.type == 1 ? '视频' : '图片' }}</span>
          <span class="material-title ml-30">收集渠道：</span><span>{{ fileDetail.from_type == 1 ? '网络采集' : '拍摄（公司原创）' }}</span>
          <span class="material-title ml-30">标签：</span><span v-for="item in fileDetail.tags" :key="item">{{ item }}、</span>
          <br />
          <span class="material-title">上传人：</span><span>{{ fileDetail.user_name }}</span>
          <span class="material-title ml-30">产品名字：</span><span>{{ fileDetail.product_name }}</span>
          <br />
          <!-- <span class="material-title">分类：</span><span>无名氏</span> -->
          <span class="material-title">修改日期：</span><span>{{ fileDetail.updated_at }}</span>
          <span class="material-title ml-30">下载量：</span><span>{{ fileDetail.download_num }}</span>
        </div>
      </el-card>

      <el-card style="margin-top:20px;">
        <div slot="header" class="">
          <span style="font-size:18px;">{{ fileType == 1 ? '视频预览' : '图片预览' }}</span>
        </div>
        <video v-if="fileType == 1" width="100%" height="500px;" controls="controls" :src="videoUrl"></video>
        <el-image
          v-else
          style="height:400px;"
          :src="imgList[0]"
          :preview-src-list="imgList"
        >
        </el-image>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消 预 览</el-button>
        <!-- <el-button type="primary" @click="onSubmit">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      videoVisible: true,
      imgList: [],
      fileType: null,
      fileId: '',
      videoUrl: '',
      fileDetail:{},
      videoTime: null,
    };
  },

  methods: {
    init(data) {
      this.fileDetail = data;
      this.visible = true;
      if(data.type == 1){
        console.log(data);
        console.log('加载视频');
        this.fileType = 1;
        this.fileId = 'ID: ' + data.id;
        this.videoUrl = data.url;
      }else if(data.type == 2){
        console.log(data);
        console.log('加载图片');
        this.fileType = 2;
        this.fileId = 'ID: ' + data.id;
        this.imgList.push(data.url);
      }
    },

    onClose() {
      this.imgList = [];
      this.visible = false;
    },

    onSubmit() {
      
    },
  },
};
</script>
<style lang="scss" scoped>
.ml-30 {
  margin-left: 30px;
}
.box-card {
  .material-box {
    span.material-title {
      font-size: 16px;
      font-weight: 400;
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>