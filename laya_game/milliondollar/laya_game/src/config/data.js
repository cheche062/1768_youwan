// ajax地址数据
export const AJAX_URL = {
    day: `/?act=game_millions&st=get_bet_rank&type=day&userId=${userId}`,
    week: `/?act=game_millions&st=get_bet_rank&type=week&userId=${userId}`,
    month: `?act=game_millions&st=get_bet_rank&type=month&userId=${userId}`,
    userAccount: `/?act=game_gamebase&st=queryUserAccount&data=*&gameId=${gameId}&type=1` //用户余额
}

// 美元皮肤种类
export const DOLLAR_TYPE_LIST = ['one', 'five', 'ten', 'twenty', 'hundred', 'fiveHundred', 'baida'];


// 状态列表
export const STATE_LIST = (() => {
    let WIDTH = 174,
        INT = 25,
        _Y = 130,
        y = 200;
    return [
        { initPos: { x: WIDTH / 2 + (WIDTH + INT) * 0, y }, _X: 5, _Y },
        { initPos: { x: WIDTH / 2 + (WIDTH + INT) * 1, y }, _X: 3, _Y },
        { initPos: { x: WIDTH / 2 + (WIDTH + INT) * 2, y }, _X: 0, _Y },
        { initPos: { x: WIDTH / 2 + (WIDTH + INT) * 3, y }, _X: -3, _Y },
        { initPos: { x: WIDTH / 2 + (WIDTH + INT) * 4, y }, _X: -5, _Y }
    ]
})();

export function getStateList() {
    let { initPos, _X, _Y } = this;
    return [
        { x: _X * 3 + initPos.x, y: _Y * -2 + initPos.y, skewX: _X * -2 },
        { x: _X * 1 + initPos.x, y: _Y * -1 + initPos.y, skewX: _X * -1 },
        { x: _X * 0 + initPos.x, y: _Y * 0 + initPos.y, skewX: _X * 0 },
        { x: _X * 1 + initPos.x, y: _Y * 1 + initPos.y, skewX: _X * 1 },
        { x: _X * 3 + initPos.x, y: _Y * 2 + initPos.y, skewX: _X * 2 }
    ]
}

// 错误信息
export const ERROR_TEXT = {
    '3' : '参数有误',
    '4' : '用户正在投币，请勿刷接口',
    '5' : '余额不足',
    '6' : '平台账号已被禁用',
    '7' : '游戏账号已被禁用',
    '8' : '服务器开小差了，投币额以欢乐值的形式已退回到您的账号了哟~',
    '18' : '本轮押注还未结束，请勿刷接口',
    '21' : '游戏维护中，请刷新页面',
    '31' : '地球信号不好，请稍后重试~',
    '50' : '单笔押注上限',
    '51' : '单日押注上限',
    '81' : '触发OTP' ,
    '82' : '支付渠道禁用'
}

// 声音集合
export const AUDIO_SOURCES = ['bg', 'btn', 'btn_add', 'btn_start', 'btn_sub', 'coin', 'fudai', 'good', 'lapa_stop'];

// 自动玩的次数
export const AUTOPLAY_TIMES = ['500', '100', '25', '10', '5'];

// 投币默认金额
export const DEFAULT_AMOUNT = ['500000', '100000', '10000', '5000', '1000', '250'];

// 基础返奖倍率
export const BASE_RATE = [5, 10, 30, 50];

// 25条中奖线
export const LINES_25 = {
    '1': [0, 3, 6, 9, 12],
    '2': [1, 4, 7, 10, 13],
    '3': [2, 5, 8, 11, 14],
    '4': [0, 4, 8, 10, 12],
    '5': [2, 4, 6, 10, 14],
    '6': [0, 4, 6, 10, 14],
    '7': [2, 4, 6, 10, 12],
    '8': [1, 5, 7, 11, 13],
    '9': [1, 5, 7, 9, 13],
    '10': [2, 4, 8, 10, 12],
    '11': [1, 3, 7, 9, 13],
    '12': [1, 3, 7, 11, 13],
    '13': [0, 4, 6, 10, 12],
    '14': [0, 4, 8, 10, 14],
    '15': [2, 4, 8, 10, 14],
    '16': [0, 3, 7, 9, 12],
    '17': [0, 3, 8, 9, 12],
    '18': [1, 4, 6, 10, 13],
    '19': [1, 4, 8, 10, 13],
    '20': [2, 5, 7, 11, 14],
    '21': [0, 3, 6, 10, 14],
    '22': [1, 4, 7, 11, 13],
    '23': [2, 4, 7, 10, 12],
    '24': [2, 5, 6, 11, 14],
    '25': [2, 5, 8, 10, 12]
}

// 不中奖的连线
export const LOSE_LINE = [[1, 1, 3, 2], [1, 4, 5, 6], [1, 6, 4, 4], [1, 3, 6, 1], [1, 2, 6, 6]];

export const POS_LINE = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
    [12, 13, 14]
]
