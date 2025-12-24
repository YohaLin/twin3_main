import React, { useState } from 'react';
import { Target, ChevronRight, Lock, Plus } from 'lucide-react';

interface GlobalDashboardWidgetProps {
    onViewTask?: (taskId: string) => void;
}

type TabType = 'active' | 'review' | 'history';

interface Twin3Task {
    id: string;
    type: 'brand' | 'verification';
    title: string;
    brand: string;
    deadline?: string;
    reward: number; // Token amount
    progress: { current: number; total: number }; // Requirements met
    icon?: React.ElementType;
    iconColor?: string;
    imageUrl?: string;
    status: TabType;
}

export const GlobalDashboardWidget: React.FC<GlobalDashboardWidgetProps> = ({
    onViewTask
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [hoveredTooltip, setHoveredTooltip] = useState<{ id: string, type: 'title' | 'brand' } | null>(null);

    // Twin3 Specific Mock Data
    const tasks: Twin3Task[] = [
        // Active Tasks
        {
            id: 'share_on_x',
            type: 'brand',
            title: "Share your Twin Matrix",
            brand: "X (Twitter)",
            deadline: "24h left",
            reward: 200,
            progress: { current: 1, total: 2 },
            imageUrl: "/brands/x-black.png", // Using Black logo on White Box
            iconColor: "#000000",
            status: 'active'
        },
        {
            id: 'proof_of_humanity',
            type: 'verification',
            title: "Proof of Humanity",
            brand: "twin3 protocol",
            reward: 100,
            progress: { current: 1, total: 3 },
            imageUrl: "/brands/twin3-black-circle.png", // New uploaded logo
            iconColor: "#3B82F6", // Blue
            status: 'active'
        },
        // In Review
        {
            id: 'connect_linkedin',
            type: 'verification',
            title: "Connect Professional Identity",
            brand: "LinkedIn",
            deadline: "1h ago",
            reward: 500,
            progress: { current: 1, total: 1 },
            imageUrl: "/brands/linkedin-black.png", // Using Black logo on White Box
            iconColor: "#0077B5", // LinkedIn Blue
            status: 'review'
        },
        // History
        {
            id: 'loreal_campaign',
            type: 'brand',
            title: "Lipstick Challenge",
            brand: "L'Oréal Paris",
            deadline: "Dec 15",
            reward: 500,
            progress: { current: 4, total: 4 },
            imageUrl: "/brands/loreal.png",
            iconColor: "#E1306C",
            status: 'history'
        }
    ];

    const filteredTasks = tasks.filter(t => t.status === activeTab);

    // Calculate Stats
    const totalPending = tasks.filter(t => t.status !== 'history').reduce((sum, t) => sum + t.reward, 0);
    const activeCount = tasks.filter(t => t.status === 'active').length;

    const formatTabLabel = (tab: TabType) => {
        switch (tab) {
            case 'active': return 'Active';
            case 'review': return 'Review';
            case 'history': return 'History';
        }
    };

    return (
        <div className="card animate-fade-in" style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '420px', // Restrict max width nicely
            margin: '0 auto'  // Center if in larger container
        }}>
            {/* 1. Stats Pulse Row */}
            <div style={{
                padding: '24px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                        Active Quests
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1 }}>
                        {activeCount}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                        Pending Rewards
                    </div>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'flex-end',
                        lineHeight: 1
                    }}>
                        <Lock size={24} color="var(--color-text-tertiary)" strokeWidth={2.5} />
                        {totalPending}
                    </div>
                </div>
            </div>

            {/* 2. Tabs */}
            <div style={{
                padding: '0 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                gap: '24px'
            }}>
                {(['active', 'review', 'history'] as TabType[]).map(tab => {
                    const count = tasks.filter(t => t.status === tab).length;
                    const isActive = activeTab === tab;

                    return (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '16px 0',
                                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                fontSize: '14px',
                                fontWeight: isActive ? 600 : 400,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {formatTabLabel(tab)}
                            {count > 0 && tab !== 'history' && (
                                <span style={{
                                    background: isActive ? 'var(--color-text-primary)' : 'rgba(255, 255, 255, 0.1)',
                                    color: isActive ? 'var(--color-bg-base)' : 'var(--color-text-secondary)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: 700
                                }}>
                                    {count}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 3. Task List */}
            <div
                className="scrollbar-hide"
                style={{
                    padding: '24px',
                    height: '380px', // Fixed height to prevent jumping
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}
            >
                {filteredTasks.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                        No tasks in this section
                    </div>
                ) : (
                    filteredTasks.map(task => {
                        const progressPercent = (task.progress.current / task.progress.total) * 100;

                        return (
                            <div
                                key={task.id}
                                onClick={() => onViewTask?.(task.id)}
                                className="card-hover"
                                style={{
                                    padding: '16px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}
                            >
                                {/* Icon Box */}
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    background: 'white', // Keeping white box for consistency
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // border: 'none' // Explicitly removed border/stroke as requested
                                }}>
                                    {task.imageUrl ? (
                                        <img
                                            src={task.imageUrl}
                                            alt={task.brand}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                padding: '8px' // Adjusted padding for these specific logos
                                            }}
                                        />
                                    ) : (
                                        task.icon ? <task.icon size={20} color={task.iconColor || 'white'} /> : <Target size={20} />
                                    )}
                                </div>

                                {/* Middle Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* Task Title with Custom Tooltip */}
                                    <div
                                        style={{ marginBottom: '6px', position: 'relative' }}
                                        onMouseEnter={() => setHoveredTooltip({ id: task.id, type: 'title' })}
                                        onMouseLeave={() => setHoveredTooltip(null)}
                                    >
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: 'var(--color-text-primary)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {task.title}
                                        </div>
                                        {/* Tooltip */}
                                        {hoveredTooltip?.id === task.id && hoveredTooltip?.type === 'title' && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '100%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                marginBottom: '8px',
                                                padding: '6px 12px',
                                                background: 'rgba(17, 24, 39, 0.9)', // gray-900 with opacity
                                                backdropFilter: 'blur(12px)',
                                                color: 'white',
                                                fontSize: '12px',
                                                borderRadius: '8px',
                                                whiteSpace: 'nowrap',
                                                zIndex: 50,
                                                pointerEvents: 'none',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                            }}>
                                                {task.title}
                                                {/* Arrow */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: '50%',
                                                    marginLeft: '-4px',
                                                    borderWidth: '4px',
                                                    borderStyle: 'solid',
                                                    borderColor: 'rgba(17, 24, 39, 0.9) transparent transparent transparent'
                                                }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Metadata Row: Brand & Deadline */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '11px',
                                        color: 'var(--color-text-secondary)',
                                        marginBottom: '8px'
                                    }}>
                                        {/* Brand with Custom Tooltip */}
                                        <div
                                            style={{ maxWidth: '80px', position: 'relative' }}
                                            onMouseEnter={() => setHoveredTooltip({ id: task.id, type: 'brand' })}
                                            onMouseLeave={() => setHoveredTooltip(null)}
                                        >
                                            <span style={{
                                                display: 'block',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {task.brand}
                                            </span>
                                            {/* Tooltip */}
                                            {hoveredTooltip?.id === task.id && hoveredTooltip?.type === 'brand' && (
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '100%',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    marginBottom: '8px',
                                                    padding: '6px 12px',
                                                    background: 'rgba(17, 24, 39, 0.9)',
                                                    backdropFilter: 'blur(12px)',
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    borderRadius: '8px',
                                                    whiteSpace: 'nowrap',
                                                    zIndex: 50,
                                                    pointerEvents: 'none',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                                }}>
                                                    {task.brand}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        left: '50%',
                                                        marginLeft: '-4px',
                                                        borderWidth: '4px',
                                                        borderStyle: 'solid',
                                                        borderColor: 'rgba(17, 24, 39, 0.9) transparent transparent transparent'
                                                    }} />
                                                </div>
                                            )}
                                        </div>

                                        {task.deadline && (
                                            <>
                                                <span>•</span>
                                                <span style={{
                                                    color: task.deadline.includes('left') && parseInt(task.deadline) <= 2 ? 'var(--color-warning)' : 'inherit',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {task.deadline.replace('Submitted ', '')}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Requirements Progress Bar */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            flex: 1,
                                            height: '4px',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '2px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${progressPercent}%`,
                                                height: '100%',
                                                background: task.type === 'verification' ? '#3B82F6' : 'var(--color-primary)',
                                                borderRadius: '2px'
                                            }} />
                                        </div>
                                        <div style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>
                                            {task.progress.current}/{task.progress.total} reqs
                                        </div>
                                    </div>
                                </div>

                                {/* Right Content: Reward */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    gap: '6px'
                                }}>
                                    <div style={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: task.status === 'history' ? 'var(--color-success)' : 'var(--color-text-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '2px'
                                    }}>
                                        {task.status === 'history' ?
                                            <Plus size={12} strokeWidth={3} /> :
                                            <Lock size={12} color="var(--color-text-tertiary)" strokeWidth={2.5} />
                                        }
                                        {task.reward}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>
                                        $twin3
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                textAlign: 'center'
            }}>
                <span style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    View Ranking <ChevronRight size={12} />
                </span>
            </div>
        </div>
    );
};
