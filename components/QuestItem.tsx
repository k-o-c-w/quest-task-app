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

type QuestItemProps = {
  quest: Quest;
  editingQuestId: string | null;
  editingTitle: string;
  editingDifficulty: Difficulty;
  editingCategory: Category;
  editingDueDate: string;
  categoryLabel: Record<Category, string>;
  difficultyLabel: Record<Difficulty, string>;
  isOverdue: (quest: Quest) => boolean;
  setEditingTitle: (value: string) => void;
  setEditingDifficulty: (value: Difficulty) => void;
  setEditingCategory: (value: Category) => void;
  setEditingDueDate: (value: string) => void;
  handleStartEdit: (quest: Quest) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleToggleComplete: (id: string) => void;
  handleDeleteQuest: (id: string) => void;
};

export default function QuestItem({
  quest,
  editingQuestId,
  editingTitle,
  editingDifficulty,
  editingCategory,
  editingDueDate,
  categoryLabel,
  difficultyLabel,
  isOverdue,
  setEditingTitle,
  setEditingDifficulty,
  setEditingCategory,
  setEditingDueDate,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleToggleComplete,
  handleDeleteQuest,
}: QuestItemProps) {
  return (
    <li
      className={`rounded-md p-3 ${
        quest.completed
          ? "bg-slate-700 opacity-60"
          : isOverdue(quest)
            ? "bg-red-950 border border-red-500"
            : "bg-slate-800"
      }`}
    >
      {editingQuestId === quest.id ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
          />

          <select
            value={editingDifficulty}
            onChange={(e) => setEditingDifficulty(e.target.value as Difficulty)}
            className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
          >
            <option value="easy">かんたん：10EXP</option>
            <option value="normal">ふつう：30EXP</option>
            <option value="hard">むずかしい：50EXP</option>
          </select>

          <select
            value={editingCategory}
            onChange={(e) => setEditingCategory(e.target.value as Category)}
            className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
          >
            <option value="study">学習</option>
            <option value="development">開発</option>
            <option value="work">仕事</option>
            <option value="life">生活</option>
            <option value="other">その他</option>
          </select>

          <input
            type="date"
            value={editingDueDate}
            onChange={(e) => setEditingDueDate(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="rounded-md bg-blue-600 px-3 py-1 text-sm font-bold hover:bg-blue-700"
            >
              保存
            </button>

            <button
              onClick={handleCancelEdit}
              className="rounded-md bg-slate-600 px-3 py-1 text-sm font-bold hover:bg-slate-500"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div className="font-bold">{quest.title}</div>
      )}

      <div className="mt-1 text-sm text-slate-300">
        カテゴリ：{categoryLabel[quest.category] ?? "未設定"} / 難易度：
        {difficultyLabel[quest.difficulty]} / 獲得EXP：{quest.exp}
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="text-sm text-slate-300">
            期限：{quest.dueDate ? quest.dueDate : "未設定"}
            {isOverdue(quest) && (
              <span className="ml-2 font-bold text-red-300">期限切れ</span>
            )}
          </div>

          <div className="text-sm text-slate-300">
            集中時間：{quest.focusMinutes ?? 0}分
          </div>

          <button
            onClick={() => handleStartEdit(quest)}
            className="rounded-md bg-blue-600 px-3 py-1 text-sm font-bold hover:bg-blue-700"
          >
            編集
          </button>

          <button
            onClick={() => handleToggleComplete(quest.id)}
            className="rounded-md bg-green-600 px-3 py-1 text-sm font-bold hover:bg-green-700"
          >
            {quest.completed ? "未完了に戻す" : "完了"}
          </button>

          <button
            onClick={() => handleDeleteQuest(quest.id)}
            className="rounded-md bg-red-600 px-3 py-1 text-sm font-bold hover:bg-red-700"
          >
            削除
          </button>
        </div>
      </div>
    </li>
  );
}
