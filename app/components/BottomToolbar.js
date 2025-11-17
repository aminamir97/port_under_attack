"use client";

export default function BottomToolbar({
    isPaused,
    onPause,
    onResume,
    onExit
}) {
    return (
        <div className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t-2 border-amber-600/50 
                        flex items-center justify-between px-6 shadow-[0_-4px_20px_rgba(217,119,6,0.3)]">

            {/* Left Section - Game Status */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${isPaused ? 'bg-red-500' : 'bg-green-500'}`} />
                    <span className="text-slate-300 text-sm font-semibold uppercase tracking-wider">
                        {isPaused ? 'PAUSED' : 'ACTIVE'}
                    </span>
                </div>
            </div>

            {/* Center Section - Game Controls */}
            <div className="flex items-center gap-3">
                {/* Pause/Resume Button */}
                {!isPaused ? (
                    <button
                        onClick={onPause}
                        className="group relative px-6 py-2.5 bg-gradient-to-br from-amber-600 to-amber-700 
                                   hover:from-amber-500 hover:to-amber-600
                                   border-2 border-amber-400/50 hover:border-amber-300
                                   rounded-lg shadow-lg hover:shadow-amber-500/50
                                   transition-all duration-200 transform hover:scale-105"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-1 h-4 bg-slate-900 rounded-sm"></div>
                                <div className="w-1 h-4 bg-slate-900 rounded-sm"></div>
                            </div>
                            <span className="text-slate-900 font-bold uppercase tracking-wider text-sm">
                                Pause
                            </span>
                        </div>
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 rounded-lg bg-amber-400/0 group-hover:bg-amber-400/20 transition-all duration-200"></div>
                    </button>
                ) : (
                    <button
                        onClick={onResume}
                        className="group relative px-6 py-2.5 bg-gradient-to-br from-green-600 to-green-700 
                                   hover:from-green-500 hover:to-green-600
                                   border-2 border-green-400/50 hover:border-green-300
                                   rounded-lg shadow-lg hover:shadow-green-500/50
                                   transition-all duration-200 transform hover:scale-105"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-0 h-0 border-l-[10px] border-l-slate-900 border-y-[6px] border-y-transparent"></div>
                            <span className="text-slate-900 font-bold uppercase tracking-wider text-sm">
                                Resume
                            </span>
                        </div>
                        <div className="absolute inset-0 rounded-lg bg-green-400/0 group-hover:bg-green-400/20 transition-all duration-200"></div>
                    </button>
                )}

                {/* Restart Button */}
                <button
                    className="group relative px-5 py-2.5 bg-slate-700/80 hover:bg-slate-600/80
                               border-2 border-slate-500/50 hover:border-slate-400
                               rounded-lg shadow-lg hover:shadow-slate-500/50
                               transition-all duration-200 transform hover:scale-105"
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-slate-300 font-bold uppercase tracking-wider text-sm">
                            Restart
                        </span>
                    </div>
                </button>
            </div>

            {/* Right Section - Exit Button */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onExit}
                    className="group relative px-5 py-2.5 bg-gradient-to-br from-red-700 to-red-800 
                               hover:from-red-600 hover:to-red-700
                               border-2 border-red-500/50 hover:border-red-400
                               rounded-lg shadow-lg hover:shadow-red-500/50
                               transition-all duration-200 transform hover:scale-105"
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-red-100 font-bold uppercase tracking-wider text-sm">
                            Exit
                        </span>
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-red-400/0 group-hover:bg-red-400/20 transition-all duration-200"></div>
                </button>
            </div>
        </div>
    );
}