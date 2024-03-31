<script lang="ts" setup>
import IconLang from '@/components/icons/IconLang.vue'</script>

<template>
  <div class="footer-container">
    <div class="copyright">
      <b>© {{ new Date().getFullYear() }} Voo.su</b>
    </div>
    <ul class="navs">
      <li>
        <el-link href="/terms">
          Правила
        </el-link>
      </li>
    </ul>
    <div class="lang">
      <el-icon :size="14">
        <icon-lang />
      </el-icon>
      Русский
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-container {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  //border-top: 1px solid var(--el-border-color);

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
}
</style>
