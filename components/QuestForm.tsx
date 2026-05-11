type Difficulty = "easy" | "normal" | "hard";

type Category = "study" | "development" | "work" | "life" | "other";

type QuestFormProps = {
  questTitle: string;
  difficulty: Difficulty;
  category: Category;
  dueDate: string;
  setQuestTitle: (value: string) => void;
  setDifficulty: (value: Difficulty) => void;
  setCategory: (value: Category) => void;
  setDueDate: (value: string) => void;
  handleAddQuest: () => void;
};

export default function QuestForm({
  questTitle,
  difficulty,
  category,
  dueDate,
  setQuestTitle,
  setDifficulty,
  setCategory,
  setDueDate,
  handleAddQuest,
}: QuestFormProps) {
  return (
    <div className="rounded-lg bg-slate-900 p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">クエスト追加</h2>

      <div className="space-y-3">
        <input
          type="text"
          value={questTitle}
          onChange={(e) => setQuestTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) {
              return;
            }

            if (e.key === "Enter") {
              handleAddQuest();
            }
          }}
          placeholder="例：Reactの復習をする"
          className="w-full rounded-md bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
        >
          <option value="easy">かんたん：10EXP</option>
          <option value="normal">ふつう：30EXP</option>
          <option value="hard">むずかしい：50EXP</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
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
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
        />

        <button
          onClick={handleAddQuest}
          className="w-full rounded-md bg-purple-600 px-4 py-2 font-bold hover:bg-purple-700"
        >
          クエストを追加
        </button>
      </div>
    </div>
  );
}
