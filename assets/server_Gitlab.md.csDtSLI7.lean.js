import{_ as l,D as r,o as h,c as p,k as s,a as i,I as n,w as t,R as e}from"./chunks/framework.3IDgao2s.js";const f=JSON.parse('{"title":"1. sh方式安装","description":"","frontmatter":{},"headers":[],"relativePath":"server/Gitlab.md","filePath":"server/Gitlab.md"}'),k={name:"server/Gitlab.md"},d={class:"tip custom-block"},o=s("p",{class:"custom-block-title"},"TIP",-1),c=s("p",null,[i("这个是看Jenkins的时候附带的gitlab教程，反正是没有自己安装过，看看也没啥影响，"),s("a",{href:"https://www.bilibili.com/video/BV1bS4y1471A?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=5",target:"_blank",rel:"noreferrer"},"教程地址")],-1),F=e("",7),g=s("code",null,"/etc/gitlab/initial_root_password",-1),b=e("",13);function u(y,C,m,B,_,v){const a=r("font");return h(),p("div",null,[s("div",d,[o,c,s("p",null,[i("GitLab需要启动的服务比较多，建议"),n(a,{color:"red"},{default:t(()=>[i("最少需要配置6GB内存。")]),_:1})])]),F,s("blockquote",null,[s("p",null,[i("不指定自定义密码的划，会在"),g,i("随机生成一个，"),s("strong",null,[n(a,{color:"red"},{default:t(()=>[i("该文件会在24小时后删除")]),_:1})]),i("，因此建议安装完成后立即修改密码。")])]),b])}const A=l(k,[["render",u]]);export{f as __pageData,A as default};