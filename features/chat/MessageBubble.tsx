import type { Message } from '../../types';

interface MessageBubbleProps {
    message: Message;
    onAction?: (actionId: string) => void;
}

// Simple markdown parser for chat messages
const parseMarkdown = (text: string): string => {
    return text
        // Bold: **text** or __text__
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        // Italic: *text* or _text_
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n/g, '<br/>');
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const parsedContent = parseMarkdown(message.content);

    return (
        <div className="animate-fade-in" style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '16px',
            paddingLeft: isUser ? '60px' : '0',
            paddingRight: isUser ? '0' : '60px'
        }}>
            {/* Message Bubble */}
            <div style={{
                maxWidth: '80%',
                padding: '14px 18px',
                borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                background: isUser
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
            }}>
                <div
                    style={{
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        lineHeight: '1.5'
                    }}
                    dangerouslySetInnerHTML={{ __html: parsedContent }}
                />
            </div>
        </div>
    );
};
