<script lang="ts" setup></script>

<template>
  <div class="page-not-found">
    <h1>404</h1>
    <p>Страница не найдена</p>
    <el-link
      href="/"
      type="primary"
    >
      Вернуться на главную страницу
    </el-link>
  </div>
</template>

<style lang="scss" scoped>
.page-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 24px;
  text-align: center;

  h1 {
    font-size: 72px;
    margin-bottom: 20px;
  }

  p {
    margin-bottom: 20px;
  }

  el-link {
    color: #409eff;
  }
}
</style>
