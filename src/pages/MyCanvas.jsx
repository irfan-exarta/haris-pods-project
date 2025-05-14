import { useEffect, useState } from 'react';
import axios from 'axios';
import Pods from './pods.jsx';
import LoadingScreen from '../loadingScreen/LoadingScreen.jsx'; // Ensure path is correct

function MyCanvas() {
  const [podId, setPodId] = useState(null);
  const [postData, setPostData] = useState(null);
  const [isPost, setIsPost] = useState(false);
  const [podData, setPodData] = useState(null);
  const [podGlbBuffer, setPodGlbBuffer] = useState(null);
  const [podSkyBoxBuffer, setPodSkyBoxBuffer] = useState(null);
  const [postAssets, setPostAssets] = useState(null);

  const pods = [
    {
      id: 4520,
      podDisplayImage:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/CartoonStyle/render.jpg',
      podGlbUrl:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/CartoonStyle/model.glb',
    },
    {
      id: 4521,
      podDisplayImage:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Boxing/render.jpg',
      podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Boxing/model.glb',
    },
    {
      id: 4522,
      podDisplayImage:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/CandyPop/render.jpg',
      podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/CandyPop/model.glb',
    },
    {
      id: 4523,
      podDisplayImage:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/DesertOasis/render.jpg',
      podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/DesertOasis/model.glb',
    },
    {
      id: 4524,
      podDisplayImage:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/F1Pod/render.jpg',
      podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/F1Pod/model.glb',
    },
    {
      id: 4525,
      podDisplayImage:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Modern/render.jpg',
      podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Modern/model.glb',
    },
    {
      id: 4526,
      podDisplayImage:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/OceanRetreat/render.jpg',
      podGlbUrl:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/OceanRetreat/model.glb',
    },
    {
      id: 4527,
      podDisplayImage:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Pacman/render.jpg',
      podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Pacman/model.glb',
    },
    {
      id: 4528,
      podDisplayImage:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Pod01/render.jpg',
      podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Pod01/model.glb',
    },
    {
      id: 4529,
      podDisplayImage:
        'https://object.ord1.coreweave.com/pods-bucket/haryali/test/GamePod201/render.jpg', // No new render uploaded for this index
      podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/GamePod201/model.glb', // No new GLB uploaded for this index
    },
  ];

  // Extract query parameters whenever URL changes
  useEffect(() => {
    const updateParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const extractedPodId = searchParams.get('podId') || 4520;
      setPodId(extractedPodId); // This will trigger the next useEffect
    };

    updateParams();

    // Listen for URL changes (popstate for browser navigation)
    window.addEventListener('popstate', updateParams);

    return () => {
      window.removeEventListener('popstate', updateParams);
    };
  }, []);

  // Update podId if postData includes a different podId
  useEffect(() => {
    if (isPost && postData?.podId) {
      setPodId(postData.podId);
    }
  }, [isPost, postData]);

  // Fetch Pod data when podId changes
  // useEffect(() => {
  //   if (!podId) return;

  //   async function fetchPodData() {
  //     try {
  //       const response = await axios.get(`${import.meta.env.VITE_LINK}/api/pods/${4522}`);
  //       const data = response.data;

  //       console.log('Fetched pod data:', data);

  //       setPodData(data);

  //       /////
  //       setPodGlbBuffer(
  //         'https://object.ord1.coreweave.com/pods-bucket/haryali/test/CartoonStyle/model.glb',
  //       ); /////////////////////
  //       ////////
  //       setPodSkyBoxBuffer(data.podSettingsGlobal.skyboxUrl);
  //     } catch (error) {
  //       console.error('Error fetching pod data:', error);
  //     }
  //   }

  //   fetchPodData();
  // }, [podId]); // ✅ runs every time podId changes

  useEffect(() => {
    if (!podId) return;

    async function fetchPodData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_LINK}/api/pods/${podId}`);
        const data = response.data;

        console.log('Fetched pod data:', data);
        setPodData(data);

        // Dynamically find podGlbUrl by matching podId
        const matchingPod = pods.find((p) => p.id === Number(podId));

        if (matchingPod && matchingPod.podGlbUrl) {
          setPodGlbBuffer(matchingPod.podGlbUrl);
        } else {
          console.warn('No matching podGlbUrl found for podId:', podId);
        }
        //console.log('Skybox URL from API:', data.podSettingsGlobal?.skyboxUrl);
        setPodSkyBoxBuffer(data.podSettingsGlobal?.skyboxUrl);
      } catch (error) {
        console.error('Error fetching pod data:', error);
      }
    }

    fetchPodData();
  }, [podId]);
  return (
    <div>
      {podGlbBuffer && podSkyBoxBuffer && (
        <Pods
          podData={podData}
          glbFile={podGlbBuffer}
          skyboxFile={podSkyBoxBuffer}
          postAssets={postAssets}
          Ids={postData}
          editMode={false}
        />
      )}
    </div>
  );
}

export default MyCanvas;
