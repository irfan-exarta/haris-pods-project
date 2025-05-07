import * as pc from 'playcanvas';

export function Frame(app, frames, userId) {
  if (!frames) return;

  const searchParams = new URLSearchParams(window.location.search);
  const userIdParam = searchParams.get('userId');
  console.log('Frames in Frames script', frames);

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

    // if (assetUrl) {
    //   // Use the app's once('start') event to ensure the scene is fully initialized
    //   console.log(`Initial loading of asset for frame ${frameId}: ${assetUrl}`);
    //   const isVideo = /\.(mp4|webm|ogg)$/i.test(assetUrl);

    //   if (isVideo) {
    //     console.log(`Loading video texture for frame ${frameId}`);
    //   } else {
    //     // For images, try creating an Image element directly first
    //     const s3ImageUrl = 'https://object.ord1.coreweave.com/pods-bucket/123/123.png';

    //     const fetchImage = async () => {
    //       try {
    //         console.log(`Fetching image from: ${s3ImageUrl}`);
    //         const response = await fetch(s3ImageUrl, {
    //           mode: 'cors',
    //           cache: 'no-cache',
    //         });

    //         if (!response.ok) throw new Error(`Failed to fetch the image: ${response.status}`);

    //         const imageBlob = await response.blob();
    //         console.log('Image blob received:', imageBlob);

    //         const objectURL = URL.createObjectURL(imageBlob);
    //       } catch (error) {
    //         console.error('Error fetching image:', error);
    //       }
    //     };

    //     fetchImage();

    //     console.log(`Loading image texture for frame ${frameId}`);
    //   }
    // }
    if (assetUrl) {
      const isVideo = /\.(mp4|webm|ogg)$/i.test(assetUrl);

      if (isVideo) {
        console.log(`Loading video texture for frame ${frameId}: ${assetUrl}`);

        // 1. Create or reuse a hidden video element
        let videoElem = document.getElementById(`streamedVideo_${frameId}`);
        if (!videoElem) {
          videoElem = document.createElement('video');
          videoElem.id = `streamedVideo_${frameId}`;
          videoElem.src = assetUrl;
          videoElem.crossOrigin = 'anonymous';
          videoElem.loop = true;
          videoElem.muted = true;
          videoElem.autoplay = true;
          videoElem.playsInline = true;
          videoElem.style.display = 'none';
          document.body.appendChild(videoElem);
        }

        videoElem.load();

        // 2. Create PlayCanvas video texture
        const videoTexture = new pc.Texture(app.graphicsDevice, {
          format: pc.PIXELFORMAT_RGBA8,
          minFilter: pc.FILTER_LINEAR,
          magFilter: pc.FILTER_LINEAR,
          addressU: pc.ADDRESS_CLAMP_TO_EDGE,
          addressV: pc.ADDRESS_CLAMP_TO_EDGE,
        });

        // 3. Resize texture when video metadata is loaded
        videoElem.addEventListener('loadedmetadata', () => {
          videoTexture.resize(videoElem.videoWidth, videoElem.videoHeight);
        });

        // 4. Apply texture when video is ready
        videoElem.addEventListener('canplaythrough', () => {
          const frameMaterial = new pc.StandardMaterial();
          frameMaterial.useLighting = true;
          frameMaterial.diffuseMap = videoTexture;
          frameMaterial.update();

          if (framePlane.render) {
            framePlane.render.meshInstances.forEach((meshInstance) => {
              meshInstance.material = frameMaterial;
            });

            console.log(`Video texture applied to ${framePlane.name}`);
          }

          // Update the texture every frame
          app.on('update', () => {
            if (videoElem.readyState >= videoElem.HAVE_CURRENT_DATA) {
              videoTexture.setSource(videoElem);
            }
          });

          // Start the video
          videoElem.play().catch((err) => {
            console.error(`Error playing video for frame ${frameId}:`, err);
          });
        });
      } else {
        console.log(`Loading image texture for frame ${frameId}: ${assetUrl}`);

        const textureAsset = new pc.Asset(`frameTexture_${frameId}_${Date.now()}`, 'texture', {
          url: assetUrl,
        });

        app.assets.add(textureAsset);

        textureAsset.on('load', () => {
          const frameMaterial = new pc.StandardMaterial();
          frameMaterial.useLighting = true;
          frameMaterial.diffuseMap = textureAsset.resource;
          frameMaterial.update();

          if (framePlane.render) {
            framePlane.render.meshInstances.forEach((meshInstance) => {
              meshInstance.material = frameMaterial;
            });

            console.log(`Image texture applied to ${framePlane.name}`);
          }
        });

        textureAsset.on('error', (err) => {
          console.error(`Error loading image texture for frame ${frameId}:`, err);
        });

        app.assets.load(textureAsset);
      }
    }
  });
}
