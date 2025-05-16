import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Pods from './pods.jsx';
import LoadingScreen from '../loadingScreen/LoadingScreen.jsx'; // Adjust path if needed
import { PodsContext } from '../context/PodsContext.jsx';

function MyCanvas() {
  const [podId, setPodId] = useState(null);
  const [postData, setPostData] = useState(null);
  const [isPost, setIsPost] = useState(false);
  const [podData, setPodData] = useState(null);
  const [podGlbBuffer, setPodGlbBuffer] = useState(null);
  const [podSkyBoxBuffer, setPodSkyBoxBuffer] = useState(null);
  const [postAssets, setPostAssets] = useState(null);

  const { pods } = useContext(PodsContext); // ✅ Using context

  // Extract podId from query params
  useEffect(() => {
    const updateParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const extractedPodId = searchParams.get('podId');
      setPodId(extractedPodId || '4519'); // fallback
      setPodId(extractedPodId);
    };

    updateParams();
    window.addEventListener('popstate', updateParams);
    return () => window.removeEventListener('popstate', updateParams);
  }, []);

  // Update podId if it's overridden by postData
  useEffect(() => {
    if (isPost && postData?.podId) {
      setPodId(postData.podId);
    }
  }, [isPost, postData]);

  // Fetch pod-specific data
  useEffect(() => {
    if (!pods || !Array.isArray(pods) || pods.length === 0) return;

    const resolvedPodId = Number(podId) || 4519; // fallback to 4519 if podId is invalid
    const matchingPodWrapper = pods.find((p) => p.value?.podId === resolvedPodId);

    if (!matchingPodWrapper) {
      console.warn('No pod found for podId:', resolvedPodId);
      return;
    }

    const matchingPod = matchingPodWrapper.value;

    setPodData(matchingPod);
    setPodGlbBuffer(matchingPod.podSettingsGlobal?.podGlbUrl || null);
    setPodSkyBoxBuffer(matchingPod.podSettingsGlobal?.skyboxUrl || null);
  }, [podId, pods]);

  return (
    <div>
      {podGlbBuffer && podSkyBoxBuffer ? (
        <Pods
          podData={podData}
          glbFile={podGlbBuffer}
          skyboxFile={podSkyBoxBuffer}
          postAssets={postAssets}
          Ids={postData}
          editMode={false}
        />
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
}

export default MyCanvas;
