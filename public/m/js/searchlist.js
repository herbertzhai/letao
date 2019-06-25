$(function(){
    mui('.mui-scroll-wrapper').scroll({
        indicators:false
    });

    /*1. 页面初始化的时候：关键字在搜索框中显示*/
    /*获取关键字*/
    var urlParams = CT.getParamsByUrl();
    var $input = $('input').val(urlParams.key || '');

    /*2. 页面初始化的时候：根据关键字查询第一页数据*/
    /*下拉刷新配置自动执行， 这里就没必要初始化了，重复操作*/
    /*getSearchData({
       proName:urlParams.key,
        page:1,
        pageSize:4
    },function(data){
        /!*渲染数据*!/
        $('.ct_product').html(template('list',data));
    });*/

    /*3. 用户点击搜索时根据新的关键字搜索商品，重置排序功能*/
    $('.ct_search a').on('tap',function(){
        var key = $('input').val();
        if(!key){
            mui.toast('请输入关键字');
            return false;
        }
        getSearchData({
            proName:key,
            page:1,
            pageSize:4
        },function(data){
            /*渲染数据*/
            $('.ct_product').html(template('list',data));
        });
    });

    /*4. 用户点击排序的时候根据排序的选项排序（默认的时候是 降序，再次点击是 升序）*/
    $('.ct_order a').on('tap', function(){
        /*当前点击的a*/
        var $this = $(this);
        /*如果之前没有被选中*/
        if(!$this.hasClass('now')){
            /*选中，其他的不选中， 箭头默认朝下*/
            $this.addClass('now').siblings().removeClass('now').find('span').addClass('fa-angle-down').removeClass('fa-angle-up') ;
        }
        /*已被选择，有now的时候*/
        else{
            /*改变当前箭头方向*/
            if ($this.find('span').hasClass('fa-angle-down')){
                $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            }else{
                $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }
        /*获取当前点击的功能参数 price 1升序，2降序， num 1升序，2降序*/
        var order = $this.attr('data-order');
        var orderVal = $(this).find('span').hasClass('fa-angle-up')?1:2;
        var key = $('input').val();
        if(!key){
            mui.toast('请输入关键字');
            return false;
        }
        /*再次获取数据*/
        var params = {
            proName:key,
            page:1,
            pageSize:4
            /*排序的方式*/
        };
        params[order] = orderVal;
            getSearchData(params,function(data){
            /*渲染数据*/
            $('.ct_product').html(template('list',data));
        });
    });

    /*5. 用户下拉的时候 根据当前条件刷新 上拉加载重置 排序功能也重置*/
    mui.init({
        pullRefresh : {
            /*下拉容器*/
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            /*下拉*/
            down : {
                /*最近更新的功能*/
                //style:'circle',
                auto: true,
                callback :function(){
                    /*组建对象*/
                    var that = this;
                    var key = $('input').val();
                    if(!key){
                        mui.toast('请输入关键字');
                        return false;
                    }
                    /*重置排序功能*/
                    $('.ct_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');

                    getSearchData({
                        proName:key,
                        page:1,
                        pageSize:4
                    },function(data){
                        setTimeout(function(){
                            /*渲染数据*/
                            $('.ct_product').html(template('list',data));
                            /*注意：停止下拉刷新*/
                            that.endPulldownToRefresh();
                            /*上拉加载重置*/
                            that.refresh(true);
                        },1000);

                    });
                }
            },
            /*上拉*/
            up : {
                //height:50,
                //auto:true,
                contentrefresh : "正在加载...",
                contentnomore:'没有更多数据了',
                callback: function(){
                    window.page ++;
                    /*组建对象*/
                    var that = this;
                    var key = $('input').val();
                    if(!key){
                        mui.toast('请输入关键字');
                        return false;
                    }

                    var order = $('.ct_order a.now').attr('data-order');
                    var orderVal = $('.ct_order a.now').find('span').hasClass('fa-angle-up')?1:2;

                    var params = {
                        proName:key,
                        page:window.page,
                        pageSize:4
                        /*排序的方式*/
                    };
                    params[order] = orderVal;
                    getSearchData(params,function(data) {
                        setTimeout(function () {
                            /*渲染数据*/
                            $('.ct_product').append(template('list', data));
                            /*注意：停止上拉加载*/
                            if(data.data.length){
                                that.endPullupToRefresh();
                            }else{
                                that.endPullupToRefresh(true);
                            }
                        }, 1000);
                    });
                }
            }
        }
    });

    /*6. 用户上拉的时候 加载下一页数据（没有数据不去加载）*/

});

var getSearchData = function(params,callback){
    $.ajax({
        url:'/product/queryProduct',
        type:'get',
        data:params,
        dataType:'json',
        success:function(data){
            /*存当前页码*/
            window.page = data.page;
            callback && callback(data);
        }
    });
}