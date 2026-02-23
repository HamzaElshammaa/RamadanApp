import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { PrayerTime } from '../constants/store';

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// ─── Calculation Method Map ───────────────────────────────────────────────────
// Maps ISO 3166-1 alpha-2 country codes → AlAdhan method number
// See: https://aladhan.com/prayer-times-api#GetTimings
const COUNTRY_METHOD_MAP: Record<string, number> = {
    // Egyptian General Authority of Survey (Method 5)
    EG: 5, LY: 5, DZ: 5, MA: 5, TN: 5,

    // Umm al-Qura University, Makkah (Method 4)
    SA: 4,

    // Dubai / Gulf region using method 8
    AE: 8, OM: 8,

    // Kuwait (Method 9)
    KW: 9,

    // Qatar (Method 10)
    QA: 10,

    // Islamic Society of North America / ISNA (Method 2)
    US: 2, CA: 2,

    // University of Islamic Sciences, Karachi (Method 1)
    PK: 1, AF: 1, IN: 1, BD: 1, SL: 1,

    // Singapore & Malaysia (Method 11)
    SG: 11, MY: 11, BN: 11,

    // Union Organization Islamique de France (Method 12)
    FR: 12,

    // Diyanet İşleri Başkanlığı, Turkey (Method 13)
    TR: 13,

    // Spiritual Administration of Muslims of Russia (Method 14)
    RU: 14,

    // Indonesia (Method 20 — Kementerian Agama RI)
    ID: 20,

    // Jordan, Syria, Lebanon, Iraq, Palestine (Levant — Method 3 MWL works well)
    JO: 3, SY: 3, LB: 3, IQ: 3, PS: 3,

    // Iran (Institute of Geophysics, Tehran — Method 7)
    IR: 7,

    // Default for UK, Europe, and everything else: Muslim World League (Method 3)
};

const DEFAULT_METHOD = 3; // Muslim World League — best global fallback

// ─── Country Detection ────────────────────────────────────────────────────────

async function getCountryIsoCode(lat: number, lon: number): Promise<string | null> {
    try {
        const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
        return results?.[0]?.isoCountryCode ?? null;
    } catch {
        return null;
    }
}

export function getMethodForCountry(isoCode: string | null): number {
    if (!isoCode) return DEFAULT_METHOD;
    return COUNTRY_METHOD_MAP[isoCode.toUpperCase()] ?? DEFAULT_METHOD;
}

// ─── Time Utilities ───────────────────────────────────────────────────────────

function parseTimeToday(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
}

export function computeNextPrayer(prayers: PrayerTime[]): PrayerTime | null {
    if (!prayers.length) return null;
    const now = new Date();
    const upcoming = prayers.find((p) => p.isoTime > now);
    return upcoming ?? prayers[0];
}

// ─── Cache Key ────────────────────────────────────────────────────────────────

function todayKey(lat: number, lon: number, method: number): string {
    const d = new Date().toISOString().slice(0, 10);
    return `prayers_${d}_${lat.toFixed(2)}_${lon.toFixed(2)}_m${method}`;
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export async function getCachedOrFetchPrayerTimes(
    lat: number,
    lon: number
): Promise<{ prayers: PrayerTime[]; method: number; country: string | null }> {
    // 1. Detect country & pick best method
    const country = await getCountryIsoCode(lat, lon);
    const method = getMethodForCountry(country);

    console.log(`[Prayer] Country: ${country ?? 'unknown'} → Method: ${method}`);

    const key = todayKey(lat, lon, method);

    // 2. Try cache
    try {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
            const parsed = JSON.parse(cached) as PrayerTime[];
            return {
                prayers: parsed.map((p) => ({ ...p, isoTime: new Date(p.isoTime) })),
                method,
                country,
            };
        }
    } catch {
        // Cache miss — proceed to fetch
    }

    // 3. Fetch from AlAdhan API
    const prayers = await fetchAndCachePrayerTimes(lat, lon, method, key);
    return { prayers, method, country };
}

// ─── API Fetch ────────────────────────────────────────────────────────────────

async function fetchAndCachePrayerTimes(
    lat: number,
    lon: number,
    method: number,
    cacheKey: string
): Promise<PrayerTime[]> {
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=${method}`;

    console.log(`[Prayer] Fetching: ${url}`);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`AlAdhan API error: ${res.status}`);

    const json = await res.json();
    const timings = json.data.timings as Record<string, string>;

    const prayers: PrayerTime[] = PRAYER_NAMES.map((name) => {
        const timeStr = timings[name].replace(/\s*\(.*\)/, '').trim().slice(0, 5);
        return {
            id: name.toLowerCase(),
            name,
            time: timeStr,
            isoTime: parseTimeToday(timeStr),
        };
    });

    await AsyncStorage.setItem(cacheKey, JSON.stringify(prayers));
    return prayers;
}
