import React from 'react';
import { Portal, Snackbar } from 'react-native-paper';

interface AppSnackbarProps {
    visible: boolean;
    message: string;
    onDismiss: () => void;
    actionLabel?: string;
    onActionPress?: () => void;
    duration?: number;
}

const AppSnackbar: React.FC<AppSnackbarProps> = ({
    visible,
    message,
    onDismiss,
    duration = 3000, // default 3 seconds
}) => {
    return (
        <Portal>
            <Snackbar
                visible={visible}
                onDismiss={onDismiss}
                duration={duration}

            >
                {message}
            </Snackbar>
        </Portal>
    );
};

export default AppSnackbar;
