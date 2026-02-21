import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MOCK_SOUNDS } from '../constants/sounds';
import { Colors } from '../theme/colors';

interface SoundSheetProps {
    onDismiss: () => void;
    selectedSoundId?: string;
    onSelectSound: (id: string) => void;
}

export function SoundSheet({ onDismiss, selectedSoundId, onSelectSound }: SoundSheetProps) {
    const bottomSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ['50%', '75%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            onDismiss();
        }
    }, [onDismiss]);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
            />
        ),
        []
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Notification Sound</Text>
                <Text style={styles.subtitle}>Select an Adhan or alert tone</Text>

                <View style={styles.listContainer}>
                    {MOCK_SOUNDS.map((sound) => {
                        const isActive = sound.id === selectedSoundId;
                        return (
                            <Pressable
                                key={sound.id}
                                style={[styles.soundItem, isActive && styles.soundItemActive]}
                                onPress={() => onSelectSound(sound.id)}
                            >
                                <Text style={[styles.soundName, isActive && styles.textActive]}>
                                    {sound.name}
                                </Text>
                                {isActive && (
                                    <View style={styles.activeDot} />
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetBackground: {
        backgroundColor: Colors.primary,
    },
    handleIndicator: {
        backgroundColor: Colors.surface,
        width: 40,
    },
    contentContainer: {
        flex: 1,
        padding: 24,
    },
    title: {
        color: Colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        color: Colors.text,
        opacity: 0.7,
        fontSize: 16,
        marginBottom: 24,
    },
    listContainer: {
        gap: 12,
    },
    soundItem: {
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    soundItemActive: {
        backgroundColor: Colors.accent,
    },
    soundName: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    textActive: {
        color: Colors.primary,
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    }
});
