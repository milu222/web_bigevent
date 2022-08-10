$(function() {
    //点击去注册
    $('#link_reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        //点击去登录
    $('#link_login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layul中获取form对象 制作表单自定义验证
    var form = layui.form
    var layer = layui.layer
        //通过form.verify()自定义检验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //注册密码一致验证
        repwd: function(value) { //value：表单的值、item：表单的DOM对象
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                console.log(value, pwd)
                return '两次密码输入不一致'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            e.preventDefault()
            var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功')
                    //自动跳转登录
                $('#link_login').click()
            })
        })
        //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                    //将登录成功得到的token保存到localStorage中
                localStorage.setItem('token', res.token)
                    //跳转到首页
                location.href = './index.html'
            }
        })
    })
})