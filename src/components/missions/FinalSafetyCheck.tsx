import { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

const QUESTIONS = [
  { question: '수업 전에 인터넷이 연결되지 않아요. 먼저 무엇을 확인할까요?', options: ['기기를 바로 초기화한다', 'Wi-Fi 이름과 연결 상태, 비행기 모드를 확인한다', '모르는 앱을 설치한다'], answer: 1, why: '초기화는 자료를 지울 수 있어요. 연결 상태부터 확인하고 해결되지 않으면 선생님께 알려요.' },
  { question: '친구 얼굴과 이름이 나온 사진을 단체방에 올리고 싶어요.', options: ['친구 허락과 개인정보 노출 여부를 확인한다', '내가 찍었으므로 바로 올린다', '얼굴이 작으면 아무 허락도 필요 없다'], answer: 0, why: '사진을 찍는 것과 공유하는 것은 각각 허락이 필요해요. 이름, 위치 등도 살펴봐요.' },
  { question: '학습 자료를 내려받았는데 어디에 있는지 모르겠어요.', options: ['계산기를 연다', '모든 앱을 삭제한다', '내 파일의 다운로드에서 찾는다'], answer: 2, why: '다운로드는 내려받은 자료를 찾는 첫 번째 장소예요. 자료 이름도 확인해요.' },
  { question: '웹사이트가 무료 선물을 주겠다며 APK 설치와 비밀번호 입력을 요구해요.', options: ['설치하고 비밀번호를 입력한다', '요청을 닫고 선생님께 알린다', '친구 비밀번호로 먼저 시험한다'], answer: 1, why: '공식 스토어 밖의 수상한 설치 파일과 비밀번호 요청은 멈추고 어른에게 알려요.' },
  { question: '갤러리에서 필요한 사진을 실수로 지웠어요.', options: ['휴지통을 열어 사진을 복원할 수 있는지 확인한다', '바로 기기를 초기화한다', '새 계정을 만들어야만 되찾을 수 있다'], answer: 0, why: '휴지통 보관 기간 안에는 복원할 수 있어요. 완전히 삭제하기 전에는 꼭 확인해요.' },
  { question: '측면 버튼과 음량 낮추기 버튼을 짧게 동시에 누르면?', options: ['앱이 설치된다', '계정이 삭제된다', '화면이 캡처되고 갤러리에서 확인할 수 있다'], answer: 2, why: '짧게 동시에 눌러요. 캡처에도 개인정보가 담길 수 있어 공유 전에 확인해요.' },
];

export default function FinalSafetyCheck({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const question = QUESTIONS[index];
  const correct = selected === question.answer;
  return (
    <section className="mt-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-3 text-gray-800" aria-label="마지막 상황별 확인">
      <div className="text-xs font-bold text-indigo-700 mb-2">스스로 확인하기 · {index + 1}/{QUESTIONS.length}</div>
      <p className="text-sm font-bold leading-relaxed mb-3">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => (
          <button key={option} disabled={correct || complete} onClick={() => setSelected(optionIndex)} className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs leading-relaxed min-h-11 ${selected === optionIndex ? correct ? 'border-emerald-500 bg-emerald-50' : 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'} disabled:cursor-default`} aria-pressed={selected === optionIndex}>{option}</button>
        ))}
      </div>
      {selected !== null && <div role="status" className="text-xs leading-relaxed mt-3">{correct ? '맞았어요! ' : '다시 생각해보세요. '}{question.why}</div>}
      {correct && <button disabled={complete} onClick={() => {
        if (index === QUESTIONS.length - 1) { setComplete(true); onComplete(); }
        else { setIndex(index + 1); setSelected(null); }
      }} className="mt-3 w-full rounded-xl bg-indigo-600 px-3 py-2.5 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"><CheckCircle2 size={16}/>{index === QUESTIONS.length - 1 ? '확인 마치기' : '다음 상황'}</button>}
      {!correct && selected !== null && <button onClick={() => setSelected(null)} className="mt-2 text-xs text-indigo-700 flex gap-1 items-center"><RotateCcw size={12}/> 다시 고르기</button>}
    </section>
  );
}
