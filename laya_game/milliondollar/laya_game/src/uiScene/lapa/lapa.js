import { observer } from '../../module/init_module';
import LapaLine from './lapaLine';
import JackpotUIView from '../jackpot';
import { STATE_LIST, getStateList, LINES_25, POS_LINE, LOSE_LINE } from '../../config/data';
import CMDS from '../../config/cmd';
import UTILS from '../../config/utils';
import AudioMudule from '../../module/com/audio';


export default class LapaUIView extends lapaUI {
    constructor() {
        super()

        this.init()
        this.result_data = {};
        LapaUIView.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {
        this.x = 137;

        // 游戏是否运动中
        this.isGameGoing = false;

        // 裁切
        this.addScrollRect();

        // 添加奖池
        this.jackpot_box.addChild(JackpotUIView.getInstance());

        // 添加lapa单行
        this.addChildrenLine();

        this.subscribe();
    }

    // 订阅
    subscribe() {
        // 拉霸位置切换
        observer.subscribe(CMDS.MATCH__TAB, this.posChange.bind(this));
        // 拉霸启动
        observer.subscribe(CMDS.GAME__START, this.go.bind(this));
        // 游戏重置
        observer.subscribe('game::reset', () => {
            if (this.isGameGoing) {
                this.stop();
            }
        });
    }

    addScrollRect() {
        let x = -45;
        this.lapa_box.scrollRect = new Laya.Rectangle(x, 0, this.lapa_box.width, this.lapa_box.height);
    }

    addChildrenLine() {
        STATE_LIST.forEach((item, index) => {
            Laya.timer.once(100 * index, this, () => {
                let stateList = getStateList.call(item);
                this.lapa_box.addChild(new LapaLine(stateList, index, this.stopHandler.bind(this), LOSE_LINE[index]));

            })
        })
    }

    go() {
        this.isGameGoing = true;
        this.lapa_box._childs.forEach((item, index) => {
            Laya.timer.once(100 * index, this, () => {
                item.go();
            });
        })
    }

    stop(data = {}) {
        let pic = data.pic || LOSE_LINE;
        this.lapa_box._childs.forEach((item, index) => {
            Laya.timer.once(150 * index, this, () => {
                item.stop(pic[index]);
            })
        })

        this.result_data = data;
    }

    posChange() {
        let targetX = this.x === 0 ? 137 : 0;

        Laya.Tween.to(this, { x: targetX }, 300, Laya.Ease.circOut);
    }

    // 运动停止
    stopHandler(i) {
        if (i !== 4) return;

        // 对3个以上百搭图案中奖的情况添加到lines
        if (this.result_data.allMatch && Number(this.result_data.allMatch.num) >= 3) {
            let line = { isBaidaIcon: true };

            this.result_data.lines.push(line);
        }

        let count = 0;
        let totalCount = 0;
        let animateCB = (bool) => {
            if (bool) {

            } else if (++count !== totalCount) {
                return;
            }

            count = 0;
            let lines = this.result_data.lines || [];
            let line = lines.shift();

            // 没有中奖线立即return
            if (typeof line === 'undefined') {
                return;
            }

            lines.push(line);
            UTILS.log('继续下一条线。。。');

            // 开始做动画
            let cb = null;
            if (line.isBaidaIcon) {
                cb = (item, index) => item.playBaida(this.result_data.pic[index], animateCB);
                totalCount = this.result_data.allMatch.num;
            } else {
                totalCount = line.num;
                cb = (item, index) => item.playLine(LINES_25[line.no][index], POS_LINE[index], line.num, animateCB)
            }

            this.lapa_box._childs.forEach(cb);
        }

        animateCB(true);
        this.isGameGoing = false;

        // 发布游戏停止  (总奖金额)
        observer.publish('lapa::stop', Number(this.result_data.total), this.result_data.allMatch);

        AudioMudule.getInstance().play('lapa_stop');

        UTILS.log('该局游戏结束。。。')
    }


}
