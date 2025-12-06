export default function GameToolbar({ waveAlertActive, score, time, scoreChange, unreadEventLogs, onMenuToggle }) {
    return (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
            <div className="flex justify-between items-center h-16 px-6">
                {/* Left: Score Display */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-cyan-500/30">
                        <span className="text-cyan-400 font-bold text-sm">SCORE</span>
                        <span className="text-white font-mono text-xl relative">
                            {score}
                            {/* Score change animation */}
                            {scoreChange && (
                                <span
                                    className={`absolute left-full ml-2 text-lg font-bold animate-floatUp ${scoreChange > 0 ? 'text-green-400' : 'text-red-400'
                                        }`}
                                    style={{
                                        textShadow: scoreChange > 0
                                            ? '0 0 10px rgba(34, 197, 94, 0.8)'
                                            : '0 0 10px rgba(239, 68, 68, 0.8)'
                                    }}
                                >
                                    {scoreChange > 0 ? '+' : ''}{scoreChange}
                                </span>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-amber-500/30">
                        <span className="text-amber-400 font-bold text-sm">TIME</span>
                        <span className="text-white font-mono text-xl">{time}</span>
                    </div>
                </div>

                {/* Right: Menu Button with notification badge */}
                {/* Right: Menu Button with notification badge */}
                {waveAlertActive ? (
                    <div className="relative flex items-center justify-center h-16 px-4">
                        <img
                            src="/images/gameplay/emergency.gif"
                            alt="Emergency alert"
                            className="h-12 w-12 object-contain animate-pulse drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                        />
                    </div>
                ) : (
                    <button
                        onClick={onMenuToggle}
                        className="relative flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/60 border border-cyan-400/30"
                    >
                        <span className="text-lg">☰</span>
                        <span className="hidden md:inline">MENU</span>
                        {unreadEventLogs > 0 && (
                            <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-slate-900 animate-pulse">
                                {unreadEventLogs}
                            </span>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}