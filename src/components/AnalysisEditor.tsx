import { useAnalysisStore } from "../store/analysis.store";
export default function AnalysisEditor({
  onOpenChat,
}: {
  onOpenChat: () => void;
}) {

  const { analysis } = useAnalysisStore();
  return (
    <div className="mt-4 space-y-3">
      <label className="block">
        <div className="text-xs text-slate-500 mb-1">Explanation</div>
        <textarea
          value={analysis?.explanation ?? ""}
          disabled={true}
          className="w-full border rounded-md p-2 text-sm min-h-[80px] focus:ring-2 focus:ring-indigo-200"
          placeholder="Analysis explanation..."
        />
      </label>
      <label className="block">
        <div className="text-xs text-slate-500 mb-1">Root Cause</div>
        <input
          value={analysis?.rootCause ?? ""}
          disabled={true}
          className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-200"
          placeholder="Root cause..."
        />
      </label>
      <label className="block">
        <div className="text-xs text-slate-500 mb-1">Fix</div>
        <textarea
          value={analysis?.fix ?? ""}
          disabled={true}
          className="w-full border rounded-md p-2 text-sm min-h-[60px] focus:ring-2 focus:ring-indigo-200"
          placeholder="Suggested fix..."
        />
      </label>
      <label className="block">
        <div className="text-xs text-slate-500 mb-1">Improved Code</div>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-auto min-h-[80px]"  >
          <code>{analysis?.improvedCode ?? "// improved code will appear here"}</code>
        </pre>
      </label>
      <div className="flex gap-2">

        <button
          onClick={() => onOpenChat()}
          className="px-4 py-2 border rounded-md text-white bg-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          Open Chat
        </button>
      </div>
    </div>
  );
}