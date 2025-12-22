import { X, Coins, Gift, Clock, CheckCircle } from 'lucide-react';
import type { TaskOpportunityPayload } from '../../types';

interface TaskDetailModalProps {
    task: TaskOpportunityPayload;
    onClose: () => void;
    onAccept: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onAccept }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
        }} className="animate-fade-in" onClick={onClose}>
            <div
                className="card animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '80vh',
                    overflow: 'auto',
                    padding: 0,
                    position: 'relative'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid var(--glass-border)',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                                src={task.brand.logoUrl}
                                alt={task.brand.name}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--glass-border)'
                                }}
                            />
                            <div>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: 500,
                                    color: 'var(--color-text-primary)',
                                    marginBottom: '4px'
                                }}>
                                    {task.brand.name}
                                </h3>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                    {task.title}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text-dim)',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: 'var(--radius-md)',
                                transition: 'all 0.2s'
                            }}
                            className="glass-hover"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Image */}
                {task.imageUrl && (
                    <img
                        src={task.imageUrl}
                        alt={task.title}
                        style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                    />
                )}

                {/* Content */}
                <div style={{ padding: '24px' }}>
                    <h4 style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        marginBottom: '12px'
                    }}>
                        Task Description
                    </h4>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--color-text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '24px'
                    }}>
                        {task.description}
                    </p>

                    <h4 style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        marginBottom: '12px'
                    }}>
                        Rewards
                    </h4>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Coins size={18} color="var(--color-text-primary)" />
                            <span style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                                {task.reward.tokens}
                            </span>
                        </div>
                        {task.reward.gift && (
                            <div style={{
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Gift size={18} color="var(--color-text-secondary)" />
                                <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                                    {task.reward.gift}
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={{
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Clock size={16} color="var(--color-text-dim)" />
                        <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>
                            Spots Remaining: <strong style={{ color: 'var(--color-text-primary)' }}>{task.spotsLeft}</strong>
                        </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={onAccept}
                            className="btn btn-primary"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <CheckCircle size={18} />
                            Accept Task
                        </button>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
