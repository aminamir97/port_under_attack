"use client";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function PageTransition({ children }) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 250);
        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <>
            {/* Light fade transition overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}

            {/* Subtle page fade */}
            <div className={`transition-opacity duration-250 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
                {children}
            </div>
        </>
    );
}