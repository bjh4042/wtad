import { createFileRoute } from "@tanstack/react-router";
import AndroidExplorer from "@/components/AndroidExplorer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "안드로이드 탐험대 — 초등학생을 위한 갤럭시탭 튜토리얼" },
      { name: "description", content: "초등학생이 갤럭시탭 S10 Ultra(안드로이드 OS)의 기본 사용법을 미션을 통해 재미있게 배우는 튜토리얼 웹앱." },
      { property: "og:title", content: "안드로이드 탐험대" },
      { property: "og:description", content: "퀘스트로 익히는 갤럭시탭 사용법" },
    ],
  }),
  component: AndroidExplorer,
});
