'use client';

import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // In a production app, you would send this to Sentry or a logging service
        console.error('Vaabhi Frontend Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
                    <h2 className="text-2xl font-bold">Something went wrong</h2>
                    <p className="mt-2 text-neutral-500">We've been notified and are working on it.</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-6 rounded-full bg-black px-6 py-2 text-white dark:bg-white dark:text-black"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
