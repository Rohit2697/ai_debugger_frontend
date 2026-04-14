import { useAnalysisStore } from "../store/analysis.store";
import { useSessionStore } from "../store/session.store";
export default function AnalysisEditor({
  onOpenChat,
  isAnalyzing
}: {
  onOpenChat: () => void;
  isAnalyzing: boolean;
}) {

  const { analysis } = useAnalysisStore();
  const { selectedSession } = useSessionStore()
  return (

    <div className="mt-4 space-y-3 relative">

      {/* 🔒 No Session Selected */}
      {!selectedSession && (
        <div className="absolute inset-0 bg-slate-200/60 z-10 flex items-center justify-center rounded-md">
          <p className="text-sm text-slate-700 text-center px-4">
            No session selected. Please select or create a session to start analysis.
          </p>
        </div>
      )}

      {/* ⏳ Analyzing Overlay */}
      {selectedSession && isAnalyzing && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-md">
          <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full mb-2" />
          <p className="text-sm text-slate-600">Analyzing...</p>
        </div>
      )}

      {/* Content (disabled when overlay active) */}
      <div
        className={`${!selectedSession || isAnalyzing
          ? "pointer-events-none select-none opacity-80"
          : ""
          }`}
      >

        {/* Explanation */}
        <div>
          <div className="text-xs text-slate-500 mb-1">Explanation</div>
          <div className="w-full border rounded-md p-3 text-sm bg-slate-50 min-h-[80px] text-slate-800 whitespace-pre-wrap">
            {analysis?.explanation || "Analysis explanation..."}
          </div>
        </div>

        {/* Root Cause */}
        <div>
          <div className="text-xs text-slate-500 mb-1">Root Cause</div>
          <div className="w-full border rounded-md p-3 text-sm bg-slate-50 text-slate-800">
            {analysis?.rootCause || "Root cause..."}
          </div>
        </div>

        {/* Fix */}
        <div>
          <div className="text-xs text-slate-500 mb-1">Fix</div>
          <div className="w-full border rounded-md p-3 text-sm bg-slate-50 min-h-[60px] text-slate-800 whitespace-pre-wrap">
            {analysis?.fix || "Suggested fix..."}
          </div>
        </div>

        {/* Improved Code */}
        <div>
          <div className="text-xs text-slate-500 mb-1">Improved Code</div>
          <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-auto min-h-[80px]">
            <code>
              {analysis?.improvedCode ?? "// improved code will appear here"}
            </code>
          </pre>
        </div>

        {/* Action */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onOpenChat()}
            disabled={!selectedSession}
            className="px-4 py-2 border rounded-md text-white bg-gray-500 hover:bg-gray-100 hover:text-gray-900 transition disabled:opacity-60"
          >
            Open Chat
          </button>
        </div>

      </div>
    </div>
  );
}