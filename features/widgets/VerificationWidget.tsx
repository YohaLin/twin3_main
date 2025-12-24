import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Loader2 } from 'lucide-react';

interface VerificationWidgetProps {
    code: string;
    platform: 'twitter' | 'instagram' | 'discord';
    username?: string;
    onVerify: () => void;
    isVerifying?: boolean;
}

export const VerificationWidget: React.FC<VerificationWidgetProps> = ({
    code,
    platform,
    username = 'User',
    onVerify,
    isVerifying = false
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const platformLabels = {
        twitter: { name: 'Twitter/X', action: 'Add to your bio' },
        instagram: { name: 'Instagram', action: 'Add to your bio' },
        discord: { name: 'Discord', action: 'Post in #verify channel' }
    };

    const pl = platformLabels[platform];

    return (
        <div className="card animate-fade-in" style={{
            maxWidth: '380px',
            padding: 0,
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ShieldCheck size={20} color="#30d158" />
                </div>
                <div>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        marginBottom: '2px'
                    }}>
                        Verify {pl.name}
                    </h3>
                    <p style={{
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)'
                    }}>
                        @{username}
                    </p>
                </div>
            </div>

            {/* Steps */}
            <div style={{ padding: '20px 24px' }}>
                {/* Step 1 */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--color-text-secondary)',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Step 1: Copy Code
                    </div>
                    <div
                        onClick={handleCopy}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <code style={{
                            fontSize: '15px',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            fontFamily: 'monospace'
                        }}>
                            {code}
                        </code>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: copied ? '#30d158' : 'var(--color-text-dim)',
                            fontSize: '13px'
                        }}>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--color-text-secondary)',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Step 2: {pl.action}
                    </div>
                    <p style={{
                        fontSize: '13px',
                        color: 'var(--color-text-dim)',
                        marginBottom: '16px',
                        lineHeight: '1.5'
                    }}>
                        Add the verification code above to your {pl.name} profile, then click verify.
                    </p>
                    <button
                        onClick={onVerify}
                        disabled={isVerifying}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <ShieldCheck size={18} />
                                Verify Ownership
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Generate verification code
export const generateVerificationCode = (): string => {
    return 'T3-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};
