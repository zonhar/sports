<template>
	<view class="page-content">
		<view class="nav-bar">
			<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#cc0002'}"></view>
			<uni-nav-bar left-icon="left" background-color="#cc0002" color="#ffffff" height="40px"
				@clickLeft="clickLeft" @clickRight="clickRight">
				<view class="button-center">
					大乐透
				</view>
				<template v-slot:right>
					<zb-popover style="position: absolute;" placement="bottom-end" :options="actions" ref="ZbPopover"
						theme="dark" @select="select" class="item-popover">
						<view style="position:relative;padding-right:5px;">
							<uni-badge :is-dot="true" absolute="rightTop" size="small" :text="filters?1:0">
								<uni-icons type="list" size="22" color="#fff"></uni-icons>
							</uni-badge>
						</view>
					</zb-popover>
				</template>
			</uni-nav-bar>
		</view>
		<uni-drawer :width="280" ref="showRight" mode="right" :mask-click="false">
			<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#fff'}"></view>
			<view style="padding:58px 10px 10px 10px;">
				<scroll-view :style="{height:scrollHeight+'px'}" scroll-y="true">
					<view class="tit"><text>胜平负低赔率区间</text></view>
					<uni-data-checkbox multiple v-model="checkbox1" :localdata="hobby"></uni-data-checkbox>

					<view class="tit" style="margin-top:15px;"><text>赛事</text></view>
					<uni-data-checkbox multiple v-model="checkbox2" :localdata="hobbys"></uni-data-checkbox>
				</scroll-view>
				<view class="footerBtns">
					<button @click="cancel" type="default">取消</button>
					<button style="margin-left:10px;" @click="confirm" type="primary">确定</button>
				</view>
			</view>
		</uni-drawer>
		<scroll-view scroll-y="true" :style="{paddingTop:(iStatusBarHeight+40)+'px',paddingBottom:'90px'}">

			<view><uni-notice-bar v-if="lottery.desc" style="margin-bottom:0;" show-icon :text="lottery.desc" /></view>
			<view class="prize-tit">
				<text>第{{info.lottery_no}}期<text class="red">{{formats(dayjs(info.itou_end_time).unix())}}
						{{dayjs(info.itou_end_time).format('HH:mm')}}</text>截止
					奖池{{formatNumber(info.prize_info?.pool_prize)}}</text>
			</view>
			<view class="opt">
				<text>勾选号码下方框设胆</text>
				<view class="opt-btn">
					<!-- <view style="margin-right: 10px;">
						<uni-icons style="margin-right:3px;" type="refresh" size="16" color="#666"></uni-icons>
						<text>机选</text>
					</view>	 -->
					<view class="opt-btn-r">
						<uni-data-checkbox multiple v-model="checkboxAll" :localdata="chxAll"></uni-data-checkbox>
					</view>
				</view>
			</view>

			<view class="redBall">
				<view class="redBall-item" v-for="(item,index) in redBalls" :key="index">
					<view :class="{'active':selectedRedIndex.includes(index),'checked':item.chx[0]===index}"
						class="circle" @click="onItemClick(index,'selectedRedIndex','redBalls')">
						<text>{{item.value}}</text>
						<text v-if="item.chx[0]===index">胆</text>
					</view>
					<view class="redBall-item-desc">
						<text v-if="checkboxAll[0]==='all'">{{item.localdata[0]?.gap}}</text>
						<uni-data-checkbox @change="change" multiple v-model="item.chx"
							:localdata="item.localdata"></uni-data-checkbox>
					</view>
				</view>
			</view>
			<view class="redBall" style="border-top:1px solid #f5f5f5;padding-top:15px;">
				<view class="redBall-item" v-for="(item,index) in blueBalls" :key="index">
					<view :class="{'active':selectedBlueIndex.includes(index),'checked':item.chx[0]===index}"
						class="circle circle-blue" @click="onItemClick(index,'selectedBlueIndex','blueBalls')">
						<text>{{item.value}}</text>
						<text v-if="item.chx[0]===index">胆</text>
					</view>
					<view class="redBall-item-desc">
						<text v-if="checkboxAll[0]==='all'">{{item.localdata[0]?.gap}}</text>
						<uni-data-checkbox @change="changeBlue" multiple v-model="item.chx"
							:localdata="item.localdata"></uni-data-checkbox>
					</view>
				</view>
			</view>

		</scroll-view>
		<view class="opt-wrap">
			<view style="padding:10px;background-color: #fff;text-align:center">
				<view v-if="!isSelectedOk" class="btns-item btns-prize">至少选5红球2蓝球</view>
				<view v-if="isSelectedOk" class="btns-item btns-prize">
					<view style="font-size:14px;">{{selectedRedIndex.length}}红球{{selectedBlueIndex.length}}篮球 金额<text
							class="red">{{amountValue}}</text>元</view>
				</view>
			</view>
			<view class="btns">
				<view class="btns-item" @click="reset"><uni-icons type="trash" color='#666' size="20"></uni-icons>
				</view>
				<view class="scale-block">
					<uni-number-box :min="1" :max="50000" :width="60" :value="scaleValue" @change="changeNumBox" />
					<text>倍</text>
				</view>
				<view style="flex:1"></view>
				<view @click="next" class="btns-item btns-next">下一步</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../common/request.js';
	import dayjs from 'dayjs';
	import {
		formatNumber,
		formats,
		factorials
	} from '../../common/util.js'
	import config from '@/common/config.js'
	export default {
		data() {
			return {
				gap: {},
				formatNumber,
				formats,
				blueBalls: [{
						text: 1,
						value: 1,
						chx: []
					},
					{
						text: 2,
						value: 2,
						chx: []
					},
					{
						text: 3,
						value: 3,
						chx: []
					},
					{
						text: 4,
						value: 4,
						chx: []
					},
					{
						text: 5,
						value: 5,
						chx: []
					},
					{
						text: 6,
						value: 6,
						chx: []
					},
					{
						text: 7,
						value: 7,
						chx: []
					},
					{
						text: 8,
						value: 8,
						chx: []
					},
					{
						text: 9,
						value: 9,
						chx: []
					},
					{
						text: 10,
						value: 10,
						chx: []
					},
					{
						text: 11,
						value: 11,
						chx: []
					},
					{
						text: 12,
						value: 12,
						chx: []
					},
				],
				redBalls: [{
						text: 1,
						value: 1,
						chx: []
					},
					{
						text: 2,
						value: 2,
						chx: []
					},
					{
						text: 3,
						value: 3,
						chx: []
					},
					{
						text: 4,
						value: 4,
						chx: []
					},
					{
						text: 5,
						value: 5,
						chx: []
					},
					{
						text: 6,
						value: 6,
						chx: []
					},
					{
						text: 7,
						value: 7,
						chx: []
					},
					{
						text: 8,
						value: 8,
						chx: []
					},
					{
						text: 9,
						value: 9,
						chx: []
					},
					{
						text: 10,
						value: 10,
						chx: []
					},
					{
						text: 11,
						value: 11,
						chx: []
					},
					{
						text: 12,
						value: 12,
						chx: []
					},
					{
						text: 13,
						value: 13,
						chx: []
					},
					{
						text: 14,
						value: 14,
						chx: []
					},
					{
						text: 15,
						value: 15,
						chx: []
					},
					{
						text: 16,
						value: 16,
						chx: []
					},
					{
						text: 17,
						value: 17,
						chx: []
					},
					{
						text: 18,
						value: 18,
						chx: []
					},
					{
						text: 19,
						value: 19,
						chx: []
					},
					{
						text: 20,
						value: 20,
						chx: []
					},
					{
						text: 21,
						value: 21,
						chx: []
					},
					{
						text: 22,
						value: 22,
						chx: []
					},
					{
						text: 23,
						value: 23,
						chx: []
					},
					{
						text: 24,
						value: 24,
						chx: []
					},
					{
						text: 25,
						value: 25,
						chx: []
					},
					{
						text: 26,
						value: 26,
						chx: []
					},
					{
						text: 27,
						value: 27,
						chx: []
					},
					{
						text: 28,
						value: 28,
						chx: []
					},
					{
						text: 29,
						value: 29,
						chx: []
					},
					{
						text: 30,
						value: 30,
						chx: []
					},
					{
						text: 31,
						value: 31,
						chx: []
					},
					{
						text: 32,
						value: 32,
						chx: []
					},
					{
						text: 33,
						value: 33,
						chx: []
					},
					{
						text: 34,
						value: 34,
						chx: []
					},
					{
						text: 35,
						value: 35,
						chx: []
					},
				],
				chxAll: [{
					text: '显示遗漏',
					value: 'all'
				}],
				checkboxAll: [],
				checkbox1: [],
				checkbox2: [],
				hobby: [{
					text: '1.50以下',
					value: '0,1.5'
				}, {
					text: '1.50-2.00',
					value: '1.5,2'
				}, {
					text: '2.00以上',
					value: '2,0'
				}],
				lottery: {},
				dayjs,
				fixH: 60,
				scaleValue: 1,
				iStatusBarHeight: 0,
				info: {},
				selectList: [],
				filters: '',
				selectedRedIndex: [],
				selectedBlueIndex: [],
				actions: [
				        { text: '历史开奖' },
				        { text: '选号记录' },
						{ text: '玩法说明' },
				    ]
			}
		},
		computed: {
			scrollHeight() {
				const tHeight = (this.iStatusBarHeight + 460) + 'px'
				const data = window.innerHeight - tHeight
				return data
			},
			isSelectedOk() {
				const checkedRedNum = this.redBalls.filter(o => o.chx[0] >= 0).length
				const checkedBlueNum = this.blueBalls.filter(o => o.chx[0] >= 0).length
				return this.selectedRedIndex.length + checkedRedNum >= 5 && this.selectedBlueIndex.length +
					checkedBlueNum >= 2
			},
			amountValue() {
				const checkedRedNum = this.redBalls.filter(o => o.chx[0] >= 0).length
				const checkedBlueNum = this.blueBalls.filter(o => o.chx[0] >= 0).length
				if (this.selectedRedIndex.length + checkedRedNum < 5 || this.selectedBlueIndex.length + checkedBlueNum <
					2) {
					return 0
				}
				const redVal = factorials(this.selectedRedIndex.length, 5 - checkedRedNum)
				const blueVal = factorials(this.selectedBlueIndex.length, 2 - checkedBlueNum)
				return this.scaleValue * 2 * redVal * blueVal
			},
		},
		methods: {
			select(item){
				if("玩法说明" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/dlt/description/description'
					})
				}else if("选号记录" === item.text){
					uni.switchTab({
					    url: '/pages/tabBar/record/record',
					    success: function (e) {
					        // 成功跳转后的回调
					    },
					    fail: function (e) {
					        // 失败的回调
					    }
					});
				}else if("历史开奖" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/dlt/lotteryResult/lotteryResult'
					})
				}
			},
			next() {
				if (!this.isSelectedOk) {
					uni.showToast({
						title: '请至少选择5个红球和2个蓝球',
						icon: 'none'
					})
					return
				}

				const selectRedData = this.redBalls.filter((o, index) => this.selectedRedIndex.includes(index))
				const selectBlueData = this.blueBalls.filter((o, index) => this.selectedBlueIndex.includes(index))
				let redFixed = []
				let blueFixed = []
				this.redBalls.map(o => {
					if (o.chx[0] >= 0) {
						redFixed.push(o.chx[0] + 1)
					}
				})
				this.blueBalls.map(o => {
					if (o.chx[0] >= 0) {
						blueFixed.push(o.chx[0] + 1)
					}
				})
				let lotteryOrderOdds = {
					permutationNum: JSON.stringify({
						red: Array.from(new Set(selectRedData.map(item => item.value).concat(redFixed))).sort(
							function(a, b) {
								return a - b
							}),
						redFixed: redFixed.sort(function(a, b) {
							return a - b
						}),
						blue: Array.from(new Set(selectBlueData.map(item => item.value).concat(blueFixed)))
							.sort(function(a, b) {
								return a - b
							}),
						blueFixed: blueFixed.sort(function(a, b) {
							return a - b
						})
					})
				}
				uni.setStorageSync('lotteryType', 7)
				uni.setStorageSync('amountValue', this.amountValue)
				uni.setStorageSync('endDate', this.info.end_time)
				uni.setStorageSync('lotteryOrderOdds', [lotteryOrderOdds])
				

				uni.navigateTo({
					url: '/pages/choose/fiveNext'
				})
			},
			onItemClick(index, selectedIndexs, type) {
				if (this[type][index].chx[0] === index) {
					this[selectedIndexs] = this[selectedIndexs].filter(o => o !== index)
					this[type][index].chx = []
					return
				}
				if (this[selectedIndexs].includes(index)) {
					this[selectedIndexs] = this[selectedIndexs].filter(o => o !== index)
				} else {
					this[selectedIndexs].push(index)
				}
			},
			reset() {
				uni.showModal({
					title: '提示',
					content: '是否清空已投注选项？',
					confirmText: '确定',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							this.selectedBlueIndex = []
							this.selectedRedIndex = []
							this.init()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			change(val) {
				const checkedNum = this.redBalls.filter(o => o.chx[0] >= 0).length
				if (checkedNum > 4) {
					uni.showToast({
						title: "红球最多设置4个胆",
						icon: 'none'
					})
					this.redBalls[val.detail.value[0]].chx = []

				}

				this.selectedRedIndex = this.selectedRedIndex.filter(o => o !== val.detail.value[0])
			},
			changeBlue(val) {
				const checkedNum = this.blueBalls.filter(o => o.chx[0] >= 0).length
				if (checkedNum > 1) {
					uni.showToast({
						title: "蓝球最多设置1个胆",
						icon: 'none'
					})
					this.blueBalls[val.detail.value[0]].chx = []
				}
				this.selectedBlueIndex = this.selectedBlueIndex.filter(o => o !== val.detail.value[0])
			},
			changeNumBox(value) {
				this.scaleValue = value
			},
			clickLeft() {
				uni.navigateBack()
			},
			clickRight() {
				//this.$refs.showRight.open();
			},


			async findList() {
				let url =
					`platform=koudai_mobile&_prt=https&ver=20180101000000&lottery_type=SuperLotto&station_user_id=54275526&station_uuid=b9cfdcrpfsj3fd1661155817&t=254689&_=1713826090148`
				const data = await request({
					url: '/api/shuzi/infocurrent?' + url,
					method: 'POST',
					data: {},
					showLoading: true,
				})
				this.info = data
			},
			async getAd() {
				const data = await request({
					url: '/api/paijiang/last',
					data: {
						platform: 'koudai_mobile',
						_prt: 'https',
						ver: 20180101000000,
						lottery_type: 'SuperLotto',
					}
				})
				this.lottery = data
			},
			async getGap() {
				const data = await request({
					url: '/api/shuzi/chart',
					data: {
						platform: 'koudai_mobile',
						_prt: 'https',
						ver: 20180101000000,
						lottery_type: 'SuperLotto',
						t: 697619,
						_: 1713826090146
					}
				})
				this.gap = data
				this.redBalls.map((item, index) => {
					item.localdata = [{
						text: '',
						gap: this.gap.P[1][index + 1].gap,
						value: index
					}]
					return item
				})
				this.blueBalls.map((item, index) => {
					item.localdata = [{
						text: '',
						gap: this.gap.P[2][index + 1].gap,
						value: index
					}]
					return item
				})
			},
			init() {
				this.findList()
				this.getAd()
				this.getGap()
			},
			clearSelect() {
				this.selectedRedIndex = []
				this.selectedBlueIndex = []
				this.redBalls = this.redBalls.map(o => {
					o.chx = []
					return o
				})
				this.blueBalls = this.blueBalls.map(o => {
					o.chx = []
					return o
				})
			}

		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.init()
		},
		onShow() {
			this.clearSelect()
		}
	}
</script>

<style scoped lang="scss">
	.page-content {
		height: 100%;
	}

	.nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		height: 48px;
		background-color: #cc0002;
	}

	.content {
		padding: 0 10px;
	}

	// .active{
	// 	background-color: #cc0002!important;
	// 	text{
	// 		color:#fff;
	// 	}
	// }

	.opt-wrap {
		background-color: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid #ddd;

		.select-tip {
			display: flex;
			padding: 10px;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			color: #999;

			.title {
				font-size: 13px;
				color: red;
			}
		}

		.select-info {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 5px 10px;

			.flag-box {
				padding: 3px 10px;
				border: 1px solid #ddd;
				border-radius: 3px;
			}

			.text {
				font-size: 12px;
			}

			.select-amount {
				flex: 1;
				text-align: center;
				display: flex;
				flex-direction: column;
				text-align: right;

				.amount-tit {
					font-size: 15px;

					text {
						color: red;
						font-weight: bold;
						font-size: 17px;
						margin: 0 3px;
					}
				}

				.amount-desc {
					font-size: 14px;

					text {
						text-decoration: underline;
						color: red;
					}
				}
			}
		}

		.btns {
			display: flex;
			flex-direction: row;
			// align-items:center;
			border-top: 1px solid #ddd;

			.btns-item {
				padding: 10px;
				text-align: center;
				font-size: 15px;
				color: #333;
				background-color: #f2f2f2;
				border-left: 1px solid #ddd;
			}

			.btns-prize {
				flex: 1;
				color: #666;
				background-color: #fff;
			}

			.btns-next {
				background-color: #cc0002;
				color: #fff;
				width: 110px;
				font-size: 15px;
			}
		}
	}

	.uni-collapse .content {
		background-color: #f2f2f2;
		padding: 10px 10px 0 10px;
	}

	::v-deep .uni-collapse-item__title-box {
		height: 40px;
		line-height: 40px;
	}

	.tit {
		margin-bottom: 10px;
	}

	.footerBtns {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 30px;

		button {
			flex: 1;
		}
	}

	.noData {
		font-size: 14px;
		color: #999;
		padding-top: 50px;
		text-align: center;
	}

	.red {
		color: red;
	}

	.opt {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 8px 10px;

		text {
			flex: 1;
			text-align: left;
		}

		.opt-btn {
			display: flex;
			flex-direction: row;
			align-items: center;
			text-align: right;
			justify-content: flex-end;
		}
	}

	.button-center {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-size: 17px;
	}

	.redBall {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		background-color: #fff;
		padding: 10px 5px 5px 0;

		.redBall-item {
			width: 14.2857%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			margin-bottom: 15px;

			.circle {
				width: 24px;
				height: 24px;
				// line-height:24px;
				padding: 5px;
				text-align: center;
				border-radius: 50%;
				display: flex;
				flex-direction: row;
				align-items: center;
				background-color: #fff;
				border: 1px solid #ddd;
				justify-content: center;
				color: #cc0002;
			}

			.circle-blue {
				color: #007bed;
			}

			.circle.active {
				background-color: #cc0002;
				color: #fff;
			}

			.circle.checked {
				background-color: #ff7162;
				color: #fff;
			}

			.circle-blue.active {
				background-color: #007bed;
				color: #fff;
			}

			.circle-blue.checked {
				background-color: #00C1FF;
				color: #fff;
			}
		}
	}

	::v-deep .checklist-box {
		margin: 0 !important;
		padding: 0 !important;
	}

	.redBall-item-desc {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 5px 0 0 3px;

		text {
			font-size: 10px;
			color: #666;
			margin-right: 3px;
		}
	}

	.prize-tit {
		padding: 10px 0;
		background-color: #fff;
		text-align: center;
	}

	.scale-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 15px;

		text {
			margin-left: 5px;
		}
	}
</style>