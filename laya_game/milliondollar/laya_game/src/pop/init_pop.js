
import { HelpPopDialog } from './com/helpPop';
import { RechargePopDialog } from './com/rechargePop';
import { RankPopDialog } from './com/rankPop';
import { MatchHistoryPopDialog } from './com/matchHistoryPop';
import { MatchFinishPopDialog } from './com/matchFinishPop';
import {CommonTipsPopDialog, CommonMatchPopDialog} from './com/commonPop';
import WinPopDialog from './com/winPop';
import DefaultBetView from './com/defaultBetPop';
import BaidafjPopDialog from './com/baidafj';



// 初始化所有弹层

export default function initAllPop({messageCenter, observer}) {
	// 帮助弹层
	new HelpPopDialog().registerAction({messageCenter, observer});

    // 充值弹层
    new RechargePopDialog().registerAction({messageCenter, observer});

    // 排行榜
    new RankPopDialog().registerAction({messageCenter, observer});

    // 美金大赛历史记录
    new MatchHistoryPopDialog().registerAction({messageCenter, observer});

    // 美金大赛结束记录
    new MatchFinishPopDialog().registerAction({messageCenter, observer}) ;

    //  公共提示弹层
    new CommonTipsPopDialog().registerAction({messageCenter, observer});

    new CommonMatchPopDialog().registerAction({messageCenter, observer});

    // 赢弹层
    new WinPopDialog().registerAction({messageCenter, observer});

    // 百搭分奖
    new BaidafjPopDialog().registerAction({messageCenter, observer});

    // 默认投币额
    new DefaultBetView();

}









