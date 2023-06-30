import { useEffect } from 'react';

const useUserIdStorage = (): string | null => {
  if (typeof window === 'undefined') return null;

  const generateUserId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let userId = '';

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      userId += characters.charAt(randomIndex);
    }

    return userId;
  };

  useEffect(() => {
    const saveUserIdToStorage = () => {
      if (!sessionStorage.getItem('userId')) {
        sessionStorage.setItem('userId', generateUserId());
      }
    };

    saveUserIdToStorage();
  }, []);

  return sessionStorage.getItem('userId');
};

export default useUserIdStorage;