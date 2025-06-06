import { Alert, Linking } from 'react-native';

/**
 * Handles calling a phone number
 */
export const handleCall = (phone?: string) => {
    if (!phone) {
        Alert.alert('No phone number available');
        return;
    }
    Linking.openURL(`tel:${phone}`);
};

/**
 * Handles opening WhatsApp with a given number
 */
export const handleWhatsApp = (whatsapp?: string) => {
    if (!whatsapp) {
        Alert.alert('No phone number available');
        return;
    }
    Linking.openURL(`https://wa.me/${whatsapp}`);
};

/**
 * Handles composing an email
 */
export const handleEmail = (email?: string) => {
    if (!email) {
        Alert.alert('No email available');
        return;
    }
    Linking.openURL(`mailto:${email}`);
};
