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
        logout()
        navigate("/login", { replace: true })
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="max-w-7xl mx-auto p-4">
                <header className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Debug Sessions</h1>
                    <div className="flex flex-col items-end">
                        <div className="text-sm text-slate-600">Review sessions and analyses</div>
                        <button className="p-2 mt-2 text-sm rounded-md bg-red-600 text-white hover:brightness-105 disabled:opacity-60" onClick={handleLogout}>
                            Logout
                        </button></div>

                </header>
                <div className="flex gap-4">
                    {/* Sidebar */}
                    <aside className="w-72 bg-white border rounded-lg shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <div className="text-sm font-medium">Sessions</div>
                            <button
                                onClick={() => setIsNewOpen(true)}
                                aria-label="Add session"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-orange-500 text-white hover:brightness-95"
                                title="Add session"
                            >
                                <span className="text-lg font-bold">+</span>
                            </button>
                        </div>
                        <ul role="list" className="divide-y">
                            {sessions.map((s) => {
                                const active = s._id === selectedSession?._id;
                                return (
                                    <li key={s._id}>
                                        <button
                                            onClick={() => selectSession(s)}
                                            className={`w-full text-left px-4 py-3 hover:bg-orange-50 focus:outline-none flex items-center justify-between ${active ? "bg-orange-100" : ""
                                                }`}
                                            aria-current={active ? "true" : undefined}
                                        >
                                            {/* Left */}
                                            <div className="min-w-0">
                                                <div className="font-medium text-slate-800 truncate">
                                                    {s.title}
                                                </div>
                                            </div>

                                            {/* Right (Delete Icon) */}
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(s._id);
                                                }}
                                                className="ml-3 text-red-500 hover:text-red-700 cursor-pointer"
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
                        {/* Analysis Card (left in right area) */}
                        <section aria-labelledby="analysis-heading" className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 id="analysis-heading" className="text-lg font-semibold">
                                        Analysis
                                    </h2>
                                    <p className="text-sm text-slate-500">Session: {selectedSession?.title}</p>
                                </div>
                                <div className="text-sm text-slate-400">{selectedSession?._id}</div>
                            </div>
                            <AnalysisEditor

                                onOpenChat={() => setIsChatOpen(true)}
                            />
                        </section>
                        {/* Session Card (right in the right area) */}
                        <section aria-labelledby="session-heading" className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 id="session-heading" className="text-lg font-semibold">
                                        {selectedSession?.title}
                                    </h2>
                                    <p className="text-sm text-slate-600">{selectedSession?.context}</p>
                                </div>
                                <div className="text-sm text-slate-500">Error</div>
                            </div>
                            <div className="mt-4">
                                <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-800">
                                    {selectedSession?.errorMessage}
                                </div>
                            </div>
                            <pre className="mt-4 relative bg-slate-900 text-slate-100 rounded-md p-4 text-sm overflow-auto">
                                <code>{selectedSession?.codeSnippet}</code>
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <CopyButton text={selectedSession?.codeSnippet ?? ""} />
                                </div>
                            </pre>
                            <div className="mt-4">
                                <div className="rounded-md bg-violet-50 border border-violet-100 p-3 text-sm text-violet-800">
                                    Language: {selectedSession?.language}
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleAnalyze(selectedSession)}
                                    className="inline-flex items-center px-4 py-2 rounded-md bg-orange-500 text-white hover:brightness-105 disabled:opacity-60"
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? "Analyzing..." : "Analyze"}
                                </button>
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="inline-flex items-center px-4 py-2 border rounded-md text-white bg-gray-500 hover:bg-gray-100 hover:text-gray-900"
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

















