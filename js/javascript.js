$(document).ready(function () {
    let Play_begins = false;
    var Fullpage = new fullpage('#fullpage', {
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],//页码后缀
        loopTop: true,//无限循环
        loopBottom: true,
        autoScrolling: false,
        navigation: true,//开启导航条
        navigationTooltips: ['首页', '介绍', '功能', '展示', '关注'],//导航提示内容
        showActiveTooltip: true, //显示导航提示
        // credits: false,
        afterLoad: function (origin, destination, direction) {
            if (destination.index == 2) {
                if (Play_begins == true) { return; }
                window.postMessage({ type: 'Detect_installation_status', data: "莫西莫西,盘络你在吗?" }, '*');
                Play_begins = true
            }


        }

    });
    

    $("#section2 .mx-auto li").hover(function () {
        $(this).addClass("active").siblings().removeClass("active");
    })


});
