// A2UI Protocol Types (Simplified for MVP)

import type { CardData } from '../types';

export interface A2UIComponent {
    id: string;
    component: Record<string, any>;
}

export interface Suggestion {
    label: string;
    payload: string;
}

export interface InteractionNode {
    id: string;
    triggers: string[];
    response: {
        text: string;
        delay?: number;
        card?: CardData;
    };
    suggestedActions?: Suggestion[];
}

export type InteractionInventory = InteractionNode[];
