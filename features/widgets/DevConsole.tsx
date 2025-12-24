import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, ChevronDown, ChevronUp } from 'lucide-react';

interface LogEntry {
    id: string;
    timestamp: number;
    type: 'info' | 'success' | 'error' | 'api';
    message: string;
}

interface DevConsoleProps {
    isOpen: boolean;
    onClose: () => void;
    logs?: LogEntry[];
}

// Global log storage
const globalLogs: LogEntry[] = [];
const logListeners: Set<(logs: LogEntry[]) => void> = new Set();

// Public API to add logs from anywhere in the app
export const devLog = (type: LogEntry['type'], message: string) => {
    const entry: LogEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type,
        message
    };
    globalLogs.push(entry);
    if (globalLogs.length > 100) globalLogs.shift(); // Keep last 100 logs
    logListeners.forEach(listener => listener([...globalLogs]));
};

export const DevConsole: React.FC<DevConsoleProps> = ({ isOpen, onClose }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isMinimized, setIsMinimized] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const listener = (newLogs: LogEntry[]) => setLogs(newLogs);
        logListeners.add(listener);
        setLogs([...globalLogs]);
        return () => { logListeners.delete(listener); };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    if (!isOpen) return null;

    const getLogColor = (type: LogEntry['type']) => {
        switch (type) {
            case 'success': return '#30d158';
            case 'error': return '#ff453a';
            case 'api': return '#0a84ff';
            default: return '#8e8e93';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            width: isMinimized ? '200px' : '400px',
            maxHeight: isMinimized ? '40px' : '300px',
            background: 'rgba(0, 0, 0, 0.95)',
            borderRadius: '12px',
            border: '1px solid rgba(48, 209, 88, 0.3)',
            boxShadow: '0 0 20px rgba(48, 209, 88, 0.1)',
            zIndex: 9999,
            fontFamily: 'monospace',
            fontSize: '11px',
            overflow: 'hidden',
            transition: 'all 0.2s ease'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(48, 209, 88, 0.1)',
                borderBottom: isMinimized ? 'none' : '1px solid rgba(48, 209, 88, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={14} color="#30d158" />
                    <span style={{ color: '#30d158', fontWeight: 'bold' }}>DevConsole</span>
                    <span style={{ color: '#636366' }}>v1.0</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#636366',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#636366',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Logs */}
            {!isMinimized && (
                <div
                    ref={scrollRef}
                    style={{
                        height: '240px',
                        overflowY: 'auto',
                        padding: '8px 12px'
                    }}
                >
                    {logs.length === 0 ? (
                        <div style={{ color: '#636366', textAlign: 'center', paddingTop: '20px' }}>
                            No logs yet...
                        </div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} style={{
                                marginBottom: '4px',
                                display: 'flex',
                                gap: '8px'
                            }}>
                                <span style={{ color: '#636366' }}>
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                                <span style={{
                                    color: getLogColor(log.type),
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    minWidth: '50px'
                                }}>
                                    [{log.type}]
                                </span>
                                <span style={{ color: '#e5e5ea' }}>
                                    {log.message}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
