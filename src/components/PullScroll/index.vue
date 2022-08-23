<template>
  <el-select
    v-model="chooseValue"
    v-el-select-scroll="loadMore"
    remote
    clearable
    filterable
    style="width: 100%"
    :remote-method="remoteMethod"
    class="scroll-select"
    :popper-class="`scroll-select-popper ${loading && 'loading'}`"
    :placeholder="defaultValue || '请输入账号名称查询'"
    :multiple="multiple"
    @change="handleChange"
  >
    <!-- 只有isShow定义了false，才进行隐藏，否则正常显示 -->
    <el-option
      v-for="(item,index) in list"
      v-show="item.isShow === false ? false : true"
      :key="item.value + `'${index}'`"
      :label="item.label"
      :value="showTagId ? item.value : item.label"
    />
  </el-select>
</template>

<script>
import { debounce } from '../../utils/debounce' //防抖方法

export default {
  props: {
    currentFather:{ //父组件传过来的页面名
      type: String,
      default: null
    },
    fetchMethod: {//远程搜索函数
      type: Function,
      default: null
    },
    fetchParams: {//搜索的接口参数
      type: Object,
      default: () => ({})
    },
    fetchFormat: {//统一下拉数据格式
      type: Function,
      default: (data) => {
        return data.map(({ lotName, lotId }) => ({ label, value }))
      }
    },
    searchKey: {//设置搜索的关键字
      type: String,
      default: 'searchKey'
    },
    multiple: {   // 是否可以多选
      type: Boolean,
      default: false
    },
    defaultSelected: {   // 默认选中值
      type: [Array, String],
      default: ''
    },
    defaultSelectedStr: {// 默认选中值对应的数据，用于回显
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      list: [],//下拉数据
      chooseValue: '',//绑定选中的数据
      searchText: '',
      defaultValue: '',
      pageNum: 1,
      pageSize: 500,
      loading: false,
      finished: false,
      // 素材信息管理模块下拉框获取id，大数据报表下拉框获取name
      showTagId: false
    }
  },
  watch: {
    defaultSelected: {
      handler() {
        this.chooseValue = this.defaultSelected
      },
      immediate: true
    },

    // 将选中的数据 拼成数组，放在list中，用于回显，解决非第一页数据无法正常显示的问题
    defaultSelectedStr: {
      handler() {
        this.list = this.list.concat(this.defaultSelectedStr)
      },
      immediate: true
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      if (!this.fetchMethod || this.finished) return
      this.loading = true
      this.fetchParams.search_value = this.searchText;
      const params = {
        ...this.fetchParams,
        page: this.pageNum,
      }
      // 素材信息管理页面
      if(this.currentFather === 'materialIndex'){
        this.showTagId = true;
        this.defaultValue = '请输入素材标签名称查询'
        this.fetchMethod(params).then(({ data }) => {
        //接口返回数据
        var result = data.list.map((item, index)=>{
          return {
            lotId: item.id,
            lotName: item.name,
            isShow: false
          }
        })
        data = result;
        data = this.fetchFormat(data)
        if (data.length < this.pageSize) this.finished = true
          this.list = this.list.concat(data)
        }).finally(() => {
          this.loading = false
        })
      }else{  
        this.showTagId = false;
        // 数据汇总报表页面
        this.fetchMethod(params).then(({ data }) => {
        //接口返回数据
        var result = data.list.map((item, index)=>{
          return {
            lotId: index + 1,
            lotName: item,
            isShow: false
          }
        })
        data = result;
        data = this.fetchFormat(data);
        if (data.length < this.pageSize) this.finished = true
          this.list = this.list.concat(data)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    remoteMethod(searchText) {
      if (searchText === this.searchText) return
      debounce(() => {
        this.list = []
        this.pageNum = 1
        this.finished = false
        this.searchText = searchText
        this.fetchData()
      })()
    },
    loadMore() {
      debounce(() => {
        if (this.finished) return
        this.pageNum += 1
        this.fetchData()
      })()
    },
    handleChange(value) {
      this.$emit('selectedAsset', value)
    }
  }
}
</script>
<style lang="scss">
.scroll-select {
  ::v-deep .is-focus {
    .el-select__caret {
      transform: rotateZ(0deg);
    }
  }

  ::v-deep .el-select__caret::before {
    content: "\e6e1";
  }
}

.scroll-select-popper {
  ::v-deep .el-select-dropdown__item {
    max-width: 300px;
  }

  &.loading {
    &::after {
      content: "loading....";
      display: block;
      line-height: 30px;
      text-align: center;
      background: rgba(255, 255, 255, 0.8);
      color: #666666;
      font-size: 12px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>

