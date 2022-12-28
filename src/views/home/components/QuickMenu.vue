<template>
  <van-popup position="right" v-model="isDialog" get-container="#app" class="quick-pop">
    <div class="drag-contain">
      <div class="drag-header">
        <div class="darg-header-title">设置</div>
        <div class="darg-header-img" @click="isDialog = false">
          <van-icon name="cross" />
        </div>
      </div>
      <div class="drag-list-header">
        <div class="drag-list-item">
          <div class="list-title">菜单名称</div>
          <div class="list-darg-switch">显示</div>
          <div class="list-drag-sort">拖动排序</div>
        </div>
      </div>
      <div class="drag-list">
        <draggable v-model="btnList" handle=".list-drag-sort" animation="300" @end="handleDrag">
          <div class="drag-list-item" v-for="item in btnList" :key="item.title">
            <div class="list-title">{{item.title}}</div>
            <div class="list-darg-switch">
              <van-switch v-model="item.isShow" size="1rem" @change="handleDrag" />
            </div>
            <div class="list-drag-sort">
              <img src="@/assets/images/home/drag.png" style="width: 1rem; height: auto;" alt="">
              <!-- <van-icon name="setting-o" /> -->
            </div>
          </div>
        </draggable>
      </div>
    </div>
  </van-popup>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'

export default {
  props: {
    isOpen: {
      default: false,
      type: Boolean
    },
    quickName: String,
    btnListProp: Array
  },
  components: { draggable },
  data() {
    return {
      isDialog: false,
      btnList: this.btnListProp.map(item => {
        return { ...item }
      })
    }
  },
  watch: {
    isOpen(val) {
      this.isDialog = val
    },
    isDialog(val) {
      this.$emit('update:isOpen', val)
    }
  },
  methods: {
    ...mapActions('common/db', ['set']),
    handleDrag() {
      const list = this.btnList.map((item, index) => {
        item.num = index
        return item
      }).sort((a, b) => a.num < b.num)
      this.set({
        argu: this.quickName,
        value: list,
        user: true
      })
      this.$emit('onDealBtnList', list)
    }
  }
}
</script>

<style lang="scss" scoped>
.quick-pop {
  overflow: hidden;
}
.drag-contain {
  width: 80vw;
  height: 100vh;
  background: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0.8rem;
  .drag-header {
    display: flex;
    justify-content: space-between;
  }
  .drag-list {
    flex: 1;
  }
  .drag-list-header {
    .drag-list-item {
      font-weight: bold;
    }
  }
  .drag-list,
  .drag-list-header {
    width: 100%;
    .drag-list-item {
      display: flex;
      font-size: 0.8rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eeeeee;
      width: 100%;
      overflow: hidden;

      .list-title {
        width: 60%;
      }
      .list-darg-switch {
        text-align: center;
        width: 20%;
      }
      .list-drag-sort {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20%;
      }
    }
  }
}
</style>