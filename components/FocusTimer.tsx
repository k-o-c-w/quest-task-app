"use client";

import { useEffect, useState } from "react";

type FocusMode = "focus" | "break";

type Difficulty = "easy" | "normal" | "hard";
type Category = "study" | "development" | "work" | "life" | "other";

type Quest = {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: Category;
  completed: boolean;
  exp: number;
  createdAt: string;
  dueDate: string;
  focusMinutes?: number;
};

type FocusTimerProps = {
  quests: Quest[];
  onAddFocusMinutes: (questId: string, minutes: number) => void;
};

const focusOptions = [
  { label: "25分", minutes: 25 },
  { label: "50分", minutes: 50 },
  { label: "60分", minutes: 60 },
];

const breakOptions = [
  { label: "5分", minutes: 5 },
  { label: "10分", minutes: 10 },
];

export default function FocusTimer({
  quests,
  onAddFocusMinutes,
}: FocusTimerProps) {
  // 今が集中時間か休憩時間かを管理する
  const [mode, setMode] = useState<FocusMode>("focus");

  // 選択中の集中時間
  const [focusMinutes, setFocusMinutes] = useState(25);

  // 選択中の休憩時間
  const [breakMinutes, setBreakMinutes] = useState(5);

  // 残り秒数。最初は25分
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  // タイマーが動いているかどうか
  const [isRunning, setIsRunning] = useState(false);

  // 今集中対象として選んでいるクエストID
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  // 秒数を「分:秒」の形に変換する
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;

    return `${minutes}:${restSeconds.toString().padStart(2, "0")}`;
  };

  // 開始ボタン
  const handleStart = () => {
    setIsRunning(true);
  };

  // 一時停止ボタン
  const handlePause = () => {
    setIsRunning(false);
  };

  // リセットボタン
  const handleReset = () => {
    setIsRunning(false);

    if (mode === "focus") {
      setTimeLeft(focusMinutes * 60);
    } else {
      setTimeLeft(breakMinutes * 60);
    }
  };

  // 集中時間を変更したとき
  const handleChangeFocusMinutes = (minutes: number) => {
    setFocusMinutes(minutes);
    setMode("focus");
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  // 休憩時間を変更したとき
  const handleChangeBreakMinutes = (minutes: number) => {
    setBreakMinutes(minutes);
    setMode("break");
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  // タイマーを1秒ずつ減らす処理
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning]);

  // タイマーが0になったときの処理
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (timeLeft !== 0) {
      return;
    }

    setIsRunning(false);

    if (mode === "focus") {
      if (selectedQuestId) {
        onAddFocusMinutes(selectedQuestId, focusMinutes);
      }

      setMode("break");
      setTimeLeft(breakMinutes * 60);
      return;
    }

    setMode("focus");
    setTimeLeft(focusMinutes * 60);
  }, [
    timeLeft,
    isRunning,
    mode,
    selectedQuestId,
    focusMinutes,
    breakMinutes,
    onAddFocusMinutes,
  ]);

  const activeQuests = quests.filter((quest) => !quest.completed);

  const selectedQuest = quests.find((quest) => quest.id === selectedQuestId);

  return (
    <div className="mb-6 rounded-lg bg-slate-900 p-4">
      <h2 className="mb-4 text-xl font-bold">Focus Quest</h2>

      <div className="mb-4">
        <p className="mb-2 text-sm text-slate-300">集中するクエスト</p>

        <select
          value={selectedQuestId ?? ""}
          onChange={(e) => setSelectedQuestId(e.target.value || null)}
          className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
        >
          <option value="">クエストを選択してください</option>

          {activeQuests.map((quest) => (
            <option key={quest.id} value={quest.id}>
              {quest.title}
            </option>
          ))}
        </select>

        {selectedQuest && (
          <p className="mt-2 text-sm text-purple-300">
            選択中：{selectedQuest.title}
          </p>
        )}
      </div>

      <div className="mb-4">
        <p className="mb-2 text-sm text-slate-300">現在のモード</p>
        <p className="text-lg font-bold text-purple-300">
          {mode === "focus" ? "集中時間" : "休憩時間"}
        </p>
      </div>

      <div className="mb-4 text-center">
        <p className="text-5xl font-bold">{formatTime(timeLeft)}</p>
      </div>

      <div className="mb-4 space-y-3">
        <div>
          <p className="mb-2 text-sm text-slate-300">集中時間</p>

          <div className="flex flex-wrap gap-2">
            {focusOptions.map((option) => (
              <button
                key={`${option.label}-${option.minutes}`}
                onClick={() => handleChangeFocusMinutes(option.minutes)}
                className={`rounded-md px-3 py-1 text-sm font-bold ${
                  mode === "focus" && focusMinutes === option.minutes
                    ? "bg-purple-600"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-300">休憩時間</p>

          <div className="flex flex-wrap gap-2">
            {breakOptions.map((option) => (
              <button
                key={`${option.label}-${option.minutes}`}
                onClick={() => handleChangeBreakMinutes(option.minutes)}
                className={`rounded-md px-3 py-1 text-sm font-bold ${
                  mode === "break" && breakMinutes === option.minutes
                    ? "bg-purple-600"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleStart}
          className="rounded-md bg-green-600 px-4 py-2 font-bold hover:bg-green-700"
        >
          開始
        </button>

        <button
          onClick={handlePause}
          className="rounded-md bg-yellow-600 px-4 py-2 font-bold hover:bg-yellow-700"
        >
          一時停止
        </button>

        <button
          onClick={handleReset}
          className="rounded-md bg-slate-600 px-4 py-2 font-bold hover:bg-slate-500"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
