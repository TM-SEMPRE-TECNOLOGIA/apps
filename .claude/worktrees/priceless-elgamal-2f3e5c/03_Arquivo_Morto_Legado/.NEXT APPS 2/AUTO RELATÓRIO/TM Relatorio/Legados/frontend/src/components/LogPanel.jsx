import { useEffect, useRef } from 'react';
import './LogPanel.css';

export default function LogPanel({ logs }) {
    const bottomRef = useRef(null);

    // Auto-scroll to bottom as logs update
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="log-panel glass-panel">
            <div className="log-header">
                <h3>📋 Log de Execução</h3>
            </div>
            <div className="log-content">
                {logs.map((log, i) => (
                    <div key={i} className={`log-line ${log.includes('❌') ? 'error' : log.includes('✅') || log.includes('✔') ? 'success' : ''}`}>
                        {log}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
