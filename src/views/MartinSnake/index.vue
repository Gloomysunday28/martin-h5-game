<template>
  <div class="c-snake__contain" ref="contain">
    <canvas ref="canvas"></canvas>
    <app-dialog :dialog-visiable.sync="showEndBox">
      <div class="c-end__body">
        <div class="c-end__background"></div>
        <div class="c-end__body">
          <div class="c-end__contain">
            1
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
      showEndBox: false,
      width: 0,
      height: 0,
      timer: null,
      changeTimer: null,
      ctx: null,
      direction: 'right',
      food: null,
      foodIx: 0,
      foodIy: 0,
      snakeBlocks: [], // 贪吃蛇
      head: null, // 蛇的头部
    }
  },
  mounted() {
    this.width = this.$refs.contain.clientWidth
    this.height = this.$refs.contain.clientHeight
    this.ctx = this.$refs.canvas.getContext('2d')
    this.$refs.canvas.width = this.width
    this.$refs.canvas.height = this.height

    this.initSnake() // 初始化贪吃蛇
    this.moveSnake()

    this.timer = setInterval(_ => {
      this.moveSnake()
    }, 100)

    this.initFood() // 初始化食物
    this.addEventDocument()
  },
  methods: {
    initFood() {
      let isEated = true
      const _this = this
      if (isEated) {
        const foodRandomX = Math.random()
        const foodRandomY = Math.random()
        const ix = (foodRandomX * this.width - 14) + 7
        const iy = (foodRandomY * this.height - 14) + 7
        // console.log(this.width)
        this.ctx.beginPath()
        this.ctx.fillStyle = `red`
        this.ctx.arc(ix, iy, 7, 0, Math.PI * 2, false)
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
    initSnake() {
      const _this = this
      const random = Math.random()
      for (let i = 0; i < 4; i++) {
        (function(i) {
          _this.snakeBlocks.push({
            id: ~~(random * 1000),
            ix: 0,
            iy: 7,
            r: 7,
            speed: 14,
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

      this.head = this.snakeBlocks[0]
    },
    addEventDocument() {
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
        this.direction = direct
      }
    },
    // 移动贪吃蛇
    moveSnake() {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.beginPath()
      this.ctx.fillStyle = 'red'
      this.ctx.arc(this.foodIx, this.foodIy, 7, 0, 2 * Math.PI, false)
      this.ctx.fill()
      this.ctx.closePath()
      const rect = {...this.head}
      this.snakeBlocks.splice(1, 0, rect)

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
        this.head.ix > this.width ||
        this.head.ix < 0 ||
        this.head.iy > this.height ||
        this.head.iy < 0
      ) {
        clearInterval(this.timer)
        this.showEndBox = true
      }

      for (var i = 0; i < this.snakeBlocks.length; i++) {
        this.snakeBlocks[i].render()
      }
    },
    haveEated() {
      if (Math.abs(this.head.ix - this.foodIx) < 5 && Math.abs(this.head.iy - this.foodIy) < 5) {
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
</style>
