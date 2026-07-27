"use client";

import { useEffect, useMemo, useState } from "react";

type Guide = {
  id: string;
  icon: string;
  category: string;
  title: string;
  time: string;
  summary: string;
  tips: string[];
  warning?: string;
};

type AdvancedTopic = {
  id: string;
  category: string;
  icon: string;
  title: string;
  useWhen: string;
  summary: string;
  steps: string[];
  note?: string;
};

type OwnerTip = {
  category: string;
  icon: string;
  title: string;
  summary: string;
  action: string;
  source: "Tesla No.1" | "TESLA995";
  level: "車主實測" | "版本依賴" | "安全提醒";
  url: string;
};

type ToolPick = {
  name: string;
  icon: string;
  summary: string;
  why: string;
  source: string;
  url: string;
  badge?: string;
};

const assetPath = (name: string) => `${import.meta.env.BASE_URL}help-images/${name}`;

const guides: Guide[] = [
  {
    id: "drive",
    icon: "↗",
    category: "駕駛",
    title: "先熟悉單踏板駕駛",
    time: "4 分鐘",
    summary: "鬆開電門時車輛會動能回收並減速。先在低車流路段練習，找回平順收放的腳感。",
    tips: ["使用「舒適」加速模式熟悉車輛", "提早鬆電門，避免突然收腳", "低電量、低溫或滿電時，回充力道可能降低"],
    warning: "永遠準備踩煞車；動能回收不是所有情況下都能把車停住。",
  },
  {
    id: "charge",
    icon: "ϟ",
    category: "充電",
    title: "建立你的充電節奏",
    time: "5 分鐘",
    summary: "日常以車輛建議的充電上限為準，長途出發前再提高；導航到超充可讓電池預熱。",
    tips: ["住家充電：插著即可，讓車輛自行管理", "超充：低電量進站通常充得更快", "長途：直接用車機導航規劃充電站"],
    warning: "不同電池版本建議不同，請以車上「充電」頁面與最新版手冊為準。",
  },
  {
    id: "autopilot",
    icon: "◎",
    category: "輔助駕駛",
    title: "Autopilot 是輔助，不是自駕",
    time: "6 分鐘",
    summary: "啟用前先看懂道路與天候。全程看路、手扶方向盤，並隨時準備立即接管。",
    tips: ["先在標線清楚、車流穩定的快速道路練習", "注意螢幕是否正確辨識車道與周遭車輛", "施工、匝道、強光、豪雨時主動接管"],
    warning: "駕駛人永遠是行車安全的最終責任者。",
  },
  {
    id: "safety",
    icon: "◉",
    category: "安全",
    title: "把行車記錄器設好",
    time: "3 分鐘",
    summary: "確認 USB 儲存裝置可正常記錄，並依停車環境開啟哨兵模式。",
    tips: ["看到紅點代表行車記錄器正在錄影", "遇到事件先按儲存，再確認片段", "哨兵模式會增加待機耗電"],
  },
  {
    id: "app",
    icon: "⌁",
    category: "手機 App",
    title: "手機鑰匙與遠端控制",
    time: "4 分鐘",
    summary: "完成手機鑰匙配對，保留鑰匙卡作備援；熟悉空調、充電與服務預約。",
    tips: ["允許 App 在背景執行與使用藍牙", "鑰匙卡不要留在車內", "借車時可新增駕駛人，不必共用帳密"],
  },
  {
    id: "care",
    icon: "◌",
    category: "保養",
    title: "電動車少保養，不是零保養",
    time: "5 分鐘",
    summary: "定期看胎壓與胎紋、雨刷精與冷氣濾網；依車況安排輪胎換位。",
    tips: ["每月與長途前檢查胎壓", "留意內側不均勻磨耗", "潮濕環境保持煞車碟盤乾燥與潔淨"],
  },
  {
    id: "ota",
    icon: "↓",
    category: "軟體",
    title: "OTA 更新前後要做什麼",
    time: "4 分鐘",
    summary: "車輛連上穩定 Wi‑Fi 後可下載更新。安裝期間不能駕駛，完成後先看版本說明再上路。",
    tips: ["安排在不需要用車的時段安裝", "更新前確認電量與 Wi‑Fi 穩定", "完成後檢查常用快捷列與駕駛設定"],
    warning: "不要在即將出發、充電或需要移車時開始安裝。",
  },
  {
    id: "wash",
    icon: "≈",
    category: "車輛操作",
    title: "進自動洗車前開啟洗車模式",
    time: "3 分鐘",
    summary: "洗車模式會集中處理車窗、雨刷、充電口等設定；輸送帶洗車還需依畫面條件啟用自由滑行。",
    tips: ["先停妥並在控制選單開啟洗車模式", "依洗車場指示操作排檔與煞車", "離場後確認模式結束、車窗與充電口正常"],
    warning: "不同洗車設備流程不同；不確定時先詢問現場人員，避免強行拖動車輛。",
  },
  {
    id: "door-controls",
    icon: "□",
    category: "車輛操作",
    title: "把童鎖、車窗鎖與離車上鎖設好",
    time: "4 分鐘",
    summary: "常載家人時，先確認後門童鎖、車窗鎖及離車自動上鎖；下車後留意車輛是否真的完成上鎖。",
    tips: ["依乘客需求設定左側、右側或雙側童鎖", "確認手機鑰匙的背景與藍牙權限", "在住家等地點是否排除自動上鎖，依你的風險調整"],
  },
  {
    id: "ap-levels",
    icon: "◈",
    category: "輔助駕駛",
    title: "分清 AP、EAP、FSD",
    time: "5 分鐘",
    summary: "名稱相近但功能範圍不同，而且會受地區、硬體與軟體版本限制；以車內實際顯示為準。",
    tips: ["先確認你的車實際購買與啟用項目", "更新後重新閱讀版本說明", "任何等級都要求駕駛持續監督並準備接管"],
    warning: "網路影片中的海外功能，不代表台灣車輛目前可用。",
  },
  {
    id: "tire-spec",
    icon: "○",
    category: "保養",
    title: "換胎不能只看輪圈吋數",
    time: "5 分鐘",
    summary: "尺寸、載重指數、速度等級與車身間隙都會影響安全；較大輪圈也可能改變舒適度、續航與成本。",
    tips: ["先看駕駛座門柱標籤與官方規格", "同軸輪胎維持一致規格與相近磨耗", "換胎後確認胎壓監測與輪圈設定"],
    warning: "不確定相容性時，交由熟悉 Tesla 規格的專業輪胎店確認。",
  },
  {
    id: "service-prep",
    icon: "◇",
    category: "保養",
    title: "異音與警示先留下可重現線索",
    time: "3 分鐘",
    summary: "服務預約前記下發生時間、速度、路況與警示文字，照片或短片通常比只寫「有異音」更有效。",
    tips: ["安全停妥後拍下完整警示", "記錄冷車／熱車、轉彎或顛簸等條件", "透過 Tesla App 服務項目附上資料"],
  },
  {
    id: "child-seat",
    icon: "♙",
    category: "安全",
    title: "兒童座椅先確認位置與固定方式",
    time: "6 分鐘",
    summary: "依兒童體型、座椅規格與車內固定點安裝；每次出發前確認座椅沒有鬆動、安全帶路徑正確。",
    tips: ["閱讀兒童座椅與車主手冊兩份說明", "確認 ISOFIX／安全帶固定點與上拉帶", "兒童不可留在無人看管的車內"],
    warning: "後向式兒童座椅不得放在啟用安全氣囊的前座。",
  },
  {
    id: "load",
    icon: "▤",
    category: "安全",
    title: "露營與搬家前先看車輛負載",
    time: "4 分鐘",
    summary: "乘客、行李、車頂架與拖車重量都會計入負載；重物應放低、固定，避免急煞時移動。",
    tips: ["查看門柱的輪胎與負載資訊標籤", "不要超過標示的乘員與載重限制", "裝載後重新評估胎壓、視野與煞車距離"],
  },
  {
    id: "normal-sounds",
    icon: "∿",
    category: "車輛操作",
    title: "先認識電動車的正常聲響",
    time: "4 分鐘",
    summary: "停車時的泵浦、風扇、冷媒流動、煞車或電池熱管理聲不一定代表故障，官方手冊有聲音範例可比對。",
    tips: ["記錄聲音出現時的充電與空調狀態", "與官方正常運作聲響頁面比對", "伴隨警示、異味或駕駛異常時安排服務"],
  },
  {
    id: "camera-care",
    icon: "◉",
    category: "輔助駕駛",
    title: "鏡頭乾淨，輔助功能才有可靠視野",
    time: "3 分鐘",
    summary: "雨水、霧氣、泥沙、強光與遮擋都可能限制攝影機；出發前快速巡視比事後猜警示有效。",
    tips: ["清潔擋風玻璃與車身鏡頭區域", "不要在鏡頭附近貼膜或裝飾", "畫面提示視野受限時降低依賴並準備接管"],
  },
  {
    id: "range-buffer",
    icon: "∿",
    category: "充電",
    title: "把抵達電量當成動態預測",
    time: "5 分鐘",
    summary: "速度、雨勢、逆風、爬坡、溫度與載重都會改變預估；長途應持續看抵達電量趨勢並保留緩衝。",
    tips: ["使用車機導航到最終目的地", "抵達預估持續下降時提早減速或補電", "不要用標示續航直接當作可行駛距離"],
  },
  {
    id: "charging-lights",
    icon: "✦",
    category: "充電",
    title: "看懂充電埠燈號與解鎖方式",
    time: "4 分鐘",
    summary: "充電埠顏色與閃爍方式可提示待機、充電或故障狀態；拔槍前需停止充電並確認車輛已解鎖。",
    tips: ["P 檔時可用 Tesla 充電槍按鈕開啟充電口", "遇到紅色或異常燈號先看車內訊息", "不要拉扯、扭折或強行拔除接頭"],
  },
  {
    id: "low-voltage",
    icon: "!",
    category: "安全",
    title: "低電壓系統沒電時，處理方式不同",
    time: "6 分鐘",
    summary: "車門、前行李廂與高電壓電池可能無法用平常方式操作；先看手冊的年式對應步驟並聯絡道路救援。",
    tips: ["不要把機械開門裝置當日常把手", "記住 App 內道路救援入口", "救援人員到場前不要自行拆卸高電壓部件"],
    warning: "不同年式的低電壓架構與接點可能不同，只依你的車主手冊操作。",
  },
  {
    id: "flood",
    icon: "≈",
    category: "安全",
    title: "車輛泡水後不要自行重新啟動",
    time: "3 分鐘",
    summary: "若車輛曾遭淹水或泡水，遠離車輛並聯絡救援與保險；不要嘗試充電或恢復高電壓系統。",
    tips: ["先確保人員安全並遠離積水", "告知救援人員這是電動車", "依官方泡水車輛指引安排檢查與運送"],
    warning: "若看到煙霧、火焰、火花或異常發熱，立即聯絡緊急服務並保持距離。",
  },
  {
    id: "maintenance-cycle",
    icon: "◷",
    category: "保養",
    title: "把官方保養週期放進行事曆",
    time: "5 分鐘",
    summary: "2025+ 台灣手冊列出煞車油健全檢查、車廂濾網、HEPA／碳纖濾網、雨刷與輪胎換位等建議週期。",
    tips: ["輪胎每 10,000 公里或胎紋差達 1.5 mm 時換位，以先到者為準", "車廂空氣濾清器每 2 年、HEPA 與碳纖濾清器每 3 年", "煞車油健全情況每 4 年檢查；雨刷葉片建議每年更換"],
    warning: "週期會依年式、駕駛方式與環境不同；以你的車主手冊及實際車況為準。",
  },
];

type FirstWeekTask = {
  title: string;
  detail: string;
  steps: string[];
  helpLinks?: string[];
};

type HelpTopic = {
  id: string;
  title: string;
  icon: string;
  summary: string;
  media?: {
    kind: "photo" | "icon";
    src?: string;
    alt?: string;
    caption?: string;
  };
  steps: string[];
  highlight: string;
  source: string;
};

const firstWeek: FirstWeekTask[] = [
  {
    title: "完成手機鑰匙配對，實際用鑰匙卡解鎖一次",
    detail: "加碼：確認 App 背景執行與藍牙權限，鑰匙卡隨身備援。",
    steps: ["打開 Tesla App，確認已登入正確帳號。", "到車內控制選單完成手機鑰匙配對。", "離開車輛後，實際用手機靠近解鎖一次。", "把鑰匙卡放在包內固定位置，確認你知道它在哪裡。"],
  },
  {
    title: "調整座椅、方向盤、後視鏡並儲存駕駛設定檔",
    detail: "加碼：家人各建一份設定檔，確認輕鬆進出不會擠到後座。",
    steps: ["先把座椅調到腳能自然踩踏板的位置。", "調整方向盤高度與前後距離，讓手臂保持放鬆。", "設定左右後視鏡，確認看得到車側與後方車流。", "把這組設定儲存成自己的駕駛設定檔。"],
    helpLinks: ["driver-profile"],
  },
  {
    title: "在安全路段練習動能回收與 Hold 停車",
    detail: "加碼：留意滿電、低溫時回充可能較弱，腳仍要隨時準備煞車。",
    steps: ["找一段車少、路面平整的路先練習。", "輕放電門，感受車輛自然減速的節奏。", "練習慢慢收放電門，不要突然全放。", "停車時觀察 Hold 何時啟動，熟悉煞停手感。"],
  },
  {
    title: "設定住家／公司地址與日常充電上限",
    detail: "加碼：建立排程充電與預先調節，長途才依需求提高上限。",
    steps: ["在導航中輸入住家與公司地址。", "到充電頁面，把日常上限調到車輛建議值。", "如果有固定充電習慣，順手設定排程。", "長途出發前再把上限調高，行程結束後恢復日常設定。"],
  },
  {
    title: "確認行車記錄器有紅點且可正常儲存",
    detail: "加碼：實際儲存並播放一次片段，再設定哨兵模式排除地點。",
    steps: ["先確認 USB／儲存裝置已正確插入。", "查看螢幕上的行車記錄器圖示是否正常。", "手動儲存一段片段，確認能在播放區打開。", "依你的停車環境決定是否開啟哨兵模式。"],
  },
  {
    title: "實際走訪一次常用的充電站",
    detail: "加碼：準備第二個備用站，確認第三方 App、付款與轉接需求。",
    steps: ["先在地圖上挑一個你平常會去的充電站。", "實際開去一次，熟悉入口、車位與槍頭位置。", "觀察現場是否需要 App、信用卡或轉接設備。", "順手再記一個備用站，避免臨時沒位子。"],
  },
  {
    title: "閱讀道路救援、緊急開門與 OTA 更新章節",
    detail: "加碼：找到道路救援入口，並安排一次不需用車時的更新流程。",
    steps: ["先在車主手冊或 App 裡找到道路救援入口。", "確認低電壓、緊急開門與手動操作的說明。", "找一個晚上或休息日，預留更新安裝時間。", "更新前先看版本說明，避免臨時需要用車。"],
    helpLinks: ["low-voltage", "manual-door", "manual-operation"],
  },
  {
    title: "設定住家、公司與常用目的地",
    detail: "讓導航、充電排程及地點型偏好更省事；分享車輛前先檢查個資。",
    steps: ["把住家、公司與常去地點加入收藏或常用目的地。", "確認導航能正確辨識這些地點。", "如果會借車，先檢查哪些地址不想被保留。", "必要時刪除或暫停不需要的地點記錄。"],
  },
  {
    title: "把相機、除霧等常用功能排進快捷列",
    detail: "停車時完成配置，行駛中用快捷或語音減少翻找選單。",
    steps: ["打開應用程式啟動器，找出你最常用的功能。", "長按圖示，把它拖到快捷列。", "優先放入相機、除霧、導航與充電相關功能。", "坐回駕駛位確認手伸過去就能快速點到。"],
  },
  {
    title: "實際操作一次前、後行李廂與緊急釋放",
    detail: "了解 Model Y 的前備箱、後行李廂與無電手動開啟位置。",
    steps: ["停車後實際開啟前、後行李廂一次。", "觀察車內按鈕與 App 兩種開啟方式的位置。", "確認前備箱關閉時不要夾到物品。", "順手看懂緊急釋放裝置在哪裡。"],
    helpLinks: ["trunk-release"],
  },
  {
    title: "設定離車上鎖、童鎖與車窗鎖",
    detail: "依家庭需求逐項確認；離車後觀察一次車輛是否真的完成上鎖。",
    steps: ["在車內控制選單找到童鎖與車窗鎖設定。", "依乘客位置設定單邊或雙邊童鎖。", "確認手機鑰匙離開後是否會自動上鎖。", "走遠幾步，實際觀察一次車輛上鎖狀態。"],
  },
  {
    title: "檢查冷胎胎壓、門柱標籤與胎紋",
    detail: "不要只等警示燈；同時看內外側是否偏磨、有無割傷或異物。",
    steps: ["冷車時查看駕駛座車門門柱上的胎壓與規格標籤。", "用胎壓錶確認四輪數值是否一致。", "蹲下檢查胎紋深度與內外側磨耗。", "順手看看有沒有石子、割傷或鼓包。"],
    helpLinks: ["pillar-label"],
  },
  {
    title: "在車內找到警示燈、除霧與雨刷操作",
    detail: "下雨前先學會，不要在視線不清時才邊開車邊找功能。",
    steps: ["停車時先把警示燈位置找出來。", "試一次前擋與後擋除霧操作。", "確認雨刷速度與自動模式在哪裡調整。", "把這些功能的操作順序記熟。"],
  },
  {
    title: "開啟能耗頁面並完成一次短程比較",
    detail: "比較預估與實際消耗，觀察速度、空調、海拔和天候的影響。",
    steps: ["打開能耗頁面或能耗圖。", "跑一段短程路線，再看預估與實際差多少。", "觀察空調、速度與路線起伏對消耗的影響。", "記住哪種開法最接近你的日常習慣。"],
    helpLinks: ["energy-page"],
  },
  {
    title: "確認 Autopilot 功能範圍與接管方式",
    detail: "只在標線清楚的適合路段練習，先訂好施工、豪雨與匝道主動接管規則。",
    steps: ["先看車內目前可用的輔助駕駛功能名稱。", "找一段標線清楚、車流穩定的路練習。", "確認怎麼取消、接管與重新啟用。", "替施工、豪雨、匝道與複雜路口先訂好主動接管規則。"],
    helpLinks: ["autopilot-rules"],
  },
  {
    title: "建立家庭駕駛設定檔與個別手機鑰匙",
    detail: "不要共用帳號密碼；借車結束後記得檢查並移除不再需要的權限。",
    steps: ["為每位常開的人建立獨立駕駛設定檔。", "讓每個人用自己的手機完成配對。", "確認座椅、後視鏡與方向盤會自動切換。", "借車結束後檢查不再需要的授權。"],
  },
  {
    title: "閱讀兒童座椅、載重與安全帶章節",
    detail: "有孩童或常載重物者優先完成，確認固定點、氣囊限制與門柱載重標籤。",
    steps: ["先對照車主手冊與兒童座椅說明書。", "確認固定點、安全帶路徑與上拉帶位置。", "檢查前座氣囊與後向式兒童座椅的限制。", "確認乘客與行李不要超過車輛負載上限。"],
  },
  {
    title: "認識正常運作聲響與警示訊息入口",
    detail: "先聽官方聲音範例；若聲響伴隨警示、異味或駕駛異常再安排服務。",
    steps: ["先把官方正常聲音範例看過一次。", "記錄聲音出現時是否正處於充電、空調或停車狀態。", "若伴隨警示燈、異味或異常震動，立刻停下觀察。", "必要時再透過 App 預約服務。"],
  },
  {
    title: "準備洗車、爆胎、泡水與低電壓故障方案",
    detail: "知道洗車模式、道路救援與安全撤離原則，比臨時搜尋更可靠。",
    steps: ["先看懂洗車模式怎麼開啟與關閉。", "把道路救援與保險電話存在手機裡。", "知道爆胎、泡水、低電壓故障時不要做什麼。", "把這些資料整理成自己的備忘清單。"],
    helpLinks: ["wash-mode"],
  },
];

const helpTopics: HelpTopic[] = [
  {
    id: "driver-profile",
    title: "駕駛設定檔怎麼改、怎麼存",
    icon: "🪪",
    summary: "先把座椅、方向盤和後視鏡調到你舒服的位置，再存成自己的設定檔，之後上車就能一鍵切回來。",
    steps: [
      "到車內觸控螢幕的「控制」>「設定檔」。",
      "選擇「新增駕駛人」，輸入名字並建立設定檔。",
      "把座椅、方向盤和後視鏡調到你喜歡的位置。",
      "如果常上下車不方便，勾選「輕鬆進出」。",
      "改完後，看到提示時按「儲存」即可保存新位置。",
    ],
    highlight: "建議先完成一次實際坐姿調整，再存檔。",
    source: "Tesla Model Y 2025+ 車主手冊｜駕駛人設定檔",
  },
  {
    id: "low-voltage",
    title: "低電壓沒電時怎麼處理",
    icon: "🔋",
    summary: "低電壓沒電時，很多平常靠螢幕或手機能做的事都會失效。這時要先確認怎麼救援，再決定下一步。",
    steps: [
      "先確認車輛是否真的低電壓沒電，不要急著硬開門或硬充電。",
      "如果前車門無法正常開啟，查看手冊的手動解鎖說明。",
      "如果連前行李廂都打不開，按照手冊用外部低電壓電源開鎖。",
      "聯絡道路救援，讓救援人員依年式處理。",
    ],
    highlight: "不同年式的低電壓處理方式可能不同，要對照你的車主手冊。",
    source: "Tesla Model Y 2025+ 車主手冊｜沒電時開啟車門 / 開啟前備箱",
  },
  {
    id: "manual-door",
    title: "緊急開門怎麼做",
    icon: "🚪",
    summary: "只有在沒電或必要時才使用手動車門釋放。前門和後門的位置不一樣，先認清楚再用。",
    steps: [
      "前門：找到車窗開關前方的手動車門解鎖裝置，向上拉。",
      "後門：打開後門袋下方的解鎖蓋，找到機械式解鎖纜線。",
      "向前拉機械式解鎖纜線，就能手動開門。",
      "車輛有電時，優先使用車內正常開門按鈕。",
    ],
    highlight: "車輛行進中不要使用手動車門解鎖。",
    source: "Tesla Model Y 2025+ 車主手冊｜沒電時開啟車門",
  },
  {
    id: "manual-operation",
    title: "Model Y 無電備援怎麼做",
    icon: "✋",
    summary: "Model Y 的備援操作主要是無電時開門與必要時的前備箱處理；平常仍應使用車內正常按鈕與觸控介面。",
    steps: [
      "先確認前門與後門的正常開門按鈕位置。",
      "只有在車輛無電或手冊明確要求時，才使用手動車門釋放。",
      "前門是車窗開關前方的手動釋放裝置；後門是門袋內的機械式釋放纜線。",
      "前備箱若遇到沒電狀態，先依官方手冊使用外部低電壓電源，再處理開啟。",
    ],
    highlight: "Model Y 的手動操作重點是「無電開門」與「必要時備援」，不是日常操作。",
    source: "Tesla Model Y 2025+ 車主手冊｜沒電時開啟車門 / 開啟前備箱",
  },
  {
    id: "trunk-release",
    title: "緊急釋放裝置在哪裡",
    icon: "🧰",
    summary: "Model Y 的重點是前門、後門，以及前備箱與後行李廂相關的緊急處理位置。先在安全狀態下找一次，真的需要時才不會慌。",
    media: {
      kind: "photo",
      src: assetPath("trunk-release.png"),
      alt: "後行李箱緊急釋放裝置照片",
      caption: "後行李箱緊急釋放裝置位置圖：先認清箭頭指向的位置。",
    },
    steps: [
      "先在手冊裡找對應部位的圖示，確認是前車門、後車門，或行李廂相關位置。",
      "前車門的手動釋放在車窗開關前方；後車門則在門袋底部的機械式釋放位置。",
      "前備箱若遇到沒電狀態，先依官方手冊使用外部低電壓電源，再處理開啟。",
      "平常可以先在車內熟悉位置，但不要隨便拉動。",
    ],
    highlight: "先找位置，再看開法，最後才實際操作。",
    source: "Tesla Model Y 2025+ 車主手冊｜沒電時開啟車門 / 開啟前備箱",
  },
  {
    id: "pillar-label",
    title: "門柱上的胎壓標籤在哪裡",
    icon: "🏷️",
    summary: "胎壓與負載標籤在駕駛座前門門柱上，開門後就能看到。先找這張標籤，再去對照冷胎胎壓。",
    media: {
      kind: "photo",
      src: assetPath("door-jamb-label.png"),
      alt: "門柱上的胎壓與規格標籤位置圖",
      caption: "位置圖：開啟駕駛座車門後，箭頭指向的就是門柱標籤。",
    },
    steps: [
      "打開駕駛座車門。",
      "看車門鉸鏈附近、門框內側的車門柱位置。",
      "找到寫有輪胎尺寸、胎壓和載重資訊的標籤。",
      "用這張標籤來對照冷胎胎壓，而不是只看輪胎側邊文字。",
    ],
    highlight: "車門打開後，門柱邊上的那張貼紙就是你要找的。",
    source: "Tesla Model Y 2025+ 車主手冊｜輪胎維護與保養 / 車輛負載",
  },
  {
    id: "energy-page",
    title: "能耗頁面怎麼開",
    icon: "📈",
    summary: "能耗頁面可以看本次駕駛、旅程與平均耗電，幫你快速比較為什麼同一段路電量消耗不同。",
    steps: [
      "在車內觸控螢幕上打開應用程式啟動器。",
      "進入「電量」或「能耗」相關 App。",
      "切到「旅程」或你想看的資料視圖。",
      "點選各段旅程，查看距離、時間與能耗。",
    ],
    highlight: "長途前後看一次，很容易發現耗電差異。",
    source: "Tesla Model Y 2025+ 車主手冊｜旅程資訊",
  },
  {
    id: "autopilot-rules",
    title: "主動接管規則怎麼定",
    icon: "🛣️",
    summary: "主動巡航或自動輔助駕駛不是放手模式。你可以先替施工、豪雨、匝道、複雜路口訂出自己的主動接管規則。",
    steps: [
      "先認出你常開的路段裡，哪些地方最容易需要人工接管。",
      "把施工區、豪雨、標線模糊、匝道和複雜路口列成固定接管點。",
      "啟用功能前，先確認車道、交通與天候都適合。",
      "一旦畫面開始不穩或你沒把握，就提前接管。",
    ],
    highlight: "先訂規則，遇到固定情境就不用臨場猜。",
    source: "Tesla Model Y 2025+ 車主手冊｜關於自動輔助駕駛 / FSD 限制",
  },
  {
    id: "wash-mode",
    title: "洗車模式怎麼開關",
    icon: "🫧",
    summary: "進洗車機前先開洗車模式，會關窗、鎖充電口並停用雨刷和一些警示；離開洗車場後再關掉。",
    steps: [
      "確認車輛停止且未充電。",
      "到「控制」>「服務」>「洗車模式」。",
      "若是自動洗車，再視需要啟用自由滑行 / 空檔模式。",
      "洗完後，按畫面上的退出或開到時速超過 15 km/h 以上自動結束。",
    ],
    highlight: "進洗車機前先開，離開洗車場後再關。",
    source: "Tesla Model Y 2025+ 車主手冊｜清潔 / 洗車模式",
  },
];

const checklistStages = [
  { level: "LEVEL 01", icon: "⚡", title: "接車開局", subtitle: "先把鑰匙、座艙與個人設定準備好", tasks: firstWeek.slice(0, 4) },
  { level: "LEVEL 02", icon: "↗", title: "安心上路", subtitle: "練好駕駛手感、視野與安全基本功", tasks: firstWeek.slice(4, 8) },
  { level: "LEVEL 03", icon: "ϟ", title: "能量補給", subtitle: "搞懂充電、導航與續航節奏", tasks: firstWeek.slice(8, 12) },
  { level: "LEVEL 04", icon: "◎", title: "技能解鎖", subtitle: "開始善用效率工具與輔助功能", tasks: firstWeek.slice(12, 16) },
  { level: "LEVEL 05", icon: "◇", title: "安全備援", subtitle: "把保養、救援與特殊情境收進工具箱", tasks: firstWeek.slice(16) },
];

const advancedTopics: AdvancedTopic[] = [
  {
    id: "quick-bar",
    category: "日常效率",
    icon: "⌘",
    title: "把常用功能放進快捷列",
    useWhen: "每天上車",
    summary: "把相機、除霧、能耗或常用 App 放在最順手的位置，減少行駛中翻選單。",
    steps: ["長按應用程式啟動器中的圖示", "將常用項目拖曳到底部快捷列", "停車時完成配置，駕駛中只做必要操作"],
  },
  {
    id: "voice",
    category: "日常效率",
    icon: "◍",
    title: "用語音取代找選單",
    useWhen: "雙手不離方向盤",
    summary: "導航、溫度、雨刷與媒體等常見操作可先嘗試語音，畫面顯示的可用指令會隨版本更新。",
    steps: ["按下方向盤語音按鍵或依車型操作", "用完整句子說出目的，例如「導航到家」", "先確認車輛回應，再繼續注意路況"],
  },
  {
    id: "profiles",
    category: "駕駛共享",
    icon: "♙",
    title: "設定檔綁定每位駕駛",
    useWhen: "家人輪流開車",
    summary: "座椅、方向盤、後視鏡與多項偏好可跟著駕駛人切換，不用每次重新調整。",
    steps: ["控制 → 設定檔 → 新增駕駛人", "分別完成座椅與後視鏡位置", "啟用「輕鬆進出」前先確認後座空間"],
    note: "代客泊車模式可限制車速與部分功能存取；借車不必共用 Tesla 帳號密碼。",
  },
  {
    id: "keys",
    category: "駕駛共享",
    icon: "⌁",
    title: "管理手機鑰匙與遠端駕駛",
    useWhen: "借車或臨時授權",
    summary: "透過 App 新增或移除駕駛人，並保留鑰匙卡作為手機沒電或連線異常時的備援。",
    steps: ["只授權可信任的人，定期檢查駕駛人清單", "交車後讓每位駕駛完成自己的手機鑰匙", "離車前確認鑰匙卡不在車內"],
  },
  {
    id: "location-charge",
    category: "充電電池",
    icon: "ϟ",
    title: "讓充電上限跟著地點走",
    useWhen: "住家、公司、旅館",
    summary: "Model Y 可記住特定地點的充電上限與電流，日常不必反覆調整。",
    steps: ["停在該地點後開啟「充電」頁面", "依車輛顯示的建議設定日常上限", "長途前再依需求調高，抵達後恢復日常設定"],
    note: "電池類型與軟體版本會影響建議值，請以車上顯示為準。",
  },
  {
    id: "schedule",
    category: "充電電池",
    icon: "◷",
    title: "排程充電與預先調節",
    useWhen: "固定通勤",
    summary: "設定出發時間，讓車廂與電池在出門前就緒；插著電時也能減少行駛中的空調耗能。",
    steps: ["充電 → 排程，建立住家或工作地點排程", "設定「結束於」接近預計出發時間", "同時開啟預先調節，出發前確認 App 狀態"],
  },
  {
    id: "trip-planner",
    category: "導航能耗",
    icon: "↗",
    title: "長途一定用車機導航",
    useWhen: "跨縣市與山路",
    summary: "旅程規劃會依即時能耗與充電站安排停靠；導航到超充也有助於電池準備充電。",
    steps: ["輸入最終目的地，不只輸入下一個休息站", "查看抵達與返程預估電量", "遇到逆風、雨勢或爬坡時保留更多緩衝"],
  },
  {
    id: "energy",
    category: "導航能耗",
    icon: "∿",
    title: "用能耗圖找出續航差異",
    useWhen: "預估電量下降較快",
    summary: "比較預估與實際消耗，從速度、氣候、海拔與其他用電找出差異，不必只盯著公里數。",
    steps: ["在安全停車時開啟能耗資訊", "查看是哪一類消耗高於預期", "先調整車速與空調，再重新評估充電點"],
  },
  {
    id: "climate",
    category: "空調停車",
    icon: "☼",
    title: "分清四種停車空調模式",
    useWhen: "短暫離車或車內休息",
    summary: "「保持恆溫」「寵物模式」「露營模式」用途不同；可用性與限制以車上選項為準。",
    steps: ["離車前從空調畫面選擇正確模式", "確認剩餘電量與螢幕提示", "寵物留車仍應縮短時間並用 App 持續確認"],
    note: "切勿把任何模式當成兒童獨留車內的安全措施。",
  },
  {
    id: "heat",
    category: "空調停車",
    icon: "≋",
    title: "除霧、座椅與方向盤加熱",
    useWhen: "雨天、冬季與潮濕早晨",
    summary: "優先使用局部加熱與預先調節；起霧時直接使用前擋除霧，不要邊開車邊摸索。",
    steps: ["出發前用 App 預先開啟空調", "熟悉前擋與後擋除霧圖示的位置", "鏡頭或玻璃有霧氣時先恢復清晰視野"],
  },
  {
    id: "dashcam",
    category: "安全記錄",
    icon: "●",
    title: "看懂行車記錄器的三個狀態",
    useWhen: "事故、刮傷或異常事件",
    summary: "確認正在錄影、知道如何手動儲存，並在離車前判斷是否需要哨兵模式。",
    steps: ["平時確認行車記錄器圖示無錯誤", "事件發生後先確保安全，再儲存片段", "重要片段盡快備份，避免循環錄影覆蓋"],
  },
  {
    id: "sentry",
    category: "安全記錄",
    icon: "◉",
    title: "用地點管理哨兵模式",
    useWhen: "公共停車場",
    summary: "依風險開啟哨兵模式，並評估是否排除住家、公司或常用地點，以控制待機耗電。",
    steps: ["安全性設定中確認哨兵模式", "依實際環境設定排除地點", "長時間停放前先看剩餘電量"],
  },
  {
    id: "assist",
    category: "輔助駕駛",
    icon: "◎",
    title: "先建立自己的接管規則",
    useWhen: "高速與快速道路",
    summary: "把匝道、施工、豪雨、強光、標線模糊與複雜車流列為主動接管情境。",
    steps: ["啟用前確認鏡頭乾淨且車道清楚", "持續監看前方，不只看螢幕動畫", "情況不確定時提早接管，不等警示"],
    note: "所有自動輔助駕駛功能都不能取代駕駛人；功能會依地區、硬體與版本不同。",
  },
  {
    id: "service",
    category: "保養服務",
    icon: "◇",
    title: "用 App 完成服務閉環",
    useWhen: "異音、警示或耗材更換",
    summary: "從 App 建立服務需求、附上照片與發生條件，並在到店前記下能重現問題的步驟。",
    steps: ["記錄時間、車速、天候與警示文字", "Tesla App → 服務，選擇最接近的問題", "上傳照片或影片，追蹤報價與訊息"],
  },
  {
    id: "tires",
    category: "保養服務",
    icon: "◌",
    title: "輪胎是最常需要管理的耗材",
    useWhen: "每月與長途前",
    summary: "檢查冷胎胎壓、胎紋與內外側磨耗；換輪圈或輪胎後確認車上設定正確。",
    steps: ["以車門柱標示與車上警示為依據", "發現偏磨、抖動或跑偏時安排檢查", "更換不同輪圈後更新輪圈與輪胎設定"],
  },
];

const advancedCategories = ["日常效率", "駕駛共享", "充電電池", "導航能耗", "空調停車", "安全記錄", "輔助駕駛", "保養服務"];

const ownerTips: OwnerTip[] = [
  {
    category: "停車安全",
    icon: "◉",
    title: "哨兵事件沒跳通知，先別認定沒有錄到",
    summary: "停車後若懷疑有碰撞或異常，可先到行車記錄器檢視器確認最近片段；重要影像應儘快備份，避免循環錄影覆蓋。",
    action: "先保全現場 → 停妥後檢查片段 → 立即備份",
    source: "Tesla No.1",
    level: "版本依賴",
    url: "https://teslano1.com/knowledge/sentry-mode-k905/",
  },
  {
    category: "停車安全",
    icon: "▣",
    title: "建立自己的 USB 檢查習慣",
    summary: "不要等到事件發生才確認儲存裝置。平時留意行車記錄器圖示、可用空間與最近影片是否能正常播放。",
    action: "每月抽查一次；長途前再確認一次",
    source: "Tesla No.1",
    level: "安全提醒",
    url: "https://teslano1.com/knowledge-category/operation/",
  },
  {
    category: "充電",
    icon: "ϟ",
    title: "第一次用第三方充電站，預留配對時間",
    summary: "第三方站點的 App、付款、啟動順序與槍頭規格可能不同。出發前確認站點營運狀態、轉接需求與替代站。",
    action: "先裝 App、綁付款，再準備一個備用站",
    source: "TESLA995",
    level: "車主實測",
    url: "https://www.tesla995.com/post-20260524-tesla-charging-guide-taiwan.html",
  },
  {
    category: "充電",
    icon: "↯",
    title: "轉接器能插上，不代表每一站都能用",
    summary: "CCS2 等轉接方案仍受車輛硬體、支援狀態、充電樁與韌體影響；購買前先核對你的車輛與原廠最新資訊。",
    action: "先確認車款／年份／支援狀態，再購買",
    source: "TESLA995",
    level: "版本依賴",
    url: "https://www.tesla995.com/post-20260523-tesla-ccs2-adapter-taiwan-impact.html",
  },
  {
    category: "駕駛習慣",
    icon: "◷",
    title: "安靜與瞬間扭力，容易讓速度感失真",
    summary: "Model Y 加速直接、車室安靜，體感速度可能低於實際車速。市區起步時可改用較柔和模式，並主動查看速限與車速。",
    action: "路口柔和起步；用車速顯示校準體感",
    source: "TESLA995",
    level: "安全提醒",
    url: "https://www.tesla995.com/post-20260601-tesla-speeding-psychology-and-tech.html",
  },
  {
    category: "輔助駕駛",
    icon: "◎",
    title: "先分清 AP、EAP 與 FSD 的能力邊界",
    summary: "名稱相近不代表功能相同，且台灣可用功能會受車輛、地區與版本限制。啟用前先確認畫面顯示，不靠印象操作。",
    action: "看車內功能清單；每次更新後重新確認",
    source: "TESLA995",
    level: "版本依賴",
    url: "https://www.tesla995.com/knowledge.html",
  },
  {
    category: "輪胎保養",
    icon: "◌",
    title: "輪胎尺寸不只影響外觀",
    summary: "輪圈與輪胎尺寸會牽動舒適、續航、胎價與抗坑洞能力。更換前還要核對負重、速度等級與車身干涉。",
    action: "以門柱與車主手冊規格為底線，再談升級",
    source: "TESLA995",
    level: "安全提醒",
    url: "https://www.tesla995.com/post-20260531-tesla-tire-size-guide-for-taiwan-owners.html",
  },
  {
    category: "軟體工具",
    icon: "⌘",
    title: "更新後先花兩分鐘看版本說明",
    summary: "OTA 可能改變選單位置、功能名稱或駕駛感受。更新完成後先讀版本資訊，停車時再測試新功能。",
    action: "閱讀說明 → 檢查常用設定 → 安全環境試用",
    source: "TESLA995",
    level: "版本依賴",
    url: "https://www.tesla995.com/knowledge.html",
  },
  {
    category: "軟體工具",
    icon: "♪",
    title: "自訂鎖車聲前，先留好原始檔與備援",
    summary: "社群工具可製作自訂鎖車聲，但檔名、格式與功能支援會隨版本變動。不要覆蓋行車記錄器的重要資料。",
    action: "使用獨立資料夾；失效時先查版本與格式",
    source: "Tesla No.1",
    level: "車主實測",
    url: "https://teslano1.com/tesla-knowledge/",
  },
];

const ownerTipCategories = ["全部", ...Array.from(new Set(ownerTips.map((tip) => tip.category)))];

const recommendedApps: ToolPick[] = [
  {
    name: "Tessie",
    icon: "📱",
    summary: "很多車主拿它看耗電、充電紀錄、遠端狀態與駕駛數據，適合想把自己的車況看得更細的人。",
    why: "適合想追蹤耗電與用車習慣的新車主。",
    source: "App 比較整理 / Tesla app 社群",
    url: "https://www.tessie.com/",
    badge: "進階紀錄",
  },
  {
    name: "PlugShare",
    icon: "🗺️",
    summary: "找充電站與看站點評價的常見工具，社群回報對第三方充電站很有幫助。",
    why: "適合找第三方充電站、看現場評價。",
    source: "EV 旅程工具比較 / 車主社群",
    url: "https://www.plugshare.com/",
    badge: "找站必備",
  },
  {
    name: "ABRP",
    icon: "🧭",
    summary: "長途規劃常用的 EV 路線工具，適合先粗算充電停靠點，再回到車機導航確認。",
    why: "適合長途旅行前先做路線功課。",
    source: "EV 路線規劃比較",
    url: "https://abetterrouteplanner.com/",
    badge: "長途規劃",
  },
  {
    name: "TezLab",
    icon: "⚙️",
    summary: "主打車輛數據、駕駛統計與電耗分析，常見於想研究自己開法的車主討論中。",
    why: "適合想看駕駛行為與電耗細節。",
    source: "App 比較整理 / 車主社群",
    url: "https://www.tezlabapp.com/",
    badge: "用車分析",
  },
];

const recommendedAccessories: ToolPick[] = [
  {
    name: "全車／後車廂腳踏墊",
    icon: "🧼",
    summary: "防泥沙、防雨水、防小孩食物碎屑，幾乎是最常見的第一批升級。",
    why: "最先保護車內地毯，日常最有感。",
    source: "Model Y 配件評比 / 車主社群",
    url: "https://besttesla.com/magazine/best-tesla-model-y-accessories-2026",
    badge: "優先買",
  },
  {
    name: "螢幕保護貼",
    icon: "🛡️",
    summary: "減少手指油污與刮傷風險，適合把大螢幕當主要操作入口的 Model Y。",
    why: "螢幕是整台車最常碰的地方。",
    source: "配件評比 / 社群推薦",
    url: "https://teslaaccessoriesguide.com/model-y/",
    badge: "日常保護",
  },
  {
    name: "中央扶手收納",
    icon: "🧰",
    summary: "把悠遊卡、鑰匙、零錢、充電線整理好，減少每次找東西的時間。",
    why: "最直接降低車內雜亂。",
    source: "Juniper/Model Y 配件整理",
    url: "https://www.basenor.com/blogs/tesla-guides/best-tesla-model-y-accessories",
    badge: "整理收納",
  },
  {
    name: "車頂遮陽簾／遮陽板",
    icon: "🌤️",
    summary: "夏天停戶外時很實用，能減少車內悶熱與冷氣負擔。",
    why: "適合台灣炎熱氣候與戶外停車。",
    source: "Model Y 配件評比 / 熱天使用情境",
    url: "https://evpicked.com/best-tesla-model-y-accessories",
    badge: "熱天必看",
  },
  {
    name: "輪胎打氣機",
    icon: "🫧",
    summary: "搭配胎壓標籤一起看，能在低胎壓或長途前快速補氣。",
    why: "和門柱胎壓標籤最直接搭配。",
    source: "Juniper 車主入門配件",
    url: "https://www.teslamodelguy.com/best/tesla-model-y-juniper-accessories",
    badge: "安全備品",
  },
  {
    name: "置物收納盒／後車廂整理",
    icon: "📦",
    summary: "前備箱、後車廂與中央扶手的收納件，能把日常雜物分層放好。",
    why: "適合通勤、接送與露營使用。",
    source: "Tesla accessories guide / 車主社群",
    url: "https://besttesla.com/magazine/best-tesla-model-y-accessories-2026",
    badge: "實用型",
  },
];

const scenarios = [
  {
    q: "手機沒電，怎麼開車？",
    a: "用隨身攜帶的鑰匙卡感應 B 柱解鎖，再將卡片放在中央置物區指定位置後踩煞車啟動。位置可能依年式不同，請看車內提示。",
  },
  {
    q: "車輛螢幕卡住了？",
    a: "先安全停車。通常可在車輛停妥時，同時長按方向盤兩側滾輪重啟觸控螢幕；若警示持續或影響駕駛，請透過 App 聯絡服務。",
  },
  {
    q: "輪胎爆胎或車輛無法行駛？",
    a: "開啟警示燈並移至安全處，不要自行以一般方式拖行。從 Tesla App 的「道路救援」依指示求助。",
  },
  {
    q: "下車後發現車門打不開？",
    a: "平時使用車門按鈕。只有低電壓系統失效等緊急情況才使用機械釋放裝置；後門位置依車型與年式而異，務必先讀手冊。",
  },
];

const quiz = [
  {
    q: "Autopilot 啟用後，你應該怎麼做？",
    options: ["放心看手機", "持續看路並準備接管", "雙手離開方向盤"],
    answer: 1,
  },
  {
    q: "長途準備去超級充電站，最佳做法是？",
    options: ["用車機導航到充電站", "到站前關掉導航", "一定要先充到 100%"],
    answer: 0,
  },
  {
    q: "Tesla 是否完全不用保養？",
    options: ["是", "只需洗車", "否，仍需檢查輪胎等項目"],
    answer: 2,
  },
];

export default function Home() {
  const [done, setDone] = useState<string[]>([]);
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [openGuide, setOpenGuide] = useState<string | null>("drive");
  const [openScenario, setOpenScenario] = useState<number | null>(null);
  const [openTask, setOpenTask] = useState<string | null>(firstWeek[0]?.title ?? null);
  const [openHelpTopic, setOpenHelpTopic] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("home");
  const [mobileIndexOpen, setMobileIndexOpen] = useState(false);
  const [advancedCategory, setAdvancedCategory] = useState("日常效率");
  const [openAdvanced, setOpenAdvanced] = useState<string | null>("quick-bar");
  const [ownerTipCategory, setOwnerTipCategory] = useState("全部");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("model-y-first-week");
    if (saved) setDone(JSON.parse(saved));
  }, []);

  const toggleDone = (item: string) => {
    const next = done.includes(item) ? done.filter((x) => x !== item) : [...done, item];
    setDone(next);
    localStorage.setItem("model-y-first-week", JSON.stringify(next));
  };

  const filtered = useMemo(
    () =>
      guides.filter(
        (g) =>
          (category === "全部" || g.category === category) &&
          `${g.title}${g.summary}${g.tips.join("")}`.toLowerCase().includes(query.toLowerCase())
      ),
    [category, query]
  );

  const score = quiz.reduce((n, item, i) => n + (answers[i] === item.answer ? 1 : 0), 0);
  const quizComplete = Object.keys(answers).length === quiz.length;
  const progress = Math.round((done.length / firstWeek.length) * 100);
  const activeHelpTopic = helpTopics.find((topic) => topic.id === openHelpTopic) ?? null;
  const pageTabs = [
    { id: "home", label: "首頁", hint: "先看整體導覽" },
    { id: "path", label: "新手任務", hint: "先把新手清單跑完" },
    { id: "guides", label: "知識庫", hint: "常用操作與查詢" },
    { id: "advanced", label: "進階操作", hint: "設定、能耗、輔助駕駛" },
    { id: "owner-tips", label: "車主錦囊", hint: "社群經驗與實用配件" },
    { id: "rescue", label: "情境急救", hint: "遇到狀況先怎麼做" },
  ];

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="Model Y 新手指南首頁">
          <span className="brand-mark">T</span>
          <span>MODEL Y <b>新手指南</b></span>
        </a>
        <div className="nav-actions">
          <button className="index-button" onClick={() => setMobileIndexOpen(true)}>索引</button>
          <button className="quiz-button" onClick={() => setQuizOpen(true)}>測測看 <span>→</span></button>
        </div>
      </nav>

      <aside className={mobileIndexOpen ? "mobile-index-backdrop open" : "mobile-index-backdrop"} aria-hidden={!mobileIndexOpen}>
        <button className="mobile-index-scrim" type="button" aria-label="關閉索引" onClick={() => setMobileIndexOpen(false)} />
        <div className={mobileIndexOpen ? "mobile-index-sheet open" : "mobile-index-sheet"}>
          <div className="mobile-index-head">
            <div>
              <span>頁面索引</span>
              <b>快速切換區塊</b>
            </div>
            <button type="button" onClick={() => setMobileIndexOpen(false)} aria-label="關閉索引">×</button>
          </div>
          <div className="mobile-index-list">
            {pageTabs.map((page) => (
              <button key={page.id} className={activePage === page.id ? "side-index active" : "side-index"} onClick={() => { setActivePage(page.id); setMobileIndexOpen(false); }}>
                <span>{page.label}</span>
                <small>{page.hint}</small>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <aside className="desktop-page-sidebar" aria-label="頁面側邊索引">
        {pageTabs.map((page) => (
          <button
            key={page.id}
            className={activePage === page.id ? "side-index active" : "side-index"}
            onClick={() => setActivePage(page.id)}
          >
            <span>{page.label}</span>
            <small>{page.hint}</small>
          </button>
        ))}
      </aside>

      <section className={activePage === "home" ? "home-panel page-panel active" : "home-panel page-panel hidden"} id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span /> 給台灣 Model Y 新車主</div>
            <h1>歡迎加入 Tesla，<br /><em>新手任務開始！</em></h1>
            <p>不用硬啃整本手冊。從第一次解鎖、第一次充電到安全使用 Autopilot，一關一關把 Model Y 技能點起來。</p>
            <div className="hero-actions">
              <a className="primary" href="#path">開始第一個任務 <span>↓</span></a>
              <button className="text-button" onClick={() => setQuizOpen(true)}>先挑戰 1 分鐘測驗</button>
            </div>
            <div className="trust-row">
              <span>✓ 依台灣版手冊校準</span>
              <span>✓ 進度留在此裝置</span>
              <span>✓ 2025+ Model Y</span>
            </div>
          </div>
          <div className="hero-utility" aria-label="Model Y 新手快速入口">
            <div className="utility-head">
              <span>START HERE</span>
              <b>你的新手基地</b>
              <small>選一條路線開始，今天完成一小關就很棒。</small>
            </div>
            <div className="utility-list">
              <a href="#path"><i>01</i><span><b>跑新手主線</b><small>五個階段，從接車一路升級到安全備援</small></span><em>→</em></a>
              <a href="#guides"><i>02</i><span><b>翻技能圖鑑</b><small>操作、充電、安全、保養與軟體一次查</small></span><em>→</em></a>
              <a href="#advanced"><i>03</i><span><b>解鎖進階技</b><small>排程、能耗、設定檔與輔助駕駛</small></span><em>→</em></a>
            </div>
            <div className="utility-alert">
              <span>安全底線</span>
              <p>Autopilot 是駕駛輔助；功能名稱與可用性會依車型、年式、地區與軟體版本改變。</p>
              <a href="https://www.tesla.com/ownersmanual/modely/zh_tw/" target="_blank" rel="noreferrer">開啟 2025+ 官方手冊 ↗</a>
            </div>
          </div>
        </section>

        <section className="quick-strip">
        <span className="quick-title">出發前 30 秒</span>
        <div><i>01</i><b>胎壓</b><small>無警示燈</small></div>
        <div><i>02</i><b>電量</b><small>足夠抵達 + 緩衝</small></div>
        <div><i>03</i><b>鏡頭</b><small>乾淨、無遮擋</small></div>
        <div><i>04</i><b>路線</b><small>長途用車機導航</small></div>
        </section>
      </section>

      <div className="page-layout">
        <div className="page-stack">
      <section className={activePage === "path" ? "week-section page-panel active" : "week-section page-panel hidden"} id="path">
        <div className="section-heading">
          <div><span className="kicker">YOUR FIRST QUEST</span><h2>Model Y 新手任務線</h2><p>不用趕進度，也不必一天全破。從接車開局到安全備援，照自己的節奏逐步升級。</p></div>
          <div className="progress-ring" style={{"--p": `${progress * 3.6}deg`} as React.CSSProperties}>
            <div><strong>{progress}%</strong><small>{done.length * 100} XP</small></div>
          </div>
        </div>
        <div className="quest-overview">
          <span><b>{done.length}</b> / {firstWeek.length} 任務完成</span>
          <div><i style={{ width: `${progress}%` }} /></div>
          <em>{progress === 100 ? "全成就解鎖！" : `再完成 ${firstWeek.length - done.length} 項就全破`}</em>
        </div>
        <div className="quest-stages">
          {checklistStages.map((stage, stageIndex) => {
            const stageDone = stage.tasks.filter((item) => done.includes(item.title)).length;
            const complete = stageDone === stage.tasks.length;
            return (
              <section className={complete ? "quest-stage complete" : "quest-stage"} key={stage.level}>
                <header>
                  <span className="stage-icon">{complete ? "✓" : stage.icon}</span>
                  <div><small>{stage.level}</small><h3>{stage.title}</h3><p>{stage.subtitle}</p></div>
                  <em>{complete ? "CLEAR!" : `${stageDone} / ${stage.tasks.length}`}</em>
                </header>
                <div className="checklist">
                  {stage.tasks.map((item) => {
                    const taskIndex = firstWeek.indexOf(item);
                    return (
                      <div key={item.title} className={done.includes(item.title) ? "check-item done" : "check-item"}>
                        <button type="button" className="check-summary" onClick={() => setOpenTask(openTask === item.title ? null : item.title)} aria-expanded={openTask === item.title}>
                          <span className="day">Q{stageIndex + 1}.{taskIndex - checklistStages.slice(0, stageIndex).reduce((n, s) => n + s.tasks.length, 0) + 1}</span>
                          <span className="box">{done.includes(item.title) ? "✓" : ""}</span>
                          <span className="task">
                            <b>{item.title}</b>
                            <small>{item.detail}</small>
                          </span>
                          <span className="xp">{openTask === item.title ? "收起步驟 −" : "+100 XP / 點開看步驟 +"}</span>
                        </button>
                        {openTask === item.title && (
                          <div className="task-steps">
                            <div className="task-steps-head">
                              <div className="task-steps-title">
                                <span className="task-step-icon">🧭</span>
                                <b>怎麼做</b>
                              </div>
                              <button type="button" className="task-done" onClick={() => toggleDone(item.title)}>
                                {done.includes(item.title) ? "取消完成" : "標記完成"}
                              </button>
                            </div>
                            <ol>
                              {item.steps.map((step) => (
                                <li key={step}>{step}</li>
                              ))}
                            </ol>
                            {item.helpLinks?.length ? (
                              <div className="quick-links" aria-label="快捷教學">
                                {item.helpLinks.map((helpId) => {
                                  const topic = helpTopics.find((entry) => entry.id === helpId);
                                  if (!topic) return null;
                                  return (
                                    <button key={helpId} type="button" className="quick-link" onClick={() => setOpenHelpTopic(helpId)}>
                                      <span>{topic.icon}</span>
                                      <b>{topic.title}</b>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className={activePage === "guides" ? "guides-section page-panel active" : "guides-section page-panel hidden"} id="guides">
        <div className="section-heading compact">
          <div><span className="kicker">KNOWLEDGE, CURATED</span><h2>真正需要懂的，只有這幾類</h2></div>
          <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋：充電、胎壓、手機鑰匙…" /></label>
        </div>
        <div className="filters">
          {["全部", ...Array.from(new Set(guides.map((g) => g.category)))].map((c) => (
            <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="guide-grid">
          {filtered.map((g, i) => (
            <article className={openGuide === g.id ? "guide-card expanded" : "guide-card"} key={g.id}>
              <div className="card-top"><span className="card-num">0{i + 1}</span><span className="card-icon">{g.icon}</span><span className="tag">{g.category}</span></div>
              <h3>{g.title}</h3>
              <p>{g.summary}</p>
              {openGuide === g.id && <div className="details"><ul>{g.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>{g.warning && <div className="warning"><b>注意</b>{g.warning}</div>}</div>}
              <button className="card-action" onClick={() => setOpenGuide(openGuide === g.id ? null : g.id)} aria-expanded={openGuide === g.id}>
                <span>{g.time}</span>{openGuide === g.id ? "收起 −" : "展開重點 ＋"}
              </button>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <p className="empty">找不到相符內容，試試「充電」或「胎壓」。</p>}
      </section>

      <section className={activePage === "advanced" ? "advanced-section page-panel active" : "advanced-section page-panel hidden"} id="advanced">
        <div className="advanced-heading">
          <div>
            <span className="kicker light">AFTER DAY 7</span>
            <h2>熟悉之後，<br />開始把車用得更順。</h2>
          </div>
          <div className="advanced-route">
            <span>建議順序</span>
            <div><b>WEEK 02</b><small>省下每天的操作</small></div>
            <i>→</i>
            <div><b>WEEK 03</b><small>掌握充電與能耗</small></div>
            <i>→</i>
            <div><b>WEEK 04</b><small>安全使用進階功能</small></div>
          </div>
        </div>
        <div className="advanced-layout">
          <div className="advanced-tabs" role="tablist" aria-label="進階知識分類">
            {advancedCategories.map((c, i) => (
              <button
                key={c}
                role="tab"
                aria-selected={advancedCategory === c}
                className={advancedCategory === c ? "active" : ""}
                onClick={() => {
                  setAdvancedCategory(c);
                  setOpenAdvanced(advancedTopics.find((topic) => topic.category === c)?.id ?? null);
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>{c}<i>→</i>
              </button>
            ))}
          </div>
          <div className="advanced-content">
            <div className="advanced-summary">
              <span>{advancedTopics.filter((topic) => topic.category === advancedCategory).length} 個必學情境</span>
              <p>先學會最常遇到的操作，再依你的停車與充電環境調整。功能名稱可能隨軟體更新變動。</p>
            </div>
            {advancedTopics.filter((topic) => topic.category === advancedCategory).map((topic) => (
              <article className={openAdvanced === topic.id ? "advanced-card open" : "advanced-card"} key={topic.id}>
                <button onClick={() => setOpenAdvanced(openAdvanced === topic.id ? null : topic.id)} aria-expanded={openAdvanced === topic.id}>
                  <span className="advanced-icon">{topic.icon}</span>
                  <span><small>{topic.useWhen}</small><strong>{topic.title}</strong></span>
                  <i>{openAdvanced === topic.id ? "−" : "+"}</i>
                </button>
                {openAdvanced === topic.id && (
                  <div className="advanced-detail">
                    <p>{topic.summary}</p>
                    <ol>{topic.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                    {topic.note && <div className="advanced-note"><b>記住</b>{topic.note}</div>}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
        <div className="advanced-footer">
          <p><b>判斷原則</b>　方便功能應該減少分心，不是增加操作。行駛中看不懂的功能，先停車再處理。</p>
          <a href="https://www.tesla.com/ownersmanual/modely/zh_tw/" target="_blank" rel="noreferrer">查閱你的最新版手冊 ↗</a>
        </div>
      </section>

      <section className={activePage === "owner-tips" ? "owner-tips-section page-panel active" : "owner-tips-section page-panel hidden"} id="owner-tips">
        <div className="tips-heading">
          <div>
            <span className="kicker">OWNER NOTES</span>
            <h2>車主社群裡，<br />真正實用的小知識</h2>
          </div>
          <div className="tips-context">
            <b>9 則精選</b>
            <p>整理自兩個台灣 Tesla 知識站。標籤會提醒你哪些屬於經驗、版本差異或安全事項；點卡片可查看原始文章。</p>
          </div>
        </div>
        <div className="tip-filters" role="tablist" aria-label="車主錦囊分類">
          {ownerTipCategories.map((c) => (
            <button key={c} className={ownerTipCategory === c ? "active" : ""} onClick={() => setOwnerTipCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="owner-tip-grid">
          {ownerTips.filter((tip) => ownerTipCategory === "全部" || tip.category === ownerTipCategory).map((tip) => (
            <a className="owner-tip-card" href={tip.url} target="_blank" rel="noreferrer" key={tip.title}>
              <div className="tip-meta">
                <span className="tip-icon">{tip.icon}</span>
                <span>{tip.category}</span>
                <em className={`tip-level ${tip.level === "安全提醒" ? "safety" : tip.level === "版本依賴" ? "version" : ""}`}>{tip.level}</em>
              </div>
              <h3>{tip.title}</h3>
              <p>{tip.summary}</p>
              <div className="tip-action"><small>帶走這一招</small><strong>{tip.action}</strong></div>
              <div className="tip-source"><span>來源 · {tip.source}</span><i>閱讀原文 ↗</i></div>
            </a>
          ))}
        </div>
        <div className="tips-disclaimer">
          <b>怎麼讀這一區？</b>
          <p>車主經驗適合當作探索入口，不是安全規範。功能、介面與相容性可能因年式、硬體、地區及軟體版本而不同；操作前請以車內提示與最新版官方手冊為準。</p>
        </div>
        <div className="tool-picks-shell">
          <div className="tool-picks-head">
            <div>
              <span className="kicker">COMMUNITY PICKS</span>
              <h2>大家常推的第三方 App 和車用配件</h2>
              <p>這裡整理的是社群和評測文章裡最常被提到的實用工具。先看「解決什麼問題」，再決定要不要買。</p>
            </div>
            <div className="tool-picks-note">
              <b>小提醒</b>
              <p>第三方 App 與配件會受年式、硬體版本與地區差異影響；買之前先確認你的 Model Y 年份與 fitment。</p>
            </div>
          </div>

          <div className="tool-group">
            <div className="tool-group-title">
              <span>APP</span>
              <h3>實用第三方 App</h3>
            </div>
            <div className="tool-grid">
              {recommendedApps.map((item) => (
                <a className="tool-card" href={item.url} target="_blank" rel="noreferrer" key={item.name}>
                  <div className="tool-top">
                    <span className="tool-icon">{item.icon}</span>
                    <div>
                      <b>{item.name}</b>
                      <small>{item.badge}</small>
                    </div>
                  </div>
                  <p>{item.summary}</p>
                  <div className="tool-why"><b>適合誰</b><span>{item.why}</span></div>
                  <div className="tool-source">{item.source}</div>
                </a>
              ))}
            </div>
          </div>

          <div className="tool-group">
            <div className="tool-group-title">
              <span>ACCESSORIES</span>
              <h3>常見實用配件</h3>
            </div>
            <div className="tool-grid">
              {recommendedAccessories.map((item) => (
                <a className="tool-card" href={item.url} target="_blank" rel="noreferrer" key={item.name}>
                  <div className="tool-top">
                    <span className="tool-icon">{item.icon}</span>
                    <div>
                      <b>{item.name}</b>
                      <small>{item.badge}</small>
                    </div>
                  </div>
                  <p>{item.summary}</p>
                  <div className="tool-why"><b>適合誰</b><span>{item.why}</span></div>
                  <div className="tool-source">{item.source}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={activePage === "rescue" ? "rescue-section page-panel active" : "rescue-section page-panel hidden"} id="rescue">
        <div className="rescue-intro">
          <span className="kicker light">WHEN THINGS GO WRONG</span>
          <h2>遇到狀況，<br />先別慌。</h2>
          <p>常見的四種新手情境，先記住處理原則。實際畫面與步驟請以你的車輛提示為準。</p>
          <a href="https://www.tesla.com/ownersmanual/modely/zh_tw/" target="_blank" rel="noreferrer">開啟 Tesla 官方手冊 ↗</a>
        </div>
        <div className="scenario-list">
          {scenarios.map((s, i) => (
            <button key={s.q} className={openScenario === i ? "scenario open" : "scenario"} onClick={() => setOpenScenario(openScenario === i ? null : i)} aria-expanded={openScenario === i}>
              <span>0{i + 1}</span><div><strong>{s.q}</strong>{openScenario === i && <p>{s.a}</p>}</div><i>{openScenario === i ? "−" : "+"}</i>
            </button>
          ))}
        </div>
      </section>

      </div>
      </div>

      <section className="source-section">
        <div><span className="kicker">KEEP LEARNING</span><h2>資訊會更新，讓官方手冊當最後一關</h2></div>
        <p>車輛功能會隨年式、硬體與軟體版本改變。本指南用來快速建立觀念；涉及安全、規格或實際操作時，請回到你車內的最新版手冊確認。</p>
        <div className="source-links">
          <a href="https://teslano1.com/tesla-knowledge/" target="_blank" rel="noreferrer"><small>車主經驗</small><b>Tesla No.1 知識庫</b><span>↗</span></a>
          <a href="https://www.tesla995.com/knowledge.html" target="_blank" rel="noreferrer"><small>延伸文章</small><b>TESLA995 知識庫</b><span>↗</span></a>
          <a href="https://www.tesla.com/ownersmanual/modely/zh_tw/" target="_blank" rel="noreferrer"><small>官方依據</small><b>Model Y 台灣車主手冊</b><span>↗</span></a>
        </div>
      </section>

      <footer><div className="brand"><span className="brand-mark">T</span><span>MODEL Y <b>新手指南</b></span></div><p>為新車主整理，安全永遠排第一。</p><a href="#top">回到頂端 ↑</a></footer>

      {quizOpen && <div className="modal-backdrop" onMouseDown={() => setQuizOpen(false)}>
        <section className="quiz-modal" role="dialog" aria-modal="true" aria-label="新手測驗" onMouseDown={(e) => e.stopPropagation()}>
          <button className="close" onClick={() => setQuizOpen(false)} aria-label="關閉">×</button>
          <span className="kicker">60-SECOND CHECK</span>
          <h2>{quizComplete ? `你的成績：${score} / ${quiz.length}` : "你準備好上路了嗎？"}</h2>
          {quizComplete && <p className="result-copy">{score === 3 ? "漂亮！核心觀念都答對了。" : "再看一次錯題，安全觀念比滿分更重要。"}</p>}
          <div className="quiz-list">
            {quiz.map((item, i) => <div className="quiz-item" key={item.q}>
              <b><span>0{i + 1}</span>{item.q}</b>
              <div>{item.options.map((o, oi) => <button key={o} disabled={answers[i] !== undefined} className={answers[i] === oi ? (oi === item.answer ? "correct" : "wrong") : answers[i] !== undefined && oi === item.answer ? "correct" : ""} onClick={() => setAnswers({...answers, [i]: oi})}>{o}</button>)}</div>
            </div>)}
          </div>
          {quizComplete && <button className="primary reset" onClick={() => setAnswers({})}>再測一次</button>}
        </section>
      </div>}

      {activeHelpTopic && (
        <div className="modal-backdrop" onMouseDown={() => setOpenHelpTopic(null)}>
          <section className="help-modal" role="dialog" aria-modal="true" aria-label={activeHelpTopic.title} onMouseDown={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setOpenHelpTopic(null)} aria-label="關閉">×</button>
            <div className="help-hero">
              <span>{activeHelpTopic.icon}</span>
              <div>
                <span className="kicker">QUICK GUIDE</span>
                <h2>{activeHelpTopic.title}</h2>
                <p>{activeHelpTopic.summary}</p>
              </div>
            </div>
            <div className="help-highlight">
              <b>先記住</b>
              <p>{activeHelpTopic.highlight}</p>
            </div>
            {activeHelpTopic.media?.kind === "photo" && activeHelpTopic.media.src ? (
              <figure className="help-media">
                <img src={activeHelpTopic.media.src} alt={activeHelpTopic.media.alt ?? activeHelpTopic.title} />
                {activeHelpTopic.media.caption ? <figcaption>{activeHelpTopic.media.caption}</figcaption> : null}
              </figure>
            ) : null}
            <div className="help-steps">
              {activeHelpTopic.steps.map((step, index) => (
                <div className="help-step" key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
            <div className="help-source">{activeHelpTopic.source}</div>
          </section>
        </div>
      )}
    </main>
  );
}
