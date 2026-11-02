import React, { useEffect, useRef, useState } from 'react';
import { AlarmClock, Bell, Check, Clock3, Pause, Play, Plus, RotateCcw, Timer, Trash2, X } from 'lucide-react';
import type { PracticeAppProps } from './MyFilesApp';
interface PracticeAlarm { id: string; time: string; label: string; enabled: boolean }
const ALARM_KEY = 'android-explorer-alarms-v1';
function readAlarms(): PracticeAlarm[] {
  try {
    const data = JSON.parse(localStorage.getItem(ALARM_KEY) || '[]');
    if (Array.isArray(data) && data.length <= 20 && data.every(item => typeof item.id === 'string' && /^\d{2}:\d{2}$/.test(item.time) && typeof item.label === 'string' && typeof item.enabled === 'boolean')) return data;
  } catch { /* Optional persistence. */ }
  return [];
}
export function resetClockPractice() { try { localStorage.removeItem(ALARM_KEY); } catch { /* Optional persistence. */ } }
export default function ClockApp({ currentTargetId, advanceQuest }: PracticeAppProps) {
  const [tab, setTab] = useState<'timer' | 'alarm' | 'stopwatch' | 'world'>('timer');
  const [duration, setDuration] = useState(30);
  const [remaining, setRemaining] = useState(30);
  const [running, setRunning] = useState(false);
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('30');
  const [configured, setConfigured] = useState(false);
  const [notice, setNotice] = useState('');
  const [finished, setFinished] = useState(false);
  const deadline = useRef<number | null>(null);
  const [alarms, setAlarms] = useState<PracticeAlarm[]>(readAlarms);
  const [alarmDialog, setAlarmDialog] = useState(false);
  const [alarmTime, setAlarmTime] = useState('08:30');
  const [alarmLabel, setAlarmLabel] = useState('수업 준비');
  const [ringing, setRinging] = useState<string | null>(null);
  const lastAlarmMinute = useRef('');
  const [now, setNow] = useState(() => new Date());
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const stopwatchStart = useRef(0);
  const [laps, setLaps] = useState<number[]>([]);
  useEffect(() => { try { localStorage.setItem(ALARM_KEY, JSON.stringify(alarms)); } catch { /* In-memory fallback. */ } }, [alarms]);
  useEffect(() => {
    const interval = window.setInterval(() => {
      const current = new Date(); setNow(current);
      if (running && deadline.current !== null) {
        const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
        setRemaining(left);
        if (left === 0) { setRunning(false); setFinished(true); deadline.current = null; }
      }
      if (stopwatchRunning) setStopwatchMs(Date.now() - stopwatchStart.current);
      const time = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
      const stamp = `${current.toDateString()} ${time}`;
      if (lastAlarmMinute.current !== stamp) {
        lastAlarmMinute.current = stamp;
        const alarm = alarms.find(item => item.enabled && item.time === time);
        if (alarm) setRinging(alarm.label || '연습 알람');
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [running, alarms, stopwatchRunning]);
  const target = (id: string) => currentTargetId === id ? 'ring-4 ring-amber-400 ring-offset-4' : '';
  const applyDuration = () => {
    const min = Number(minutes), sec = Number(seconds);
    if (!Number.isInteger(min) || !Number.isInteger(sec) || min < 0 || min > 59 || sec < 0 || sec > 59 || min * 60 + sec < 1) { setNotice('0~59분, 0~59초 안에서 1초 이상으로 정하세요.'); return; }
    const next = min * 60 + sec;
    setDuration(next); setRemaining(next); setConfigured(true); setFinished(false); setRunning(false); deadline.current = null;
    setNotice(currentTargetId === 'clock-timer-set' && next !== 60 ? '이번 미션에서는 1분 0초로 맞춘 뒤 적용을 눌러 주세요.' : `${min}분 ${sec}초로 맞췄어요. 시작을 눌러 보세요.`); if (next === 60) advanceQuest('clock-timer-set');
  };
  const startTimer = () => {
    if (remaining <= 0) return;
    deadline.current = Date.now() + remaining * 1000; setRunning(true); setFinished(false); setNotice('타이머가 줄어들고 있어요.'); advanceQuest('clock-timer-start');
  };
  const pauseTimer = () => {
    if (!running) return;
    setRemaining(Math.max(0, Math.ceil(((deadline.current || Date.now()) - Date.now()) / 1000))); setRunning(false); deadline.current = null; setNotice('일시 정지했어요. 계속 누르면 남은 시간부터 이어져요.'); advanceQuest('clock-timer-pause');
  };
  const resetTimer = () => {
    const changed = remaining !== duration || running || configured;
    setRunning(false); setRemaining(duration); deadline.current = null; setFinished(false); setNotice('설정한 시간으로 되돌렸어요.');
    if (changed) advanceQuest('clock-timer-reset');
  };
  const saveAlarm = () => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(alarmTime)) { setNotice('알람 시간을 확인해 주세요.'); return; }
    if (alarms.length >= 20) { setNotice('연습 알람은 최대 20개예요. 먼저 사용하지 않는 알람을 지워 주세요.'); return; }
    setAlarms(previous => [...previous, { id: `alarm-${Date.now()}`, time: alarmTime, label: alarmLabel.trim() || '연습 알람', enabled: true }]);
    setAlarmDialog(false); setNotice(`${alarmTime} 알람을 저장했어요.`); advanceQuest('clock-alarm-save');
  };
  const format = (total: number) => `${String(Math.floor(total / 3600)).padStart(2, '0')}:${String(Math.floor(total % 3600 / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  const stopwatchFormat = (ms: number) => `${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(Math.floor(ms / 10) % 100).padStart(2, '0')}`;
  const tabs = [{ id: 'alarm' as const, label: '알람', icon: AlarmClock }, { id: 'world' as const, label: '세계시각', icon: Clock3 }, { id: 'stopwatch' as const, label: '스톱워치', icon: Timer }, { id: 'timer' as const, label: '타이머', icon: Timer }];
  return <section className="relative flex-1 min-h-0 bg-[#f6f6f6] flex flex-col text-[#1f1f1f] pt-7 overflow-hidden" aria-label="시계 연습">
    <header className="px-6 md:px-10 py-4 shrink-0"><h1 className="text-3xl font-semibold">시계</h1><p className="text-xs text-gray-500 mt-2">연습용 · 이 앱 화면을 열어 두었을 때만 시간을 알려줘요</p></header>
    <main className="flex-1 min-h-0 overflow-y-auto px-5 md:px-10 pb-6">
      {notice && <p role="status" className="p-3 mb-4 bg-blue-50 text-blue-800 rounded-2xl text-sm">{notice}</p>}
      {tab === 'timer' && <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-sm font-medium text-gray-500 mt-3">타이머</h2>
        <div className="relative mx-auto w-52 h-52 md:w-64 md:h-64 my-6 rounded-full border-[8px] border-[#e5e9fa] flex flex-col items-center justify-center bg-white" style={{ borderColor: finished ? '#74c69d' : running ? '#6b83ed' : undefined }}><span className="text-4xl md:text-5xl font-light tabular-nums" aria-label={`남은 시간 ${Math.floor(remaining / 60)}분 ${remaining % 60}초`}>{format(remaining)}</span><span className="text-sm text-gray-400 mt-3">{finished ? '시간이 끝났어요' : running ? '진행 중' : '남은 시간'}</span></div>
        {!running && <form onSubmit={event => { event.preventDefault(); applyDuration(); }} className="flex flex-wrap items-end justify-center gap-3 mb-7"><label className="text-xs text-gray-500">분<input aria-label="타이머 분" inputMode="numeric" type="number" min="0" max="59" value={minutes} onChange={event => setMinutes(event.target.value)} className="block text-center bg-white rounded-xl w-20 text-xl text-gray-900 p-3 mt-1"/></label><label className="text-xs text-gray-500">초<input aria-label="타이머 초" inputMode="numeric" type="number" min="0" max="59" value={seconds} onChange={event => setSeconds(event.target.value)} className="block text-center bg-white rounded-xl w-20 text-xl text-gray-900 p-3 mt-1"/></label><button type="submit" className={`px-5 py-3 rounded-full bg-white text-blue-700 font-semibold ${target('clock-timer-set')}`}>적용</button></form>}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4"><button onClick={resetTimer} className={`flex items-center gap-2 rounded-full bg-white px-6 py-4 text-gray-700 font-semibold ${target('clock-timer-reset')}`}><RotateCcw size={18}/>초기화</button>{running ? <button onClick={pauseTimer} className={`flex items-center gap-2 rounded-full bg-[#e8ebff] px-8 py-4 text-blue-800 font-semibold ${target('clock-timer-pause')}`}><Pause size={18}/>일시 정지</button> : <button onClick={startTimer} disabled={remaining <= 0} className={`flex items-center gap-2 rounded-full bg-[#5068d9] px-8 py-4 text-white font-semibold disabled:opacity-40 ${target('clock-timer-start')}`}><Play size={18}/>{remaining < duration && remaining > 0 ? '계속' : '시작'}</button>}</div>
        <p className="text-xs text-gray-500 leading-6 mt-6">타이머는 정해 둔 시간이 지나면 알려줘요.<br/>알람은 정해 둔 시각이 되었을 때 알려줘요.</p>
      </div>}
      {tab === 'alarm' && <div className="max-w-2xl mx-auto"><div className="flex justify-between items-center py-3 mb-2"><h2 className="text-xl font-semibold">알람</h2><button aria-label="알람 추가" onClick={() => setAlarmDialog(true)} className={`p-3 bg-white rounded-full text-blue-700 ${target('clock-alarm-save')}`}><Plus/></button></div>{alarms.length === 0 ? <div className="bg-white rounded-3xl p-10 text-center text-gray-500"><AlarmClock size={48} className="mx-auto mb-5 text-gray-300"/><p>설정된 알람이 없어요.</p><button onClick={() => setAlarmDialog(true)} className="text-blue-700 mt-4 px-4 py-3">알람 추가</button></div> : alarms.map(alarm => <div key={alarm.id} className="bg-white rounded-3xl p-3 sm:p-5 mb-3 flex items-center gap-2 sm:gap-3"><div className="flex-1 min-w-0"><p className={`text-3xl sm:text-4xl tabular-nums ${alarm.enabled ? 'text-gray-900' : 'text-gray-400'}`}>{alarm.time}</p><p className="text-sm text-gray-500 mt-2 break-words">{alarm.label}</p></div><button role="switch" aria-checked={alarm.enabled} aria-label={`${alarm.time} 알람`} onClick={() => setAlarms(previous => previous.map(item => item.id === alarm.id ? { ...item, enabled: !item.enabled } : item))} className={`w-14 h-8 shrink-0 rounded-full p-1 transition-colors ${alarm.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}><span className={`block w-6 h-6 rounded-full bg-white transition-transform ${alarm.enabled ? 'translate-x-6' : ''}`}/></button><button aria-label={`${alarm.time} 알람 삭제`} onClick={() => setAlarms(previous => previous.filter(item => item.id !== alarm.id))} className="p-2 min-w-11 min-h-11 shrink-0 text-gray-400 hover:text-red-600"><Trash2 size={20}/></button></div>)}</div>}
      {tab === 'stopwatch' && <div className="max-w-xl mx-auto text-center"><h2 className="text-sm text-gray-500 mt-6">스톱워치</h2><p className="text-5xl md:text-6xl font-light tabular-nums py-14">{stopwatchFormat(stopwatchMs)}</p><div className="flex flex-wrap justify-center gap-2 sm:gap-4"><button onClick={() => { if (stopwatchRunning) setLaps(previous => [...previous, stopwatchMs]); else { setStopwatchMs(0); setLaps([]); } }} className="px-6 py-4 rounded-full bg-white">{stopwatchRunning ? '구간 기록' : '초기화'}</button><button onClick={() => { if (!stopwatchRunning) stopwatchStart.current = Date.now() - stopwatchMs; setStopwatchRunning(!stopwatchRunning); }} className="px-8 py-4 rounded-full bg-blue-600 text-white">{stopwatchRunning ? '중지' : stopwatchMs ? '계속' : '시작'}</button></div><div className="mt-8">{laps.map((lap, index) => <div key={index} className="flex justify-between py-3 border-b border-gray-200 text-gray-600"><span>구간 {index + 1}</span><span className="tabular-nums">{stopwatchFormat(lap)}</span></div>)}</div></div>}
      {tab === 'world' && <div className="max-w-xl mx-auto"><h2 className="text-xl font-semibold my-6">세계시각</h2>{[{ city: '서울', zone: 'Asia/Seoul' }, { city: '런던', zone: 'Europe/London' }, { city: '뉴욕', zone: 'America/New_York' }].map(city => <div key={city.zone} className="bg-white rounded-3xl p-6 flex justify-between items-center mb-3"><div><p className="text-lg font-semibold">{city.city}</p><p className="text-xs text-gray-500 mt-2">{now.toLocaleDateString('ko-KR', { timeZone: city.zone, month: 'long', day: 'numeric' })}</p></div><p className="text-3xl tabular-nums">{now.toLocaleTimeString('ko-KR', { timeZone: city.zone, hour: '2-digit', minute: '2-digit', hour12: false })}</p></div>)}</div>}
    </main>
    <nav className="flex justify-around shrink-0 border-t border-gray-200 bg-white px-2 py-2" aria-label="시계 기능">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl min-w-16 ${tab === id ? 'text-blue-700 bg-blue-50 font-bold' : 'text-gray-500'}`}><Icon size={21}/><span className="text-xs">{label}</span></button>)}</nav>
    {(finished || ringing) && <div className="absolute inset-0 z-[90] bg-black/35 flex items-center justify-center p-5"><div role="alertdialog" aria-modal="true" aria-labelledby="clock-alert-title" className="bg-white rounded-3xl p-8 text-center max-w-sm w-full"><Bell size={42} className="mx-auto text-blue-600 mb-5"/><h2 id="clock-alert-title" className="text-xl font-bold mb-3">{ringing || '시간이 끝났어요!'}</h2><p className="text-gray-500 text-sm leading-6 mb-6">{ringing ? '설정한 알람 시각이 되었어요.' : '타이머를 다시 사용하려면 초기화를 누르세요.'}</p><button onClick={() => { setFinished(false); setRinging(null); }} className="bg-blue-600 text-white rounded-full px-8 py-3">확인</button></div></div>}
    {alarmDialog && <div className="absolute inset-0 z-[95] bg-black/35 flex items-center justify-center p-4" onClick={() => setAlarmDialog(false)}><form role="dialog" aria-modal="true" aria-labelledby="alarm-dialog-title" onSubmit={event => { event.preventDefault(); saveAlarm(); }} onClick={event => event.stopPropagation()} className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-sm max-h-full overflow-y-auto"><h2 id="alarm-dialog-title" className="text-xl font-semibold mb-6">알람 추가</h2><label className="block text-sm text-gray-500 mb-2" htmlFor="practice-alarm-time">알람 시각</label><input id="practice-alarm-time" required type="time" value={alarmTime} onChange={event => setAlarmTime(event.target.value)} className="w-full rounded-2xl bg-gray-100 px-4 py-4 text-3xl mb-5"/><label className="block text-sm text-gray-500 mb-2" htmlFor="practice-alarm-label">알람 이름</label><input id="practice-alarm-label" value={alarmLabel} maxLength={30} onChange={event => setAlarmLabel(event.target.value)} className="w-full border-b-2 border-blue-500 py-3 outline-none"/><p className="text-xs text-gray-500 mt-4 leading-6">실제 기기의 알람은 설정되지 않아요.<br/>실제 시계 앱에서도 같은 순서로 설정해 보세요.</p><div className="flex justify-end gap-3 mt-6"><button type="button" onClick={() => setAlarmDialog(false)} className="px-5 py-3 rounded-full bg-gray-100">취소</button><button type="submit" className="px-5 py-3 rounded-full bg-blue-600 text-white">저장</button></div></form></div>}
  </section>;
}
