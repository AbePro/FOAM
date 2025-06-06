// CustomersForm.tsx

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, Switch, Text, TextInput } from 'react-native-paper';

const CustomersForm = ({
    onSubmit,
    defaultValues,
    submitLabel = 'Save Customer',
}: {
    onSubmit: (data: any) => void;
    defaultValues?: any;
    submitLabel?: string;
}) => {
    const { control, handleSubmit, watch } = useForm({
        defaultValues,
    });

    const [sameAsPhone, setSameAsPhone] = useState(true);
    const phoneValue = watch('phone');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customer Info</Text>
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
            <View style={styles.rowContainer}>
                <Controller
                    control={control}
                    name="whatsapp"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            mode="outlined"
                            label="WhatsApp"
                            value={sameAsPhone && phoneValue ? phoneValue : value}
                            onChangeText={onChange}
                            style={[styles.input, { flex: 1 }]}
                            editable={!sameAsPhone}
                            keyboardType="phone-pad"
                        />
                    )}
                />
                <Switch
                    value={sameAsPhone}
                    onValueChange={setSameAsPhone}
                    color="#6200ee"
                    style={styles.switch}
                />
            </View>
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
            {/* Future fields like image or reminder can be added here */}
            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
                {submitLabel}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        marginBottom: 12,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    switch: {
        marginLeft: 8,
    },
    button: {
        marginTop: 12,
    },
});

export default CustomersForm;
