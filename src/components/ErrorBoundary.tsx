"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-hima-main p-4">
                    <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3">
                            Something went wrong
                        </h2>

                        <p className="text-slate-300 mb-6 leading-relaxed">
                            An unexpected error occurred. Please try again or refresh the page.
                        </p>

                        {this.state.error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6 text-left">
                                <p className="text-xs text-red-300 font-mono break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center justify-center gap-2 bg-hima-secondary text-white px-6 py-3 rounded-xl font-medium hover:bg-hima-secondary/80 transition-all"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-all"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
