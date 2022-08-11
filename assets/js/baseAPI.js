//每次调用ajax请求时会先调用这个函数ajaxPrefilter
//在这个函数可以拿到我们提供的配置对象（url,data）
$.ajaxPrefilter(
    function(options) {
        //再发起真正的ajax请求时统一拼接url地址
        options.url = 'http://www.liulongbin.top:3007' + options.url
        if (options.url.indexOf('/my') !== -1) {
            //同意设置请求头
            options.headers = { Authorization: localStorage.getItem('token') || '' }
        }
        //不论成功失败都会调用这个函数
        options.complete = function(res) {
            //在complete回调函数中可以使用res.responseJSON拿到服务器响应的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //强制清空token
                localStorage.removeItem('token')
                    //强制跳回登录页
                location.href = './login.html'
            }
        }
    }
)