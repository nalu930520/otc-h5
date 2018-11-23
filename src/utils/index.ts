import { Vue } from 'vue-property-decorator';

export const VueUse = (Components: any[]) => {
  Components.forEach((component: any) => {
    Vue.use(component);
  });
};

export const isPc = document.body.clientWidth > 768;
