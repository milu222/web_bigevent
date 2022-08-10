//每次调用ajax请求时会先调用这个函数ajaxPrefilter
//在这个函数可以拿到我们提供的配置对象（url,data）
$.ajaxPrefilter(
    function(options) {
        //再发起真正的ajax请求时统一拼接url地址
        options.url = 'http://www.liulongbin.top:3007' + options.url
    }
)