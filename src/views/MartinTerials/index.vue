<template>
  <div class="c-terirals__contain" ref="contain">
    <div v-if="started">
      <div class="c-teriral__render--active" v-html="activeSqure" ref="activeSquare" :style="{top: `${activeY}px`, left: `${activeX}px`, transform: `rotate(${rotate}turn)`}">
      </div>
      <div class="c-render--arrived" ref="teriral">
        <div class="c-teriral__render" v-for="teriral in terirals" :key="teriral.id" v-html="teriral.square" :style="{top: `${teriral.y}px`, left: `${teriral.x}px`, transform: `rotate(${teriral.r}turn)`}">
        </div>
      </div>
    </div>
    <div v-else>
      <button class="c-teriral__start" @click="started = true">开始</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Martinterirals',
  data() {
    return {
      started: false, // 是否开始
      activeX: 0,
      activeY: 0,
      slideUnit: 30,
      moveUnit: 0,
      rotate: 0,
      activeSqure: '', // 操控中的块
      terirals: [], // 已到达底部的块
      squares: ['positiveSquare', 'straightBlock', 'edgeBlock', 'centerBlock'],
      timer: null
    }
  },
  computed: {
    unitSquare() {
      return `<div class="c-terirals__block"></div>`
    },
    positiveSquare() {
      const positiveArr = [1, 2, 3, 4]
      return `<div class="c-positive__square">${positiveArr.map(val => this.unitSquare).join('')}</div>`
    },
    straightBlock() {
      const positiveArr = [1, 2, 3, 4]
      return `<div class="c-straight__block">${positiveArr.map(val => this.unitSquare).join('')}</div>`
    },
    edgeBlock() {
      const positiveArr = [1, 2, 3, 4]
      return `<div class="c-edge__block">${positiveArr.map(val => this.unitSquare).join('')}</div>`
    },
    centerBlock() {
      const positiveArr = [1, 2, 3, 4]
      return `<div class="c-center__block">${positiveArr.map(val => this.unitSquare).join('')}</div>`
    },
  },
  methods: {
    initSquare() {
      this.addEventDocument() // 添加监听事件
      this.getDiffSquare() // 获取方块
    },
    addEventDocument() { // 给document添加控制事件
      document.onkeydown = (e) => {
        switch (e.keyCode) {
          case 37:
            this.changeDirection('-')
            break
          case 38:
            this.rotateSquare()
            break
          case 39:
            this.changeDirection('+')
            break
          case 40:
            this.quicklySlide()
            break
          default:
            break
        }
      }
      document.onkeyup = (e) => {
        switch (e.keyCode) {
          case 40:
            this.slideUnit = 30
            break
          default:
            break
        }
      }
    },
    changeDirection(direction) { // 更换方向
      if (direction === '+' && this.activeX + this.moveUnit < this.$refs.contain.clientWidth) this.activeX += this.moveUnit
      else if (this.activeX - this.moveUnit > 0) this.activeX -= this.moveUnit
    },
    rotateSquare() { // 旋转方块
      this.rotate += 0.25
      this.activeX = this.$refs.activeSquare.getBoundingClientRect().left
    },
    quicklySlide() { // 快速下滑
      this.slideUnit = 100
    },
    arrivedSquare(square) {
      const id = Math.random() * 1000000
      const x = this.activeX
      const y = this.activeY
      const r = this.rotate
      this.terirals.push({
        id,
        y,
        x,
        r,
        square
      })
      this.getDiffSquare()
    },
    // 初始化方块
    getDiffSquare() {
      const squareIndex = ~~(Math.random() * 4)
      this.activeSqure = this[this.squares[squareIndex]]
      if (!this.moveUnit) {
        this.$nextTick().then(_ => {
          const initWidth = this.$refs.activeSquare.offsetWidth
          const moveUnit = document.querySelector('.c-terirals__block').offsetWidth // 获取左右移动的宽度
          this.moveUnit = moveUnit
          this.activeY = -this.$refs.activeSquare.offsetHeight // 初始化方块Y位置
          this.activeX = ~~((this.$refs.contain.offsetWidth / initWidth) * Math.random()) * initWidth // 初始化方块X位置
          this.timer = setInterval(_ => {
            this.squareSlidedown()
          }, 500)
        })
      } else {
        const initWidth = this.$refs.activeSquare.offsetWidth
        this.activeY = -this.$refs.activeSquare.offsetHeight // 初始化方块Y位置
        this.activeX = ~~((this.$refs.contain.offsetWidth / initWidth) * Math.random()) * initWidth // 初始化方块X位置
      }
    },
    filterMaxArrive() {
      const arrivedTeriral = this.terirals.filter(val => {
        return Math.abs(val.x - this.activeX) < 5
      }).sort((a, b) => {
        return a.y > b.y ? 1 : -1
      })
      return arrivedTeriral.length ? arrivedTeriral : []
    },
    squareSlidedown() {
      this.activeY += this.slideUnit
      const maxTeriral = this.filterMaxArrive()
      const y = maxTeriral.length ? maxTeriral[0].y : this.$refs.contain.clientHeight
      if (this.activeY + this.$refs.activeSquare.clientHeight + this.slideUnit >= y) {
        // this.activeY = y
        this.activeY = y - this.$refs.activeSquare.clientHeight
        this.slideUnit = 30
        this.arrivedSquare(this.activeSqure)
        this.initSquare()
      }
    },
  },
  watch: {
    started(n) {
      if (n) this.initSquare()
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
  .c-teriral__render--active {
    position: absolute;
    will-change: transform, top, left;
    /* transition: all .5s; */
    transform-origin: center;
  }
  .c-terirals__contain >>> .c-terirals__block {
    width: 50px;
    height: 50px;
    background: red;
    box-sizing: border-box;
    border: 1Px solid rgba(0, 0, 0, .15);
  }
  .c-terirals__contain >>> .c-positive__square {
    width: 102px;
    height: 100px;
    display: flex;
    flex-wrap: wrap;
  }
  .c-terirals__contain >>> .c-edge__block {
    width: 150px;
    height: 100px;
    display: flex;
    flex-wrap: wrap;
  }
  .c-terirals__contain >>> .c-center__block {
    width: 150px;
    height: 100px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .c-teriral__render {
    position: absolute;
  }

  @keyframes jump {
    from {
      box-shadow: 0 10px rgba(0, 0, 0, .78);
    }
    to {
      box-shadow: 0 30px rgba(0, 0, 0, .28);
    }
  }
</style>
