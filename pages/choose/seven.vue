<template>
	<view class="page-content">
		<view class="nav-bar">
			<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#cc0002'}"></view>
			<uni-nav-bar left-icon="left" background-color="#cc0002" color="#ffffff" height="40px"
				@clickLeft="clickLeft" @clickRight="clickRight">
				<view class="button-center">
					七星彩
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

			<!-- <view><uni-notice-bar style="margin-bottom:0;" show-icon :text="lottery.desc" /></view> -->
			<view class="prize-tit">
				<text>第{{info.lottery_no}}期<text class="red">{{formats(dayjs(info.itou_end_time).unix())}}
						{{dayjs(info.itou_end_time).format('HH:mm')}}</text>截止
					奖池{{formatNumber(info.prize_info?.pool_prize)}}</text>
			</view>
			<view class="opt">
				<text>按位命中6+1最高奖金<text class="red">500</text>万</text>
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

			<view class="titbar"><text>前区</text></view>
			<view class="redBall" v-for="(item,index) in redBalls">
				<view>
					<text>{{item.label}}</text>
				</view>

				<view class="seven-container">
					<view class="redBall-item" v-for="(subItem,subIndex) in item.data" :key="subIndex">
						<view :class="{'active':selectedRedIndex[index]?.includes(subIndex)}" class="circle"
							@click="onItemClick(subIndex,index,'selectedRedIndex')">{{subItem.value}}</view>
						<view class="redBall-item-desc">
							<text v-if="checkboxAll[0]==='all'">{{gap[`P_${index+1}`][subIndex].gap}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="titbar" style="border-top:1px solid #f5f5f5;padding-top:15px;"><text>后区</text></view>
			<view class="redBall" v-for="(item,index) in blueBalls">
				<view>
					<text>{{item.label}}</text>
				</view>
				<view class="seven-container">
					<view class="redBall-item" v-for="(subItem,subIndex) in item.data" :key="subIndex">
						<view :class="{'active':selectedBlueIndex[index]?.includes(subIndex)}"
							class="circle circle-blue" @click="onItemClick(subIndex,index,'selectedBlueIndex')">
							{{subItem.value}}</view>
						<view class="redBall-item-desc">
							<text v-if="checkboxAll[0]==='all'">{{gap.P_7[subIndex].gap}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="opt-wrap">
			<view style="padding:10px;background-color: #fff;text-align:center">
				<view v-if="!isSelectedOk" class="btns-item btns-prize">每位至少选择1个号码</view>
				<view v-if="isSelectedOk" class="btns-item btns-prize">
					<view style="font-size:14px;">共<text class="red">{{amountValue}}</text>元</view>
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
					label: '第七位',
					data: [{
							text: '0',
							value: '0',
							chx: []
						},
						{
							text: '1',
							value: '1',
							chx: []
						},
						{
							text: '2',
							value: '2',
							chx: []
						},
						{
							text: '3',
							value: '3',
							chx: []
						},
						{
							text: '4',
							value: '4',
							chx: []
						},
						{
							text: '5',
							value: '5',
							chx: []
						},
						{
							text: '6',
							value: '6',
							chx: []
						},
						{
							text: '7',
							value: '7',
							chx: []
						},
						{
							text: '8',
							value: '8',
							chx: []
						},
						{
							text: '9',
							value: '9',
							chx: []
						},
						{
							text: '10',
							value: '10',
							chx: []
						},
						{
							text: '11',
							value: '11',
							chx: []
						},
						{
							text: '12',
							value: '12',
							chx: []
						},
						{
							text: '13',
							value: '13',
							chx: []
						},
						{
							text: '14',
							value: '14',
							chx: []
						},
					],
				}],
				redBalls: [{
						label: '第一位',
						data: [{
								text: '0',
								value: '0',
								chx: []
							},
							{
								text: '1',
								value: '1',
								chx: []
							},
							{
								text: '2',
								value: '2',
								chx: []
							},
							{
								text: '3',
								value: '3',
								chx: []
							},
							{
								text: '4',
								value: '4',
								chx: []
							},
							{
								text: '5',
								value: '5',
								chx: []
							},
							{
								text: '6',
								value: '6',
								chx: []
							},
							{
								text: '7',
								value: '7',
								chx: []
							},
							{
								text: '8',
								value: '8',
								chx: []
							},
							{
								text: '9',
								value: '9',
								chx: []
							},
						],
					},
					{
						label: '第二位',
						data: [{
								text: '0',
								value: '0',
								chx: []
							},
							{
								text: '1',
								value: '1',
								chx: []
							},
							{
								text: '2',
								value: '2',
								chx: []
							},
							{
								text: '3',
								value: '3',
								chx: []
							},
							{
								text: '4',
								value: '4',
								chx: []
							},
							{
								text: '5',
								value: '5',
								chx: []
							},
							{
								text: '6',
								value: '6',
								chx: []
							},
							{
								text: '7',
								value: '7',
								chx: []
							},
							{
								text: '8',
								value: '8',
								chx: []
							},
							{
								text: '9',
								value: '9',
								chx: []
							},
						],
					},
					{
						label: '第三位',
						data: [{
								text: '0',
								value: '0',
								chx: []
							},
							{
								text: '1',
								value: '1',
								chx: []
							},
							{
								text: '2',
								value: '2',
								chx: []
							},
							{
								text: '3',
								value: '3',
								chx: []
							},
							{
								text: '4',
								value: '4',
								chx: []
							},
							{
								text: '5',
								value: '5',
								chx: []
							},
							{
								text: '6',
								value: '6',
								chx: []
							},
							{
								text: '7',
								value: '7',
								chx: []
							},
							{
								text: '8',
								value: '8',
								chx: []
							},
							{
								text: '9',
								value: '9',
								chx: []
							},
						],
					},
					{
						label: '第四位',
						data: [{
								text: '0',
								value: '0',
								chx: []
							},
							{
								text: '1',
								value: '1',
								chx: []
							},
							{
								text: '2',
								value: '2',
								chx: []
							},
							{
								text: '3',
								value: '3',
								chx: []
							},
							{
								text: '4',
								value: '4',
								chx: []
							},
							{
								text: '5',
								value: '5',
								chx: []
							},
							{
								text: '6',
								value: '6',
								chx: []
							},
							{
								text: '7',
								value: '7',
								chx: []
							},
							{
								text: '8',
								value: '8',
								chx: []
							},
							{
								text: '9',
								value: '9',
								chx: []
							},
						],
					},
					{
						label: '第五位',
						data: [{
								text: '0',
								value: '0',
								chx: []
							},
							{
								text: '1',
								value: '1',
								chx: []
							},
							{
								text: '2',
								value: '2',
								chx: []
							},
							{
								text: '3',
								value: '3',
								chx: []
							},
							{
								text: '4',
								value: '4',
								chx: []
							},
							{
								text: '5',
								value: '5',
								chx: []
							},
							{
								text: '6',
								value: '6',
								chx: []
							},
							{
								text: '7',
								value: '7',
								chx: []
							},
							{
								text: '8',
								value: '8',
								chx: []
							},
							{
								text: '9',
								value: '9',
								chx: []
							},
						],
					},
					{
						label: '第六位',
						data: [{
								text: '0',
								value: '0',
								chx: []
							},
							{
								text: '1',
								value: '1',
								chx: []
							},
							{
								text: '2',
								value: '2',
								chx: []
							},
							{
								text: '3',
								value: '3',
								chx: []
							},
							{
								text: '4',
								value: '4',
								chx: []
							},
							{
								text: '5',
								value: '5',
								chx: []
							},
							{
								text: '6',
								value: '6',
								chx: []
							},
							{
								text: '7',
								value: '7',
								chx: []
							},
							{
								text: '8',
								value: '8',
								chx: []
							},
							{
								text: '9',
								value: '9',
								chx: []
							},
						],
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
				selectedRedIndex: {},
				selectedBlueIndex: {},
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
				return Object.values(this.selectedRedIndex).length === 6 && Object.values(this.selectedBlueIndex)
					.length === 1
			},
			amountValue() {
				if (Object.values(this.selectedRedIndex).length === 6 && Object.values(this.selectedBlueIndex).length ===
					1) {
					const selectedRedData = Object.values(this.selectedRedIndex)
					const selectedBlueData = Object.values(this.selectedBlueIndex)
					let resultRed = 1
					let resultBlue = 1
					selectedRedData.map(item => {
						if (item.length > 1) {
							resultRed = resultRed * (item.length)
						}
					})
					selectedBlueData.map(item => {
						if (item.length > 1) {
							resultBlue = resultBlue * (item.length)
						}
					})
					return resultRed * resultBlue * 2 * this.scaleValue
				}
				return 0
			},
		},
		methods: {
			select(item){
				if("玩法说明" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/seven/description/description'
					})
				}else if("即时比分" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/seven/score/score'
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
						url: '/pages/choose/component/seven/lotteryResult/lotteryResult'
					})
				}
			},
			next() {
				if (Object.values(this.selectedRedIndex).length < 6 || Object.values(this.selectedBlueIndex).length < 1) {
					uni.showToast({
						title: '每位至少选择1个号码',
						icon: 'none'
					})
					return
				}

				let lotteryOrderOdds = {
					permutationNum: {
						one: [],
						two: [],
						three: [],
						four: [],
						five: [],
						six: [],
						seven: []
					}
				}
				const keys = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
				Object.values(this.redBalls).map((item, index) => {
					let arr = []
					item.data.map((subItem, subIndex) => {
						if (index <= 5 && this.selectedRedIndex[index]?.includes(subIndex)) {
							arr.push(subItem.value)
						}
						lotteryOrderOdds.permutationNum[keys[index]] = arr
					})
				})
				Object.values(this.blueBalls).map((item, index) => {
					let arr = []
					item.data.map((subItem, subIndex) => {
						if (this.selectedBlueIndex[index]?.includes(subIndex)) {
							arr.push(subItem.value)
						}
					})
					lotteryOrderOdds.permutationNum[keys[6]] = arr
				})
				lotteryOrderOdds.permutationNum = JSON.stringify(lotteryOrderOdds.permutationNum)

				uni.setStorageSync('lotteryType', 8)
				uni.setStorageSync('amountValue', this.amountValue)
				uni.setStorageSync('endDate', this.info.end_time)
				uni.setStorageSync('lotteryOrderOdds', [lotteryOrderOdds])

				uni.navigateTo({
					url: '/pages/choose/fiveNext'
				})
			},
			// async submitOrder() {
			// 	if (Object.values(this.selectedRedIndex).length < 6 || Object.values(this.selectedBlueIndex).length <
			// 		1) {
			// 		uni.showToast({
			// 			title: '每位至少选择1个号码',
			// 			icon: 'none'
			// 		})
			// 		return
			// 	}

			// 	let lotteryOrderOdds = {
			// 		permutationNum: {
			// 			one: [],
			// 			two: [],
			// 			three: [],
			// 			four: [],
			// 			five: [],
			// 			six: [],
			// 			seven: []
			// 		}
			// 	}
			// 	const keys = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
			// 	Object.values(this.redBalls).map((item, index) => {
			// 		let arr = []
			// 		item.data.map((subItem, subIndex) => {
			// 			if (index <= 5 && this.selectedRedIndex[index]?.includes(subIndex)) {
			// 				arr.push(subItem.value)

			// 			}
			// 			lotteryOrderOdds.permutationNum[keys[index]] = arr
			// 		})
			// 	})
			// 	Object.values(this.blueBalls).map((item, index) => {
			// 		let arr = []
			// 		item.data.map((subItem, subIndex) => {
			// 			if (this.selectedBlueIndex[index]?.includes(subIndex)) {
			// 				arr.push(subItem.value)
			// 			}
			// 		})
			// 		lotteryOrderOdds.permutationNum[keys[6]] = arr
			// 	})

			// 	lotteryOrderOdds.permutationNum = JSON.stringify(lotteryOrderOdds.permutationNum)
			// 	let options = {
			// 		userId: getApp().globalData.userInfo?.userId,
			// 		userName: getApp().globalData.userInfo?.userName,
			// 		storeId: getApp().globalData.currentShop?.id,
			// 		lotteryAmount: this.amountValue,
			// 		payType: 1,
			// 		lotteryType: 8,
			// 		multiple: this.scaleValue,
			// 		customsClearanceMode: '',
			// 		periods: this.info.lottery_no,
			// 		lotteryOrderOdds: [lotteryOrderOdds],
			// 	}
			// 	try {
			// 		const data = await request({
			// 			url: `${config.baseURL}/mobile/lotteryOrder/submitOrder`,
			// 			method: "post",
			// 			data: options,
			// 			loading: true,
			// 			showSuccessToast: true,
			// 			successMsg: '下单成功'
			// 		})
			// 		this.init()
			// 		this.selectedRedIndex = {}
			// 		this.selectedBlueIndex = {}
			// 	} catch (e) {
			// 		console.log(e)
			// 		//TODO handle the exception
			// 	}
			// },
			onItemClick(subIndex, index, selectedIndexs) {
				this[selectedIndexs][index] = this[selectedIndexs][index] || []
				if (this[selectedIndexs][index].includes(subIndex)) {
					this[selectedIndexs][index] = this[selectedIndexs][index].filter(o => o !== subIndex)
				} else {
					this[selectedIndexs][index].push(subIndex)
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
							this.selectedBlueIndex = {}
							this.selectedRedIndex = {}
							this.init()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
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
					`platform=koudai_mobile&_prt=https&ver=20180101000000&lottery_type=NP7&station_user_id=54275526&station_uuid=b9cfdcrpfsj3fd1661155817&t=254689&_=1713826090148`
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
						lottery_type: 'NP7',
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
						lottery_type: 'NP7',
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
				this.selectedRedIndex = {}
				this.selectedBlueIndex = {}
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
			align-items: center;
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
		font-size: 16px;
	}

	.redBall {
		display: flex;
		flex-direction: row;
		// align-items: center;
		flex-wrap: wrap;
		background-color: #fff;
		border-bottom: 1px solid #f5f5f5;
		padding: 20px 20px 0 30px;

		.redBall-item {
			width: 20%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			margin-bottom: 10px;

			.circle {
				width: 24px;
				height: 24px;
				line-height: 24px;
				padding: 5px;
				text-align: center;
				border-radius: 50%;
				background-color: #fff;
				border: 1px solid #ddd;
				color: #cc0002;
			}

			.circle-blue {
				color: #007bed;
			}

			.circle.active {
				background-color: #cc0002;
				color: #fff;
			}

			.circle-blue.active {
				background-color: #007bed;
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

	.seven-container {
		flex: 1;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.titbar {
		padding: 10px 0 0 120px;
		background-color: #fff;

	}

	.scale-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 10px;

		// margin-left: 15px;
		text {
			margin-left: 5px;
		}
	}
</style>