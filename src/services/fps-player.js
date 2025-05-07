import * as pc from 'playcanvas';

// Access the global variable

export function FpsPlayer(app, podDetails, angle, editmode, startPos) {
  const existingPlayer = app.root.findByName('Player');
  if (existingPlayer) {
    existingPlayer.destroy();
  }

  console.log(app.root.findByName('iframePlane'));

  const playerCamera = new pc.Entity('Camera');
  const playerCameraPosition = podDetails.podSettingsGlobal.defaultCameraSettingsFps.position;

  if (isMobileDevice()) {
    console.log('User is on a mobile device');
    window.fov = 65;
    if (editmode) {
      playerCamera.addComponent('camera', {
        farClip: 1000,
        nearClip: 0.1,
        fov: window.fov,
      });

      if (angle === 180) {
        playerCamera.setLocalPosition(3.579, 1.505, 3.96);
      } else {
        playerCamera.setPosition(5.579, 1.505, 5.96);
      }

      playerCamera.setEulerAngles(-8, 44, 0); //initial view desktop angle
    } else {
      playerCamera.addComponent('camera', {
        farClip: podDetails.podSettingsGlobal.defaultCameraSettingsFps.farClip,
        nearClip: podDetails.podSettingsGlobal.defaultCameraSettingsFps.nearClip,
        fov: podDetails.podSettingsGlobal.defaultCameraSettingsFps.fov,
      });

      playerCamera.setPosition(playerCameraPosition.x, 0.8, playerCameraPosition.z);
    }
  } else {
    console.log('User is on a desktop/laptop');
    window.fov = 40;

    /////////////////
    if (editmode) {
      playerCamera.addComponent('camera', {
        farClip: 1000,
        nearClip: 0.1,
        fov: window.fov,
      });

      if (angle === 180) {
        playerCamera.setLocalPosition(3.579, 1.505, 3.96);
      } else {
        playerCamera.setPosition(5.579, 1.505, 5.96);
      }

      playerCamera.setEulerAngles(2, 44, 0); //initial view desktop angle
      // playerCamera.setLocalEulerAngles(-5, 0, 0);
    } else {
      playerCamera.addComponent('camera', {
        farClip: podDetails.podSettingsGlobal.defaultCameraSettingsFps.farClip,
        nearClip: podDetails.podSettingsGlobal.defaultCameraSettingsFps.nearClip,
        fov: podDetails.podSettingsGlobal.defaultCameraSettingsFps.fov,
      });

      playerCamera.setPosition(playerCameraPosition.x, 0.8, playerCameraPosition.z);
    }
  }

  playerCamera.camera.clearColorBuffer = true;
  playerCamera.camera.clearDepthBuffer = true;
  playerCamera.camera.clearColor = new pc.Color(0, 0, 0, 0);
  playerCamera.camera.frustumCulling = true;
  playerCamera.camera.toneMapping = pc.TONEMAP_ACES2;
  playerCamera.camera.gammaCorrection = pc.GAMMA_SRGB;

  const player = new pc.Entity('Player');
  if (!editmode) {
    player.addComponent('model', { type: 'capsule' });
    player.addComponent('collision', {
      type: 'capsule',
      radius: 0.5,
      height: 1,
    });
    player.setLocalPosition(4.5, 0.7, 2.5);
  }

  if (startPos) {
    player.setLocalPosition(startPos.x, startPos.y, startPos.z);
    console.log(
      `Setting player position to: ${startPos.name || 'Custom'} (${startPos.x}, ${startPos.y}, ${startPos.z})`,
    );
  } else {
    player.setLocalPosition(10.344923973083496, 0.49666786193847656, 8.666194915771484);
    console.log('Setting player to default front position');
  }

  player.setLocalEulerAngles(0, angle ? angle : 0, 0);
  player.addComponent('rigidbody', {
    type: 'dynamic',
    mass: 85,
  });

  player.rigidbody.angularFactor = new pc.Vec3(0, 0, 0);
  player.rigidbody.angularDamping = 1;
  player.rigidbody.friction = 0.75;
  player.rigidbody.restitution = 0.5;
  player.rigidbody.linearDamping = 0.99;
  player.rigidbody.linearFactor = new pc.Vec3(1, 1, 1);

  player.addChild(playerCamera);

  if (!editmode) {
    player.addComponent('script');

    ////////////
    player.script.create('characterController', {
      attributes: {
        speed: 5,
        jumpImpulse: 400,
        rotationSmoothness: 10,
        camera: playerCamera,
      },
    });

    // firstPersonCamera
    player.script.create('firstPersonCamera', {
      attributes: {
        camera: playerCamera, // assuming 'Camera' is a reference to an entity or object
      },
    });

    // keyboardInput
    player.script.create('keyboardInput');

    // mouseInput
    player.script.create('mouseInput');

    // touchInput
    player.script.create('touchInput', {
      attributes: {
        deadZone: 0.3,
        turnSpeed: 100,
        radius: 50,
        doubleTapInterval: 300,
      },
    });
  }

  app.root.addChild(player);

  var Raycast = pc.createScript('raycast');

  Raycast.attributes.add('camera', {
    type: 'entity',
    title: 'Camera Entity',
  });

  Raycast.prototype.initialize = function () {
    this.cameraEntity = this.camera || this.entity;

    // Mobile
    this.app.touch.on(
      pc.EVENT_TOUCHSTART,
      (e) => {
        const touch = e.touches[0];
        const from = this.cameraEntity.getPosition();
        const to = this.cameraEntity.camera.screenToWorld(
          touch.x,
          touch.y,
          this.cameraEntity.camera.farClip,
        );

        const result = this.app.systems.rigidbody.raycastFirst(from, to);

        if (result && result.entity) {
          const hitEntity = result.entity;
          console.log('Touch hit:', hitEntity.name);

          // 🚨 Must call window.open directly here
          if (hitEntity.name === 'Bazaar')
            window.open(
              'https://marketplace-frontend.tenant-7654b5-plat3.ord1.ingress.coreweave.cloud/',
              '_blank',
            );
          if (hitEntity.name === 'Exarta') window.open('https://exarta.com/', '_blank');
          if (hitEntity.name === 'Pods') window.open('https://exarta.com/pods/', '_blank');
          if (hitEntity.name === 'Zeniva') window.open('https://zeniva.ai/', '_blank');
          if (hitEntity.name === 'Web3') window.open('https://platform3.io/', '_blank');
        }
      },
      this,
    );

    // Desktop
    this.app.mouse.on(
      pc.EVENT_MOUSEDOWN,
      (e) => {
        const from = this.cameraEntity.getPosition();
        const to = this.cameraEntity.camera.screenToWorld(
          e.x,
          e.y,
          this.cameraEntity.camera.farClip,
        );

        const result = this.app.systems.rigidbody.raycastFirst(from, to);

        if (result && result.entity) {
          const hitEntity = result.entity;
          console.log('Mouse hit:', hitEntity.name);

          if (hitEntity.name === 'Bazaar') window.open('https://marketplace...', '_blank');
          if (hitEntity.name === 'Exarta') window.open('https://exarta.com/', '_blank');
          if (hitEntity.name === 'Pods') window.open('https://exarta.com/pods/', '_blank');
          if (hitEntity.name === 'Zeniva') window.open('https://zeniva.ai/', '_blank');
          if (hitEntity.name === 'Web3') window.open('https://platform3.io/', '_blank');
        }
      },
      this,
    );
  };

  // var Raycast = pc.createScript('raycast');

  // Raycast.attributes.add('camera', {
  //   type: 'entity',
  //   title: 'Camera Entity',
  // });

  // Raycast.prototype.initialize = function () {
  //   this.cameraEntity = this.camera || this.entity;

  //   // Mouse and touch support
  //   this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.doRaycast, this);
  //   this.app.touch.on(pc.EVENT_TOUCHSTART, this.doRaycast, this);
  // };

  // Raycast.prototype.mouseDown = function (e) {
  //   if (e.event && e.event.target.closest && e.event.target.closest('.overlay-element')) {
  //     console.log('Raycast blocked by overlay element.');
  //     return; // Ignore events on the overlay
  //   } else this.doRaycast(e);
  // };

  // Raycast.prototype.doRaycast = function (screenPosition) {
  //   if (!this.cameraEntity || !this.cameraEntity.camera) {
  //     console.error('🚫 Camera entity or camera component missing.');
  //     return;
  //   }
  //   var from = this.cameraEntity.getPosition();
  //   var to = this.cameraEntity.camera.screenToWorld(
  //     screenPosition.x,
  //     screenPosition.y,
  //     this.cameraEntity.camera.farClip,
  //   );

  //   // Raycast between the two points
  //   const result = this.app.systems.rigidbody.raycastFirst(from, to);
  //   console.log(result);

  //   if (result && result.entity) {
  //     const hitEntity = result.entity;

  //     console.log(hitEntity);

  //     if (hitEntity.name == 'Bazaar') {
  //       window.open(
  //         'https://marketplace-frontend.tenant-7654b5-plat3.ord1.ingress.coreweave.cloud',
  //         '_blank',
  //       );
  //     }

  //     if (hitEntity.name == 'Exarta') {
  //       window.open('https://exarta.com/', '_blank');
  //     }
  //     if (hitEntity.name == 'Pods') {
  //       window.open('https://exarta.com/pods/', '_blank');
  //     }
  //     if (hitEntity.name == 'Zeniva') {
  //       window.open('https://zeniva.ai/', '_blank');
  //     }
  //     if (hitEntity.name == 'Web3') {
  //       window.open('https://platform3.io/', '_blank');
  //     }
  //   }
  // };

  if (!playerCamera.script) {
    playerCamera.addComponent('script');
  }

  playerCamera.script.create('raycast', {
    attributes: {
      camera: playerCamera,
    },
  });

  return { player, playerCamera };
}

function isMobileDevice(mobileMaxWidth = 768) {
  // Method 1: Screen width detection
  const isSmallScreen = window.innerWidth <= mobileMaxWidth;

  // Method 2: User agent detection (fallback)
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileRegex.test(userAgent);

  // Method 3: Touch capability detection
  const hasTouchCapability =
    'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  // Combine methods for better accuracy
  // If screen width is small OR has mobile user agent AND has touch capability
  return isSmallScreen || (isMobileUserAgent && hasTouchCapability);
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
