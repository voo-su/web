<script lang="ts" setup>
import { h, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import IconLang from '@/components/icons/IconLang.vue'
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n()

const languages = [
  {
    label: 'Русский',
    value: 'ru'
  }
]

const onLang = () => ElMessageBox({
  title: t('selectYourLang'),
  showCancelButton: true,
  showConfirmButton: false,
  message: () => h('ul', {
      class: 'lang-list'
    }, languages.map(lang =>
      h('li', {
        key: lang.value,
        class: {
          'lang-item': true,
          'selected': locale.value === lang.value
        },
        onClick: () => {
          locale.value = lang.value
        }
      }, lang.label)
    ))
}).catch(() => { })

</script>

<template>
  <div class="footer-container">
    <div class="copyright">
      <b>© {{ new Date().getFullYear() }} Voo.su</b>
    </div>
    <ul class="navs">
      <li>
        <el-link href="/terms">
          {{ t('terms') }}
        </el-link>
      </li>
      <li>
        <el-link href="/dev">
          {{ t('developers') }}
        </el-link>
      </li>
    </ul>
    <div class="lang">
      <el-button
        :icon="IconLang"
        link
        @click="onLang"
      >{{ t('lang') }}</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-container {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .copyright {
    color: #a1a1a1;
    font-family: 'Roboto', sans-serif;
  }

  .navs {
    & > li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
    }
  }

  .lang {
    display: flex;

    .el-icon {
      top: 3px;
    }

    .label {
      margin-left: 3px;
    }
  }
}
</style>
