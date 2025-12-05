export type DialogueItem = {
    name: string;
    text: string;
};

export type AvatarData = {
    name: string;
    url: string;
    position: 'left' | 'right';
};

export type ParsedDialogueData = {
    emojis: Map<string, string>;
    avatars: Map<string, AvatarData>;
    dialogues: DialogueItem[];
};

export default class DialogueParser {
    static parse(data: any): ParsedDialogueData {
        const result: ParsedDialogueData = {
            emojis: new Map(),
            avatars: new Map(),
            dialogues: []
        };

        if (!data) return result;

        this.parseEmojis(data, result.emojis);
        this.parseAvatars(data, result.avatars);
        this.parseDialogues(data, result.dialogues);

        return result;
    }

    private static parseEmojis(data: any, emojis: Map<string, string>): void {
        const emojiList = data.emojies || data.magicwords;
        if (!Array.isArray(emojiList)) return;

        emojiList.forEach((item: any) => {
            const key = item.name || item.key;
            const url = item.url;
            if (key && url) emojis.set(key, url);
        });
    }

    private static parseAvatars(data: any, avatars: Map<string, AvatarData>): void {
        if (!Array.isArray(data.avatars)) return;

        data.avatars.forEach((item: any) => {
            if (item.name && item.url) {
                avatars.set(item.name, {
                    name: item.name,
                    url: item.url,
                    position: item.position || 'left'
                });
            }
        });
    }

    private static parseDialogues(data: any, dialogues: DialogueItem[]): void {
        if (!Array.isArray(data.dialogue)) return;

        data.dialogue.forEach((item: any) => {
            if (typeof item === 'object' && item.text) {
                dialogues.push({ name: item.name || 'Unknown', text: item.text });
            } else if (typeof item === 'string') {
                dialogues.push({ name: 'Unknown', text: item });
            }
        });
    }
}
