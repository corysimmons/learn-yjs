'use client'
import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

const useFingerprintUsername = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const generateUsername = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      // Generate a reproducible username based on the fingerprint
      const customUsername = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
        separator: ' ',
        style: 'capital',
        seed: result.visitorId // Use the fingerprint hash as a seed
      });

      setUsername(customUsername);
    };

    generateUsername();
  }, []);

  return username;
};

export default useFingerprintUsername;
