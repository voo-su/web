<script lang="ts" setup>
import IconLang from '@/components/icons/IconLang.vue'
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n()

const languages = [
  {
    label: 'Русский',
    value: 'ru'
  }
]
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
    </ul>
    <div class="lang">
      <el-select-v2
        v-model="locale"
        :options="languages"
        size="small"
      >
        <template #label="{ label }">
          <el-icon :size="14">
            <icon-lang />
          </el-icon>
          <span class="label">{{ label }}</span>
        </template>
      </el-select-v2>
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
    width: 15%;

    .el-icon {
      top: 3px;
    }

    .label {
      margin-left: 3px;
    }
  }
}
</style>
