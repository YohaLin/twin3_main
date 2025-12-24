import React, { useState } from 'react';
import { Upload, CheckCircle, Clock, Check, Lock } from 'lucide-react';

interface ActiveTaskWidgetProps {
    taskTitle?: string;
    brandName?: string;
    rewardAmount?: string;
    deadline?: string;
    requirements?: string[];
    onVerify?: (url: string) => void;
}

export const ActiveTaskWidget: React.FC<ActiveTaskWidgetProps> = ({
    taskTitle = "Lipstick Filter Challenge",
    brandName = "L'Oréal Paris",
    rewardAmount = "500",
    deadline = "2 days",
    requirements = [
        "Use Filter #666",
        "Mention \"Moisturizing\"",
        "Tag @lorealparis",
        "Video length 15-60s"
    ],
    onVerify
}) => {
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [status, setStatus] = useState<'active' | 'submitting' | 'verified'>('active');
    const [checkedReqs, setCheckedReqs] = useState<number[]>([]);

    const toggleReq = (index: number) => {
        setCheckedReqs(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleVerify = () => {
        if (!submissionUrl) return;
        setStatus('submitting');

        // Mock verification delay
        setTimeout(() => {
            setStatus('verified');
            onVerify?.(submissionUrl);
        }, 1500);
    };

    if (status === 'verified') {
        return (
            <div className="card animate-fade-in" style={{
                padding: '32px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(48, 209, 88, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 0 20px rgba(48, 209, 88, 0.2)'
                }}>
                    <CheckCircle size={32} color="var(--color-success)" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                    Submission Verified!
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                    Reward will be released within 24 hours.
                </p>
                <div style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                        Pending Reward
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Lock size={18} color="var(--color-text-tertiary)" />
                        {rewardAmount} $twin3
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card animate-fade-in" style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden'
        }}>
            {/* Header Status */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        padding: '4px 8px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#60A5FA'
                    }}>
                        ACTIVE
                    </div>
                    {deadline && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            <Clock size={12} />
                            {deadline} left
                        </div>
                    )}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={14} color="var(--color-text-tertiary)" />
                    {rewardAmount} $twin3 pending
                </div>
            </div>

            <div style={{ padding: '24px' }}>
                {/* Task Info */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                        {brandName}
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
                        {taskTitle}
                    </h2>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '20px',
                        fontSize: '13px',
                        color: 'var(--color-text-dim)'
                    }}>
                        <Lock size={12} color="var(--color-text-tertiary)" />
                        {rewardAmount} $twin3 pending
                    </div>
                </div>

                {/* Requirements Checklist */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Requirements
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {requirements.map((req, i) => (
                            <div
                                key={i}
                                onClick={() => toggleReq(i)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    opacity: checkedReqs.includes(i) ? 0.5 : 1,
                                    transition: 'opacity 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '4px',
                                    border: checkedReqs.includes(i)
                                        ? 'none'
                                        : '2px solid rgba(255, 255, 255, 0.2)',
                                    background: checkedReqs.includes(i)
                                        ? 'var(--color-primary)'
                                        : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {checkedReqs.includes(i) && <Check size={12} color="#000000" strokeWidth={3} />}
                                </div>
                                <span style={{
                                    fontSize: '14px',
                                    color: 'var(--color-text-primary)',
                                    textDecoration: checkedReqs.includes(i) ? 'line-through' : 'none'
                                }}>{req}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submission Area */}
                <div style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
                        Submit Proof
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input
                            type="text"
                            placeholder="Paste Instagram post URL..."
                            value={submissionUrl}
                            onChange={(e) => setSubmissionUrl(e.target.value)}
                            style={{
                                flex: 1,
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                color: 'white',
                                fontSize: '13px',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <button
                        onClick={handleVerify}
                        disabled={!submissionUrl || status === 'submitting'}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: (!submissionUrl || status === 'submitting') ? 0.6 : 1
                        }}
                    >
                        {status === 'submitting' ? 'Verifying...' : (
                            <>
                                <Upload size={16} />
                                Verify Submission
                            </>
                        )}
                    </button>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginTop: '8px', textAlign: 'center' }}>
                        AI will verify content requirements automatically
                    </div>
                </div>
            </div>
        </div>
    );
};
