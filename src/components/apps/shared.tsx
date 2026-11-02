import React from 'react';

export const CuteStudent = ({ seed }: { seed: number }) => {
  const isGirl = seed % 2 === 0;
  const skinColors = ['#fef08a', '#ffedd5', '#fde047', '#fed7aa'];
  const skin = skinColors[(seed % 4 + 4) % 4];
  if (isGirl) {
    return (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl transition-all duration-300">
        <rect width="100" height="100" fill="#fbcfe8" rx="20"/>
        <path d="M 20 50 Q 50 10 80 50 L 70 80 Q 50 90 30 80 Z" fill="#3f3f46"/>
        <circle cx="50" cy="48" r="24" fill={skin}/>
        <path d="M 26 40 Q 50 20 74 40 Q 50 30 26 40" fill="#3f3f46"/>
        <circle cx="40" cy="50" r="4.5" fill="#18181b"/><circle cx="60" cy="50" r="4.5" fill="#18181b"/>
        <circle cx="41.5" cy="48.5" r="1.5" fill="#fff"/><circle cx="61.5" cy="48.5" r="1.5" fill="#fff"/>
        <circle cx="34" cy="56" r="3.5" fill="#f87171" opacity="0.5"/><circle cx="66" cy="56" r="3.5" fill="#f87171" opacity="0.5"/>
        <path d="M 46 60 Q 50 66 54 60" fill="#e11d48"/>
        <path d="M 25 100 Q 25 80 50 80 Q 75 80 75 100" fill="#ec4899"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl transition-all duration-300">
      <rect width="100" height="100" fill="#e0f2fe" rx="20"/>
      <path d="M 26 45 Q 50 0 74 45" fill="#1e3a8a"/>
      <circle cx="50" cy="48" r="24" fill={skin}/>
      <path d="M 26 38 Q 50 18 74 38 Q 60 25 50 32 Q 40 25 26 38" fill="#1e3a8a"/>
      <circle cx="40" cy="49" r="4" fill="#0f172a"/><circle cx="60" cy="49" r="4" fill="#0f172a"/>
      <circle cx="34" cy="55" r="3" fill="#fca5a5" opacity="0.6"/><circle cx="66" cy="55" r="3" fill="#fca5a5" opacity="0.6"/>
      <path d="M 44 60 Q 50 65 56 60" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 25 100 Q 25 80 50 80 Q 75 80 75 100" fill="#0284c7"/>
    </svg>
  );
};

export interface ActionTargetProps {
  id: string;
  children?: React.ReactNode;
  onClick?: (e: any) => void | boolean;
  onTouchStart?: (e: any) => void;
  onTouchEnd?: (e: any) => void;
  onTouchMove?: (e: any) => void;
  onMouseDown?: (e: any) => void;
  onMouseMove?: (e: any) => void;
  onMouseUp?: (e: any) => void;
  onMouseLeave?: (e: any) => void;
  onPointerDown?: (e: any) => void;
  onPointerMove?: (e: any) => void;
  onPointerUp?: (e: any) => void;
  className?: string;
  style?: React.CSSProperties;
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  disableClickAdvance?: boolean;
  extraTargetIds?: string[];
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'top-left';
  tooltipText?: string;
}

function TargetHint({ position, text, className, arrowClassName }: {
  position: NonNullable<ActionTargetProps['tooltipPosition']>;
  text: string;
  className: string;
  arrowClassName: string;
}) {
  const hintRef = React.useRef<HTMLDivElement>(null);
  const [mobilePlacement, setMobilePlacement] = React.useState<React.CSSProperties | null>(null);
  React.useLayoutEffect(() => {
    const hint = hintRef.current;
    const target = hint?.parentElement;
    if (!hint || !target) return;
    const screen = target.closest('[data-device-screen]');
    let frame = 0;
    const update = () => {
      const isPhone = !!target.closest('[data-device="phone"]') || window.matchMedia('(max-width: 767px)').matches;
      if (!isPhone) { setMobilePlacement(null); return; }
      const bounds = screen?.getBoundingClientRect();
      const targetBounds = target.getBoundingClientRect();
      const leftEdge = Math.max(8, (bounds?.left ?? 0) + 10);
      const rightEdge = Math.min(window.innerWidth - 8, (bounds?.right ?? window.innerWidth) - 10);
      const topEdge = Math.max(8, (bounds?.top ?? 0) + 8);
      const bottomEdge = Math.min(window.innerHeight - 8, (bounds?.bottom ?? window.innerHeight) - 8);
      const width = Math.max(100, Math.min(220, rightEdge - leftEdge));
      const height = hint.offsetHeight;
      const centered = targetBounds.left + (targetBounds.width - width) / 2;
      const left = Math.max(leftEdge, Math.min(centered, rightEdge - width)) - targetBounds.left;
      const above = targetBounds.top - height - 10;
      const below = targetBounds.bottom + 10;
      const preferBelow = position === 'bottom' || above < topEdge;
      const desiredTop = preferBelow && below + height <= bottomEdge ? below : above;
      const top = Math.max(topEdge, Math.min(desiredTop, bottomEdge - height)) - targetBounds.top;
      const visibility = targetBounds.bottom < topEdge || targetBounds.top > bottomEdge ? 'hidden' : 'visible';
      setMobilePlacement(previous => previous?.left === left && previous?.top === top && previous?.width === width && previous?.visibility === visibility ? previous : {
        left, top, width, right: 'auto', bottom: 'auto', margin: 0, transform: 'none', translate: 'none',
        visibility,
      });
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    const observer = new ResizeObserver(schedule);
    observer.observe(hint);
    observer.observe(target);
    if (screen) observer.observe(screen);
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
    };
  }, [position, text]);
  return <div ref={hintRef} data-learning-hint style={mobilePlacement ?? undefined} className={`${className} bg-blue-600 text-white text-[11px] md:text-[13px] px-3 md:px-4 py-2 rounded-xl shadow-xl w-max max-w-[220px] md:max-w-none whitespace-normal md:whitespace-nowrap break-keep z-[110] pointer-events-none font-bold leading-relaxed`}>
    {text}
    <div className={`${arrowClassName} hidden md:block`} />
  </div>;
}

export const ActionTarget = ({
  id, children, onClick, onTouchStart, onTouchEnd, onTouchMove,
  onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onPointerDown, onPointerMove, onPointerUp,
  className = "", style = {}, currentTargetId, advanceQuest, disableClickAdvance,
  extraTargetIds = [], tooltipPosition = 'top', tooltipText = '여기를 누르세요!'
}: ActionTargetProps) => {
  const isTarget = currentTargetId === id || extraTargetIds.includes(currentTargetId as string);
  const tooltipClasses =
    tooltipPosition === 'bottom' ? 'absolute -bottom-12 left-1/2 transform -translate-x-1/2'
    : tooltipPosition === 'left' ? 'absolute top-1/2 right-full mr-3 -translate-y-1/2'
    : tooltipPosition === 'top-left' ? 'absolute -top-12 right-0'
    : 'absolute -top-12 left-1/2 transform -translate-x-1/2';
  const arrowClasses =
    tooltipPosition === 'bottom' ? 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-blue-600'
    : tooltipPosition === 'left' ? 'absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-blue-600'
    : tooltipPosition === 'top-left' ? 'absolute bottom-0 right-6 translate-y-1/2 rotate-45 w-3 h-3 bg-blue-600'
    : 'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-blue-600';
  return (
    <div
      data-action-target={id}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        // Nested targets must not run a second operation in a parent wrapper.
        if (target.closest('[data-action-target]') !== e.currentTarget) return;
        if (target.closest('button:disabled, input:disabled, [aria-disabled="true"]')) return;
        const result = onClick?.(e);
        // A failed validation can explicitly decline mission completion.
        if (!disableClickAdvance && result !== false && !e.defaultPrevented) advanceQuest(id);
      }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      className={`relative ${className} ${isTarget ? 'ring-4 ring-yellow-400 animate-pulse z-[70] rounded-2xl bg-yellow-400/20' : ''}`}
      style={style}
    >
      {isTarget && (
        <TargetHint position={tooltipPosition} text={tooltipText} className={tooltipClasses} arrowClassName={arrowClasses}/>
      )}
      {children}
    </div>
  );
};
