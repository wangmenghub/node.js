/**
 * 公共JavaScript
 * 作者: 卢培培
 * 日期: 2015-04-18
 */

$(function () {
//// 轮播图的间隔时间  2秒
//    $('.carousel').carousel({
//        interval: 4000
//    });

// 首页js代码
    var e = {
        init: function () {
            this.imgtxts = $("#js-bdcnt .js-imgtxt");
            this.sections = $("#js-bdcnt .js-section");
            this.click();
            this.doResize();
            this.resizeTimer = null
        }, initStellar: function () {
            $(window).stellar({
                horizontalScrolling: !1,
                verticalScrolling: !0,
                horizontalOffset: 0,
                verticalOffset: 0,
                responsive: !0,
                scrollProperty: "scroll",
                positionProperty: "transform",
                parallaxBackgrounds: !0,
                parallaxElements: !0,
                hideDistantElements: !0
            })
        }, doResize: function () {
            var r = 662;
            if (e.isLowerIE)r = 770;
            var t = $(window).height(), n = t - 350;
            n = Math.max(500, n);
            var i = Math.floor(.75 * t);
            $(e.mnbd).css("height", Math.max(t, r));
            $(e.imgtxts).css("height", Math.min(860, n));
            $(e.sections).css("height", Math.min(i, 680));
            e.resizeTimer = null
        }, click: function () {
            $("#js-doc .js-gobtn").each(function () {
                $(this).bind("click", function () {
                    var t = $(this).attr("data-target"), n = $(window).height(), r = $(e.imgtxts[0]).height(), i = (n - r - 80) / 2, o = $(t).offset().top - i - 10;
                    $("html, body").animate({scrollTop: o}, 1000);
                })
            });
        }

    };
    e.init(); // 首页js代码结束
    // 振动模式
    $('#shake1').on('click', function () {
        $(this).siblings().removeClass("cur");
        $(this).addClass("cur");
        $('.who-shake').removeClass("middle-shake").removeClass("short-shake").addClass("long-shake");
    });
    $('#shake2').on('click', function () {
        $(this).siblings().removeClass("cur");
        $(this).addClass("cur");
        $('.who-shake').removeClass("long-shake").removeClass("short-shake").addClass("middle-shake");
    });
    $('#shake3').on('click', function () {
        $(this).siblings().removeClass("cur");
        $(this).addClass("cur");
        $('.who-shake').removeClass("middle-shake").removeClass("short-shake").addClass("short-shake");
    });
    $('#shake4').on('click', function () {
        $(this).siblings().removeClass("cur");
        $(this).addClass("cur");
        $('.who-shake').removeClass("long-shake").removeClass("short-shake").removeClass("middle-shake");
    })
});

