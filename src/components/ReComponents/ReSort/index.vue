<template>
  <div class="Re-sort" @click="handleItem">
    <div class="Re-sort-title" :class="{'Re-sort-title-act': value && (value.type === 0 || value.type === 1) && value.column === info.column }">{{info.title}}</div>
    <div class="Re-sort-icons">
      <div class="Re-sort-icon Re-sort-icon-t" :class="{'Re-sort-icon-act': value && value.type === 0 && value.column === info.column }"></div>
      <div class="Re-sort-icon Re-sort-icon-b" :class="{'Re-sort-icon-act': value && value.type === 1 && value.column === info.column }"></div>
    </div>
  </div>
</template>

<script>
/**
 * 0 升序
 * 1 降序
 */
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Object,
    info: Object
  },
  methods: {
    handleItem() {
      if (this.value && Object.keys(this.value).length && this.value.column === this.info.column) {
        if (this.value.type === 0) {
          this.$emit('change', { ...this.info, type: 1})
        } else if (this.value.type === 1) {
          this.$emit('change', {})
        }
      } else {
        this.$emit('change', { ...this.info, type: 0 })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$borderWidth: 0.3rem;
.Re-sort {
  display: flex;
  align-items: center;
  vertical-align: middle;
  margin-right: 0.6rem;
  .Re-sort-title {
    font-size: 0.76rem;
    margin-right: 0.12rem;
  }
  .Re-sort-title-act {
    color: #0088fe;
  }
  .Re-sort-icons {
    display: flex;
    flex-direction: column;
    justify-content: center;    
    .Re-sort-icon {
      margin-top: 0.1rem;
    }
    .Re-sort-icon-t {
      border-left: $borderWidth solid transparent;
      border-bottom: $borderWidth solid #333333;
      border-right: $borderWidth solid transparent;
    }
    .Re-sort-icon-b {
      border-left: $borderWidth solid transparent;
      border-top: $borderWidth solid #333333;
      border-right: $borderWidth solid transparent;
    }
    .Re-sort-icon-act {
      border-top-color: #0088fe;
      border-bottom-color: #0088fe;
    }
  }
}
</style>