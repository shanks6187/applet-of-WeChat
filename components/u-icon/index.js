Component({
  externalClasses: ['custom-class'],
  options: {
    addGlobalClass: true
  },
  properties: {
    type: {
      type: String,
      value: 'icon'
    },
    info: null,
    name: String,
    size: String,
    color: String,
    customStyle: String,
    classPrefix: {
      type: String,
      value: 'u-icon'
    }
  },
  methods: {
    onClick: function onClick() {
      this.triggerEvent('click');
    }
  }
});