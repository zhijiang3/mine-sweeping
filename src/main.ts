import '@/assets/styles/iconfont.scss';
import { createApp } from 'vue';
import App from './App.vue';
import clickOutside from '@/directives/clickOutside';

createApp(App)
  .directive('click-outside', clickOutside)
  .mount('#app');
