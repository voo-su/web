<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="loading-content">
    <div class="ant-spin ant-spin-lg ant-spin-spinning">
      <span class="ant-spin-dot ant-spin-dot-spin">
        <i class="ant-spin-dot-item" />
        <i class="ant-spin-dot-item" />
        <i class="ant-spin-dot-item" />
        <i class="ant-spin-dot-item" />
      </span>
    </div>
    <p>{{ t('loadingData') }}</p>
  </div>
</template>

<style lang="scss" scoped>
.loading-content {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;

  p {
    margin-top: 10px;
    color: rgb(194 194 194);
  }
}

.ant-spin {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  -webkit-font-feature-settings: 'tnum';
  font-feature-settings: 'tnum';
  position: absolute;
  display: none;
  color: #ececec;
  text-align: center;
  vertical-align: middle;
  opacity: 0;
  -webkit-transition: -webkit-transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  transition: -webkit-transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86),
  -webkit-transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
}

.ant-spin-spinning {
  position: static;
  display: inline-block;
  opacity: 1;
}

.ant-spin-nested-loading {
  position: relative;
}

.ant-spin-nested-loading > div > .ant-spin {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  display: block;
  width: 100%;
  height: 100%;
  max-height: 400px;
}

.ant-spin-nested-loading > div > .ant-spin .ant-spin-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -10px;
}

.ant-spin-nested-loading > div > .ant-spin .ant-spin-text {
  position: absolute;
  top: 50%;
  width: 100%;
  padding-top: 5px;
  text-shadow: 0 1px 2px #fff;
}

.ant-spin-nested-loading > div > .ant-spin.ant-spin-show-text .ant-spin-dot {
  margin-top: -20px;
}

.ant-spin-nested-loading > div > .ant-spin-sm .ant-spin-dot {
  margin: -7px;
}

.ant-spin-nested-loading > div > .ant-spin-sm .ant-spin-text {
  padding-top: 2px;
}

.ant-spin-nested-loading > div > .ant-spin-sm.ant-spin-show-text .ant-spin-dot {
  margin-top: -17px;
}

.ant-spin-nested-loading > div > .ant-spin-lg .ant-spin-dot {
  margin: -16px;
}

.ant-spin-nested-loading > div > .ant-spin-lg .ant-spin-text {
  padding-top: 11px;
}

.ant-spin-nested-loading > div > .ant-spin-lg.ant-spin-show-text .ant-spin-dot {
  margin-top: -26px;
}

.ant-spin-container {
  position: relative;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}

.ant-spin-container::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: none \9
;
  width: 100%;
  height: 100%;
  background: #fff;
  opacity: 0;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  content: '';
  pointer-events: none;
}

.ant-spin-blur {
  clear: both;
  overflow: hidden;
  opacity: 0.5;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
}

.ant-spin-blur::after {
  opacity: 0.4;
  pointer-events: auto;
}

.ant-spin-tip {
  color: rgba(0, 0, 0, 0.45);
}

.ant-spin-dot {
  position: relative;
  display: inline-block;
  font-size: 20px;
  width: 1em;
  height: 1em;
}

.ant-spin-dot-item {
  position: absolute;
  display: block;
  width: 9px;
  height: 9px;
  background-color: #ececec;
  border-radius: 100%;
  -webkit-transform: scale(0.75);
  transform: scale(0.75);
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
  opacity: 0.3;
  -webkit-animation: antSpinMove 1s infinite linear alternate;
  animation: antSpinMove 1s infinite linear alternate;
}

.ant-spin-dot-item:nth-child(1) {
  top: 0;
  left: 0;
}

.ant-spin-dot-item:nth-child(2) {
  top: 0;
  right: 0;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.ant-spin-dot-item:nth-child(3) {
  right: 0;
  bottom: 0;
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.ant-spin-dot-item:nth-child(4) {
  bottom: 0;
  left: 0;
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}

.ant-spin-dot-spin {
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-animation: antRotate 1.2s infinite linear;
  animation: antRotate 1.2s infinite linear;
}

.ant-spin-sm .ant-spin-dot {
  font-size: 14px;
}

.ant-spin-sm .ant-spin-dot i {
  width: 6px;
  height: 6px;
}

.ant-spin-lg .ant-spin-dot {
  font-size: 32px;
}

.ant-spin-lg .ant-spin-dot i {
  width: 14px;
  height: 14px;
}

.ant-spin.ant-spin-show-text .ant-spin-text {
  display: block;
}

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .ant-spin-blur {
    background: #fff;
    opacity: 0.5;
  }
}

@-webkit-keyframes antSpinMove {
  to {
    opacity: 1;
  }
}

@keyframes antSpinMove {
  to {
    opacity: 1;
  }
}

@-webkit-keyframes antRotate {
  to {
    -webkit-transform: rotate(405deg);
    transform: rotate(405deg);
  }
}

@keyframes antRotate {
  to {
    -webkit-transform: rotate(405deg);
    transform: rotate(405deg);
  }
}

.ant-spin-rtl {
  direction: rtl;
}

.ant-spin-rtl .ant-spin-dot-spin {
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-animation-name: antRotateRtl;
  animation-name: antRotateRtl;
}

@-webkit-keyframes antRotateRtl {
  to {
    -webkit-transform: rotate(-405deg);
    transform: rotate(-405deg);
  }
}

@keyframes antRotateRtl {
  to {
    -webkit-transform: rotate(-405deg);
    transform: rotate(-405deg);
  }
}

</style>
