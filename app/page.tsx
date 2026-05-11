"use client";

// Reactの useState を使えるようにする
// useState は「画面上で変わる値」を管理するための機能
import { useEffect, useState } from "react";

// 難易度の種類を決める
// easy / normal / hard 以外は入れられないようにする
type Difficulty = "easy" | "normal" | "hard";

type Category = "study" | "development" | "work" | "life" | "other";

type FilterStatus = "all" | "active" | "completed";

// クエスト1件分のデータの形を決める
type Quest = {
  // クエストを区別するためのID
  id: string;

  // クエスト名
  title: string;

  // クエストの難易度
  difficulty: Difficulty;

  category: Category;

  // クエストが完了しているかどうか
  completed: boolean;

  // クエスト完了時にもらえる経験値
  exp: number;

  // クエストを作成した日時
  createdAt: string;

  dueDate: string;
};

// 難易度ごとの経験値を決める
const difficultyExp = {
  easy: 10,
  normal: 30,
  hard: 50,
};

// 難易度の表示名を決める
const difficultyLabel = {
  easy: "かんたん",
  normal: "ふつう",
  hard: "むずかしい",
};

const categoryLabel = {
  study: "学習",
  development: "開発",
  work: "仕事",
  life: "生活",
  other: "その他",
};

export default function Home() {
  // 入力欄に入力されたクエスト名を管理する
  const [questTitle, setQuestTitle] = useState("");

  // 選択された難易度を管理する
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const [category, setCategory] = useState<Category>("study");

  // 現在の表示状態を管理する
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // 追加されたクエスト一覧を管理する
  const [quests, setQuests] = useState<Quest[]>([]);

  // LocalStorageの読み込みが終わったかどうかを管理する
  const [isLoaded, setIsLoaded] = useState(false);

  const [dueDate, setDueDate] = useState("");

  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [editingDifficulty, setEditingDifficulty] =
    useState<Difficulty>("easy");

  const [editingCategory, setEditingCategory] = useState<Category>("study");

  const [editingDueDate, setEditingDueDate] = useState("");

  // ページを開いたあとに、LocalStorageからクエスト一覧を読み込む
  useEffect(() => {
    const savedQuests = localStorage.getItem("quests");

    if (savedQuests) {
      setQuests(JSON.parse(savedQuests));
    }

    setIsLoaded(true);
  }, []);

  // questsが変わるたびに、LocalStorageへ保存する
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem("quests", JSON.stringify(quests));
  }, [quests, isLoaded]);

  // 追加ボタンを押したときに実行する処理
  const handleAddQuest = () => {
    // 入力欄が空なら、何も追加しない
    if (questTitle.trim() === "") {
      return;
    }

    // 新しく追加するクエストを作る
    const newQuest: Quest = {
      id: crypto.randomUUID(),
      title: questTitle,
      difficulty: difficulty,
      category: category,
      dueDate: dueDate,
      completed: false,
      exp: difficultyExp[difficulty],
      createdAt: new Date().toISOString(),
    };

    // 今までのクエスト一覧に、新しいクエストを追加する
    setQuests([...quests, newQuest]);

    // 追加後、入力欄を空に戻す
    setQuestTitle("");

    // 難易度も初期値に戻す
    setDifficulty("easy");

    setCategory("study");

    setDueDate("");
  };

  // 削除ボタンを押したときに実行する処理
  // 引数の id は「削除したいクエストのID」
  const handleDeleteQuest = (id: string) => {
    // filter は「条件に合うものだけを残す」配列の機能
    // quest.id !== id は「削除したいIDではないクエストだけ残す」という意味
    const newQuests = quests.filter((quest) => quest.id !== id);

    // 削除後のクエスト一覧で state を更新する
    setQuests(newQuests);
  };

  // 完了ボタンを押したときに実行する処理
  // 指定したIDのクエストの completed を true / false で切り替える
  const handleToggleComplete = (id: string) => {
    const newQuests = quests.map((quest) => {
      // IDが一致しないクエストは、そのまま返す
      if (quest.id !== id) {
        return quest;
      }

      // IDが一致したクエストだけ、completed を反転させる
      return {
        ...quest,
        completed: !quest.completed,
      };
    });

    // 更新後のクエスト一覧で state を更新する
    setQuests(newQuests);
  };

  // 編集ボタンを押したときに実行する処理
  const handleStartEdit = (quest: Quest) => {
    setEditingQuestId(quest.id);
    setEditingTitle(quest.title);
    setEditingDifficulty(quest.difficulty ?? "easy");
    setEditingCategory(quest.category ?? "study");
    setEditingDueDate(quest.dueDate ?? "");
  };

  // 編集をキャンセルする処理
  const handleCancelEdit = () => {
    setEditingQuestId(null);
    setEditingTitle("");
    setEditingDifficulty("easy");
    setEditingCategory("study");
    setEditingDueDate("");
  };

  // 編集内容を保存する処理
  const handleSaveEdit = () => {
    if (editingTitle.trim() === "") {
      return;
    }

    const newQuests = quests.map((quest) => {
      if (quest.id !== editingQuestId) {
        return quest;
      }

      return {
        ...quest,
        title: editingTitle,
        difficulty: editingDifficulty,
        category: editingCategory,
        dueDate: editingDueDate,
        exp: difficultyExp[editingDifficulty],
      };
    });

    setQuests(newQuests);
    setEditingQuestId(null);
    setEditingTitle("");
    setEditingDifficulty("easy");
    setEditingCategory("study");
    setEditingDueDate("");
  };

  // 表示するクエストを絞り込む
  const filteredQuests = quests.filter((quest) => {
    // 未完了だけ表示する場合
    if (filterStatus === "active") {
      return !quest.completed;
    }

    // 完了済みだけ表示する場合
    if (filterStatus === "completed") {
      return quest.completed;
    }

    // all の場合はすべて表示する
    return true;
  });

  // 完了済みクエストの経験値だけを合計する
  const totalExp = quests
    .filter((quest) => quest.completed)
    .reduce((sum, quest) => sum + quest.exp, 0);

  // 合計EXPから現在のレベルを計算する
  const level = Math.floor(totalExp / 100) + 1;
  // レベルに応じて称号を決める
  const rankTitle =
    level >= 10
      ? "エキスパート"
      : level >= 5
        ? "アドバンス"
        : level >= 3
          ? "チャレンジャー"
          : "ビギナー";

  // 現在のレベル内でどれだけEXPを獲得しているか
  const currentLevelExp = totalExp % 100;

  // 次のレベルまでに必要なEXP
  const expToNextLevel = 100 - currentLevelExp;

  // 次のレベルまでの進捗率
  const progressPercent = currentLevelExp;

  // クエストが期限切れかどうかを判定する
  const isOverdue = (quest: Quest) => {
    // 期限が設定されていない場合は、期限切れではない
    if (!quest.dueDate) {
      return false;
    }

    // 完了済みの場合は、期限切れではない
    if (quest.completed) {
      return false;
    }

    // 今日の日付を取得する
    const today = new Date();

    // 期限日をDate型に変換する
    const dueDate = new Date(quest.dueDate);

    // 期限日が今日より前なら期限切れ
    return dueDate < today;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">クエスト型タスク管理アプリ</h1>

        <p className="text-slate-300 mb-6">
          今日のタスクをクエストとして登録しよう。
        </p>
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
            <span className="font-bold text-purple-300">
              {expToNextLevel}
            </span>{" "}
            EXP
          </p>
          <p className="text-slate-300">
            称号：<span className="font-bold text-purple-300">{rankTitle}</span>
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

        <section className="rounded-lg bg-slate-900 p-4">
          <h2 className="text-xl font-bold mb-4">クエスト一覧</h2>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`rounded-md px-3 py-1 text-sm font-bold ${
                filterStatus === "all"
                  ? "bg-purple-600"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              すべて
            </button>

            <button
              onClick={() => setFilterStatus("active")}
              className={`rounded-md px-3 py-1 text-sm font-bold ${
                filterStatus === "active"
                  ? "bg-purple-600"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              未完了
            </button>

            <button
              onClick={() => setFilterStatus("completed")}
              className={`rounded-md px-3 py-1 text-sm font-bold ${
                filterStatus === "completed"
                  ? "bg-purple-600"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              完了済み
            </button>
          </div>
          {filteredQuests.length === 0 ? (
            <p className="text-slate-400">まだクエストがありません。</p>
          ) : (
            <ul className="space-y-2">
              {filteredQuests.map((quest) => (
                <li
                  key={quest.id}
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
                        onChange={(e) =>
                          setEditingDifficulty(e.target.value as Difficulty)
                        }
                        className="w-full rounded-md bg-white px-3 py-2 text-slate-900"
                      >
                        <option value="easy">かんたん：10EXP</option>
                        <option value="normal">ふつう：30EXP</option>
                        <option value="hard">むずかしい：50EXP</option>
                      </select>

                      <select
                        value={editingCategory}
                        onChange={(e) =>
                          setEditingCategory(e.target.value as Category)
                        }
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
                    カテゴリ：{categoryLabel[quest.category] ?? "未設定"} /
                    難易度：
                    {difficultyLabel[quest.difficulty]} / 獲得EXP：{quest.exp}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="text-sm text-slate-300">
                        期限：{quest.dueDate ? quest.dueDate : "未設定"}
                        {isOverdue(quest) && (
                          <span className="ml-2 font-bold text-red-300">
                            期限切れ
                          </span>
                        )}
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
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
