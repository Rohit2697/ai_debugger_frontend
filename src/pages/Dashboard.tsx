import { useEffect, useState } from "react"
import { type Session } from "../store/session.store";
import AnalysisEditor from "../components/AnalysisEditor";

import { CopyButton } from "../components/copyButton";
import { NewSessionModal } from "../components/NewSession";
import { ChatModal } from "../components/ChatModel";
import { useSessionStore } from "../store/session.store"
import { useAnalysisStore } from "../store/analysis.store";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useChatStore } from "../store/chat.store";
import { Trash2 } from "lucide-react";
export default function Dashboard() {
    const navigate = useNavigate()
    const { logout } = useAuthStore()
    const { clearChatHistory } = useChatStore()
    const { clearAnalysis } = useAnalysisStore()
    const { clearSessions } = useSessionStore()
    const { selectSession, sessions, fetchSessions, selectedSession, deleteSession } = useSessionStore()

    const { fetchAnalysis, createAnalysis, deleteAnalysis } = useAnalysisStore()
    const { deleteChatHistory } = useChatStore()
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isNewOpen, setIsNewOpen] = useState(false);

    useEffect(() => { fetchSessions() }, [])
    useEffect(() => {
        if (!selectedSession) return
        fetchAnalysis(selectedSession._id)
    }, [selectedSession])
    async function handleDelete(sessionId: string) {
        if (!window.confirm("Are you sure you want to delete this session? This action cannot be undone.")) return
        await deleteSession(sessionId)
        await deleteAnalysis(sessionId)
        await deleteChatHistory(sessionId)
    }

    async function handleAnalyze(session: Session | null) {
        if (!session) return
        setIsAnalyzing(true);
        await createAnalysis(session._id)
        setIsAnalyzing(false)

    }
    const handleLogout = () => {
        clearSessions();
        clearAnalysis();
        clearChatHistory();
        logout()
        navigate("/login", { replace: true })
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="max-w-7xl mx-auto p-4">
                <header className="mb-4 flex items-center justify-between">

                    {/* Left */}
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            Debug Sessions
                        </h1>
                        <p className="text-sm text-slate-500">
                            Review sessions and analyses
                        </p>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:brightness-105 transition"
                        >
                            Logout
                        </button>
                    </div>

                </header>
                <div className="flex gap-4">

                    {/* Sidebar */}
                    <aside className="w-72 bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">

                        {/* Header */}
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-700">Sessions</div>

                            <button
                                onClick={() => setIsNewOpen(true)}
                                aria-label="Add session"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-orange-500 text-white hover:brightness-95 transition"
                                title="Add session"
                            >
                                <span className="text-lg font-bold">+</span>
                            </button>
                        </div>

                        {/* List */}
                        <ul role="list" className="divide-y overflow-y-auto flex-1">
                            {sessions.map((s) => {
                                const active = s._id === selectedSession?._id;

                                return (
                                    <li key={s._id}>
                                        <button
                                            onClick={() => selectSession(s)}
                                            className={`group w-full text-left px-4 py-3 flex items-center justify-between transition
              ${active ? "bg-orange-100" : "hover:bg-orange-50"}`}
                                            aria-current={active ? "true" : undefined}
                                        >
                                            {/* Title */}
                                            <div className="min-w-0">
                                                <div className="font-medium text-slate-800 truncate">
                                                    {s.title}
                                                </div>
                                            </div>

                                            {/* Delete (on hover) */}
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(s._id);
                                                }}
                                                className="ml-3 text-red-500 hover:text-red-700 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <Trash2 size={18} />
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </aside>

                    {/* Main */}
                    <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {/* Analysis Card */}
                        <section
                            aria-labelledby="analysis-heading"
                            className="bg-white border rounded-lg p-4 shadow-sm space-y-4"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 id="analysis-heading" className="text-lg font-semibold text-slate-800">
                                        Analysis
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        {selectedSession ? `Session: ${selectedSession.title}` : "No session selected"}
                                    </p>
                                </div>

                                {selectedSession && (
                                    <div className="text-xs text-slate-400 truncate max-w-[120px]">
                                        {selectedSession._id}
                                    </div>
                                )}
                            </div>

                            <AnalysisEditor onOpenChat={() => setIsChatOpen(true)} isAnalyzing={isAnalyzing} />
                        </section>

                        {/* Session Card */}
                        <section
                            aria-labelledby="session-heading"
                            className="bg-white border rounded-lg p-4 shadow-sm space-y-4"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">
                                        {selectedSession?.title || "No Session Selected"}
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {selectedSession?.context || "Select or create a session to begin"}
                                    </p>
                                </div>

                                <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 font-medium">
                                    Error
                                </span>
                            </div>

                            {/* Error */}
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Error Message</div>
                                <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-800 whitespace-pre-wrap min-h-[60px]">
                                    {selectedSession?.errorMessage || "No error message provided"}
                                </div>
                            </div>

                            {/* Code */}
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Code</div>
                                <div className="relative">
                                    <pre className="bg-slate-900 text-slate-100 rounded-md p-4 text-sm overflow-auto min-h-[120px]">
                                        <code>
                                            {selectedSession?.codeSnippet ?? "// code will appear here"}
                                        </code>
                                    </pre>

                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <CopyButton text={selectedSession?.codeSnippet ?? ""} />
                                    </div>
                                </div>
                            </div>

                            {/* Language */}
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Language</div>
                                <div className="inline-block px-3 py-1 text-sm rounded-md bg-violet-50 border border-violet-100 text-violet-700 font-medium">
                                    {selectedSession?.language || "N/A"}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => handleAnalyze(selectedSession)}
                                    disabled={!selectedSession || isAnalyzing}
                                    className="inline-flex items-center px-4 py-2 rounded-md bg-orange-500 text-white hover:brightness-105 disabled:opacity-60 transition"
                                >
                                    {isAnalyzing ? "Analyzing..." : "Analyze"}
                                </button>

                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    disabled={!selectedSession}
                                    className="inline-flex items-center px-4 py-2 border rounded-md text-white bg-gray-500 hover:bg-gray-100 hover:text-gray-900 transition disabled:opacity-60"
                                >
                                    Chat
                                </button>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
            {isChatOpen && (
                <ChatModal
                    onClose={() => setIsChatOpen(false)}
                    session={selectedSession}
                />
            )}
            {isNewOpen && (
                <NewSessionModal
                    onClose={() => setIsNewOpen(false)}
                />
            )}
        </div>
    );
}
/* Helpers */

















