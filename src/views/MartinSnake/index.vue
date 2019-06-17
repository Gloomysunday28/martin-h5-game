<template>
  <div class="c-snake__contain" ref="contain">
    <div class="c-snake__btn" v-if="!started">
      <button class="c-teriral__start" @click="commonStart(false)">普通模式</button>
      <button class="c-teriral__start" @click="commonStart(true)">开挂模式</button>
    </div>
    <canvas ref="canvas" v-else></canvas>
    <div class="c-snake__control" v-if="isMobile">
      <i class="iconfont c-snake__control__item c-snake__left" @click="changDirect('left')">&#xe602;</i>
      <i class="iconfont c-snake__control__item c-snake__up"  @click="changDirect('up')">&#xe602;</i>
      <i class="iconfont c-snake__control__item c-snake__right" @click="changDirect('right')">&#xe602;</i>
      <i class="iconfont c-snake__control__item c-snake__down" @click="changDirect('down')">&#xe602;</i>
    </div>
    <app-dialog :dialog-visiable.sync="showEndBox">
      <div class="c-end__body">
        <div class="c-end__background"></div>
        <div class="c-end__body">
          <div class="c-end__contain">
            Game Over
          </div>
          <div class="c-snake__end">
            <martin-button class="c-snake__cancel" type="primary" size="small" @click="showEndBox = false">取消</martin-button>
            <martin-button size="small" @click="$router.back()">确定</martin-button>
          </div>
        </div>
      </div>
    </app-dialog>
  </div>
</template>

<script>
export default {
  name: 'MartinSnake',
  data() {
    return {
      isMobile: false,
      isBT: false, // 是否开启变态模式
      started: false,
      speedTime: 100, // 初始速度时间
      snakeUnit: 0, // 贪吃蛇单个半径
      showEndBox: false,
      width: 0,
      height: 0,
      timer: null,
      changeTimer: null,
      ctx: null,
      direction: 'right',
      food: null,
      foodIx: 0, // 食物初始化位置x
      foodIy: 0, // 食物初始化位置y
      snakeBlocks: [], // 贪吃蛇
      head: null, // 蛇的头部
    }
  },
  methods: {
    getInitFoodPlace() { // 获取食物的初始位置
      const places = [...Array(30).keys()].map(_ => this.snakeUnit * _)

      return {
        x: places[~~(Math.random() * 30)] + this.snakeUnit / 2,
        y: places[~~(Math.random() * 30)] + this.snakeUnit / 2 // 圆点在this.snakeUnit的一半和this.width - this.snakeUnit / 2之间
      }
    },
    initFood() {
      const {x, y} = this.getInitFoodPlace()
      let isEated = true
      const _this = this
      if (isEated) {
        const ix = x
        const iy = y
        this.ctx.beginPath()
        this.ctx.fillStyle = `red`
        this.ctx.arc(ix, iy, this.snakeUnit / 2, 0, Math.PI * 2, false)
        this.ctx.fill()
        this.ctx.closePath()
        this.foodIx = ix
        this.foodIy = iy
        for (var i = 0; i < _this.snakeBlocks.length; i++) {
          if (_this.snakeBlocks[i].x === ix && _this.snakeBlocks[i].y === iy) {
            isEated = true
            break
          }
        }
        isEated = false
      }
    },
    initStart() {
      this.width = this.$refs.contain.clientWidth
      this.height = this.$refs.contain.clientHeight
      this.ctx = this.$refs.canvas.getContext('2d')
      this.$refs.canvas.width = this.width
      this.$refs.canvas.height = this.height
      this.snakeUnit = this.width / 30

      this.initSnake() // 初始化贪吃蛇
      this.moveSnake()
      this.timer = setInterval(_ => {
        this.moveSnake()
      }, this.speedTime)

      this.initFood() // 初始化食物
      if ('ontouchend' in window) {
        this.isMobile = true
      } else {
        this.addEventDocument()
      }
    },

    commonStart(isBT) {
      this.started = true
      this.isBT = isBT
      this.$nextTick().then(() => {
        this.initStart()
      })
    },
    timeLazy() { // 惰函数
      const oldTime = +new Date()
      this.timeLazy = () => {
        return {
          oldTime,
          newTime: +new Date()
        }
      }
      return this.timeLazy
    },
    initSnake() {
      const _this = this
      const random = Math.random()
      for (let i = 0; i < 4; i++) {
        (function(i) {
          _this.snakeBlocks.push({
            id: ~~(random * 1000),
            ix: _this.snakeUnit / 2 + i,
            iy: _this.snakeUnit / 2,
            r: _this.snakeUnit / 2,
            speed: _this.snakeUnit,
            render() {
              _this.ctx.beginPath()
              _this.ctx.fillStyle = '#444'
              _this.ctx.arc(this.ix, this.iy, this.r, 0, 2 * Math.PI, false)
              _this.ctx.fill()
              _this.ctx.closePath()
            }
          })
        })(i)
      }

      this.head = this.snakeBlocks[0] // 将集合第一个引用地址复制给head
    },
    addEventDocument() { // PC
      // 给document添加控制事件
      let direct = ''
      const keyEvents = e => {
        switch (e.keyCode) {
          case 37:
            direct = 'left'
            break
          case 38:
            direct = 'up'
            break
          case 39:
            direct = 'right'
            break
          case 40:
            direct = 'down'
            break
          default:
            break
        }
      }

      document.onkeydown = e => {
        keyEvents(e)
        this.changDirect(direct)
      }
    },
    changDirect(direct) {
      if (this.isBT) {
        this.direction = direct
      } else {
        if (this.judgeDirection(direct)) {
          this.direction = direct
        }
      }
    },
    judgeDirection(direct) { // 判断方向
      return (this.direction === 'right' && direct !== 'left') || (this.direction === 'left' && direct !== 'right') ||
      (this.direction === 'up' && direct !== 'down') || (this.direction === 'down' && direct !== 'up')
    },
    // 移动贪吃蛇
    moveSnake() {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.beginPath()
      this.ctx.fillStyle = 'red'
      this.ctx.arc(this.foodIx, this.foodIy, this.snakeUnit / 2, 0, 2 * Math.PI, false)
      this.ctx.fill()
      this.ctx.closePath() // 绘画食物

      const rect = {...this.head}

      if (!this.isBT) { // 蛇的身体相撞, 游戏结束
        const {
          oldTime,
          newTime
        } = this.timeLazy()

        if ((newTime - oldTime) / 1000 > 1) {
          if (this.snakeBlocks.slice(1).find(_ => _.ix === rect.ix && rect.iy === _.iy)) {
            clearInterval(this.timer)
            this.showEndBox = true
            return
          }
        }
      }

      this.snakeBlocks.splice(1, 0, rect) // 将前面的头添加到现在的第二个

      if (this.haveEated()) {
        this.initFood()
      } else {
        this.snakeBlocks.pop()
      }

      switch (this.direction) {
        case 'right':
          this.head.ix += this.head.speed
          break
        case 'left':
          this.head.ix -= this.head.speed
          break
        case 'up':
          this.head.iy -= this.head.speed
          break
        case 'down':
          this.head.iy += this.head.speed
          break
        default:
          break
      }

      if (
        this.head.ix >= (this.width - this.snakeUnit / 2) ||
        this.head.ix <= 0 ||
        this.head.iy >= (this.height - this.snakeUnit / 2) ||
        this.head.iy <= 0
      ) {
        clearInterval(this.timer)
        this.showEndBox = true
      }

      for (let i = 0; i < this.snakeBlocks.length; i++) {
        this.snakeBlocks[i].render()
      }

      // if ((newTime - oldTime) / 1000 > 5 && !this.isBT) {
      //   for (var i = 0; i < this.snakeBlocks.length; i++) {
      //     for (var j = i; j < this.snakeBlocks.length; j++) {
      //       if (this.snakeBlocks[i].ix === this.snakeBlocks[j].ix && this.snakeBlocks[i].iy === this.snakeBlocks[j].iy) {
      //         clearInterval(this.timer)
      //         this.showEndBox = true
      //         return
      //       }
      //     }
      //   }
      // }
    },
    haveEated() {
      if (Math.abs(this.head.ix - this.foodIx) <= this.snakeUnit / 2 && Math.abs(this.head.iy - this.foodIy) <= this.snakeUnit / 2) {
        return true
      }
      return false
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    if (this.changeTimer) {
      clearInterval(this.changeTimer)
    }
  }
}
</script>

<style scoped lang='less'>
.c-snake__control {
  position: absolute;
  left: 50%;
  bottom: 100px;
  transform: translateX(-50%);
  opacity: .6;
  .c-snake__control__item {
    font-size: 120px;
  }
  .c-snake__left {
    position: absolute;
    transform: rotate(.25turn) translateY(-50%);
    left: -220px;
    bottom: 50%;
  }
  .c-snake__right {
    position: absolute;
    transform: rotate(-.25turn) translateY(-50%);
    right: -220px;
    bottom: 50%;
  }
  .c-snake__down {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    bottom: -90px;
  }
  .c-snake__up {
    position: absolute;
    transform: rotate(-.5turn) translateX(50%);
    left: 0;
    top: -210px;
  }
}
.c-snake__content {
  position: relative;
  .c-snake__eyes {
    position: absolute;
    width: 30px;
    padding: 3px;
    box-sizing: border-box;
    left: 0;
    top: 5px;
    display: flex;
    justify-content: space-between;
    .c-eye {
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 8px;
      background: greenyellow;
      animation: wink 1s ease-in-out infinite;
    }
  }
}
.c-snake__block {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background: #444;
  transition: all 0.5s;
}

@keyframes wink {
  0% {
    transform: scale(1) skew(0);
  }
  30% {
    transform: scale(0.8) skew(0.08turn);
  }
  50% {
    transform: scale(0.6) skew(-0.08turn);
  }
  70% {
    transform: scale(0.8) skew(0.08turn);
  }
  80% {
    transform: scale(1) skew(-0.08turn);
  }
  90% {
    transform: scale(1.2) skew(0);
  }
}

// 贪吃蛇食物
.c-snake__food {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 30px;
}

.c-end__header {
  height: 100%;
  background: url(~@/assets/img/snake.png) no-repeat center -100px;
  filter: blur(5px);
}

.c-end__footer {
  height: 100%;
  background: url(~@/assets/img/snake.png) no-repeat center -300px;
  filter: blur(5px);
}

.c-end__background {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background: url(~@/assets/img/snake.png) no-repeat center/cover;
  filter: blur(5px);
}
.c-end__body {
  position: relative;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.c-end__contain {
  flex: 1;
  font-size: 42px;
  color: red;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.c-snake__end {
  flex: none;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.c-snake__cancel {
  margin-right: 10px;
}

.c-teriral__start {
  font-size: 32px;
}

.c-teriral__start:nth-child(1) {
  left: 33%;
}
.c-teriral__start:nth-child(2) {
  left: 66%;
  color: palevioletred;
  font-weight: bold;
  background: rgba(120, 190, 247, 0.867);
}
</style>
