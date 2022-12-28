/**
 * @name: draggable
 * @description: 元素拖拽
 */
const draggableMixin = {
  data() {
    return {
      // 元素位置，用于样式绑定，动态更新位置(:style="{left: `${x}px`, top: `${y}px`}")
      elePos: {
        x: null,
        y: null
      },
      // 手指（鼠标）触摸点[即拖拽开始的位置]距离拖拽元素左上角的距离
      diffOfTarget: {
        x: 0,
        y: 0
      },
      time: 0,
      timer: null
    }
  },
  methods: {
    dragStartHandler(e) {
      // this.time = 0
      // this.timer = setInterval(() => {
      //   this.time++
      // }, 1000)
      // console.log(this.time)
      // 判断是否长按

      let touch = e
      if (e.touches) {
        touch = e.touches[0]
      }
      this.diffOfTarget.x = touch.clientX - e.target.offsetLeft
      this.diffOfTarget.y = touch.clientY - e.target.offsetTop
      // 解决滑动穿透问题
      let scrollTop = document.scrollingElement.scrollTop
      // console.log(scrollTop)
      // todo 在项目的全局样式下，需要定义一个modal-open的样式类
      /**
       * body.modal-open {
       *   position: fixed;
       *   width: 100%;
       *   min-height: 100%;
       * }
       */
      document.body.classList.add('modal-open')
      document.body.style.top = -scrollTop + 'px'
    },

    draggingHandler(e) {
      let touch = e
      // console.log(touch.target.offsetWidth, '元素宽');
      // console.log(touch.target.offsetHeight, '元素高');

      if (e.touches) {
        touch = e.touches[0]
      }
      // 设置拖拽元素的位置
      // console.log(this.elePos.x,'this.elePos.x');
      // console.log(e.target.offsetLeft,'e.target.offsetLeft');
      this.elePos.x = touch.clientX - this.diffOfTarget.x
      this.elePos.y = touch.clientY - this.diffOfTarget.y
      // 限制元素不能超过屏幕
      if (this.elePos.x < 0) {
        this.elePos.x = 0
      } else if (this.elePos.x > window.screen.width - touch.target.offsetWidth) {
        this.elePos.x = window.screen.width - 1.5 * e.target.clientWidth
      }
      if (this.elePos.y < 0) {
        this.elePos.y = 0
      } else if (this.elePos.y > window.screen.height - touch.target.offsetWidth) {
        this.elePos.y = window.screen.height - e.target.clientHeight - 60
      }
    },


    dragEndHandler(e) {
      document.body.classList.remove('modal-open')
      // if (this.time < 2) {
      //   console.log('不是长按');
      //   clearInterval(this.timer)
      //   this.time = 0
      //   return
      // } 
      // else {
      //   clearInterval(this.timer)
      //   this.time = 0
      //   console.log('长按');
      // }
    }
  }
}

export default draggableMixin