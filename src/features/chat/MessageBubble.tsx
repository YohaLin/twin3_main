import { Sparkles, User } from 'lucide-react';
import type { Message } from '../../types';
import { Card } from '../cards/Card';

interface MessageBubbleProps {
    message: Message;
    onAction?: (actionId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onAction }) => {
    const isUser = message.role === 'user';

    return (
        <div className="animate-fade-in" style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
        }}>
            {/* Avatar */}
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: isUser
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: isUser ? 'none' : 'var(--glow-primary)'
            }}>
                {isUser ? (
                    <User size={16} style={{ color: 'var(--color-text-secondary)' }} />
                ) : (
                    <Sparkles size={16} color="white" />
                )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {/* Sender Name */}
                <div style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: isUser ? 'var(--color-text-secondary)' : 'var(--color-primary)',
                    marginBottom: '6px',
                    textShadow: isUser ? 'none' : '0 0 10px rgba(142, 142, 147, 0.3)'
                }}>
                    {isUser ? 'You' : 'Twin3'}
                </div>

                {/* Text Content */}
                {message.type === 'text' && (
                    <div style={{
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-line'
                    }}>
                        {message.content}
                    </div>
                )}

                {/* Card Content */}
                {message.type === 'card' && message.cardData && (
                    <div style={{ marginTop: '8px' }}>
                        {message.content && (
                            <div style={{
                                color: 'var(--color-text-primary)',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                marginBottom: '16px',
                                whiteSpace: 'pre-line'
                            }}>
                                {message.content}
                            </div>
                        )}
                        <Card data={message.cardData} onAction={onAction} />
                    </div>
                )}
            </div>
        </div>
    );
};
