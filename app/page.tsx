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
];

const firstWeek = [
  "完成手機鑰匙配對，實際用鑰匙卡解鎖一次",
  "調整座椅、方向盤、後視鏡並儲存駕駛設定檔",
  "在安全路段練習動能回收與 Hold 停車",
  "設定住家／公司地址與日常充電上限",
  "確認行車記錄器有紅點且可正常儲存",
  "實際走訪一次常用的充電站",
  "閱讀車上手冊的道路救援與緊急開門章節",
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
          <a href="#path">7 天上手</a>
          <a href="#guides">知識庫</a>
          <a href="#rescue">情境急救</a>
        </div>
        <button className="quiz-button" onClick={() => setQuizOpen(true)}>測測看 <span>→</span></button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> 給台灣 Model Y 新車主</div>
          <h1>第一次開 Tesla，<br /><em>不用自己摸索。</em></h1>
          <p>從單踏板駕駛、充電，到 Autopilot 與緊急處理。把厚厚的手冊變成一條清楚、好記、能實作的上手路線。</p>
          <div className="hero-actions">
            <a className="primary" href="#path">開始 7 天上手計畫 <span>↓</span></a>
            <button className="text-button" onClick={() => setQuizOpen(true)}>先做 1 分鐘測驗</button>
          </div>
          <div className="trust-row">
            <span>✓ 依台灣版手冊校準</span>
            <span>✓ 進度留在此裝置</span>
            <span>✓ 2025+ Model Y</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Model Y 車輛資訊示意">
          <div className="sun" />
          <div className="road-lines" />
          <div className="car">
            <div className="roof" />
            <div className="body" />
            <div className="window front" />
            <div className="window rear" />
            <div className="wheel w1" />
            <div className="wheel w2" />
          </div>
          <div className="float-card range"><small>預估續航</small><strong>418 <i>km</i></strong><span><b style={{width:"78%"}} /></span></div>
          <div className="float-card ready"><i>✓</i><div><small>今日任務</small><strong>手機鑰匙已設定</strong></div></div>
          <div className="hero-caption"><span>01</span><div><small>今日第一課</small><b>單踏板駕駛</b></div><em>4 MIN</em></div>
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
          <div><span className="kicker">FIRST WEEK</span><h2>新車第一週，做完這 7 件事</h2><p>每完成一項就打勾。比一次讀完整本手冊更容易記住。</p></div>
          <div className="progress-ring" style={{"--p": `${progress * 3.6}deg`} as React.CSSProperties}>
            <div><strong>{progress}%</strong><small>{done.length} / 7 完成</small></div>
          </div>
        </div>
        <div className="checklist">
          {firstWeek.map((item, i) => (
            <button key={item} className={done.includes(item) ? "check-item done" : "check-item"} onClick={() => toggleDone(item)}>
              <span className="day">DAY {String(i + 1).padStart(2, "0")}</span>
              <span className="box">{done.includes(item) ? "✓" : ""}</span>
              <span className="task">{item}</span>
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
