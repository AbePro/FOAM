import AppSnackbar from '@/componets/AppSnackbar';
import CustomersForm from '@/componets/CustomersForm';
import NotesForm from '@/componets/NotesForm';
import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Divider, IconButton, MD2Colors, MD3Colors, Text } from 'react-native-paper';
import { db } from '../../lib/firebase';
import { createItem, deleteItem, updateItem } from '../../lib/firstoreFunctions';
import { handleCall, handleEmail, handleWhatsApp } from '../../lib/linkingHelpers';
const { cloudinaryUploadPreset, cloudinaryCloudName } = Constants.expoConfig?.extra || {};



const CustomerDeatils = ({ }) => {

    const { id } = useLocalSearchParams();
    const [customer, setCustomer] = useState<any>(null);
    const [expanded, setExpanded] = useState(false);
    const [selectedNote, setSelectedNote] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editCustomerModalVisible, setEditCustomerModalVisible] = useState(false);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const onDismissSnackbar = () => {
        setSnackbarVisible(false);
    };
    const [newNoteModalVisible, setNewNoteModalVisible] = useState(false);
    const [newNoteText, setNewNoteText] = useState('');
    const [editNoteModalVisible, setEditNoteModalVisible] = useState(false);
    const [editNoteText, setEditNoteText] = useState('');



    // const [latestNote, setLatestNote] = useState<{ text: string } | null>(null);
    const [notes, setNotes] = useState<any[]>([]);

    const handleDeleteNote = async (noteId: string) => {
        await deleteItem('customers', noteId, id as string, 'notes');
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
        showSnackbar('Note deleted');
    };

    const fetchNotes = async () => {
        try {
            const notesRef = collection(db, 'customers', id as string, 'notes');
            const notesQuery = query(notesRef, orderBy('createdAt', 'desc'));
            const notesSnapshot = await getDocs(notesQuery);

            const notesData = notesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setNotes(notesData);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        if (!id) return;

        // Set up real-time listener
        const docRef = doc(db, 'customers', id as string);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setCustomer({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.log('No such customer!');
            }
        });

        // Cleanup on unmount
        return () => unsubscribe();
    }, [id]);


    useEffect(() => {
        if (!id) return;



        fetchNotes();
    }, [id]);


    // useEffect(() => {
    //     // ⚠️ Comment this out after running once!
    //     clearFirestoreDatabase();
    // }, []);

    // useEffect(() => {
    //     // ⚠️ Comment this out after running once!
    //     seedCustomers();
    // }, []);




    if (!customer) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator animating={true} color={MD2Colors.red800} />
            </View>
        );
    }


    return (
        <ScrollView className="flex-1 bg-white p-4">
            <Card>
                <Card.Content className="flex flex-row items-center justify-between gap-2">

                    <View>
                        <Avatar.Image
                            size={80}
                            source={
                                customer.image
                                    ? { uri: customer.image }
                                    : require('../../assets/avatar.png')
                            }
                            className="mb-4"
                        />
                    </View>
                    <View>
                        <Text className="text-xl font-bold mb-2">{customer.name}</Text>
                        <Text className="text-gray-500 mb-4">{customer.phone} </Text>
                        <Text className="text-gray-500 mb-4">{customer.email}</Text>
                    </View>
                    <View>
                        <IconButton
                            icon="pencil"
                            size={24}
                            onPress={() => setEditCustomerModalVisible(true)}
                        />
                    </View>

                </Card.Content>
            </Card>

            {/* Action Buttons */}
            <View className="flex-row justify-around mt-6">
                {customer.phone && <Button icon="phone" mode="contained" onPress={() => handleCall(customer.phone)}>
                    Call
                </Button>}
                {customer.whatsapp && <Button icon="whatsapp" mode="contained" onPress={() => handleWhatsApp(customer.whatsapp)}>
                    WhatsApp
                </Button>}
                {customer.email && <Button icon="email" mode="contained" onPress={() => handleEmail(customer.email)}>
                    Email
                </Button>}
            </View>
            <View className="mt-8">
                {/* Reminders Section */}
                <Card className='mb-4'>
                    <Card.Title title="Reminders" />
                    <Card.Content>
                        <Text className="text-gray-500">No reminders set. Tap here to add one.</Text>
                        {/* We’ll wire up reminders functionality later */}
                    </Card.Content>
                </Card>
                {/* Notes Section */}
                <Card className='mb-4'>
                    <Card.Title title="Notes"
                        right={() => (
                            <IconButton
                                icon="plus"
                                iconColor="#6200ee" // match your app's primary color
                                size={24}
                                onPress={() => setNewNoteModalVisible(true)}
                            />
                        )}
                    />
                    <Card.Content>
                        {notes && notes.length > 0 ? (
                            <>
                                {/* If expanded, show all notes; otherwise, show first 1-2 */}
                                {(expanded ? notes : notes.slice(0, 2)).map((note, index, arr) => (
                                    <View key={index}>
                                        <View className="flex-row items-center justify-between mb-1">
                                            {/* Note Text */}
                                            <View className="flex-1 flex-row items-cenetr">
                                                <Text className="text-gray-500 mr-2">•</Text>
                                                <TouchableOpacity
                                                    style={{ flex: 1 }}
                                                    onPress={() => {
                                                        setSelectedNote(note);
                                                        setModalVisible(true);
                                                    }}
                                                >
                                                    <Text
                                                        className="text-gray-700 flex-1"
                                                        numberOfLines={1}
                                                        ellipsizeMode="tail"
                                                    >
                                                        {note.text}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            {/* Delete Button */}
                                            <IconButton
                                                icon="delete"
                                                iconColor={MD3Colors.error50}
                                                onPress={() => handleDeleteNote(note.id)}
                                            />
                                        </View>
                                        {/* Divider below each note except the last one */}
                                        {index < arr.length - 1 && (
                                            <Divider
                                                className='mb-2'
                                                style={{ marginVertical: 4 }} />
                                        )}
                                    </View>
                                ))}

                                {/* Only render the toggle button if there are more than 2 notes */}
                                {notes.length > 2 && (
                                    <Button onPress={() => setExpanded(!expanded)} mode="text">
                                        {expanded ? 'Collapse Notes' : 'See All Notes'}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Text className="text-gray-500">No notes yet. Tap here to add one.</Text>
                        )}
                    </Card.Content>
                </Card>






                {/* Images Section */}
                <Card className='mb-4'>
                    <Card.Title title="Images" />
                    <Card.Content>
                        <Text className="text-gray-500">No images yet. Tap here to upload one.</Text>
                        {/* We’ll wire up image upload functionality later */}
                    </Card.Content>
                </Card>
            </View>
            {/* Add Note Form */}
            <NotesForm
                visible={newNoteModalVisible}
                onDismiss={() => setNewNoteModalVisible(false)}
                submitLabel="Add Note"
                type="create"
                onSubmit={async (data: { text: string }) => {
                    if (data.text.trim() && id) {
                        await createItem('customers', { text: data.text }, id as string, 'notes');
                        showSnackbar('Note added');
                        setNewNoteModalVisible(false);
                        fetchNotes();
                    }
                }}
            />

            {/* Edit Note Form */}
            <NotesForm
                visible={editNoteModalVisible}
                onDismiss={() => setEditNoteModalVisible(false)}
                submitLabel="Save Changes"
                defaultValues={{ text: selectedNote?.text || '' }}
                type="update"
                onSubmit={async (data: { text: string }) => {
                    if (data.text.trim() && id && selectedNote) {
                        try {
                            await updateItem(
                                'customers',
                                selectedNote.id,
                                { text: data.text },
                                id as string,
                                'notes'
                            );
                            setEditNoteModalVisible(false);
                            setModalVisible(false); // closes the view modal too
                            showSnackbar('Note updated');
                            fetchNotes();
                        } catch (error) {
                            console.error('Error updating note:', error);
                        }
                    }
                }}
            />



            <CustomersForm
                visible={editCustomerModalVisible}
                onDismiss={() => setEditCustomerModalVisible(false)}
                submitLabel="Save Changes"
                type="update"
                defaultValues={customer} // pre-fill with existing data
                onSubmit={async (data) => {
                    try {
                        let imageUrl = customer.image || ''; // use existing image if not updated

                        // Check if a new image was uploaded
                        if (data.image && data.image !== customer.image) {
                            const formData = new FormData();
                            formData.append('file', {
                                uri: data.image,
                                type: 'image/jpeg', // adjust as needed
                                name: 'customer_image.jpg',
                            } as any);
                            formData.append('upload_preset', cloudinaryUploadPreset);

                            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
                                method: 'POST',
                                body: formData,
                            });

                            const result = await response.json();

                            if (result.secure_url) {
                                imageUrl = result.secure_url;

                            } else {
                                throw new Error('Image upload failed.');
                            }
                        }

                        const dataToSave = {
                            ...data,
                            image: imageUrl || null,
                        };

                        await updateItem('customers', customer.id, dataToSave);
                        setEditCustomerModalVisible(false);
                        showSnackbar('Customer updated');
                        // onSnapshot handles live updates
                    } catch (error) {
                        console.error('Error updating customer:', error);
                        alert('Failed to update customer. Please try again.');
                    }
                }}
            />










            <AppSnackbar
                visible={snackbarVisible}
                message={snackbarMessage}
                onDismiss={onDismissSnackbar}
                actionLabel="Undo"
                onActionPress={() => console.log('Undo clicked!')}
            />


        </ScrollView>

    )
};


export default CustomerDeatils

