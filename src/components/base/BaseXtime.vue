<script lang="ts">
import { defineComponent, h, onUnmounted, ref, watch } from 'vue'
import { beautifyTime } from '@/utils/datetime'

export default defineComponent({
  name: 'Xtime',
  props: {
    time: {
      type: String,
      default: '0000-00-00 00:00:00'
    }
  },
  setup(props) {
    let timeout: number | undefined = undefined
    const inTime = new Date(props.time.replace(/-/g, '/')).getTime()
    const text = ref<string>('')

    const format = () => {
      clearTimeout(timeout)
      text.value = beautifyTime(props.time)
      if (new Date().getTime() - inTime < 30 * 60 * 1000) {
        timeout = setTimeout(format, 60 * 1000)
      }
    }

    watch(props, format)

    onUnmounted(() => {
      clearTimeout(timeout)
    })

    format()

    return () => h('span', [text.value])
  }
})
</script>
