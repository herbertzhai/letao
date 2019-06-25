$(function(){
    /*区域滚动初始化*/
   mui('.mui-scroll-wrapper').scroll({
       indicators:false
   });
    /*轮播图初始化*/
    mui('.mui-slider').slider({
        interval:2000,

    });

})