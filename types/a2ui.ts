// A2UI Protocol Types (Following InstaAgent Pattern)

import type { CardData } from '../types';

// Widget Type — Controls dynamic UI rendering
export const WidgetType = {
    NONE: 'none',
    TASK_CARD: 'task_card',
    TASK_DETAIL: 'task_detail',
    WALLET_CONNECT: 'wallet_connect',
    TWIN_MATRIX: 'twin_matrix',
    VERIFICATION: 'verification',
    FEATURE_GRID: 'feature_grid',
    INSTAGRAM_CONNECT: 'instagram_connect',
    ACTIVE_TASK: 'active_task',
    GLOBAL_DASHBOARD: 'global_dashboard',
} as const;

export type WidgetType = typeof WidgetType[keyof typeof WidgetType];

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
    description?: string;
    triggers: string[];
    response: {
        text: string;
        delay?: number;
        card?: CardData;
        widget?: WidgetType;  // Optional widget to render
        suggestions?: import('../types').Suggestion[];
    };
    suggestedActions?: Suggestion[];
}

export type InteractionInventory = InteractionNode[];
