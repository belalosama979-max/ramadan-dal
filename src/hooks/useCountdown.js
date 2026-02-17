import { useState, useEffect } from 'react';

export const useCountdown = (targetDate) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        
        if (difference > 0) {
            return {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                total: difference
            };
        }
        return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const timeLeft = calculateTimeLeft();
            setTimeLeft(timeLeft);
            
            if (timeLeft.total <= 0) {
                setIsExpired(true);
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const formatTime = () => {
        const pad = (num) => num.toString().padStart(2, '0');
        return `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`;
    };

    return { timeLeft, isExpired, formattedTime: formatTime() };
};
