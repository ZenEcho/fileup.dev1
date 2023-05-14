var Fullpage = new fullpage('#fullpage', {

    anchors: ['page1', 'page2', 'page3', 'page4'],//页码后缀
    loopTop: true,//无限循环
    loopBottom: true,
    // navigation: true,//开启导航条
    navigationTooltips: ['Page 1', 'Page 2', 'Page 3', 'Page 4'],//导航提示内容
    showActiveTooltip: true, //显示导航提示
    // credits: false,
    afterLoad: function (origin, destination, direction) {
        if (destination.index == 1) {
            $("#section1 img").css("left", 0 + "px")
        } else {
            $("#section1 img").css("left", "100%")
        }


    }

});
$("#section2 .mx-auto li").hover(function () {
    $(this).addClass("active").siblings().removeClass("active");
})
