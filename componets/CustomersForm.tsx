import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Button, IconButton, TextInput, } from 'react-native-paper';

interface CustomersFormProps {
    visible: boolean;
    onDismiss: () => void;
    onSubmit: (data: any) => void;
    defaultValues?: any;
    submitLabel?: string;
    type?: 'create' | 'update';
}

const CustomersForm: React.FC<CustomersFormProps> = ({
    visible,
    onDismiss,
    onSubmit,
    defaultValues,
    submitLabel = 'Save Customer',
    type = 'create',
}) => {
    const { control, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues,
    });

    const [showWhatsAppField, setShowWhatsAppField] = useState(false);
    const [showEmailField, setShowEmailField] = useState(false);

    const phoneValue = watch('phone');

    const handleClose = () => {
        reset();
        onDismiss();
    };

    const [imageUri, setImageUri] = useState<string | null>(null);

    const handleImageUpload = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        Alert.alert(
            'Add Image',
            'Choose an option:',
            [
                {
                    text: 'Take Photo',
                    onPress: async () => {
                        const cameraResult = await ImagePicker.launchCameraAsync({

                            quality: 0.7,
                        });
                        if (!cameraResult.canceled && cameraResult.assets.length > 0) {
                            setImageUri(cameraResult.assets[0].uri);
                            setValue('image', cameraResult.assets[0].uri);
                        }
                    },
                },
                {
                    text: 'Choose from Gallery',
                    onPress: async () => {
                        const galleryResult = await ImagePicker.launchImageLibraryAsync({

                            quality: 0.7,
                        });
                        if (!galleryResult.canceled && galleryResult.assets.length > 0) {
                            setImageUri(galleryResult.assets[0].uri);
                            setValue('image', galleryResult.assets[0].uri);
                            console.log(imageUri)
                        }
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };




    const handleRemindMe = () => {
        Alert.alert('Remind Me', 'This will open a date/time picker. (Implement later)');
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
                                    {type === 'update' ? 'Edit Customer' : 'Add Customer'}
                                </Text>

                                {/* Name */}
                                <Controller
                                    control={control}
                                    name="name"
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            mode="outlined"
                                            label="Name"
                                            value={value}
                                            onChangeText={onChange}
                                            style={styles.input}
                                        />
                                    )}
                                />

                                {/* Phone */}
                                <Controller
                                    control={control}
                                    name="phone"
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            mode="outlined"
                                            label="Phone"
                                            value={value}
                                            onChangeText={onChange}
                                            style={styles.input}
                                            keyboardType="phone-pad"
                                        />
                                    )}
                                />

                                {/* WhatsApp Toggle */}
                                {!showWhatsAppField ? (
                                    <View className='flex flex-row'>
                                        <Text className='mr-2'>Different WhatsApp number?</Text>
                                        <TouchableOpacity onPress={() => setShowWhatsAppField(true)}>
                                            <Text style={styles.toggleText}>Click here to add.</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Controller
                                        control={control}
                                        name="whatsapp"
                                        defaultValue=""
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                mode="outlined"
                                                label="WhatsApp"
                                                value={value || phoneValue}
                                                onChangeText={onChange}
                                                style={styles.input}
                                                keyboardType="phone-pad"
                                            />
                                        )}
                                    />
                                )}

                                {/* Email Toggle */}
                                {!showEmailField ? (
                                    <TouchableOpacity onPress={() => setShowEmailField(true)}>
                                        <Text style={styles.toggleText}>Add email address</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Controller
                                        control={control}
                                        name="email"
                                        defaultValue=""
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                mode="outlined"
                                                label="Email"
                                                value={value}
                                                onChangeText={onChange}
                                                style={styles.input}
                                                keyboardType="email-address"
                                            />
                                        )}
                                    />
                                )}

                                {/* Image Upload */}
                                <TouchableOpacity style={styles.imageUploadContainer}
                                    onPress={handleImageUpload}>
                                    <IconButton
                                        icon="camera"
                                        size={24}

                                    />
                                    <Text style={styles.iconLabel}>{imageUri ? 'Change Image' : 'Add Image'}</Text>
                                </TouchableOpacity>
                                {imageUri && (
                                    <View style={styles.imagePreviewContainer}>
                                        <View style={{ position: 'relative', width: 100, height: 100 }}>
                                            <Image
                                                source={{ uri: imageUri }}
                                                style={styles.imagePreview}
                                            />
                                            <TouchableOpacity
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                                    borderRadius: 12,
                                                    padding: 2,
                                                }}
                                                onPress={() => setImageUri(null)}
                                            >
                                                <IconButton
                                                    icon="close"
                                                    size={18}
                                                    iconColor="white"
                                                    style={{ margin: 0 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}


                                {/* Notes */}
                                <Controller
                                    control={control}
                                    name="notes"
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            mode="outlined"
                                            label="Notes"
                                            multiline
                                            numberOfLines={3}
                                            value={value}
                                            onChangeText={onChange}
                                            style={styles.input}

                                        />
                                    )}
                                />

                                {/* Remind Me Button */}
                                <Button
                                    mode="outlined"
                                    onPress={handleRemindMe}
                                    style={styles.remindButton}
                                >
                                    Remind Me
                                </Button>

                                {/* Save Button */}
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
    toggleText: {
        color: '#6200ee',
        marginBottom: 12,
        textDecorationLine: 'underline',
    },
    imageUploadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconLabel: {
        fontSize: 16,
        color: '#333',
        marginLeft: 8,
    },
    remindButton: {
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
    imagePreviewContainer: {
        alignItems: 'center',
        marginBottom: 12,

    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,

    },
});

export default CustomersForm;
