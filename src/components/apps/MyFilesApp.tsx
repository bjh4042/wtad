import React, { useEffect, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Download, FileText, Folder, FolderPlus, HardDrive, MoreVertical, Pencil, RotateCcw, Search, Trash2, X } from 'lucide-react';

export interface PracticeAppProps {
  currentTargetId?: string | null;
  advanceQuest: (id: string) => void;
}
interface PracticeFolder { id: string; name: string }
interface PracticeFile { id: string; name: string; folder: string; size: string; deleted?: boolean }
interface FileState { folders: PracticeFolder[]; files: PracticeFile[] }
const STORAGE_KEY = 'android-explorer-files-v1';
const initialState: FileState = {
  folders: [{ id: 'downloads', name: 'Download' }, { id: 'documents', name: 'Documents' }],
  files: [
    { id: 'class-guide', name: '학습 안내.pdf', folder: 'downloads', size: '124 KB' },
    { id: 'field-note', name: '생태 관찰 기록.txt', folder: 'documents', size: '2 KB' },
  ],
};
function readFiles(): FileState {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (value && Array.isArray(value.folders) && Array.isArray(value.files) && value.folders.length < 100 && value.files.length < 100 &&
      value.folders.every((folder: PracticeFolder) => typeof folder.id === 'string' && typeof folder.name === 'string') &&
      value.files.every((file: PracticeFile) => typeof file.id === 'string' && typeof file.name === 'string' && typeof file.folder === 'string' && typeof file.size === 'string')) return value;
  } catch { /* A browser may block local storage. Practice still works. */ }
  return structuredClone(initialState);
}
export function resetFilesPractice() { try { localStorage.removeItem(STORAGE_KEY); } catch { /* Optional persistence. */ } }

export default function MyFilesApp({ currentTargetId, advanceQuest }: PracticeAppProps) {
  const [data, setData] = useState<FileState>(readFiles);
  const [section, setSection] = useState('internal');
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [dialog, setDialog] = useState<'folder' | 'rename' | 'move' | 'trash' | 'reset' | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState<PracticeFile | null>(null);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* In-memory fallback. */ } }, [data]);
  const selectedFile = data.files.find(file => file.id === selected);
  const folderName = (id: string) => data.folders.find(folder => folder.id === id)?.name || '내장 저장공간';
  const title = section === 'internal' ? '내장 저장공간' : section === 'recent' ? '최근 파일' : section === 'trash' ? '휴지통' : folderName(section);
  const shownFiles = data.files.filter(file => (section === 'trash' ? file.deleted : !file.deleted && (section === 'recent' || file.folder === section)) && file.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const shownFolders = section === 'internal' ? data.folders.filter(folder => folder.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : [];
  const highlight = (id: string) => currentTargetId === id ? 'ring-4 ring-amber-400 ring-offset-2' : '';
  const openSection = (id: string) => {
    setSection(id); setSelected(null); setQuery(''); setPreview(null);
    if (id === 'downloads') advanceQuest('files-downloads-open');
  };
  const begin = (kind: typeof dialog) => { setDialog(kind); setName(kind === 'rename' ? selectedFile?.name || '' : ''); setError(''); };
  const commitName = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 40 || /[\\/:*?"<>|]/.test(trimmed) || trimmed === '.' || trimmed === '..') { setError('1~40자의 이름을 입력하세요. / \\ : * ? " < > | 는 사용할 수 없어요.'); return; }
    if (dialog === 'folder') {
      if (data.folders.length >= 50) { setError('폴더는 최대 50개까지 연습할 수 있어요. 예시 다시 준비로 처음부터 연습해 보세요.'); return; }
      if (currentTargetId === 'files-create-folder' && trimmed !== '수업자료') { setError('이번 미션에서는 폴더 이름을 수업자료로 입력해 주세요.'); return; }
      if (data.folders.some(folder => folder.name === trimmed)) { setError('같은 이름의 폴더가 있어요. 다른 이름을 정해 보세요.'); return; }
      setData(previous => ({ ...previous, folders: [...previous.folders, { id: `folder-${Date.now()}`, name: trimmed }] }));
      setNotice(`내장 저장공간에 “${trimmed}” 폴더를 만들었어요.`); advanceQuest('files-create-folder');
    } else if (dialog === 'rename' && selectedFile) {
      if (trimmed === selectedFile.name) { setError('지금 이름과 다른 이름을 입력하세요.'); return; }
      if (data.files.some(file => file.id !== selectedFile.id && !file.deleted && file.folder === selectedFile.folder && file.name === trimmed)) { setError('이 폴더에 같은 이름의 파일이 있어요.'); return; }
      const extension = selectedFile.name.includes('.') ? selectedFile.name.slice(selectedFile.name.lastIndexOf('.')) : '';
      if (extension && !trimmed.endsWith(extension)) { setError(`파일 종류를 알 수 있도록 끝의 ${extension}는 그대로 남겨 주세요.`); return; }
      setData(previous => ({ ...previous, files: previous.files.map(file => file.id === selected ? { ...file, name: trimmed } : file) }));
      setNotice('파일 이름을 바꿨어요.'); if (selectedFile.id === 'class-guide') advanceQuest('files-rename');
    }
    setDialog(null);
  };
  const moveFile = (destination: string) => {
    if (!selectedFile || destination === selectedFile.folder) return;
    if (data.files.some(file => file.id !== selectedFile.id && !file.deleted && file.folder === destination && file.name === selectedFile.name)) { setError('같은 이름의 파일이 있어요. 다른 폴더를 고르세요.'); return; }
    setData(previous => ({ ...previous, files: previous.files.map(file => file.id === selected ? { ...file, folder: destination } : file) }));
    setSection(destination); setDialog(null); setNotice(`${folderName(destination)} 폴더로 이동했어요.`); if (selectedFile.id === 'class-guide' && folderName(destination) === '수업자료') advanceQuest('files-move');
  };
  const restoreFile = () => {
    if (!selectedFile?.deleted) return;
    setData(previous => ({ ...previous, files: previous.files.map(file => file.id === selected ? { ...file, deleted: false } : file) }));
    setNotice(`“${selectedFile.name}”을 ${folderName(selectedFile.folder)} 폴더로 복원했어요.`); setSelected(null); if (selectedFile.id === 'class-guide') advanceQuest('files-restore');
  };
  const menus = [{ id: 'recent', name: '최근 파일', icon: FileText }, { id: 'downloads', name: '다운로드', icon: Download }, { id: 'internal', name: '내장 저장공간', icon: HardDrive }, { id: 'trash', name: '휴지통', icon: Trash2 }];

  return <section className="relative flex-1 min-h-0 flex flex-col bg-[#f5f5f5] text-[#202124] pt-7 overflow-hidden" aria-label="내 파일 연습">
    <header className="flex items-center justify-between gap-2 px-5 md:px-8 py-4 shrink-0">
      <div><h1 className="text-2xl md:text-3xl font-semibold">내 파일</h1><p className="text-xs text-gray-500 mt-1">연습용 파일 · 실제 태블릿 파일은 바뀌지 않아요</p></div>
      <div className="flex items-center gap-2"><button onClick={() => begin('reset')} className="text-xs text-gray-500 px-3 py-3 rounded-full bg-white">예시 다시 준비</button><button aria-label="새 폴더 만들기" title="새 폴더 만들기" onClick={() => begin('folder')} className={`p-3 rounded-full bg-white text-amber-700 ${highlight('files-create-folder')}`}><FolderPlus size={24}/></button></div>
    </header>
    <div className="flex flex-1 min-h-0 flex-col md:flex-row gap-3 px-3 md:px-6 pb-4">
      <nav aria-label="저장 위치" className="flex md:flex-col shrink-0 md:w-48 gap-1 overflow-x-auto md:overflow-y-auto">
        {menus.map(({ id, name: label, icon: Icon }) => <button key={id} onClick={() => openSection(id)} className={`flex items-center gap-3 px-4 py-3 rounded-2xl whitespace-nowrap min-h-12 text-sm font-medium ${section === id ? 'bg-[#e9e9eb]' : 'hover:bg-white'} ${highlight(id === 'downloads' ? 'files-downloads-open' : id === 'trash' && currentTargetId === 'files-restore' ? 'files-restore' : '')}`}><Icon size={20} className={id === 'trash' ? 'text-gray-500' : 'text-amber-600'}/>{label}</button>)}
      </nav>
      <main className="flex-1 min-w-0 min-h-0 flex flex-col bg-white rounded-3xl overflow-hidden">
        <div className="px-4 md:px-6 py-3 border-b border-gray-100 flex items-center gap-2 shrink-0">
          {section !== 'internal' && <button aria-label="내장 저장공간으로" onClick={() => openSection('internal')} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={22}/></button>}
          <h2 className="font-semibold flex-1 truncate">{title}</h2>
          <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 max-w-[45%]"><Search size={16}/><input aria-label="현재 위치에서 파일 검색" value={query} onChange={event => setQuery(event.target.value)} placeholder="검색" className="w-full min-w-0 bg-transparent py-2 text-sm outline-none"/></div>
        </div>
        {notice && <div role="status" className="mx-4 mt-3 p-3 rounded-xl bg-blue-50 text-blue-800 text-sm">{notice}</div>}
        {section === 'trash' && <p className="px-5 pt-3 text-xs text-gray-500">삭제한 파일을 다시 확인하고 원래 폴더로 복원할 수 있어요. 이 연습에서는 자동으로 지우지 않아요.</p>}
        {selectedFile && <div className="flex flex-wrap gap-2 items-center px-4 py-3 bg-blue-50 shrink-0">
          <span className="text-xs text-blue-800 mr-auto truncate max-w-[180px]">1개 선택 · {selectedFile.name}</span>
          {section === 'trash' ? <button onClick={restoreFile} className={`flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm text-blue-700 ${highlight('files-restore')}`}><RotateCcw size={17}/>복원</button> : <>
            <button onClick={() => begin('rename')} className={`flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm ${highlight('files-rename')}`}><Pencil size={16}/>이름 변경</button>
            <button onClick={() => begin('move')} className={`flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm ${highlight('files-move')}`}><Folder size={17}/>이동</button>
            <button onClick={() => begin('trash')} className={`flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm text-red-600 ${highlight('files-trash')}`}><Trash2 size={17}/>삭제</button>
          </>}
          <button aria-label="선택 취소" onClick={() => setSelected(null)} className="p-2"><X size={18}/></button>
        </div>}
        <div className="overflow-y-auto flex-1 min-h-0 px-2 md:px-4 py-2">
          {shownFolders.map(folder => <button key={folder.id} onClick={() => openSection(folder.id)} className="w-full flex items-center text-left gap-4 px-3 py-4 rounded-2xl hover:bg-gray-50"><Folder size={34} fill="#f9b939" stroke="#f9b939"/><div className="flex-1 min-w-0"><p className="font-medium truncate">{folder.name}</p><p className="text-xs text-gray-500 mt-1">파일 {data.files.filter(file => file.folder === folder.id && !file.deleted).length}개</p></div><ChevronRight size={18} className="text-gray-400"/></button>)}
          {shownFiles.map(file => <div key={file.id} className={`flex items-center gap-3 px-3 py-2 my-1 rounded-2xl ${selected === file.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
            <button aria-label={`${file.name} ${selected === file.id ? '선택 해제' : '선택'}`} aria-pressed={selected === file.id} onClick={() => setSelected(selected === file.id ? null : file.id)} className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-full ${selected === file.id ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-300'} ${['files-rename','files-move','files-trash','files-restore'].includes(currentTargetId || '') && !selected ? 'ring-2 ring-amber-300' : ''}`}>{selected === file.id ? <Check size={20}/> : <span className="w-4 h-4 rounded-full border border-current"/>}</button>
            <button onClick={() => { if (file.deleted) { setSelected(file.id); return; } setPreview(file); if (file.id === 'class-guide') advanceQuest('files-document-open'); }} className={`flex flex-1 min-w-0 items-center gap-3 text-left py-2 rounded-xl ${highlight('files-document-open')}`}><FileText className="text-orange-500 shrink-0" size={30}/><div className="min-w-0"><p className="font-medium truncate">{file.name}</p><p className="text-xs text-gray-500 mt-1">{file.size} · {folderName(file.folder)}</p></div></button>
          </div>)}
          {shownFiles.length === 0 && shownFolders.length === 0 && <div className="text-center text-gray-400 py-16"><Folder size={44} className="mx-auto mb-3 opacity-50"/><p>{query ? '검색 결과가 없어요.' : section === 'trash' ? '휴지통이 비어 있어요.' : '이 폴더에는 파일이 없어요.'}</p></div>}
        </div>
        <p className="text-xs px-5 py-3 text-gray-500 border-t border-gray-100 shrink-0">파일 이름을 누르면 열기 · 왼쪽 동그라미를 누르면 선택</p>
      </main>
    </div>
    {preview && <div className="absolute inset-0 z-[85] bg-[#f5f5f5] flex flex-col pt-8"><div className="flex gap-3 items-center px-5 py-4 bg-white"><button aria-label="파일 닫기" onClick={() => setPreview(null)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft/></button><h2 className="font-medium truncate">{preview.name}</h2></div><div className="overflow-y-auto p-5 md:p-10"><article className="bg-white rounded-xl shadow-sm max-w-xl mx-auto p-7 md:p-10"><p className="text-xs text-blue-600 font-bold tracking-widest mb-8">안드로이드 탐험대 / 연습 문서</p><h3 className="text-2xl font-bold mb-6">나의 태블릿 탐험 기록</h3><p className="leading-8 text-gray-600">다운로드한 자료는 <strong>내 파일 → 다운로드</strong>에서 찾을 수 있어요. 자료를 찾은 뒤 이름을 바꾸고 폴더에 옮기면 다음 수업에도 쉽게 찾을 수 있답니다.</p><div className="my-8 p-5 rounded-2xl bg-amber-50 text-amber-900"><p className="font-bold mb-2">오늘의 연습</p><p className="leading-7">① 수업자료 폴더 만들기<br/>② 파일 이름 바꾸기<br/>③ 폴더로 옮기기<br/>④ 삭제하고 휴지통에서 복원하기</p></div><p className="text-xs text-gray-400">이 자료는 앱 안에 포함된 예시이며 실제 PDF 파일을 내려받지 않습니다.</p></article></div></div>}
    {dialog && <div className="absolute inset-0 z-[95] bg-black/35 flex items-center justify-center p-4" onClick={() => setDialog(null)}><div role="dialog" aria-modal="true" aria-labelledby="files-dialog-title" className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl max-h-[90%] overflow-y-auto" onClick={event => event.stopPropagation()}>
      <h2 id="files-dialog-title" className="text-xl font-semibold mb-4">{dialog === 'folder' ? '새 폴더 만들기' : dialog === 'rename' ? '이름 변경' : dialog === 'move' ? '이동할 폴더 선택' : dialog === 'reset' ? '연습 파일을 다시 준비할까요?' : '휴지통으로 이동할까요?'}</h2>
      {(dialog === 'folder' || dialog === 'rename') && <form onSubmit={event => { event.preventDefault(); commitName(); }}><label className="block text-sm text-gray-500 mb-2" htmlFor="practice-file-name">{dialog === 'folder' ? '폴더 이름 (예: 수업자료)' : '파일 이름 · .pdf, .txt는 그대로 두세요'}</label><input autoFocus id="practice-file-name" value={name} maxLength={40} onChange={event => { setName(event.target.value); setError(''); }} className="w-full border-b-2 border-blue-500 px-1 py-3 outline-none"/><p className="text-xs text-gray-500 mt-3">{dialog === 'folder' ? '내장 저장공간 안에 새 폴더가 만들어져요.' : '무슨 자료인지 알 수 있는 이름으로 바꿔 보세요.'}</p>{error && <p role="alert" className="text-red-600 text-sm mt-3">{error}</p>}<div className="flex justify-end gap-3 mt-6"><button type="button" onClick={() => setDialog(null)} className="px-5 py-3 rounded-full bg-gray-100">취소</button><button type="submit" className="px-5 py-3 rounded-full bg-blue-600 text-white">{dialog === 'folder' ? '만들기' : '변경'}</button></div></form>}
      {dialog === 'move' && <><p className="text-sm text-gray-500 mb-3">{selectedFile?.name}</p>{data.folders.map(folder => <button key={folder.id} disabled={folder.id === selectedFile?.folder} onClick={() => moveFile(folder.id)} className="w-full text-left flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-100 disabled:opacity-40"><Folder size={24} className="text-amber-500"/><span className="flex-1">{folder.name}</span>{folder.id === selectedFile?.folder ? <span className="text-xs">현재 위치</span> : <ChevronRight size={18}/>}</button>)}{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button onClick={() => setDialog(null)} className="w-full mt-4 rounded-full bg-gray-100 py-3">취소</button></>}
      {dialog === 'reset' && <><p className="text-gray-600 leading-7">내 파일에서 만든 폴더와 변경한 연습 파일만 처음 상태로 돌아가요. 미션 기록은 그대로예요.</p><div className="flex justify-end gap-3 mt-6"><button onClick={() => setDialog(null)} className="px-5 py-3 rounded-full bg-gray-100">취소</button><button onClick={() => { setData(structuredClone(initialState)); setSelected(null); setSection('downloads'); setQuery(''); setNotice('예시 파일을 다시 준비했어요.'); setDialog(null); }} className="px-5 py-3 rounded-full bg-blue-600 text-white">다시 준비</button></div></>}
      {dialog === 'trash' && <><p className="text-gray-600 leading-7">“{selectedFile?.name}”을 삭제해도 휴지통에서 다시 복원할 수 있어요.</p><div className="flex justify-end gap-3 mt-6"><button onClick={() => setDialog(null)} className="px-5 py-3 rounded-full bg-gray-100">취소</button><button onClick={() => { if (!selectedFile) return; setData(previous => ({ ...previous, files: previous.files.map(file => file.id === selected ? { ...file, deleted: true } : file) })); setNotice('파일을 휴지통으로 옮겼어요. 왼쪽 휴지통에서 복원해 보세요.'); setSelected(null); setDialog(null); if (selectedFile.id === 'class-guide' && folderName(selectedFile.folder) === '수업자료') advanceQuest('files-trash'); }} className="px-5 py-3 rounded-full bg-red-600 text-white">휴지통으로 이동</button></div></>}
    </div></div>}
  </section>;
}
