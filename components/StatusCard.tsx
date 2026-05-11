type StatusCardProps = {
  totalExp: number;
  level: number;
  expToNextLevel: number;
  progressPercent: number;
  rankTitle: string;
};

export default function StatusCard({
  totalExp,
  level,
  expToNextLevel,
  progressPercent,
  rankTitle,
}: StatusCardProps) {
  return (
    <div className="mb-6 rounded-lg bg-slate-900 p-4">
      <h2 className="mb-2 text-xl font-bold">ステータス</h2>

      <p className="text-slate-300">
        合計EXP：
        <span className="font-bold text-purple-300">{totalExp}</span>
      </p>

      <p className="text-slate-300">
        レベル：
        <span className="font-bold text-purple-300">Lv.{level}</span>
      </p>

      <p className="text-slate-300">
        次のレベルまで：
        <span className="font-bold text-purple-300">{expToNextLevel}</span> EXP
      </p>

      <p className="text-slate-300">
        称号：
        <span className="font-bold text-purple-300">{rankTitle}</span>
      </p>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-sm text-slate-300">
          <span>次のレベルまでの進捗</span>
          <span>{progressPercent}%</span>
        </div>

        <div className="h-3 rounded-full bg-slate-700">
          <div
            className="h-3 rounded-full bg-purple-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
