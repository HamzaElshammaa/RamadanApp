export const MOCK_PRAYER_TIMES = [
    { id: 'fajr', name: 'Fajr', time: '05:12 AM' },
    { id: 'sunrise', name: 'Sunrise', time: '06:34 AM' },
    { id: 'dhuhr', name: 'Dhuhr', time: '12:15 PM' },
    { id: 'asr', name: 'Asr', time: '03:20 PM' },
    { id: 'maghrib', name: 'Maghrib', time: '05:54 PM' },
    { id: 'isha', name: 'Isha', time: '07:12 PM' },
];

// Determine next prayer based on a static mock current time (e.g. 05:00 PM) for visual testing
export const MOCK_NEXT_PRAYER = MOCK_PRAYER_TIMES[4]; // Maghrib
