<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="v-icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="height"
      :viewBox.camel="viewBox"
      :fill="fill"
      v-bind="$attrs"
      @click="$emit('click')"
      v-html="icon"
    />
  </div>
</template>

<script>
  export default {
    name: 'VIcon',

    inheritAttrs: false,

    props: {
      name: {
        type: String,
        default: ''
      },
      iconStyle: {
        type: String,
        default: 'line'
      },
      width: {
        type: [String, Number],
        default: 24
      },
      height: {
        type: [String, Number],
        default: 24
      },
      fill: {
        type: String,
        default: 'inherit'
      },
      viewBox: {
        type: String,
        default: '0 0 24 24'
      }
    },

    lib: [],

    add (icons) {
      if (Array.isArray(icons)) {
        this.lib = icons
      } else {
        this.lib.push(icons)
      }
    },

    computed: {
      icon () {
        const icon = this.$options.lib.find(
          i => i.name === this.name && i.style === this.iconStyle
        )

        if (icon) {
          return icon.path
        } else {
          console.error('Name of the icon is not correct')
          return undefined
        }
      }
    }
  }
</script>

<style>
.v-icon {
  display: inline-flex;
  fill: currentColor;
}
</style>
