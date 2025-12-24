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
            text: "👋 **Welcome to twin3!**\n\nI'm your AI assistant, here to help you discover your influence value and connect with brand opportunities.\n\nLet me show you what twin3 can do for you:",
            delay: 800,
            widget: 'feature_grid'
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
            text: "✨ **Your Twin Matrix**\n\nThis is your unique digital fingerprint — a 256-dimensional representation of your authentic self.\n\n**What it measures:**\n• Content style & creativity\n• Audience engagement\n• Authenticity score\n• Influence reach\n• Brand alignment\n• Community trust\n\nYour Twin Matrix unlocks personalized brand matches:",
            delay: 600,
            widget: 'twin_matrix'
        },
        suggestedActions: [
            { label: 'Browse Tasks', payload: 'browse_tasks' },
            { label: 'View Dashboard', payload: 'dashboard' }
        ]
    },

    // ============================================================
    // 1.6 VERIFICATION FLOW (User initiated)
    // ============================================================
    {
        id: 'verify_human',
        triggers: ['verify', 'verification', 'prove', 'human'],
        response: {
            text: "Great! Let's get you verified.\n\n**Why Verify?**\n✓ Unlock personalized brand tasks\n✓ Discover your influence value\n✓ Access premium rewards\n\nConnect your Instagram below to get started:",
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
            text: "Hold on! 🔒\n\nTo access brand tasks, you'll need to verify your account first.\n\n**Quick Verification** takes less than 30 seconds:\n✓ Connect Instagram\n✓ Get your Twin Matrix Score\n✓ Unlock all tasks\n\nLet's get you verified:",
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
            text: "🎉 **Welcome to twin3!**\n\nYour Instagram has been successfully verified!\n\nNow let me show you your unique Twin Matrix Score — a 256-dimensional identity that represents your authentic digital self.",
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
            text: "🎯 **Brand Tasks For You**\n\nBased on your profile, here are personalized brand collaboration opportunities.\n\nEach task is matched to your influence style and audience. Click any card to see full details:",
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
            text: "📋 **Task Details**\n\nHere's everything you need to know about this collaboration.\n\nReview the requirements carefully before accepting:",
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
            text: "🎉 **Task Accepted!**\n\nAwesome! You're all set to start working on this collaboration.\n\n**Next Steps:**\n1. Review the task requirements\n2. Create your content\n3. Submit for review\n\nTrack your progress below:",
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
            text: "No worries! 👍\n\nThis task isn't the right fit — that's totally fine.\n\nWe have many other brand collaborations available. Want to explore more options?",
            delay: 500
        },
        suggestedActions: [
            { label: 'View Other Tasks', payload: 'browse_tasks' },
            { label: 'View Dashboard', payload: 'dashboard' }
        ]
    },

    // ============================================================
    // 6. DASHBOARD
    // ============================================================
    {
        id: 'dashboard',
        triggers: ['dashboard', 'my tasks', 'status'],
        response: {
            text: "📊 **Your Dashboard**\n\nHere's an overview of all your active tasks, completed work, and earnings.\n\nClick on any task to view details or submit your work:",
            delay: 500,
            widget: 'global_dashboard'
        },
        suggestedActions: [
            { label: 'Browse More Tasks', payload: 'browse_tasks' },
            { label: 'View Twin Matrix', payload: 'twin_matrix' }
        ]
    },

    // ============================================================
    // 7. PROOF OF HUMANITY TASK
    // ============================================================
    {
        id: 'proof_of_humanity',
        triggers: ['proof of humanity', 'humanity'],
        response: {
            text: "🔐 **Proof of Humanity**\n\nThis foundational task establishes your authentic human identity in the twin3 ecosystem.\n\n**Why it matters:**\n• Unlocks premium brand collaborations\n• Boosts your Twin Matrix Score\n• Builds trust with brands\n\n**Requirements:**\n1. ✓ Connect Instagram account\n2. Connect LinkedIn (optional, +bonus)\n3. Complete WorldCoin verification (optional)\n\n**Reward:** 100 $twin3\n\nReady to get verified?",
            delay: 500
        },
        suggestedActions: [
            { label: 'Start Verification', payload: 'verify_human' },
            { label: 'Back to Dashboard', payload: 'dashboard' }
        ]
    },

    // ============================================================
    // 8. SHARE ON X TASK
    // ============================================================
    {
        id: 'share_on_x',
        triggers: ['share on x', 'twitter', 'share matrix'],
        response: {
            text: "🐦 **Share Your Twin Matrix on X**\n\nSpread the word about your unique digital identity and earn rewards!\n\n**What to do:**\n1. Generate your Twin Matrix (if you haven't)\n2. Post the visualization on X\n3. Include hashtag #twin3\n4. Submit your post URL\n\n**Reward:** 200 $twin3\n⏰ **Deadline:** 24 hours remaining\n\nReady to share?",
            delay: 500
        },
        suggestedActions: [
            { label: 'View Twin Matrix', payload: 'twin_matrix' },
            { label: 'Back to Dashboard', payload: 'dashboard' }
        ]
    },

    // ============================================================
    // FALLBACK
    // ============================================================
    {
        id: 'fallback',
        triggers: [],
        response: {
            text: "Hmm, I'm not sure I understand that yet. 🤔\n\nI can help you with:\n• Viewing brand tasks\n• Checking your dashboard\n• Understanding your Twin Matrix\n• Verifying your account\n\nWhat would you like to do?",
            delay: 300
        },
        suggestedActions: [
            { label: 'View Tasks', payload: 'browse_tasks' },
            { label: 'Dashboard', payload: 'dashboard' },
            { label: 'Twin Matrix', payload: 'twin_matrix' }
        ]
    }
];
