import AppSnackbar from '@/componets/AppSnackbar';
import { NotesForm } from '@/componets/NotesForm';
import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Divider, IconButton, MD2Colors, MD3Colors, Portal, Text } from 'react-native-paper';
import { db } from '../../lib/firebase';
import { createItem, deleteItem, updateItem } from '../../lib/firstoreFunctions';
import { handleCall, handleEmail, handleWhatsApp } from '../../lib/linkingHelpers';



const CustomerDeatils = ({ }) => {

    const { id } = useLocalSearchParams();
    const [customer, setCustomer] = useState<any>(null);
    const [expanded, setExpanded] = useState(false);
    const [selectedNote, setSelectedNote] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
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
        const fetchCustomer = async () => {
            const docRef = doc(db, 'customers', id as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCustomer({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.log('No such customer!');
            }
        };

        fetchCustomer();
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
                <Card.Content className="items-center">
                    <Avatar.Image
                        size={80}
                        source={
                            customer.image
                                ? { uri: customer.image }
                                : require('../../assets/avatar.png')
                        }
                        className="mb-4"
                    />
                    <Text className="text-xl font-bold mb-2">{customer.name}</Text>
                    <Text className="text-gray-500 mb-4">{customer.phone}</Text>
                    <Text className="text-gray-500 mb-4">{customer.email}</Text>
                </Card.Content>
            </Card>

            {/* Action Buttons */}
            <View className="flex-row justify-around mt-6">
                <Button icon="phone" mode="contained" onPress={() => handleCall(customer.phone)}>
                    Call
                </Button>
                <Button icon="whatsapp" mode="contained" onPress={() => handleWhatsApp(customer.whatsapp)}>
                    WhatsApp
                </Button>
                <Button icon="email" mode="contained" onPress={() => handleEmail(customer.email)}>
                    Email
                </Button>
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
            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 20,
                        margin: 20,
                        borderRadius: 10,
                    }}
                >
                    {selectedNote && (
                        <>
                            <Text className="text-lg font-semibold mb-2">Note</Text>
                            <Text className="mb-4">{selectedNote.text}</Text>
                            <Button
                                icon="pencil"
                                mode="contained"
                                onPress={() => {
                                    setEditNoteText(selectedNote.text);
                                    setEditNoteModalVisible(true);
                                }}
                            >
                                Edit
                            </Button>
                        </>
                    )}
                </Modal>
            </Portal>






            <NotesForm
                submitLabel="Add Note"
                onSubmit={async (data) => {
                    if (data.text.trim() && id) {
                        await createItem('customers', { text: data.text }, id as string, 'notes');
                        showSnackbar('Note added');
                        setNewNoteModalVisible(false);
                        fetchNotes();
                    }
                }}
            />




            <NotesForm
                submitLabel="Save Changes"
                defaultValues={{ text: selectedNote?.text || '' }}
                onSubmit={async (data) => {
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

