import { useState } from "react";
import { useSessionStore } from "../store/session.store";
// import { ModelOperations } from '@vscode/vscode-languagedetection'


export function NewSessionModal({ onClose }: { onClose: () => void }) {
    const { createSession } = useSessionStore();
    const [title, setTitle] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [codeSnippet, setCodeSnippet] = useState("");
    const [context, setContext] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    // const [language, setLanguage] = useState<string | null>(null);
    // const [detecting, setDetecting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});





    function validate() {
        const e: Record<string, string> = {};
        if (!title.trim()) e.title = "Title is required";
        if (!errorMessage.trim()) e.errorMessage = "Error message is required";
        if (!codeSnippet.trim()) e.codeSnippet = "Code snippet is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }
    async function handleSave() {
        if (!validate()) return;
        try {
            setIsSaving(true);
            await createSession({
                title: title.trim(),
                errorMessage: errorMessage.trim(),
                codeSnippet: codeSnippet,
                context: context.trim() || undefined,
            })
            setIsSaving(false);
            setTimeout(() => { onClose() }, 500)

        } catch (error) {
            console.error('Error creating session:', error);
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">

            {/* Background */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={!isSaving ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-t-lg lg:rounded-lg shadow-lg overflow-auto">

                {/* 🔒 Saving Overlay */}
                {isSaving && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                        <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full mb-2" />
                        <p className="text-sm text-slate-600">Saving session...</p>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="text-lg font-semibold">New Session</div>
                        <div className="text-sm text-slate-500">Add a new debug session</div>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-3 py-1 rounded-md text-sm bg-slate-100 hover:bg-slate-200 disabled:opacity-60"
                    >
                        Close
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSaving}
                            className="mt-1 block w-full border rounded-md p-2 disabled:bg-slate-100"
                            placeholder="Session title"
                        />
                        {errors.title && <div className="text-xs text-red-600 mt-1">{errors.title}</div>}
                    </div>

                    {/* Error Message */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Error Message</label>
                        <input
                            value={errorMessage}
                            onChange={(e) => setErrorMessage(e.target.value)}
                            disabled={isSaving}
                            className="mt-1 block w-full border rounded-md p-2 disabled:bg-slate-100"
                            placeholder="Error message"
                        />
                        {errors.errorMessage && <div className="text-xs text-red-600 mt-1">{errors.errorMessage}</div>}
                    </div>

                    {/* Code Snippet */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Code Snippet</label>
                        <textarea
                            value={codeSnippet}
                            onChange={(e) => setCodeSnippet(e.target.value)}
                            disabled={isSaving}
                            className="mt-1 block w-full border rounded-md p-2 min-h-[120px] font-mono text-sm disabled:bg-slate-100"
                            placeholder="Paste code snippet..."
                        />
                        {errors.codeSnippet && <div className="text-xs text-red-600 mt-1">{errors.codeSnippet}</div>}
                    </div>

                    {/* Context */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Context (optional)</label>
                        <input
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            disabled={isSaving}
                            className="mt-1 block w-full border rounded-md p-2 disabled:bg-slate-100"
                            placeholder="Where/when this occurs"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            disabled={isSaving}
                            className="px-4 py-2 border rounded-md text-white bg-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 rounded-md bg-orange-500 text-white hover:brightness-105 disabled:opacity-60 flex items-center gap-2"
                        >
                            {isSaving && (
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            )}
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

