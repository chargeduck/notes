import{_ as h,D as t,o as k,c as e,k as s,a as i,I as n,w as l,R as p}from"./chunks/framework.3IDgao2s.js";const X=JSON.parse('{"title":"1. TodoList","description":"","frontmatter":{},"headers":[],"relativePath":"language/vue/vue2/index.md","filePath":"language/vue/vue2/index.md"}'),E={name:"language/vue/vue2/index.md"},r=p("",10),d=s("p",null,"v-model本质上是一个语法糖，它可以简化表单输入的绑定。它可以自动根据表单元素的类型来选择正确的绑定方式。",-1),g=s("code",null,":value",-1),y=s("code",null,"@input",-1),c=s("code",null,"v-model",-1),b=p("",5),u=s("p",null,[i("用来实现父子组件的通信， 可以实现子组件和父组件的双向数据绑定。本质上是"),s("code",null,":属性名"),i("和"),s("code",null,"@update:属性名"),i("的合写")],-1),F=p("",26),o=s("p",null,[i("插槽是Vue组件的一种特殊的特性，它允许父组件向子组件传递内容。插槽可以分为默认插槽、具名插槽。"),s("br")],-1),m=p("",26),C=s("thead",null,[s("tr",null,[s("th",{style:{"text-align":"center"}},"区分"),s("th",{style:{"text-align":"center"}},"单页面"),s("th",{style:{"text-align":"center"}},"多页面")])],-1),B=s("tr",null,[s("td",{style:{"text-align":"center"}},"实现方式"),s("td",{style:{"text-align":"center"}},"一个html页面"),s("td",{style:{"text-align":"center"}},"多个html页面")],-1),v=s("td",{style:{"text-align":"center"}},"页面性能",-1),A={style:{"text-align":"center"}},D={style:{"text-align":"center"}},q=s("td",{style:{"text-align":"center"}},"开发效率",-1),_={style:{"text-align":"center"}},x=s("td",{style:{"text-align":"center"}},"适中",-1),f=s("td",{style:{"text-align":"center"}},"用户体验",-1),w={style:{"text-align":"center"}},j=s("td",{style:{"text-align":"center"}},"一般",-1),V=s("td",{style:{"text-align":"center"}},"学习成本",-1),T={style:{"text-align":"center"}},P=s("td",{style:{"text-align":"center"}},"适中",-1),S=s("td",{style:{"text-align":"center"}},"首屏加载",-1),R={style:{"text-align":"center"}},M={style:{"text-align":"center"}},L=s("td",{style:{"text-align":"center"}},"SEO",-1),I={style:{"text-align":"center"}},$={style:{"text-align":"center"}},N=s("tr",null,[s("td",{style:{"text-align":"center"}},"应用场景"),s("td",{style:{"text-align":"center"}},"系统类网站/内部网站/文档/移动站点"),s("td",{style:{"text-align":"center"}},"企业网站/电商网站/门户网站")],-1),O=p("",52),z=p("",33);function J(U,H,Y,G,K,Q){const a=t("font");return k(),e("div",null,[r,s("blockquote",null,[d,s("p",null,[i("在输入框上就相当于"),n(a,{color:"red"},{default:l(()=>[i("是"),g,i("和"),y,i("的简写。")]),_:1}),i(" ，在父子组件传值时，子组件无法直接修改父组件的数据，需要使用"),c,i("来实现。")])]),b,s("blockquote",null,[u,n(a,{color:"red"},{default:l(()=>[i("适用于弹窗类的基础组件， visible 属性的显示隐藏")]),_:1})]),F,s("blockquote",null,[o,n(a,{color:"red"},{default:l(()=>[i("作用域插槽是插槽的一个传参语法，不是新的类别")]),_:1})]),m,s("table",null,[C,s("tbody",null,[B,s("tr",null,[v,s("td",A,[n(a,{color:"green"},{default:l(()=>[i("按需更新，性能较高")]),_:1})]),s("td",D,[n(a,{color:"red"},{default:l(()=>[i("整页更新，性能低")]),_:1})])]),s("tr",null,[q,s("td",_,[n(a,{color:"green"},{default:l(()=>[i("高")]),_:1})]),x]),s("tr",null,[f,s("td",w,[n(a,{color:"green"},{default:l(()=>[i("好")]),_:1})]),j]),s("tr",null,[V,s("td",T,[n(a,{color:"red"},{default:l(()=>[i("高")]),_:1})]),P]),s("tr",null,[S,s("td",R,[n(a,{color:"red"},{default:l(()=>[i("慢")]),_:1})]),s("td",M,[n(a,{color:"green"},{default:l(()=>[i("快")]),_:1})])]),s("tr",null,[L,s("td",I,[n(a,{color:"red"},{default:l(()=>[i("差")]),_:1})]),s("td",$,[n(a,{color:"green"},{default:l(()=>[i("优")]),_:1})])]),N])]),O,s("blockquote",null,[s("p",null,[i("当访问的路由不存在的时候，会出现404页面，需要配置404页面, "),n(a,{color:"red"},{default:l(()=>[i("需要配置在路由的最后，用通配符“*”命中")]),_:1})])]),z])}const Z=h(E,[["render",J]]);export{X as __pageData,Z as default};