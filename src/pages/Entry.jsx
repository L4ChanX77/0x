import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

export default function Entry({ onEnter }) {
  const [displayText, setDisplayText] = useState('');
  const [showCpp, setShowCpp] = useState(true);
  const [showScary, setShowScary] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const hasEntered = useRef(false);

  const cppCode = `#include <iostream>
int main() {
    std::cout << "Hello World";
    return 0;
}`;

  const scaryMessages = [
    "Initializing system...",
    "Scanning network...",
    "Access granted.",
    "Welcome, traveler.",
    "You are now in the depths of L4CHANX.",
    "Proceed with caution."
  ];

  // Stage 1: Type C++ code
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < cppCode.length) {
        setDisplayText(cppCode.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowCpp(false);
          setShowScary(true);
        }, 800);
      }
    }, 25);

    // Fallback safety: if something gets stuck, force proceed after 10s
    const safetyTimer = setTimeout(() => {
      if (!showScary && !fadeOut) {
        setShowCpp(false);
        setShowScary(true);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimer);
    };
  }, []);

  // Stage 2: Show scary messages, then exit
  useEffect(() => {
    if (showScary) {
      let msgIndex = 0;
      const msgInterval = setInterval(() => {
        if (msgIndex < scaryMessages.length) {
          setDisplayText(prev => prev + '\n' + scaryMessages[msgIndex]);
          msgIndex++;
        } else {
          clearInterval(msgInterval);
          setTimeout(() => {
            setFadeOut(true);
            // Ensure onEnter is called only once
            if (!hasEntered.current) {
              hasEntered.current = true;
              setTimeout(onEnter, 800);
            }
          }, 1500);
        }
      }, 500);

      // Fallback: force exit after 15s even if messages don't complete
      const forceExitTimer = setTimeout(() => {
        if (!hasEntered.current) {
          hasEntered.current = true;
          setFadeOut(true);
          setTimeout(onEnter, 500);
        }
      }, 15000);

      return () => {
        clearInterval(msgInterval);
        clearTimeout(forceExitTimer);
      };
    }
  }, [showScary, onEnter]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black">
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />
      <AnimatePresence>
        {!fadeOut && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="z-20 w-full max-w-3xl px-6"
          >
            <div className="bg-black/80 border border-primary/40 p-6 rounded-lg shadow-[0_0_30px_rgba(255,0,68,0.1)] font-mono text-primary text-sm md:text-base whitespace-pre-wrap">
              <div className="flex items-center gap-2 mb-4 text-primary/70">
                <Terminal size={18} />
                <span>terminal@l4chanx:~$</span>
              </div>
              <div className="text-[#ff0044]/90 leading-relaxed">
                {displayText}
                <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse" />
              </div>
            </div>
            {showCpp && (
              <div className="mt-4 text-xs text-muted-foreground text-center font-mono opacity-50">
                Compiling...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
