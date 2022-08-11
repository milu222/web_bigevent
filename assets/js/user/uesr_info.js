$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6位字符'
            }
        }
    })
    initUserInfo()
        //初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                //调用form.val()快速为表单赋值
                form.val('form_userInfo', res.data)
            }
        })
    }
    //重置表单数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    //更新用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                    //调用父页面的方法 重新渲染用户名字和头像
                window.parent.getUserInfo()
            }
        })
    })
})