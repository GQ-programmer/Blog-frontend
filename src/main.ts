import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import routes from "./config/route";
import * as VueRouter from "vue-router";
import mitt from 'mitt' // 导入mitt
import'./global.css'

//引入v-md-editor编辑器
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import '@kangc/v-md-editor/lib/theme/style/github.css';

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';


// 快捷复制代码
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import createCopyCodePreview from '@kangc/v-md-editor/lib/plugins/copy-code/preview';


// highlightjs
import hljs from 'highlight.js';
// 按需引入语言包
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);

VueMarkdownEditor.use(githubTheme, {
    Hljs: hljs,
    config: {
        toc:{
            includeLevel: [1,2,3,4],
        }
    }
});

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

VMdPreviewHtml.use(createCopyCodePreview());
VueMarkdownEditor.use(createCopyCodePlugin());

// 创建路由实例并传递 `routes` 配置
const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})


const app = createApp(App)

app.config.globalProperties.$mitt = mitt() // mitt在vue3中挂载到全局
app.use(Antd)
app.use(router)
app.use(VueMarkdownEditor);
app.use(VMdPreview);

app.mount('#app')
