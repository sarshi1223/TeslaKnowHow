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

const firstWeek = [
  { title: "完成手機鑰匙配對，實際用鑰匙卡解鎖一次", detail: "加碼：確認 App 背景執行與藍牙權限，鑰匙卡隨身備援。" },
  { title: "調整座椅、方向盤、後視鏡並儲存駕駛設定檔", detail: "加碼：家人各建一份設定檔，確認輕鬆進出不會擠到後座。" },
  { title: "在安全路段練習動能回收與 Hold 停車", detail: "加碼：留意滿電、低溫時回充可能較弱，腳仍要隨時準備煞車。" },
  { title: "設定住家／公司地址與日常充電上限", detail: "加碼：建立排程充電與預先調節，長途才依需求提高上限。" },
  { title: "確認行車記錄器有紅點且可正常儲存", detail: "加碼：實際儲存並播放一次片段，再設定哨兵模式排除地點。" },
  { title: "實際走訪一次常用的充電站", detail: "加碼：準備第二個備用站，確認第三方 App、付款與轉接需求。" },
  { title: "閱讀道路救援、緊急開門與 OTA 更新章節", detail: "加碼：找到道路救援入口，並安排一次不需用車時的更新流程。" },
  { title: "設定住家、公司與常用目的地", detail: "讓導航、充電排程及地點型偏好更省事；分享車輛前先檢查個資。" },
  { title: "把相機、除霧等常用功能排進快捷列", detail: "停車時完成配置，行駛中用快捷或語音減少翻找選單。" },
  { title: "實際操作一次前、後行李廂與緊急釋放", detail: "了解正常開啟、障礙物高度設定，以及前行李廂內部逃生按鈕。" },
  { title: "設定離車上鎖、童鎖與車窗鎖", detail: "依家庭需求逐項確認；離車後觀察一次車輛是否真的完成上鎖。" },
  { title: "檢查冷胎胎壓、門柱標籤與胎紋", detail: "不要只等警示燈；同時看內外側是否偏磨、有無割傷或異物。" },
  { title: "在車內找到警示燈、除霧與雨刷操作", detail: "下雨前先學會，不要在視線不清時才邊開車邊找功能。" },
  { title: "開啟能耗頁面並完成一次短程比較", detail: "比較預估與實際消耗，觀察速度、空調、海拔和天候的影響。" },
  { title: "確認 Autopilot 功能範圍與接管方式", detail: "只在標線清楚的適合路段練習，先訂好施工、豪雨與匝道主動接管規則。" },
  { title: "建立家庭駕駛設定檔與個別手機鑰匙", detail: "不要共用帳號密碼；借車結束後記得檢查並移除不再需要的權限。" },
  { title: "閱讀兒童座椅、載重與安全帶章節", detail: "有孩童或常載重物者優先完成，確認固定點、氣囊限制與門柱載重標籤。" },
  { title: "認識正常運作聲響與警示訊息入口", detail: "先聽官方聲音範例；若聲響伴隨警示、異味或駕駛異常再安排服務。" },
  { title: "準備洗車、爆胎、泡水與低電壓故障方案", detail: "知道洗車模式、道路救援與安全撤離原則，比臨時搜尋更可靠。" },
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

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="Model Y 新手指南首頁">
          <span className="brand-mark">T</span>
          <span>MODEL Y <b>新手指南</b></span>
        </a>
        <div className="nav-links">
          <a href="#path">新手清單</a>
          <a href="#guides">知識庫</a>
          <a href="#advanced">進階操作</a>
          <a href="#owner-tips">車主錦囊</a>
          <a href="#rescue">情境急救</a>
        </div>
        <button className="quiz-button" onClick={() => setQuizOpen(true)}>測測看 <span>→</span></button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> 給台灣 Model Y 新車主</div>
          <h1>第一次開 Tesla，<br /><em>不用自己摸索。</em></h1>
          <p>從單踏板駕駛、充電，到 Autopilot 與緊急處理。把厚厚的手冊變成可搜尋、能勾選、真正做得到的上手路線。</p>
          <div className="hero-actions">
            <a className="primary" href="#path">開啟新手必做清單 <span>↓</span></a>
            <button className="text-button" onClick={() => setQuizOpen(true)}>先做 1 分鐘測驗</button>
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
            <b>第一次上路前，先確認</b>
            <small>不顯示虛構續航；所有數值請直接看你的車。</small>
          </div>
          <div className="utility-list">
            <a href="#path"><i>01</i><span><b>完成新手清單</b><small>手機鑰匙、胎壓、記錄器與救援</small></span><em>→</em></a>
            <a href="#guides"><i>02</i><span><b>遇到問題就搜尋</b><small>操作、充電、安全、保養與軟體</small></span><em>→</em></a>
            <a href="#advanced"><i>03</i><span><b>熟悉後學進階</b><small>排程、能耗、設定檔與輔助駕駛</small></span><em>→</em></a>
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

      <section className="week-section" id="path">
        <div className="section-heading">
          <div><span className="kicker">NEW OWNER CHECKLIST</span><h2>新手必做清單</h2><p>不限定天數，也不必照順序。依你的用車情境逐項完成，進度會留在這台裝置。</p></div>
          <div className="progress-ring" style={{"--p": `${progress * 3.6}deg`} as React.CSSProperties}>
            <div><strong>{progress}%</strong><small>{done.length} / {firstWeek.length} 完成</small></div>
          </div>
        </div>
        <div className="checklist">
          {firstWeek.map((item, i) => (
            <button key={item.title} className={done.includes(item.title) ? "check-item done" : "check-item"} onClick={() => toggleDone(item.title)}>
              <span className="day">TASK {String(i + 1).padStart(2, "0")}</span>
              <span className="box">{done.includes(item.title) ? "✓" : ""}</span>
              <span className="task"><b>{item.title}</b><small>{item.detail}</small></span>
              <span className="arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section className="guides-section" id="guides">
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

      <section className="advanced-section" id="advanced">
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

      <section className="owner-tips-section" id="owner-tips">
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
      </section>

      <section className="rescue-section" id="rescue">
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
    </main>
  );
}
