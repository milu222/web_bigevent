$(function() {
        //调用获取用户基本信息
        getUserInfo()
            //退出按钮
        var layer = layui.layer
        $('#btn-logout').on('click', function() {
            //提示用户是否确认退出
            layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function(index) {
                //清空本地存储的token
                localStorage.removeItem('token')
                    //跳转到登录页面
                location.href = './login.html'
                    //关闭confirm弹出框
                layer.close(index)
            });
        })
    })
    //获取用户基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //调用这个函数渲染用户头像
            renderAvatar(res.data)
        },
    })
}
//渲染用户头像函数
function renderAvatar(user) {
    //1.获取用户名字
    var name = user.nickname || user.username
        //2.渲染用户名字
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        //判断是否有头像
    if (user.user_pic !== null) {
        //渲染头像图片
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avater').hide()
    } else {
        //渲染字母头像
        $('.layui-nav-img').hide()
            //首字母大写
        var first = name[0].toUpperCase()
        $('.text-avater').html(first).show()
    }

}