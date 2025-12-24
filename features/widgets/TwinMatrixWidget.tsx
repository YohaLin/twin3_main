import React from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { Sparkles, Shield, Zap, Heart, Brain, Globe } from 'lucide-react';

// Twin Matrix - 256D representation simplified to 6 key dimensions
interface TwinMatrixData {
    physical: number;    // Physical realm traits (0-100)
    digital: number;     // Digital footprint (0-100)
    social: number;      // Social connections (0-100)
    spiritual: number;   // Values & beliefs (0-100)
    cognitive: number;   // Knowledge & skills (0-100)
    emotional: number;   // Emotional intelligence (0-100)
}

interface TwinMatrixWidgetProps {
    data?: TwinMatrixData;
    username?: string;
    onMint?: () => void;
}

const defaultData: TwinMatrixData = {
    physical: 65,
    digital: 82,
    social: 74,
    cognitive: 88,
    emotional: 71,
    spiritual: 58,
};

const dimensionLabels = {
    physical: { label: 'Physical', icon: Shield },
    digital: { label: 'Digital', icon: Globe },
    social: { label: 'Social', icon: Heart },
    cognitive: { label: 'Cognitive', icon: Brain },
    emotional: { label: 'Emotional', icon: Sparkles },
    spiritual: { label: 'Spiritual', icon: Zap },
};

export const TwinMatrixWidget: React.FC<TwinMatrixWidgetProps> = ({
    data = defaultData,
    username = 'User',
    onMint
}) => {
    const radarData = Object.entries(data).map(([key, value]) => ({
        subject: dimensionLabels[key as keyof TwinMatrixData].label,
        value: value,
        fullMark: 100,
    }));

    const totalScore = Math.round(
        Object.values(data).reduce((sum, val) => sum + val, 0) / Object.keys(data).length
    );

    return (
        <div className="card animate-fade-in-scale" style={{
            maxWidth: '400px',
            padding: 0,
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        marginBottom: '4px'
                    }}>
                        Twin Matrix
                    </h3>
                    <p style={{
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)'
                    }}>
                        @{username}'s 256D Profile
                    </p>
                </div>
                <div style={{
                    fontSize: '32px',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)'
                }}>
                    {totalScore}
                </div>
            </div>

            {/* Radar Chart */}
            <div style={{ padding: '16px', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{
                                fill: 'var(--color-text-secondary)',
                                fontSize: 11,
                                fontWeight: 500
                            }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />
                        <Radar
                            name="Matrix"
                            dataKey="value"
                            stroke="#ffffff"
                            fill="rgba(255, 255, 255, 0.15)"
                            strokeWidth={2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Dimension Stats */}
            <div style={{
                padding: '16px 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                borderTop: '1px solid var(--glass-border)'
            }}>
                {Object.entries(data).map(([key, value]) => {
                    const dim = dimensionLabels[key as keyof TwinMatrixData];
                    const Icon = dim.icon;
                    return (
                        <div key={key} style={{
                            textAlign: 'center',
                            padding: '8px'
                        }}>
                            <Icon size={16} style={{
                                color: 'var(--color-text-secondary)',
                                marginBottom: '4px'
                            }} />
                            <div style={{
                                fontSize: '16px',
                                fontWeight: 500,
                                color: 'var(--color-text-primary)'
                            }}>
                                {value}
                            </div>
                            <div style={{
                                fontSize: '10px',
                                color: 'var(--color-text-dim)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {dim.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mint Button */}
            {onMint && (
                <div style={{ padding: '16px 24px', paddingTop: 0 }}>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={onMint}
                    >
                        <Sparkles size={16} />
                        Mint SBT
                    </button>
                </div>
            )}
        </div>
    );
};
