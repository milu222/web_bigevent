$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        //定义一个查询的参数对象
        //发请求的时候提交的数据
    var q = {
        pagenum: 1, //页码值 默认1
        pagesize: 2, //默认每页2条数据
        cate_id: '', //文章分类的id
        state: '', //文章发布状态
    }

    //定义美化时间的过滤器
    template.defaults.imports.dataFormate = function(data) {
        const dt = new Date(data)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    //定义补0的函数
    function padZero(n) {
        return (n > 9) ? n : '0' + n
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引起渲染筛选分类
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    //通知layui重新渲染ui结构
                form.render()
            }
        })
    }
    initTable()
    initCate()
        //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                } else {
                    //使用模板引擎渲染页面数据
                    var htmlStr = template('tpl-table', res)
                    $('tbody').html(htmlStr)
                        //调用渲染分页的方法
                    renderPage(res.total)
                }
            }
        })
    }
    //筛选功能的实现
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                //获取表单中选中项的值
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                //值填充到q对象中
            q.cate_id = cate_id
            q.state = state
                //根据最新的q 重新渲染表格数据
            initTable()
        })
        //定义渲染分页的方法
    function renderPage(total) {
        //调用这个方法渲染分页
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认选择第几页
            //每页条数的选择框
            limits: [2, 3, 5, 10, 20],
            //自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //分页发生切换触发这个回调函数
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    //根据最新的q 重新渲染表格数据
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //删除文章事件 通过事件委托
    $('tbody').on('click', '.btn-delete', function() {
        //获取页面有几个删除按钮
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        console.log(id)
            //询问是否要删除数据
        layer.confirm('确认要删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                        //当数据删除完成后 需要判断当前这一页是否还有剩余的数据
                        //没有数据就让页码-1  然后在渲染数据
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        initTable()

                    }
                    initTable()
                }
            })

            layer.close(index)
        })
    })
})