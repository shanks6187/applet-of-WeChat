// components/u-rate/index.js
Component({
  field: true,
  classes: ['icon-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    value: Number,
    readonly: Boolean,
    disabled: Boolean,
    allowHalf: Boolean,
    count: {
        type: Number,
        value: 5
    },
    size: {
        type: String,
        value: '30rpx'
    },
    gutter: {
        type: String,
        value: '6rpx'
    },
    icon: {
        type: String,
        value: 'star'
    },
    voidIcon: {
        type: String,
        value: 'star-o'
    },
    color: {
        type: String,
        value: '#fce15d'
    },
    voidColor: {
        type: String,
        value: '#c7c7c7'
    },
    disabledColor: {
        type: String,
        value: '#bdbdbd'
    },
    touchable: {
        type: Boolean,
        value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
        const { data } = this;
        const { score } = event.currentTarget.dataset;
        if (!data.disabled && !data.readonly) {
            this.setData({ value: score + 1 });
            this.triggerEvent('input', score + 1);
            this.triggerEvent('change', score + 1);
        }
        // console.log(data);
    },
    onTouchMove(event) {
        const { touchable } = this.data;
        if (!touchable)
            return;
        const { clientX, clientY } = event.touches[0];
        this.getRect('.u-rate__icon', true).then((list) => {
            const target = list
                .sort(item => item.right - item.left)
                .find(item => clientX >= item.left &&
                clientX <= item.right &&
                clientY >= item.top &&
                clientY <= item.bottom);
            if (target != null) {
                this.onSelect(Object.assign(Object.assign({}, event), { currentTarget: target }));
            }
        });
    },
    getRect(selector, all) {
        return new Promise(resolve => {
            wx.createSelectorQuery()
                .in(this)[all ? 'selectAll' : 'select'](selector)
                .boundingClientRect(rect => {
                if (all && Array.isArray(rect) && rect.length) {
                    resolve(rect);
                }
                if (!all && rect) {
                    resolve(rect);
                }
            })
                .exec();
        });
    }
  }
})
