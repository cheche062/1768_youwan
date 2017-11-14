import GAME_CONFIG from './config';


let XML = Laya.Loader.XML;
let IMAGE = Laya.Loader.IMAGE;
let ATLAS = Laya.Loader.ATLAS;
let BUFFER = Laya.Loader.BUFFER;

// 所有的资源
const RESOURCE = {};
// 游戏版本号
const GAME_VERSION = {};

// 字体资源
let fonts = [
    { url: "images/font/bottom_font.fnt", name: 'bottom_font', type: XML },
    { url: "images/font/button_font.fnt", name: 'button_font', type: XML },
    { url: "images/font/notice_font.fnt", name: 'notice_font', type: XML },
    { url: "images/font/num1_font.fnt", name: 'num1_font', type: XML },
    { url: "images/font/num2_font.fnt", name: 'num2_font', type: XML },
    { url: "images/font/num3_font.fnt", name: 'num3_font', type: XML },
    { url: "images/font/win_font.fnt", name: 'win_font', type: XML },
    { url: "images/font/auto_font.fnt", name: 'auto_font', type: XML }
];

// loading需要的资源优先加载
let loadingRes = [
    { url: 'images/load/bg.jpg', type: IMAGE },
    { url: 'images/load/dollarbg.png', type: IMAGE },

    { url: 'res/atlas/images/load.json', type: ATLAS },
    { url: 'res/atlas/images/comp.json', type: ATLAS },
    { url: 'images/animate/loading.sk', type: BUFFER },
    { url: 'images/animate/loading.png', type: IMAGE }
]

// 不打包图片资源
let unPackRes = [
    // room
    { url: "images/room/down_up.png", type: IMAGE },
    { url: "images/room/room_match/big_match.png", type: IMAGE },
    { url: "images/room/room_match/lapa_bg.png", type: IMAGE },
    { url: "images/room/clip_win.png", type: IMAGE },

    // 骨骼动画的资源
    { url: 'images/animate/baida.atlas', type: ATLAS },
    { url: 'images/animate/baida.png', type: IMAGE },
    { url: 'images/animate/five.atlas', type: ATLAS },
    { url: 'images/animate/five.png', type: IMAGE },
    { url: 'images/animate/one.atlas', type: ATLAS },
    { url: 'images/animate/one.png', type: IMAGE },
    { url: 'images/animate/ten.atlas', type: ATLAS },
    { url: 'images/animate/ten.png', type: IMAGE },
    { url: 'images/animate/twenty.atlas', type: ATLAS },
    { url: 'images/animate/twenty.png', type: IMAGE },
    { url: 'images/animate/hundred.atlas', type: ATLAS },
    { url: 'images/animate/hundred.png', type: IMAGE },
    { url: 'images/animate/fiveHundred.atlas', type: ATLAS },
    { url: 'images/animate/fiveHundred.png', type: IMAGE },


    { url: 'images/animate/LOGO.sk', type: BUFFER },
    { url: 'images/animate/LOGO.png', type: IMAGE },
    { url: 'images/animate/winpop.sk', type: BUFFER },
    { url: 'images/animate/winpop.png', type: IMAGE },
    { url: 'images/animate/start.sk', type: BUFFER },
    { url: 'images/animate/start.png', type: IMAGE },
    { url: 'images/animate/baidafj.sk', type: BUFFER },
    { url: 'images/animate/baidafj.png', type: IMAGE },
    { url: 'images/animate/icon.sk', type: BUFFER },
    { url: 'images/animate/icon.png', type: IMAGE },

    //美金大赛历史弹层的资源
    { url: 'images/pop/match/bg_award.png', type: IMAGE },
    { url: 'images/pop/match/bg_line.png', type: IMAGE },

    // 美金大赛结果弹层资源
    { url: 'images/pop/match/bg_header.png', type: IMAGE },
    { url: 'images/pop/match/bg_line2.png', type: IMAGE },
    { url: 'images/pop/match/bg_match.png', type: IMAGE },

    // 排行榜弹层的资源
    { url: 'images/pop/rank/bg_rank.png', type: IMAGE },

    // 帮助资源
    { url: 'images/pop/help/banner_01.png', type: IMAGE },
    { url: 'images/pop/help/banner_02.png', type: IMAGE },
    { url: 'images/pop/help/banner_03.png', type: IMAGE },
    { url: 'images/pop/help/banner_04.png', type: IMAGE },

    // 充值弹层
    { url: 'images/pop/recharge/bg_input.png', type: IMAGE },
    { url: 'images/pop/recharge/btn_tab.png', type: IMAGE },

    //  公共弹层
    { url: 'images/pop/tips/bg.png', type: IMAGE },
    { url: 'images/pop/tips/bg02.png', type: IMAGE }
];

// 打包的json文件
let packRes = [
    // room
    { url: 'res/atlas/images/room.json', type: ATLAS },
    { url: 'res/atlas/images/room/room_match.json', type: ATLAS },

    //pop
    { url: 'res/atlas/images/pop/match.json', type: ATLAS },
    { url: 'res/atlas/images/pop/rank.json', type: ATLAS },
    { url: 'res/atlas/images/pop/help.json', type: ATLAS },
    { url: 'res/atlas/images/pop/recharge.json', type: ATLAS },
    { url: 'res/atlas/images/pop/tips.json', type: ATLAS }

];

// 字体
RESOURCE.fonts = fonts;
// 加载页资源
RESOURCE.loadingRes = loadingRes;
// 非加载页资源
RESOURCE.disLoadingRes = [...unPackRes, ...packRes];

// 总的资源
RESOURCE.images = [...RESOURCE.disLoadingRes, ...loadingRes];

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
                GAME_VERSION[newUrl] = GAME_CONFIG.STATIC_VERTION;
            }

            GAME_VERSION[item.url] = GAME_CONFIG.STATIC_VERTION;
        } else {
            loop(item);
        }
    });
}

loop([...RESOURCE.fonts, ...RESOURCE.images]);


export { RESOURCE, GAME_VERSION };
