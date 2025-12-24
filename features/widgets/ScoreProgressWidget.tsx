import React from 'react';
import { TrendingUp, ChevronRight, CheckCircle, Lock, Zap } from 'lucide-react';

/**
 * Verification Tasks Data
 * These are twin3's own tasks to build your Twin Matrix Score
 */
export interface VerificationTask {
    id: string;
    number: string;
    title: string;
    description: string;
    scoreReward: number;
    status: 'available' | 'completed' | 'coming_soon' | 'locked';
    icon: 'humanity' | 'network' | 'web3';
}

export const VERIFICATION_TASKS: VerificationTask[] = [
    {
        id: 'proof_of_humanity',
        number: '#001',
        title: 'Proof of Humanity',
        description: 'Connect your social accounts to verify your authentic identity',
        scoreReward: 20,
        status: 'available',
        icon: 'humanity'
    },
    {
        id: 'human_trust_network',
        number: '#002',
        title: 'Human Trust Network',
        description: 'Join a verified network of authentic humans on blockchain',
        scoreReward: 25,
        status: 'coming_soon',
        icon: 'network'
    },
    {
        id: 'web3_expertise',
        number: '#003',
        title: 'Web3 Expertise',
        description: 'Validate your Web3 experience through 100 challenges',
        scoreReward: 30,
        status: 'coming_soon',
        icon: 'web3'
    }
];

interface ScoreProgressWidgetProps {
    currentScore: number;
    maxScore: number;
    onTaskClick?: (taskId: string) => void;
}

export const ScoreProgressWidget: React.FC<ScoreProgressWidgetProps> = ({
    currentScore,
    maxScore,
    onTaskClick
}) => {
    const nextTask = VERIFICATION_TASKS.find(t => t.status === 'available');
    const completedTasks = VERIFICATION_TASKS.filter(t => t.status === 'completed').length;
    const progressPercent = (currentScore / maxScore) * 100;

    return (
        <div className="card" style={{
            padding: '20px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TrendingUp size={20} color="var(--color-text-primary)" />
                </div>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                        Twin Matrix Score
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        {completedTasks}/{VERIFICATION_TASKS.length} tasks completed
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
            }}>
                <div style={{
                    flex: 1,
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: 'var(--color-text-primary)',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease'
                    }} />
                </div>
                <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    minWidth: '60px',
                    textAlign: 'right'
                }}>
                    {currentScore}/{maxScore}
                </div>
            </div>

            {/* Next Task */}
            {nextTask && (
                <div
                    onClick={() => onTaskClick?.(nextTask.id)}
                    className="card-hover"
                    style={{
                        padding: '14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'rgba(48, 209, 88, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Zap size={16} color="#30D158" />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                    {nextTask.title}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--color-success)' }}>
                                    +{nextTask.scoreReward} Score
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={18} color="var(--color-text-secondary)" />
                    </div>
                </div>
            )}

            {/* Task List Preview */}
            <div style={{
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                {VERIFICATION_TASKS.map((task) => (
                    <div
                        key={task.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 0',
                            opacity: task.status === 'coming_soon' ? 0.5 : 1
                        }}
                    >
                        {task.status === 'completed' ? (
                            <CheckCircle size={16} color="#30D158" />
                        ) : task.status === 'coming_soon' ? (
                            <Lock size={16} color="var(--color-text-dim)" />
                        ) : (
                            <div style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                border: '2px solid var(--color-text-secondary)'
                            }} />
                        )}
                        <span style={{
                            fontSize: '13px',
                            color: task.status === 'completed'
                                ? 'var(--color-success)'
                                : 'var(--color-text-secondary)'
                        }}>
                            {task.number} {task.title}
                        </span>
                        {task.status === 'coming_soon' && (
                            <span style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px',
                                color: 'var(--color-text-dim)'
                            }}>
                                Soon
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
