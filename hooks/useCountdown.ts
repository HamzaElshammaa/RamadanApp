import { useEffect, useState } from 'react';
import { PrayerTime } from '../constants/store';

export function useCountdown(nextPrayer: PrayerTime | null) {
    const [countdownString, setCountdownString] = useState('--:--:--');
    const [secondsRemaining, setSecondsRemaining] = useState(0);

    useEffect(() => {
        if (!nextPrayer) {
            setCountdownString('--:--:--');
            return;
        }

        const tick = () => {
            const now = new Date();
            let target = new Date(nextPrayer.isoTime);

            // If the target is in the past (all prayers done today), push to next day
            if (target <= now) {
                target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
            }

            const diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
            setSecondsRemaining(diff);

            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;

            setCountdownString(
                `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            );
        };

        tick(); // immediate first tick
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [nextPrayer]);

    return { countdownString, secondsRemaining };
}
