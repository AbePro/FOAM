// NotesForm.tsx


import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';

interface NotesFormProps {
    visible: boolean;
    onDismiss: () => void;
    onSubmit: (data: any) => void;
    submitLabel?: string;
    defaultValues?: any;
    title?: string;
    type?: 'create' | 'update';
}

const NotesForm: React.FC<NotesFormProps> = ({
    visible,
    onDismiss,
    onSubmit,
    submitLabel = 'Save Note',
    defaultValues,
    title,
    type = 'create',
}) => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: defaultValues || {},
    });

    const handleClose = () => {
        reset();
        onDismiss();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            style={styles.modalContent}
                        >
                            <View style={styles.container}>
                                <Text style={styles.title}>
                                    {title || (type === 'update' ? 'Edit Note' : 'Add Note')}
                                </Text>
                                <Controller
                                    control={control}
                                    name="text"
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            mode="outlined"
                                            label="Note Text"
                                            value={value}
                                            onChangeText={onChange}
                                            multiline
                                            style={styles.input}
                                        />
                                    )}
                                />
                                <Button
                                    mode="contained"
                                    onPress={handleSubmit(onSubmit)}
                                    style={styles.button}
                                >
                                    {submitLabel}
                                </Button>
                                <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        marginBottom: 12,
    },
    button: {
        marginTop: 12,
    },
    cancelButton: {
        marginTop: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#6200ee',
        fontWeight: 'bold',
    },
});

export default NotesForm;
