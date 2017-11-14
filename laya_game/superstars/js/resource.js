{
    const app = window.app;
    let RESOURCE = app.config.RESOURCE;

    // 字体资源
    let fonts = [
        { url: "font/blue_font.fnt", name: 'blue_font', type: Laya.Loader.XML },
        { url: "font/purple_font.fnt", name: 'purple_font', type: Laya.Loader.XML },
        { url: "font/yellow_font.fnt", name: 'yellow_font', type: Laya.Loader.XML },

        { url: "font/fudai_all_font.fnt", name: 'fudai_all_font', type: Laya.Loader.XML },
        { url: "font/fudai_win_font.fnt", name: 'fudai_win_font', type: Laya.Loader.XML },
        { url: "font/fudai_pop_font.fnt", name: 'fudai_pop_font', type: Laya.Loader.XML },

        { url: "font/outer_base_font.fnt", name: 'outer_base_font', type: Laya.Loader.XML },
        { url: "font/input_font.fnt", name: 'input_font', type: Laya.Loader.XML },
        { url: "font/result_win_font.fnt", name: 'result_win_font', type: Laya.Loader.XML }
    ];

    // loading需要的资源优先加载
    let loadingRes = [
        { url: "loading/loadingbg.jpg", type: Laya.Loader.IMAGE },
        { url: "res/atlas/loading.json", type: Laya.Loader.ATLAS }
    ]

    // 不打包图片资源
    let unPackRes = [
        // room
        { url: "room/roombg.jpg", type: Laya.Loader.IMAGE },
        { url: "room/marquee_bg.png", type: Laya.Loader.IMAGE },
        { url: "room/outround.png", type: Laya.Loader.IMAGE },
        { url: "room/round.png", type: Laya.Loader.IMAGE },

        // pop
        { url: "pop/page1.png", type: Laya.Loader.IMAGE },
        { url: "pop/page2.png", type: Laya.Loader.IMAGE }


    ];

    // 打包的json文件
    let packRes = [
        { url: 'res/atlas/comp.json', type: Laya.Loader.ATLAS },
        { url: 'res/atlas/pop.json', type: Laya.Loader.ATLAS },
        { url: 'res/atlas/pop/recharge.json', type: Laya.Loader.ATLAS },
        { url: 'res/atlas/room.json', type: Laya.Loader.ATLAS },

        // 骨骼动画的资源
        {url: 'animate/fudai.png', type: Laya.Loader.IMAGE},
        {url: 'animate/fudai.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/spark.png', type: Laya.Loader.IMAGE},
        {url: 'animate/spark.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/star.png', type: Laya.Loader.IMAGE},
        {url: 'animate/star.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/round.png', type: Laya.Loader.IMAGE},
        {url: 'animate/round.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/magic.png', type: Laya.Loader.IMAGE},
        {url: 'animate/magic.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/magic2.png', type: Laya.Loader.IMAGE},
        {url: 'animate/magic2.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/win.png', type: Laya.Loader.IMAGE},
        {url: 'animate/win.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/light.png', type: Laya.Loader.IMAGE},
        {url: 'animate/light.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/button.png', type: Laya.Loader.IMAGE},
        {url: 'animate/button.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/finger.png', type: Laya.Loader.IMAGE},
        {url: 'animate/finger.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/girl.png', type: Laya.Loader.IMAGE},
        {url: 'animate/girl.sk', type: Laya.Loader.BUFFER},
        {url: 'animate/logo.png', type: Laya.Loader.IMAGE},
        {url: 'animate/logo.sk', type: Laya.Loader.BUFFER}


    ];

    // 字体
    RESOURCE.fonts = fonts;
    // 加载页资源
    RESOURCE.loadingRes = loadingRes;
    // 非加载页资源
    RESOURCE.disLoadingRes = [...unPackRes, ...packRes];

    // 总的资源
    RESOURCE.images = [...unPackRes, ...packRes, ...loadingRes];

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
