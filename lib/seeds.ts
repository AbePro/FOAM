import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const collectionsToDelete = ['customers', 'orders', 'products']; // Add all top-level collections you have

export async function clearFirestoreDatabase() {
    for (const colName of collectionsToDelete) {
        const colSnapshot = await getDocs(collection(db, colName));

        for (const docSnap of colSnapshot.docs) {
            // If the doc has subcollections, delete them too (not automatic)
            // e.g. await deleteSubcollections(docSnap.ref);
            await deleteDoc(doc(db, colName, docSnap.id));
            console.log(`Deleted ${colName} doc: ${docSnap.id}`);
        }
    }

    console.log('Database cleared!');
}


const sampleNotes = [
    "Short note.",
    "A bit longer note that still fits comfortably on one line.",
    "This is a longer note intended to simulate a more realistic scenario where a user might have written a multi-sentence note with details that might extend beyond a single line in the app UI. It includes multiple sentences and covers multiple lines when displayed without truncation.",
    "Reminder: Follow up with the customer regarding the new order next week.",
    "Call the customer to confirm details on the upcoming meeting and bring all necessary documentation."
];


const customers = [
    { name: 'Chaim', phone: '9177765607', email: 'chaim@example.com', whatsapp: '9177765607', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
    { name: 'Moshe', phone: '9171234567', email: 'moshe@example.com', whatsapp: '9171234567' },
    { name: 'Mendy', phone: '9178884321', email: 'mendy@example.com', whatsapp: '9178884321', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
    { name: 'Yossi', phone: '9175559988', email: 'yossi@example.com', whatsapp: '9175559988' },
    { name: 'Avrumi', phone: '9179991111', email: 'avrumi@example.com', whatsapp: '9179991111' },
    { name: 'Levi', phone: '9172233445', email: 'levi@example.com', whatsapp: '9172233445' },
    { name: 'Shlomo', phone: '9173344556', email: 'shlomo@example.com', whatsapp: '9173344556' },
    { name: 'David', phone: '9174455667', email: 'david@example.com', whatsapp: '9174455667', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
    { name: 'Sara', phone: '9175566778', email: 'sara@example.com', whatsapp: '9175566778' },
    { name: 'Esther', phone: '9176677889', email: 'esther@example.com', whatsapp: '9176677889' },
    { name: 'Rachel', phone: '9177788990', email: 'rachel@example.com', whatsapp: '9177788990' },
    { name: 'Miriam', phone: '9178899001', email: 'miriam@example.com', whatsapp: '9178899001', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
    { name: 'Nechama', phone: '9179900112', email: 'nechama@example.com', whatsapp: '9179900112' },
    { name: 'Yehuda', phone: '9171011122', email: 'yehuda@example.com', whatsapp: '9171011122' },
    { name: 'Shimon', phone: '9172022233', email: 'shimon@example.com', whatsapp: '9172022233', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
    { name: 'Reuven', phone: '9173033344', email: 'reuven@example.com', whatsapp: '9173033344' },
    { name: 'Gershon', phone: '9174044455', email: 'gershon@example.com', whatsapp: '9174044455', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
    { name: 'Tamar', phone: '9175055566', email: 'tamar@example.com', whatsapp: '9175055566' },
    { name: 'Chaya', phone: '9176066677', email: 'chaya@example.com', whatsapp: '9176066677', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
    { name: 'Eliyahu', phone: '9177077788', email: 'eliyahu@example.com', whatsapp: '9177077788' },
];


export async function seedCustomers() {
    for (const customer of customers) {
        // Add the customer
        const customerRef = await addDoc(collection(db, 'customers'), {
            ...customer,
            createdAt: serverTimestamp()
        });
        console.log(`Customer ${customer.name} added with ID: ${customerRef.id}`);

        // Generate random number of notes (1-5)
        const notesCount = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < notesCount; i++) {
            const randomNote = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];
            await addDoc(collection(db, 'customers', customerRef.id, 'notes'), {
                text: randomNote,
                createdAt: serverTimestamp()
            });
            console.log(`Note added for ${customer.name}: ${randomNote}`);
        }
    }

    console.log('Customers and notes seeded!');
}