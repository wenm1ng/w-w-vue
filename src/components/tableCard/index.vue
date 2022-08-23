<template>
  <div class="cardCanvs">
    <el-row>
      <div v-if="dataCard.length < 1" class="nodata">暂无数据</div>
      <div v-else>
        <el-col v-for="(item, i) in dataCard" :key="i" class="cardDiv">
          <el-card
            :body-style="{
              padding: '0px',
              'padding-bottom': '10px',
              cursor: 'pointer',
            }"
          >
            <input
              style="margin-left: 5px; cursor: pointer"
              name="nodeStr"
              v-show="!showCheckVal"
              type="checkbox"
              :id="item.id"
              @click="checked(item)"
              :checked="checkList.indexOf(item.id) > -1"
            />
            <div class="material_show" @click="currentClickCard(item)">
              <div v-show="item.type === 1" class="video_box">
                <video v-waves :src="item.url" class="m_video"></video>
              </div>
              <div v-show="item.type === 2">
                <img v-waves :src="item.url" class="m_image" />
              </div>
              <div class="itemTitle">
                <span class="title_id">ID: {{ item.id }}</span>
                <span class="title">文件名：{{ item.name }}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ item.created_at }}</time>
                  <el-button type="text" class="button" @click="editMaterial(item)">编辑</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    dataCard: Array,
    showCheckVal: Boolean,
    imgField: {
      type: String,
      default: "alarmPicUrl",
    },
  },
  data() {
    return {
      checkedCities: "",
      checkList: [],
      checkListItem: [],
    };
  },
  methods: {
    // 全选
    checkedss(val) {
      let node = document.getElementsByName("nodeStr");
      let len = node.length;
      let checkLists = this.checkList;
      for (let i = 0; i < node.length; i++) {
        if (val) {
          if (checkLists.indexOf(Number(node[i].id)) == -1) {
            node[i].checked = true;
            this.checkList.push(Number(node[i].id));
            // console.log(node[i],this.dataCard[i])
            this.checkListItem.push(this.dataCard[i]);
          }
        } else {
          node[i].checked = false;
          this.checkList = [];
          this.checkListItem = [];
        }
      }
      this.$emit("cardSelectData", this.checkListItem);
    },
    checked(item) {
      //点击一次选中，再点击一次取消选中
      if (this.checkList.indexOf(item.id) > -1) {
        let index = this.checkList.indexOf(item.id);
        this.checkList.splice(index, 1);
        this.checkListItem.splice(index, 1);
      } else {
        this.checkList.push(item.id);
        this.checkListItem.push(item);
      }
      // console.log("勾选数据",this.checkListItem)
      this.$emit("cardSelectData", this.checkListItem);
    },
    // 编辑素材
    editMaterial(row){
      this.$emit('editMaterialByCard', row)
    },
    // 当前点击的卡片
    currentClickCard(row){
      this.$emit('clickCard', row)
    }
  },
};
</script>

<style lang="scss">
.cardCanvs {
  width: 100%;
  padding: 15px 0;
  height: 900px;
  min-height: 900px;
  background-color: #ffffff;
  overflow-y: auto;

  .nodata {
    text-align: center;
    height: 200px;
    line-height: 200px;
    font-size: 16px;
    font-weight: 500;
    color: #7c7c7c;
  }

  input[type="checkbox"] {
    width: 15px;
    height: 15px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    line-height: 15px;
    position: relative;
  }

  input[type="checkbox"]::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    width: 100%;
    height: 100%;
    border: 1px solid #cacdcf;
  }

  input[type="checkbox"]:checked::before {
    content: "\2713";
    background-color: #2196f3;
    color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border: 1px solid #2196f3;
    font-size: 12px;
    font-weight: bold;
  }

  .allBtn {
    display: inline-block;
  }
}

.cardDiv {
  width: 19%;
  margin: 10px 0.8% 10px 0;
  border: 1px solid transparent;
  &:hover {
    transform: translateY(-10px);
    transition: all 0.5s;
    border-color: #409eff;
    border-radius: 5px;
  }

  .video_box {
    height: 300px;
    margin: 10px 20px;
    border: 1px solid gray;
    .m_video {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: fill;
    }
  }

  .m_image {
    width: 90%;
    margin: 10px 20px;
    height: 300px;
  }

  .itemTitle {
    padding:14px;
    // span {
    //   width: 100%;
    //   display: inline-block;
    //   padding-left: 12px;
    // }

    .title_id {
      font-size: 14px;
      color: #303133;
      letter-spacing: 0;
      font-weight: 400;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: MicrosoftYaHei;
      display: block;
      margin-bottom: 5px;
    }

    .title {
      font-size: 14px;
      color: #303133;
      letter-spacing: 0;
      font-weight: 400;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: MicrosoftYaHei;
    }
  }
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
