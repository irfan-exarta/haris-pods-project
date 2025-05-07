// import * as pc from 'playcanvas';
// export function SetSkyboxDds(app, podName) {
//   app.scene.exposure = 1.4; // Matches "Exposure: 0.3"
//   app.scene.root = app;

//   // app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
//   // app.graphicsDevice.antialias = true; // Matches "Anti-Alias" enabled

//   app.scene.skyboxMip = 0;
//   app.scene.skyboxIntensity = 1; // Matches Intensity
//   // app.scene.clusteredLightingEnabled = true;
//   // app.scene.lighting.cells = new pc.Vec3(10, 3, 10);

//   // // console.log(app.scene.lighting);
//   // app.scene.lighting.maxLightsPerCell = 255;
//   // app.scene.lighting.shadowsEnabled = true;
//   // app.scene.lighting.shadowAtlasResolution = 2048;
//   // app.scene.lighting.shadowType = pc.SHADOW_PCF3_16F;

//   app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2, 1);
//   // app.scene.ambientLuminance = 1;
//   // app.scene.lightmapHDR = true;
//   // app.scene.lightmapMode = 0;

//   console.log(app.scene.sky);
//   // console.log(app.scene.fog);
//   // app.scene.lightmapSizeMultiplier = 16;
//   // app.scene.lightmapMaxResolution = 2048;
//   // app.scene.lightmapMode = 1;

//   const skybox = new pc.Asset(
//     'cubemap.dds',
//     'cubemap',
//     {
//       url: `/models/${podName}/skybox/cubemap.dds`,
//     },
//     {
//       textures: [
//         `/models/${podName}/skybox/px.png`,
//         `/models/${podName}/skybox/nx.png`,
//         `/models/${podName}/skybox/py.png`,
//         `/models/${podName}/skybox/ny.png`,
//         `/models/${podName}/skybox/pz.png`,
//         `/models/${podName}/skybox/nz.png`,
//       ],

//       type: pc.SKYTYPE_INFINITE,
//       // mipmaps: true,
//       filtering: pc.FILTER_LINEAR,
//       name: 'cubemap.dds',
//       minFilter: 5,
//       magFilter: 1,
//       anisotropy: 1,
//       rgbm: false,
//       prefiltered: 'cubemap.dds',
//     },
//   );
//   app.assets.add(skybox);
//   app.assets.load(skybox);

//   // const skyboxAsset = new pc.Asset("skybox", "cubemap", {
//   //   url: "/skyboxes/sky.png", // Skybox texture path
//   //   // mipmaps: false,
//   // });

//   // console.log(skybox);

//   skybox.on('load', function () {
//     // const skyLayer = app.scene.layers.getLayerById(pc.LAYERID_SKYBOX);
//     console.log(skybox);
//     //skyLayer.enabled = true;
//     // app.renderNextFrame = true;
//     // skybox.resources[0].type = 'default';
//     // skybox.resources[1].type = 'rgbm';
//     // skybox.resources[2].type = 'rgbm';
//     // skybox.resources[3].type = 'rgbm';
//     // skybox.resources[4].type = 'rgbm';
//     // skybox.resources[5].type = 'rgbm';
//     // skybox.resources[6].type = 'rgbm';
//     app.scene.setSkybox(skybox.resources);
//     // console.log(skybox.resources);

//     // app.scene.envAtlas = skybox.resource;
//     // app.scene.skyboxMip = 0; // Matches Mip level 1

//     // console.log("Skybox and scene settings applied.");
//   });

//   //   Add the asset to the asset registry and load it
//   // app.assets.add(skyboxAsset);
//   // app.assets.load(skyboxAsset);
// }

import * as pc from 'playcanvas';

export function SetSkyboxDds(app, podDetails) {
  console.log(podDetails);
  // const podName = podDetails.podName;
  const skyboxUrl = podDetails;
  app.scene.exposure = 1.4;
  app.scene.skyboxMip = 0;
  app.scene.skyboxIntensity = 1;
  app.scene.ambientLight = new pc.Color(1, 1, 1, 1);

  const skybox = new pc.Asset(
    'cubemap.dds',
    'cubemap',
    {
      url: '/hdri1.dds',
      // url: 'skybox.dds',
      // contents: skyboxUrl,
    },
    {
      type: pc.SKYTYPE_INFINITE,
      filtering: pc.FILTER_LINEAR,
      name: 'cubemap.dds',
      minFilter: pc.FILTER_LINEAR_MIPMAP_LINEAR,
      magFilter: pc.FILTER_LINEAR,
      anisotropy: 1,
      rgbm: false,
      prefiltered: 'cubemap.dds',
    },
  );

  app.assets.add(skybox);

  skybox.once('load', function () {
    console.log('Skybox loaded:', skybox);
    const cubemap = skybox.resources[1];
    // app.scene.setSkybox(skybox.resources);
    app.scene.skybox = cubemap;
  });

  app.assets.load(skybox);
}
