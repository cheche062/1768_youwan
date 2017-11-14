{
    const app = window.app;
    let RESOURCE = app.config.RESOURCE;
    let XML = Laya.Loader.XML;
    let IMAGE = Laya.Loader.IMAGE;
    let ATLAS = Laya.Loader.ATLAS;
    let BUFFER = Laya.Loader.BUFFER;

    // 字体资源
    let fonts = [
        { url: "images/font/light_font.fnt", name: 'light_font', type: XML },
        { url: "images/font/win_font.fnt", name: 'win_font', type: XML },
        { url: "images/font/blue.fnt", name: 'blue', type: XML },
        { url: "images/font/colors.fnt", name: 'colors', type: XML },
        { url: "images/font/cyan.fnt", name: 'cyan', type: XML },
        { url: "images/font/gray.fnt", name: 'gray', type: XML },
        { url: "images/font/green.fnt", name: 'green', type: XML },
        { url: "images/font/orange.fnt", name: 'orange', type: XML },
        { url: "images/font/pink.fnt", name: 'pink', type: XML },
        { url: "images/font/purple.fnt", name: 'purple', type: XML }
    ];

    // loading需要的资源优先加载
    let loadingRes = [
        { url: "images/load/bg.png", type: IMAGE },
        { url: "images/load/fangchenmi.png", type: IMAGE },
        { url: "images/load/logo.png", type: IMAGE },

        // load加载页的骨骼动画
        {url: 'images/animation/loding.sk', type: BUFFER},
        {url: 'images/animation/loding.png', type: IMAGE},

        { url: "res/atlas/images/load.json", type: ATLAS }
    ]

    // 不打包图片资源
    let unPackRes = [
        // room
        { url: "images/room/trianglebg.png", type: IMAGE },
        { url: "images/room/bg.jpg", type: IMAGE },
        { url: "images/room/bottom.png", type: IMAGE },
        { url: "images/room/marquee.png", type: IMAGE },
        { url: "images/room/top.png", type: IMAGE },
        { url: "images/room/upbg.png", type: IMAGE },

        // 骨骼动画的资源
        {url: 'images/animation/triangle/blue.sk', type: BUFFER},
        {url: 'images/animation/triangle/blue.png', type: IMAGE},
        {url: 'images/animation/triangle/colors.sk', type: BUFFER},
        {url: 'images/animation/triangle/colors.png', type: IMAGE},
        {url: 'images/animation/triangle/cyan.sk', type: BUFFER},
        {url: 'images/animation/triangle/cyan.png', type: IMAGE},
        {url: 'images/animation/triangle/gray.sk', type: BUFFER},
        {url: 'images/animation/triangle/gray.png', type: IMAGE},
        {url: 'images/animation/triangle/green.sk', type: BUFFER},
        {url: 'images/animation/triangle/green.png', type: IMAGE},
        {url: 'images/animation/triangle/orange.sk', type: BUFFER},
        {url: 'images/animation/triangle/orange.png', type: IMAGE},
        {url: 'images/animation/triangle/pink.sk', type: BUFFER},
        {url: 'images/animation/triangle/pink.png', type: IMAGE},
        {url: 'images/animation/triangle/purple.sk', type: BUFFER},
        {url: 'images/animation/triangle/purple.png', type: IMAGE},

        {url: 'images/animation/bonus.sk', type: BUFFER},
        {url: 'images/animation/bonus.png', type: IMAGE},

        {url: 'images/animation/btn_start.sk', type: BUFFER},
        {url: 'images/animation/btn_start.png', type: IMAGE},

        {url: 'images/animation/surprise.sk', type: BUFFER},
        {url: 'images/animation/surprise.png', type: IMAGE},

        {url: 'images/animation/coins.sk', type: BUFFER},
        {url: 'images/animation/coins.png', type: IMAGE},

        {url: 'images/animation/fudai.sk', type: BUFFER},
        {url: 'images/animation/fudai.png', type: IMAGE},

        {url: 'images/animation/fantastic.sk', type: BUFFER},
        {url: 'images/animation/fantastic.png', type: IMAGE},

        {url: 'images/animation/perfect.sk', type: BUFFER},
        {url: 'images/animation/perfect.png', type: IMAGE},

        {url: 'images/animation/bonusAward.sk', type: BUFFER},
        {url: 'images/animation/bonusAward.png', type: IMAGE},

        {url: 'images/animation/finger.sk', type: BUFFER},
        {url: 'images/animation/finger.png', type: IMAGE},

        {url: 'images/animation/notice.sk', type: BUFFER},
        {url: 'images/animation/notice.png', type: IMAGE},

        {url: 'images/animation/yellow_light.sk', type: BUFFER},
        {url: 'images/animation/yellow_light.png', type: IMAGE},
        
        {url: 'images/animation/win.sk', type: BUFFER},
        {url: 'images/animation/win.png', type: IMAGE}

    ];

    // 打包的json文件
    let packRes = [
        // room
        { url: 'res/atlas/images/room.json', type: ATLAS },
        //pop
        { url: 'res/atlas/images/pop.json', type: ATLAS }

    ];

    // 卢
    let popLu = [
        // pop
        { url: "images/pop/btn_chong.png", type: IMAGE },
        { url: "images/pop/help_0.png", type: IMAGE },
        { url: "images/pop/help_1.png", type: IMAGE },
        { url: "images/pop/help_bg.png", type: IMAGE },
        { url: "images/pop/helpt.png", type: IMAGE },
        { url: "images/pop/inputbg.png", type: IMAGE },
        { url: "images/pop/popbg.png", type: IMAGE },
        { url: "images/pop/rechargeT.png", type: IMAGE },
        { url: "images/pop/rg1.png", type: IMAGE },
        { url: "images/pop/rt.png", type: IMAGE }
    ]

    // 字体
    RESOURCE.fonts = fonts;
    // 加载页资源
    RESOURCE.loadingRes = loadingRes;
    // 非加载页资源
    RESOURCE.disLoadingRes = [...unPackRes, ...packRes, ...popLu];

    // 总的资源
    RESOURCE.images = [...unPackRes, ...packRes, ...loadingRes, ...popLu];

    // 添加版本号
    let _GAME_RES = [...RESOURCE.fonts, ...RESOURCE.images];
    let GAME_VERSION = app.config.GAME_VERSION;

    let staticVertion = window.staticVertion || Date.now();
    let loop = (arr) => {
        if (typeof arr !== 'object') {
            return;
        }
        arr.forEach(function(item, i) {
            let newUrl;
            let jsonIndex;
            let fntIndex;
            if (typeof item.url === 'string') {
                // 若加载后缀有 .json 和.fnt 的, 则连它们对应的 png一起添加了
                jsonIndex = item.url.indexOf('.json');
                fntIndex = item.url.indexOf('.fnt');
                if (jsonIndex > -1) {
                    newUrl = item.url.substr(0, jsonIndex) + '.png';
                } else if (fntIndex > -1) {
                    newUrl = item.url.substr(0, fntIndex) + '.png';
                }

                if (newUrl) {
                    GAME_VERSION[newUrl] = staticVertion;
                }

                GAME_VERSION[item.url] = staticVertion;
            } else {
                loop(item);
            }
        });
    }

    loop(_GAME_RES);
}
