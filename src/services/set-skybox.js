//import * as pc from 'playcanvas';

//export function SetSkyboxDds(app) {
//  return new Promise((resolve, reject) => {
//    const skyboxAsset = new pc.Asset(
//      'skybox',
//      'cubemap',
//      {
//        url: 'https://object.ord1.coreweave.com/pods-bucket/pods/ArabesqueCourtyard101/cubemap.dds',
//      },
//      {
//        prefiltered: true,
//        type: pc.SKYTYPE_INFINITE,
//        filtering: pc.FILTER_LINEAR,
//        rgbm: false,
//      },
//    );

//    skyboxAsset.once('load', () => {
//      console.log(skyboxAsset);
//      const cubemap = skyboxAsset.resources?.[1];

//      if (!cubemap) {
//        reject(new Error('Cubemap resource missing or incorrectly indexed'));
//        return;
//      }

//      app.scene.exposure = 1.4;
//      app.scene.skyboxMip = 0;
//      app.scene.skyboxIntensity = 1;
//      app.scene.ambientLight = new pc.Color(3, 3, 3);
//      app.scene.skybox = cubemap;
//      app.scene.setSkybox(skyboxAsset.resources);

//      resolve(cubemap);
//    });

//    skyboxAsset.once('error', (err) => {
//      reject(err);
//    });

//    app.assets.add(skyboxAsset);
//    app.assets.load(skyboxAsset);
//  });
//}

import * as pc from 'playcanvas';

export function SetSkyboxDds(app, postData) {
  return new Promise((resolve, reject) => {
    // Load the skybox
    const skyboxAsset = new pc.Asset(
      'skybox',
      'cubemap',
      {
        url: postData.podData?.podSettingsGlobal?.skyboxUrl,
      },
      {
        prefiltered: true,
        type: pc.SKYTYPE_INFINITE,
        filtering: pc.FILTER_LINEAR,
        rgbm: false,
      },
    );

    // Load the cubemap for reflection
    const reflectionAsset = new pc.Asset(
      'reflection',
      'cubemap',
      {
        url: postData.podData?.podSettingsGlobal?.floorCubemapUrl,
      },
      {
        prefiltered: true,
        type: pc.SKYTYPE_INFINITE,
        filtering: pc.FILTER_LINEAR,
        rgbm: false,
      },
    );

    let skyboxLoaded = false;
    let reflectionLoaded = false;
    let reflectionCubemap = null;

    function checkDone() {
      if (skyboxLoaded && reflectionLoaded) {
        resolve(reflectionCubemap);
      }
    }

    // Skybox load
    skyboxAsset.once('load', () => {
      const skyboxCubemap = skyboxAsset.resources?.[1];
      if (!skyboxCubemap) {
        reject(new Error('Skybox cubemap missing'));
        return;
      }
      //app.scene.exposure = 1.0;
      //app.scene.skyboxMip = 1;
      app.scene.skyboxIntensity = 1;
      //app.scene.ambientLight = new pc.Color(0.6, 0.6, 0.6);
      app.scene.skybox = skyboxCubemap;
      app.scene.setSkybox(skyboxAsset.resources);

      skyboxLoaded = true;
      checkDone();
    });

    // Reflection cubemap load
    reflectionAsset.once('load', () => {
      reflectionCubemap = reflectionAsset.resources?.[1];
      if (!reflectionCubemap) {
        reject(new Error('Reflection cubemap missing'));
        return;
      }

      reflectionLoaded = true;
      checkDone();
    });

    skyboxAsset.once('error', reject);
    reflectionAsset.once('error', reject);

    app.assets.add(skyboxAsset);
    app.assets.add(reflectionAsset);

    app.assets.load(skyboxAsset);
    app.assets.load(reflectionAsset);
  });
}
