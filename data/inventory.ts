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
            text: "Welcome to the twin3 community!\n\ntwin3 transforms your social influence into a verifiable digital identity.\nAI analyzes your content style and engagement to unlock exclusive brand collaborations.\n\nClick the suggestions below or ask me anything about twin3!",
            delay: 800,
            card: {
                type: 'feature_grid',
                features: [
                    {
                        icon: 'target',
                        title: 'Discover Your Value',
                        description: 'AI analyzes your unique influence and generates your Twin Matrix Score (0-255)'
                    },
                    {
                        icon: 'handshake',
                        title: 'Match Brand Tasks',
                        description: 'Higher scores unlock premium brand collaborations with better rewards'
                    },
                    {
                        icon: 'stars',
                        title: 'Build Digital Assets',
                        description: 'Transform your influence into portable proof of authenticity for the AI era'
                    }
                ]
            }
        },
        suggestedActions: [
            { label: 'Get Started', payload: 'verify_human' },
            { label: 'How It Works', payload: 'how_it_works' },
            { label: 'View Sample Tasks', payload: 'browse_tasks' }
        ]
    },

    // ============================================================
    // 1.2 HOW IT WORKS - PLATFORM EXPLAINER
    // ============================================================
    {
        id: 'how_it_works',
        triggers: ['how', 'how it works', 'explain', 'what is'],
        response: {
            text: "**How twin3 Works**\n\n**1. Connect** — Link your social accounts to verify your identity\n\n**2. Analyze** — AI generates your Twin Matrix Score (0-255) based on your content and engagement\n\n**3. Match** — Get matched with brand tasks tailored to your style and influence level\n\n**4. Earn** — Complete tasks to earn tokens and build your digital reputation\n\nReady to discover your value?",
            delay: 600
        },
        suggestedActions: [
            { label: 'Get Started', payload: 'verify_human' },
            { label: 'View Sample Tasks', payload: 'browse_tasks' }
        ]
    },

    // ============================================================
    // 1.5 TWIN MATRIX - 256D VISUALIZATION
    // ============================================================
    {
        id: 'twin_matrix',
        triggers: ['matrix', 'twin matrix', '256d', 'profile'],
        response: {
            text: "Here's your Twin Matrix — a 256-dimensional representation of your authentic self across 6 core dimensions. This forms the foundation of your soulbound identity in the AI era.",
            delay: 600,
            widget: 'twin_matrix'
        },
        suggestedActions: [
            { label: 'Mint SBT', payload: 'mint_sbt' },
            { label: 'Verify Account', payload: 'verify_human' },
            { label: 'Browse Tasks', payload: 'browse_tasks' }
        ]
    },

    // ============================================================
    // 1.6 VERIFICATION FLOW (User initiated)
    // ============================================================
    {
        id: 'verify_human',
        triggers: ['verify', 'verification', 'prove', 'human'],
        response: {
            text: "**Connect Your Instagram**\nVerify your account to unlock personalized tasks and discover your influence value.",
            delay: 500,
            widget: 'instagram_connect'
        },
        suggestedActions: []
    },

    // ============================================================
    // 1.7 VERIFICATION REQUIRED (Task acceptance gate)
    // ============================================================
    {
        id: 'verification_required',
        triggers: [],
        response: {
            text: "**📍 Recommended for You**\n\nComplete **Proof of Humanity** first to boost your score and unlock premium tasks!\n\nConnect your Instagram to verify your identity:",
            delay: 600,
            widget: 'instagram_connect',
            suggestions: []
        },
        suggestedActions: []
    },

    // ============================================================
    // 1.8 VERIFICATION SUCCESS
    // ============================================================
    {
        id: 'verification_success',
        triggers: ['verified', 'success'],
        response: {
            text: "✅ **Verification Complete!**\n\nYour Instagram is now linked. Let's see your Twin Matrix Score!",
            delay: 500,
            widget: 'twin_matrix'
        },
        suggestedActions: [
            { label: 'Browse Tasks', payload: 'browse_tasks' },
            { label: 'View Dashboard', payload: 'dashboard' }
        ]
    },

    // ============================================================
    // 2. TASK OPPORTUNITY
    // ============================================================
    {
        id: 'browse_tasks',
        triggers: ['task', 'browse', 'jobs'],
        response: {
            text: "**📍 Recommended for You**\n\nComplete **Proof of Humanity** first to boost your score and unlock premium tasks!\n\nHere are the current brand task opportunities:",
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
            text: "Great! You have successfully accepted this task!\n\nUse the dashboard below to track your progress and submit your work.",
            delay: 800,
            widget: 'active_task'
        },
        suggestedActions: [
            { label: 'View More Tasks', payload: 'browse_tasks' }
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
            { label: 'View Other Tasks', payload: 'browse_tasks' }
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
            widget: 'global_dashboard'
        },
        suggestedActions: [
            { label: 'Browse More Tasks', payload: 'browse_tasks' }
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
            { label: 'Dashboard', payload: 'dashboard' }
        ]
    }
];
