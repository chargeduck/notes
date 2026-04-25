// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 引入自定义样式
import "./style.css";

export default {
    ...DefaultTheme,
    NotFound: () => "404",
    enhanceApp({ app }) {
        app.use(ElementPlus);
    },
};