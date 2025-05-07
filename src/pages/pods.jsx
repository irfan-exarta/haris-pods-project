import React, { useEffect, useRef, useState } from 'react';
import * as pc from 'playcanvas';
import { Application, Mouse, Keyboard, ElementInput, Entity, Asset } from 'playcanvas';
import { initAmmo, loadDracoDecoder } from '../services/ammo-draco-loader';
import { FpsPlayer } from '../services/fps-player.js';
import { SetSkyboxDds } from '../services/set-skybox.js';
import { FirstPersonCamera } from '../../public/scripts/first-person-camera.js';
import { useNavigate } from 'react-router-dom';
import PostOptionsPage from './Home.jsx';
import '../loadingScreen/loading.css';

// Custom Loading Screen Component
function LoadingScreen({ isVisible, onHide }) {
  useEffect(() => {
    // Effect to handle visibility changes
    if (!isVisible && onHide) {
      const timer = setTimeout(() => {
        onHide();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className='loading-container'>
      <svg viewBox='0 0 128 128' className='pl1'>
        <defs>
          <linearGradient y2='1' x2='1' y1='0' x1='0' id='pl-grad'>
            <stop stopColor='#000' offset='0%' />
            <stop stopColor='#fff' offset='100%' />
          </linearGradient>
          <mask id='pl-mask'>
            <rect fill='url(#pl-grad)' height='128' width='128' y='0' x='0' />
          </mask>
        </defs>

        <g fill='var(--primary)'>
          <g className='pl1__g'>
            <g transform='translate(20,20) rotate(0,44,44)'>
              <g className='pl1__rect-g'>
                <rect height='40' width='40' ry='8' rx='8' className='pl1__rect' />
                <rect
                  transform='translate(0,48)'
                  height='40'
                  width='40'
                  ry='8'
                  rx='8'
                  className='pl1__rect'
                />
              </g>
              <g transform='rotate(180,44,44)' className='pl1__rect-g'>
                <rect height='40' width='40' ry='8' rx='8' className='pl1__rect' />
                <rect
                  transform='translate(0,48)'
                  height='40'
                  width='40'
                  ry='8'
                  rx='8'
                  className='pl1__rect'
                />
              </g>
            </g>
          </g>
        </g>

        <g mask='url(#pl-mask)' fill='hsl(343,90%,50%)'>
          <g className='pl1__g'>
            <g transform='translate(20,20) rotate(0,44,44)'>
              <g className='pl1__rect-g'>
                <rect height='40' width='40' ry='8' rx='8' className='pl1__rect' />
                <rect
                  transform='translate(0,48)'
                  height='40'
                  width='40'
                  ry='8'
                  rx='8'
                  className='pl1__rect'
                />
              </g>
              <g transform='rotate(180,44,44)' className='pl1__rect-g'>
                <rect height='40' width='40' ry='8' rx='8' className='pl1__rect' />
                <rect
                  transform='translate(0,48)'
                  height='40'
                  width='40'
                  ry='8'
                  rx='8'
                  className='pl1__rect'
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

const Pods = (postData) => {
  const [frames, setFrames] = useState([]);
  const [editMode, setEditMode] = useState(postData.editMode);
  const [app, setApp] = useState(null);
  const navigate = useNavigate();
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [angle, setAngle] = useState(0);

  const podDetails = postData.podData;
  const deviceType = pc.DEVICETYPE_WEBGL2;

  // Track assets to load
  const totalAssetsToLoad = 2; // Base cube and user model
  const loadedAssets = useRef(0);

  const store = new pc.Asset('Pod', 'container', {
    url: '/models/Base_Cube.glb',
  });

  const store1 = new pc.Asset('Pod1', 'container', {
    url: postData.glbFile,
  });

  const banner = new pc.Asset('banner', 'container', {
    url: '/models/banner.glb',
  });

  const bazzarTex = new pc.Asset('bazaarTexture', 'texture', {
    url: '/images/Digital Bazaar1.png',
  });
  const exartaTex = new pc.Asset('exartaTexture', 'texture', {
    url: '/images/exarta.png',
  });
  const podsTex = new pc.Asset('podsTexture', 'texture', {
    url: '/images/Pods.png',
  });
  const zenivaTex = new pc.Asset('zenivaTexture', 'texture', {
    url: '/images/Zeniva.png',
  });
  const web3Tex = new pc.Asset('web3Texture', 'texture', {
    url: '/images/Platform 3.png',
  });

  const initializeGame = async () => {
    try {
      setLoadingProgress(0.05); // Initial progress

      const canvas = document.getElementById('application-canvas');
      if (!canvas) {
        console.error('Canvas element not found');
        setIsLoading(false);
        return;
      }

      // Update loading progress
      setLoadingProgress(0.1);

      const gfxOptions = {
        deviceTypes: [deviceType],
        glslangUrl: '/lib/glslang/glslang.js',
        twgslUrl: '/lib/twgsl/twgsl.js',
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
      };

      // Initialize Ammo.js
      await initAmmo();
      setLoadingProgress(0.2);

      // Load Draco decoder
      await loadDracoDecoder(pc);
      setLoadingProgress(0.3);

      // Create canvas configuration
      const devicePixelRatio = window.devicePixelRatio;
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;

      const device = await pc.createGraphicsDevice(canvas, gfxOptions);
      if (!device) {
        console.error('Failed to create WebGL device.');
        setIsLoading(false);
        return;
      }

      setLoadingProgress(0.4);

      const createOptions = new pc.AppOptions();
      createOptions.graphicsDevice = device;
      createOptions.keyboard = new Keyboard(document.body);
      createOptions.mouse = new Mouse(canvas);
      createOptions.elementInput = new ElementInput(canvas);
      createOptions.touch = new pc.TouchDevice(canvas);

      createOptions.componentSystems = [
        pc.RenderComponentSystem,
        pc.CameraComponentSystem,
        pc.LightComponentSystem,
        pc.ScriptComponentSystem,
        pc.CollisionComponentSystem,
        pc.RigidBodyComponentSystem,
        pc.ElementComponentSystem,
        pc.ParticleSystemComponentSystem,
        pc.AnimComponent,
        pc.AnimComponentSystem,
        pc.ScreenComponentSystem,
        pc.ParticleSystemComponent,
      ];
      createOptions.resourceHandlers = [
        pc.TextureHandler,
        pc.ContainerHandler,
        pc.ScriptHandler,
        pc.JsonHandler,
        pc.FontHandler,
        pc.AnimClipHandler,
        pc.AnimStateGraphHandler,
        pc.CubemapHandler,
      ];

      const newApp = new Application(canvas, createOptions);

      newApp.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
      newApp.setCanvasResolution(pc.RESOLUTION_AUTO);

      const resizeCanvas = () => {
        const canvas = newApp.graphicsDevice.canvas;
        const devicePixelRatio = window.devicePixelRatio;
        canvas.width = window.innerWidth * devicePixelRatio;
        canvas.height = window.innerHeight * devicePixelRatio;
        newApp.graphicsDevice.updateClientRect();
      };

      newApp.on('resize', resizeCanvas);
      resizeCanvas();

      // Register your script components here
      FirstPersonCamera();

      setApp(newApp);

      newApp.systems.add('rigidbody', {
        gravity: [0, -18, 0],
        maxSubSteps: 5,
        fixedTimeStep: 1 / 60,
      });

      setLoadingProgress(0.5);

      newApp.start();

      // Setup asset loading tracking
      const trackAssetLoading = () => {
        loadedAssets.current += 1;
        const progress = 0.5 + (loadedAssets.current / totalAssetsToLoad) * 0.5;
        setLoadingProgress(progress);

        if (loadedAssets.current >= totalAssetsToLoad) {
          setTimeout(() => {
            setIsLoading(false);
          }, 500); // Give a small delay before hiding
        }
      };

      // Configure scene with asset tracking
      await setupScene(newApp, trackAssetLoading, () => setIsLoading(false));
    } catch (error) {
      console.error('Game initialization error:', error);
      setIsLoading(false);
    }
  };

  const setupScene = async (app, onAssetLoaded, onLoadingFailed) => {
    // Setup skybox
    try {
      SetSkyboxDds(app, postData.skyboxFile);
    } catch (error) {
      console.error('Error setting skybox:', error);
    }

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Asset loading timed out');
      onLoadingFailed();
    }, 60000); // 60 second timeout

    // Create a promise to handle store loading
    const storeLoadPromise = new Promise((resolve, reject) => {
      store.on('load', () => {
        try {
          const container = store.resource;
          const model = container.instantiateRenderEntity();

          model.findComponents('render').forEach((render) => {
            const entity = render.entity;
            render.meshInstances[0].visible = false;

            entity.addComponent('rigidbody', {
              type: 'static',
            });
            entity.addComponent('collision', {
              type: 'mesh',
              renderAsset: render.asset,
            });
          });

          app.root.addChild(model);

          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          // const childPlane = new pc.Entity('plane1');
          // childPlane.setLocalPosition(3.457, 1.873, -6.824); // Position relative to the parent
          // childPlane.setLocalScale(1.5, 1.5, 1.5);
          // childPlane.setEulerAngles(90, 0, 0);

          // childPlane.addComponent('render', {
          //   type: 'plane',
          // });

          // // Create a material for the childPlane and apply the texture directly
          // const planeMaterial = new pc.StandardMaterial();

          // // Create and load the texture directly
          // const planeTexture = new pc.Asset('planeTexture', 'texture', {
          //   url: 'public/images/autoImage.jpg', // Your specific image path
          // });

          // // Add the texture to assets and load it
          // app.assets.add(planeTexture);
          // app.assets.load(planeTexture);

          // // Wait for the texture to load and then apply it
          // planeTexture.ready(function (asset) {
          //   planeMaterial.diffuseMap = asset.resource;
          //   planeMaterial.update();
          // });

          // planeMaterial.diffuse = new pc.Color(1, 1, 1); // White base color
          // planeMaterial.specular = new pc.Color(0.2, 0.2, 0.2); // Low specular reflection
          // planeMaterial.shininess = 30; // Medium shininess
          // planeMaterial.useMetalness = false;

          // childPlane.render.material = planeMaterial;

          // childPlane.render.castShadows = true;
          // childPlane.render.castShadowsLightmap = true;
          // childPlane.render.receiveShadows = true;

          // if (model.children && model.children.length >= 5) {
          //   model.children[4].addChild(childPlane);
          // }
          /////////////////////////////////////       VIDEO     //////////////////////////////////////////////////////////////////////

          const leftChildPlane = new pc.Entity('plane2');
          leftChildPlane.setLocalPosition(-6.784, 2.1, 3.323);
          leftChildPlane.setLocalScale(1.79, 1.3, 1.15);
          leftChildPlane.setEulerAngles(90, 90, 0);
          leftChildPlane.addComponent('render', {
            type: 'plane',
          });

          // Create a video element
          const video = document.createElement('video');
          video.src = 'public/rabbitmm.mp4';
          video.loop = true;
          video.muted = true;
          video.autoplay = true;
          video.play();

          // Create a texture from the video
          const videoTexture = new pc.Texture(app.graphicsDevice);
          videoTexture.setSource(video);

          // Create material with video texture
          const videoMaterial = new pc.StandardMaterial();
          videoMaterial.diffuseMap = videoTexture;
          videoMaterial.update();

          // Apply material to the plane
          leftChildPlane.render.material = videoMaterial;

          // Update the texture each frame
          app.on('update', function () {
            videoTexture.setSource(video);
          });

          leftChildPlane.render.castShadows = true;
          leftChildPlane.render.castShadowsLightmap = true;
          leftChildPlane.render.receiveShadows = true;

          if (model.children && model.children.length >= 4) {
            model.children[3].addChild(leftChildPlane);
          }
          /////////////////////////////////////       VIDEO    //////////////////////////////////////////////////////////////////////////

          onAssetLoaded(); // Track loading progress
          resolve(model);
        } catch (error) {
          console.error('Error processing Base_Cube.glb:', error);
          reject(error);
        }
      });

      store.on('error', (err) => {
        console.error('Error loading Base_Cube.glb:', err);
        reject(err);
      });
    });

    // Add the store asset and start loading
    app.assets.add(store);
    app.assets.load(store);

    const store1LoadPromise = new Promise((resolve) => {
      store1.on('load', () => {
        const container = store1.resource;
        const model = container.instantiateRenderEntity();
        const nodes = container.data.gltf.nodes;
        const renders = model.findComponents('render');
        model.findComponents('render').forEach((render) => {
          const entity = render.entity;
          if (render.entity.name.includes('Wall')) {
            return;
          }
          entity.addComponent('rigidbody', {
            type: 'static',
          });
          entity.addComponent('collision', {
            type: 'mesh',
            renderAsset: render.asset,
          });
        });

        app.root.addChild(model);
        resolve(model);
      });
    });

    app.assets.add(bazzarTex);
    app.assets.load(bazzarTex);

    app.assets.add(exartaTex);
    app.assets.load(exartaTex);

    app.assets.add(podsTex);
    app.assets.load(podsTex);

    app.assets.add(zenivaTex);
    app.assets.load(zenivaTex);

    app.assets.add(web3Tex);
    app.assets.load(web3Tex);

    const bannerPromise = new Promise((resolve) => {
      banner.on('load', () => {
        const container = banner.resource;
        const model = container.instantiateRenderEntity();
        const nodes = container.data.gltf.nodes;
        const renders = model.findComponents('render');
        model.findComponents('render').forEach((render) => {
          const entity = render.entity;
          if (render.entity.name.includes('Wall')) {
            return;
          }
          entity.addComponent('rigidbody', {
            type: 'static',
          });
          entity.addComponent('collision', {
            type: 'mesh',
            renderAsset: render.asset,
          });
        });

        const Bazaar = model.findByName('Bazaar');

        const bazarmat = new pc.StandardMaterial();
        bazarmat.diffuseMap = bazzarTex.resource;
        bazarmat.update();

        Bazaar.render.meshInstances[0].material = bazarmat;

        const Exarta = model.findByName('Exarta');

        const exartamat = new pc.StandardMaterial();
        exartamat.diffuseMap = exartaTex.resource;
        exartamat.update();

        Exarta.render.meshInstances[0].material = exartamat;

        const Pods = model.findByName('Pods');

        const podsmat = new pc.StandardMaterial();
        podsmat.diffuseMap = podsTex.resource;
        podsmat.update();

        Pods.render.meshInstances[0].material = podsmat;

        const Zeniva = model.findByName('Zeniva');

        const zenivamat = new pc.StandardMaterial();
        zenivamat.diffuseMap = zenivaTex.resource;
        zenivamat.update();

        Zeniva.render.meshInstances[0].material = zenivamat;

        const Web3 = model.findByName('Web3');

        const web3mat = new pc.StandardMaterial();
        web3mat.diffuseMap = web3Tex.resource;
        web3mat.update();

        Web3.render.meshInstances[0].material = web3mat;

        const PodsVideo = model.findByName('PodsVideo');

        const angles = PodsVideo.getLocalEulerAngles().clone();

        PodsVideo.setLocalEulerAngles(angles.x, angles.y + 180, angles.z);
        const video = document.createElement('video');
        video.src = 'public/images/podsvideocopy1.mp4';
        video.loop = true;
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;

        const videoTexture = new pc.Texture(app.graphicsDevice);
        const videoMaterial = new pc.StandardMaterial();
        videoMaterial.diffuseMap = videoTexture;
        videoMaterial.update();
        PodsVideo.render.meshInstances[0].material = videoMaterial;

        function attemptPlayVideo() {
          videoTexture.setSource(video);
          const playPromise = video.play();

          if (playPromise !== undefined) {
            playPromise.catch(() => {
              const playOnInteraction = () => {
                video.play().finally(() => {
                  document.removeEventListener('touchstart', playOnInteraction);
                  document.removeEventListener('click', playOnInteraction);
                });
              };
              document.addEventListener('touchstart', playOnInteraction, { once: true });
              document.addEventListener('click', playOnInteraction, { once: true });
            });
          }
        }

        attemptPlayVideo();

        app.on('update', function () {
          if (!video.paused) {
            videoTexture.upload();
          }
        });

        app.root.addChild(model);
        resolve(model);
      });
    });

    // Add the store asset and start loading
    app.assets.add(store1);
    app.assets.load(store1);

    app.assets.add(banner);
    app.assets.load(banner);

    try {
      // // Wait for both assets to load
      // const [baseModel, userModel] = await Promise.all([
      //   storeLoadPromise.catch((err) => {
      //     console.error('Base model loading error:', err);
      //     onAssetLoaded(); // Count it as loaded even if it failed
      //     return null;
      //   }),
      //   store1LoadPromise.catch((err) => {
      //     console.error('User model loading error:', err);
      //     onAssetLoaded(); // Count it as loaded even if it failed
      //     return null;
      //   }),
      // ]);
      await storeLoadPromise;
      await store1LoadPromise;
      await bannerPromise;

      onAssetLoaded();

      clearTimeout(timeout); // Clear the timeout as assets are loaded

      // Initialize player if models loaded successfully
      // if (baseModel || userModel) {
      const { player, playerCamera } = FpsPlayer(app, podDetails, 45, editMode);
      window.playerCamera = playerCamera;
      // }
    } catch (error) {
      console.error('Error during scene setup:', error);
      onLoadingFailed(); // Ensure loading screen is removed
    }
  };

  useEffect(() => {
    initializeGame().catch((error) => {
      console.error('Failed to initialize game:', error);
      setIsLoading(false);
    });

    return () => {
      // Cleanup function
      if (app) {
        app.destroy();
      }

      // Remove any Ammo.js script
      const ammoScript = document.querySelector('script[src*="ammo.wasm.js"]');
      if (ammoScript) {
        ammoScript.remove();
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (app) {
        app.resizeCanvas();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [app]);

  return (
    <>
      <div className='relative w-full h-full '>
        <canvas
          id='application-canvas'
          className='absolute inset-0 w-full h-full top-0 left-0 z-0'
        />
        {isNavBarOpen && (
          <div
            className='fixed inset-0 bg-black/50 backdrop-blur-md z-10'
            onClick={() => setIsNavBarOpen(false)}
          />
        )}
        {isNavBarOpen && (
          <div className='absolute top-20 left-0 z-50 w-full px-7'>
            <PostOptionsPage setIsNavBarOpen={setIsNavBarOpen} />
          </div>
        )}
      </div>

      <button
        className='
          absolute
          top-5
          left-8
          z-20
          w-12
          h-12
          flex
          items-center
          justify-center
          rounded-lg
          bg-white-700/90
          bg-opacity-80
          text-white
          text-xl
          font-bold
          shadow-md 
          bg-[#222423]
          transition-transform
          transform
          hover:scale-110
          active:scale-95
          focus:outline-none
          cursor-pointer 
        '
        onClick={() => setIsNavBarOpen((prev) => !prev)}
      >
        <img src='public/images/Group 1353.svg' className='w-6 h-6' />
      </button>

      {/* <button
        className='
          absolute
          top-5
          right-8
          z-20
          w-12
          h-12
          flex
          items-center
          justify-center
          rounded-lg
          bg-white-700/90
          bg-opacity-80
          text-white
          text-xl
          font-bold
          shadow-md 
          bg-[#222423]
          transition-transform
          transform
          hover:scale-110
          active:scale-95
          focus:outline-none
          cursor-pointer
        '
        onClick={() => setIsNavBarOpen((prev) => !prev)}
      >
        <img src='/images/share-arrow-white-icon.png' className='w-6 h-6' />
      </button> */}

      <button
        className='
    absolute
    top-5
    right-8
    z-20
    w-12
    h-12
    flex
    items-center
    justify-center
    rounded-lg
    bg-white-700/90
    bg-opacity-80
    text-white
    text-xl
    font-bold
    shadow-md 
    bg-[#222423]
    transition-transform
    transform
    hover:scale-110
    active:scale-95
    focus:outline-none
    cursor-pointer
  '
        onClick={() => {
          const shareData = {
            title: document.title,
            text: 'Check this out!',
            url: window.location.href,
          };

          if (navigator.share) {
            navigator.share(shareData).catch((err) => {
              console.error('Share failed:', err);
              fallbackCopyLink(shareData.url);
            });
          } else {
            fallbackCopyLink(shareData.url);
          }

          function fallbackCopyLink(url) {
            navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
            // .catch(() => alert('Unable to copy. Please copy manually.'));
          }
        }}
      >
        <img src='/images/share-arrow-white-icon.png' className='w-6 h-6' />
      </button>

      {/* Custom Loading Screen Component */}
      <LoadingScreen isVisible={isLoading} onHide={() => setIsLoading(false)} />
    </>
  );
};

export default Pods;
