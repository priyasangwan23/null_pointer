import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OpeningAnimation({ onComplete }) {
    const [logIndex, setLogIndex] = useState(0);
    const [fillProgress, setFillProgress] = useState(0);
    const [phase, setPhase] = useState('scaffolding'); // scaffolding -> brewing -> final -> exit

    const logs = [
        "Establishing connection to personality matrix...",
        "Scanning linguistic patterns and vocabulary footprint...",
        "Calibrating neural networks for conversational cadence...",
        "Extracting style footprints: loading digital clone workspace...",
        "Rendering Digital Clone core model..."
    ];

    useEffect(() => {
        // 1. Step through the installation/calibration logs
        if (logIndex < logs.length - 1) {
            const logTimer = setTimeout(() => {
                setLogIndex(prev => prev + 1);
            }, 700 + Math.random() * 400);
            return () => clearTimeout(logTimer);
        } else {
            // Transition to brewing phase once logs are complete
            setPhase('brewing');
        }
    }, [logIndex]);

    useEffect(() => {
        // 2. Animate the clone rendering process when in brewing phase
        if (phase === 'brewing') {
            const fillInterval = setInterval(() => {
                setFillProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(fillInterval);
                        setPhase('final');
                        return 100;
                    }
                    return prev + 2;
                });
            }, 30);
            return () => clearInterval(fillInterval);
        }
    }, [phase]);

    useEffect(() => {
        // 3. Final screen showtime before exiting
        if (phase === 'final') {
            const exitTimer = setTimeout(() => {
                setPhase('exit');
            }, 2000);
            return () => clearTimeout(exitTimer);
        }
    }, [phase]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F2EB] overflow-hidden select-none">

            {/* Subtle background grain or warming radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,253,249,0.6)_0%,rgba(247,242,235,1)_100%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 text-center">

                {/* Animated User Profile Outline SVG */}
                <div className="w-40 h-40 mb-8 relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                        <defs>
                            <linearGradient id="avatarGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#4B3621" />
                                <stop offset={`${fillProgress}%`} stopColor="#C68E5D" />
                                <stop offset={`${fillProgress}%`} stopColor="transparent" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Scanning grid circle */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#E8DED1" strokeWidth="1" strokeDasharray="3 3" />

                        {/* User Avatar silhouette filled with gradient */}
                        <motion.path
                            d="M30,75 C30,62 38,54 50,54 C62,54 70,62 70,75 Z M50,48 C57,48 62,43 62,36 C62,29 57,24 50,24 C43,24 38,29 38,36 C38,43 43,48 50,48 Z"
                            fill="url(#avatarGrad)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />

                        {/* Neural network nodes and lines */}
                        {phase === 'scaffolding' && (
                            <>
                                <line x1="50" y1="24" x2="43" y2="29" stroke="#C68E5D" strokeWidth="1" />
                                <line x1="50" y1="24" x2="57" y2="29" stroke="#C68E5D" strokeWidth="1" />
                                <line x1="50" y1="48" x2="50" y2="54" stroke="#C68E5D" strokeWidth="1" />
                                <line x1="38" y1="36" x2="30" y2="60" stroke="#C68E5D" strokeWidth="1" />
                                <line x1="62" y1="36" x2="70" y2="60" stroke="#C68E5D" strokeWidth="1" />

                                <circle cx="50" cy="24" r="2" fill="#4B3621" />
                                <circle cx="43" cy="29" r="2" fill="#4B3621" />
                                <circle cx="57" cy="29" r="2" fill="#4B3621" />
                                <circle cx="38" cy="36" r="2" fill="#4B3621" />
                                <circle cx="62" cy="36" r="2" fill="#4B3621" />
                                <circle cx="50" cy="48" r="2" fill="#4B3621" />
                            </>
                        )}

                        {/* Outer scan ring path */}
                        <motion.path
                            d="M50,5 A45,45 0 1,1 49.9,5"
                            fill="none"
                            stroke="#4B3621"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* Horizontal scanline scanner */}
                        {phase === 'scaffolding' && (
                            <motion.line
                                x1="10"
                                y1="20"
                                x2="90"
                                y2="20"
                                stroke="#C68E5D"
                                strokeWidth="2"
                                animate={{ y: [20, 80, 20] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        )}
                    </svg>

                    {/* Steaming/neural data wave effect rising up */}
                    <AnimatePresence>
                        {phase === 'final' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
                                {[1, 2, 3].map((s, idx) => (
                                    <motion.div
                                        key={s}
                                        className="w-1.5 h-8 bg-accent/30 rounded-full blur-[1px]"
                                        initial={{ opacity: 0, y: 10, scaleY: 0.5 }}
                                        animate={{
                                            opacity: [0, 0.8, 0],
                                            y: -25,
                                            scaleY: [0.5, 1.2, 0.8],
                                            skewX: [0, 10, -10, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: idx * 0.4,
                                            ease: "easeOut"
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Text Area */}
                <div className="h-28 flex flex-col items-center justify-center relative w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        {phase === 'scaffolding' && (
                            <motion.div
                                key={logIndex}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                                className="text-sm font-mono text-body/80 tracking-wide select-none"
                            >
                                <span className="text-[#C68E5D] mr-2">&gt;</span>
                                {logs[logIndex]}
                            </motion.div>
                        )}

                        {phase === 'brewing' && (
                            <motion.div
                                key="brewing-ui"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-48 text-center"
                            >
                                <div className="text-xs font-mono text-body mb-2 tracking-widest uppercase">
                                    Pouring Clone Data
                                </div>
                                <div className="w-full bg-[#E8DED1] h-1 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${fillProgress}%` }} />
                                </div>
                                <div className="text-sm font-mono font-bold text-heading mt-2">{fillProgress}%</div>
                            </motion.div>
                        )}

                        {phase === 'final' && (
                            <motion.div
                                key="final-logo"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="flex flex-col items-center"
                            >
                                <motion.h1
                                    className="text-3xl md:text-4xl font-bold font-heading text-heading tracking-wider mb-2 uppercase"
                                    initial={{ letterSpacing: '0.1em' }}
                                    animate={{ letterSpacing: '0.25em' }}
                                    transition={{ duration: 1.8, ease: "easeOut" }}
                                >
                                    Digital Clone
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.6 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="text-xs font-mono uppercase tracking-[0.3em] text-body"
                                >
                                    Workspace synchronous
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Screen Outro Masking Transition */}
            <AnimatePresence>
                {phase === 'exit' && (
                    <motion.div
                        className="absolute inset-0 bg-[#FFFDF9] z-50 pointer-events-none"
                        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                        transition={{ duration: 0.75, ease: [0.77, 0, 0.175, 1] }}
                        onAnimationComplete={() => onComplete && onComplete()}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
