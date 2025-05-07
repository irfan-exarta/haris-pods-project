import * as pc from 'playcanvas';

export function addPrefixToPodData(podObject, prefix) {
  // Make a shallow copy so we don’t mutate the original
  const updated = { ...podObject };

  // Only modify fields if they exist and aren’t already absolute (e.g., "http://", "https://")
  // If you always want to force this prefix, you can skip the "startsWith" checks.

  // 1) Pod Display Image
  if (updated.podDispalyImage && !isAbsoluteUrl(updated.podDispalyImage)) {
    updated.podDispalyImage = prefix + updated.podDispalyImage;
  }

  // 2) Pod settings: Glb, Skybox, Floor
  if (updated.podSettingsGlobal) {
    const globalCopy = { ...updated.podSettingsGlobal };

    if (globalCopy.podGlbUrl && !isAbsoluteUrl(globalCopy.podGlbUrl)) {
      globalCopy.podGlbUrl = prefix + globalCopy.podGlbUrl;
    }

    if (globalCopy.skyboxUrl && !isAbsoluteUrl(globalCopy.skyboxUrl)) {
      globalCopy.skyboxUrl = prefix + globalCopy.skyboxUrl;
    }

    if (globalCopy.floorCubemapUrl && !isAbsoluteUrl(globalCopy.floorCubemapUrl)) {
      globalCopy.floorCubemapUrl = prefix + globalCopy.floorCubemapUrl;
    }

    updated.podSettingsGlobal = globalCopy;
  }

  return updated;
}

/**
 * Utility to check if a string is already an absolute URL
 */

window.CurrentText = null;
export function isAbsoluteUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

// export async function uploadToS3({ file, userId, frameId }) {
//   const form = new FormData();
//   form.append('userId', userId);
//   form.append('frameId', frameId);
//   form.append('file', file);

//   const res = await fetch(`${import.meta.env.VITE_LINK}/api/posts/upload`, {
//     method: 'POST',
//     body: form,
//   });

//   if (!res.ok) {
//     const { error } = await res.json().catch(() => ({ error: res.statusText }));
//     throw new Error(`Upload failed – ${error}`);
//   }

//   const { fileUrl, mediaType } = await res.json();
//   return { fileUrl, mediaType };
// }
// let joystickElements = null;
// export function showJoystickControls() {
//   // Don't show controls if edit mode is disabled
//   if (window.editMode === false) {
//     return;
//   }

//   if (!joystickElements) {
//     joystickElements = getOrCreateJoystickElements();
//   }

//   joystickVisible = true;
//   joystickElements.joystickContainer.style.display = 'block';
//   joystickElements.toggleButton.style.display = 'block';
//   joystickElements.toggleButton.innerText = 'Hide Controls';
// }

// // Get or create joystick elements
// export function getOrCreateJoystickElements() {
//   let joystickContainer = document.getElementById('joystick-container');
//   let toggleButton = document.getElementById('joystick-toggle');

//   if (!joystickContainer || !toggleButton) {
//     const elements = createJoystickElements();
//     joystickContainer = elements.joystickContainer;
//     toggleButton = elements.toggleButton;
//   }

//   return { joystickContainer, toggleButton };
// }

// export function positionButtonOnWall(buttonEntity, wallEntity, buttonIndex) {
//   // Default position and rotation from the base code
//   let basePosition, baseRotation;

//   // Get base position and rotation for each wall
//   if (wallEntity.name === 'Back_Left_Wall') {
//     basePosition = new pc.Vec3(-0.85, 1.932, 6.608);
//     baseRotation = new pc.Vec3(0, -180, 0);
//   } else if (wallEntity.name === 'Back_Right_Wall') {
//     basePosition = new pc.Vec3(6.7, 1.9, 0);
//     baseRotation = new pc.Vec3(0, -90, 0);
//   } else if (wallEntity.name === 'Front_Right_Wall') {
//     basePosition = new pc.Vec3(0, 1.84, -6.82);
//     baseRotation = new pc.Vec3(0, 0, 0);
//   } else if (wallEntity.name === 'Front_Left_Wall') {
//     basePosition = new pc.Vec3(-6.78, 1.3, 0);
//     baseRotation = new pc.Vec3(0, 90, 0);
//   }

//   // Calculate position based on min/max points and button index
//   // For each wall, we need to adjust specific coordinates based on its orientation
//   let newPosition = basePosition?.clone();

//   // For vertical centering, we'll use the height of the wall (y-dimension)
//   const height = window.maxPoint.y - window.minPoint.y;
//   const verticalCenter = window.minPoint.y + height / 2;

//   if (wallEntity.name === 'Back_Left_Wall') {
//     // Adjust the X coordinate for Back_Left_Wall
//     const width = window.maxPoint.x - window.minPoint.x;
//     const halfWidth = width / 2;
//     // Button 1 goes on the left half, Button 2 on the right half
//     const xPos =
//       buttonIndex === 1
//         ? window.minPoint.x + halfWidth / 2
//         : window.minPoint.x + halfWidth + halfWidth / 2;
//     newPosition.x = xPos;
//     newPosition.y = verticalCenter; // Center vertically
//   } else if (wallEntity.name === 'Back_Right_Wall') {
//     // Adjust the Z coordinate for Back_Right_Wall
//     const width = window.maxPoint.z - window.minPoint.z;
//     const halfWidth = width / 2;
//     // Button 1 goes on the left half, Button 2 on the right half
//     const zPos =
//       buttonIndex === 1
//         ? window.minPoint.z + halfWidth / 2
//         : window.minPoint.z + halfWidth + halfWidth / 2;
//     newPosition.z = zPos;
//     newPosition.y = verticalCenter; // Center vertically
//   } else if (wallEntity.name === 'Front_Right_Wall') {
//     // Adjust the X coordinate for Front_Right_Wall
//     const width = window.maxPoint.x - window.minPoint.x;
//     const halfWidth = width / 2;
//     // Button 1 goes on the left half, Button 2 on the right half
//     const xPos =
//       buttonIndex === 1
//         ? window.minPoint.x + halfWidth / 2
//         : window.minPoint.x + halfWidth + halfWidth / 2;
//     newPosition.x = xPos;
//     newPosition.y = verticalCenter; // Center vertically
//   } else if (wallEntity.name === 'Front_Left_Wall') {
//     // Adjust the Z coordinate for Front_Left_Wall
//     const width = window.maxPoint.z - window.minPoint.z;
//     const halfWidth = width / 2;
//     // Button 1 goes on the left half, Button 2 on the right half
//     const zPos =
//       buttonIndex === 1
//         ? window.minPoint.z + halfWidth / 2
//         : window.minPoint.z + halfWidth + halfWidth / 2;
//     newPosition.z = zPos;
//     newPosition.y = verticalCenter; // Center vertically
//   }

//   buttonEntity.setLocalPosition(newPosition);
//   buttonEntity.setLocalEulerAngles(baseRotation?.x, baseRotation?.y, baseRotation?.z);
//   wallEntity.addChild(buttonEntity);
// }

// export function positionRoofButton(buttonEntity, roofEntity, quadrantIndex) {
//   // Button y-coordinate should be 4.945 for quadrant 3 and 5.251 for others
//   // const buttonY3 = 4.945; // Specific Y for quadrant 3
//   const buttonY3 = 5.2;
//   const buttonY = 5.86; // Updated Y for other quadrants (was 5.28)

//   // Button rotation should be [90, 0, 0]
//   const buttonRotation = new pc.Vec3(90, 0, 0);

//   // Calculate the roof's width and length based on min/max points
//   const width = window.maxPoint.x - window.minPoint.x; // width along x-axis
//   const length = window.maxPoint.z - window.minPoint.z; // length along z-axis

//   // Use static position for Roof Button 3 (same x,z as Floor Button 3)
//   if (quadrantIndex === 3) {
//     // Static position for Roof Button 3, using same x,z as Floor Button 3
//     const staticPosition = new pc.Vec3(-0.7675482225129329, buttonY3, -0.7479815453883175);
//     buttonEntity.setLocalPosition(staticPosition.x, staticPosition.y, staticPosition.z);
//     buttonEntity.setLocalEulerAngles(buttonRotation.x, buttonRotation.y, buttonRotation.z);
//     roofEntity.addChild(buttonEntity);
//     return;
//   }

//   // For other buttons, calculate positions dynamically
//   let xOffset, zOffset;

//   // Determine quadrant position
//   // 1: top-left, 2: top-right, 3: bottom-left, 4: bottom-right
//   switch (quadrantIndex) {
//     case 1: // top-left quadrant
//       xOffset = -width / 4;
//       zOffset = length / 4;
//       break;
//     case 2: // top-right quadrant
//       xOffset = width / 4;
//       zOffset = length / 4;
//       break;
//     case 4: // bottom-right quadrant
//       xOffset = width / 4;
//       zOffset = -length / 4;
//       break;
//   }

//   // Calculate the position in the center of the quadrant
//   const centerX = window.minPoint.x + width / 2 + xOffset;
//   const centerZ = window.minPoint.z + length / 2 + zOffset;

//   // Set the button position in the center of the quadrant
//   buttonEntity.setLocalPosition(centerX, buttonY, centerZ);
//   buttonEntity.setLocalEulerAngles(buttonRotation.x, buttonRotation.y, buttonRotation.z);
//   roofEntity.addChild(buttonEntity);
// }

// export function positionFloorButton(buttonEntity, floorEntity, quadrantIndex) {
//   // Base position and rotation for floor
//   const basePosition = new pc.Vec3(4.98, 0.05, 0.122);
//   const baseRotation = new pc.Vec3(-90, 0, 0);

//   // Calculate the floor's width and length
//   const width = window.maxPoint.x - window.minPoint.x; // width along x-axis
//   const length = window.maxPoint.z - window.minPoint.z; // length along z-axis

//   // Use static position for Floor Button 3
//   if (quadrantIndex === 3) {
//     // Static position for Floor Button 3
//     const staticPosition = new pc.Vec3(-0.7675482225129329, 0.05, -0.7479815453883175);
//     buttonEntity.setLocalPosition(staticPosition.x, staticPosition.y, staticPosition.z);
//     buttonEntity.setLocalEulerAngles(baseRotation?.x, baseRotation?.y, baseRotation?.z);
//     floorEntity.addChild(buttonEntity);
//     return;
//   }

//   // For other buttons, calculate positions dynamically
//   let xOffset, zOffset;

//   // Determine quadrant position
//   // 1: top-left, 2: top-right, 3: bottom-left, 4: bottom-right
//   switch (quadrantIndex) {
//     case 1: // top-left quadrant
//       xOffset = -width / 4;
//       zOffset = length / 4;
//       break;
//     case 2: // top-right quadrant
//       xOffset = width / 4;
//       zOffset = length / 4;
//       break;
//     case 3: // bottom-left quadrant (shouldn't reach here for button 3)
//       xOffset = -width / 4;
//       zOffset = -length / 4;
//       break;
//     case 4: // bottom-right quadrant
//       xOffset = width / 4;
//       zOffset = -length / 4;
//       break;
//   }

//   // Calculate the position in the center of the quadrant
//   const centerX = window.minPoint.x + width / 2 + xOffset;
//   const centerZ = window.minPoint.z + length / 2 + zOffset;

//   // Set the button position in the center of the quadrant
//   buttonEntity.setLocalPosition(centerX, basePosition.y, centerZ);
//   buttonEntity.setLocalEulerAngles(baseRotation?.x, baseRotation?.y, baseRotation?.z);
//   floorEntity.addChild(buttonEntity);
// }

// export function positionUploadedContent(entity, wallName, buttonIndex) {
//   // Default positions and rotations
//   let basePosition, baseRotation;

//   if (wallName === 'Floor') {
//     // For floor, position at the appropriate quadrant
//     basePosition = new pc.Vec3(4.98, 0.07, 0.122);
//     baseRotation = new pc.Vec3(0, 0, 0);

//     // Special case for Floor Button 3 - use the exact same position as the button
//     if (buttonIndex === 3) {
//       // Use the static position for Button 3
//       basePosition = new pc.Vec3(-0.7675482225129329, 0.07, -0.7479815453883175);
//     } else {
//       // Get dimensions of the floor
//       const width = window.maxPoint.x - window.minPoint.x;
//       const length = window.maxPoint.z - window.minPoint.z;

//       // Calculate position in the appropriate quadrant
//       let xOffset, zOffset;
//       switch (buttonIndex) {
//         case 1: // top-left quadrant
//           xOffset = -width / 4;
//           zOffset = length / 4;
//           break;
//         case 2: // top-right quadrant
//           xOffset = width / 4;
//           zOffset = length / 4;
//           break;
//         // Case 3 handled in the special case above
//         case 4: // bottom-right quadrant
//           xOffset = width / 4;
//           zOffset = -length / 4;
//           break;
//       }

//       // Calculate the position in the center of the quadrant
//       const centerX = window.minPoint.x + width / 2 + xOffset;
//       const centerZ = window.minPoint.z + length / 2 + zOffset;

//       // Set position
//       basePosition.x = centerX;
//       basePosition.z = centerZ;
//     }
//   } else if (wallName === 'Roof') {
//     // For roof entities, Y should be 4.93 for quadrant 3 and 5.3 for others
//     const contentY3 = 5.19; // Y for content in quadrant 3
//     const contentY = 5.85; // Y for content in other quadrants

//     basePosition = new pc.Vec3(4.98, contentY, 0.122); // Default uses non-quadrant-3 Y
//     baseRotation = new pc.Vec3(180, 0, 0); // Match WALL_PROPS.Roof.rotation

//     // Get dimensions of the roof
//     const width = window.maxPoint.x - window.minPoint.x;
//     const length = window.maxPoint.z - window.minPoint.z;

//     // Special case for Button 3 - use the exact same position as the button but with the correct y value
//     if (buttonIndex === 3) {
//       // Use the static position for Button 3 but with the correct y value for entities
//       basePosition = new pc.Vec3(-0.7675482225129329, contentY3, -0.7479815453883175);
//     } else {
//       // Calculate position in the appropriate quadrant
//       let xOffset, zOffset;
//       switch (buttonIndex) {
//         case 1: // top-left quadrant
//           xOffset = -width / 4;
//           zOffset = length / 4;
//           break;
//         case 2: // top-right quadrant
//           xOffset = width / 4;
//           zOffset = length / 4;
//           break;
//         case 4: // bottom-right quadrant
//           xOffset = width / 4;
//           zOffset = -length / 4;
//           break;
//       }

//       // Calculate the position in the center of the quadrant
//       const centerX = window.minPoint.x + width / 2 + xOffset;
//       const centerZ = window.minPoint.z + length / 2 + zOffset;

//       // Set position with non-quadrant-3 Y value
//       basePosition.x = centerX;
//       basePosition.z = centerZ;
//     }
//   } else {
//     // For walls, position at left or right half with correct rotations
//     switch (wallName) {
//       case 'Back_Left_Wall':
//         basePosition = new pc.Vec3(-0.85, 1.932, 6.108);
//         baseRotation = new pc.Vec3(-90, 0, 180);
//         break;
//       case 'Back_Right_Wall':
//         basePosition = new pc.Vec3(6.68, 1.9, 0);
//         baseRotation = new pc.Vec3(90, -90, 0);
//         break;
//       case 'Front_Right_Wall':
//         basePosition = new pc.Vec3(0, 1.84, -6.81);
//         baseRotation = new pc.Vec3(90, 0, 0);
//         break;
//       case 'Front_Left_Wall':
//         basePosition = new pc.Vec3(-6.71, 1.3, 0);
//         baseRotation = new pc.Vec3(0, 90, -90);
//         break;
//     }

//     // Calculate the vertical center
//     const height = window.maxPoint.y - window.minPoint.y;
//     const verticalCenter = window.minPoint.y + height / 2;
//     basePosition.y = verticalCenter;

//     // Adjust position based on button index for walls
//     if (wallName === 'Back_Left_Wall') {
//       // Adjust X position based on button index
//       const width = window.maxPoint.x - window.minPoint.x;
//       const halfWidth = width / 2;
//       const xPos =
//         buttonIndex === 1
//           ? window.minPoint.x + halfWidth / 2
//           : window.minPoint.x + halfWidth + halfWidth / 2;
//       basePosition.x = xPos;
//     } else if (wallName === 'Back_Right_Wall') {
//       // Adjust Z position based on button index
//       const width = window.maxPoint.z - window.minPoint.z;
//       const halfWidth = width / 2;
//       const zPos =
//         buttonIndex === 1
//           ? window.minPoint.z + halfWidth / 2
//           : window.minPoint.z + halfWidth + halfWidth / 2;
//       basePosition.z = zPos;
//     } else if (wallName === 'Front_Right_Wall') {
//       // Adjust X position based on button index
//       const width = window.maxPoint.x - window.minPoint.x;
//       const halfWidth = width / 2;
//       const xPos =
//         buttonIndex === 1
//           ? window.minPoint.x + halfWidth / 2
//           : window.minPoint.x + halfWidth + halfWidth / 2;
//       basePosition.x = xPos;
//     } else if (wallName === 'Front_Left_Wall') {
//       // Adjust Z position based on button index
//       const width = window.maxPoint.z - window.minPoint.z;
//       const halfWidth = width / 2;
//       const zPos =
//         buttonIndex === 1
//           ? window.minPoint.z + halfWidth / 2
//           : window.minPoint.z + halfWidth + halfWidth / 2;
//       basePosition.z = zPos;
//     }
//   }

//   entity.setLocalPosition(basePosition.x, basePosition.y, basePosition.z);
//   entity.setLocalEulerAngles(baseRotation.x, baseRotation.y, baseRotation.z);
// }

// export function setControlledEntity(entity) {
//   if (!entity) return;

//   window.currentControlledEntity = entity;
//   console.log('Now controlling entity:', entity.name, entity);

//   showJoystickControls();
// }

// export function setupJoystickControls(joystickBase, joystickKnob, toggleButton) {
//   let isDragging = false;
//   const maxDistance = 40; // Maximum knob movement distance

//   // Toggle button functionality
//   toggleButton.addEventListener('click', (e) => {
//     e.stopPropagation(); // Stop event propagation
//     window.joystickVisible = !window.joystickVisible;
//     joystickBase.parentElement.style.display = window.joystickVisible ? 'block' : 'none';
//     toggleButton.innerText = window.joystickVisible ? 'Hide Controls' : 'Show Controls';
//   });

//   // Add click event with stopPropagation to joystick container
//   const joystickContainer = joystickBase.parentElement;
//   joystickContainer.addEventListener('click', (e) => {
//     e.stopPropagation();
//   });

//   // Add click event with stopPropagation to joystick knob
//   joystickKnob.addEventListener('click', (e) => {
//     e.stopPropagation();
//   });

//   // Mouse events
//   joystickBase.addEventListener('mousedown', handleStart);
//   document.addEventListener('mousemove', handleMove);
//   document.addEventListener('mouseup', handleEnd);

//   // Touch events
//   joystickBase.addEventListener('touchstart', handleStart, { passive: false });
//   document.addEventListener('touchmove', handleMove, { passive: false });
//   document.addEventListener('touchend', handleEnd);

//   function handleStart(e) {
//     e.preventDefault();
//     e.stopPropagation(); // Add stopPropagation here
//     isDragging = true;
//     updateKnobPosition(e);
//   }

//   function handleMove(e) {
//     if (!isDragging) return;
//     e.preventDefault();
//     e.stopPropagation(); // Add stopPropagation here
//     updateKnobPosition(e);
//   }

//   function handleEnd(e) {
//     if (!isDragging) return;
//     if (e) e.stopPropagation(); // Add stopPropagation here (conditional in case no event is passed)
//     isDragging = false;

//     // Reset knob to center
//     joystickKnob.style.left = '50%';
//     joystickKnob.style.top = '50%';
//     joystickKnob.style.transform = 'translate(-50%, -50%)';

//     // Stop entity movement
//     if (window.currentControlledEntity) {
//       moveEntity(0, 0, window.currentControlledEntity.parent.name);
//     }
//   }

//   function updateKnobPosition(e) {
//     const rect = joystickBase.getBoundingClientRect();
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;

//     // Get cursor/touch position
//     let clientX, clientY;
//     if (e.type.startsWith('touch')) {
//       clientX = e.touches[0].clientX;
//       clientY = e.touches[0].clientY;
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }

//     // Calculate distance from center
//     let deltaX = clientX - rect.left - centerX;
//     let deltaY = clientY - rect.top - centerY;

//     // Limit distance
//     const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
//     if (distance > maxDistance) {
//       const scale = maxDistance / distance;
//       deltaX *= scale;
//       deltaY *= scale;
//     }

//     // Update knob position
//     joystickKnob.style.left = `calc(50% + ${deltaX}px)`;
//     joystickKnob.style.top = `calc(50% + ${deltaY}px)`;

//     // Move the controlled entity
//     if (window.currentControlledEntity) {
//       // Normalize values to -1 to 1
//       const normalizedX = deltaX / maxDistance;
//       const normalizedY = deltaY / maxDistance;
//       moveEntity(normalizedX, normalizedY, window.currentControlledEntity.parent.name);
//     }
//   }
// }

// export function moveEntity(x, y, name) {
//   if (!window.currentControlledEntity) return;

//   if (name === 'Back_Right_Wall') {
//     const parent = window.currentControlledEntity.parent;
//     const aabb = parent.render.meshInstances[0].aabb;

//     const minPoint = {
//       x: aabb.center.x - aabb.halfExtents.x,
//       y: window.minPoint.y,
//       z: window.minPoint.z,
//     };

//     const maxPoint = {
//       x: aabb.center.x + aabb.halfExtents.x,
//       y: window.maxPoint.y,
//       z: window.maxPoint.z,
//     };

//     const moveSpeed = 0.05;

//     const currentPos = window.currentControlledEntity.getLocalPosition().clone();

//     const newPos = currentPos.clone();
//     newPos.y -= y * moveSpeed; // Adjust forward/backward movement
//     newPos.z += x * moveSpeed; // Adjust up/down movement (inverted if needed)

//     if (newPos.y < minPoint.y) {
//       newPos.y = minPoint.y;
//     } else if (newPos.y > maxPoint.y) {
//       newPos.y = maxPoint.y;
//     }

//     if (newPos.z < minPoint.z) {
//       newPos.z = minPoint.z;
//     } else if (newPos.z > maxPoint.z) {
//       newPos.z = maxPoint.z;
//     }

//     newPos.x = currentPos.x;

//     window.currentControlledEntity.setLocalPosition(newPos);
//     if (window.currentControlledEntity.userData?.frameId) {
//       const f = window.frames.find(
//         (f) => f.frameId === window.currentControlledEntity.userData.frameId,
//       );
//       if (f) f.position = newPos;
//     }
//     if (window.currentControlledEntity.userData?.assetId) {
//       const a = window.assets3d.find(
//         (a) => a.assetId === window.currentControlledEntity.userData.assetId,
//       );
//       if (a) a.position = newPos;
//     }
//   } else if (name == 'Back_Left_Wall') {
//     //y common

//     const parent = window.currentControlledEntity.parent;
//     const aabb = parent.render.meshInstances[0].aabb;

//     const minPoint = {
//       x: window.minPoint.x,
//       y: window.minPoint.y,
//       z: 6.6,
//     };

//     const maxPoint = {
//       x: window.maxPoint.x,
//       y: window.maxPoint.y,
//       z: 6.6,
//     };

//     // Speed factor
//     const moveSpeed = 0.05;

//     // Get current position
//     const currentPos = window.currentControlledEntity.getLocalPosition().clone();

//     // Calculate new position
//     const newPos = currentPos.clone();

//     // For a wall with constant y, x and z will change with joystick movement
//     newPos.x -= x * moveSpeed; // Left/right movement now affects x
//     newPos.y -= y * moveSpeed; // Up/down (inverted) now affects z

//     // For the X axis (horizontal movement)
//     if (newPos.x < minPoint.x) {
//       newPos.x = minPoint.x;
//     } else if (newPos.x > maxPoint.x) {
//       newPos.x = maxPoint.x;
//     }

//     // For the Z axis (depth movement)
//     if (newPos.y < minPoint.y) {
//       newPos.y = minPoint.y;
//     } else if (newPos.y > maxPoint.y) {
//       newPos.y = maxPoint.y;
//     }

//     // Keep Y position constant for this wall
//     newPos.z = currentPos.z;

//     // Apply new position
//     window.currentControlledEntity.setLocalPosition(newPos);
//     if (window.currentControlledEntity.userData?.frameId) {
//       const f = window.frames.find(
//         (f) => f.frameId === window.currentControlledEntity.userData.frameId,
//       );
//       if (f) f.position = newPos;
//     }
//     if (window.currentControlledEntity.userData?.assetId) {
//       const a = window.assets3d.find(
//         (a) => a.assetId === window.currentControlledEntity.userData.assetId,
//       );
//       if (a) a.position = newPos;
//     }

//     // Log constrained position for debugging
//     // console.log('New constrained position:', newPos);
//   } else if (name == 'Front_Right_Wall') {
//     //y common

//     const parent = window.currentControlledEntity.parent;
//     const aabb = parent.render.meshInstances[0].aabb;

//     const minPoint = {
//       x: window.minPoint.x,
//       y: window.minPoint.y,
//       z: 6.6,
//     };

//     const maxPoint = {
//       x: window.maxPoint.x,
//       y: window.maxPoint.y,
//       z: 6.6,
//     };

//     // Speed factor
//     const moveSpeed = 0.05;

//     // Get current position
//     const currentPos = window.currentControlledEntity.getLocalPosition().clone();

//     // Calculate new position
//     const newPos = currentPos.clone();

//     // For a wall with constant y, x and z will change with joystick movement
//     newPos.x += x * moveSpeed; // Left/right movement now affects x
//     newPos.y -= y * moveSpeed; // Up/down (inverted) now affects z

//     // For the X axis (horizontal movement)
//     if (newPos.x < minPoint.x) {
//       newPos.x = minPoint.x;
//     } else if (newPos.x > maxPoint.x) {
//       newPos.x = maxPoint.x;
//     }

//     // For the Z axis (depth movement)
//     if (newPos.y < minPoint.y) {
//       newPos.y = minPoint.y;
//     } else if (newPos.y > maxPoint.y) {
//       newPos.y = maxPoint.y;
//     }

//     // Keep Y position constant for this wall
//     newPos.z = currentPos.z;

//     // Apply new position
//     window.currentControlledEntity.setLocalPosition(newPos);
//     if (window.currentControlledEntity.userData?.frameId) {
//       const f = window.frames.find(
//         (f) => f.frameId === window.currentControlledEntity.userData.frameId,
//       );
//       if (f) f.position = newPos;
//     }
//     if (window.currentControlledEntity.userData?.assetId) {
//       const a = window.assets3d.find(
//         (a) => a.assetId === window.currentControlledEntity.userData.assetId,
//       );
//       if (a) a.position = newPos;
//     }

//     // Log constrained position for debugging
//     // console.log('New constrained position:', newPos);
//   } else if (name == 'Front_Left_Wall') {
//     const parent = window.currentControlledEntity.parent;
//     const aabb = parent.render.meshInstances[0].aabb;

//     // Get bounding box information
//     const minPoint = {
//       x: window.minPoint.x,
//       y: window.minPoint.y,
//       z: window.minPoint.z,
//     };

//     const maxPoint = {
//       x: window.maxPoint.x,
//       y: window.maxPoint.y,
//       z: window.maxPoint.z,
//     };

//     // Speed factor
//     const moveSpeed = 0.05;

//     // Get current position
//     const currentPos = window.currentControlledEntity.getLocalPosition().clone();

//     // Calculate new position
//     const newPos = currentPos.clone();
//     newPos.z -= x * moveSpeed; // Left/right
//     newPos.y -= y * moveSpeed; // Up/down (inverted)

//     // For the Y axis (vertical movement)
//     if (newPos.y < minPoint.y) {
//       newPos.y = minPoint.y;
//     } else if (newPos.y > maxPoint.y) {
//       newPos.y = maxPoint.y;
//     }

//     // For the Z axis (forward/backward movement)
//     if (newPos.z < minPoint.z) {
//       newPos.z = minPoint.z;
//     } else if (newPos.z > maxPoint.z) {
//       newPos.z = maxPoint.z;
//     }

//     // We're not changing X position since the wall is in YZ plane
//     // and X is constant (assuming movement is restricted to the wall plane)
//     newPos.x = currentPos.x;

//     // Apply new position
//     window.currentControlledEntity.setLocalPosition(newPos);
//     if (window.currentControlledEntity.userData?.frameId) {
//       const f = window.frames.find(
//         (f) => f.frameId === window.currentControlledEntity.userData.frameId,
//       );
//       if (f) f.position = newPos;
//     }
//     if (window.currentControlledEntity.userData?.assetId) {
//       const a = window.assets3d.find(
//         (a) => a.assetId === window.currentControlledEntity.userData.assetId,
//       );
//       if (a) a.position = newPos;
//     }
//   } else if (name == 'Floor') {
//     const parent = window.currentControlledEntity.parent;
//     const aabb = parent.render.meshInstances[0].aabb;

//     const minPoint = {
//       x: window.minPoint.x,
//       y: window.minPoint.y,
//       z: window.minPoint.z,
//     };

//     const maxPoint = {
//       x: window.maxPoint.x,
//       y: window.maxPoint.y,
//       z: window.maxPoint.z,
//     };

//     // Speed factor
//     const moveSpeed = 0.05;

//     // Get current position
//     const currentPos = window.currentControlledEntity.getLocalPosition().clone();

//     // Calculate new position
//     const newPos = currentPos.clone();

//     console.log(window.wall);
//     if (window.wall === 'Back_Right_Wall') {
//       newPos.z += x * moveSpeed; // Left/right movement now affects x
//       newPos.x -= y * moveSpeed; // Up/down (inverted) now affects z
//     } else if (window.wall === 'Back_Left_Wall') {
//       newPos.x -= x * moveSpeed; // Left/right movement now affects x
//       newPos.z -= y * moveSpeed; // Up/down (inverted) now affects z
//     } else if (window.wall === 'Front_Left_Wall') {
//       newPos.x -= x * moveSpeed; // Left/right movement now affects x
//       newPos.z -= y * moveSpeed; // Up/down (inverted) now affects z
//     } else if (window.wall === 'Front_Right_Wall') {
//       newPos.x += x * moveSpeed; // Left/right movement now affects x
//       newPos.z += y * moveSpeed; // Up/down (inverted) now affects z
//     }

//     // For the X axis (horizontal movement)
//     if (newPos.x < minPoint.x) {
//       newPos.x = minPoint.x;
//     } else if (newPos.x > maxPoint.x) {
//       newPos.x = maxPoint.x;
//     }

//     // For the Z axis (depth movement)
//     if (newPos.z < minPoint.z) {
//       newPos.z = minPoint.z;
//     } else if (newPos.z > maxPoint.z) {
//       newPos.z = maxPoint.z;
//     }

//     // Keep Y position constant for this wall
//     newPos.y = currentPos.y;

//     // Apply new position
//     window.currentControlledEntity.setLocalPosition(newPos);
//     if (window.currentControlledEntity.userData?.frameId) {
//       const f = window.frames.find(
//         (f) => f.frameId === window.currentControlledEntity.userData.frameId,
//       );
//       if (f) f.position = newPos;
//     }
//     if (window.currentControlledEntity.userData?.assetId) {
//       const a = window.assets3d.find(
//         (a) => a.assetId === window.currentControlledEntity.userData.assetId,
//       );
//       if (a) a.position = newPos;
//     }
//   } else if (name == 'Roof') {
//     const parent = window.currentControlledEntity.parent;
//     const aabb = parent.render.meshInstances[0].aabb;

//     const minPoint = {
//       x: window.minPoint.x,
//       y: window.minPoint.y,
//       z: window.minPoint.z,
//     };

//     const maxPoint = {
//       x: window.maxPoint.x,
//       y: window.maxPoint.y,
//       z: window.maxPoint.z,
//     };

//     // Speed factor
//     const moveSpeed = 0.05;

//     // Get current position
//     const currentPos = window.currentControlledEntity.getLocalPosition().clone();

//     // Calculate new position
//     const newPos = currentPos.clone();

//     console.log(window.wall);
//     if (window.wall === 'Back_Right_Wall') {
//       newPos.z += x * moveSpeed; // Left/right movement now affects x
//       newPos.x -= y * moveSpeed; // Up/down (inverted) now affects z
//     } else if (window.wall === 'Back_Left_Wall') {
//       newPos.x -= x * moveSpeed; // Left/right movement now affects x
//       newPos.z -= y * moveSpeed; // Up/down (inverted) now affects z
//     } else if (window.wall === 'Front_Left_Wall') {
//       newPos.x -= x * moveSpeed; // Left/right movement now affects x
//       newPos.z -= y * moveSpeed; // Up/down (inverted) now affects z
//     } else if (window.wall === 'Front_Right_Wall') {
//       newPos.x += x * moveSpeed; // Left/right movement now affects x
//       newPos.z += y * moveSpeed; // Up/down (inverted) now affects z
//     }

//     // For the X axis (horizontal movement)
//     if (newPos.x < minPoint.x) {
//       newPos.x = minPoint.x;
//     } else if (newPos.x > maxPoint.x) {
//       newPos.x = maxPoint.x;
//     }

//     // For the Z axis (depth movement)
//     if (newPos.z < minPoint.z) {
//       newPos.z = minPoint.z;
//     } else if (newPos.z > maxPoint.z) {
//       newPos.z = maxPoint.z;
//     }

//     // Keep Y position constant for this wall
//     newPos.y = currentPos.y;

//     // Apply new position
//     window.currentControlledEntity.setLocalPosition(newPos);
//     if (window.currentControlledEntity.userData?.frameId) {
//       const f = window.frames.find(
//         (f) => f.frameId === window.currentControlledEntity.userData.frameId,
//       );
//       if (f) f.position = newPos;
//     }
//     if (window.currentControlledEntity.userData?.assetId) {
//       const a = window.assets3d.find(
//         (a) => a.assetId === window.currentControlledEntity.userData.assetId,
//       );
//       if (a) a.position = newPos;
//     }
//   }
// }

// export function setMinMax(child) {
//   console.log('Setting min/max for:', child.name);
//   const parent = child;
//   console.log(parent.name);
//   const aabb = parent.render.meshInstances[0].aabb;
//   const min = {
//     x: aabb.center.x - aabb.halfExtents.x,
//     y: aabb.center.y - aabb.halfExtents.y,
//     z: aabb.center.z - aabb.halfExtents.z,
//   };
//   const max = {
//     x: aabb.center.x + aabb.halfExtents.x,
//     y: aabb.center.y + aabb.halfExtents.y,
//     z: aabb.center.z + aabb.halfExtents.z,
//   };

//   const localMinPoint = parent
//     .getWorldTransform()
//     .clone()
//     .invert()
//     .transformPoint(new pc.Vec3(aabb.center.x - aabb.halfExtents.x, min.y, min.z));

//   const localMaxPoint = parent
//     .getWorldTransform()
//     .clone()
//     .invert()
//     .transformPoint(new pc.Vec3(aabb.center.x + aabb.halfExtents.x, max.y, max.z));

//   if (parent.name === 'Back_Left_Wall') {
//     window.minPoint = {
//       x: localMinPoint.x,
//       y: localMinPoint.y,
//       z: localMaxPoint.z,
//     };

//     window.maxPoint = {
//       x: localMaxPoint.x,
//       y: localMaxPoint.y,
//       z: localMinPoint.z,
//     };
//   } else if (parent.name === 'Back_Right_Wall') {
//     window.minPoint = {
//       x: localMinPoint.x,
//       y: localMinPoint.y,
//       z: localMinPoint.z,
//     };

//     window.maxPoint = {
//       x: localMaxPoint.x,
//       y: localMaxPoint.y,
//       z: localMaxPoint.z,
//     };
//   } else if (parent.name === 'Front_Right_Wall') {
//     window.minPoint = {
//       x: localMinPoint.x,
//       y: localMinPoint.y,
//       z: localMinPoint.z,
//     };

//     window.maxPoint = {
//       x: localMaxPoint.x,
//       y: localMaxPoint.y,
//       z: localMaxPoint.z,
//     };
//   } else if (parent.name === 'Front_Left_Wall') {
//     window.minPoint = {
//       x: localMinPoint.x,
//       y: localMinPoint.y,
//       z: localMinPoint.z,
//     };

//     window.maxPoint = {
//       x: localMaxPoint.x,
//       y: localMaxPoint.y,
//       z: localMaxPoint.z,
//     };
//   } else if (parent.name === 'Floor') {
//     window.minPoint = {
//       x: localMinPoint.x,
//       y: localMinPoint.y,
//       z: localMinPoint.z,
//     };

//     window.maxPoint = {
//       x: localMaxPoint.x,
//       y: localMaxPoint.y,
//       z: localMaxPoint.z,
//     };
//   } else if (parent.name === 'Roof') {
//     window.minPoint = {
//       x: localMinPoint.x,
//       y: localMinPoint.y,
//       z: localMinPoint.z,
//     };

//     window.maxPoint = {
//       x: localMaxPoint.x,
//       y: localMaxPoint.y,
//       z: localMaxPoint.z,
//     };
//   }
// }

// export function createJoystickElements() {
//   // Create container
//   const joystickContainer = document.createElement('div');
//   joystickContainer.id = 'joystick-container';
//   joystickContainer.style.position = 'fixed';
//   joystickContainer.style.bottom = '40px';
//   joystickContainer.style.right = '40px';
//   joystickContainer.style.zIndex = '1000';
//   joystickContainer.style.display = 'none'; // Hidden by default

//   // Create joystick base
//   const joystickBase = document.createElement('div');
//   joystickBase.className = 'joystick-base';
//   joystickBase.style.width = '120px';
//   joystickBase.style.height = '120px';
//   joystickBase.style.borderRadius = '50%';
//   joystickBase.style.backgroundColor = 'rgba(200, 200, 200, 0.7)';
//   joystickBase.style.position = 'relative';
//   joystickBase.style.cursor = 'pointer';

//   // Create joystick knob
//   const joystickKnob = document.createElement('div');
//   joystickKnob.className = 'joystick-knob';
//   joystickKnob.style.width = '60px';
//   joystickKnob.style.height = '60px';
//   joystickKnob.style.borderRadius = '50%';
//   joystickKnob.style.backgroundColor = 'rgb(59, 130, 246)';
//   joystickKnob.style.position = 'absolute';
//   joystickKnob.style.left = '50%';
//   joystickKnob.style.top = '50%';
//   joystickKnob.style.transform = 'translate(-50%, -50%)';

//   // Create toggle button
//   const toggleButton = document.createElement('button');
//   toggleButton.id = 'joystick-toggle';
//   toggleButton.innerText = 'Hide Controls';
//   toggleButton.style.position = 'absolute';
//   toggleButton.style.bottom = '150px';
//   toggleButton.style.right = '40px';
//   toggleButton.style.padding = '8px 16px';
//   toggleButton.style.backgroundColor = 'rgb(59, 130, 246)';
//   toggleButton.style.color = 'white';
//   toggleButton.style.border = 'none';
//   toggleButton.style.borderRadius = '4px';
//   toggleButton.style.cursor = 'pointer';
//   toggleButton.style.display = 'none'; // Hidden by default

//   // Add elements to DOM
//   joystickBase.appendChild(joystickKnob);
//   joystickContainer.appendChild(joystickBase);
//   document.body.appendChild(joystickContainer);
//   document.body.appendChild(toggleButton);

//   // Set up joystick functionality
//   setupJoystickControls(joystickBase, joystickKnob, toggleButton);

//   return { joystickContainer, toggleButton };
// }

// export function hideJoystickControls() {
//   if (window.joystickElements) {
//     window.joystickVisible = false;
//     window.joystickElements.joystickContainer.style.display = 'none';
//     window.joystickElements.toggleButton.style.display = 'none';
//   }
// }

// export function addPhysicsAndControls(entity) {
//   entity.findComponents('render').forEach((render) => {
//     const renderEntity = render.entity;
//     renderEntity.addComponent('rigidbody', {
//       type: 'static',
//     });
//     renderEntity.addComponent('collision', {
//       type: 'mesh',
//       renderAsset: render.asset,
//     });
//   });

//   // Set as controlled entity for joystick controls
//   setControlledEntity(entity);
// }

// // export function createSelectionMenu() {
// //   // Remove existing menu if it exists
// //   const existingMenu = document.getElementById('selection-menu');
// //   if (existingMenu) existingMenu.remove();

// //   /* ─ container ─────────────────────────────────────────────── */
// //   const menu = document.createElement('div');
// //   menu.id = 'selection-menu';
// //   Object.assign(menu.style, {
// //     position: 'fixed',
// //     top: '50%',
// //     left: '50%',
// //     transform: 'translate(-50%, -50%)',
// //     background: '#fff',
// //     padding: '20px',
// //     borderRadius: '8px',
// //     boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
// //     zIndex: 1000,
// //     display: 'flex',
// //     flexDirection: 'column',
// //     gap: '10px',
// //   });

// //   /* stop propagation for any click inside the menu */
// //   menu.addEventListener('click', (e) => e.stopPropagation());
// //   menu.addEventListener('mousedown', (e) => e.stopPropagation());

// //   /* ─ title ─────────────────────────────────────────────────── */
// //   const title = document.createElement('h3');
// //   title.textContent = 'Select Upload Type';
// //   Object.assign(title.style, { margin: '0 0 15px', textAlign: 'center' });
// //   menu.appendChild(title);

// //   /* ─ options ───────────────────────────────────────────────── */
// //   // Allow all options for both floor and walls
// //   const options = ['Video', 'Image', '3D Asset'];

// //   options.forEach((opt) => {
// //     const btn = document.createElement('button');
// //     btn.textContent = opt;
// //     Object.assign(btn.style, {
// //       padding: '10px 15px',
// //       cursor: 'pointer',
// //       border: '1px solid #ccc',
// //       borderRadius: '4px',
// //       background: '#f8f8f8',
// //       fontSize: '14px',
// //     });

// //     btn.onmouseenter = () => (btn.style.background = '#e8e8e8');
// //     btn.onmouseleave = () => (btn.style.background = '#f8f8f8');

// //     btn.addEventListener('click', (e) => {
// //       e.stopPropagation(); // ← prevent wall selection
// //       handleOptionSelection(opt.toLowerCase());
// //       menu.remove();
// //     });

// //     menu.appendChild(btn);
// //   });

// //   /* ─ cancel button ─────────────────────────────────────────── */
// //   const cancel = document.createElement('button');
// //   cancel.textContent = 'Cancel';
// //   Object.assign(cancel.style, {
// //     marginTop: '10px',
// //     padding: '10px 15px',
// //     cursor: 'pointer',
// //     border: '1px solid #ddd',
// //     borderRadius: '4px',
// //     background: '#f1f1f1',
// //   });

// //   cancel.addEventListener('click', (e) => {
// //     e.stopPropagation(); // ← prevent wall selection
// //     menu.remove();
// //   });

// //   menu.appendChild(cancel);
// //   document.body.appendChild(menu);
// // }

// // export function handleOptionSelection(option) {
// //   let fileInputId;

// //   if (window.isFloor) {
// //     fileInputId = `fileInput_Floor_${window.currentButtonIndex}`;
// //   } else if (window.isRoof) {
// //     fileInputId = `fileInput_Roof_${window.currentButtonIndex}`;
// //   } else {
// //     fileInputId = `fileInput_${window.currentEntity.name}_${window.currentButtonIndex}`;
// //   }

// //   const fileInput = document.getElementById(fileInputId);

// //   switch (option) {
// //     case 'video':
// //       fileInput.accept = 'video/*';
// //       fileInput.click();
// //       break;
// //     case 'image':
// //       fileInput.accept = 'image/*';
// //       fileInput.click();
// //       break;
// //     case '3d asset':
// //       fileInput.accept = '.glb';
// //       fileInput.click();
// //       break;
// //   }
// // }

// export function createSelectionMenu() {
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
//   // Add 'Text' option to the array
//   const options = ['Video', 'Image', '3D Asset', 'Text'];

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

// export function handleOptionSelection(option) {
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
//     case 'text':
//       createTextDialog();
//       break;
//   }
// }

// function createTextDialog() {
//   // Remove existing dialog if it exists
//   const existingDialog = document.getElementById('text-dialog');
//   if (existingDialog) existingDialog.remove();

//   // Create dialog container
//   const dialog = document.createElement('div');
//   dialog.id = 'text-dialog';
//   Object.assign(dialog.style, {
//     position: 'fixed',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     background: '#fff',
//     padding: '20px',
//     borderRadius: '8px',
//     boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
//     zIndex: 1001,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '15px',
//     width: '400px',
//     maxWidth: '90%',
//   });

//   // Stop propagation
//   dialog.addEventListener('click', (e) => e.stopPropagation());
//   dialog.addEventListener('mousedown', (e) => e.stopPropagation());

//   // Title
//   const title = document.createElement('h3');
//   title.textContent = 'Enter Text';
//   Object.assign(title.style, { margin: '0', textAlign: 'center' });
//   dialog.appendChild(title);

//   // Text area
//   const textArea = document.createElement('textarea');
//   textArea.placeholder = 'Type your text here...';
//   Object.assign(textArea.style, {
//     width: '100%',
//     height: '150px',
//     padding: '10px',
//     borderRadius: '4px',
//     border: '1px solid #ccc',
//     resize: 'vertical',
//     fontFamily: 'inherit',
//     fontSize: '14px',
//   });
//   dialog.appendChild(textArea);

//   // Button container
//   const buttonContainer = document.createElement('div');
//   Object.assign(buttonContainer.style, {
//     display: 'flex',
//     justifyContent: 'space-between',
//     gap: '10px',
//   });

//   // Cancel button
//   const cancelBtn = document.createElement('button');
//   cancelBtn.textContent = 'Cancel';
//   Object.assign(cancelBtn.style, {
//     padding: '10px 15px',
//     cursor: 'pointer',
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//     background: '#f1f1f1',
//     flex: '1',
//   });
//   cancelBtn.addEventListener('click', () => dialog.remove());

//   // Submit button
//   const submitBtn = document.createElement('button');
//   submitBtn.textContent = 'Submit';
//   Object.assign(submitBtn.style, {
//     padding: '10px 15px',
//     cursor: 'pointer',
//     border: '1px solid #4CAF50',
//     borderRadius: '4px',
//     background: '#4CAF50',
//     color: 'white',
//     flex: '1',
//   });
//   submitBtn.addEventListener('click', () => {
//     const text = textArea.value.trim();
//     if (text) {
//       handleTextSubmission(text);
//     }
//     dialog.remove();
//   });

//   buttonContainer.appendChild(cancelBtn);
//   buttonContainer.appendChild(submitBtn);
//   dialog.appendChild(buttonContainer);

//   document.body.appendChild(dialog);

//   // Focus the textarea
//   setTimeout(() => textArea.focus(), 0);
// }

// function handleTextSubmission(text) {
//   // Get the current entity identifier
//   let entityIdentifier;
//   if (window.isFloor) {
//     entityIdentifier = `Floor_${window.currentButtonIndex}`;
//   } else if (window.isRoof) {
//     entityIdentifier = `Roof_${window.currentButtonIndex}`;
//   } else {
//     entityIdentifier = `${window.currentEntity.name}_${window.currentButtonIndex}`;
//   }

//   // Store the text in an appropriate way for your application
//   // For example, you might want to store it in a data attribute or a global object
//   window.textContent = window.textContent || {};
//   window.textContent[entityIdentifier] = text;

//   // You might want to trigger an event or call a function to handle the text
//   // For example, display the text or update the UI to show that text has been added
//   console.log(`Text added to ${entityIdentifier}:`, text);
//   window.CurrentText = text;
//   window.textParent = entityIdentifier;

//   window.dispatchEvent(new Event('textChanged'));

//   // Add visual feedback that text was added successfully
//   showTextAddedNotification(entityIdentifier);
// }

// function showTextAddedNotification(entityIdentifier) {
//   // Create a notification element
//   const notification = document.createElement('div');
//   notification.textContent = `Text added successfully to ${entityIdentifier}`;
//   Object.assign(notification.style, {
//     position: 'fixed',
//     bottom: '20px',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     background: '#4CAF50',
//     color: 'white',
//     padding: '10px 20px',
//     borderRadius: '4px',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
//     zIndex: 1002,
//     opacity: '0',
//     transition: 'opacity 0.3s ease',
//   });

//   document.body.appendChild(notification);

//   // Fade in
//   setTimeout(() => {
//     notification.style.opacity = '1';
//   }, 10);

//   // Remove after 3 seconds
//   setTimeout(() => {
//     notification.style.opacity = '0';
//     setTimeout(() => notification.remove(), 300);
//   }, 3000);
// }
