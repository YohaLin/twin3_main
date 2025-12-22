// Interaction Inventory - The "Script" for Twin3

import type { InteractionInventory } from '../types/a2ui';

export const INTERACTION_INVENTORY: InteractionInventory = [
    // ============================================================
    // 1. WELCOME FLOW - HERO + FEATURE CARDS
    // ============================================================
    {
        id: 'welcome',
        triggers: ['start', 'hi', 'hello', 'menu'],
        response: {
            text: "Welcome to the twin3 community!\n\ntwin3 is a project shaping secure digital identities in the AI era with its Proof of Authenticity, powered by a 256D Twin Matrix & SBTs.\n\nClick the suggestions below or ask me anything about twin3!",
            delay: 800,
            card: {
                type: 'feature_grid',
                features: [
                    {
                        title: 'Soulbound Twin',
                        description: 'Convert your traits across physical, digital, social and spiritual realms into the Twin Matrix — a 256-dimensional soulbound representation of your authentic self.'
                    },
                    {
                        title: 'Soul Injection',
                        description: 'Inject selected traits into your personal agents. Each agent inherits specific abilities, becoming your digital representatives in the AI economy.'
                    },
                    {
                        title: 'Agentic Human',
                        description: 'Your agents work as human-in-the-loop partners in AI systems, automatically finding and completing tasks in agent marketplaces to earn continuous value.'
                    },
                    {
                        title: 'Whitepaper',
                        description: 'Learn more about twin3 vision and technology.',
                        link: 'https://twin3.ai/whitepaper'
                    }
                ]
            }
        },
        suggestedActions: [
            { label: 'View Twin Matrix', payload: 'twin_matrix' },
            { label: 'Complete Verification', payload: 'verify_human' },
            { label: 'Browse Tasks', payload: 'browse_tasks' }
        ]
    },

    // ============================================================
    // 2. TASK OPPORTUNITY
    // ============================================================
    {
        id: 'browse_tasks',
        triggers: ['task', 'browse', 'jobs'],
        response: {
            text: "Here are the current task opportunities",
            delay: 500,
            card: {
                type: 'task_opportunity',
                taskPayload: {
                    brand: {
                        name: "L'Oreal Paris",
                        logoUrl: 'https://placehold.co/40x40/FF0000/FFF?text=L'
                    },
                    title: 'Lipstick Filter Challenge',
                    description: 'Create 15-60s Reels using specific filter showcasing #666 shade. Mention moisturizing and color payoff.',
                    imageUrl: 'https://placehold.co/600x300/e6a6be/FFF?text=Lipstick+Campaign',
                    reward: {
                        tokens: '500 $twin3',
                        gift: 'Full PR Package (Worth $3000)'
                    },
                    status: 'open',
                    spotsLeft: 3
                },
                actions: [
                    { label: 'View Details', actionId: 'view_task_detail', variant: 'primary' },
                    { label: 'Decline', actionId: 'decline_task', variant: 'secondary' }
                ]
            }
        },
        suggestedActions: [
            { label: 'View Twin Matrix', payload: 'twin_matrix' },
            { label: 'Complete Verification', payload: 'verify_human' },
            { label: 'Browse Tasks', payload: 'browse_tasks' }
        ]
    },

    // ============================================================
    // 3. TASK DETAIL
    // ============================================================
    {
        id: 'view_task_detail',
        triggers: ['detail', 'details', 'view'],
        response: {
            text: "Here is the full task description:",
            delay: 500,
            card: {
                type: 'task_detail',
                title: "L'Oreal Paris — Lipstick Filter Challenge",
                description: `
**Requirements**
• Create 15-60s Reels or TikTok
• Use designated filter
• Showcase shade #666 Rouge Signature

**Rewards**
• 500 $twin3 
• Full PR Package (Worth $3000)

**Deadline**: 2025/01/15`,
                imageUrl: 'https://placehold.co/600x400/e6a6be/FFF?text=Product+Detail',
                actions: [
                    { label: 'Accept Task', actionId: 'accept_task', variant: 'primary' },
                    { label: 'Decline', actionId: 'decline_task', variant: 'secondary' }
                ]
            }
        },
        suggestedActions: [
            { label: 'View Twin Matrix', payload: 'twin_matrix' },
            { label: 'Complete Verification', payload: 'verify_human' },
            { label: 'Browse Tasks', payload: 'browse_tasks' }
        ]
    },

    // ============================================================
    // 4. ACCEPT TASK CONFIRMATION
    // ============================================================
    {
        id: 'accept_task',
        triggers: ['accept', 'confirm'],
        response: {
            text: "Great! You have successfully accepted this task!\n\nThe brand will contact you within 24 hours to confirm collaboration details.\n\nRewards will be automatically distributed to your wallet after task completion.",
            delay: 800,
            card: {
                type: 'confirmation',
                title: 'Task Accepted',
                description: 'Please watch for brand contact notifications. Happy collaboration!',
                actions: [
                    { label: 'View More Tasks', actionId: 'browse_tasks', variant: 'primary' }
                ]
            }
        },
        suggestedActions: [
            { label: 'View More Tasks', payload: 'browse_tasks' },
            { label: 'Back to Home', payload: 'menu' }
        ]
    },

    // ============================================================
    // 5. DECLINE TASK
    // ============================================================
    {
        id: 'decline_task',
        triggers: ['decline', 'skip', 'no'],
        response: {
            text: "No problem! This task has been skipped.\n\nThere are other tasks available. Would you like to see them?",
            delay: 500
        },
        suggestedActions: [
            { label: 'View Other Tasks', payload: 'browse_tasks' },
            { label: 'Back to Home', payload: 'menu' }
        ]
    },

    // ============================================================
    // 6. DASHBOARD
    // ============================================================
    {
        id: 'dashboard',
        triggers: ['dashboard', 'my tasks', 'status'],
        response: {
            text: "Here is your task dashboard:",
            delay: 500,
            card: {
                type: 'generic',
                title: 'My Dashboard',
                description: `**In Progress** (1)\n• L'Oreal Lipstick Campaign — Awaiting Submission\n\n**Pending Review** (0)\n\n**Completed** (2)\n• Coffee Shop Collaboration — Claimed 300 $twin3\n• Beauty Unboxing — Claimed 500 $twin3`,
                actions: [
                    { label: 'Refresh', actionId: 'dashboard', variant: 'secondary' }
                ]
            }
        },
        suggestedActions: [
            { label: 'Browse More Tasks', payload: 'browse_tasks' },
            { label: 'Back to Home', payload: 'menu' }
        ]
    },

    // ============================================================
    // FALLBACK
    // ============================================================
    {
        id: 'fallback',
        triggers: [],
        response: {
            text: "Sorry, I don't quite understand.\n\nPlease try the options below:",
            delay: 300
        },
        suggestedActions: [
            { label: 'View Tasks', payload: 'browse_tasks' },
            { label: 'Dashboard', payload: 'dashboard' },
            { label: 'Back to Home', payload: 'menu' }
        ]
    }
];
