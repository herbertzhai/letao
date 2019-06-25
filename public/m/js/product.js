$(function(){
    var id = CT.getParamsByUrl().productId;
    getProductData(id,function(data){
        /*清除加载状态*/
        $('.loading').remove();
        /*渲染商品详情页*/
        $('.mui-scroll').html(template('detail',data));
        /*初始化轮播图*/
        mui('.mui-slider').slider({
            interval:2000,
        });
        /*区域滚动初始化*/
        mui('.mui-scroll-wrapper').scroll({
            indicators:false
        });
        /*1. 尺码的选择*/
        $('.btn_size').on('tap',function(){
            $(this).addClass('now').siblings().removeClass('now');
        });
        /*2. 数量的选择*/
        var currNum = $('.p_number input').val();
        var maxNum = parseInt($('.p_number input').attr('data-max'));
        $('.jia').on('tap',function(){
            if(currNum>=maxNum) {
                /*消息框点击的时候会消失，正好和+号重叠（击穿 tap 也叫 点击穿透），所以设置一个延时*/
                setTimeout(function(){
                    mui.toast('库存不足');
                },100);
                return false;
            }else{
                currNum ++;
                $('.p_number input').val(currNum);
            }
        });
        $('.jian').on('tap',function(){
            if(currNum<=0){
                mui.toast('数量不能小于0');
                return false;
            }else{
                currNum --;
                $('.p_number input').val(currNum);
            }
        });
        /*3. 加入购物车*/
        $('.btn_addCart').on('tap',function(){
            /*数据校验*/
            var $changeBtn = $('.btn_size.now');
            if(!$changeBtn.length){
                mui.toast('请选择尺码');
                return false;
            }
            var num = $('.p_number input').val();
            if(num <= 0){
                mui.toast('至少选择一件商品');
                return false;
            }
            /*提交数据*/
            CT.loginAjax({
                url:'/cart/addCart',
                type:'post',
                data:{
                    productId: id,
                    num: num,
                    size: $changeBtn.html()
                },
                dataType:'json',
                success:function(data){
                    if(data.success == true){
                        /*弹出提示框*/
                        mui.confirm('添加成功，去购物车看看？', '温馨提示', ['是', '否'], function(e) {
                            if (e.index == 0) {
                                location.href = CT.cartUrl;
                            } else {
                                //TODO
                            }
                        });
                    }
                }
            });
        });
    });
});

var getProductData = function(productId,callback){
    $.ajax({
        url:'/product/queryProductDetail',
        type:'get',
        data:{
            id:productId
        },
        dataType:'json',
        success:function(data){
            console.log(data);
            callback && callback(data);
        }
    });
}