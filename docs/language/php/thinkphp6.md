::: tip
ThinkPHP6.0快速入门, [PHP笔记目录](/language/php/)
:::
# 1. 基础环境安装和网站搭建

1. 安装 phpstudy 
2. 在 phpstudy 中安装 composer php 
> nginx 和 mysql我本地都有，但是不知道怎么用外部的，没搞明白
3. 创建站点
> 网站里创建个站点， 然后进入到那个文件夹，然后执行 
> ```shell 
> composer create-project topthink/think tp6
> ```
> 在phpstudy里边指定 网站根目录下边的 `tp/public` 目录即可
> [ThinkPhp6 官方文档](https://doc.thinkphp.cn/v6_1/anzhuangThinkPHP.html)
4. 删除`tp/app下的controller目录`, 将应用改为多应用模式
5. 安装多应用扩展
```text
composer require topthink/think-multi-app
```
6. 创建admin应用,需要再tp目录下执行
```shell
php think build admin
```
7. 创建控制器
```shell
# --plain 加了就只创建个空的类， 不加则添加一些默认的方法
php think make:controller admin@Login --plain
```
8. 测试访问
```shell
localhost/index.php/admin/index/index
```
# 2. ThinkPhp
## 2.1 一些配置
1. Apache入口重写 把以下内容放到`tp/public/.htaccess`中
```shell
<IfModule mod_rewrite.c>
  Options +FollowSymlinks -Multiviews
  RewriteEngine On

  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^(.*)$ index.php/$1 [QSA,PT,L]
</IfModule>
```
2. Nginx 入口重写
```txt
// 把这一段放到 localtion / {} 中重启nginx
if (!-e $request_filename) {
    rewrite  ^/(.*)$  /index.php?s=$1  last;
    break;
}
```
3. 针对单独的应用配置不同的项目配置，把项目根目录的 config 和 route 两个目录复制到应用目录下。 4修改错误信息展示 修改`app/admin/config/app.php`
```php
 return [
    // 省略无用配置
    'show_error_msg'   => true,
];
```
## 2.2 Request
1. 构造器注入
> 通过构造器注入的方式获取到Request对象，然后通过Request对象获取到请求的参数

```php
use think\Request;
class Index {

    public function __construct(public Request $request) {}

    public function index() {
        // tp对于 var_dump的封装
        dump($this->request->param());
        $nameParam = $this->request->param("name");
        // tp对于 var_dump的封装,下方的方法不执行了
        dd($nameParam);
        return "您好！这是一个[$nameParam]示例应用";
    }
}
```
2. 通过 `Facade`机制来静态调用请求队形的方法
```php
use think\facade\Request;

class Index {
    public function index() {
        // tp对于 var_dump的封装
        dump(Request::param());
        $nameParam = Request::param('name');
        // tp对于 var_dump的封装,下方的方法不执行了
        dd($nameParam);
    }
}
```
3. 直接使用`request()`函数获取参数
```php
// 低版本好像需要 用use think\Request 引用
class Index {
    public function index() {
       return request()->param("name");
    }
} 
```
## 2.3 input 函数
> 也是用来接收前端参数的
1. 直接拿参数
```php
class Index {
    public function index() {
        return input('name');
    }
}
```
2. 指定请求类型
```php
input('get.name');
input('post.name');
```
## 2.4 view()函数
> 这玩意需要安装驱动 在项目根目录下执行
> ```shell
> composer require topthink/think-view
>```
> 使用 `view()`返回视图对象，默认是`view/index/index.html`,感觉和 `thymeleaf` 差不多,
> 想用其他页面的划，就使用`view('{htmlName}')`方法,替换成对应的html页面名字就行
```php
class Index {
    public function index() {
        return view();
    }
}
```
> 如果需要往视图层传递数据的划，需要在模板名称后便加上一个数组，数组的键名就是需要传递的变量名
```php
return view('index',[
    'name' => '张三',
    'age' => 18
]);
```
```html
<h1>您好，{$name}，今年{$age}岁了</h1>
```
## 2.5 json() 函数
> 返回json数据, 有一点些微的不一样，方法里传入的是一个数据
```php
class Index {
    public function index() {
        return json([
            'code' => 200,
            'msg' => 'success',
            'data' => [
                'name' => '张三',
                'age' => 18
            ]
        ]);
    }
}
```
## 2.6 连接数据库
1. 修改配置文件 `tp/.env` 文件
2. 使用数据库
```php
 use DateTime;
use think\facade\Db;

class Index {
    public function index() {

        $dataArr = [
            "nickname" => "admin",
            "password" => md5("123456"),
            "info" => "123456",
            "last_login_ip" => request()->ip(),
            "admin_flag" => 0,
            "status" => 1,
            "create_by" => "admin",
            "update_by" => "admin",
            "create_time" => new DateTime(),
            "update_time" => new DateTime(),
            "del_flag" => 0,
        ];
        $insert = Db::table('tb_user')->insertGetId($dataArr);
        $result = [
            "data" => $dataArr,
            "effect" => $insert,
            "msg" => "成功",
            "code" => 200,
        ];
        return json($result);
    }
}
```
## 2.7 验证码
> tp的验证码是使用`captcha`扩展来实现的，需要安装扩展
> ```shell
> composer require topthink/think-captcha
> ```
```php
use think\captcha\facade\Captcha;
class Index {
    public function index() {
        return Captcha::create();
    }
}
```
> 在`tp/config/captcha.php`配置文件中可以修改验证码的样式, 自定义配置修改最后的 verify 配置即可
```php
return [
    // 添加额外的验证码设置
    "verify" => [
         'length'=>4,
    ],
]
```
> 还有一个最最最关键的一步，需要在`app/middleware/php`开启session存储，不然永远返回false.
```php
return [
    // Session初始化
     \think\middleware\SessionInit::class
];
```
> 这里可以自己创建一个Result返回类
```php
class Result {
    public function __construct( public int $code, public string $message, public mixed $data) {
    }

    public static function success(string $message, mixed $data): Result {
        return new Result(200,$message,$data);
    }

    public static function quickSuccess( mixed $data): Result {
        return self::success('success', $data);
    }

    public static function error(string $message, mixed $data): Result {
        return new Result(500,$message,$data);
    }

    public static function quickError( mixed $data): Result {
        return self::error('error', $data);
    }

}
```
```php
public function checkCaptcha(): Json {
    return json(Result::quickSuccess(Captcha::check(input('post.captcha'))));
}
```

