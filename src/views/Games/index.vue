<template>
  <div class="c-games__container">
    <router-link class="c-game__item" :to="{name: game.url}" v-for="game in gameLists" :key="game.url" :style="{background: `url(${game.img}) no-repeat center/cover`}">
      <span class="c-game__name">{{game.name}}</span>
    </router-link>
    432
  </div>
</template>

<script>
export default {
  name: 'Games',
  data() {
    return {
      gameLists: [{
        name: '俄罗斯方块',
        url: 'MartinTerials',
        img: require('@/assets/img/terial.png')
      }, {
        name: '贪吃蛇',
        url: 'MartinSnake',
        img: require('@/assets/img/snake.png')
      }]
    }
  }
}
</script>

<style scoped lang="less">
  .c-games__container {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    align-items: center;
  }
  .c-game__item {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 20px;
    box-sizing: border-box;
    width: 680px;
    height: 250px;
    border-radius: 15px;
    box-shadow: 0 2px 8px 2px rgba(0, 0, 0, .15);
    .c-game__name {
      font-size: 38px;
      color: rgba(6, 184, 238);
      text-shadow: 1px 1px 1px aquamarine,
        1px 2px 1px aquamarine,
        1px 3px 1px aquamarine,
        1px 4px 1px aquamarine,
        1px 5px 1px aquamarine,
        1px 6px 1px aquamarine,
        1px 7px 1px aquamarine,
        1px 8px 1px aquamarine,
        1px 9px 1px aquamarine,
        1px 10px 1px aquamarine,
        1px 18px 6px rgba(6, 184, 238, 0.4),
        1px 22px 10px rgba(6, 184, 238, 0.2),
        1px 25px 35px rgba(6, 184, 238, 0.2),
        1px 30px 60px rgba(6, 184, 238, 0.4);
    }
  }
</style>
