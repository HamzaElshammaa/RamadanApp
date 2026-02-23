import React from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { MOCK_SOUNDS } from '../constants/sounds';
import { Colors } from '../theme/colors';

interface SoundSheetProps {
    onDismiss: () => void;
    selectedSoundId?: string;
    onSelectSound: (id: string) => void;
}

export function SoundSheet({ onDismiss, selectedSoundId, onSelectSound }: SoundSheetProps) {
    return (
        <Modal
            transparent
            animationType="slide"
            visible
            onRequestClose={onDismiss}
        >
            {/* Backdrop — tap to dismiss */}
            <Pressable style={styles.backdrop} onPress={onDismiss} />

            {/* Sheet content */}
            <View style={styles.sheet}>
                {/* Pull handle */}
                <View style={styles.handle} />

                <Text style={styles.title}>Notification Sound</Text>
                <Text style={styles.subtitle}>Select an Adhan or alert tone</Text>

                <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
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
                                {isActive && <View style={styles.activeDot} />}
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Done button */}
                <Pressable style={styles.doneButton} onPress={onDismiss}>
                    <Text style={styles.doneButtonText}>Done</Text>
                </Pressable>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    sheet: {
        backgroundColor: Colors.primary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: 40,
        maxHeight: '70%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.surface,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
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
        marginBottom: 20,
    },
    listContainer: {
        marginBottom: 16,
    },
    soundItem: {
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
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
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
    },
    doneButton: {
        backgroundColor: Colors.accent,
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    doneButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
