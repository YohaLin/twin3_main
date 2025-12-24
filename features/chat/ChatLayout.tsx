import { useState, useRef, useEffect } from 'react';
import { Menu, Settings, Send, Sparkles, LayoutDashboard, FileText, CheckSquare, X, Coins, Clock, Users, Terminal, Plus, Target, Handshake } from 'lucide-react';
import type { Message } from '../../types';
import type { Suggestion } from '../../types/a2ui';
import type { TaskOpportunityPayload } from '../../types';
import { MessageBubble } from './MessageBubble';
import { TaskDetailModal } from '../cards/TaskDetailModal';
import { INTERACTION_INVENTORY } from '../../data/inventory';
import { generateAgentResponse, isAIEnabled, generateSuggestions } from '../../services/geminiService';
import { TwinMatrixWidget, DevConsole, devLog, InstagramConnectWidget, ScoreProgressWidget, ActiveTaskWidget, GlobalDashboardWidget } from '../widgets';

export const ChatLayout: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskOpportunityPayload | null>(null);
    const [showDevConsole, setShowDevConsole] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const hasStarted = useRef(false);

    // Quick Actions
    const quickActions = [
        { icon: FileText, label: 'Browse All Tasks', action: 'browse_tasks' },
        { icon: LayoutDashboard, label: 'My Dashboard', action: 'dashboard' },
        { icon: CheckSquare, label: 'Tasks In Progress', action: 'dashboard' },
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, suggestions]);

    useEffect(() => {
        // Auto-open sidebar on desktop
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const findNode = (text: string) => {
        const lowerText = text.toLowerCase();
        const match = INTERACTION_INVENTORY.find(node =>
            node.triggers.some(trigger => lowerText.includes(trigger.toLowerCase()))
        );
        return match || null; // Return null if no match, so we can use AI
    };

    const triggerResponse = async (input: string | null, nodeId: string | null = null, showUserMessage = true) => {
        // Verification gate: intercept browse_tasks if not verified
        // Check both nodeId (direct call) and input (from suggestion click)
        const targetId = nodeId || input;
        if ((targetId === 'browse_tasks' || input === 'browse_tasks') && !isVerified) {
            // Override to verification flow
            nodeId = 'verification_required';
            input = null; // Don't show user message for redirect
            showUserMessage = false;
            devLog('info', 'User not verified - redirecting to verification flow');
        }

        if (input && showUserMessage) {
            const userMsg: Message = {
                id: Date.now().toString(),
                role: 'user',
                type: 'text',
                content: input,
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, userMsg]);
        }

        setIsTyping(true);
        setSuggestions([]);

        let node;
        if (nodeId) {
            node = INTERACTION_INVENTORY.find(n => n.id === nodeId)!;
        } else if (input) {
            node = findNode(input);
        }

        // If we found a matching node, use it
        if (node) {
            const delay = node.response.delay || 500;
            await new Promise(r => setTimeout(r, delay));

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                type: node.response.card ? 'card' : 'text',
                content: node.response.text,
                cardData: node.response.card,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, aiMsg]);
            setSuggestions(node.suggestedActions || []);

            // Handle widget rendering - add as inline chat message
            if (node.response.widget) {
                const widgetMsg: Message = {
                    id: (Date.now() + 2).toString(),
                    role: 'assistant',
                    type: 'widget',
                    content: '',
                    widget: node.response.widget,
                    timestamp: Date.now(),
                };
                setMessages(prev => [...prev, widgetMsg]);
                devLog('info', `Rendering inline widget: ${node.response.widget}`);
            }
            devLog('success', `Matched node: ${node.id}`);
        } else if (input && isAIEnabled()) {
            // Use Gemini AI for unmatched queries
            devLog('api', 'Calling Gemini AI...');
            const history = messages.map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            }));

            const response = await generateAgentResponse(input, history);
            devLog('success', `AI Response: ${response.text.substring(0, 50)}...`);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                type: 'text',
                content: response.text,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, aiMsg]);

            // Generate AI-powered suggestions based on context
            const aiSuggestions = await generateSuggestions(
                response.text,
                `User asked: ${input}`
            );
            setSuggestions(aiSuggestions.map(label => ({
                label,
                payload: label.toLowerCase().replace(/\s+/g, '_')
            })));
        } else {
            // Fallback when no AI available
            devLog('info', `No match found, using fallback. AI enabled: ${isAIEnabled()}`);
            const fallbackNode = INTERACTION_INVENTORY.find(n => n.id === 'fallback')!;
            await new Promise(r => setTimeout(r, 300));

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                type: 'text',
                content: fallbackNode.response.text,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, aiMsg]);
            setSuggestions(fallbackNode.suggestedActions || []);
        }

        setIsTyping(false);

        // Close sidebar on mobile/tablet after action
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const handleAction = (actionId: string) => {
        triggerResponse(null, actionId, false);
    };

    const handleSubmit = () => {
        if (!inputValue.trim() || isTyping) return;
        triggerResponse(inputValue.trim());
        setInputValue('');
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleTaskCardClick = (task: TaskOpportunityPayload) => {
        setSelectedTask(task);
    };

    const handleAcceptTask = () => {
        if (!isVerified) {
            // Store pending task and redirect to verification
            if (selectedTask) {
                // setPendingTaskId(selectedTask.title); // Removed legacy logic
            }
            setSelectedTask(null);
            triggerResponse(null, 'verification_required', false);
            return;
        }
        // User is verified, proceed with task acceptance
        setSelectedTask(null);
        triggerResponse(null, 'accept_task', false);
    };

    useEffect(() => {
        if (!hasStarted.current) {
            hasStarted.current = true;
            triggerResponse(null, 'welcome', false);
        }
    }, []);

    // Task card data for browse_tasks
    const taskCardsData = [
        {
            brand: { name: "L'Oréal Paris", logoUrl: 'https://placehold.co/40x40/FF0000/FFF?text=L' },
            title: 'Lipstick Filter Challenge',
            description: 'Create 15-60s Reels using specific filter showcasing #666 shade. Mention moisturizing and color payoff.',
            imageUrl: 'https://placehold.co/600x300/e6a6be/FFF?text=Lipstick+Campaign',
            reward: { tokens: '500 $twin3', gift: 'Full PR Package (Worth $3000)' },
            status: 'open' as const,
            spotsLeft: 3,
            deadline: '2025-01-15',
            acceptedCount: 0,
            totalSpots: 3
        },
        {
            brand: { name: 'Starbucks', logoUrl: 'https://placehold.co/40x40/00704A/FFF?text=S' },
            title: 'Coffee Shop Vlog',
            description: 'Capture store atmosphere and drink close-ups, share coffee tasting experience',
            imageUrl: 'https://placehold.co/600x300/00704A/FFF?text=Coffee+Vlog',
            reward: { tokens: '300 $twin3', gift: 'Coffee Voucher $500' },
            status: 'open' as const,
            spotsLeft: 3,
            deadline: '2025-01-20',
            acceptedCount: 2,
            totalSpots: 5
        },
        {
            brand: { name: 'Dior', logoUrl: 'https://placehold.co/40x40/000000/FFF?text=D' },
            title: 'Beauty Unboxing Review',
            description: 'Try new products and create unboxing video, share usage experience',
            imageUrl: 'https://placehold.co/600x300/000000/FFF?text=Beauty+Review',
            reward: { tokens: '800 $twin3', gift: 'Makeup Gift Box (Worth $5000)' },
            status: 'open' as const,
            spotsLeft: 1,
            deadline: '2025-01-10',
            acceptedCount: 1,
            totalSpots: 2
        }
    ];

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            position: 'relative',
            zIndex: 2
        }}>
            {/* Backdrop overlay for mobile/tablet */}
            {sidebarOpen && window.innerWidth < 1024 && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 998
                    }}
                />
            )}

            {/* Left Sidebar */}
            <aside
                className="glass"
                style={{
                    width: sidebarOpen ? '280px' : '0',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    overflow: sidebarOpen ? 'visible' : 'hidden',
                    borderRight: sidebarOpen ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                    position: window.innerWidth < 1024 ? 'fixed' : 'relative',
                    left: 0,
                    top: 0,
                    height: '100vh',
                    zIndex: 999,
                    transform: window.innerWidth < 1024 && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
                }}
            >
                {sidebarOpen && (
                    <>
                        {/* Header with close button on mobile/tablet */}
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img
                                    src="/twin3_logo.svg"
                                    alt="twin3"
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                />
                                <h1 className="text-gradient" style={{ fontSize: '18px', fontWeight: 500 }}>twin3.ai</h1>
                            </div>

                            {/* Close button (mobile/tablet only) */}
                            {window.innerWidth < 1024 && (
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="btn-ghost"
                                    style={{
                                        padding: '8px',
                                        minWidth: '32px',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <nav style={{
                            flex: 1,
                            padding: '16px 12px',
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }} className="scrollbar-hide">
                            {/* Score Progress Widget */}
                            <ScoreProgressWidget
                                currentScore={isVerified ? 20 : 0}
                                maxScore={100}
                                onTaskClick={(taskId) => {
                                    if (taskId === 'proof_of_humanity') return;
                                    triggerResponse(null, 'browse_tasks', false);
                                }}
                            />

                            {/* Gas Free Minting Card */}
                            {/* Gas Free Minting Card */}
                            <div className="card" style={{
                                padding: '24px',
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px'
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: '18px',
                                        fontWeight: 500,
                                        color: 'var(--color-text-primary)',
                                        marginBottom: '6px'
                                    }}>
                                        Gas free minting
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: 'var(--color-text-secondary)',
                                        lineHeight: '1.4'
                                    }}>
                                        for early users<br />
                                        <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>limited time only!</span>
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: '56px',
                                    fontWeight: 500,
                                    color: 'var(--color-text-primary)',
                                    letterSpacing: '-3px',
                                    lineHeight: 1
                                }}>
                                    2750
                                </div>

                                <button className="btn btn-primary" style={{
                                    width: '100%',
                                    padding: '14px',
                                    fontSize: '15px',
                                    fontWeight: 500
                                }}>
                                    Free Mint
                                </button>
                            </div>
                        </nav>

                        <div style={{
                            padding: '16px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                        }}>
                            <button
                                className="btn-ghost"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    background: 'transparent',
                                    color: 'var(--color-text-dim)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Settings size={16} />
                                Settings
                            </button>
                        </div>
                    </>
                )}
            </aside>

            {/* Main Area */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                position: 'relative',
            }}>
                {/* Header */}
                <header className="glass" style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '0 16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    flexShrink: 0
                }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Menu size={20} />
                    </button>
                </header>

                {/* Content Area */}
                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '16px'
                }} className="scrollbar-hide">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {messages.map((msg) => {
                            // Special handling for feature_grid - Hero + Feature Cards
                            if (msg.type === 'card' && msg.cardData?.type === 'feature_grid') {
                                const features = msg.cardData.features || [];
                                return (
                                    <div key={msg.id} className="animate-fade-in" style={{ marginBottom: '32px' }}>
                                        {/* Hero Welcome Message */}
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '48px 24px',
                                            marginBottom: '32px'
                                        }}>
                                            <h1 style={{
                                                fontSize: '40px',
                                                fontWeight: 500,
                                                color: 'var(--color-text-primary)',
                                                marginBottom: '16px',
                                                lineHeight: '1.1',
                                                letterSpacing: '-0.02em'
                                            }}>
                                                {msg.content.split('\n')[0]}
                                            </h1>
                                            <p style={{
                                                fontSize: '16px',
                                                color: 'var(--color-text-primary)',
                                                lineHeight: '1.6',
                                                maxWidth: '700px',
                                                margin: '0 auto 8px',
                                                fontWeight: 400
                                            }}>
                                                {msg.content.split('\n')[2]}
                                            </p>
                                            <p style={{
                                                fontSize: '15px',
                                                color: 'var(--color-text-secondary)',
                                                lineHeight: '1.6',
                                                maxWidth: '700px',
                                                margin: '0 auto 8px'
                                            }}>
                                                {msg.content.split('\n')[3]}
                                            </p>
                                            <p style={{
                                                fontSize: '14px',
                                                color: 'var(--color-text-secondary)',
                                                lineHeight: '1.6',
                                                maxWidth: '700px',
                                                margin: '0 auto 24px'
                                            }}>
                                                {msg.content.split('\n')[5]}
                                            </p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => triggerResponse(null, 'verification_required', false)}
                                                style={{
                                                    padding: '14px 32px',
                                                    fontSize: '16px',
                                                    fontWeight: 500,
                                                    boxShadow: 'var(--glow-primary)'
                                                }}
                                            >
                                                Discover My Value
                                            </button>
                                        </div>

                                        {/* Feature Cards Grid */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                                            gap: '16px'
                                        }}>
                                            {features.map((feature: any, i: number) => {
                                                // Map icon names to lucide icons
                                                const IconComponent = feature.icon === 'target' ? Target
                                                    : feature.icon === 'handshake' ? Handshake
                                                        : feature.icon === 'stars' ? Sparkles
                                                            : null;

                                                return (
                                                    <div
                                                        key={i}
                                                        className="card card-hover"
                                                        style={{
                                                            padding: '24px',
                                                            cursor: feature.link ? 'pointer' : 'default'
                                                        }}
                                                        onClick={() => {
                                                            if (feature.link) {
                                                                window.open(feature.link, '_blank');
                                                            }
                                                        }}
                                                    >
                                                        {IconComponent && (
                                                            <div style={{
                                                                marginBottom: '12px',
                                                                color: 'var(--color-primary)',
                                                                opacity: 0.9
                                                            }}>
                                                                <IconComponent size={24} />
                                                            </div>
                                                        )}
                                                        <h3 style={{
                                                            fontSize: '18px',
                                                            fontWeight: 500,
                                                            color: 'var(--color-text-primary)',
                                                            marginBottom: '8px',
                                                            letterSpacing: '-0.01em'
                                                        }}>
                                                            {feature.title}
                                                        </h3>
                                                        <p style={{
                                                            fontSize: '14px',
                                                            color: 'var(--color-text-secondary)',
                                                            lineHeight: '1.7'
                                                        }}>
                                                            {feature.description}
                                                        </p>
                                                        {feature.link && (
                                                            <div style={{
                                                                marginTop: '12px',
                                                                fontSize: '13px',
                                                                color: 'var(--color-primary)',
                                                                fontWeight: 500
                                                            }}>
                                                                Learn more →
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }

                            // Special handling for browse_tasks - show as 3 clickable task cards
                            if (msg.type === 'card' && msg.cardData?.type === 'task_opportunity') {
                                return (
                                    <div key={msg.id} className="animate-fade-in" style={{ marginBottom: '24px' }}>
                                        {/* AI Message */}
                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: 'var(--radius-md)',
                                                background: 'var(--color-accent)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                boxShadow: 'var(--glow-primary)'
                                            }}>
                                                <Sparkles size={16} color="white" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-primary)', marginBottom: '6px' }}>
                                                    twin3
                                                </div>
                                                <MessageBubble
                                                    message={{ ...msg, content: msg.content }}
                                                />
                                            </div>
                                        </div>

                                        {/* Task Cards Grid - Responsive */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                                            gap: '16px',
                                            marginLeft: window.innerWidth >= 768 ? '44px' : '0'
                                        }}>
                                            {taskCardsData.map((task, i) => (
                                                <div
                                                    key={i}
                                                    className="card card-hover"
                                                    style={{
                                                        padding: '24px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '16px'
                                                    }}
                                                >
                                                    <div>
                                                        <h4 style={{
                                                            fontSize: '16px',
                                                            fontWeight: 600,
                                                            color: 'var(--color-text-primary)',
                                                            marginBottom: '6px'
                                                        }}>
                                                            {task.title}
                                                        </h4>
                                                        <p style={{
                                                            fontSize: '13px',
                                                            color: 'var(--color-text-secondary)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}>
                                                            <span style={{
                                                                width: '6px',
                                                                height: '6px',
                                                                borderRadius: '50%',
                                                                background: 'var(--color-primary)'
                                                            }} />
                                                            {task.brand.name}
                                                        </p>
                                                    </div>
                                                    <p style={{
                                                        fontSize: '13px',
                                                        color: 'var(--color-text-secondary)',
                                                        marginBottom: '8px',
                                                        lineHeight: '1.5'
                                                    }}>
                                                        {task.description}
                                                    </p>

                                                    {/* Deadline and Count Info */}
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: '12px',
                                                        marginBottom: '12px',
                                                        fontSize: '12px',
                                                        color: 'var(--color-text-dim)'
                                                    }}>
                                                        {task.deadline && (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <Clock size={14} />
                                                                Due {task.deadline}
                                                            </span>
                                                        )}
                                                        {task.totalSpots && (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <Users size={14} />
                                                                {task.acceptedCount || 0}/{task.totalSpots}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        paddingTop: '12px',
                                                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                                                        gap: '8px',
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        <span style={{
                                                            fontSize: '13px',
                                                            color: 'var(--color-primary)',
                                                            fontWeight: 500,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}>
                                                            <Coins size={16} />
                                                            {task.reward.tokens}
                                                        </span>
                                                        <button
                                                            onClick={() => handleTaskCardClick(task)}
                                                            className="btn btn-primary"
                                                            style={{ padding: '6px 14px', fontSize: '13px' }}
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            // Widget messages - render inline
                            if (msg.type === 'widget') {
                                if (msg.widget === 'twin_matrix') {
                                    return (
                                        <div key={msg.id} className="animate-fade-in" style={{
                                            marginBottom: '24px',
                                            display: 'flex',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <TwinMatrixWidget
                                                username="User"
                                                onMint={() => {
                                                    devLog('success', 'SBT Mint initiated');
                                                    triggerResponse(null, 'mint_sbt', false);
                                                }}
                                            />
                                        </div>
                                    );
                                }
                                if (msg.widget === 'instagram_connect') {
                                    return (
                                        <div key={msg.id} className="animate-fade-in" style={{
                                            marginBottom: '24px',
                                            display: 'flex',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <InstagramConnectWidget
                                                onConnect={(username) => {
                                                    setIsVerified(true);
                                                    devLog('success', `Instagram connected: @${username}`);
                                                    triggerResponse(null, 'verification_success', false);
                                                }}
                                            />
                                        </div>
                                    );
                                }
                                if (msg.widget === 'active_task') {
                                    return (
                                        <div key={msg.id} className="animate-fade-in" style={{
                                            marginBottom: '24px',
                                            display: 'flex',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <ActiveTaskWidget
                                                onVerify={(url) => {
                                                    devLog('success', `Task submitted: ${url}`);
                                                }}
                                            />
                                        </div>
                                    );
                                }
                                if (msg.widget === 'global_dashboard') {
                                    return (
                                        <div key={msg.id} className="animate-fade-in" style={{
                                            marginBottom: '24px',
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            width: '100%',
                                            maxWidth: '400px'
                                        }}>
                                            <GlobalDashboardWidget
                                                onViewTask={(taskId) => {
                                                    devLog('info', `Viewing task: ${taskId}`);
                                                    // Allow clicking dashboard item to open Active Task
                                                    triggerResponse(null, 'accept_task', false); // Demo hack to show task
                                                }}
                                            />
                                        </div>
                                    );
                                }
                                return null;
                            }

                            // Regular messages
                            return <MessageBubble key={msg.id} message={msg} onAction={handleAction} />;
                        })}

                        {isTyping && (
                            <div className="animate-fade-in" style={{
                                display: 'flex',
                                gap: '12px',
                                marginTop: '24px'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--color-accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: 'var(--glow-primary)'
                                }}>
                                    <Sparkles size={16} color="white" />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingTop: '8px' }}>
                                    {[0, 150, 300].map((delay, i) => (
                                        <span key={i} className="animate-bounce" style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: 'var(--color-text-dim)',
                                            animationDelay: `${delay}ms`,
                                            display: 'inline-block'
                                        }} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={scrollRef} />
                    </div>
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && !isTyping && (
                    <div style={{
                        padding: '0 16px 12px',
                        flexShrink: 0
                    }}>
                        <div style={{
                            maxWidth: '900px',
                            margin: '0 auto',
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap'
                        }}>
                            {suggestions.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => triggerResponse(s.payload, null, false)}
                                    className="chip animate-fade-in"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area - Gemini Style */}
                <div style={{
                    padding: '16px',
                    flexShrink: 0
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{
                            background: 'rgba(32, 33, 36, 0.95)',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            overflow: 'hidden'
                        }}>
                            {/* Text Input Row */}
                            <div style={{ padding: '16px 20px 8px' }}>
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        if (inputRef.current) {
                                            inputRef.current.style.height = 'auto';
                                            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
                                        }
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask twin3..."
                                    rows={1}
                                    disabled={isTyping}
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        resize: 'none',
                                        color: 'var(--color-text-primary)',
                                        fontSize: '16px',
                                        lineHeight: '1.5',
                                        maxHeight: '150px',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            {/* Bottom Tools Row */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px 12px 16px'
                            }}>
                                {/* Left: Tools */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <button
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--color-text-dim)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Attach"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {/* Right: Send & Status */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {/* Status Indicator */}
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: isAIEnabled() ? '#30d158' : 'var(--color-text-dim)'
                                    }} title={isAIEnabled() ? 'AI Connected' : 'Demo Mode'} />

                                    {/* Send Button */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!inputValue.trim() || isTyping}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: inputValue.trim() && !isTyping
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'transparent',
                                            border: 'none',
                                            color: inputValue.trim() && !isTyping
                                                ? 'var(--color-text-primary)'
                                                : 'var(--color-text-dim)',
                                            cursor: inputValue.trim() && !isTyping ? 'pointer' : 'default',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


            {/* Right Sidebar - Quick Actions (Desktop only) */}
            <aside className="glass" style={{
                width: '320px',
                flexShrink: 0,
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                display: window.innerWidth >= 1024 ? 'flex' : 'none',
                flexDirection: 'column',
                overflow: 'auto'
            }}>
                <div style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    flexShrink: 0
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                        Quick Actions
                    </h3>
                </div>

                <div style={{ padding: '24px', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {quickActions.map((qa, i) => {
                            const Icon = qa.icon;
                            return (
                                <button
                                    key={i}
                                    onClick={() => triggerResponse(null, qa.action, false)}
                                    className="card card-hover"
                                    style={{
                                        padding: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <Icon size={20} style={{ color: 'var(--color-primary)' }} />
                                    <span style={{
                                        flex: 1,
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        {qa.label}
                                    </span>
                                    <span style={{ color: 'var(--color-text-dim)', fontSize: '14px' }}>→</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onAccept={handleAcceptTask}
                />
            )}

            {/* Widgets are now rendered inline in chat, not as popups */}

            {/* Dev Console Toggle */}
            <button
                onClick={() => setShowDevConsole(!showDevConsole)}
                style={{
                    position: 'fixed',
                    bottom: '16px',
                    left: '16px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: showDevConsole ? 'rgba(48, 209, 88, 0.2)' : 'var(--glass-bg)',
                    border: showDevConsole ? '1px solid rgba(48, 209, 88, 0.3)' : '1px solid var(--glass-border)',
                    color: showDevConsole ? '#30d158' : 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 100
                }}
            >
                <Terminal size={18} />
            </button>

            {/* Dev Console */}
            <DevConsole
                isOpen={showDevConsole}
                onClose={() => setShowDevConsole(false)}
            />
        </div>
    );
};
