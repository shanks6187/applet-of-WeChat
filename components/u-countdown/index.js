// components/u-countdown.js
Component({
	externalClasses: ['my-class'],
	options: {
		addGlobalClass: true,
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	/**
	* 组件的属性列表
	*/
	properties: {
		showDay: {
			type: Boolean,
			value: false
		},
		showSecond: {
			type: Boolean,
			value: false
		},
		showColon: {
			type: Boolean,
			value: false
		},
		title: {
			type: String,
			value: ""
		},
		name: {
			type: String,
			value: ""
		},
		endTime: {
			type: String,
			value: "",
			observer(newVal, oldVal, changedPath) {
                let second = this.data.showSecond ? 1000 : 60000
				this.data.times = newVal;
				this.countDown();
				this.data.timer = setInterval(() => {
					if (!this.data.timeState) {
						this.timeUp()
						return
					}
					this.countDown()
				}, second)
			}
		},

	},

	/**
	* 组件的初始数据
	*/
	data: {
		timer: null,
		times: null,
		timeState: false,
		d: '00',
		h: '00',
		i: '00',
		s: '00'
	},

	/**
	* 组件的方法列表
	*/
	methods: {
		timeFormat(param){//小于10的格式化函数
			return param < 10 ? '0' + param : param;
		},
		timeUp() {
			clearInterval(this.data.timer)
			this.triggerEvent('timeup', this.data.name);
		},
		countDown() {
			let newTime = new Date().getTime();
			let endTime = new Date(this.data.times.replace(/-/g,"/")).getTime();
			let [day, hour, minute, second] = [0, 0, 0, 0]
			// 如果活动未结束，对时间进行处理
			if (endTime - newTime > 0){
				this.data.timeState = true;
				let time = (endTime - newTime) / 1000;
				// 获取天、时、分、秒
				day = this.timeFormat(parseInt(time / (60 * 60 * 24)));
				hour = this.timeFormat(parseInt(time % (60 * 60 * 24) / 3600));
				minute = this.timeFormat(parseInt(time % (60 * 60 * 24) % 3600 / 60));
				second = this.timeFormat(parseInt(time % (60 * 60 * 24) % 3600 % 60));
			}else{//活动已结束，全部设置为'00'
				this.data.timeState = false;
				day = '00';
				hour = '00';
				minute = '00';
				second = '00';
			}
			this.setData({
				d: day,
				h: hour,
				i: minute,
				s: second,
			});
		}
	}

})
