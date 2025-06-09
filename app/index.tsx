// app/index.tsx

import { router } from 'expo-router';
import { useEffect } from 'react';

export default function HomeRedirect() {
  useEffect(() => {
    router.replace('/customers');
  }, []);

  return null;
}
