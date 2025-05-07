// extendedPc.js
import * as pc from 'playcanvas';

// --- Helper functions ---
const epsilon = (value) => {
  return Math.abs(value) < 1e-10 ? 0 : value;
};

const getCameraCSSMatrix = (matrix) => {
  const elements = matrix.data;
  return (
    'matrix3d(' +
    epsilon(elements[0]) +
    ',' +
    epsilon(-elements[1]) +
    ',' +
    epsilon(elements[2]) +
    ',' +
    epsilon(elements[3]) +
    ',' +
    epsilon(elements[4]) +
    ',' +
    epsilon(-elements[5]) +
    ',' +
    epsilon(elements[6]) +
    ',' +
    epsilon(elements[7]) +
    ',' +
    epsilon(elements[8]) +
    ',' +
    epsilon(-elements[9]) +
    ',' +
    epsilon(elements[10]) +
    ',' +
    epsilon(elements[11]) +
    ',' +
    epsilon(elements[12]) +
    ',' +
    epsilon(-elements[13]) +
    ',' +
    epsilon(elements[14]) +
    ',' +
    epsilon(elements[15]) +
    ')'
  );
};

const getObjectCSSMatrix = (matrix, scaleX, scaleY) => {
  const elements = matrix.data;
  const matrix3d =
    'matrix3d(' +
    epsilon(elements[0] / scaleX) +
    ',' +
    epsilon(elements[1] / scaleX) +
    ',' +
    epsilon(elements[2] / scaleX) +
    ',' +
    epsilon(elements[3] / scaleX) +
    ',' +
    epsilon(elements[8] / scaleY) +
    ',' +
    epsilon(elements[9] / scaleY) +
    ',' +
    epsilon(elements[10] / scaleY) +
    ',' +
    epsilon(elements[11] / scaleY) +
    ',' +
    epsilon(elements[4]) +
    ',' +
    epsilon(elements[5]) +
    ',' +
    epsilon(elements[6]) +
    ',' +
    epsilon(elements[7]) +
    ',' +
    epsilon(elements[12]) +
    ',' +
    epsilon(elements[13]) +
    ',' +
    epsilon(elements[14]) +
    ',' +
    epsilon(elements[15]) +
    ')';
  // Center the origin
  return 'translate(-50%,-50%)' + matrix3d;
};

const randomCssColor = () => {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
};

// --- Css3Renderer Class ---
export class Css3Renderer {
  constructor() {
    const app = pc.Application.getApplication();
    // Ensure we only have one renderer instance
    if (app.css3Renderer) {
      return app.css3Renderer;
    }
    app.css3Renderer = this;

    // Initialize properties
    this._stageElement = null;
    this._cameras = [];
    this._cameraElements = [];
    this._defaultCameraElement = null;
    this._css3Targets = [];
    this._cameraInvertMat = new pc.Mat4();
    this._cameraHalfSize = new pc.Vec2();

    // Create a container div for all camera elements
    const stageElement = document.createElement('div');
    stageElement.style.overflow = 'hidden';
    stageElement.style.pointerEvents = 'auto';
    stageElement.style.display = 'block';
    document.body.appendChild(stageElement);
    stageElement.style.position = 'absolute';
    // stageElement.style.top = "0";
    // stageElement.style.left = "0";
    // stageElement.style.zIndex = "0"; // Ensure it's above other elements

    // Attach touch and element input if available
    if (app.touch) {
      app.touch.attach(stageElement);
    }
    if (app.elementInput) {
      app.elementInput.attach(stageElement);
    }

    // Find the canvas element
    const canvas = document.getElementById('application-canvas');
    canvas.style.pointerEvents = 'none';
    document.body.insertBefore(stageElement, canvas);

    this._stageElement = stageElement;
    this._defaultCameraElement = this.addCamera(app.root.findComponent('camera'));

    // Resize handling for the stage and camera elements
    const self = this;
    function onWindowResize() {
      self._width = window.innerWidth;
      self._height = window.innerHeight;
      self._widthHalf = self._width / 2;
      self._heightHalf = self._height / 2;
      self._stageElement.style.width = self._width + 'px';
      self._stageElement.style.height = self._height + 'px';
      for (let i = 0; i < self._cameraElements.length; i++) {
        self._cameraElements[i].style.width = self._width + 'px';
        self._cameraElements[i].style.height = self._height + 'px';
      }
    }
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
  }

  render() {
    if (this._isRendering) return;
    this._isRendering = true;
    const app = pc.Application.getApplication();
    app.on('update', this._renderElements, this);
  }

  cancelRender() {
    const app = pc.Application.getApplication();
    app.off('update', this._renderElements, this);
    this._isRendering = false;
  }

  addCamera(camera) {
    if (!camera) return this._defaultCameraElement;
    const index = this._cameras.indexOf(camera);
    if (index > -1) {
      return this._cameraElements[index];
    }
    // Create a new div for this camera
    const cameraElement = document.createElement('div');
    cameraElement.style.WebkitTransformStyle = 'preserve-3d';
    cameraElement.style.transformStyle = 'preserve-3d';
    cameraElement.style.pointerEvents = 'none';
    this._stageElement.appendChild(cameraElement);
    this._cameras.push(camera);
    this._cameraElements.push(cameraElement);
    return cameraElement;
  }

  addTarget(target) {
    if (this._css3Targets.indexOf(target) === -1) {
      this._css3Targets.push(target);
    }
  }

  removeTarget(target) {
    const index = this._css3Targets.indexOf(target);
    if (index !== -1) {
      this._css3Targets.splice(index, 1);
    }
  }

  blockEvents(state) {
    for (let i = 0; i < this._css3Targets.length; i++) {
      this._css3Targets[i].blockEvents(state);
    }
  }

  _renderElements() {
    for (let i = 0; i < this._cameras.length; i++) {
      let tx, ty, cameraCSSMatrix, style;
      const camera = this._cameras[i];
      const cameraElement = this._cameraElements[i];
      const fov = camera.projectionMatrix.data[5] * this._heightHalf;
      if (camera.projection == pc.PROJECTION_PERSPECTIVE) {
        this._stageElement.style.WebkitPerspective = fov + 'px';
        this._stageElement.style.perspective = fov + 'px';
      } else {
        this._stageElement.style.WebkitPerspective = '';
        this._stageElement.style.perspective = '';
      }
      if (camera.projection === pc.PROJECTION_ORTHOGRAPHIC) {
        pc.Mat4._getPerspectiveHalfSize(
          this._cameraHalfSize,
          camera.fov,
          camera.aspectRatio,
          camera.nearClip,
          camera.horizontalFov,
        );
        tx = -(this._cameraHalfSize.x - this._cameraHalfSize.x) / 2;
        ty = (this._cameraHalfSize.y - this._cameraHalfSize.y) / 2;
      }
      this._cameraInvertMat.copy(camera.entity.getWorldTransform()).invert();
      cameraCSSMatrix =
        camera.projection === pc.PROJECTION_ORTHOGRAPHIC
          ? 'scale(' +
            fov +
            ')translate(' +
            epsilon(tx) +
            'px,' +
            epsilon(ty) +
            'px)' +
            getCameraCSSMatrix(this._cameraInvertMat)
          : 'translateZ(' + fov + 'px)' + getCameraCSSMatrix(this._cameraInvertMat);
      style = cameraCSSMatrix + 'translate(' + this._widthHalf + 'px,' + this._heightHalf + 'px)';
      cameraElement.style.WebkitTransform = style;
      cameraElement.style.transform = style;
    }
    for (let j = 0; j < this._css3Targets.length; j++) {
      this._css3Targets[j].updateTransform();
    }
  }
}

// --- Css3Plane Class ---
export class Css3Plane {
  /**
   * Creates a new Css3Plane instance.
   * @param {HTMLElement} dom - The DOM element to show; a new one is created if not provided.
   * @param {pc.Entity} entity - The entity to attach; a new one is created if not provided.
   * @param {number} pixelsPerWorldUnit - Number of pixels per world unit.
   * @param {pc.CameraComponent} camera - The camera.
   */
  constructor(dom, entity, pixelsPerWorldUnit, camera) {
    const app = pc.Application.getApplication();

    console.log('CAMERA IN CSS#PLANE', camera);
    if (!app.css3Renderer) {
      app.css3Renderer = new Css3Renderer();
    }
    this._renderer = app.css3Renderer;

    if (!dom) {
      dom = document.createElement('div');
      dom.innerHTML = 'CSS3 Plane';
      dom.style.backgroundColor = randomCssColor();
      dom.style.textAlign = 'center';
    }
    dom.style.position = 'absolute';
    dom.style.pointerEvents = 'auto';
    dom.style.backfaceVisibility = 'hidden';
    dom.style.webkitBackfaceVisibility = 'hidden';
    this.dom = dom;

    if (!entity) {
      entity = new pc.Entity();
      app.root.addChild(entity);
    }
    this.entity = entity;
    this.cameraElement = this._renderer.addCamera(camera);
    this.cameraElement.appendChild(dom);

    this._maxWidth = 1920;
    this._maxHeight = 1080;
    pixelsPerWorldUnit = pixelsPerWorldUnit || this._maxWidth;
    this.pixelsPerWorldUnit = new pc.Vec2(pixelsPerWorldUnit, pixelsPerWorldUnit);

    this._renderer.addTarget(this);
    this._renderer.render();
  }

  updateTransform() {
    const modelTransform = this.entity.getWorldTransform();
    const scale = modelTransform.getScale();
    const width = Math.min(scale.x * this.pixelsPerWorldUnit.x, this._maxWidth);
    const height = Math.min(scale.z * this.pixelsPerWorldUnit.y, this._maxHeight);
    const style = getObjectCSSMatrix(modelTransform, width, height);
    this.dom.style.width = Math.round(width) + 'px';
    this.dom.style.height = Math.round(height) + 'px';
    this.dom.style.lineHeight = this.dom.style.height;
    this.dom.style.WebkitTransform = style;
    this.dom.style.transform = style;
  }

  blockEvents(state) {
    this.dom.style.pointerEvents = state ? 'none' : 'auto';
  }

  attachPlane(entity) {
    this.entity = entity;
  }

  disable() {
    this.cameraElement.removeChild(this.dom);
    this._renderer.removeTarget(this);
  }

  enable() {
    this.cameraElement.appendChild(this.dom);
    this._renderer.addTarget(this);
  }
}

// --- Export setupCss3Extensions ---
// This function attaches your custom classes to the passed in PlayCanvas module.
export function setupCss3Extensions(pcModule) {
  pcModule.Css3Renderer = Css3Renderer;
  pcModule.Css3Plane = Css3Plane;
}

// --- Export extendedPc ---
// This object merges the original pc module with our new classes.
export const extendedPc = {
  ...pc,
  Css3Renderer,
  Css3Plane,
};
