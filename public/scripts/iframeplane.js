import * as pc from 'playcanvas';
export function ChangeColor(extendedPc, app) {
  var IframePlane = pc.createScript('iframePlane');
  IframePlane.attributes.add('iframeUrl', { type: 'string' });
  IframePlane.attributes.add('pixelsPerUnit', {
    type: 'number',
    default: 640,
    description:
      'Number of canvas pixels per unit of world space. The larger the number, the higher the resolution of the iframe.',
  });

  console.log('camera in iframe plane script', app.root.findComponent('camera'));

  // initialize code called once per entity
  IframePlane.prototype.initialize = function () {
    // WARNING: IframePlane does not work with touch events

    var element;

    if (this.iframeUrl) {
      element = document.createElement('iframe');
      element.src = this.iframeUrl;
      element.style.border = '0px';
    } else {
      element = null;
    }

    this._css3Plane = new extendedPc.Css3Plane(
      element,
      this.entity,
      this.pixelsPerUnit,
      app.root.findComponent('camera'),
    );

    var material = new pc.StandardMaterial();
    material.depthWrite = true;
    material.redWrite = false;
    material.greenWrite = false;
    material.blueWrite = false;
    material.alphaWrite = false;
    material.blendType = pc.BLEND_NONE;
    material.opacity = 0;
    material.cull = pc.CULLFACE_BACK;
    material.update();

    this.entity.render.material = material;

    console.log('PLANE', this.entity);

    this.on(
      'enable',
      function () {
        this._css3Plane.enable();
      },
      this,
    );

    this.on(
      'disable',
      function () {
        this._css3Plane.disable();
      },
      this,
    );
  };
}
