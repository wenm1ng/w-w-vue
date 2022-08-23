import Vue from 'vue'
// 针对 el-input做的限制，只能输入正整数
Vue.directive('Int', {
  bind: function (el) {
    const input = el.getElementsByTagName('input')[0]
    input.onkeyup = function (e) {
      if (input.value.length === 1) {
        input.value = input.value.replace(/[^0-9]/g, '')
      } else {
        input.value = input.value.replace(/[^\d]/g, '')
      }
      trigger(input, 'input')
    }
    input.onblur = function (e) {
      if (input.value.length === 1) {
        input.value = input.value.replace(/[^0-9]/g, '')
      } else {
        input.value = input.value.replace(/[^\d]/g, '')
      }
      trigger(input, 'input')
    }
  }
})
const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

// PullScroll组件自定义指令
  Vue.directive('el-select-scroll', {
    bind(el, binding) {
    // 获取滚动页面DOM
    let SCROLL_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    let scrollPosition = 0
    SCROLL_DOM.addEventListener('scroll', function () {
        // 当前的滚动位置 减去  上一次的滚动位置
        // 如果为true则代表向上滚动，false代表向下滚动
        let flagToDirection = this.scrollTop - scrollPosition > 0
        // console.log(flagToDirection ? '滚动方向：下' : '滚动方向：上')

        // 记录当前的滚动位置
        scrollPosition = this.scrollTop

        // 记录滚动位置距离底部的位置,在滚动位置距离滚动页面底部一定高度时在触发，例如距页面底部只有100px时触发handleScroll事件
        const LIMIT_BOTTOM = 10
        let scrollBottom = this.scrollHeight - (this.scrollTop + this.clientHeight) < LIMIT_BOTTOM
          // 如果已达到指定位置则触发
          // 如果向下滚动 并且距离底部只有10px
          if (flagToDirection && scrollBottom) {
              // 将滚动行为告诉组件
              binding.value(flagToDirection)
          }
          // 如果是向上滚动  并且距离顶部只有100px
          if (!flagToDirection && this.scrollTop < LIMIT_BOTTOM) {
              binding.value(flagToDirection)
          }
        })
      }
    })

