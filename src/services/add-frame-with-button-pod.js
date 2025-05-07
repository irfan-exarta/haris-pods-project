import * as pc from 'playcanvas';
import postdummy from '/public/pod&post/post.json';
export function FramePod(app, data, userId) {
  if (!data) return;
  console.log(data.podData);
  console.log(postdummy);
  localStorage.setItem('postData', JSON.stringify(postdummy));
  const postData = JSON.parse(localStorage.getItem('postData'));
  const searchParams = new URLSearchParams(window.location.search);
  const userIdParam = searchParams.get('userId');
  const podParam = searchParams.get('podId');

  if (postdummy) {
    postData.userId = userIdParam;
    postData.podId = podParam;
    postData.podName = data.podData.podName;
    postData.postDisplayImage = data.podData.podDisplayImage;

    // Save the updated postData back to localStorage
    localStorage.setItem('postData', JSON.stringify(postData));
  } else {
    console.log('No postData found in localStorage.');
  }
  const frames = postData.postAssets.frames;
  frames.forEach((frameData) => {
    const { frameId, position, rotation, scale, assetUrl } = frameData;

    // 1) Create and configure the frame entity
    const frameName = `framePlane_${frameId}`;
    const framePlane = new pc.Entity(frameName);

    framePlane.setLocalPosition(position.x, position.y, position.z);
    framePlane.setLocalEulerAngles(rotation.x, rotation.y, rotation.z);
    framePlane.setLocalScale(scale.x, scale.y, scale.z);

    framePlane.addComponent('render', {
      type: 'plane',
    });

    app.root.addChild(framePlane);

    // 2) Create a unique button for this frame
    const buttonName = `frameButton_${frameId}`;
    const button = new pc.Entity(buttonName);

    button.addComponent('button'); // Assuming you have a button script
    button.addComponent('element', {
      anchor: [0.5, 0.5, 0.5, 0.5],
      width: 0.2,
      height: 0.1,
      pivot: [0.5, 0.5],
      type: pc.ELEMENTTYPE_IMAGE,
      useInput: true,
      // Placeholder texture to visualize the button
      textureAsset: null,
    });

    // Position the button near the frame, or wherever you'd like
    button.setLocalPosition(position.x, position.y - 0.7, position.z); // offset Y by -0.7
    button.setLocalScale(1, 1, 1);
    button.setLocalEulerAngles(0, rotation.y, 0); // Adjust as needed

    app.root.addChild(button);

    // 3) Load a basic button texture for the button element
    //    (Or skip if you have your own button image.)
    const buttonTextureAsset = new pc.Asset(`ButtonTexture_${frameId}`, 'texture', {
      url: '../../public/images/squaree.png',
    });
    app.assets.add(buttonTextureAsset);
    app.assets.load(buttonTextureAsset);
    buttonTextureAsset.on('load', () => {
      button.element.textureAsset = buttonTextureAsset;
    });

    // 4) Create a unique file input element for this frame
    const fileInputId = `frameFileInput_${frameId}`;
    let fileInput = document.getElementById(fileInputId);
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*,video/*';
      fileInput.id = fileInputId;
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
    }

    // 5) On button click => open file picker
    button.button.on('click', () => {
      console.log(`Frame button ${frameId} clicked`);
      fileInput.click();
    });

    // 6) Handle file selection => apply to the plane
    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      const fileType = file.type;

      // IMAGE TEXTURE CASE
      if (fileType.startsWith('image/')) {
        const newFileName = frameId.toString();
        const renamedFile = new File([file], newFileName, { type: file.type });

        const formData = new FormData();
        formData.append('file', renamedFile);
        console.log('User ID is:', userIdParam);
        formData.append('userId', userIdParam);
        formData.append('frameId', frameId);

        // Upload the file using fetch
        fetch(`${import.meta.env.VITE_LINK}/api/posts/upload`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Upload response:', data);
            const updatedFileUrl = data.fileUrl; // URL received from the upload response

            // Retrieve postData from localStorage
            const postDataJson = localStorage.getItem('postData');
            if (postDataJson) {
              let postData;
              try {
                postData = JSON.parse(postDataJson);
              } catch (error) {
                console.error('Error parsing postData:', error);
                return;
              }

              postData.postAssets.frames = postData.postAssets.frames.map((frame) => {
                // Check if the frameId matches
                if (frame.frameId === frameId) {
                  return { ...frame, assetUrl: updatedFileUrl };
                }
                return frame;
              });

              // Save the updated postData back to localStorage
              localStorage.setItem('postData', JSON.stringify(postData));

              const localStoragePostData = localStorage.getItem('postData');
              console.log('Updated postData in localStorage:', localStoragePostData);
            } else {
              console.error('No postData found in localStorage.');
            }
          })
          .catch((err) => console.error('Error during file upload:', err));
        const reader = new FileReader();
        reader.onload = function (e) {
          const dataURL = e.target.result;
          const textureAsset = new pc.Asset(`frameTexture_${frameId}_${Date.now()}`, 'texture', {
            url: dataURL,
          });

          app.assets.add(textureAsset);
          textureAsset.on('load', () => {
            const frameMaterial = new pc.StandardMaterial();
            frameMaterial.useLighting = true;
            frameMaterial.diffuseMap = textureAsset.resource;
            frameMaterial.update();

            // Apply material to this frame's plane
            if (framePlane.render) {
              framePlane.render.meshInstances.forEach((meshInstance) => {
                meshInstance.material = frameMaterial;
              });
              console.log(`Image texture applied to ${framePlane.name}`);
            }
          });

          textureAsset.on('error', (err) => {
            console.error('Error loading image texture:', err);
          });

          app.assets.load(textureAsset);
        };

        reader.readAsDataURL(file);
        fileInput.value = '';
      }
      // VIDEO TEXTURE CASE
      else if (fileType.startsWith('video/')) {
        const newFileName = frameId.toString();
        const renamedFile = new File([file], newFileName, { type: file.type });

        const formData = new FormData();
        formData.append('file', renamedFile);
        console.log('User ID is:', userIdParam);
        formData.append('userId', userIdParam);
        formData.append('frameId', frameId);

        // Upload the file using fetch
        fetch(`${import.meta.env.VITE_LINK}/api/posts/upload`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Upload response:', data);
            const updatedFileUrl = data.fileUrl; // URL received from the upload response

            // Retrieve postData from localStorage
            const postDataJson = localStorage.getItem('postData');
            if (postDataJson) {
              let postData;
              try {
                postData = JSON.parse(postDataJson);
              } catch (error) {
                console.error('Error parsing postData:', error);
                return;
              }

              postData.postAssets.frames = postData.postAssets.frames.map((frame) => {
                // Check if the frameId matches
                if (frame.frameId === frameId) {
                  return { ...frame, assetUrl: updatedFileUrl };
                }
                return frame;
              });

              // Save the updated postData back to localStorage
              localStorage.setItem('postData', JSON.stringify(postData));

              const localStoragePostData = localStorage.getItem('postData');
              console.log('Updated postData in localStorage:', localStoragePostData);
            } else {
              console.error('No postData found in localStorage.');
            }
          })
          .catch((err) => console.error('Error during file upload:', err));
        const reader = new FileReader();

        reader.onload = function (e) {
          const dataURL = e.target.result;

          // Create (or reuse) a hidden video element
          let videoElem = document.getElementById(`uploadedVideo_${frameId}`);
          if (!videoElem) {
            videoElem = document.createElement('video');
            videoElem.id = `uploadedVideo_${frameId}`;
            videoElem.loop = true;
            videoElem.muted = true;
            videoElem.autoplay = true;
            videoElem.playsInline = true;
            videoElem.crossOrigin = 'anonymous';
            videoElem.style.display = 'none';
            document.body.appendChild(videoElem);
          }

          // Set the video source to the data URL
          videoElem.src = dataURL;
          videoElem.load();

          // Create a PlayCanvas video texture
          const videoTexture = new pc.Texture(app.graphicsDevice, {
            format: pc.PIXELFORMAT_RGBA8,
            mipmaps: false,
            minFilter: pc.FILTER_LINEAR,
            magFilter: pc.FILTER_LINEAR,
            addressU: pc.ADDRESS_CLAMP_TO_EDGE,
            addressV: pc.ADDRESS_CLAMP_TO_EDGE,
          });

          // Resize the texture when video metadata is available
          videoElem.addEventListener('loadedmetadata', function () {
            videoTexture.resize(videoElem.videoWidth, videoElem.videoHeight);
          });

          videoElem.addEventListener('canplaythrough', function () {
            const frameMaterial = new pc.StandardMaterial();
            frameMaterial.useLighting = true;
            frameMaterial.diffuseMap = videoTexture;
            frameMaterial.update();

            // Apply material to this frame's plane
            if (framePlane.render) {
              framePlane.render.meshInstances.forEach((meshInstance) => {
                meshInstance.material = frameMaterial;
              });
              console.log(`Video texture applied to ${framePlane.name}`);

              // Update the video texture each frame
              app.on('update', function () {
                if (videoElem.readyState >= videoElem.HAVE_CURRENT_DATA) {
                  videoTexture.setSource(videoElem);
                }
              });
            }

            // Start playing the video
            videoElem.play().catch((err) => {
              console.error('Error playing video:', err);
            });
          });
        };

        reader.readAsDataURL(file);
        fileInput.value = '';
      }
    });
  });
}
