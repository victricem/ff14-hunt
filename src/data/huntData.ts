// 定義資料型別
export interface Mob {
  cn: string;
  jp: string;
  zone: string;
  window: number;
  trigger?: string;
  windowType?: string;
  weather?: string;
  time?: number[];
  moon?: number[];
  rank?: 's' | 'a' | 'ss';
  id?: string;
  expKey?: string;
  expName?: string;
}

export const SERVERS = ['伊弗利特', '迦樓羅', '利維坦', '鳳凰', '奧汀', '巴哈姆特', '泰坦'];

export const EXPANSIONS = [
  { id: 'all', name: 'ALL 全部版本', sub: 'ALL', color: 'bg-slate-500' },
  { id: 'dt', name: '7.0 黃金的遺產', sub: '7.0', color: 'bg-yellow-600' },
  { id: 'ew', name: '6.0 曉月之終途', sub: '6.0', color: 'bg-indigo-600' },
  { id: 'shb', name: '5.0 漆黑的反叛者', sub: '5.0', color: 'bg-purple-700' },
  { id: 'sb', name: '4.0 紅蓮之狂潮', sub: '4.0', color: 'bg-red-600' },
  { id: 'hw', name: '3.0 蒼天的伊修加德', sub: '3.0', color: 'bg-blue-600' },
  { id: 'arr', name: '2.0 新生艾奧傑亞', sub: '2.0', color: 'bg-emerald-600' },
];

export const HUNT_DATA: Record<string, { s: Mob[]; a: Mob[] }> = {
    dt: {
    s: [
        { cn: '水晶化身之王', jp: 'ロード・オブ・クリスタライザー', zone: '黃金全境', window: 84, trigger: '特殊SS級觸發：擊殺區域內 A 級狩獵怪「水晶化身」後機率觸發。' },
        { cn: '厭忌之人 奇里格', jp: '厭忌のキーリーゲー', zone: '奧闊帕恰山', window: 84, trigger: 'ET 新月 (1-4日) 00:00-08:00 + 天氣「霧」時，經過刷新點。', windowType: 'full-combined', moon: [1,4], time: [0,8], weather: '霧' },
        { cn: '伊努索奇', jp: 'イヌショキー', zone: '克扎瑪烏卡濕地', window: 84, trigger: '帶著寵物「藍閃蝶」經過。' },
        { cn: '內尤佐緹', jp: 'ネヨーゾテール', zone: '亞克特爾樹海', window: 84, trigger: '從背包一次性捨棄堆疊 50 個或以上的「魚粉」。' },
        { cn: '山謝亞', jp: 'サンシェヤ', zone: '夏勞尼荒野', window: 84, trigger: '連續完成三次 FATE「惡魔的火種——飲火魔」，期間該 FATE 不能失敗。' },
        { cn: '先驅勇士 阿提卡斯', jp: '先駆けのアティカス', zone: '遺產之地', window: 84, trigger: '使用烹調師製作高品質 (HQ) 的「犎牛牛排」(99級配方)。' },
        { cn: '天氣預報機器人', jp: 'ウェザーリポーター', zone: '活著的記憶', window: 84, trigger: '在刷新點附近使用青魔法師技能「狂風暴雪」。' },
    ],
    a: [
        { cn: '水晶化身', jp: 'クリスタライザー', zone: '黃金全境', window: 4 },
        { cn: '女王鷹蜂', jp: 'クイーンホーク', zone: '奧闊帕恰山', window: 4 }, { cn: '內丘奇霍', jp: 'ネチュキホ', zone: '奧闊帕恰山', window: 4 },
        { cn: '普庫恰', jp: 'プクチャ', zone: '克扎瑪烏卡濕地', window: 4 }, { cn: '驚雨蟾蜍', jp: 'レイントリラー', zone: '克扎瑪烏卡濕地', window: 4 },
        { cn: '血鳴鼠', jp: 'ラシュイチャ', zone: '亞克特爾樹海', window: 4 }, { cn: '幻煌鳥', jp: '幻煌鳥', zone: '亞克特爾樹海', window: 4 },
        { cn: '凱海尼海亞麥尤伊', jp: 'ケヘニヘヤメウィ', zone: '夏勞尼荒野', window: 4 }, { cn: '艾海海陶瓦泡', jp: 'エヘヘトーワポ', zone: '夏勞尼荒野', window: 4 },
        { cn: '多變裝置', jp: 'ヴァリアポッド', zone: '遺產之地', window: 4 }, { cn: '海休瓦拉', jp: 'ヘシュワラ', zone: '遺產之地', window: 4 },
        { cn: '貓眼', jp: 'キャッツアイ', zone: '活著的記憶', window: 4 }, { cn: '清掃者薩莉', jp: 'サリー・ザ・スイーパー', zone: '活著的記憶', window: 4 },
    ]
    },
    ew: {
    s: [
        { cn: '克爾', jp: 'ケール', zone: '曉月全境', window: 84, trigger: '特殊SS級觸發：擊殺區域內隨機出現的「克爾的侍從」後觸發。' },
        { cn: '布弗魯', jp: 'ブーフールー', zone: '迷津', window: 84, trigger: 'ET 09:00-17:00 + 天氣「碧空/晴朗」時，攜帶寵物「小巨魔」經過刷新點。', windowType: 'full-combined', time: [9,17], weather: '碧空/晴朗' },
        { cn: '頗胝迦', jp: 'スパティカ', zone: '薩維奈島', window: 84, trigger: '擊殺 100 隻阿輸陀花 + 100 隻畢舍遮 + 100 隻金剛尾。' },
        { cn: '阿姆斯特朗', jp: 'アームストロング', zone: '加雷馬', window: 84, trigger: '裝備「修好的帝國盔帽」與「修好的帝國短袍」，在刷新點陷入無法戰鬥狀態。' },
        { cn: '沉思之物', jp: 'ルミネイター', zone: '嘆息海', window: 84, trigger: '擊殺 100 隻思考之物 + 100 隻彷徨之物 + 100 隻嘆息之物。' },
        { cn: '俄菲翁尼厄斯', jp: 'オピオネウス', zone: '厄爾庇斯', window: 84, trigger: '一次性捨棄堆疊 5 顆的「厄爾庇斯之鳥蛋」。' },
        { cn: '狹縫', jp: 'ナロー＝リフト', zone: '天外天垓', window: 84, trigger: '10人或以上一起攜帶寵物「小異亞」經過刷新點。' },
    ],
    a: [
        { cn: '克爾的侍從', jp: 'ケールの従者', zone: '曉月全境', window: 4 },
        { cn: '斯圖希', jp: 'ストーシー', zone: '迷津', window: 4 }, { cn: '胡睹', jp: 'フルドラ', zone: '迷津', window: 4 },
        { cn: '尤蘭', jp: 'ユラン', zone: '薩維奈島', window: 4 }, { cn: '須羯里婆', jp: 'スグリーヴァ', zone: '薩維奈島', window: 4 },
        { cn: '密涅瓦', jp: 'ミネルウァ', zone: '加雷馬', window: 4 }, { cn: '黑楊樹精', jp: 'アイゲイロス', zone: '加雷馬', window: 4 },
        { cn: '月面仙人刺女王', jp: 'ルナテンダー・クイーン', zone: '嘆息海', window: 4 }, { cn: '慕斯公主', jp: 'ムースプリンセス', zone: '嘆息海', window: 4 },
        { cn: '固蘭蓋奇', jp: 'グランガチ', zone: '厄爾庇斯', window: 4 }, { cn: '瓣齒鯊', jp: 'ペタロドゥス', zone: '厄爾庇斯', window: 4 },
        { cn: '凡·艾爾', jp: 'ファン・アイル', zone: '天外天垓', window: 4 }, { cn: '伊塔總領', jp: 'アーチイータ', zone: '天外天垓', window: 4 },
    ]
    },
    shb: {
    s: [
        { cn: '得到寬恕的叛亂', jp: 'フォーギヴン・リベリオン', zone: '漆黑全境', window: 84, trigger: '特殊SS級觸發：區域 S 級擊殺後，若觸發「流言」事件，擊殺 4 隻流言怪後觸發。' },
        { cn: '戾蟲', jp: 'ティガー', zone: '雷克蘭德', window: 84, trigger: '從背包捨棄道具「秧雞胸脯肉」。' },
        { cn: '得到寬恕的炫學', jp: 'フォーギヴン・ペダントリー', zone: '珂露西亞島', window: 84, trigger: '所有玩家總共採集「矮人棉」50 次。' },
        { cn: '多智獸', jp: 'タルキア', zone: '安穆·艾蘭', window: 84, trigger: '青魔法師在刷新點使用技能「自爆」。' },
        { cn: '阿格拉俄珀', jp: 'アグラオペ', zone: '伊爾美格', window: 84, trigger: '召喚寵物「朱孔雀」經過刷新點。' },
        { cn: '伊休妲', jp: 'イシュタム', zone: '拉凱提卡大森林', window: 84, trigger: '擊殺 100 個破裂的隆卡人偶 + 100 個破裂的隆卡石蒺藜 + 100 個破裂的隆卡器皿。' },
        { cn: '顧尼圖', jp: 'グニット', zone: '黑風海', window: 84, trigger: '位於黑風海 (X: 26, Y: 7)附近的冰海天使，吞噬 3 隻深海水蛭後巨大化並使用技能「口錐」。' },
    ],
    a: [
        { cn: '得到寬恕的流言', jp: 'フォーギヴン・ゴシップ', zone: '漆黑全境', window: 4 },
        { cn: '納克拉維', jp: 'ナックラヴィー', zone: '雷克蘭德', window: 4 }, { cn: '納里蓬', jp: 'ナリーポン', zone: '雷克蘭德', window: 4 },
        { cn: '小小殺手', jp: 'リルマーダー', zone: '珂露西亞島', window: 4 }, { cn: '烏拉坎', jp: 'フラカン', zone: '珂露西亞島', window: 4 },
        { cn: '馬利克巨人掌', jp: 'マリクテンダー', zone: '安穆·艾蘭', window: 4 }, { cn: '休格爾', jp: '休格爾', zone: '安穆·艾蘭', window: 4 },
        { cn: '保爾迪雅', jp: 'ポールディア', zone: '伊爾美格', window: 4 }, { cn: '泥人', jp: '泥人', zone: '伊爾美格', window: 4 },
        { cn: '格拉斯曼', jp: 'グラスマン', zone: '拉凱提卡大森林', window: 4 }, { cn: '蘇帕伊', jp: 'スペイ', zone: '拉凱提卡大森林', window: 4 },
        { cn: '盧莎卡', jp: 'ルサルカ', zone: '黑風海', window: 4 }, { cn: '巴力', jp: 'バール', zone: '黑風海', window: 4 },
    ]
    },
    sb: {
    s: [
        { cn: '優曇婆羅花', jp: 'ウドンゲ', zone: '基拉巴尼亞邊區', window: 84, trigger: '擊殺 100 隻萊西 + 100 隻狄亞卡 (含 FATE 同名怪)。' },
        { cn: '爬骨怪龍', jp: 'ボーンクローラー', zone: '基拉巴尼亞山區', window: 84, trigger: '乘坐運輸陸行鳥穿過地圖中線時機率觸發。' },
        { cn: '鹽和光', jp: 'ソルト・アンド・ライト', zone: '基拉巴尼亞湖區', window: 84, trigger: '所有玩家總共從背包捨棄道具 50 次。' },
        { cn: '巨大鰩', jp: 'オキナ', zone: '紅玉海', window: 84, trigger: '擊殺 100 隻無殼觀夢螺 + 100 隻觀夢螺，且在滿月 (16-20日) 時觸發，首日為 12:00 開始。', windowType: 'moon', moon: [16,20] },
        { cn: '兀魯忽乃朝魯', jp: 'オルガナ', zone: '太陽神草原', window: 84, trigger: '完成 FATE「石人英雄——格爾該朝魯」後經過刷新點。' },
        { cn: '伽馬', jp: 'ガンマ', zone: '延夏', window: 84, trigger: 'ET 17:00-08:00 帶著寵物「迷你亞歷山大」經過刷新點。', windowType: 'time', time: [17,8] },
    ],
    a: [
        { cn: '奧迦斯', jp: 'オルクス', zone: '基拉巴尼亞邊區', window: 4 }, { cn: '女王蜂', jp: 'アール', zone: '基拉巴尼亞邊區', window: 4 },
        { cn: '弗克施泰因', jp: 'バックスタイン', zone: '基拉巴尼亞山區', window: 4 }, { cn: '熔谷炎蠍', jp: 'アクラブアメル', zone: '基拉巴尼亞山區', window: 4 },
        { cn: '馬希沙', jp: 'マヒシャ', zone: '基拉巴尼亞湖區', window: 4 }, { cn: '泛光晶體', jp: 'ルミナーレ', zone: '基拉巴尼亞湖區', window: 4 },
        { cn: '鬼觀夢', jp: 'オニユメミ', zone: '紅玉海', window: 4 }, { cn: '船幽靈', jp: '船幽靈', zone: '紅玉海', window: 4 },
        { cn: '基里麥卡拉', jp: 'ギリメカラ', zone: '太陽神草原', window: 4 }, { cn: '碩姆', jp: 'ソム', zone: '太陽神草原', window: 4 },
        { cn: '象魔修羅', jp: 'ガジャースラ', zone: '延夏', window: 4 }, { cn: '安迦達', jp: 'アンガダ', zone: '延夏', window: 4 }
    ]
    },
    hw: {
    s: [
        { cn: '盧克洛塔', jp: 'レウクロッタ', zone: '魔大陸阿濟茲拉', window: 84, trigger: '擊殺50隻亞拉戈奇美拉 + 50隻小海德拉 + 50隻美拉西迪亞薇薇爾飛龍。' },
        { cn: '凱撒貝希摩斯', jp: 'カイザーベヒーモス', zone: '庫爾札斯西部高地', window: 84, trigger: '帶著寵物皇家貝希摩斯寶寶經過刷新點。' },
        { cn: '神穆爾鳥', jp: 'セーンムルウ', zone: '龍堡參天高地', window: 84, trigger: '在連續完成五次「龍卵引起的戰爭」。' },
        { cn: '蒼白騎士', jp: 'ペイルライダー', zone: '龍堡內陸低地', window: 84, trigger: '打開藏寶圖寶箱（G7陳舊的飛龍革地圖）時概率觸發。' },
        { cn: '剛德瑞瓦', jp: 'ガンダルヴァ', zone: '翻雲霧海', window: 84, trigger: '所有玩家總共採集皇金礦和星極花各50次。' },
        { cn: '極樂鳥', jp: '極楽鳥', zone: '阿巴拉提亞雲海', window: 84, trigger: 'B怪斯奎克使用技能「唧唧咋咋」時概率觸發。' },
    ],
    a: [
        { cn: '米勒卡', jp: 'ミルカ', zone: '庫爾札斯西部高地', window: 4 }, { cn: '盧芭', jp: 'リューバ', zone: '庫爾札斯西部高地', window: 4 },
        { cn: '西斯尤', jp: 'シシウトゥル', zone: '阿巴拉提亞雲海', window: 4 }, { cn: '恩克拉多斯', jp: 'エンケラドス', zone: '阿巴拉提亞雲海', window: 4 },
        { cn: '阿伽托斯', jp: 'アガトス', zone: '翻雲霧海', window: 4 }, { cn: '布涅', jp: 'ブネ', zone: '翻雲霧海', window: 4 },
        { cn: '派拉斯特暴龍', jp: 'パイルラスタ', zone: '龍堡參天高地', window: 4 }, { cn: '雙足飛龍之王', jp: 'ワイバーンロード', zone: '龍堡參天高地', window: 4 },
        { cn: '機工兵', jp: '機兵のスリップキンクス', zone: '龍堡內陸低地', window: 4 }, { cn: '斯特拉斯', jp: 'ストラス', zone: '龍堡內陸低地', window: 4 },
        { cn: '坎帕提', jp: 'キャムパクティ', zone: '魔大陸阿濟茲拉', window: 4 }, { cn: '惡臭狂花', jp: 'センチブロッサム', zone: '魔大陸阿濟茲拉', window: 4 }
    ]
    },
    arr: {
    s: [
        { cn: '雷德羅巨蛇', jp: 'レドロネット', zone: '黑衣森林中央林區', window: 50, trigger: '黑衣森林中央林區連續 2 個 ET 時段（約 47 分鐘）天氣皆為「雨」。', windowType: 'continuous-rain', weather: '雨' },
        { cn: '烏爾伽魯', jp: 'ウルガル', zone: '黑衣森林東部林區', window: 50, trigger: '開始「傭兵理符/軍隊理符」時概率觸發。' },
        { cn: '奪心魔', jp: 'マインドフレア', zone: '黑衣森林南部林區', window: 50, trigger: 'ET 新月（1-4日）17:00-03:00 時玩家經過刷新點。（首日從 0:00 開始）', windowType: 'moon-time', moon: [1,4], time: [17,3] },
        { cn: '千竿口花希達', jp: 'サウザンドキャスト・セダ', zone: '黑衣森林北部林區', window: 50, trigger: '在秋瓜湖畔釣場黑衣森林北部林區 (X: 21, Y: 26.2)釣上釣場之王審判鳐概率觸發（魚餌：雉雞擬餌）。' },
        { cn: '虛無探索者', jp: 'ゾーナ・シーカー', zone: '西薩納蘭', window: 50, trigger: '在 「碧空」 或 「晴朗」 天氣下於豐饒神井釣場【西薩納蘭 (X: 24.4, Y: 21.5)】釣上釣場之王銅鏡概率觸發（魚餌：黃油蟲）。', windowType: 'weather-special', weather: '碧空/晴朗' },
        { cn: '布隆特斯', jp: 'ブロンテス', zone: '中薩納蘭', window: 50, trigger: '在刷新點上獲得「進食」狀態。' },
        { cn: '巴拉烏爾', jp: 'バルウール', zone: '東薩納蘭', window: 50, trigger: '開始「傭兵理符/軍隊理符」時概率觸發。' },
        { cn: '努紐努維', jp: 'ヌニュヌウィ', zone: '南薩納蘭', window: 50, trigger: '連續 1 小時（地球時間）沒有危命失敗（包括對話觸發型fate）。' },
        { cn: '蚓螈巨蟲', jp: 'ミニョーカオン', zone: '北薩納蘭', window: 50, trigger: '擊殺 100 隻土元精 (含 FATE 同名怪)。' },
        { cn: '護土精靈', jp: 'クロック・ミテーヌ', zone: '中拉諾西亞', window: 50, trigger: '在 19:00 - 22:00 ，使用採礦工在中拉諾西亞 (X: 24.3, Y: 26.9)附近採集3級拉諾西亞土壤概率觸發。', windowType: 'time', time: [19,22] },
        { cn: '咕爾呱洛斯', jp: 'ケロゲロス', zone: '拉諾西亞低地', window: 50, trigger: '滿月的（艾歐澤亞日16-20日） 17:00 - 03:00 時玩家經過刷新點。', windowType: 'moon-time', moon: [16,20], time: [17,3] },
        { cn: '伽洛克', jp: 'ガーロック', zone: '東拉諾西亞', window: 50, trigger: '東拉諾西亞連續 200 分鐘不下雨（地球時間）。', windowType: 'weather-special', weather: '晴朗' },
        { cn: '火憤牛', jp: 'ボナコン', zone: '西拉諾西亞', window: 50, trigger: '在 08:00 - 11:00 ，使用園藝工在西拉諾西亞 (X: 34.2, Y: 28.2)附近採集拉諾西亞韭蔥概率觸發。', windowType: 'time', time: [8,11] },
        { cn: '南迪', jp: 'ナンディ', zone: '拉諾西亞高地', window: 50, trigger: '帶上任意寵物經過刷新點。' },
        { cn: '牛頭黑神', jp: 'チェルノボーグ', zone: '拉諾西亞外地', window: 50, trigger: '玩家角色陷入無法戰鬥狀態時概率觸發。' },
        { cn: '薩法特', jp: 'サファト', zone: '庫爾札斯中央高地', window: 50, trigger: '玩家角色通過墜落傷害使血量歸 1 時概率觸發。' },
        { cn: '阿格里帕', jp: 'アグリッパ', zone: '摩杜納', window: 50, trigger: '打開藏寶圖寶箱（G3陳舊的巨蟾蜍革地圖、G4陳舊的野豬革地圖、G5陳舊的毒蜥蜴革地圖、綠圖鞣革制的隱藏地圖、古武神秘地圖）時概率觸發。' },
    ],
    a: [
        { cn: '醜男子 沃迦加', jp: '醜男のヴォガージャ', zone: '中拉諾西亞', window: 4 }, { cn: '烏克提希', jp: 'ウンクテヒ', zone: '拉諾西亞低地', window: 4 },
        { cn: '魔導地獄爪', jp: '魔導ヘルズクロー', zone: '東拉諾西亞', window: 4 }, { cn: '納恩', jp: 'ナン', zone: '西拉諾西亞', window: 4 },
        { cn: '瑪貝利', jp: '瑪貝利', zone: '拉諾西亞高地', window: 4 }, { cn: '角祖', jp: 'コンヌ', zone: '拉諾西亞外地', window: 4 },
        { cn: '弗內烏斯', jp: 'ファルネウス', zone: '黑衣森林中央林區', window: 4 }, { cn: '千眼凝膠', jp: 'メルティゼリー', zone: '黑衣森林東部林區', window: 4 },
        { cn: '蓋得', jp: 'ゲーデ', zone: '黑衣森林南部林區', window: 4 }, { cn: '尾宿蛛蠍', jp: 'ギルタブ', zone: '黑衣森林北部林區', window: 4 },
        { cn: '阿列刻特利昂', jp: 'アレクトリオン', zone: '西薩納蘭', window: 4 }, { cn: '花舞仙人刺', jp: 'サボテンダー・バイラリーナ', zone: '中薩納蘭', window: 4 },
        { cn: '瑪赫斯', jp: 'マヘス', zone: '東薩納蘭', window: 4 }, { cn: '札尼戈', jp: 'ザニゴ', zone: '南薩納蘭', window: 4 },
        { cn: '菲蘭德的遺火', jp: 'ファイナルフレイム', zone: '北薩納蘭', window: 4 }, { cn: '馬拉克', jp: 'マラク', zone: '庫爾札斯中央高地', window: 4 },
        { cn: '庫雷亞', jp: 'クーレア', zone: '摩杜納', window: 4 }
    ]
    }
};