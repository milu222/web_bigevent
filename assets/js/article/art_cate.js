$(function() {
    var layer = layui.layer
    var form = layui.form
        //获取文章分类列表
    initArtCaseList()

    function initArtCaseList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败!')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    //为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                title: '添加文章分类',
                content: $('#dialog-add').html(),
                type: 1,
                area: ['500px', '250px'],
            })
        })
        //通过代理为form-add绑定提交事件
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                url: '/my/article/addcates',
                method: 'POST',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        //根据索引关闭对应的弹出层
                        layer.close(indexAdd)
                        return layer.msg(res.message)
                    } else {
                        initArtCaseList()
                        layer.msg(res.message)
                            //根据索引关闭对应的弹出层
                        layer.close(indexAdd)
                    }
                }
            })
        })
        //通过事件委托为编辑按钮绑定事件
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function(e) {
            //弹出修改文章分类层
            indexEdit = layer.open({
                title: '修改文章分类',
                content: $('#dialog-edit').html(),
                type: 1,
                area: ['500px', '250px'],
            })
            var id = $(this).attr('data-id')
                //发起请求获取对应数据
            $.ajax({
                url: '/my/article/cates/' + id,
                method: 'GET',
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    } else {
                        form.val('form-edit', res.data)
                    }
                }
            })
        })
        //事件委托绑定确认修改按钮
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                url: '/my/article/updatecate',
                method: 'POST',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    } else {
                        layer.msg(res.message)
                            //关闭弹出层
                        layer.close(indexEdit)
                            //刷新表格数据
                        initArtCaseList()
                    }
                }
            })
        })
        //删除按钮的事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            //提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'GET',
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    } else {
                        layer.close(index)
                        layer.msg(res.message)
                            //刷新表格数据
                        initArtCaseList()
                    }
                }
            })
        })
    })
})