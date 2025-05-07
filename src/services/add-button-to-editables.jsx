import * as pc from 'playcanvas';
import postdummy from '/public/pod&post/post.json';
/**
 * @param {pc.Application} app - The PlayCanvas application instance
 * @param {pc.Entity} camera - The camera entity
 * @param {pc.Entity} model - The top-level model entity
 */

window.frames = []; // every image / video frame lives here
window.assets3d = []; // every draggable GLB lives here
window.textAssets = [];

/** Upload any image / video / glb to your backend and return the S3 URL */
async function uploadToS3({ file, userId, frameId }) {
  const form = new FormData();
  form.append('userId', userId);
  form.append('frameId', frameId);
  form.append('file', file);

  const res = await fetch(`${import.meta.env.VITE_LINK}/api/posts/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Upload failed – ${error}`);
  }

  const { fileUrl, mediaType } = await res.json();
  return { fileUrl, mediaType };
}

const WALL_PROPS = {
  Back_Left_Wall: { rotation: [-90, 0, 180], frameScale: 0.5, glbScale: 1 },
  Back_Right_Wall: { rotation: [90, -90, 0], frameScale: 0.5, glbScale: 1 },
  Front_Right_Wall: { rotation: [90, 0, 0], frameScale: 0.5, glbScale: 1 },
  Front_Left_Wall: { rotation: [0, 90, -90], frameScale: 0.5, glbScale: 1 },
  Floor: { rotation: [0, 0, 0], frameScale: 0.5, glbScale: 1 },
  Roof: { rotation: [180, 0, 0], frameScale: 0.5, glbScale: 1 },
};

const TEXT_WALL_PROPS = {
  Back_Left_Wall: { rotation: [0, -180, 0], frameScale: 0.5, glbScale: 1 },
  Back_Right_Wall: { rotation: [0, -90, 0], frameScale: 0.5, glbScale: 1 },
  Front_Right_Wall: { rotation: [0, 0, 0], frameScale: 0.5, glbScale: 1 },
  Front_Left_Wall: { rotation: [0, 90, 0], frameScale: 0.5, glbScale: 1 },
  Floor: { rotation: [-90, 0, 0], frameScale: 0.5, glbScale: 1 },
  Roof: { rotation: [90, 0, 0], frameScale: 0.5, glbScale: 1 },
};

export function AddButtonToEditables(app, camera, model, data, previewMode) {
  const fontAsset = new pc.Asset('ASTERA v2', 'font', {
    url: '/public/fonts/ASTERA v2.json',
  });
  app.assets.add(fontAsset);
  app.assets.load(fontAsset);

  // Log font loading status
  fontAsset.on('load', () => {
    console.log('Font asset loaded successfully');
  });

  fontAsset.on('error', (err) => {
    console.error('Error loading font asset:', err);
  });
  localStorage.setItem('postData', JSON.stringify(postdummy));
  const postData = JSON.parse(localStorage.getItem('postData'));
  const searchParams = new URLSearchParams(window.location.search);
  const userIdParam = searchParams.get('userId');
  const podParam = searchParams.get('podId');

  if (postData) {
    postData.userId = Number(searchParams.get('userId')) || 0;
    postData.podId = Number(searchParams.get('podId')) || 0;
    postData.podName = data.podData.podName;
    postData.postDisplayImage = data.podData.podDisplayImage;

    // Save the updated postData back to localStorage
    localStorage.setItem('postData', JSON.stringify(postData));
  } else {
    console.log('No postData found in localStorage.');
  }
  let currentControlledEntity = null;
  let joystickVisible = false;
  let joystickElements = null;

  window.addEventListener('myVarChanged', function () {
    console.log('Updated value:', window.selectedChild);

    if (window.selectedChild && window.selectedChild instanceof pc.Entity) {
      setControlledEntity(window.selectedChild);
    }
  });

  window.addEventListener('WallChanged', function () {
    console.log('Updated value:', window.wall);
  });

  console.log(camera);

  function setControlledEntity(entity) {
    if (!entity) return;

    currentControlledEntity = entity;
    console.log('Now controlling entity:', entity.name, entity);

    showJoystickControls();
  }

  function createJoystickElements() {
    // Create container
    const joystickContainer = document.createElement('div');
    joystickContainer.id = 'joystick-container';
    joystickContainer.style.position = 'fixed';
    joystickContainer.style.bottom = '40px';
    joystickContainer.style.right = '40px';
    joystickContainer.style.zIndex = '1000';
    joystickContainer.style.display = 'none'; // Hidden by default

    // Create joystick base
    const joystickBase = document.createElement('div');
    joystickBase.className = 'joystick-base';
    joystickBase.style.width = '120px';
    joystickBase.style.height = '120px';
    joystickBase.style.borderRadius = '50%';
    joystickBase.style.backgroundColor = 'rgba(200, 200, 200, 0.7)';
    joystickBase.style.position = 'relative';
    joystickBase.style.cursor = 'pointer';

    // Create joystick knob
    const joystickKnob = document.createElement('div');
    joystickKnob.className = 'joystick-knob';
    joystickKnob.style.width = '60px';
    joystickKnob.style.height = '60px';
    joystickKnob.style.borderRadius = '50%';
    joystickKnob.style.backgroundColor = 'rgb(59, 130, 246)';
    joystickKnob.style.position = 'absolute';
    joystickKnob.style.left = '50%';
    joystickKnob.style.top = '50%';
    joystickKnob.style.transform = 'translate(-50%, -50%)';

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'joystick-toggle';
    toggleButton.innerText = 'Hide Controls';
    toggleButton.style.position = 'absolute';
    toggleButton.style.bottom = '150px';
    toggleButton.style.right = '40px';
    toggleButton.style.padding = '8px 16px';
    toggleButton.style.backgroundColor = 'rgb(59, 130, 246)';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.display = 'none'; // Hidden by default

    // Add elements to DOM
    joystickBase.appendChild(joystickKnob);
    joystickContainer.appendChild(joystickBase);
    document.body.appendChild(joystickContainer);
    document.body.appendChild(toggleButton);

    // Set up joystick functionality
    setupJoystickControls(joystickBase, joystickKnob, toggleButton);

    return { joystickContainer, toggleButton };
  }

  function hideJoystickControls() {
    if (joystickElements) {
      joystickVisible = false;
      joystickElements.joystickContainer.style.display = 'none';
      joystickElements.toggleButton.style.display = 'none';
    }
  }

  // Add this event listener near the other event listeners at the beginning
  window.addEventListener('editModeChanged', function () {
    console.log('Edit mode changed:', window.editMode);

    // Hide controls when edit mode is disabled
    if (window.editMode === false) {
      hideJoystickControls();
    }
  });

  // Set up joystick control functionality
  function setupJoystickControls(joystickBase, joystickKnob, toggleButton) {
    let isDragging = false;
    const maxDistance = 40; // Maximum knob movement distance

    // Toggle button functionality
    toggleButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop event propagation
      joystickVisible = !joystickVisible;
      joystickBase.parentElement.style.display = joystickVisible ? 'block' : 'none';
      toggleButton.innerText = joystickVisible ? 'Hide Controls' : 'Show Controls';
    });

    // Add click event with stopPropagation to joystick container
    const joystickContainer = joystickBase.parentElement;
    joystickContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Add click event with stopPropagation to joystick knob
    joystickKnob.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Mouse events
    joystickBase.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    // Touch events
    joystickBase.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    function handleStart(e) {
      e.preventDefault();
      e.stopPropagation(); // Add stopPropagation here
      isDragging = true;
      updateKnobPosition(e);
    }

    function handleMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation(); // Add stopPropagation here
      updateKnobPosition(e);
    }

    function handleEnd(e) {
      if (!isDragging) return;
      if (e) e.stopPropagation(); // Add stopPropagation here (conditional in case no event is passed)
      isDragging = false;

      // Reset knob to center
      joystickKnob.style.left = '50%';
      joystickKnob.style.top = '50%';
      joystickKnob.style.transform = 'translate(-50%, -50%)';

      // Stop entity movement
      if (currentControlledEntity) {
        moveEntity(0, 0, currentControlledEntity.parent.name);
      }
    }

    function updateKnobPosition(e) {
      const rect = joystickBase.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Get cursor/touch position
      let clientX, clientY;
      if (e.type.startsWith('touch')) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Calculate distance from center
      let deltaX = clientX - rect.left - centerX;
      let deltaY = clientY - rect.top - centerY;

      // Limit distance
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > maxDistance) {
        const scale = maxDistance / distance;
        deltaX *= scale;
        deltaY *= scale;
      }

      // Update knob position
      joystickKnob.style.left = `calc(50% + ${deltaX}px)`;
      joystickKnob.style.top = `calc(50% + ${deltaY}px)`;

      // Move the controlled entity
      if (currentControlledEntity) {
        // Normalize values to -1 to 1
        const normalizedX = deltaX / maxDistance;
        const normalizedY = deltaY / maxDistance;
        moveEntity(normalizedX, normalizedY, currentControlledEntity.parent.name);
      }
    }
  }

  function setMinMax(child) {
    console.log('Setting min/max for:', child.name);
    const parent = child;
    console.log(parent.name);
    const aabb = parent.render.meshInstances[0].aabb;
    const min = {
      x: aabb.center.x - aabb.halfExtents.x,
      y: aabb.center.y - aabb.halfExtents.y,
      z: aabb.center.z - aabb.halfExtents.z,
    };
    const max = {
      x: aabb.center.x + aabb.halfExtents.x,
      y: aabb.center.y + aabb.halfExtents.y,
      z: aabb.center.z + aabb.halfExtents.z,
    };

    const localMinPoint = parent
      .getWorldTransform()
      .clone()
      .invert()
      .transformPoint(new pc.Vec3(aabb.center.x - aabb.halfExtents.x, min.y, min.z));

    const localMaxPoint = parent
      .getWorldTransform()
      .clone()
      .invert()
      .transformPoint(new pc.Vec3(aabb.center.x + aabb.halfExtents.x, max.y, max.z));

    if (parent.name === 'Back_Left_Wall') {
      window.minPoint = {
        x: localMinPoint.x,
        y: localMinPoint.y,
        z: localMaxPoint.z,
      };

      window.maxPoint = {
        x: localMaxPoint.x,
        y: localMaxPoint.y,
        z: localMinPoint.z,
      };
    } else if (parent.name === 'Back_Right_Wall') {
      window.minPoint = {
        x: localMinPoint.x,
        y: localMinPoint.y,
        z: localMinPoint.z,
      };

      window.maxPoint = {
        x: localMaxPoint.x,
        y: localMaxPoint.y,
        z: localMaxPoint.z,
      };
    } else if (parent.name === 'Front_Right_Wall') {
      window.minPoint = {
        x: localMinPoint.x,
        y: localMinPoint.y,
        z: localMinPoint.z,
      };

      window.maxPoint = {
        x: localMaxPoint.x,
        y: localMaxPoint.y,
        z: localMaxPoint.z,
      };
    } else if (parent.name === 'Front_Left_Wall') {
      window.minPoint = {
        x: localMinPoint.x,
        y: localMinPoint.y,
        z: localMinPoint.z,
      };

      window.maxPoint = {
        x: localMaxPoint.x,
        y: localMaxPoint.y,
        z: localMaxPoint.z,
      };
    } else if (parent.name === 'Floor') {
      window.minPoint = {
        x: localMinPoint.x,
        y: localMinPoint.y,
        z: localMinPoint.z,
      };

      window.maxPoint = {
        x: localMaxPoint.x,
        y: localMaxPoint.y,
        z: localMaxPoint.z,
      };
    } else if (parent.name === 'Roof') {
      window.minPoint = {
        x: localMinPoint.x,
        y: localMinPoint.y,
        z: localMinPoint.z,
      };

      window.maxPoint = {
        x: localMaxPoint.x,
        y: localMaxPoint.y,
        z: localMaxPoint.z,
      };
    }
  }

  function moveEntity(x, y, name) {
    if (!currentControlledEntity) return;

    if (name === 'Back_Right_Wall') {
      const parent = currentControlledEntity.parent;
      const aabb = parent.render.meshInstances[0].aabb;

      const minPoint = {
        x: aabb.center.x - aabb.halfExtents.x,
        y: window.minPoint.y,
        z: window.minPoint.z,
      };

      const maxPoint = {
        x: aabb.center.x + aabb.halfExtents.x,
        y: window.maxPoint.y,
        z: window.maxPoint.z,
      };

      const moveSpeed = 0.05;

      const currentPos = currentControlledEntity.getLocalPosition().clone();

      const newPos = currentPos.clone();
      newPos.y -= y * moveSpeed; // Adjust forward/backward movement
      newPos.z += x * moveSpeed; // Adjust up/down movement (inverted if needed)

      if (newPos.y < minPoint.y) {
        newPos.y = minPoint.y;
      } else if (newPos.y > maxPoint.y) {
        newPos.y = maxPoint.y;
      }

      if (newPos.z < minPoint.z) {
        newPos.z = minPoint.z;
      } else if (newPos.z > maxPoint.z) {
        newPos.z = maxPoint.z;
      }

      newPos.x = currentPos.x;

      currentControlledEntity.setLocalPosition(newPos);

      if (currentControlledEntity.userData?.frameId) {
        const f = window.frames.find((f) => f.frameId === currentControlledEntity.userData.frameId);
        if (f) f.position = newPos;
      }

      if (currentControlledEntity.userData?.assetId) {
        const a = window.assets3d.find(
          (a) => a.assetId === currentControlledEntity.userData.assetId,
        );
        if (a) a.position = newPos;
      }

      // if (currentControlledEntity.userData.isText) {
      //   const textAsset = window.textAssets.find(
      //     (t) => t.textAssetId === currentControlledEntity.userData.textAssetId,
      //   );
      //   if (textAsset) {
      //     textAsset.textAssetPosition = newPos;
      //     // Make sure rotation is preserved
      //     // textAsset.rotation = TEXT_WALL_PROPS[textAsset.parentName].rotation;
      //   }
      // }
      if (currentControlledEntity.userData?.isText) {
        const textAsset = window.textAssets.find(
          (t) => t.textAssetId === currentControlledEntity.userData.textAssetId,
        );

        if (textAsset) {
          // Get the current position of the entity
          const currentPos = currentControlledEntity.getLocalPosition();

          // Update the position as an object with x,y,z properties
          textAsset.textAssetPosition = {
            x: currentPos.x,
            y: currentPos.y,
            z: currentPos.z,
          };

          // Log for debugging
          console.log('Updated text asset position:', textAsset.textAssetPosition);
        }
      }
    } else if (name == 'Back_Left_Wall') {
      //y common

      const parent = currentControlledEntity.parent;
      const aabb = parent.render.meshInstances[0].aabb;

      const minPoint = {
        x: window.minPoint.x,
        y: window.minPoint.y,
        z: 6.6,
      };

      const maxPoint = {
        x: window.maxPoint.x,
        y: window.maxPoint.y,
        z: 6.6,
      };

      // Speed factor
      const moveSpeed = 0.05;

      // Get current position
      const currentPos = currentControlledEntity.getLocalPosition().clone();

      // Calculate new position
      const newPos = currentPos.clone();

      // For a wall with constant y, x and z will change with joystick movement
      newPos.x -= x * moveSpeed; // Left/right movement now affects x
      newPos.y -= y * moveSpeed; // Up/down (inverted) now affects z

      // For the X axis (horizontal movement)
      if (newPos.x < minPoint.x) {
        newPos.x = minPoint.x;
      } else if (newPos.x > maxPoint.x) {
        newPos.x = maxPoint.x;
      }

      // For the Z axis (depth movement)
      if (newPos.y < minPoint.y) {
        newPos.y = minPoint.y;
      } else if (newPos.y > maxPoint.y) {
        newPos.y = maxPoint.y;
      }

      // Keep Y position constant for this wall
      newPos.z = currentPos.z;

      // Apply new position
      currentControlledEntity.setLocalPosition(newPos);
      if (currentControlledEntity.userData?.frameId) {
        const f = window.frames.find((f) => f.frameId === currentControlledEntity.userData.frameId);
        if (f) f.position = newPos;
      }
      if (currentControlledEntity.userData?.assetId) {
        const a = window.assets3d.find(
          (a) => a.assetId === currentControlledEntity.userData.assetId,
        );
        if (a) a.position = newPos;
      }
      if (currentControlledEntity.userData?.isText) {
        const textAsset = window.textAssets.find(
          (t) => t.textAssetId === currentControlledEntity.userData.textAssetId,
        );

        if (textAsset) {
          // Get the current position of the entity
          const currentPos = currentControlledEntity.getLocalPosition();

          // Update the position as an object with x,y,z properties
          textAsset.textAssetPosition = {
            x: currentPos.x,
            y: currentPos.y,
            z: currentPos.z,
          };

          // Log for debugging
          console.log('Updated text asset position:', textAsset.textAssetPosition);
        }
      }

      // Log constrained position for debugging
      // console.log('New constrained position:', newPos);
    } else if (name == 'Front_Right_Wall') {
      //y common

      const parent = currentControlledEntity.parent;
      const aabb = parent.render.meshInstances[0].aabb;

      const minPoint = {
        x: window.minPoint.x,
        y: window.minPoint.y,
        z: 6.6,
      };

      const maxPoint = {
        x: window.maxPoint.x,
        y: window.maxPoint.y,
        z: 6.6,
      };

      // Speed factor
      const moveSpeed = 0.05;

      // Get current position
      const currentPos = currentControlledEntity.getLocalPosition().clone();

      // Calculate new position
      const newPos = currentPos.clone();

      // For a wall with constant y, x and z will change with joystick movement
      newPos.x += x * moveSpeed; // Left/right movement now affects x
      newPos.y -= y * moveSpeed; // Up/down (inverted) now affects z

      // For the X axis (horizontal movement)
      if (newPos.x < minPoint.x) {
        newPos.x = minPoint.x;
      } else if (newPos.x > maxPoint.x) {
        newPos.x = maxPoint.x;
      }

      // For the Z axis (depth movement)
      if (newPos.y < minPoint.y) {
        newPos.y = minPoint.y;
      } else if (newPos.y > maxPoint.y) {
        newPos.y = maxPoint.y;
      }

      // Keep Y position constant for this wall
      newPos.z = currentPos.z;

      // Apply new position
      currentControlledEntity.setLocalPosition(newPos);
      if (currentControlledEntity.userData?.frameId) {
        const f = window.frames.find((f) => f.frameId === currentControlledEntity.userData.frameId);
        if (f) f.position = newPos;
      }
      if (currentControlledEntity.userData?.assetId) {
        const a = window.assets3d.find(
          (a) => a.assetId === currentControlledEntity.userData.assetId,
        );
        if (a) a.position = newPos;
      }
      if (currentControlledEntity.userData?.isText) {
        const textAsset = window.textAssets.find(
          (t) => t.textAssetId === currentControlledEntity.userData.textAssetId,
        );

        if (textAsset) {
          // Get the current position of the entity
          const currentPos = currentControlledEntity.getLocalPosition();

          // Update the position as an object with x,y,z properties
          textAsset.textAssetPosition = {
            x: currentPos.x,
            y: currentPos.y,
            z: currentPos.z,
          };

          // Log for debugging
          console.log('Updated text asset position:', textAsset.textAssetPosition);
        }
      }

      // Log constrained position for debugging
      // console.log('New constrained position:', newPos);
    } else if (name == 'Front_Left_Wall') {
      const parent = currentControlledEntity.parent;
      const aabb = parent.render.meshInstances[0].aabb;

      // Get bounding box information
      const minPoint = {
        x: window.minPoint.x,
        y: window.minPoint.y,
        z: window.minPoint.z,
      };

      const maxPoint = {
        x: window.maxPoint.x,
        y: window.maxPoint.y,
        z: window.maxPoint.z,
      };

      // Speed factor
      const moveSpeed = 0.05;

      // Get current position
      const currentPos = currentControlledEntity.getLocalPosition().clone();

      // Calculate new position
      const newPos = currentPos.clone();
      newPos.z -= x * moveSpeed; // Left/right
      newPos.y -= y * moveSpeed; // Up/down (inverted)

      // For the Y axis (vertical movement)
      if (newPos.y < minPoint.y) {
        newPos.y = minPoint.y;
      } else if (newPos.y > maxPoint.y) {
        newPos.y = maxPoint.y;
      }

      // For the Z axis (forward/backward movement)
      if (newPos.z < minPoint.z) {
        newPos.z = minPoint.z;
      } else if (newPos.z > maxPoint.z) {
        newPos.z = maxPoint.z;
      }

      // We're not changing X position since the wall is in YZ plane
      // and X is constant (assuming movement is restricted to the wall plane)
      newPos.x = currentPos.x;

      // Apply new position
      currentControlledEntity.setLocalPosition(newPos);
      if (currentControlledEntity.userData?.frameId) {
        const f = window.frames.find((f) => f.frameId === currentControlledEntity.userData.frameId);
        if (f) f.position = newPos;
      }
      if (currentControlledEntity.userData?.assetId) {
        const a = window.assets3d.find(
          (a) => a.assetId === currentControlledEntity.userData.assetId,
        );
        if (a) a.position = newPos;
      }
      if (currentControlledEntity.userData?.isText) {
        const textAsset = window.textAssets.find(
          (t) => t.textAssetId === currentControlledEntity.userData.textAssetId,
        );

        if (textAsset) {
          // Get the current position of the entity
          const currentPos = currentControlledEntity.getLocalPosition();

          // Update the position as an object with x,y,z properties
          textAsset.textAssetPosition = {
            x: currentPos.x,
            y: currentPos.y,
            z: currentPos.z,
          };

          // Log for debugging
          console.log('Updated text asset position:', textAsset.textAssetPosition);
        }
      }
    } else if (name == 'Floor') {
      const parent = currentControlledEntity.parent;
      const aabb = parent.render.meshInstances[0].aabb;

      const minPoint = {
        x: window.minPoint.x,
        y: window.minPoint.y,
        z: window.minPoint.z,
      };

      const maxPoint = {
        x: window.maxPoint.x,
        y: window.maxPoint.y,
        z: window.maxPoint.z,
      };

      // Speed factor
      const moveSpeed = 0.05;

      // Get current position
      const currentPos = currentControlledEntity.getLocalPosition().clone();

      // Calculate new position
      const newPos = currentPos.clone();

      console.log(window.wall);
      if (window.wall === 'Back_Right_Wall') {
        newPos.z += x * moveSpeed; // Left/right movement now affects x
        newPos.x -= y * moveSpeed; // Up/down (inverted) now affects z
      } else if (window.wall === 'Back_Left_Wall') {
        newPos.x -= x * moveSpeed; // Left/right movement now affects x
        newPos.z -= y * moveSpeed; // Up/down (inverted) now affects z
      } else if (window.wall === 'Front_Left_Wall') {
        newPos.x -= x * moveSpeed; // Left/right movement now affects x
        newPos.z -= y * moveSpeed; // Up/down (inverted) now affects z
      } else if (window.wall === 'Front_Right_Wall') {
        newPos.x += x * moveSpeed; // Left/right movement now affects x
        newPos.z += y * moveSpeed; // Up/down (inverted) now affects z
      }

      // For the X axis (horizontal movement)
      if (newPos.x < minPoint.x) {
        newPos.x = minPoint.x;
      } else if (newPos.x > maxPoint.x) {
        newPos.x = maxPoint.x;
      }

      // For the Z axis (depth movement)
      if (newPos.z < minPoint.z) {
        newPos.z = minPoint.z;
      } else if (newPos.z > maxPoint.z) {
        newPos.z = maxPoint.z;
      }

      // Keep Y position constant for this wall
      newPos.y = currentPos.y;

      // Apply new position
      currentControlledEntity.setLocalPosition(newPos);
      if (currentControlledEntity.userData?.frameId) {
        const f = window.frames.find((f) => f.frameId === currentControlledEntity.userData.frameId);
        if (f) f.position = newPos;
      }
      if (currentControlledEntity.userData?.assetId) {
        const a = window.assets3d.find(
          (a) => a.assetId === currentControlledEntity.userData.assetId,
        );
        if (a) a.position = newPos;
      }
      if (currentControlledEntity.userData?.isText) {
        const textAsset = window.textAssets.find(
          (t) => t.textAssetId === currentControlledEntity.userData.textAssetId,
        );

        if (textAsset) {
          // Get the current position of the entity
          const currentPos = currentControlledEntity.getLocalPosition();

          // Update the position as an object with x,y,z properties
          textAsset.textAssetPosition = {
            x: currentPos.x,
            y: currentPos.y,
            z: currentPos.z,
          };

          // Log for debugging
          console.log('Updated text asset position:', textAsset.textAssetPosition);
        }
      }
    } else if (name == 'Roof') {
      const parent = currentControlledEntity.parent;
      const aabb = parent.render.meshInstances[0].aabb;

      const minPoint = {
        x: window.minPoint.x,
        y: window.minPoint.y,
        z: window.minPoint.z,
      };

      const maxPoint = {
        x: window.maxPoint.x,
        y: window.maxPoint.y,
        z: window.maxPoint.z,
      };

      // Speed factor
      const moveSpeed = 0.05;

      // Get current position
      const currentPos = currentControlledEntity.getLocalPosition().clone();

      // Calculate new position
      const newPos = currentPos.clone();

      console.log(window.wall);
      if (window.wall === 'Back_Right_Wall') {
        newPos.z += x * moveSpeed; // Left/right movement now affects x
        newPos.x -= y * moveSpeed; // Up/down (inverted) now affects z
      } else if (window.wall === 'Back_Left_Wall') {
        newPos.x -= x * moveSpeed; // Left/right movement now affects x
        newPos.z -= y * moveSpeed; // Up/down (inverted) now affects z
      } else if (window.wall === 'Front_Left_Wall') {
        newPos.x -= x * moveSpeed; // Left/right movement now affects x
        newPos.z -= y * moveSpeed; // Up/down (inverted) now affects z
      } else if (window.wall === 'Front_Right_Wall') {
        newPos.x += x * moveSpeed; // Left/right movement now affects x
        newPos.z += y * moveSpeed; // Up/down (inverted) now affects z
      }

      // For the X axis (horizontal movement)
      if (newPos.x < minPoint.x) {
        newPos.x = minPoint.x;
      } else if (newPos.x > maxPoint.x) {
        newPos.x = maxPoint.x;
      }

      // For the Z axis (depth movement)
      if (newPos.z < minPoint.z) {
        newPos.z = minPoint.z;
      } else if (newPos.z > maxPoint.z) {
        newPos.z = maxPoint.z;
      }

      // Keep Y position constant for this wall
      newPos.y = currentPos.y;

      // Apply new position
      currentControlledEntity.setLocalPosition(newPos);
      if (currentControlledEntity.userData?.frameId) {
        const f = window.frames.find((f) => f.frameId === currentControlledEntity.userData.frameId);
        if (f) f.position = newPos;
      }
      if (currentControlledEntity.userData?.assetId) {
        const a = window.assets3d.find(
          (a) => a.assetId === currentControlledEntity.userData.assetId,
        );
        if (a) a.position = newPos;
      }
      if (currentControlledEntity.userData?.isText) {
        const textAsset = window.textAssets.find(
          (t) => t.textAssetId === currentControlledEntity.userData.textAssetId,
        );

        if (textAsset) {
          // Get the current position of the entity
          const currentPos = currentControlledEntity.getLocalPosition();

          // Update the position as an object with x,y,z properties
          textAsset.textAssetPosition = {
            x: currentPos.x,
            y: currentPos.y,
            z: currentPos.z,
          };

          // Log for debugging
          console.log('Updated text asset position:', textAsset.textAssetPosition);
        }
      }
    }
  }

  function showJoystickControls() {
    // Don't show controls if edit mode is disabled
    if (window.editMode === false) {
      return;
    }

    if (!joystickElements) {
      joystickElements = getOrCreateJoystickElements();
    }

    joystickVisible = true;
    joystickElements.joystickContainer.style.display = 'block';
    joystickElements.toggleButton.style.display = 'block';
    joystickElements.toggleButton.innerText = 'Hide Controls';
  }

  // Get or create joystick elements
  function getOrCreateJoystickElements() {
    let joystickContainer = document.getElementById('joystick-container');
    let toggleButton = document.getElementById('joystick-toggle');

    if (!joystickContainer || !toggleButton) {
      const elements = createJoystickElements();
      joystickContainer = elements.joystickContainer;
      toggleButton = elements.toggleButton;
    }

    return { joystickContainer, toggleButton };
  }

  // Process the model entity
  const pod = model.children;
  if (!pod) {
    console.warn('No child (pod) found in model.');
    return;
  }

  const editable = pod;
  if (!editable) {
    console.warn('No editable child found inside pod.');
    return;
  }

  console.log(pod);

  // Function to create a button specifically for the floor

  editable.forEach((child) => {
    console.log('Adding buttons to child:', child.name);

    // For walls, create 2 buttons, for floor create 4 buttons
    if (child.name === 'Floor') {
      // For floor, create 4 buttons (one in each quadrant)
      createFloorButton(child, 1); // Top-left quadrant
      createFloorButton(child, 2); // Top-right quadrant
      createFloorButton(child, 3); // Bottom-left quadrant
      createFloorButton(child, 4); // Bottom-right quadrant
    } else if (child.name === 'Roof') {
      // For roof, create 4 buttons (one in each quadrant)
      createRoofButton(child, 1); // Top-left quadrant
      createRoofButton(child, 2); // Top-right quadrant
      createRoofButton(child, 3); // Bottom-left quadrant
      createRoofButton(child, 4); // Bottom-right quadrant
    } else {
      // For walls, create 2 buttons
      createWallButton(child, 1); // First button (left/top half)
      createWallButton(child, 2); // Second button (right/bottom half)
    }

    function createWallButton(wallEntity, buttonIndex) {
      console.log('Wall Entity:', wallEntity.name);
      const buttonName = `uploadButton_${wallEntity.name}_${buttonIndex}`;
      const buttonEntity = new pc.Entity(buttonName);
      buttonEntity.tags.add(`plusButton-${wallEntity.name}-${buttonIndex}`);
      buttonEntity.tags.add('plusButton');

      buttonEntity.enabled = previewMode;

      buttonEntity.addComponent('button');
      buttonEntity.addComponent('element', {
        anchor: [0.5, 0.5, 0.5, 0.5],
        width: 0.2,
        height: 0.2,
        pivot: [0.5, 0.5],
        type: pc.ELEMENTTYPE_IMAGE,
        useInput: true,
        textureAsset: null,
      });

      // Get the min and max points of the wall to calculate button positions
      setMinMax(wallEntity);

      // Calculate positions based on wall and button index
      positionButtonOnWall(buttonEntity, wallEntity, buttonIndex);

      buttonEntity.setLocalScale(5, 5, 5);

      // Load button texture
      const buttonTextureAsset = new pc.Asset(
        `ButtonTexture_${wallEntity.name}_${buttonIndex}`,
        'texture',
        {
          url: '../../public/images/1.png',
        },
      );
      app.assets.add(buttonTextureAsset);
      app.assets.load(buttonTextureAsset);
      buttonTextureAsset.on('load', () => {
        buttonEntity.element.textureAsset = buttonTextureAsset;
      });

      // Create file input
      const fileInputId = `fileInput_${wallEntity.name}_${buttonIndex}`;
      let fileInput = document.getElementById(fileInputId);
      if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,video/*,.glb'; // Accept images, videos and GLB files
        fileInput.id = fileInputId;
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
      }

      // Button click handler
      buttonEntity.button.on('click', () => {
        console.log(`Button ${buttonIndex} for ${wallEntity.name} clicked`);
        window.isFloor = false;
        window.isRoof = false;
        window.currentButtonIndex = buttonIndex;
        window.currentEntity = wallEntity;
        setMinMax(wallEntity);
        createSelectionMenu();
      });

      // File input handler
      fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const mode = this.getAttribute('data-mode');

        // Apply texture to entire object
        if (file.type.startsWith('image/')) {
          handleImageUpload(file, buttonIndex);
        } else if (file.type.startsWith('video/')) {
          handleVideoUpload(file, buttonIndex);
        } else if (file.name.toLowerCase().endsWith('.glb')) {
          handleGlbUpload(file, buttonIndex);
        } else {
          console.error('Unsupported file type');
        }

        this.value = ''; // Reset file input
      });
    }

    // Function to position the button on the wall based on the button index
    function positionButtonOnWall(buttonEntity, wallEntity, buttonIndex) {
      // Default position and rotation from the base code
      let basePosition, baseRotation;

      // Get base position and rotation for each wall
      if (wallEntity.name === 'Back_Left_Wall') {
        basePosition = new pc.Vec3(-0.85, 1.932, 6.608);
        baseRotation = new pc.Vec3(0, -180, 0);
      } else if (wallEntity.name === 'Back_Right_Wall') {
        basePosition = new pc.Vec3(6.7, 1.9, 0);
        baseRotation = new pc.Vec3(0, -90, 0);
      } else if (wallEntity.name === 'Front_Right_Wall') {
        basePosition = new pc.Vec3(0, 1.84, -6.82);
        baseRotation = new pc.Vec3(0, 0, 0);
      } else if (wallEntity.name === 'Front_Left_Wall') {
        basePosition = new pc.Vec3(-6.78, 1.3, 0);
        baseRotation = new pc.Vec3(0, 90, 0);
      }

      // Calculate position based on min/max points and button index
      // For each wall, we need to adjust specific coordinates based on its orientation
      let newPosition = basePosition?.clone();

      // For vertical centering, we'll use the height of the wall (y-dimension)
      const height = window.maxPoint.y - window.minPoint.y;
      const verticalCenter = window.minPoint.y + height / 2;

      if (wallEntity.name === 'Back_Left_Wall') {
        // Adjust the X coordinate for Back_Left_Wall
        const width = window.maxPoint.x - window.minPoint.x;
        const halfWidth = width / 2;
        // Button 1 goes on the left half, Button 2 on the right half
        const xPos =
          buttonIndex === 1
            ? window.minPoint.x + halfWidth / 2
            : window.minPoint.x + halfWidth + halfWidth / 2;
        newPosition.x = xPos;
        newPosition.y = verticalCenter; // Center vertically
      } else if (wallEntity.name === 'Back_Right_Wall') {
        // Adjust the Z coordinate for Back_Right_Wall
        const width = window.maxPoint.z - window.minPoint.z;
        const halfWidth = width / 2;
        // Button 1 goes on the left half, Button 2 on the right half
        const zPos =
          buttonIndex === 1
            ? window.minPoint.z + halfWidth / 2
            : window.minPoint.z + halfWidth + halfWidth / 2;
        newPosition.z = zPos;
        newPosition.y = verticalCenter; // Center vertically
      } else if (wallEntity.name === 'Front_Right_Wall') {
        // Adjust the X coordinate for Front_Right_Wall
        const width = window.maxPoint.x - window.minPoint.x;
        const halfWidth = width / 2;
        // Button 1 goes on the left half, Button 2 on the right half
        const xPos =
          buttonIndex === 1
            ? window.minPoint.x + halfWidth / 2
            : window.minPoint.x + halfWidth + halfWidth / 2;
        newPosition.x = xPos;
        newPosition.y = verticalCenter; // Center vertically
      } else if (wallEntity.name === 'Front_Left_Wall') {
        // Adjust the Z coordinate for Front_Left_Wall
        const width = window.maxPoint.z - window.minPoint.z;
        const halfWidth = width / 2;
        // Button 1 goes on the left half, Button 2 on the right half
        const zPos =
          buttonIndex === 1
            ? window.minPoint.z + halfWidth / 2
            : window.minPoint.z + halfWidth + halfWidth / 2;
        newPosition.z = zPos;
        newPosition.y = verticalCenter; // Center vertically
      }

      buttonEntity.setLocalPosition(newPosition);
      buttonEntity.setLocalEulerAngles(baseRotation?.x, baseRotation?.y, baseRotation?.z);
      wallEntity.addChild(buttonEntity);
    }

    // Create selection menu
    // function createSelectionMenu() {
    //   // Remove existing menu if it exists
    //   const existingMenu = document.getElementById('selection-menu');
    //   if (existingMenu) existingMenu.remove();

    //   /* ─ container ─────────────────────────────────────────────── */
    //   const menu = document.createElement('div');
    //   menu.id = 'selection-menu';
    //   Object.assign(menu.style, {
    //     position: 'fixed',
    //     top: '50%',
    //     left: '50%',
    //     transform: 'translate(-50%, -50%)',
    //     background: '#fff',
    //     padding: '20px',
    //     borderRadius: '8px',
    //     boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    //     zIndex: 1000,
    //     display: 'flex',
    //     flexDirection: 'column',
    //     gap: '10px',
    //   });

    //   /* stop propagation for any click inside the menu */
    //   menu.addEventListener('click', (e) => e.stopPropagation());
    //   menu.addEventListener('mousedown', (e) => e.stopPropagation());

    //   /* ─ title ─────────────────────────────────────────────────── */
    //   const title = document.createElement('h3');
    //   title.textContent = 'Select Upload Type';
    //   Object.assign(title.style, { margin: '0 0 15px', textAlign: 'center' });
    //   menu.appendChild(title);

    //   /* ─ options ───────────────────────────────────────────────── */
    //   // Allow all options for both floor and walls
    //   const options = ['Video', 'Image', '3D Asset'];

    //   options.forEach((opt) => {
    //     const btn = document.createElement('button');
    //     btn.textContent = opt;
    //     Object.assign(btn.style, {
    //       padding: '10px 15px',
    //       cursor: 'pointer',
    //       border: '1px solid #ccc',
    //       borderRadius: '4px',
    //       background: '#f8f8f8',
    //       fontSize: '14px',
    //     });

    //     btn.onmouseenter = () => (btn.style.background = '#e8e8e8');
    //     btn.onmouseleave = () => (btn.style.background = '#f8f8f8');

    //     btn.addEventListener('click', (e) => {
    //       e.stopPropagation(); // ← prevent wall selection
    //       handleOptionSelection(opt.toLowerCase());
    //       menu.remove();
    //     });

    //     menu.appendChild(btn);
    //   });

    //   /* ─ cancel button ─────────────────────────────────────────── */
    //   const cancel = document.createElement('button');
    //   cancel.textContent = 'Cancel';
    //   Object.assign(cancel.style, {
    //     marginTop: '10px',
    //     padding: '10px 15px',
    //     cursor: 'pointer',
    //     border: '1px solid #ddd',
    //     borderRadius: '4px',
    //     background: '#f1f1f1',
    //   });

    //   cancel.addEventListener('click', (e) => {
    //     e.stopPropagation(); // ← prevent wall selection
    //     menu.remove();
    //   });

    //   menu.appendChild(cancel);
    //   document.body.appendChild(menu);
    // }

    function createSelectionMenu() {
      // Remove existing menu if it exists
      const existingMenu = document.getElementById('selection-menu');
      if (existingMenu) existingMenu.remove();

      /* ─ container ─────────────────────────────────────────────── */
      const menu = document.createElement('div');
      menu.id = 'selection-menu';
      Object.assign(menu.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      });

      /* stop propagation for any click inside the menu */
      menu.addEventListener('click', (e) => e.stopPropagation());
      menu.addEventListener('mousedown', (e) => e.stopPropagation());

      /* ─ title ─────────────────────────────────────────────────── */
      const title = document.createElement('h3');
      title.textContent = 'Select Upload Type';
      Object.assign(title.style, { margin: '0 0 15px', textAlign: 'center' });
      menu.appendChild(title);

      /* ─ options ───────────────────────────────────────────────── */
      // Add Text option to the list
      const options = ['Video', 'Image', '3D Asset', 'Text'];

      options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        Object.assign(btn.style, {
          padding: '10px 15px',
          cursor: 'pointer',
          border: '1px solid #ccc',
          borderRadius: '4px',
          background: '#f8f8f8',
          fontSize: '14px',
        });

        btn.onmouseenter = () => (btn.style.background = '#e8e8e8');
        btn.onmouseleave = () => (btn.style.background = '#f8f8f8');

        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // ← prevent wall selection
          handleOptionSelection(opt.toLowerCase());
          menu.remove();
        });

        menu.appendChild(btn);
      });

      /* ─ cancel button ─────────────────────────────────────────── */
      const cancel = document.createElement('button');
      cancel.textContent = 'Cancel';
      Object.assign(cancel.style, {
        marginTop: '10px',
        padding: '10px 15px',
        cursor: 'pointer',
        border: '1px solid #ddd',
        borderRadius: '4px',
        background: '#f1f1f1',
      });

      cancel.addEventListener('click', (e) => {
        e.stopPropagation(); // ← prevent wall selection
        menu.remove();
      });

      menu.appendChild(cancel);
      document.body.appendChild(menu);
    }

    function handleOptionSelection(option) {
      let fileInputId;

      if (window.isFloor) {
        fileInputId = `fileInput_Floor_${window.currentButtonIndex}`;
      } else if (window.isRoof) {
        fileInputId = `fileInput_Roof_${window.currentButtonIndex}`;
      } else {
        fileInputId = `fileInput_${window.currentEntity.name}_${window.currentButtonIndex}`;
      }

      const fileInput = document.getElementById(fileInputId);

      switch (option) {
        case 'video':
          fileInput.accept = 'video/*';
          fileInput.click();
          break;
        case 'image':
          fileInput.accept = 'image/*';
          fileInput.click();
          break;
        case '3d asset':
          fileInput.accept = '.glb';
          fileInput.click();
          break;
        case 'text':
          // Show text input dialog instead of file input
          showTextInputDialog();
          break;
      }
    }

    function showTextInputDialog() {
      // Remove existing dialog if it exists
      const existingDialog = document.getElementById('text-input-dialog');
      if (existingDialog) existingDialog.remove();

      // Create dialog container
      const dialog = document.createElement('div');
      dialog.id = 'text-input-dialog';
      Object.assign(dialog.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '300px',
      });

      // Create title
      const title = document.createElement('h3');
      title.textContent = 'Enter Text';
      Object.assign(title.style, { margin: '0', textAlign: 'center' });
      dialog.appendChild(title);

      // Create text input
      const textInput = document.createElement('textarea');
      textInput.placeholder = 'Enter your text here...';
      Object.assign(textInput.style, {
        width: '100%',
        height: '80px',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        resize: 'none',
        fontFamily: 'Arial, sans-serif',
      });
      dialog.appendChild(textInput);

      // Create color picker label
      const colorLabel = document.createElement('label');
      colorLabel.textContent = 'Text Color:';
      dialog.appendChild(colorLabel);

      // Create color picker
      const colorPicker = document.createElement('input');
      colorPicker.type = 'color';
      colorPicker.value = '#ff0000'; // Default to red
      Object.assign(colorPicker.style, {
        width: '100%',
        height: '40px',
      });
      dialog.appendChild(colorPicker);

      // Create font size label
      const sizeLabel = document.createElement('label');
      sizeLabel.textContent = 'Font Size:';
      dialog.appendChild(sizeLabel);

      // Create font size slider
      const sizeSlider = document.createElement('input');
      sizeSlider.type = 'range';
      sizeSlider.min = '0.5';
      sizeSlider.max = '2';
      sizeSlider.step = '0.1';
      sizeSlider.value = '0.8'; // Default size
      Object.assign(sizeSlider.style, {
        width: '100%',
      });
      dialog.appendChild(sizeSlider);

      // Create size value display
      const sizeValue = document.createElement('div');
      sizeValue.textContent = `Size: ${sizeSlider.value}`;
      sizeSlider.oninput = () => {
        sizeValue.textContent = `Size: ${sizeSlider.value}`;
      };
      dialog.appendChild(sizeValue);

      // Create button container
      const buttonContainer = document.createElement('div');
      Object.assign(buttonContainer.style, {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
      });
      dialog.appendChild(buttonContainer);

      // Create cancel button
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      Object.assign(cancelButton.style, {
        padding: '8px 15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        background: '#f1f1f1',
        cursor: 'pointer',
        flex: '1',
        marginRight: '5px',
      });
      cancelButton.addEventListener('click', () => {
        dialog.remove();
      });
      buttonContainer.appendChild(cancelButton);

      // Create add button
      const addButton = document.createElement('button');
      addButton.textContent = 'Add Text';
      Object.assign(addButton.style, {
        padding: '8px 15px',
        border: 'none',
        borderRadius: '4px',
        background: 'rgb(59, 130, 246)',
        color: 'white',
        cursor: 'pointer',
        flex: '1',
        marginLeft: '5px',
      });
      addButton.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
          const color = colorPicker.value;
          const fontSize = parseFloat(sizeSlider.value);
          handleTextCreate(text, color, fontSize);
        }
        dialog.remove();
      });
      buttonContainer.appendChild(addButton);

      // Add dialog to the document
      document.body.appendChild(dialog);

      // Focus on the text input
      setTimeout(() => textInput.focus(), 0);

      // Stop propagation of clicks within the dialog
      dialog.addEventListener('click', (e) => e.stopPropagation());
      dialog.addEventListener('mousedown', (e) => e.stopPropagation());
    }

    function handleTextCreate(text, color, fontSize) {
      const textId = Math.floor(Math.random() * 1e9);

      // Get the current font asset or load it if not already loaded
      let fontAsset = app.assets.find('ASTERA v2', 'font');

      if (!fontAsset) {
        fontAsset = new pc.Asset('ASTERA v2', 'font', {
          url: '/public/fonts/ASTERA v2.json', // Set the correct path
        });
        app.assets.add(fontAsset);
        app.assets.load(fontAsset);
      }

      // Create text entity
      const textEntity = new pc.Entity(`text-${textId}`);

      // Convert hex color to pc.Color
      const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return new pc.Color(r, g, b);
      };

      // Add text element component
      textEntity.addComponent('element', {
        type: 'text',
        text: text,
        fontSize: fontSize, // Adjust scale to make the size more reasonable
        fontAsset: fontAsset,
        color: hexToRgb(color),
        pivot: new pc.Vec2(0.5, 0.5),
        width: 4,
        height: 1,
        alignment: [0.5, 0.5], // Center alignment
      });

      // Determine the parent entity and position
      let parent;
      if (window.isFloor) {
        parent = model.findByName('Floor');
      } else if (window.isRoof) {
        parent = model.findByName('Roof');
      } else {
        parent = window.currentEntity;
      }

      if (!parent) {
        console.error('Parent entity not found');
        return;
      }

      // Position and rotate the text based on the wall/floor/roof and button index
      positionUploadedContent(textEntity, parent.name, window.currentButtonIndex, true);

      // Apply appropriate scale
      textEntity.setLocalScale(0.3, 0.3, 1);

      // Add userData to enable dragging
      textEntity.userData = { textId, isText: true }; // Add isText flag to identify text entities

      // Use the TEXT_WALL_PROPS for rotation values
      const position = textEntity.getLocalPosition().clone();
      // Get the rotation from TEXT_WALL_PROPS
      const rotation = TEXT_WALL_PROPS[parent.name].rotation;

      // Apply appropriate scale
      textEntity.setLocalScale(0.3, 0.3, 1);

      // Add userData to enable dragging
      textEntity.userData = { textAssetId: textId, isText: true };

      // Create a proper textAsset object with the correct property formats
      const textAsset = {
        textAssetId: textId,
        // Store position as an object with x,y,z properties
        textAssetPosition: {
          x: position.x,
          y: position.y,
          z: position.z,
        },
        // Store rotation as an array for internal use
        textAssetRotation: rotation,
        textAssetScale: { x: 0.3, y: 0.3, z: 1 },
        textAssetText: text,
        textFont: `${color}-${fontSize}`,
        textAssetName: parent.name,
        textAssetSize: '20kb',
        textAssetAlignment: 'left',
      };

      window.textAssets.push(textAsset);

      // Log to verify the data structure
      console.log('Added text asset:', textAsset);

      // Add physics and controls
      addPhysicsAndControls(textEntity);

      // Add to parent
      parent.addChild(textEntity);

      // Set as controlled entity
      setControlledEntity(textEntity);
    }
    // function handleTextCreate(text, color, fontSize) {
    //   const frameId = Math.floor(Math.random() * 1e9);

    //   // Get the current font asset or load it if not already loaded
    //   let fontAsset = app.assets.find('ASTERA v2', 'font');

    //   if (!fontAsset) {
    //     fontAsset = new pc.Asset('ASTERA v2', 'font', {
    //       url: '/public/fonts/ASTERA v2.json', // Set the correct path
    //     });
    //     app.assets.add(fontAsset);
    //     app.assets.load(fontAsset);
    //   }

    //   // Create text entity
    //   const textEntity = new pc.Entity(`text-${frameId}`);

    //   // Convert hex color to pc.Color
    //   const hexToRgb = (hex) => {
    //     const r = parseInt(hex.slice(1, 3), 16) / 255;
    //     const g = parseInt(hex.slice(3, 5), 16) / 255;
    //     const b = parseInt(hex.slice(5, 7), 16) / 255;
    //     return new pc.Color(r, g, b);
    //   };

    //   // Add text element component
    //   textEntity.addComponent('element', {
    //     type: 'text',
    //     text: text,
    //     fontSize: fontSize, // Adjust scale to make the size more reasonable
    //     fontAsset: fontAsset,
    //     color: hexToRgb(color),
    //     pivot: new pc.Vec2(0.5, 0.5),
    //     width: 2,
    //     height: 0.5,
    //     alignment: [0.5, 0.5], // Center alignment
    //   });

    //   // Determine the parent entity and position
    //   let parent;
    //   if (window.isFloor) {
    //     parent = model.findByName('Floor');
    //   } else if (window.isRoof) {
    //     parent = model.findByName('Roof');
    //   } else {
    //     parent = window.currentEntity;
    //   }

    //   if (!parent) {
    //     console.error('Parent entity not found');
    //     return;
    //   }

    //   // Position and rotate the text based on the wall/floor/roof and button index
    //   positionUploadedContent(textEntity, parent.name, window.currentButtonIndex, true);

    //   // Apply appropriate scale
    //   textEntity.setLocalScale(0.3, 0.3, 1);

    //   // Add userData to enable dragging
    //   textEntity.userData = { frameId };

    //   // Add to frames array for tracking
    //   window.textAssets.push({
    //     frameId,
    //     position: textEntity.getLocalPosition().clone(),
    //     rotation: WALL_PROPS[parent.name].rotation,
    //     scale: { x: 0.3, y: 0.3, z: 1 },
    //     assetUrl: `text-${frameId}`,
    //     textContent: text,
    //     textColor: color,
    //     fontSize: fontSize,
    //   });

    //   // Add physics and controls
    //   addPhysicsAndControls(textEntity);

    //   // Add to parent
    //   parent.addChild(textEntity);

    //   // Set as controlled entity
    //   setControlledEntity(textEntity);
    // }

    // function handleOptionSelection(option) {
    //   let fileInputId;

    //   if (window.isFloor) {
    //     fileInputId = `fileInput_Floor_${window.currentButtonIndex}`;
    //   } else if (window.isRoof) {
    //     fileInputId = `fileInput_Roof_${window.currentButtonIndex}`;
    //   } else {
    //     fileInputId = `fileInput_${window.currentEntity.name}_${window.currentButtonIndex}`;
    //   }

    //   const fileInput = document.getElementById(fileInputId);

    //   switch (option) {
    //     case 'video':
    //       fileInput.accept = 'video/*';
    //       fileInput.click();
    //       break;
    //     case 'image':
    //       fileInput.accept = 'image/*';
    //       fileInput.click();
    //       break;
    //     case '3d asset':
    //       fileInput.accept = '.glb';
    //       fileInput.click();
    //       break;
    //   }
    // }

    // Handle image uploads (to frame)
    async function handleImageUpload(file, buttonIndex) {
      const frameId = Math.floor(Math.random() * 1e9);
      const { fileUrl } = await uploadToS3({
        // ❷ upload once
        file,
        userId: Number(userIdParam),
        frameId,
      });

      const reader = new FileReader();
      reader.onload = function (e) {
        const dataURL = e.target.result;

        const img = new Image();
        img.onload = function () {
          const width = img.width;
          const height = img.height;

          // Use a tolerance for approximate squareness.
          const tolerance = 10; // pixels (adjust if needed)

          if (Math.abs(width - height) < tolerance) {
            console.log('Square image');
          } else if (width > height) {
            console.log('Landscape image');
          } else {
            console.log('Portrait image');
          }
        };
        // Set the source to trigger loading and dimension checking.
        img.src = dataURL;
        const textureAsset = new pc.Asset(
          `uploadedTexture_${child.name}_${buttonIndex}_${Date.now()}`,
          'texture',
          {
            url: dataURL,
          },
        );
        app.assets.add(textureAsset);
        textureAsset.on('load', () => {
          console.log('Texture loaded:', textureAsset.resource);

          // --- 1. Create a flat plane -------------------------------------------
          const planeEntity = new pc.Entity('framePlane');
          planeEntity.addComponent('render', { type: 'plane' }); // 1×1 quad

          // --- 2. Create / assign a material -------------------------------------
          const mat = new pc.StandardMaterial();
          mat.diffuseMap = textureAsset.resource; // put the image on the plane
          mat.useLighting = false; // keeps the colours exact
          mat.update();
          planeEntity.render.material = mat;

          const wallName = child.name; // the wall or floor you're attaching to

          // Position and rotate based on wall/floor and button index
          positionUploadedContent(planeEntity, wallName, buttonIndex);

          // --- 4. Size, tag, push to bookkeeping ---------------------------------
          planeEntity.setLocalScale(1, 1, 1);
          planeEntity.userData = { frameId }; // keep your tag

          window.frames.push({
            frameId,
            position: planeEntity.getLocalPosition().clone(),
            rotation: WALL_PROPS[wallName].rotation, // existing helper
            scale: { x: 1, y: 1, z: 1 },
            assetUrl: `${fileUrl}-${wallName}`, // png/jpg url
          });

          // --- 5. Physics / controls, then parent to the wall --------------------
          addPhysicsAndControls(planeEntity);
          child.addChild(planeEntity);
        });

        textureAsset.on('error', (err) => {
          console.error('Error loading texture asset:', err);
        });

        app.assets.load(textureAsset);
      };
      reader.readAsDataURL(file);
    }

    // Handle video uploads (to frame)
    async function handleVideoUpload(file, buttonIndex) {
      const frameId = Math.floor(Math.random() * 1e9);
      const { fileUrl } = await uploadToS3({
        // ❷ upload once
        file,
        userId: Number(userIdParam),
        frameId,
      });
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataURL = e.target.result;
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.onloadedmetadata = function () {
          const width = videoElement.videoWidth;
          const height = videoElement.videoHeight;
          const tolerance = 10; // pixels, adjust tolerance as needed

          if (Math.abs(width - height) < tolerance) {
            console.log('Square video');
          } else if (width > height) {
            console.log('Landscape video');
          } else {
            console.log('Portrait video');
          }
        };
        videoElement.src = dataURL;
        const videoId = `uploadedVideo_${buttonIndex}_${Date.now()}`;

        // Create video element
        let videoElem = document.getElementById(videoId);
        if (!videoElem) {
          videoElem = document.createElement('video');
          videoElem.id = videoId;
          videoElem.loop = true;
          videoElem.muted = false;
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

        videoElem.addEventListener('loadedmetadata', function () {
          videoTexture.resize(videoElem.videoWidth, videoElem.videoHeight);
        });

        // When video can play, set up texture initially
        videoElem.addEventListener('canplaythrough', function () {
          videoTexture.setSource(videoElem);
        });

        // Create an update callback to refresh the video texture each frame
        const updateVideoTexture = () => {
          if (videoElem && videoElem.readyState >= 2) {
            // HAVE_CURRENT_DATA or higher
            videoTexture.upload();
          }
        };

        const planeEntity = new pc.Entity('framePlane');
        planeEntity.addComponent('render', { type: 'plane' }); // 1×1 quad

        // --- 2. Create / assign a material -------------------------------------
        const mat = new pc.StandardMaterial();
        mat.diffuseMap = videoTexture; // put the video on the plane
        mat.useLighting = false; // keeps the colours exact
        mat.update();
        planeEntity.render.material = mat;

        const wallName = child.name; // the wall or floor you're attaching to

        // Position and rotate based on wall/floor and button index
        positionUploadedContent(planeEntity, wallName, buttonIndex);

        // --- 4. Size, tag, push to bookkeeping ---------------------------------
        planeEntity.setLocalScale(1, 1, 1);
        planeEntity.userData = { frameId }; // keep your tag

        window.frames.push({
          frameId,
          position: planeEntity.getLocalPosition().clone(),
          rotation: WALL_PROPS[wallName].rotation, // existing helper
          scale: { x: 0.5, y: 0.5, z: 0.5 },
          assetUrl: `${fileUrl}-${wallName}`, // png/jpg url
        });

        // --- 5. Physics / controls, then parent to the wall --------------------
        addPhysicsAndControls(planeEntity);
        child.addChild(planeEntity);

        // Start the video
        videoElem.play().catch((err) => {
          console.error('Error playing video:', err);
        });

        // Register the update callback to run every frame
        app.on('update', updateVideoTexture);

        planeEntity.videoElement = videoElem;
        planeEntity.videoUpdateFunc = updateVideoTexture;

        // Optional: Add cleanup when entity is destroyed
        planeEntity.on('destroy', function () {
          app.off('update', updateVideoTexture);
          if (videoElem && videoElem.parentNode) {
            videoElem.pause();
            videoElem.parentNode.removeChild(videoElem);
          }
        });
      };

      // Read the file as data URL
      reader.readAsDataURL(file);
    }

    // Handle GLB uploads (3D models)
    async function handleGlbUpload(file, buttonIndex) {
      const frameId = Math.floor(Math.random() * 1e9);
      const assetId = frameId;
      const { fileUrl } = await uploadToS3({
        // ❷ upload once
        file,
        userId: Number(userIdParam),
        frameId,
      });

      const reader = new FileReader();
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;

        // Create a Blob from the array buffer
        const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
        const blobUrl = URL.createObjectURL(blob);

        // Create a container asset for the uploaded GLB
        const uploadedGlbAsset = new pc.Asset(
          `uploadedModel_${child.name}_${buttonIndex}_${Date.now()}`,
          'container',
          {
            url: blobUrl,
          },
        );

        app.assets.add(uploadedGlbAsset);

        uploadedGlbAsset.on('load', () => {
          console.log('GLB model loaded:', uploadedGlbAsset.resource);

          // Instantiate the model
          const containerResource = uploadedGlbAsset.resource;
          const newEntity = containerResource.instantiateRenderEntity();

          console.log(newEntity);

          const wallName = child.name; // the wall or floor you're attaching to

          // Position and rotate based on wall/floor and button index
          positionUploadedContent(newEntity, wallName, buttonIndex);

          newEntity.setLocalScale(1, 1, 1);
          newEntity.userData = { assetId }; // 1️⃣ tag
          window.assets3d.push({
            // 2️⃣ push to the *other* array
            assetId,
            assetSize: `${(file.size / 1024).toFixed(0)} KB`,
            position: newEntity.getLocalPosition().clone(),
            rotation: WALL_PROPS[wallName].rotation,
            scale: { x: 1, y: 1, z: 1 },
            Asset3dUrl: `${fileUrl}-${wallName}`,
          });

          // Add physics and controls
          addPhysicsAndControls(newEntity);

          // Add to scene
          child.addChild(newEntity);

          // Set as controlled entity for joystick controls
          setControlledEntity(newEntity);

          // Clean up the blob URL
          URL.revokeObjectURL(blobUrl);
        });

        uploadedGlbAsset.on('error', (err) => {
          console.error('Error loading uploaded GLB model:', err);
          URL.revokeObjectURL(blobUrl);
        });

        app.assets.load(uploadedGlbAsset);
      };

      reader.readAsArrayBuffer(file);
    }

    // Helper function to add physics and controls to an entity
    function addPhysicsAndControls(entity) {
      entity.findComponents('render').forEach((render) => {
        const renderEntity = render.entity;
        renderEntity.addComponent('rigidbody', {
          type: 'static',
        });
        renderEntity.addComponent('collision', {
          type: 'mesh',
          renderAsset: render.asset,
        });
      });

      // Set as controlled entity for joystick controls
      setControlledEntity(entity);
    }

    // Common function to position uploaded content (images, videos, GLB)
    function positionUploadedContent(entity, wallName, buttonIndex, isText) {
      // Default positions and rotations
      let basePosition, baseRotation;

      if (wallName === 'Floor') {
        // For floor, position at the appropriate quadrant
        basePosition = new pc.Vec3(4.98, 0.07, 0.122);
        if (isText) {
          baseRotation = new pc.Vec3(-90, 0, 0);
        } else {
          baseRotation = new pc.Vec3(0, 0, 0);
        }

        // Special case for Floor Button 3 - use the exact same position as the button
        if (buttonIndex === 3) {
          // Use the static position for Button 3
          basePosition = new pc.Vec3(-0.7675482225129329, 0.07, -0.7479815453883175);
        } else {
          // Get dimensions of the floor
          const width = window.maxPoint.x - window.minPoint.x;
          const length = window.maxPoint.z - window.minPoint.z;

          // Calculate position in the appropriate quadrant
          let xOffset, zOffset;
          switch (buttonIndex) {
            case 1: // top-left quadrant
              xOffset = -width / 4;
              zOffset = length / 4;
              break;
            case 2: // top-right quadrant
              xOffset = width / 4;
              zOffset = length / 4;
              break;
            // Case 3 handled in the special case above
            case 4: // bottom-right quadrant
              xOffset = width / 4;
              zOffset = -length / 4;
              break;
          }

          // Calculate the position in the center of the quadrant
          const centerX = window.minPoint.x + width / 2 + xOffset;
          const centerZ = window.minPoint.z + length / 2 + zOffset;

          // Set position
          basePosition.x = centerX;
          basePosition.z = centerZ;
        }
      } else if (wallName.includes('Wall')) {
        // For walls, position at left or right half with correct rotations
        switch (wallName) {
          case 'Back_Left_Wall':
            if (isText) {
              baseRotation = new pc.Vec3(0, -180, 0);
            } else {
              baseRotation = new pc.Vec3(-90, 0, 180);
            }
            basePosition = new pc.Vec3(-0.85, 1.932, 6.108);

            break;
          case 'Back_Right_Wall':
            if (isText) {
              baseRotation = new pc.Vec3(0, -90, 0);
            } else {
              baseRotation = new pc.Vec3(90, -90, 0);
            }
            basePosition = new pc.Vec3(6.68, 1.9, 0);

            break;
          case 'Front_Right_Wall':
            if (isText) {
              baseRotation = new pc.Vec3(0, 0, 0);
            } else {
              baseRotation = new pc.Vec3(90, 0, 0);
            }
            basePosition = new pc.Vec3(0, 1.84, -6.81);

            break;
          case 'Front_Left_Wall':
            if (isText) {
              baseRotation = new pc.Vec3(0, 90, 0);
            } else {
              baseRotation = new pc.Vec3(0, 90, -90);
            }
            basePosition = new pc.Vec3(-6.71, 1.3, 0);

            break;
        }

        // Calculate the vertical center
        const height = window.maxPoint.y - window.minPoint.y;
        const verticalCenter = window.minPoint.y + height / 2;
        basePosition.y = verticalCenter;

        // Adjust position based on button index for walls
        if (wallName === 'Back_Left_Wall') {
          // Adjust X position based on button index
          const width = window.maxPoint.x - window.minPoint.x;
          const halfWidth = width / 2;
          const xPos =
            buttonIndex === 1
              ? window.minPoint.x + halfWidth / 2
              : window.minPoint.x + halfWidth + halfWidth / 2;
          basePosition.x = xPos;
        } else if (wallName === 'Back_Right_Wall') {
          // Adjust Z position based on button index
          const width = window.maxPoint.z - window.minPoint.z;
          const halfWidth = width / 2;
          const zPos =
            buttonIndex === 1
              ? window.minPoint.z + halfWidth / 2
              : window.minPoint.z + halfWidth + halfWidth / 2;
          basePosition.z = zPos;
        } else if (wallName === 'Front_Right_Wall') {
          // Adjust X position based on button index
          const width = window.maxPoint.x - window.minPoint.x;
          const halfWidth = width / 2;
          const xPos =
            buttonIndex === 1
              ? window.minPoint.x + halfWidth / 2
              : window.minPoint.x + halfWidth + halfWidth / 2;
          basePosition.x = xPos;
        } else if (wallName === 'Front_Left_Wall') {
          // Adjust Z position based on button index
          const width = window.maxPoint.z - window.minPoint.z;
          const halfWidth = width / 2;
          const zPos =
            buttonIndex === 1
              ? window.minPoint.z + halfWidth / 2
              : window.minPoint.z + halfWidth + halfWidth / 2;
          basePosition.z = zPos;
        }
      } else if (wallName === 'Roof') {
        // For roof entities, Y should be 4.93 for quadrant 3 and 5.3 for others
        const contentY3 = 5.19; // Y for content in quadrant 3
        const contentY = 5.85; // Y for content in other quadrants

        basePosition = new pc.Vec3(4.98, contentY, 0.122); // Default uses non-quadrant-3 Y

        if (isText) {
          baseRotation = new pc.Vec3(90, 0, 0);
        } else {
          baseRotation = new pc.Vec3(180, 0, 0);
        }
        // Match WALL_PROPS.Roof.rotation

        // Get dimensions of the roof
        const width = window.maxPoint.x - window.minPoint.x;
        const length = window.maxPoint.z - window.minPoint.z;

        // Special case for Button 3 - use the exact same position as the button but with the correct y value
        if (buttonIndex === 3) {
          // Use the static position for Button 3 but with the correct y value for entities
          basePosition = new pc.Vec3(-0.7675482225129329, contentY3, -0.7479815453883175);
        } else {
          // Calculate position in the appropriate quadrant
          let xOffset, zOffset;
          switch (buttonIndex) {
            case 1: // top-left quadrant
              xOffset = -width / 4;
              zOffset = length / 4;
              break;
            case 2: // top-right quadrant
              xOffset = width / 4;
              zOffset = length / 4;
              break;
            case 4: // bottom-right quadrant
              xOffset = width / 4;
              zOffset = -length / 4;
              break;
          }

          // Calculate the position in the center of the quadrant
          const centerX = window.minPoint.x + width / 2 + xOffset;
          const centerZ = window.minPoint.z + length / 2 + zOffset;

          // Set position with non-quadrant-3 Y value
          basePosition.x = centerX;
          basePosition.z = centerZ;
        }
      }

      entity.setLocalPosition(basePosition.x, basePosition.y, basePosition.z);
      entity.setLocalEulerAngles(baseRotation.x, baseRotation.y, baseRotation.z);
    }

    function createFloorButton(floorEntity, buttonIndex) {
      const buttonName = `uploadButton_${floorEntity.name}_${buttonIndex}`;
      const buttonEntity = new pc.Entity(buttonName);
      buttonEntity.tags.add(`plusButton-Floor-${buttonIndex}`);
      buttonEntity.tags.add('plusButton');

      buttonEntity.enabled = previewMode;

      buttonEntity.addComponent('button');
      buttonEntity.addComponent('element', {
        anchor: [0.5, 0.5, 0.5, 0.5],
        width: 0.2,
        height: 0.2,
        pivot: [0.5, 0.5],
        type: pc.ELEMENTTYPE_IMAGE,
        useInput: true,
        textureAsset: null,
      });

      // Get the min and max points of the floor to calculate button positions
      setMinMax(floorEntity);

      // Calculate position based on quadrant
      positionFloorButton(buttonEntity, floorEntity, buttonIndex);

      buttonEntity.setLocalScale(5, 5, 5);

      // Load button texture
      const buttonTextureAsset = new pc.Asset(
        `ButtonTexture_${floorEntity.name}_${buttonIndex}`,
        'texture',
        {
          url: '../../public/images/squaree.png',
        },
      );
      app.assets.add(buttonTextureAsset);
      app.assets.load(buttonTextureAsset);
      buttonTextureAsset.on('load', () => {
        buttonEntity.element.textureAsset = buttonTextureAsset;
      });

      // Create file input
      const fileInputId = `fileInput_${floorEntity.name}_${buttonIndex}`;
      let fileInput = document.getElementById(fileInputId);
      if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,video/*,.glb'; // Accept images, videos and GLB files
        fileInput.id = fileInputId;
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
      }

      // Button click handler
      buttonEntity.button.on('click', () => {
        console.log(`Floor Button ${buttonIndex} clicked`);
        window.isFloor = true;
        window.currentButtonIndex = buttonIndex;
        setMinMax(floorEntity);
        createSelectionMenu();
      });

      // File input handler
      fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const mode = this.getAttribute('data-mode');

        // Apply texture to entire object
        if (file.type.startsWith('image/')) {
          handleImageUpload(file, buttonIndex);
        } else if (file.type.startsWith('video/')) {
          handleVideoUpload(file, buttonIndex);
        } else if (file.name.toLowerCase().endsWith('.glb')) {
          handleGlbUpload(file, buttonIndex);
        } else {
          console.error('Unsupported file type');
        }

        this.value = ''; // Reset file input
      });
    }

    // Function to position the button on the floor based on the quadrant index
    function positionFloorButton(buttonEntity, floorEntity, quadrantIndex) {
      // Base position and rotation for floor
      const basePosition = new pc.Vec3(4.98, 0.05, 0.122);
      const baseRotation = new pc.Vec3(-90, 0, 0);

      // Calculate the floor's width and length
      const width = window.maxPoint.x - window.minPoint.x; // width along x-axis
      const length = window.maxPoint.z - window.minPoint.z; // length along z-axis

      // Use static position for Floor Button 3
      if (quadrantIndex === 3) {
        // Static position for Floor Button 3
        const staticPosition = new pc.Vec3(-0.7675482225129329, 0.05, -0.7479815453883175);
        buttonEntity.setLocalPosition(staticPosition.x, staticPosition.y, staticPosition.z);
        buttonEntity.setLocalEulerAngles(baseRotation?.x, baseRotation?.y, baseRotation?.z);
        floorEntity.addChild(buttonEntity);
        return;
      }

      // For other buttons, calculate positions dynamically
      let xOffset, zOffset;

      // Determine quadrant position
      // 1: top-left, 2: top-right, 3: bottom-left, 4: bottom-right
      switch (quadrantIndex) {
        case 1: // top-left quadrant
          xOffset = -width / 4;
          zOffset = length / 4;
          break;
        case 2: // top-right quadrant
          xOffset = width / 4;
          zOffset = length / 4;
          break;
        case 3: // bottom-left quadrant (shouldn't reach here for button 3)
          xOffset = -width / 4;
          zOffset = -length / 4;
          break;
        case 4: // bottom-right quadrant
          xOffset = width / 4;
          zOffset = -length / 4;
          break;
      }

      // Calculate the position in the center of the quadrant
      const centerX = window.minPoint.x + width / 2 + xOffset;
      const centerZ = window.minPoint.z + length / 2 + zOffset;

      // Set the button position in the center of the quadrant
      buttonEntity.setLocalPosition(centerX, basePosition.y, centerZ);
      buttonEntity.setLocalEulerAngles(baseRotation?.x, baseRotation?.y, baseRotation?.z);
      floorEntity.addChild(buttonEntity);
    }

    function createRoofButton(roofEntity, buttonIndex) {
      const buttonName = `uploadButton_${roofEntity.name}_${buttonIndex}`;
      const buttonEntity = new pc.Entity(buttonName);
      buttonEntity.tags.add(`plusButton-Roof-${buttonIndex}`);
      buttonEntity.tags.add('plusButton');

      buttonEntity.enabled = previewMode;

      buttonEntity.addComponent('button');
      buttonEntity.addComponent('element', {
        anchor: [0.5, 0.5, 0.5, 0.5],
        width: 0.2,
        height: 0.2,
        pivot: [0.5, 0.5],
        type: pc.ELEMENTTYPE_IMAGE,
        useInput: true,
        textureAsset: null,
      });

      // Get the min and max points of the roof
      setMinMax(roofEntity);

      // Calculate position based on quadrant
      positionRoofButton(buttonEntity, roofEntity, buttonIndex);

      buttonEntity.setLocalScale(5, 5, 5);

      // Load button texture
      const buttonTextureAsset = new pc.Asset(
        `ButtonTexture_${roofEntity.name}_${buttonIndex}`,
        'texture',
        {
          url: '../../public/images/squaree.png',
        },
      );
      app.assets.add(buttonTextureAsset);
      app.assets.load(buttonTextureAsset);
      buttonTextureAsset.on('load', () => {
        buttonEntity.element.textureAsset = buttonTextureAsset;
      });

      // Create file input
      const fileInputId = `fileInput_${roofEntity.name}_${buttonIndex}`;
      let fileInput = document.getElementById(fileInputId);
      if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,video/*,.glb'; // Accept images, videos and GLB files
        fileInput.id = fileInputId;
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
      }

      // Button click handler
      buttonEntity.button.on('click', () => {
        console.log(`Roof Button ${buttonIndex} clicked`);
        window.isRoof = true; // Not floor
        window.currentButtonIndex = buttonIndex;
        setMinMax(roofEntity);
        createSelectionMenu();
      });

      // File input handler
      fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        // Apply texture to entire object
        if (file.type.startsWith('image/')) {
          handleImageUpload(file, buttonIndex);
        } else if (file.type.startsWith('video/')) {
          handleVideoUpload(file, buttonIndex);
        } else if (file.name.toLowerCase().endsWith('.glb')) {
          handleGlbUpload(file, buttonIndex);
        } else {
          console.error('Unsupported file type');
        }

        this.value = ''; // Reset file input
      });
    }

    // Fourth change: Add a new function to position the roof buttons
    function positionRoofButton(buttonEntity, roofEntity, quadrantIndex) {
      // Button y-coordinate should be 4.945 for quadrant 3 and 5.251 for others
      // const buttonY3 = 4.945; // Specific Y for quadrant 3
      const buttonY3 = 5.2;
      const buttonY = 5.86; // Updated Y for other quadrants (was 5.28)

      // Button rotation should be [90, 0, 0]
      const buttonRotation = new pc.Vec3(90, 0, 0);

      // Calculate the roof's width and length based on min/max points
      const width = window.maxPoint.x - window.minPoint.x; // width along x-axis
      const length = window.maxPoint.z - window.minPoint.z; // length along z-axis

      // Use static position for Roof Button 3 (same x,z as Floor Button 3)
      if (quadrantIndex === 3) {
        // Static position for Roof Button 3, using same x,z as Floor Button 3
        const staticPosition = new pc.Vec3(-0.7675482225129329, buttonY3, -0.7479815453883175);
        buttonEntity.setLocalPosition(staticPosition.x, staticPosition.y, staticPosition.z);
        buttonEntity.setLocalEulerAngles(buttonRotation.x, buttonRotation.y, buttonRotation.z);
        roofEntity.addChild(buttonEntity);
        return;
      }

      // For other buttons, calculate positions dynamically
      let xOffset, zOffset;

      // Determine quadrant position
      // 1: top-left, 2: top-right, 3: bottom-left, 4: bottom-right
      switch (quadrantIndex) {
        case 1: // top-left quadrant
          xOffset = -width / 4;
          zOffset = length / 4;
          break;
        case 2: // top-right quadrant
          xOffset = width / 4;
          zOffset = length / 4;
          break;
        case 4: // bottom-right quadrant
          xOffset = width / 4;
          zOffset = -length / 4;
          break;
      }

      // Calculate the position in the center of the quadrant
      const centerX = window.minPoint.x + width / 2 + xOffset;
      const centerZ = window.minPoint.z + length / 2 + zOffset;

      // Set the button position in the center of the quadrant
      buttonEntity.setLocalPosition(centerX, buttonY, centerZ);
      buttonEntity.setLocalEulerAngles(buttonRotation.x, buttonRotation.y, buttonRotation.z);
      roofEntity.addChild(buttonEntity);
    }
  });
}
