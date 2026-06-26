export type SavedConversation = {
    id: string;
    title: string;
    messages: { role: "user" | "assistant"; content: string }[];
    personaName?: string;
    personaEmoji?: string;
    modelName?: string;
    savedAt: string;
};

const STORAGE_KEY = "tm-chat-history";

export function getConversations(): SavedConversation[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored) as SavedConversation[];
    } catch {
        return [];
    }
}

export function saveConversation(data: Omit<SavedConversation, "id" | "savedAt"> & { id?: string }): SavedConversation {
    const existing = getConversations();

    if (data.id) {
        // Update existing conversation
        const index = existing.findIndex(c => c.id === data.id);
        if (index !== -1) {
            existing[index] = {
                ...existing[index],
                ...data,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
            return existing[index];
        }
    }

    // Create new conversation
    const conv: SavedConversation = {
        ...data,
        id: `conv-${Date.now()}`,
        savedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([conv, ...existing]));
    return conv;
}

export function deleteConversation(id: string): void {
    const existing = getConversations().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function clearAllConversations(): void {
    localStorage.removeItem(STORAGE_KEY);
}
