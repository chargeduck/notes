import{_ as l,D as r,o as h,c as p,k as s,a as i,I as n,w as t,R as e}from"./chunks/framework.3IDgao2s.js";const f=JSON.parse('{"title":"1. sh方式安装","description":"","frontmatter":{},"headers":[],"relativePath":"server/Gitlab.md","filePath":"server/Gitlab.md"}'),k={name:"server/Gitlab.md"},d={class:"tip custom-block"},o=s("p",{class:"custom-block-title"},"TIP",-1),c=s("p",null,[i("这个是看Jenkins的时候附带的gitlab教程，反正是没有自己安装过，看看也没啥影响，"),s("a",{href:"https://www.bilibili.com/video/BV1bS4y1471A?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=5",target:"_blank",rel:"noreferrer"},"教程地址")],-1),F=e(`<blockquote><p><a href="https://about.gitlab.com" target="_blank" rel="noreferrer">官网网址</a>,或者访问国内的<a href="https://gitlab.cn" target="_blank" rel="noreferrer">极狐gitlab</a>. 官方的<a href="https://gitlab.cn/install/?version=ce" target="_blank" rel="noreferrer">安装文档地址</a></p></blockquote><h1 id="_1-sh方式安装" tabindex="-1">1. sh方式安装 <a class="header-anchor" href="#_1-sh方式安装" aria-label="Permalink to &quot;1. sh方式安装&quot;">​</a></h1><h2 id="_1-安装依赖" tabindex="-1">1. 安装依赖 <a class="header-anchor" href="#_1-安装依赖" aria-label="Permalink to &quot;1. 安装依赖&quot;">​</a></h2><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yum</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> policycoreutils-pyythod</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> openssh-server</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> perl</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> enable</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sshd</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> start</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sshd</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="_2-配置镜像" tabindex="-1">2. 配置镜像 <a class="header-anchor" href="#_2-配置镜像" aria-label="Permalink to &quot;2. 配置镜像&quot;">​</a></h2><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -fssL</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://packages.gitlab.cn/repository/raw/scripts/setup.sh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> /bin/bash</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="_3-安装" tabindex="-1">3. 安装 <a class="header-anchor" href="#_3-安装" aria-label="Permalink to &quot;3. 安装&quot;">​</a></h2>`,7),g=s("code",null,"/etc/gitlab/initial_root_password",-1),b=e(`<div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> EXTERNAL_URL=&quot;http://192.168.159.134&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yum</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> gitlab-jh</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="_4-常用命令" tabindex="-1">4. 常用命令 <a class="header-anchor" href="#_4-常用命令" aria-label="Permalink to &quot;4. 常用命令&quot;">​</a></h2><table><thead><tr><th>序号</th><th>命令</th><th>描述</th></tr></thead><tbody><tr><td>1</td><td>gitlab-ctl start</td><td>启动所有的gitlab组件</td></tr><tr><td>2</td><td>gitlab-ctl stop</td><td>停止</td></tr><tr><td>3</td><td>gitlab-ctl restart</td><td>重启</td></tr><tr><td>4</td><td>gitlab-ctl status</td><td>查看状态</td></tr><tr><td>5</td><td>gitlab-ctl reconfigure</td><td>启动拂去</td></tr><tr><td>6</td><td>gitlab-ctl tail</td><td>查看日志</td></tr><tr><td>7</td><td>vim /etc/gitlab/gitlab.rb</td><td>修改配置文件</td></tr></tbody></table><h1 id="_2-docker安装" tabindex="-1">2. Docker安装 <a class="header-anchor" href="#_2-docker安装" aria-label="Permalink to &quot;2. Docker安装&quot;">​</a></h1><h2 id="_1-安装docker" tabindex="-1">1. 安装Docker <a class="header-anchor" href="#_1-安装docker" aria-label="Permalink to &quot;1. 安装Docker&quot;">​</a></h2><blockquote><p><a href="/notes/server/docker.html">参考链接</a></p></blockquote><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 更新yum</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yum</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> update</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 安装依赖 </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yum</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yum-utils</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> device-mapper-persistent-data</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> lvm2</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 配置阿里云镜像</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yum-config-manager</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --add-repo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看可用的版本</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">list</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker-ce</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --showduplicates</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> sort</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -r</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 安装</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yum</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 配置开机启动</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> start</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> enable</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h2 id="_2-安装" tabindex="-1">2. 安装 <a class="header-anchor" href="#_2-安装" aria-label="Permalink to &quot;2. 安装&quot;">​</a></h2><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 设置环境变量</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> GITLAB_HOME</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/srv/gitlab</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --detach</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --hostname</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 192.168</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.159.137</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --publish</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 443</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">:443</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --publish</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 80</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">:80</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> gitlab</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --restart</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> always</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --volume</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $GITLAB_HOME</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/config:/etc/gitlab</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --volume</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $GITLAB_HOME</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/logs:/var/log/gitlab</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --volume</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $GITLAB_HOME</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/data:/var/opt/gitlab</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --shm-size</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 256</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">m</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  registry.gitlab.cn/omnibus/gitlab-jh:latest</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="_1-权限错误" tabindex="-1">1. 权限错误 <a class="header-anchor" href="#_1-权限错误" aria-label="Permalink to &quot;1. 权限错误&quot;">​</a></h3><blockquote><p>Preparing services... Starting services... /opt/gitlab/embedded/bin/runsvdir-start: line 24: ulimit: pending signals: cannot modify limit: Operation not permitted /opt/gitlab/embedded/bin/runsvdir-start: line 37: /proc/sys/fs/file-max: Read-only file system Configuring GitLab package... Configuring GitLab...</p></blockquote><h1 id="error-executing-action-run-on-resource-ruby-block-directory-resource-var-opt-gitlab-git-data-repositories" tabindex="-1">================================================================================ Error executing action <code>run</code> on resource &#39;ruby_block[directory resource: /var/opt/gitlab/git-data/repositories]&#39; <a class="header-anchor" href="#error-executing-action-run-on-resource-ruby-block-directory-resource-var-opt-gitlab-git-data-repositories" aria-label="Permalink to &quot;================================================================================
Error executing action \`run\` on resource &#39;ruby_block[directory resource: /var/opt/gitlab/git-data/repositories]&#39;&quot;">​</a></h1><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2770</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /srv/gitlab/data/git-data/repositories</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div>`,13);function u(y,C,m,B,_,v){const a=r("font");return h(),p("div",null,[s("div",d,[o,c,s("p",null,[i("GitLab需要启动的服务比较多，建议"),n(a,{color:"red"},{default:t(()=>[i("最少需要配置6GB内存。")]),_:1})])]),F,s("blockquote",null,[s("p",null,[i("不指定自定义密码的划，会在"),g,i("随机生成一个，"),s("strong",null,[n(a,{color:"red"},{default:t(()=>[i("该文件会在24小时后删除")]),_:1})]),i("，因此建议安装完成后立即修改密码。")])]),b])}const A=l(k,[["render",u]]);export{f as __pageData,A as default};