import * as Location from 'expo-location';
import { useAppStore } from '../constants/store';
import { computeNextPrayer, getCachedOrFetchPrayerTimes } from './prayerService';
import { updateWidget } from './widgetBridge';

let isTracking = false;
let subscription: Location.LocationSubscription | null = null;

export async function requestLocationPermission(): Promise<boolean> {
    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== 'granted') return false;

    // Request background permission for silent updates when app is backgrounded
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    // Background is optional — app still works with foreground only
    console.log('Background location status:', bgStatus);

    return true;
}

export async function startLocationTracking(): Promise<void> {
    if (isTracking) return;
    isTracking = true;

    const { setCoords, setIsLoading, setError, setPrayerTimes, setNextPrayer } =
        useAppStore.getState();

    setIsLoading(true);

    try {
        // Get an immediate position fix first (fast)
        const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });
        await handleNewCoords(current.coords.latitude, current.coords.longitude);

        // Then subscribe for updates (in case user travels)
        subscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, distanceInterval: 10000 }, // 10km threshold
            async (loc) => {
                const { coords: storedCoords } = useAppStore.getState();
                const lat = loc.coords.latitude;
                const lon = loc.coords.longitude;

                // Only re-fetch if moved more than ~0.1° (~11km)
                if (
                    storedCoords &&
                    Math.abs(storedCoords.latitude - lat) < 0.1 &&
                    Math.abs(storedCoords.longitude - lon) < 0.1
                ) {
                    return;
                }

                await handleNewCoords(lat, lon);
            }
        );
    } catch (err: any) {
        setError('Could not get location. Showing default times.');
        console.warn('Location error:', err);
    } finally {
        setIsLoading(false);
    }
}

async function handleNewCoords(lat: number, lon: number) {
    const { setCoords, setPrayerTimes, setNextPrayer, setLastFetchDate } = useAppStore.getState();
    setCoords({ latitude: lat, longitude: lon });

    const result = await getCachedOrFetchPrayerTimes(lat, lon);
    const prayers = result?.prayers ?? [];
    const { method, country } = result ?? {};
    console.log(`[Location] Detected country: ${country ?? 'unknown'}, using prayer method: ${method ?? 'default'}`);

    setPrayerTimes(prayers);

    const next = computeNextPrayer(prayers);
    setNextPrayer(next);
    setLastFetchDate(new Date().toISOString().slice(0, 10));

    if (next) {
        await updateWidget(prayers, next);
    }
}

export function stopLocationTracking() {
    subscription?.remove();
    subscription = null;
    isTracking = false;
}
