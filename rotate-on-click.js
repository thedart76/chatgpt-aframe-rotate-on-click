AFRAME.registerComponent('rotate-on-click', {
  schema: {
    easing: { default: 'easeInOutQuad' },
    duration: { default: 500 },
    degrees: { default: 180 },
    axis: { type: 'vec3', default: { x: 1, y: 0, z: 0 } },
  },

  init: function () {
    this.rotationDirection = 1;
    this.animationComplete = true;
    this.el.addEventListener('click', this.onClick.bind(this));
    this.el.addEventListener('animationcomplete', this.onAnimationComplete.bind(this));
  },

  update: function (oldData) {
    if (oldData.easing !== this.data.easing ||
      oldData.duration !== this.data.duration ||
      oldData.degrees !== this.data.degrees ||
      !AFRAME.utils.deepEqual(oldData.axis, this.data.axis)) {
      this.removeAnimation();
      this.setupAnimation();
    }
  },

  remove: function () {
    this.el.removeEventListener('click', this.onClick);
    this.el.removeEventListener('animationcomplete', this.onAnimationComplete);
    this.removeAnimation();
  },

  onClick: function () {
    if (!this.animationComplete) {
      return;
    }

    const currentRotation = this.el.getAttribute('rotation');
    const axis = this.data.axis;
    const targetRotation = {
      x: currentRotation.x + axis.x * this.data.degrees * this.rotationDirection,
      y: currentRotation.y + axis.y * this.data.degrees * this.rotationDirection,
      z: currentRotation.z + axis.z * this.data.degrees * this.rotationDirection,
    };

    this.el.setAttribute('animation', {
      property: 'rotation',
      to: targetRotation,
      easing: this.data.easing,
      dur: this.data.duration,
    });

    this.animationComplete = false;
  },

  onAnimationComplete: function () {
    this.animationComplete = true;
    this.rotationDirection *= -1;
  },

  removeAnimation: function () {
    this.el.removeAttribute('animation');
  },

  setupAnimation: function () {
    this.el.setAttribute('animation', {
      property: 'rotation',
      easing: this.data.easing,
      dur: this.data.duration,
    });
  },
});