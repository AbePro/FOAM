import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';


import axios from 'axios';
import { db, } from './firebase';

export const deleteItem = async (
    collectionName: string,
    docId: string,
    parentId?: string,
    subcollectionName?: string
) => {
    try {
        let docRef;

        // If subcollection is provided, build subcollection path
        if (parentId && subcollectionName) {
            docRef = doc(db, collectionName, parentId, subcollectionName, docId);
        } else {
            docRef = doc(db, collectionName, docId);
        }

        await deleteDoc(docRef);
        console.log(`Deleted item ${docId} from ${collectionName}${subcollectionName ? '/' + subcollectionName : ''}`);
    } catch (error) {
        console.error('Error deleting item:', error);
    }
};




/**
 * Creates a new document in Firestore.
 * @param collectionName - The top-level collection name (e.g. 'customers')
 * @param data - The object to store (text, createdAt, etc.)
 * @param parentId - Optional. If creating inside a subcollection, specify the parent doc ID.
 * @param subcollectionName - Optional. If creating inside a subcollection, specify the subcollection name.
 */
export const createItem = async (
    collectionName: string,
    data: object,
    parentId?: string,
    subcollectionName?: string
) => {
    try {
        let collectionRef;

        if (parentId && subcollectionName) {
            collectionRef = collection(db, collectionName, parentId, subcollectionName);
        } else {
            collectionRef = collection(db, collectionName);
        }

        await addDoc(collectionRef, {
            ...data,
            createdAt: serverTimestamp()
        });
        console.log('Item created successfully');
    } catch (error) {
        console.error('Error creating item:', error);
    }
};




export const updateItem = async (
    collectionName: string,
    docId: string,
    data: object,
    parentId?: string,
    subcollectionName?: string
) => {
    try {
        let docRef;

        if (parentId && subcollectionName) {
            docRef = doc(db, collectionName, parentId, subcollectionName, docId);
        } else {
            docRef = doc(db, collectionName, docId);
        }

        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
        console.log('Item updated successfully');
    } catch (error) {
        console.error('Error updating item:', error);
    }
};





/**
 * Uploads an image to Firebase Storage and returns its download URL.
 * @param uri - The local URI of the image.
 * @param folderName - The folder in Firebase Storage (e.g. 'customer_images').
 * @returns The download URL of the uploaded image.
 */


export const uploadImageAndGetUrl = async (uri: string) => {
    try {
        console.log('Image Upload Started');

        // Convert local URI to Blob or Base64 (Expo has FileSystem and fetch for this)
        const formData = new FormData();
        formData.append('file', {
            uri,
            type: 'image/jpeg', // or 'image/png'
            name: 'upload.jpg',
        } as any);
        formData.append('upload_preset', 'YOUR_UNSIGNED_UPLOAD_PRESET'); // from Cloudinary settings

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`;

        const response = await axios.post(cloudinaryUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Cloudinary upload response:', response.data);

        return response.data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

