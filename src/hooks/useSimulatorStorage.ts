import { useEffect, useRef, useState } from 'react';
export const SIMULATOR_KEY = 'android-explorer-session-v3';
export function useSimulatorStorage(snapshot: Record<string, unknown>, apply: (data: Record<string, any>) => void) {
  const [ready,setReady]=useState(false);
  const [storageError,setStorageError]=useState(false);
  const applyRef=useRef(apply);applyRef.current=apply;
  useEffect(()=>{try {const data=JSON.parse(localStorage.getItem(SIMULATOR_KEY)||'null');if(data && data.version===3 && data.state && typeof data.state==='object' && !Array.isArray(data.state)) applyRef.current(data.state);}catch {setStorageError(true);}setReady(true);},[]);
  const serialized=JSON.stringify(snapshot);
  useEffect(()=>{if(!ready)return;try{localStorage.setItem(SIMULATOR_KEY,JSON.stringify({version:3,state:JSON.parse(serialized)}));setStorageError(false);}catch{setStorageError(true);}},[ready,serialized]);
  return {ready,storageError};
}
