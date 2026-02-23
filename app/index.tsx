import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SoundSheet } from '../components/SoundSheet';
import { useAppStore } from '../constants/store';
import { useCountdown } from '../hooks/useCountdown';
import { Colors } from '../theme/colors';

// Formats "HH:MM" (24h) → "H:MM AM/PM"
function formatTime12h(t: string): string {
    const [hStr, mStr] = t.split(':');
    const h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${mStr} ${ampm}`;
}

// Returns today's Gregorian date as "Weekday, DD Month"
function getTodayLabel(): string {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
}

// Simple Hijri approximation using offset from known Hijri reference
function getHijriLabel(): string {
    // Rough offset: ~578,695 days difference between Gregorian and Hijri epoch
    // This is a simple approximation — accurate enough for display
    const now = new Date();
    const jd = Math.floor(now.getTime() / 86400000) + 2440588;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const ll = l - 10631 * n + 354;
    const j = Math.floor((10985 - ll) / 5316) * Math.floor((50 * ll) / 17719) +
        Math.floor(ll / 5670) * Math.floor((43 * ll) / 15238);
    const lll = ll - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
        Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const month = Math.floor((24 * lll) / 709);
    const day = lll - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;
    const monthNames = [
        'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
        'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
    ];
    return `${day} ${monthNames[month - 1]} ${year} AH`;
}

export default function HomeScreen() {
    const [isSheetVisible, setSheetVisible] = useState(false);
    const { selectedSoundId, setSelectedSoundId, prayerTimes = [], nextPrayer, isLoading, error } =
        useAppStore();
    const { countdownString, secondsRemaining } = useCountdown(nextPrayer);

    const startsInLabel = secondsRemaining > 0
        ? secondsRemaining < 3600
            ? `Starts in ${Math.ceil(secondsRemaining / 60)}m`
            : `Starts in ${Math.floor(secondsRemaining / 3600)}h ${Math.floor((secondsRemaining % 3600) / 60)}m`
        : 'Starting now';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View style={{ flex: 1 }} />
                <Pressable
                    style={styles.settingsButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={() => setSheetVisible(true)}>
                    <Feather name="settings" size={22} color={Colors.text} />
                </Pressable>
            </View>

            {/* Hero Section — always visible */}
            <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.heroSection}>
                <Text style={styles.heroLabel}>
                    {nextPrayer ? `Time until ${nextPrayer.name}` : 'Fetching prayer times…'}
                </Text>
                {isLoading ? (
                    <ActivityIndicator size="large" color={Colors.accent} style={{ marginVertical: 20 }} />
                ) : (
                    <Text style={styles.heroTime}>{countdownString}</Text>
                )}
                {nextPrayer && (
                    <Text style={styles.heroSub}>
                        {nextPrayer.name} at {formatTime12h(nextPrayer.time)}
                    </Text>
                )}
                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.dateContainer}>
                    <Text style={styles.datePrimary}>{getTodayLabel()}</Text>
                    <Text style={styles.dateSecondary}>{getHijriLabel()}</Text>
                </View>
            </Animated.View>

            {/* Prayer Grid — scrollable */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Prayer Times</Text>
                <View style={styles.gridContainer}>
                    {prayerTimes.map((prayer, index) => {
                        const isNext = nextPrayer?.id === prayer.id;
                        return (
                            <Animated.View
                                entering={FadeInDown.delay(index * 80).springify()}
                                key={prayer.id}
                                style={[styles.gridItem, isNext && styles.gridItemActive]}
                            >
                                <View>
                                    <Text style={[styles.prayerName, isNext && styles.textActive]}>
                                        {prayer.name}
                                    </Text>
                                    {isNext && (
                                        <Text style={styles.prayerStartsIn}>{startsInLabel}</Text>
                                    )}
                                </View>
                                <Text style={[styles.prayerTimeItem, isNext && styles.textActive]}>
                                    {formatTime12h(prayer.time)}
                                </Text>
                            </Animated.View>
                        );
                    })}
                    {prayerTimes.length === 0 && !isLoading && (
                        <Text style={styles.placeholderText}>
                            {error ?? 'Allow location access to load prayer times.'}
                        </Text>
                    )}
                </View>
            </ScrollView>

            {isSheetVisible && (
                <SoundSheet
                    selectedSoundId={selectedSoundId}
                    onSelectSound={setSelectedSoundId}
                    onDismiss={() => setSheetVisible(false)}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 16,
    },
    settingsButton: {
        width: 40,
        height: 40,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroSection: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32,
    },
    heroLabel: {
        color: Colors.text,
        opacity: 0.8,
        fontSize: 16,
        marginBottom: 8,
    },
    heroTime: {
        color: Colors.text,
        fontSize: 64,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: -2,
    },
    heroSub: {
        color: Colors.text,
        opacity: 0.9,
        fontSize: 18,
        marginBottom: 20,
    },
    errorText: {
        color: Colors.accent,
        fontSize: 13,
        marginBottom: 8,
        opacity: 0.8,
    },
    dateContainer: {
        alignItems: 'center',
        backgroundColor: Colors.surface,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
    },
    datePrimary: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    dateSecondary: {
        color: Colors.text,
        opacity: 0.7,
        marginTop: 4,
        fontSize: 13,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    sectionTitle: {
        color: Colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    gridContainer: {
        gap: 12,
    },
    gridItem: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    gridItemActive: {
        backgroundColor: Colors.accent,
    },
    prayerName: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '600',
    },
    prayerStartsIn: {
        color: Colors.primary,
        fontSize: 13,
        marginTop: 4,
        fontWeight: '500',
    },
    prayerTimeItem: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    textActive: {
        color: Colors.primary,
    },
    placeholderText: {
        color: Colors.text,
        opacity: 0.5,
        textAlign: 'center',
        paddingVertical: 40,
        fontSize: 15,
    },
});
