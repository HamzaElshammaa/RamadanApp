import { PrayerTime } from '../constants/store';

const APP_GROUP = 'group.com.ramadanapp.shared';

// Attempt to write to the iOS App Group so the widget can read live data.
// 'react-native-shared-group-preferences' is the bridge — it gracefully
// no-ops on platforms where it's unsupported.
let SharedGroupPreferences: any = null;
try {
    SharedGroupPreferences = require('react-native-shared-group-preferences').default;
} catch {
    // Package not linked yet (e.g. running in Expo Go) — fail silently
}

export async function updateWidget(
    prayers: PrayerTime[],
    nextPrayer: PrayerTime
): Promise<void> {
    if (!SharedGroupPreferences) return;

    const payload = {
        nextPrayerName: nextPrayer.name,
        nextPrayerTime: nextPrayer.isoTime.toISOString(),
        prayerTimes: prayers.map((p) => ({
            name: p.name,
            time: p.time,
            isoTime: p.isoTime.toISOString(),
        })),
        updatedAt: new Date().toISOString(),
    };

    try {
        await SharedGroupPreferences.setItem(
            'ramadan_widget_data',
            JSON.stringify(payload),
            APP_GROUP
        );
    } catch (err) {
        console.warn('Widget bridge write failed:', err);
    }
}
