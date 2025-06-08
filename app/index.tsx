// app/customers/index.tsx

import CustomersForm from '@/componets/CustomersForm';
import { Link } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Avatar, Button, Card, Divider, FAB, IconButton, Portal, Text } from 'react-native-paper';
import { twMerge } from 'tailwind-merge';
import { db } from '../lib/firebase'; // adjust path if needed
import { createItem, uploadImageAndGetUrl } from '../lib/firstoreFunctions';
import { handleCall, handleEmail, handleWhatsApp } from '../lib/linkingHelpers';










export default function CustomersScreen() {
  const [activeTab, setActiveTab] = useState<'active' | 'potential'>('active');

  const [customers, setCustomers] = useState<any[]>([]);
  const [newCustomerModalVisible, setNewCustomerModalVisible] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    whatsapp: '',
    image: '',
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const onDismissSnackbar = () => {
    setSnackbarVisible(false);
  };


  const handleNewCustomerChange = (field: keyof typeof newCustomer, value: string) => {
    setNewCustomer(prev => ({ ...prev, [field]: value }));
  };


  const [open, setOpen] = useState(false);

  const onStateChange = ({ open }: { open: boolean }) => setOpen(open);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'customers'), snapshot => {
      const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(customers);
    });

    return unsubscribe;
  }, []);


  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-4">
        <Text variant="headlineMedium" className="font-bold">
          Customers
        </Text>

        {/* Toggle */}
        <View className="flex-row justify-between mt-4 bg-gray-200 rounded-full p-1">
          <Button
            mode={activeTab === 'active' ? 'contained' : 'text'}
            onPress={() => setActiveTab('active')}
            className={twMerge('flex-1 rounded-full')}
          >
            Active
          </Button>
          <Button
            mode={activeTab === 'potential' ? 'contained' : 'text'}
            onPress={() => setActiveTab('potential')}
            className={twMerge('flex-1 rounded-full')}
          >
            Potential
          </Button>
        </View>
      </View>

      {/* Divider */}
      <Divider className="my-2" />

      {/* Customer List */}
      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        renderItem={({ item }) => {

          return (
            <Link href={`./customers/${item.id}`} asChild>
              <Card className="mb-3">
                <Card.Content className="flex-row items-center justify-between">
                  <View className='flex flex-row items-center gap-3'>
                    <Avatar.Image
                      size={30}
                      source={item.image ? { uri: item.image } : require('../assets/avatar.png')}
                    />

                    <View>
                      <Text className="font-semibold">{item.name}</Text>
                      <Text className="text-gray-500">{item.phone}</Text>
                    </View>
                  </View>
                  <View className="flex-row space-x-2">
                    {item.phone && <IconButton icon="phone" size={20} onPress={() => handleCall(item.phone)} />}

                    {item.whatsapp && <IconButton icon="whatsapp" size={20} onPress={() => handleWhatsApp(item.whatsapp)} />}
                    {item.email && <IconButton icon="email" size={20} onPress={() => handleEmail(item.email || '')} />}
                  </View>
                </Card.Content>
              </Card>
            </Link>
          )
        }}
      />



      {/* FAB */}

      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? 'close' : 'plus'}
          actions={[
            {
              icon: 'account-plus',
              label: 'New Customer',
              onPress: () => setNewCustomerModalVisible(true),
            },
            // Add more actions later as needed
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // You can add a global action here if needed
            }
          }}
        />
      </Portal>

      <CustomersForm
        visible={newCustomerModalVisible}
        onDismiss={() => setNewCustomerModalVisible(false)}
        submitLabel="Add Customer"
        type="create"
        onSubmit={async (data) => {
          try {
            let imageUrl = '';

            // If data.image exists, upload it to Firebase Storage
            if (data.image) {
              imageUrl = await uploadImageAndGetUrl(data.image, 'customer_images');
            }

            const dataToSave = {
              ...data,
              image: imageUrl || null,
            };

            if (dataToSave.name.trim()) {
              await createItem('customers', dataToSave);
              showSnackbar('Customer added');
              setNewCustomerModalVisible(false);
              // onSnapshot handles refreshing the customer list!
            }
          } catch (error) {
            console.error('Error adding customer:', error);
            alert('Failed to add customer. Please try again.');
          }
        }}
      />







    </View>
  );
}
