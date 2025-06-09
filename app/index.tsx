// app/index.tsx

import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function HomeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customers');
  }, []);

  return null;
}
