var CT = {};
CT.getParamsByUrl = function(){
    /*以对象存储地址栏信息*/
    var params = {};
    var search = location.search;
    if(search){
        search = search.replace('?', '');
        /*如果有多个键值对*/
        var arr = search.split('&');
        arr.forEach(function(item,i){
            var itemArr = item.split('=');
            params[itemArr[0]] = itemArr[1];
        });
        console.log(params);
    }
    return params;
};
/*需要登录的ajax请求*/
CT.loginUrl = '/m/user/login.html';
CT.cartUrl = '/m/user/cart.html';
CT.loginAjax = function(params){
    /*params=====> {}*/
    $.ajax({
        type:params.type || 'get',
        url:params.url || '#',
        data:params.data || '',
        dataType:params.dataType || 'json',
        success:function(data){
            /*未登录的处理 {error: 400, message: "未登录！"}
            所有的需要登录的接口 没有登录都返回这个数据*/
            if(data.error == 400){
                /*把当前地址传递给登录页面，当登录成功后按照地址跳转回来*/
                location.href = CT.loginUrl + '?returnUrl=' + location.href;
                return false;
            }else{
                params.success && params.success(data);
            }
        },
        error:function(){
            mui.toast('服务器繁忙');
        }
    });
};