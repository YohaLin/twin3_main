import { Gift, Coins, Users, ExternalLink, X } from 'lucide-react';
import type { TaskOpportunityPayload } from '../../types';

interface TaskOpportunityCardProps {
    data: TaskOpportunityPayload;
    onAction?: (actionId: string) => void;
}

export const TaskOpportunityCard: React.FC<TaskOpportunityCardProps> = ({ data, onAction }) => {
    return (
        <div
            className="card card-hover animate-fade-in-scale"
            style={{
                maxWidth: '520px',
                padding: 0,
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Header: Brand Info */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                        <img
                            src={data.brand.logoUrl}
                            alt={data.brand.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <span style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)'
                    }}>
                        {data.brand.name}
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: data.status === 'open'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${data.status === 'open' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    fontSize: '12px',
                    fontWeight: 500,
                    color: data.status === 'open' ? 'var(--color-success)' : '#ef4444'
                }}>
                    <Users size={12} />
                    {data.status === 'open' ? `${data.spotsLeft} spots left` : 'Closed'}
                </div>
            </div>

            {/* Product Image */}
            {data.imageUrl && (
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                        src={data.imageUrl}
                        alt={data.title}
                        style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '80px',
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)'
                    }} />
                </div>
            )}

            {/* Content */}
            <div style={{ padding: '20px' }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    marginBottom: '10px',
                    lineHeight: '1.3'
                }}>
                    {data.title}
                </h3>

                <p style={{
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '16px'
                }}>
                    {data.description}
                </p>

                {/* Reward Tags */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '16px'
                }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(142, 142, 147, 0.15)',
                        border: '1px solid rgba(142, 142, 147, 0.3)',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--color-primary)',
                        boxShadow: '0 0 12px rgba(142, 142, 147, 0.2)'
                    }}>
                        <Coins size={14} />
                        {data.reward.tokens}
                    </span>

                    {data.reward.gift && (
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: 'var(--color-warning)'
                        }}>
                            <Gift size={14} />
                            {data.reward.gift}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: '10px'
                }}>
                    <button
                        onClick={() => onAction?.('view_task_detail')}
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                    >
                        <ExternalLink size={16} />
                        View Details
                    </button>
                    <button
                        onClick={() => onAction?.('decline_task')}
                        className="btn btn-ghost"
                        style={{ padding: '10px 16px' }}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
