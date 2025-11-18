"use client";

export default function GameToolbar({ score = 0, time = "00:00", onMenuToggle, scoreChange = null }) {
    return (
        <div className="h-14 md:h-16 bg-slate-900 border-b border-amber-600/50 flex items-center justify-between px-3 md:px-6 shadow-lg">
            {/* Left: Logo + Game Name (name hidden on small screens) */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <img
                    src="/images/logo.png"
                    alt="Game Logo"
                    className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]"
                />
                {/* Game name only shows on medium+ screens */}
                <h1 className="text-amber-500 font-bold text-xl tracking-wider uppercase hidden md:block">
                    City Under Attack
                </h1>
            </div>

            {/* Center: Score & Time - ALWAYS VISIBLE, clear and prominent */}
            <div className="flex items-center gap-4 md:gap-8 shrink-0">
                <div className="flex items-center gap-2 relative">
                    <span className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wide">
                        Score:
                    </span>
                    <span className="text-amber-400 text-base md:text-lg font-bold">{score}</span>

                    {/* Floating Score Change Animation */}
                    {scoreChange !== null && (
                        <span
                            className={`absolute left-full ml-2 text-lg md:text-xl font-bold animate-float-up ${scoreChange > 0 ? 'text-green-400' : 'text-red-400'
                                }`}
                            style={{
                                animation: 'floatUp 1.5s ease-out forwards',
                                textShadow: scoreChange > 0
                                    ? '0 0 10px rgba(74, 222, 128, 0.8)'
                                    : '0 0 10px rgba(248, 113, 113, 0.8)'
                            }}
                        >
                            {scoreChange > 0 ? '+' : ''}{scoreChange}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wide">
                        Time:
                    </span>
                    <span className="text-amber-400 text-base md:text-lg font-bold">{time}</span>
                </div>
            </div>

            {/* Right: Menu Button */}
            <button
                onClick={onMenuToggle}
                className="px-3 py-1.5 md:px-6 md:py-2 bg-amber-700 hover:bg-amber-600 border-2 border-amber-500 
                           text-slate-100 text-xs md:text-base font-bold uppercase tracking-wider rounded 
                           transition-all duration-200 shadow-md hover:shadow-amber-500/50 shrink-0"
            >
                Menu
            </button>
        </div>
    );
}