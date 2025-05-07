// import * as pc from 'playcanvas';
// export function FpsPlaycanvas() {
//   // const CharacterController = pc.createScript("characterController");

//   // CharacterController.attributes.add("camera", {
//   //   type: "entity",
//   //   title: "Camera Entity",
//   // });

//   // CharacterController.attributes.add("speed", {
//   //   type: "number",
//   //   default: 8,
//   //   title: "Movement Speed",
//   // });

//   // CharacterController.attributes.add("fastSpeed", {
//   //   type: "number",
//   //   default: 20,
//   //   title: "Fast Movement Speed",
//   // });

//   // CharacterController.attributes.add("sensitivity", {
//   //   type: "number",
//   //   default: 0.3,
//   //   title: "Look Sensitivity",
//   // });

//   // CharacterController.attributes.add("lookSpeed", {
//   //   type: "number",
//   //   default: 0.2,
//   //   title: "Drag Look Speed",
//   // });

//   // CharacterController.prototype.initialize = function () {
//   //   console.log(this.app);
//   //   this.pitch = new pc.Quat();
//   //   this.yaw = new pc.Quat();
//   //   this.velocity = new pc.Vec3();
//   //   this.look = new pc.Vec2(0, 0);
//   //   this.targetVelocity = new pc.Vec3();

//   //   // Drag camera states
//   //   this.isMouseDown = false;
//   //   this.lastX = 0;
//   //   this.lastY = 0;
//   //   this.eulers = new pc.Vec3();

//   //   // Mode tracking
//   //   this.isDragMode = false;

//   //   // Store camera reference
//   //   this.cameraEntity = this.camera || this.entity.findByName("camera");

//   //   // Get initial rotation
//   //   var angles = this.entity.getLocalEulerAngles();
//   //   this.eulers.x = angles.x;
//   //   this.eulers.y = angles.y;

//   //   // Bind methods
//   //   this.onMouseMove = this.onMouseMove.bind(this);
//   //   this.onMouseDown = this.onMouseDown.bind(this);
//   //   this.onMouseUp = this.onMouseUp.bind(this);
//   //   this.onMouseLeave = this.onMouseLeave.bind(this);

//   //   // Add event listeners
//   //   document.addEventListener("mousemove", this.onMouseMove);
//   //   document.addEventListener("mouseleave", this.onMouseLeave);
//   //   this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
//   //   this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

//   //   if (!this.entity.rigidbody) {
//   //     console.warn("CharacterController needs a rigidbody component");
//   //     return;
//   //   }

//   //   const rigidbody = this.entity.rigidbody;
//   //   rigidbody.linearDamping = 0.9;
//   //   rigidbody.angularDamping = 0.9;
//   //   rigidbody.linearFactor = new pc.Vec3(1, 1, 1);
//   //   rigidbody.angularFactor = new pc.Vec3(0, 0, 0);
//   // };

//   // // CharacterController.prototype.onMouseDown = function (event) {
//   // //   if (event.button === pc.MOUSEBUTTON_LEFT) {
//   // //     this.isDragMode = true;
//   // //     this.isMouseDown = true;
//   // //     this.lastX = event.x;
//   // //     this.lastY = event.y;
//   // //     document.body.style.cursor = "grab";
//   // //   }
//   // // };

//   // CharacterController.prototype.onMouseLeave = function () {
//   //   // Instead of stopping drag, we'll keep tracking if mouse button is still down
//   //   if (this.isMouseDown) {
//   //     this.isDragMode = false;
//   //   }
//   //   document.body.style.cursor = "grab";
//   // };

//   // CharacterController.prototype.onMouseMove = function (e) {
//   //   // Only allow mouse dragging if we are not actively moving the character with the keyboard
//   //   if (this.isMouseDown) {
//   //     const dx = e.x - this.lastX; // Mouse movement in the X-direction (horizontal)
//   //     const dy = e.y - this.lastY; // Mouse movement in the Y-direction (vertical)

//   //     this.lastX = e.x;
//   //     this.lastY = e.y;

//   //     // Update both x (pitch) and y (yaw) euler angles based on mouse movement
//   //     this.eulers.x -= dy * this.lookSpeed * 0.5; // Vertical rotation
//   //     this.eulers.y -= dx * this.lookSpeed * 0.5; // Horizontal rotation

//   //     // Clamp vertical rotation (pitch) to prevent flipping the camera upside down
//   //     this.eulers.x = pc.math.clamp(this.eulers.x, 0, 89);
//   //     // this.eulers.y = pc.math.clamp(this.eulers.y, -89, 89);

//   //     // Create quaternions for pitch and yaw rotation
//   //     this.pitch.setFromEulerAngles(this.eulers.x, this.eulers.y, 0); // Vertical rotation (pitch)
//   //     // this.yaw.setFromEulerAngles(this.eulers.x, this.eulers.y, 0); // Horizontal rotation (yaw)

//   //     // Apply yaw (horizontal rotation) to the character (entity)
//   //     // this.entity.setRotation(this.yaw);

//   //     // Apply pitch (vertical rotation) to the camera
//   //     if (this.cameraEntity) {
//   //       this.cameraEntity.setLocalRotation(this.pitch);
//   //     }
//   //   }
//   // };

//   // CharacterController.prototype.update = function (dt) {
//   //   if (!this.entity.rigidbody) return;

//   //   const rigidbody = this.entity.rigidbody;
//   //   const cameraForward = this.cameraEntity.forward.clone();
//   //   const cameraRight = this.cameraEntity.right.clone();

//   //   // Make sure to ignore the vertical component of camera movement (no y-axis)
//   //   cameraForward.y = 0;
//   //   cameraRight.y = 0;

//   //   cameraForward.normalize();
//   //   cameraRight.normalize();

//   //   const movement = new pc.Vec3();
//   //   const speed = this.app.keyboard.isPressed(pc.KEY_SHIFT)
//   //     ? this.fastSpeed
//   //     : this.speed;

//   //   // Keyboard-based movement (WASD or arrow keys)
//   //   if (
//   //     this.app.keyboard.isPressed(pc.KEY_W) ||
//   //     this.app.keyboard.isPressed(pc.KEY_UP)
//   //   ) {
//   //     movement.add(cameraForward);
//   //   }
//   //   if (
//   //     this.app.keyboard.isPressed(pc.KEY_S) ||
//   //     this.app.keyboard.isPressed(pc.KEY_DOWN)
//   //   ) {
//   //     movement.sub(cameraForward);
//   //   }
//   //   if (
//   //     this.app.keyboard.isPressed(pc.KEY_A) ||
//   //     this.app.keyboard.isPressed(pc.KEY_LEFT)
//   //   ) {
//   //     movement.sub(cameraRight);
//   //   }
//   //   if (
//   //     this.app.keyboard.isPressed(pc.KEY_D) ||
//   //     this.app.keyboard.isPressed(pc.KEY_RIGHT)
//   //   ) {
//   //     movement.add(cameraRight);
//   //   }

//   //   if (!movement.equals(pc.Vec3.ZERO)) {
//   //     movement.normalize().scale(speed);
//   //   }

//   //   const currentVelocity = rigidbody.linearVelocity;
//   //   const lerpFactor = Math.min(dt * 12, 1);

//   //   // Update target velocity (only x and z components for horizontal movement)
//   //   this.targetVelocity.x = movement.x;
//   //   this.targetVelocity.z = movement.z;
//   //   this.targetVelocity.y = currentVelocity.y;

//   //   // Smoothly interpolate between current and target velocity for a smoother movement
//   //   this.velocity.lerp(currentVelocity, this.targetVelocity, lerpFactor);

//   //   // if (this.app.keyboard.wasPressed(pc.KEY_SPACE)) {
//   //   //   this.velocity.y = 20;
//   //   // }

//   //   rigidbody.linearVelocity = this.velocity;
//   // };

//   // // Reset isMoving when mouse is released, to ensure it doesn't interfere with the drag mode
//   // CharacterController.prototype.onMouseUp = function (event) {
//   //   // Check if the event is triggered on an overlay element
//   //   if (event.element && event.element.classList.contains("overlay-element")) {
//   //     return; // Ignore events on the overlay
//   //   }
//   //   if (event.button === pc.MOUSEBUTTON_LEFT) {
//   //     this.isMouseDown = false;
//   //     // this.isDragMode = false;
//   //     document.body.style.cursor = "grab";
//   //   }
//   // };

//   // // Ensure mouse dragging only occurs if the character isn't moving
//   // CharacterController.prototype.onMouseDown = function (event) {
//   //   if (event.element && event.element.classList.contains("overlay-element")) {
//   //     return; // Ignore events on the overlay
//   //   }
//   //   if (event.button === pc.MOUSEBUTTON_LEFT) {
//   //     // if (!this.isMoving) {
//   //     // this.isDragMode = true;
//   //     this.isMouseDown = true;
//   //     this.lastX = event.x;
//   //     this.lastY = event.y;
//   //     document.body.style.cursor = "grabbing";
//   //     // }
//   //   }
//   // };

//   // CharacterController.prototype.destroy = function () {
//   //   document.removeEventListener("mousemove", this.onMouseMove);
//   //   document.removeEventListener("mouseleave", this.onMouseLeave);
//   //   this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
//   //   this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
//   // };

//   /** Working script when muose pointer locks */

//   // CharacterController.js
//   // var CharacterController = pc.createScript("characterController");

//   // /********************************************************************
//   //  * Script Attributes
//   //  ********************************************************************/
//   // CharacterController.attributes.add("camera", {
//   //   type: "entity",
//   //   title: "Camera Entity",
//   // });

//   // CharacterController.attributes.add("sensitivity", {
//   //   type: "number",
//   //   default: 0.2,
//   //   title: "Mouse Look Sensitivity",
//   // });

//   // CharacterController.attributes.add("speed", {
//   //   type: "number",
//   //   default: 8,
//   //   title: "Normal Speed",
//   // });

//   // CharacterController.attributes.add("fastSpeed", {
//   //   type: "number",
//   //   default: 20,
//   //   title: "Run/Sprint Speed",
//   // });

//   // /********************************************************************
//   //  * initialize
//   //  ********************************************************************/
//   // CharacterController.prototype.initialize = function () {
//   //   // We track pitch/yaw in degrees in this.eulers.x, .y
//   //   // x = pitch, y = yaw
//   //   this.eulers = new pc.Vec3(0, 0, 0);

//   //   // If you want pointer lock immediately:
//   //   // this.app.mouse.enablePointerLock();

//   //   // Mouse + keyboard events
//   //   this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
//   //   this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
//   //   this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);

//   //   // If your entity or camera already has a local rotation,
//   //   // read it here to initialize eulers
//   //   var initialRot = this.entity.getLocalEulerAngles();
//   //   this.eulers.y = initialRot.y; // yaw
//   //   // We usually keep pitch on the camera child, so see if there's a pitch
//   //   var camRot = this.camera.getLocalEulerAngles();
//   //   this.eulers.x = camRot.x; // pitch

//   //   // Make sure we have a rigidbody for movement
//   //   if (!this.entity.rigidbody) {
//   //     console.warn("CharacterController: entity must have a rigidbody.");
//   //   }
//   // };

//   // /********************************************************************
//   //  * onMouseDown
//   //  ********************************************************************/
//   // CharacterController.prototype.onMouseDown = function (event) {
//   //   // Only left-click to lock pointer
//   //   if (event.button === pc.MOUSEBUTTON_LEFT) {
//   //     // Request pointer lock
//   //     if (!pc.Mouse.isPointerLocked()) {
//   //       this.app.mouse.enablePointerLock();
//   //     }
//   //   }
//   // };

//   // /********************************************************************
//   //  * onKeyDown
//   //  ********************************************************************/
//   // CharacterController.prototype.onKeyDown = function (event) {
//   //   // Escape to unlock pointer
//   //   if (event.key === pc.KEY_ESCAPE && pc.Mouse.isPointerLocked()) {
//   //     this.app.mouse.disablePointerLock();
//   //   }
//   // };

//   // /********************************************************************
//   //  * onMouseMove
//   //  ********************************************************************/
//   // CharacterController.prototype.onMouseMove = function (event) {
//   //   // Only rotate if pointer locked
//   //   if (!pc.Mouse.isPointerLocked()) return;

//   //   // Update pitch & yaw from the mouse
//   //   // dx: horizontal movement => yaw
//   //   // dy: vertical movement => pitch
//   //   var dx = event.dx;
//   //   var dy = event.dy;

//   //   this.eulers.x -= dy * this.sensitivity;
//   //   this.eulers.y -= dx * this.sensitivity;

//   //   // Clamp pitch so we don't flip upside-down
//   //   this.eulers.x = pc.math.clamp(this.eulers.x, -90, 90);

//   //   // Apply to the entity (yaw) and camera (pitch)
//   //   this.entity.setLocalEulerAngles(0, this.eulers.y, 0);
//   //   this.camera.setLocalEulerAngles(this.eulers.x, 0, 0);
//   // };

//   // /********************************************************************
//   //  * update
//   //  ********************************************************************/
//   // CharacterController.prototype.update = function (dt) {
//   //   if (!this.entity.rigidbody) return;

//   //   // Decide speed (shift => fastSpeed)
//   //   var isShift = this.app.keyboard.isPressed(pc.KEY_SHIFT);
//   //   var moveSpeed = isShift ? this.fastSpeed : this.speed;

//   //   // Build a direction vector from WASD
//   //   var forward = 0;
//   //   var right = 0;

//   //   if (this.app.keyboard.isPressed(pc.KEY_W)) forward += 1;
//   //   if (this.app.keyboard.isPressed(pc.KEY_S)) forward -= 1;
//   //   if (this.app.keyboard.isPressed(pc.KEY_D)) right += 1;
//   //   if (this.app.keyboard.isPressed(pc.KEY_A)) right -= 1;

//   //   // If we want purely horizontal movement (typical FPS),
//   //   // we take the entity's forward/right, zero out Y to keep from going up/down slopes
//   //   // If you want to move exactly where camera is pointing, remove the .y=0 lines
//   //   var f = this.entity.forward.clone();
//   //   f.y = 0;
//   //   f.normalize();

//   //   var r = this.entity.right.clone();
//   //   r.y = 0;
//   //   r.normalize();

//   //   // Combine them
//   //   var move = new pc.Vec3();
//   //   if (forward !== 0) {
//   //     move.add(f.scale(forward));
//   //   }
//   //   if (right !== 0) {
//   //     move.add(r.scale(right));
//   //   }

//   //   // Normalize so diagonal isn't faster
//   //   if (move.lengthSq() > 0) {
//   //     move.normalize();
//   //   }
//   //   // Scale by moveSpeed * dt
//   //   move.scale(moveSpeed * dt);

//   //   // Teleport the rigidbody
//   //   // (Use .teleport so physics doesn’t fight us too much)
//   //   var currentPos = this.entity.getPosition();
//   //   currentPos.add(move);
//   //   this.entity.rigidbody.teleport(currentPos);
//   // };

//   /** Pointer grab element */
//   var CharacterController = pc.createScript('characterController');

//   /********************************************************************
//    * Script Attributes
//    ********************************************************************/
//   CharacterController.attributes.add('camera', {
//     type: 'entity',
//     title: 'Camera Entity',
//   });

//   CharacterController.attributes.add('sensitivity', {
//     type: 'number',
//     default: 0.2,
//     title: 'Drag Look Sensitivity',
//   });

//   CharacterController.attributes.add('speed', {
//     type: 'number',
//     default: 8,
//     title: 'Normal Speed',
//   });

//   CharacterController.attributes.add('fastSpeed', {
//     type: 'number',
//     default: 20,
//     title: 'Run/Sprint Speed',
//   });

//   /********************************************************************
//    * initialize
//    ********************************************************************/
//   CharacterController.prototype.initialize = function () {
//     // We'll track pitch (x) and yaw (y) in degrees
//     this.eulers = new pc.Vec3(0, 0, 0);

//     // If the entity or camera already has some rotation
//     // initialize our euler angles from them
//     var initialRot = this.entity.getLocalEulerAngles();
//     this.eulers.y = initialRot.y; // yaw
//     var camRot = this.camera.getLocalEulerAngles();
//     this.eulers.x = camRot.x; // pitch

//     // We need a rigidbody for movement
//     if (!this.entity.rigidbody) {
//       console.warn('CharacterController needs a rigidbody component');
//     }

//     // Mouse-drag state
//     this.isMouseDown = false;
//     this.lastX = 0;
//     this.lastY = 0;

//     // Bind event handlers
//     this.onMouseDown = this.onMouseDown.bind(this);
//     this.onMouseUp = this.onMouseUp.bind(this);
//     this.onMouseMove = this.onMouseMove.bind(this);

//     this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown);
//     this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp);
//     this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove);
//   };

//   /********************************************************************
//    * onMouseDown
//    ********************************************************************/
//   CharacterController.prototype.onMouseDown = function (event) {
//     // If left mouse button, begin drag
//     if (event.button === pc.MOUSEBUTTON_LEFT) {
//       this.isMouseDown = true;
//       this.lastX = event.x;
//       this.lastY = event.y;
//       // Optionally change cursor style, e.g.:
//       // document.body.style.cursor = "grabbing";
//     }
//   };

//   /********************************************************************
//    * onMouseUp
//    ********************************************************************/
//   CharacterController.prototype.onMouseUp = function (event) {
//     // If left button was released, stop dragging
//     if (event.button === pc.MOUSEBUTTON_LEFT) {
//       this.isMouseDown = false;
//       // document.body.style.cursor = "default";
//     }
//   };

//   /********************************************************************
//    * onMouseMove
//    ********************************************************************/
//   CharacterController.prototype.onMouseMove = function (event) {
//     // Only rotate while dragging
//     if (!this.isMouseDown) return;

//     // Mouse deltas
//     var dx = event.x - this.lastX;
//     var dy = event.y - this.lastY;

//     this.lastX = event.x;
//     this.lastY = event.y;

//     // Adjust pitch & yaw
//     this.eulers.x -= dy * this.sensitivity;
//     this.eulers.y -= dx * this.sensitivity;

//     // Clamp pitch
//     this.eulers.x = pc.math.clamp(this.eulers.x, -90, 90);

//     // Apply to player entity (yaw) and camera (pitch)
//     this.entity.setLocalEulerAngles(0, this.eulers.y, 0);
//     this.camera.setLocalEulerAngles(this.eulers.x, 0, 0);
//   };

//   /********************************************************************
//    * update
//    ********************************************************************/
//   CharacterController.prototype.update = function (dt) {
//     if (!this.entity.rigidbody) return;

//     // SHIFT => run speed
//     var isShift = this.app.keyboard.isPressed(pc.KEY_SHIFT);
//     var moveSpeed = isShift ? this.fastSpeed : this.speed;

//     // WASD
//     var forward = 0;
//     var right = 0;
//     if (this.app.keyboard.isPressed(pc.KEY_W)) forward += 1;
//     if (this.app.keyboard.isPressed(pc.KEY_S)) forward -= 1;
//     if (this.app.keyboard.isPressed(pc.KEY_D)) right += 1;
//     if (this.app.keyboard.isPressed(pc.KEY_A)) right -= 1;

//     // Typical FPS: use entity's forward/right, ignoring y
//     var f = this.entity.forward.clone();
//     f.y = 0;
//     f.normalize();

//     var r = this.entity.right.clone();
//     r.y = 0;
//     r.normalize();

//     // Combine them
//     var move = new pc.Vec3();
//     if (forward !== 0) {
//       move.add(f.scale(forward));
//     }
//     if (right !== 0) {
//       move.add(r.scale(right));
//     }

//     if (move.lengthSq() > 0) {
//       move.normalize();
//     }

//     // scale by speed * dt
//     move.scale(moveSpeed * dt);

//     // Teleport the rigidbody
//     var currentPos = this.entity.getPosition();
//     currentPos.add(move);
//     this.entity.rigidbody.teleport(currentPos);
//   };

//   /********************************************************************
//    * destroy
//    ********************************************************************/
//   CharacterController.prototype.destroy = function () {
//     // Remove our mouse listeners
//     this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown);
//     this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp);
//     this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove);
//   };
// }
import * as pc from 'playcanvas';
export function FpsPlaycanvas() {
  // const CharacterController = pc.createScript('characterController');

  // CharacterController.attributes.add('camera', {
  //   type: 'entity',
  //   title: 'Camera Entity',
  // });

  // CharacterController.attributes.add('speed', {
  //   type: 'number',
  //   default: 8,
  //   title: 'Movement Speed',
  // });

  // CharacterController.attributes.add('fastSpeed', {
  //   type: 'number',
  //   default: 20,
  //   title: 'Fast Movement Speed',
  // });

  // CharacterController.attributes.add('sensitivity', {
  //   type: 'number',
  //   default: 0.3,
  //   title: 'Look Sensitivity',
  // });

  // CharacterController.attributes.add('lookSpeed', {
  //   type: 'number',
  //   default: 0.2,
  //   title: 'Drag Look Speed',
  // });

  // CharacterController.prototype.initialize = function () {
  //   console.log(this.app);
  //   this.pitch = new pc.Quat();
  //   this.yaw = new pc.Quat();
  //   this.velocity = new pc.Vec3();
  //   this.look = new pc.Vec2(0, 0);
  //   this.targetVelocity = new pc.Vec3();

  //   // Drag camera states
  //   this.isMouseDown = false;
  //   this.lastX = 0;
  //   this.lastY = 0;
  //   this.eulers = new pc.Vec3();

  //   // Mode tracking
  //   this.isDragMode = false;

  //   // Store camera reference
  //   this.cameraEntity = this.camera || this.entity.findByName('camera');

  //   // Get initial rotation
  //   var angles = this.entity.getLocalEulerAngles();
  //   this.eulers.x = angles.x;
  //   this.eulers.y = angles.y;

  //   // Bind methods
  //   this.onMouseMove = this.onMouseMove.bind(this);
  //   this.onMouseDown = this.onMouseDown.bind(this);
  //   this.onMouseUp = this.onMouseUp.bind(this);
  //   this.onMouseLeave = this.onMouseLeave.bind(this);

  //   // Add event listeners
  //   document.addEventListener('mousemove', this.onMouseMove);
  //   document.addEventListener('mouseleave', this.onMouseLeave);
  //   this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
  //   this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

  //   if (!this.entity.rigidbody) {
  //     console.warn('CharacterController needs a rigidbody component');
  //     return;
  //   }

  //   const rigidbody = this.entity.rigidbody;
  //   rigidbody.linearDamping = 0.9;
  //   rigidbody.angularDamping = 0.9;
  //   rigidbody.linearFactor = new pc.Vec3(1, 1, 1);
  //   rigidbody.angularFactor = new pc.Vec3(0, 0, 0);
  // };

  // // CharacterController.prototype.onMouseDown = function (event) {
  // //   if (event.button === pc.MOUSEBUTTON_LEFT) {
  // //     this.isDragMode = true;
  // //     this.isMouseDown = true;
  // //     this.lastX = event.x;
  // //     this.lastY = event.y;
  // //     document.body.style.cursor = "grab";
  // //   }
  // // };

  // CharacterController.prototype.onMouseLeave = function () {
  //   // Instead of stopping drag, we'll keep tracking if mouse button is still down
  //   if (this.isMouseDown) {
  //     this.isDragMode = false;
  //   }
  //   document.body.style.cursor = 'grab';
  // };

  // CharacterController.prototype.onMouseMove = function (e) {
  //   // Only allow mouse dragging if we are not actively moving the character with the keyboard
  //   if (this.isMouseDown) {
  //     const dx = e.x - this.lastX; // Mouse movement in the X-direction (horizontal)
  //     const dy = e.y - this.lastY; // Mouse movement in the Y-direction (vertical)

  //     this.lastX = e.x;
  //     this.lastY = e.y;

  //     // Update both x (pitch) and y (yaw) euler angles based on mouse movement
  //     this.eulers.x -= dy * this.lookSpeed * 0.5; // Vertical rotation
  //     this.eulers.y -= dx * this.lookSpeed * 0.5; // Horizontal rotation

  //     // Clamp vertical rotation (pitch) to prevent flipping the camera upside down
  //     this.eulers.x = pc.math.clamp(this.eulers.x, 0, 89);
  //     // this.eulers.y = pc.math.clamp(this.eulers.y, -89, 89);

  //     // Create quaternions for pitch and yaw rotation
  //     this.pitch.setFromEulerAngles(this.eulers.x, this.eulers.y, 0); // Vertical rotation (pitch)
  //     // this.yaw.setFromEulerAngles(this.eulers.x, this.eulers.y, 0); // Horizontal rotation (yaw)

  //     // Apply yaw (horizontal rotation) to the character (entity)
  //     // this.entity.setRotation(this.yaw);

  //     // Apply pitch (vertical rotation) to the camera
  //     if (this.cameraEntity) {
  //       this.cameraEntity.setLocalRotation(this.pitch);
  //     }
  //   }
  // };

  // CharacterController.prototype.update = function (dt) {
  //   if (!this.entity.rigidbody) return;

  //   const rigidbody = this.entity.rigidbody;
  //   const cameraForward = this.cameraEntity.forward.clone();
  //   const cameraRight = this.cameraEntity.right.clone();

  //   // Make sure to ignore the vertical component of camera movement (no y-axis)
  //   cameraForward.y = 0;
  //   cameraRight.y = 0;

  //   cameraForward.normalize();
  //   cameraRight.normalize();

  //   const movement = new pc.Vec3();
  //   const speed = this.app.keyboard.isPressed(pc.KEY_SHIFT) ? this.fastSpeed : this.speed;

  //   // Keyboard-based movement (WASD or arrow keys)
  //   if (this.app.keyboard.isPressed(pc.KEY_W) || this.app.keyboard.isPressed(pc.KEY_UP)) {
  //     movement.add(cameraForward);
  //   }
  //   if (this.app.keyboard.isPressed(pc.KEY_S) || this.app.keyboard.isPressed(pc.KEY_DOWN)) {
  //     movement.sub(cameraForward);
  //   }
  //   if (this.app.keyboard.isPressed(pc.KEY_A) || this.app.keyboard.isPressed(pc.KEY_LEFT)) {
  //     movement.sub(cameraRight);
  //   }
  //   if (this.app.keyboard.isPressed(pc.KEY_D) || this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
  //     movement.add(cameraRight);
  //   }

  //   if (!movement.equals(pc.Vec3.ZERO)) {
  //     movement.normalize().scale(speed);
  //   }

  //   const currentVelocity = rigidbody.linearVelocity;
  //   const lerpFactor = Math.min(dt * 12, 1);

  //   // Update target velocity (only x and z components for horizontal movement)
  //   this.targetVelocity.x = movement.x;
  //   this.targetVelocity.z = movement.z;
  //   this.targetVelocity.y = currentVelocity.y;

  //   // Smoothly interpolate between current and target velocity for a smoother movement
  //   this.velocity.lerp(currentVelocity, this.targetVelocity, lerpFactor);

  //   // if (this.app.keyboard.wasPressed(pc.KEY_SPACE)) {
  //   //   this.velocity.y = 20;
  //   // }

  //   rigidbody.linearVelocity = this.velocity;
  // };

  // // Reset isMoving when mouse is released, to ensure it doesn't interfere with the drag mode
  // CharacterController.prototype.onMouseUp = function (event) {
  //   // Check if the event is triggered on an overlay element
  //   if (event.element && event.element.classList.contains('overlay-element')) {
  //     return; // Ignore events on the overlay
  //   }
  //   if (event.button === pc.MOUSEBUTTON_LEFT) {
  //     this.isMouseDown = false;
  //     // this.isDragMode = false;
  //     document.body.style.cursor = 'grab';
  //   }
  // };

  // // Ensure mouse dragging only occurs if the character isn't moving
  // CharacterController.prototype.onMouseDown = function (event) {
  //   if (event.element && event.element.classList.contains('overlay-element')) {
  //     return; // Ignore events on the overlay
  //   }
  //   if (event.button === pc.MOUSEBUTTON_LEFT) {
  //     // if (!this.isMoving) {
  //     // this.isDragMode = true;
  //     this.isMouseDown = true;
  //     this.lastX = event.x;
  //     this.lastY = event.y;
  //     document.body.style.cursor = 'grabbing';
  //     // }
  //   }
  // };

  // CharacterController.prototype.destroy = function () {
  //   document.removeEventListener('mousemove', this.onMouseMove);
  //   document.removeEventListener('mouseleave', this.onMouseLeave);
  //   this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
  //   this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
  // };

  /** Working script when muose pointer locks */

  // CharacterController.js
  // var CharacterController = pc.createScript("characterController");

  // /********************************************************************
  //  * Script Attributes
  //  ********************************************************************/
  // CharacterController.attributes.add('camera', {
  //   type: 'entity',
  //   title: 'Camera Entity',
  // });

  // CharacterController.attributes.add('sensitivity', {
  //   type: 'number',
  //   default: 0.2,
  //   title: 'Mouse Look Sensitivity',
  // });

  // CharacterController.attributes.add('speed', {
  //   type: 'number',
  //   default: 8,
  //   title: 'Normal Speed',
  // });

  // CharacterController.attributes.add('fastSpeed', {
  //   type: 'number',
  //   default: 20,
  //   title: 'Run/Sprint Speed',
  // });

  // /********************************************************************
  //  * initialize
  //  ********************************************************************/
  // CharacterController.prototype.initialize = function () {
  //   // We track pitch/yaw in degrees in this.eulers.x, .y
  //   // x = pitch, y = yaw
  //   this.eulers = new pc.Vec3(0, 0, 0);

  //   // If you want pointer lock immediately:
  //   // this.app.mouse.enablePointerLock();

  //   // Mouse + keyboard events
  //   this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
  //   this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
  //   this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);

  //   // If your entity or camera already has a local rotation,
  //   // read it here to initialize eulers
  //   var initialRot = this.entity.getLocalEulerAngles();
  //   this.eulers.y = initialRot.y; // yaw
  //   // We usually keep pitch on the camera child, so see if there's a pitch
  //   var camRot = this.camera.getLocalEulerAngles();
  //   this.eulers.x = camRot.x; // pitch

  //   // Make sure we have a rigidbody for movement
  //   if (!this.entity.rigidbody) {
  //     console.warn('CharacterController: entity must have a rigidbody.');
  //   }
  // };

  // /********************************************************************
  //  * onMouseDown
  //  ********************************************************************/
  // CharacterController.prototype.onMouseDown = function (event) {
  //   // Only left-click to lock pointer
  //   if (event.button === pc.MOUSEBUTTON_LEFT) {
  //     // Request pointer lock
  //     if (!pc.Mouse.isPointerLocked()) {
  //       this.app.mouse.enablePointerLock();
  //     }
  //   }
  // };

  // /********************************************************************
  //  * onKeyDown
  //  ********************************************************************/
  // CharacterController.prototype.onKeyDown = function (event) {
  //   // Escape to unlock pointer
  //   if (event.key === pc.KEY_ESCAPE && pc.Mouse.isPointerLocked()) {
  //     this.app.mouse.disablePointerLock();
  //   }
  // };

  // /********************************************************************
  //  * onMouseMove
  //  ********************************************************************/
  // CharacterController.prototype.onMouseMove = function (event) {
  //   // Only rotate if pointer locked
  //   if (!pc.Mouse.isPointerLocked()) return;

  //   // Update pitch & yaw from the mouse
  //   // dx: horizontal movement => yaw
  //   // dy: vertical movement => pitch
  //   var dx = event.dx;
  //   var dy = event.dy;

  //   this.eulers.x -= dy * this.sensitivity;
  //   this.eulers.y -= dx * this.sensitivity;

  //   // Clamp pitch so we don't flip upside-down
  //   this.eulers.x = pc.math.clamp(this.eulers.x, -90, 90);

  //   // Apply to the entity (yaw) and camera (pitch)
  //   this.entity.setLocalEulerAngles(0, this.eulers.y, 0);
  //   this.camera.setLocalEulerAngles(this.eulers.x, 0, 0);
  // };

  // /********************************************************************
  //  * update
  //  ********************************************************************/
  // CharacterController.prototype.update = function (dt) {
  //   if (!this.entity.rigidbody) return;

  //   // Decide speed (shift => fastSpeed)
  //   var isShift = this.app.keyboard.isPressed(pc.KEY_SHIFT);
  //   var moveSpeed = isShift ? this.fastSpeed : this.speed;

  //   // Build a direction vector from WASD
  //   var forward = 0;
  //   var right = 0;

  //   if (this.app.keyboard.isPressed(pc.KEY_W)) forward += 1;
  //   if (this.app.keyboard.isPressed(pc.KEY_S)) forward -= 1;
  //   if (this.app.keyboard.isPressed(pc.KEY_D)) right += 1;
  //   if (this.app.keyboard.isPressed(pc.KEY_A)) right -= 1;

  //   // If we want purely horizontal movement (typical FPS),
  //   // we take the entity's forward/right, zero out Y to keep from going up/down slopes
  //   // If you want to move exactly where camera is pointing, remove the .y=0 lines
  //   var f = this.entity.forward.clone();
  //   f.y = 0;
  //   f.normalize();

  //   var r = this.entity.right.clone();
  //   r.y = 0;
  //   r.normalize();

  //   // Combine them
  //   var move = new pc.Vec3();
  //   if (forward !== 0) {
  //     move.add(f.scale(forward));
  //   }
  //   if (right !== 0) {
  //     move.add(r.scale(right));
  //   }

  //   // Normalize so diagonal isn't faster
  //   if (move.lengthSq() > 0) {
  //     move.normalize();
  //   }
  //   // Scale by moveSpeed * dt
  //   move.scale(moveSpeed * dt);

  //   // Teleport the rigidbody
  //   // (Use .teleport so physics doesn’t fight us too much)
  //   var currentPos = this.entity.getPosition();
  //   currentPos.add(move);
  //   this.entity.rigidbody.teleport(currentPos);
  // };

  /** Pointer grab element */
  var CharacterController = pc.createScript('characterController');

  /********************************************************************
   * Script Attributes
   ********************************************************************/
  CharacterController.attributes.add('camera', {
    type: 'entity',
    title: 'Camera Entity',
  });

  CharacterController.attributes.add('sensitivity', {
    type: 'number',
    default: 0.2,
    title: 'Drag Look Sensitivity',
  });

  CharacterController.attributes.add('speed', {
    type: 'number',
    default: 8,
    title: 'Normal Speed',
  });

  CharacterController.attributes.add('fastSpeed', {
    type: 'number',
    default: 20,
    title: 'Run/Sprint Speed',
  });

  /********************************************************************
   * initialize
   ********************************************************************/
  CharacterController.prototype.initialize = function () {
    // We'll track pitch (x) and yaw (y) in degrees
    this.eulers = new pc.Vec3(0, 0, 0);

    // If the entity or camera already has some rotation
    // initialize our euler angles from them
    var initialRot = this.entity.getLocalEulerAngles();
    this.eulers.y = initialRot.y; // yaw
    var camRot = this.camera.getLocalEulerAngles();
    this.eulers.x = camRot.x; // pitch

    // We need a rigidbody for movement
    if (!this.entity.rigidbody) {
      console.warn('CharacterController needs a rigidbody component');
    }

    // Mouse-drag state
    this.isMouseDown = false;
    this.lastX = 0;
    this.lastY = 0;

    // Bind event handlers
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove);
  };

  /********************************************************************
   * onMouseDown
   ********************************************************************/
  CharacterController.prototype.onMouseDown = function (event) {
    // If left mouse button, begin drag
    if (event.button === pc.MOUSEBUTTON_LEFT) {
      this.isMouseDown = true;
      this.lastX = event.x;
      this.lastY = event.y;
      // Optionally change cursor style, e.g.:
      document.body.style.cursor = 'grabbing';
    }
  };

  /********************************************************************
   * onMouseUp
   ********************************************************************/
  CharacterController.prototype.onMouseUp = function (event) {
    // If left button was released, stop dragging
    if (event.button === pc.MOUSEBUTTON_LEFT) {
      this.isMouseDown = false;
      // document.body.style.cursor = "default";
    }
  };

  /********************************************************************
   * onMouseMove
   ********************************************************************/
  CharacterController.prototype.onMouseMove = function (event) {
    // Only rotate while dragging
    if (!this.isMouseDown) return;

    // Mouse deltas
    var dx = event.x - this.lastX;
    var dy = event.y - this.lastY;

    this.lastX = event.x;
    this.lastY = event.y;

    // Adjust pitch & yaw
    this.eulers.x -= dy * this.sensitivity;
    this.eulers.y -= dx * this.sensitivity;

    // Clamp pitch
    this.eulers.x = pc.math.clamp(this.eulers.x, -90, 90);

    // Apply to player entity (yaw) and camera (pitch)
    this.entity.setLocalEulerAngles(0, this.eulers.y, 0);
    this.camera.setLocalEulerAngles(this.eulers.x, 0, 0);
  };

  /********************************************************************
   * update
   ********************************************************************/
  CharacterController.prototype.update = function (dt) {
    if (!this.entity.rigidbody) return;

    // SHIFT => run speed
    var isShift = this.app.keyboard.isPressed(pc.KEY_SHIFT);
    var moveSpeed = isShift ? this.fastSpeed : this.speed;

    // WASD
    var forward = 0;
    var right = 0;
    if (this.app.keyboard.isPressed(pc.KEY_W)) forward += 1;
    if (this.app.keyboard.isPressed(pc.KEY_S)) forward -= 1;
    if (this.app.keyboard.isPressed(pc.KEY_D)) right += 1;
    if (this.app.keyboard.isPressed(pc.KEY_A)) right -= 1;

    // Typical FPS: use entity's forward/right, ignoring y
    var f = this.entity.forward.clone();
    f.y = 0;
    f.normalize();

    var r = this.entity.right.clone();
    r.y = 0;
    r.normalize();

    // Combine them
    var move = new pc.Vec3();
    if (forward !== 0) {
      move.add(f.scale(forward));
    }
    if (right !== 0) {
      move.add(r.scale(right));
    }

    if (move.lengthSq() > 0) {
      move.normalize();
    }

    // scale by speed * dt
    move.scale(moveSpeed * dt);

    // Teleport the rigidbody
    var currentPos = this.entity.getPosition();
    currentPos.add(move);
    this.entity.rigidbody.teleport(currentPos);
  };

  /********************************************************************
   * destroy
   ********************************************************************/
  CharacterController.prototype.destroy = function () {
    // Remove our mouse listeners
    this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown);
    this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp);
    this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove);
  };
}
