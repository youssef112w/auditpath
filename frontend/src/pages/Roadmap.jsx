// src/pages/Roadmap.jsx
import { useState, useEffect } from 'react'
import api from '../api'

const PHASES = [
  { phase:1, title:'Phase 1 — Foundations', time:'0–2 Months', color:'green',
    tasks:['تعلم أساسيات الـ Blockchain: blocks, transactions, gas, consensus','فهم Ethereum architecture والـ EVM','تعلم Solidity الأساسي: syntax, data types, functions, modifiers, events','دراسة Token Standards: ERC20, ERC721, ERC1155','الأدوات: Remix, MetaMask, Hardhat الأساسي'] },
  { phase:2, title:'Phase 2 — Intermediate Solidity', time:'2–4 Months', color:'purple',
    tasks:['Advanced Solidity: inheritance, interfaces, libraries, assembly','مفاهيم Gas Optimization','تعلم الثغرات الشائعة: reentrancy, integer overflow, access control','دراسة OpenZeppelin بعمق','كتابة ونشر مشاريع صغيرة تحتوي bugs متعمدة'] },
  { phase:3, title:'Phase 3 — Auditing Skills', time:'4–7 Months', color:'yellow',
    tasks:['منهجية الـ Audit: threat modeling, manual review, test coverage','دراسة تقارير audit حقيقية من Trail of Bits, OpenZeppelin, ConsenSys','أدوات الـ Auditing: Slither, Mythril, Echidna, Foundry','كتابة audit reports واضحة مع severity classification','المشاركة في CTFs وـ vulnerable contracts labs'] },
  { phase:4, title:'Phase 4 — Advanced & DeFi', time:'7–10 Months', color:'blue',
    tasks:['Deep dive في DeFi protocols: AMMs, lending, staking, bridges','دراسة MEV, oracle manipulation, flash loan attacks','أساسيات Formal Verification','Audit لأنظمة multi-contract معقدة','المساهمة في open-source security reviews'] },
  { phase:5, title:'Phase 5 — Professional', time:'10–12+ Months', color:'red',
    tasks:['بناء public audit portfolio','المشاركة في audit contests: Code4rena, Sherlock, Immunefi','التواصل مع security researchers','التقدم لـ audit firms أو العمل كـ independent auditor'] },
]

export default function Roadmap({ notify }) {
  const [roadmap, setRoadmap]   = useState({})
  const [expanded, setExpanded] = useState({1:true})
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/roadmap').then(r => { setRoadmap(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const toggle = async (phase, idx) => {
    const key = `${phase}_${idx}`
    try {
      await api.post('/roadmap/toggle', { key })
      setRoadmap(prev => ({ ...prev, [key]: !prev[key] }))
      notify(roadmap[key] ? 'تم إلغاء التحديد' : '✓ مكتمل!')
    } catch { notify('خطأ في الحفظ') }
  }

  if (loading) return <div className="loading">جاري التحميل...</div>

  const totalDone = PHASES.reduce((a,p) => a + p.tasks.filter((_,i) => roadmap[`${p.phase}_${i}`]).length, 0)
  const totalAll  = PHASES.reduce((a,p) => a + p.tasks.length, 0)

  return (
    <div>
      <div className="page-header">
        <div className="page-title">الـ <span>Roadmap</span></div>
        <div className="page-sub">// {totalDone}/{totalAll} مهمة مكتملة</div>
      </div>
      <div className="mentor-card">
        <div className="mentor-title">🎓 نصيحة الـ Mentor</div>
        <div className="mentor-tip">لا تحتاج تخلص Phase كاملة قبل ما تبدأ التالية. <strong>Phases 1 و 2 يمكن يتداخلوا</strong>. حدد كل task لما تحس إنك فعلًا فهمتها، مش لما بتسمع عنها بس.</div>
      </div>
      {PHASES.map(p => {
        const done = p.tasks.filter((_,i) => roadmap[`${p.phase}_${i}`]).length
        const pct  = Math.round((done/p.tasks.length)*100)
        const isExp = expanded[p.phase]
        return (
          <div key={p.phase} className="phase-card" style={{borderTop:`2px solid var(--accent${p.color==='green'?'':p.color==='purple'?'2':p.color==='yellow'?'3':p.color==='blue'?'5':'4'})`}}>
            <div className="phase-header" onClick={() => setExpanded(e => ({...e, [p.phase]: !e[p.phase]}))}>
              <div>
                <div style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:700}}>{p.title}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text3)',marginTop:2}}>{p.time} · {done}/{p.tasks.length} مكتمل</div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span className={`phase-badge ${pct===100?'complete':pct>0?'active':'locked'}`}>{pct===100?'DONE':pct>0?`${pct}%`:'LOCKED'}</span>
                <span style={{color:'var(--text3)',fontSize:12}}>{isExp?'▲':'▼'}</span>
              </div>
            </div>
            <div className="progress-bar mb-8"><div className={`progress-fill ${p.color}`} style={{width:`${pct}%`}} /></div>
            {isExp && p.tasks.map((task,i) => {
              const isDone = !!roadmap[`${p.phase}_${i}`]
              return (
                <div key={i} className="task-item" onClick={() => toggle(p.phase, i)}>
                  <div className={`task-check ${isDone?'done':''}`}>{isDone?'✓':''}</div>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:12,color:isDone?'var(--text3)':'var(--text2)',textDecoration:isDone?'line-through':'none',lineHeight:1.5}}>{task}</div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
