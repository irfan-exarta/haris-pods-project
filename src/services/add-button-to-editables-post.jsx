// import * as pc from 'playcanvas';

// /* ────────────────────────────────────────────────────────────────────────────
//    0.  CORS‑safe fetch helpers
//    ───────────────────────────────────────────────────────────────────────── */

// async function loadTextureCrossOrigin(app, url, assetName) {
//   const res = await fetch(url, { mode: 'cors' });
//   const blob = await res.blob(); // image → Blob
//   const blobUrl = URL.createObjectURL(blob);

//   const tex = new pc.Asset(assetName, 'texture', { url: blobUrl });
//   app.assets.add(tex);

//   return new Promise((resolve, reject) => {
//     tex.once('load', () => resolve(tex));
//     tex.once('error', reject);
//     tex.once('remove', () => URL.revokeObjectURL(blobUrl));
//     app.assets.load(tex);
//   });
// }

// /* GLB with the same trick -------------------------------------------------- */
// async function loadGlbCrossOrigin(app, url, assetName) {
//   const res = await fetch(url, { mode: 'cors' });
//   const arr = await res.arrayBuffer();
//   const blob = new Blob([arr], { type: 'model/gltf-binary' });
//   const blobUrl = URL.createObjectURL(blob);

//   const glb = new pc.Asset(assetName, 'container', { url: blobUrl });
//   app.assets.add(glb);

//   return new Promise((resolve, reject) => {
//     glb.once('load', () => resolve(glb));
//     glb.once('error', reject);
//     glb.once('remove', () => URL.revokeObjectURL(blobUrl));
//     app.assets.load(glb);
//   });
// }

// /* Video helper with the same CORS protection ---------------------------- */
// async function loadVideoCrossOrigin(app, url, assetId) {
//   // Fetch the video with CORS handling
//   const res = await fetch(url, { mode: 'cors' });
//   const blob = await res.blob();
//   const blobUrl = URL.createObjectURL(blob);

//   // Create video element
//   const videoId = `video_${assetId || Date.now()}`;
//   const videoElem = document.createElement('video');
//   videoElem.id = videoId;
//   videoElem.src = blobUrl;
//   videoElem.loop = true;
//   videoElem.muted = true; // Start muted to allow autoplay
//   videoElem.autoplay = true;
//   videoElem.playsInline = true;
//   videoElem.crossOrigin = 'anonymous';
//   videoElem.style.display = 'none';
//   document.body.appendChild(videoElem);

//   // Create a PlayCanvas video texture
//   const videoTexture = new pc.Texture(app.graphicsDevice, {
//     format: pc.PIXELFORMAT_RGBA8,
//     mipmaps: false,
//     minFilter: pc.FILTER_LINEAR,
//     magFilter: pc.FILTER_LINEAR,
//     addressU: pc.ADDRESS_CLAMP_TO_EDGE,
//     addressV: pc.ADDRESS_CLAMP_TO_EDGE,
//   });

//   // Wait for video metadata to load
//   await new Promise((resolve) => {
//     if (videoElem.readyState >= 1) {
//       resolve();
//     } else {
//       videoElem.addEventListener('loadedmetadata', resolve, { once: true });
//     }
//   });

//   // Resize texture to match video dimensions
//   videoTexture.resize(videoElem.videoWidth, videoElem.videoHeight);

//   // Initial texture source setting
//   videoTexture.setSource(videoElem);

//   // Create update function for per-frame texture upload
//   const updateVideoTexture = () => {
//     if (videoElem.readyState >= 2) {
//       // HAVE_CURRENT_DATA or higher
//       videoTexture.upload();
//     }
//   };

//   // Start the video
//   try {
//     await videoElem.play();
//   } catch (err) {
//     console.warn('Autoplay prevented, will try on user interaction:', err);
//     const playOnInteraction = () => {
//       videoElem.play().catch((e) => console.error('Video play error:', e));
//       document.removeEventListener('click', playOnInteraction);
//       document.removeEventListener('touchstart', playOnInteraction);
//     };
//     document.addEventListener('click', playOnInteraction, { once: true });
//     document.addEventListener('touchstart', playOnInteraction, { once: true });
//   }

//   // Register the update callback
//   app.on('update', updateVideoTexture);

//   // Create cleanup function
//   const cleanup = () => {
//     app.off('update', updateVideoTexture);
//     if (videoElem.parentNode) {
//       videoElem.pause();
//       videoElem.parentNode.removeChild(videoElem);
//     }
//     URL.revokeObjectURL(blobUrl);
//   };

//   return { texture: videoTexture, cleanup, videoElem };
// }

// /* ────────────────────────────────────────────────────────────────────────────
//    1.  Main entry
//    ───────────────────────────────────────────────────────────────────────── */

// export function AddButtonToEditablesPost(app, camera, model) {
//   const raw = localStorage.getItem('postData');

//   // 2. Parse it back to an object (fall back to empty object if nothing there)
//   const postData = raw ? JSON.parse(raw) : {};
//   console.log(postData);

//   const frames = postData.postAssets.frames || [];
//   const assets3d = postData.postAssets.Assets3d || [];

//   /* grab the "editable" container (same as before) ------------------------ */
//   const pod = model;
//   const editable = pod;
//   if (!editable) {
//     console.warn('[AddAssets] editable container not found');
//     return;
//   }

//   /* quick name → entity table -------------------------------------------- */
//   const childByName = {};
//   editable.children.forEach((ch) => (childByName[ch.name] = ch));

//   /* parse "…url‑with‑dashes‑ParentName" ---------------------------------- */
//   const splitUrl = (full) => {
//     const i = full.lastIndexOf('-');
//     return i === -1
//       ? { url: full, parent: null }
//       : { url: full.slice(0, i), parent: full.slice(i + 1) };
//   };

//   /* add mesh collision so you can pick the new objects later ------------- */
//   const addPhysics = (e) => {
//     e.findComponents('render').forEach((r) => {
//       const ent = r.entity;
//       if (!ent.collision) ent.addComponent('collision', { type: 'mesh', renderAsset: r.asset });
//       if (!ent.rigidbody) ent.addComponent('rigidbody', { type: 'static' });
//     });
//   };

//   /* async IIFE so we can use await inside -------------------------------- */
//   (async () => {
//     /* ───── Frames (image or video placed inside Frame.glb) ───────────── */
//     for (const F of frames) {
//       const { url: assetUrl, parent: parentName } = splitUrl(F.assetUrl);
//       const parent = childByName[parentName];
//       if (!parent) {
//         console.warn(`[AddAssets] parent "${parentName}" not found for frame`);
//         continue;
//       }

//       /* 1 ▸ create a 1×1 plane --------------------------------------------------- */
//       const ent = new pc.Entity('framePlane');
//       ent.addComponent('render', { type: 'plane' });

//       /* 2 ▸ build a material (image or video) ----------------------------------- */
//       const mat = new pc.StandardMaterial();
//       mat.useLighting = false; // keep colours true‑to‑file

//       const isVideo = /\.(mp4|webm|mov)$/i.test(assetUrl);
//       try {
//         if (isVideo) {
//           /* ─── video ─── */
//           console.log(`[AddAssets] Loading video for frame: ${assetUrl}`);

//           const { texture, cleanup } = await loadVideoCrossOrigin(
//             app,
//             assetUrl,
//             F.frameId || Date.now(),
//           );

//           mat.diffuseMap = texture; // put video on the plane
//           ent.on('destroy', cleanup); // tidy up when the plane is removed
//         } else {
//           /* ─── image ─── */
//           console.log(`[AddAssets] Loading image for frame: ${assetUrl}`);

//           const tex = await loadTextureCrossOrigin(
//             app,
//             assetUrl,
//             `frameTex_${F.frameId || Date.now()}`,
//           );

//           mat.diffuseMap = tex.resource;
//         }
//         mat.update();
//       } catch (err) {
//         console.error('[AddAssets] texture load failed:', err);
//         continue; // skip this asset but keep going
//       }

//       ent.render.material = mat;

//       /* 3 ▸ position, rotation, scale (already saved in F) ---------------------- */
//       ent.setLocalPosition(F.position.x, F.position.y, F.position.z);
//       ent.setLocalEulerAngles(F.rotation.x, F.rotation.y, F.rotation.z);
//       ent.setLocalScale(F.scale.x, F.scale.y, F.scale.z);

//       /* 4 ▸ physics / bookkeeping ---------------------------------------------- */
//       addPhysics(ent); // <- your existing helper
//       parent.addChild(ent);
//     }

//     /* ───── 3‑D Assets (external GLB) ─────────────────────────────────── */
//     for (const A of assets3d) {
//       const { url: modelUrl, parent: parentName } = splitUrl(A.Asset3dUrl);
//       const parent = childByName[parentName];
//       if (!parent) {
//         console.warn(`[AddAssets] parent "${parentName}" not found for asset`);
//         continue;
//       }

//       try {
//         const glb = await loadGlbCrossOrigin(app, modelUrl, `asset3d_${A.assetId || Date.now()}`);
//         const ent = glb.resource.instantiateRenderEntity();

//         ent.setLocalPosition(A.position.x, A.position.y, A.position.z);
//         ent.setLocalEulerAngles(A.rotation.x, A.rotation.y, A.rotation.z);
//         ent.setLocalScale(A.scale.x, A.scale.y, A.scale.z);

//         addPhysics(ent);
//         parent.addChild(ent);
//       } catch (err) {
//         console.error('[AddAssets] 3‑D asset failed:', err);
//       }
//     }

//     console.log(`[AddAssets] placed ${frames.length} frame(s) + ${assets3d.length} model(s)`);
//   })();
// }
import * as pc from 'playcanvas';

/* ────────────────────────────────────────────────────────────────────────────
   0.  CORS‑safe fetch helpers
   ───────────────────────────────────────────────────────────────────────── */

async function loadTextureCrossOrigin(app, url, assetName) {
  const res = await fetch(url, { mode: 'cors' });
  const blob = await res.blob(); // image → Blob
  const blobUrl = URL.createObjectURL(blob);

  const tex = new pc.Asset(assetName, 'texture', { url: blobUrl });
  app.assets.add(tex);

  return new Promise((resolve, reject) => {
    tex.once('load', () => resolve(tex));
    tex.once('error', reject);
    tex.once('remove', () => URL.revokeObjectURL(blobUrl));
    app.assets.load(tex);
  });
}

/* GLB with the same trick -------------------------------------------------- */
async function loadGlbCrossOrigin(app, url, assetName) {
  const res = await fetch(url, { mode: 'cors' });
  const arr = await res.arrayBuffer();
  const blob = new Blob([arr], { type: 'model/gltf-binary' });
  const blobUrl = URL.createObjectURL(blob);

  const glb = new pc.Asset(assetName, 'container', { url: blobUrl });
  app.assets.add(glb);

  return new Promise((resolve, reject) => {
    glb.once('load', () => resolve(glb));
    glb.once('error', reject);
    glb.once('remove', () => URL.revokeObjectURL(blobUrl));
    app.assets.load(glb);
  });
}

/* Video helper with the same CORS protection ---------------------------- */
async function loadVideoCrossOrigin(app, url, assetId) {
  // Fetch the video with CORS handling
  const res = await fetch(url, { mode: 'cors' });
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  // Create video element
  const videoId = `video_${assetId || Date.now()}`;
  const videoElem = document.createElement('video');
  videoElem.id = videoId;
  videoElem.src = blobUrl;
  videoElem.loop = true;
  videoElem.muted = true; // Start muted to allow autoplay
  videoElem.autoplay = true;
  videoElem.playsInline = true;
  videoElem.crossOrigin = 'anonymous';
  videoElem.style.display = 'none';
  document.body.appendChild(videoElem);

  // Create a PlayCanvas video texture
  const videoTexture = new pc.Texture(app.graphicsDevice, {
    format: pc.PIXELFORMAT_RGBA8,
    mipmaps: false,
    minFilter: pc.FILTER_LINEAR,
    magFilter: pc.FILTER_LINEAR,
    addressU: pc.ADDRESS_CLAMP_TO_EDGE,
    addressV: pc.ADDRESS_CLAMP_TO_EDGE,
  });

  // Wait for video metadata to load
  await new Promise((resolve) => {
    if (videoElem.readyState >= 1) {
      resolve();
    } else {
      videoElem.addEventListener('loadedmetadata', resolve, { once: true });
    }
  });

  // Resize texture to match video dimensions
  videoTexture.resize(videoElem.videoWidth, videoElem.videoHeight);

  // Initial texture source setting
  videoTexture.setSource(videoElem);

  // Create update function for per-frame texture upload
  const updateVideoTexture = () => {
    if (videoElem.readyState >= 2) {
      // HAVE_CURRENT_DATA or higher
      videoTexture.upload();
    }
  };

  // Start the video
  try {
    await videoElem.play();
  } catch (err) {
    console.warn('Autoplay prevented, will try on user interaction:', err);
    const playOnInteraction = () => {
      videoElem.play().catch((e) => console.error('Video play error:', e));
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('touchstart', playOnInteraction);
    };
    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });
  }

  // Register the update callback
  app.on('update', updateVideoTexture);

  // Create cleanup function
  const cleanup = () => {
    app.off('update', updateVideoTexture);
    if (videoElem.parentNode) {
      videoElem.pause();
      videoElem.parentNode.removeChild(videoElem);
    }
    URL.revokeObjectURL(blobUrl);
  };

  return { texture: videoTexture, cleanup, videoElem };
}

/* ────────────────────────────────────────────────────────────────────────────
   1.  Text rotation properties based on parent wall/floor/roof
   ───────────────────────────────────────────────────────────────────────── */

// Define correct text rotations for each surface
const TEXT_WALL_PROPS = {
  Back_Left_Wall: { rotation: [0, -180, 0] },
  Back_Right_Wall: { rotation: [0, -90, 0] },
  Front_Right_Wall: { rotation: [0, 0, 0] },
  Front_Left_Wall: { rotation: [0, 90, 0] },
  Floor: { rotation: [-90, 0, 0] },
  Roof: { rotation: [90, 0, 0] },
};

/* ────────────────────────────────────────────────────────────────────────────
   2.  Main entry
   ───────────────────────────────────────────────────────────────────────── */

export function AddButtonToEditablesPost(app, camera, model) {
  // Load the font asset early to ensure it's available when needed
  const fontAsset = new pc.Asset('ASTERA v2', 'font', {
    url: '/public/fonts/ASTERA v2.json',
  });
  app.assets.add(fontAsset);
  app.assets.load(fontAsset);

  // Log font loading status for debugging
  fontAsset.on('load', () => {
    console.log('[AddAssets] Font asset loaded successfully');
  });

  fontAsset.on('error', (err) => {
    console.error('[AddAssets] Error loading font asset:', err);
  });

  const raw = localStorage.getItem('postData');

  // Parse it back to an object (fall back to empty object if nothing there)
  const postData = raw ? JSON.parse(raw) : {};
  console.log(postData);

  const frames = postData.postAssets?.frames || [];
  const assets3d = postData.postAssets?.Assets3d || [];
  const textAssets = postData.postAssets?.textAssets || [];

  /* grab the "editable" container (same as before) ------------------------ */
  const pod = model;
  const editable = pod;
  if (!editable) {
    console.warn('[AddAssets] editable container not found');
    return;
  }

  /* quick name → entity table -------------------------------------------- */
  const childByName = {};
  editable.children.forEach((ch) => (childByName[ch.name] = ch));

  /* parse "…url‑with‑dashes‑ParentName" ---------------------------------- */
  const splitUrl = (full) => {
    const i = full.lastIndexOf('-');
    return i === -1
      ? { url: full, parent: null }
      : { url: full.slice(0, i), parent: full.slice(i + 1) };
  };

  /* add mesh collision so you can pick the new objects later ------------- */
  const addPhysics = (e) => {
    e.findComponents('render').forEach((r) => {
      const ent = r.entity;
      if (!ent.collision) ent.addComponent('collision', { type: 'mesh', renderAsset: r.asset });
      if (!ent.rigidbody) ent.addComponent('rigidbody', { type: 'static' });
    });
  };

  /* Helper function to parse textFont format (#rrggbb-size) -------------- */
  const parseTextFont = (textFont) => {
    const [colorHex, sizeStr] = textFont.split('-');
    return {
      color: colorHex || '#ff0000', // Default to red if not provided
      fontSize: parseFloat(sizeStr) || 0.8, // Default to 0.8 if not provided
    };
  };

  /* Helper function to convert hex color to pc.Color -------------------- */
  const hexToRgb = (hex) => {
    // Remove # if present
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
    const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
    const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
    return new pc.Color(r, g, b);
  };

  /* async IIFE so we can use await inside -------------------------------- */
  (async () => {
    /* ───── Frames (image or video placed inside Frame.glb) ───────────── */
    for (const F of frames) {
      const { url: assetUrl, parent: parentName } = splitUrl(F.assetUrl);
      const parent = childByName[parentName];
      if (!parent) {
        console.warn(`[AddAssets] parent "${parentName}" not found for frame`);
        continue;
      }

      /* 1 ▸ create a 1×1 plane --------------------------------------------------- */
      const ent = new pc.Entity('framePlane');
      ent.addComponent('render', { type: 'plane' });

      /* 2 ▸ build a material (image or video) ----------------------------------- */
      const mat = new pc.StandardMaterial();
      mat.useLighting = false; // keep colours true‑to‑file

      const isVideo = /\.(mp4|webm|mov)$/i.test(assetUrl);
      try {
        if (isVideo) {
          /* ─── video ─── */
          console.log(`[AddAssets] Loading video for frame: ${assetUrl}`);

          const { texture, cleanup } = await loadVideoCrossOrigin(
            app,
            assetUrl,
            F.frameId || Date.now(),
          );

          mat.diffuseMap = texture; // put video on the plane
          ent.on('destroy', cleanup); // tidy up when the plane is removed
        } else {
          /* ─── image ─── */
          console.log(`[AddAssets] Loading image for frame: ${assetUrl}`);

          const tex = await loadTextureCrossOrigin(
            app,
            assetUrl,
            `frameTex_${F.frameId || Date.now()}`,
          );

          mat.diffuseMap = tex.resource;
        }
        mat.update();
      } catch (err) {
        console.error('[AddAssets] texture load failed:', err);
        continue; // skip this asset but keep going
      }

      ent.render.material = mat;

      /* 3 ▸ position, rotation, scale (already saved in F) ---------------------- */
      ent.setLocalPosition(F.position.x, F.position.y, F.position.z);
      ent.setLocalEulerAngles(F.rotation.x, F.rotation.y, F.rotation.z);
      ent.setLocalScale(F.scale.x, F.scale.y, F.scale.z);

      /* 4 ▸ physics / bookkeeping ---------------------------------------------- */
      addPhysics(ent); // <- your existing helper
      parent.addChild(ent);
    }

    /* ───── 3‑D Assets (external GLB) ─────────────────────────────────── */
    for (const A of assets3d) {
      const { url: modelUrl, parent: parentName } = splitUrl(A.Asset3dUrl);
      const parent = childByName[parentName];
      if (!parent) {
        console.warn(`[AddAssets] parent "${parentName}" not found for asset`);
        continue;
      }

      try {
        const glb = await loadGlbCrossOrigin(app, modelUrl, `asset3d_${A.assetId || Date.now()}`);
        const ent = glb.resource.instantiateRenderEntity();

        ent.setLocalPosition(A.position.x, A.position.y, A.position.z);
        ent.setLocalEulerAngles(A.rotation.x, A.rotation.y, A.rotation.z);
        ent.setLocalScale(A.scale.x, A.scale.y, A.scale.z);

        addPhysics(ent);
        parent.addChild(ent);
      } catch (err) {
        console.error('[AddAssets] 3‑D asset failed:', err);
      }
    }

    /* ───── Text Assets ───────────────────────────────────────────────── */
    for (const T of textAssets) {
      const parentName = T.textAssetName;
      const parent = childByName[parentName];

      if (!parent) {
        console.warn(`[AddAssets] parent "${parentName}" not found for text asset`);
        continue;
      }

      try {
        // Parse text font string to get color and font size
        const { color, fontSize } = parseTextFont(T.textFont);

        // Create text entity
        const textEntity = new pc.Entity(`text-${T.textAssetId || Date.now()}`);

        // Add text element component
        textEntity.addComponent('element', {
          type: 'text',
          text: T.textAssetText,
          fontSize: fontSize, // Scale font size appropriately
          fontAsset: fontAsset,
          color: hexToRgb(color),
          pivot: new pc.Vec2(0.5, 0.5),
          width: 2,
          height: 1,
          alignment: [0.5, 0.5], // Center alignment (can be adjusted based on T.textAssetAlignment)
        });

        // Use position, rotation and scale from the JSON
        textEntity.setLocalPosition(
          T.textAssetPosition.x,
          T.textAssetPosition.y,
          T.textAssetPosition.z,
        );

        // If rotation is provided in the JSON, use it
        if (T.textAssetRotation) {
          textEntity.setLocalEulerAngles(
            T.textAssetRotation.x,
            T.textAssetRotation.y,
            T.textAssetRotation.z,
          );
        } else {
          // Otherwise use the predefined rotation based on the parent wall/surface
          const rotation = TEXT_WALL_PROPS[parentName]?.rotation || [0, 0, 0];
          textEntity.setLocalEulerAngles(rotation[0], rotation[1], rotation[2]);
        }

        textEntity.setLocalScale(T.textAssetScale.x, T.textAssetScale.y, T.textAssetScale.z);

        // Add userData for physics handling
        textEntity.userData = {
          textAssetId: T.textAssetId,
          isText: true,
        };

        // Add physics for selection/interaction
        addPhysics(textEntity);

        // Add to parent
        parent.addChild(textEntity);

        console.log(
          `[AddAssets] Added text: "${T.textAssetText.substring(0, 20)}${T.textAssetText.length > 20 ? '...' : ''}" to ${parentName}`,
        );
      } catch (err) {
        console.error('[AddAssets] Text asset failed:', err);
      }
    }

    console.log(
      `[AddAssets] placed ${frames.length} frame(s) + ${assets3d.length} model(s) + ${textAssets.length} text(s)`,
    );
  })();
}
