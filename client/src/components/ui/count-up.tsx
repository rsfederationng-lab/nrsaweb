import React, { useState, useEffect } from "react";

interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string; // Allow custom styling
}

export function CountUp({ end, duration = 2000, suffix = "", prefix = "", className = "" }: CountUpProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smoother animation (easeOutQuad)
            const easeProgress = 1 - (1 - progress) * (1 - progress);

            setCount(Math.floor(easeProgress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            }
        };

        animationFrame = requestAnimationFrame(step);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    const format = (n: number) => {
        // Simple formatter, can be enhanced
        return n.toLocaleString();
    };

    return <span className={className}>{prefix}{format(count)}{suffix}</span>;
}
