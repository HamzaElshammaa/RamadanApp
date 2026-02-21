import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SoundSheet } from '../components/SoundSheet';
import { MOCK_NEXT_PRAYER, MOCK_PRAYER_TIMES } from '../constants/mockData';
import { useAppStore } from '../constants/store';
import { Colors } from '../theme/colors';

export default function HomeScreen() {
    const [isSheetVisible, setSheetVisible] = useState(false);
    const { selectedSoundId, setSelectedSoundId } = useAppStore();

    return (
        <View style={styles.container}>
            {/* Settings Button */}
            <Pressable style={styles.settingsButton} onPress={() => setSheetVisible(true)}>
                <Text style={styles.settingsButtonText}>Settings</Text>
            </Pressable>

            {/* Hero Section */}
            <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.heroSection}>
                <Text style={styles.heroLabel}>Time until {MOCK_NEXT_PRAYER.name}</Text>
                <Text style={styles.heroTime}>04:22:10</Text>
                <Text style={styles.heroSub}>{MOCK_NEXT_PRAYER.name} at {MOCK_NEXT_PRAYER.time}</Text>

                <View style={styles.dateContainer}>
                    <Text style={styles.datePrimary}>Monday, 11 March</Text>
                    <Text style={styles.dateSecondary}>1 Ramadan 1445 AH</Text>
                </View>
            </Animated.View>

            {/* Prayer Grid */}
            <View style={styles.gridSection}>
                <Text style={styles.sectionTitle}>Prayer Times</Text>
                <View style={styles.gridContainer}>
                    {MOCK_PRAYER_TIMES.map((prayer, index) => {
                        const isNext = prayer.id === MOCK_NEXT_PRAYER.id;

                        return (
                            <Animated.View
                                entering={FadeInDown.delay(index * 100).springify()}
                                key={prayer.id}
                                style={[styles.gridItem, isNext && styles.gridItemActive]}
                            >
                                <View>
                                    <Text style={[styles.prayerName, isNext && styles.textActive]}>{prayer.name}</Text>
                                    {isNext && (
                                        <Text style={styles.prayerStartsIn}>Starts in 14m</Text>
                                    )}
                                </View>
                                <Text style={[styles.prayerTimeItem, isNext && styles.textActive]}>{prayer.time}</Text>
                            </Animated.View>
                        );
                    })}
                </View>
            </View>

            {isSheetVisible && (
                <SoundSheet
                    selectedSoundId={selectedSoundId}
                    onSelectSound={setSelectedSoundId}
                    onDismiss={() => setSheetVisible(false)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
        padding: 24,
    },
    settingsButton: {
        position: 'absolute',
        top: 60,
        right: 24,
        zIndex: 10,
        padding: 8,
        backgroundColor: Colors.surface,
        borderRadius: 8,
    },
    settingsButtonText: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
    heroSection: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
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
    },
    heroSub: {
        color: Colors.text,
        opacity: 0.9,
        fontSize: 18,
        marginBottom: 24,
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
        fontSize: 18,
        fontWeight: '600',
    },
    dateSecondary: {
        color: Colors.text,
        opacity: 0.7,
        marginTop: 4,
    },
    gridSection: {
        flex: 1,
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
        fontSize: 14,
        marginTop: 4,
        opacity: 0.8,
    },
    prayerTimeItem: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    textActive: {
        color: Colors.primary, // Inverse color for better contrast on the light accent background
    }
});
