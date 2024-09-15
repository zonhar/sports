<template>
	<view class="zb-tabs__nav zb-tabs__nav--line" :style="{
        '--zb-tabs-height':tabHeight,
        '--zb-tabs-line-width':lineTabWidth,
      }">
		<scroll-view :scroll-x="scrollable" :scroll-left="scrollLeft" :show-scrollbar="false" scroll-with-animation
			class="zb-tabs__wrapper__scroll-view">
			<view class="zb-tabs__nav_inner">
				<view class="zb-tab" :class="[{
		        'zb-tab--shrink':shrink,
            'zb-tab--active':activeIndex===index,
			'zb-no-active':activeIndex!==index,
            'zb-tab--disabled':item.disabled,
          }]" ref="tab"
		   v-for="item,index in data" :key="item.value" @click="changeTab(item,index)">
					<view class="zb-tab__text zb-tab__text--ellipsis" 
					
					:style="[activeIndex===index&&activeStyle]">
						{{ item.name }}
					</view>
				</view>
				<view class="zb-tabs__line" :style="[lineStyle]"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		options: {
			// #ifdef MP-WEIXIN
			// 微信小程序中 options 选项
			multipleSlots: true, //  在组件定义时的选项中启动多slot支持，默认启用
			styleIsolation: "shared", //  启动样式隔离。当使用页面自定义组件，希望父组件影响子组件样式时可能需要配置。具体配置选项参见：微信小程序自定义组件的样式
			addGlobalClass: true, //  表示页面样式将影响到自定义组件，但自定义组件中指定的样式不会影响页面。这个选项等价于设置 styleIsolation: apply-shared
			virtualHost: true, //  将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
			// #endif
		},
		props: {
			// 开启收缩布局
			shrink: {
				type: Boolean,
				default: false
			},
			height: {
				type: [String, Number],
				default: '40px'
			},
			// 底部条宽度，
			lineWidth: {
				type: [String, Number],
				default: '40px'
			},
			lineColor: {
				type: String,
				default: '#ee0a24'
			},
			activeStyle: {
				type: Object,
				default: () => {}
			},
			value: {
				type: [Number, String],
				default: 0,
			},
			modelValue: {
				type: [String, Number],
			},
			data: {
				type: Array,
				default: () => []
			},
			// 菜单是否可滚动
			scrollable: {
				type: Boolean,
				default: true
			}
		},
		
		data() {
			return {
				scrollLeft: 0,
				lineStyle: {},
				inited: true,
				initTime: null,
				activeIndex: this.value,
				valueTime:null,
				dataTime:null,
			}
		},
		computed: {
			tabHeight() {
				if (this.isNumeric(this.height)) {
					return this.height + 'px'
				}
				if (this.height.includes('rpx')) {
					let height = this.height.replace('rpx', '')
					return uni.upx2px(height) + 'px';
				}
				return this.height
			},
			lineTabWidth() {
				if (this.isNumeric(this.lineWidth)) {
					return this.lineWidth + 'px'
				}
				if (this.lineWidth.includes('rpx')) {
					let height = this.lineWidth.replace('rpx', '')
					return uni.upx2px(this.lineWidth) + 'px';
				}
				return this.lineWidth
			}
		},
		unmounted() {
			this.initTime = null
		},
		mounted() {
			this.setLine()
		},
		watch: {
			data:{
				handler(val,oldValue){
					if(val&&val.length){
						this.dataTime = setTimeout(()=>{
							this.$nextTick(() => {
								clearTimeout(this.dataTime)
								let value = this.value
								// #ifdef VUE3
								value = this.modelValue
								// #endif
								if(value!=null){
									this.setCurrentIndexByName(value);
								}
								this.setLine()
								if(!this.valueTime){
									let item = this.data.find(item => item.value === value)
									this.$emit('change', {
										...item
									});
								}
								
							})
						},1000/60)
					}
				},
				immediate:true
			},
			// #ifndef VUE3
			value: {
				handler(val) {
						if(this.data&&this.data.length){
							this.valueTime = setTimeout(()=>{
								this.setCurrentIndexByName(val);
								this.$nextTick(() => {
									this.setLine()
								})
								let item = this.data.find(item => item.value === val)
								this.$emit('change', {
									...item
								});
								clearTimeout(this.valueTime)
							},20)
						}
				},
				immediate: true
			},
			// #endif

			// #ifdef VUE3
			modelValue: {
				handler(val) {	
					if (this.data&&this.data.length) {
						this.valueTime = setTimeout(()=>{
							this.setCurrentIndexByName(val);
							this.$nextTick(() => {
								this.setLine()
							})
							let item = this.data.find(item => item.value === val)
							this.$emit('change', {
								...item
							});
							clearTimeout(this.valueTime)
						},20)
						
					}

				},
				immediate: true
			},
			// #endif
		},
		methods: {
			isNumeric(val) {
				return /^\d+(\.\d+)?$/.test(val);
			},
			addUnit(value) {
				if (value == null) {
					return undefined
				}
				value = String(value);
				return this.isNumeric(value) ? `${value}px` : value;
			},
			setCurrentIndexByName(val) {
				this.activeIndex = this.data.findIndex(item => item.value === val)
			},

			async getWidth() {
				return new Promise((resolve) => {
					let view = uni.createSelectorQuery().in(this).selectAll(".zb-tab");
					view.boundingClientRect(data => {
						resolve(data)
					}).exec();
				})
			},

			async getWrapWidth() {
				return new Promise(resolve => {
					let view = uni.createSelectorQuery().in(this).select(".zb-tabs__nav");
					view.boundingClientRect(data => {
						resolve(data)
					}).exec();
				})
			},

			/**
			 * @ 滑动
			 * @param lineOffsetLeft 当前tab 距离左边的距离
			 * @param itemTab 当前tab滑块的位置
			 * @returns {Promise<void>}
			 */
			async scrollLeftTo(lineOffsetLeft, itemTab) {
				let tabNav = await this.getWrapWidth()
				this.scrollLeft = lineOffsetLeft - (tabNav.width - itemTab.width) / 2

			},

			async setLine() {
				let tabs = await this.getWidth()
				let itemTab = tabs[this.activeIndex]
				if (!itemTab) return

				// 获取滑块该移动的位置
				let currentBeforeArr = tabs
					.slice(0, this.activeIndex)

				let lineOffsetLeft = currentBeforeArr
					.reduce((total, curr) => {
						return total + curr.width
					}, 0);
				const left = lineOffsetLeft + itemTab.width / 2;
				this.scrollLeftTo(lineOffsetLeft, itemTab)
				const lineStyle = {
					width: this.addUnit(this.lineWidth),
					transform: `translateX(${left}px) translateX(-50%)`,
					background: this.lineColor
				};

				if (this.inited) {
					lineStyle.transitionDuration = '0s'
					if (this.inited) {
						this.initTime = setTimeout(() => {
							this.inited = false
						}, 10);
					}
				}

				this.lineStyle = lineStyle;
			},

			changeTab(item, index) {
				if (item.disabled) return
				this.activeIndex = index
				this.setLine()
				this.$emit('update:modelValue', item.value);
				this.$emit('input', item.value);
				this.$emit('click-tab', item)

			}
		}
	}
</script>

<style lang="scss" scoped>
	$zb-tabs-bottom-bar-color: var(--zb-tabs-bottom-bar-color);
	$zb-tabs-height: var(--zb-tabs-height);
	$zb-tabs-line-width: var(--zb-tabs-line-width);

	.zb-tabs__nav--line {
		box-sizing: content-box;
		height: 100%;
	}

	.zb-tabs__nav_inner {
		width: 100%;
		height: 100%;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		background-color: #fff;
		-webkit-user-select: none;
		user-select: none;
	}

	.zb-tabs__wrapper__scroll-view {
		height: 100%;
		width: 100%;
	}

	.zb-tabs__nav {
		width: 100%;
		height: $zb-tabs-height;

		::v-deep {
			::-webkit-scrollbar {
				display: none;
				width: 0 !important;
				height: 0 !important;
				-webkit-appearance: none;
				background: transparent;
			}
		}
	}

	.zb-tab {
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		justify-content: center;
		box-sizing: border-box;
		padding: 0 4px;
		color: #646566;
		font-size: 14px;
		line-height: 20px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */

	}

	.zb-tab__text--ellipsis {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.zb-tab--active {
		color: #323233;
		font-weight: bold;

	}

	.zb-tabs__line {
		position: absolute;
		bottom: 2px;
		left: 0;
		z-index: 1;
		width: $zb-tabs-line-width;
		height: 3px;
		background-color: $zb-tabs-bottom-bar-color;
		border-radius: 3px;
		transition-duration: 0.3s;
	}

	.zb-tab--disabled {
		cursor: not-allowed;

		.zb-tab__text {
			color: #c8c9cc;
		}
	}

	.zb-tab--shrink {
		flex: none;
		padding: 0 8px;
	}
</style>