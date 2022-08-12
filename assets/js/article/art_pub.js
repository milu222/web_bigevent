$(function() {
    layer = layui.layer
    var form = layui.form
    InitCate()
        //定义加载文章分类的方法
    function InitCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //调用模板引擎渲染分类下拉菜单
                var htmlStr = template('tpl-pub', res)
                $('[name=cate_id]').html(htmlStr)
                    //调用form.render()方法
                form.render()
                console.log(res)
            }
        })
    }

    initEditor()
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择图片按钮绑定事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //监听coverFile的change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
            var filelist = e.target.files
            if (filelist.length === 0) {
                return layer.msg('请选择照片!')
            }
            //拿到用户选择的文件
            var file = e.target.files[0]
                //根据选择的文件，创建一个对应的 URL 地址
            var newImgURL = URL.createObjectURL(file)
                //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        //定义文章的发布状态
    var art_state = '已发布'
        //为存为草稿绑定事件
    $('#btn-save2').on('click', function() {
            art_state = '草稿'
        })
        //为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
            //1.阻止默认行为
            e.preventDefault()
                //2.基于form表单创建formData对象
            var fd = new FormData($(this)[0])
                //3.将文章的发布状态 存到fd中
            fd.append('state', art_state)
                //4.将裁剪过的图片,输出为一个文件
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    //5.将文件对象存储到fd中
                    fd.append('cover_img', blob)
                        //6.发起ajax数据请求
                    publishArticle(fd)
                })

        })
        //定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意:如果提交的是FormData格式的数据必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                location.href = '/article/art_list.html'
            }
        })
    }
})