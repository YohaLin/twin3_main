import type { CardData } from '../../types';
import { TaskOpportunityCard } from './TaskOpportunityCard';

interface CardProps {
    data: CardData;
    onAction?: (actionId: string) => void;
}

export const Card: React.FC<CardProps> = ({ data, onAction }) => {
    // Task Opportunity Card
    if (data.type === 'task_opportunity' && data.taskPayload) {
        return <TaskOpportunityCard data={data.taskPayload} onAction={onAction} />;
    }

    // Generic / Intro / Confirmation / Task Detail Cards
    return (
        <div
            className="card card-hover animate-fade-in-scale"
            style={{ maxWidth: '520px' }}
        >
            {data.imageUrl && (
                <div style={{
                    marginBottom: '16px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden'
                }}>
                    <img
                        src={data.imageUrl}
                        alt={data.title || ''}
                        style={{
                            width: '100%',
                            height: '180px',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            )}

            {data.title && (
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    marginBottom: '10px',
                    lineHeight: '1.3'
                }}>
                    {data.title}
                </h3>
            )}

            {data.description && (
                <p style={{
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '20px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                }}>
                    {data.description}
                </p>
            )}

            {data.actions && data.actions.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap'
                }}>
                    {data.actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => onAction?.(action.actionId)}
                            className={action.variant === 'primary' ? 'btn btn-primary' : 'btn btn-ghost'}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
