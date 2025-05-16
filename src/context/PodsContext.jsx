// PodsContext.js
import React, { createContext, useState, useEffect } from 'react';

export const PodsContext = createContext();

export const PodsProvider = ({ children }) => {
  const [pods, setPods] = useState([]);

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await fetch(
          'https://amjad-pod-backend.tenant-7654b5-asrpods.ord1.ingress.coreweave.cloud/api/pods',
        );
        const data = await response.json();
        setPods(data.documents);
      } catch (error) {
        console.error('Failed to fetch pods:', error);
      }
    };

    fetchPods();
  }, []);

  console.log('Pods::::::', pods);
  return <PodsContext.Provider value={{ pods, setPods }}>{children}</PodsContext.Provider>;
};
