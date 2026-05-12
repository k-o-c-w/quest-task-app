type FilterStatus = "all" | "active" | "completed";

type QuestFilterProps = {
  filterStatus: FilterStatus;
  setFilterStatus: (value: FilterStatus) => void;
};

export default function QuestFilter({
  filterStatus,
  setFilterStatus,
}: QuestFilterProps) {
  return (
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
  );
}
