<template>
	<view class="page-content">
		<view class="nav-bar">
			<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#cc0002'}"></view>
			<uni-nav-bar left-icon="left" background-color="#cc0002" color="#ffffff" height="40px"
				@clickLeft="clickLeft" @clickRight="clickRight">
				<view class="title-center">
					<view>
						<text class="main-tit">足彩14场-<text
								v-if="scheduleList.length>0">{{scheduleList[scheduleIndex]?.lottery_no}}期</text></text>
						<!-- <uni-icons type='down' :size='18' color='#fff'></uni-icons> -->
					</view>
					<view><text style="font-size:12px;">截止时间:{{endTime}}</text></view>
				</view>
				<template v-slot:right>
					<zb-popover style="position: absolute;" placement="bottom-end" :options="actions" ref="ZbPopover"
						theme="dark" @select="select" class="item-popover">
						<uni-icons type="list" size="22" color="#fff"></uni-icons>
					</zb-popover>
				</template>
			</uni-nav-bar>
		</view>

		<uni-drawer ref="showRight" mode="right" :mask-click="false">
			<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#fff'}"></view>
			<view style="padding:58px 10px 10px 10px;">
				<scroll-view :style="{height:scrollHeight+'px'}" scroll-y="true">
					<view v-for="item in 10" :key="item">可滚动内容 {{ item }}</view>
					<button @click="closeDrawer" type="primary">关闭Drawer</button>
				</scroll-view>
			</view>
		</uni-drawer>

		<scroll-view scroll-y="true" :style="{paddingTop:(iStatusBarHeight+60)+'px',paddingBottom:'100px'}">

			<view class="content" v-for="(item,key) in list.match_list" :key="key">
				<view class="content-item">
					<view class="seq"><text>{{key}}</text></view>
					<view class="content-l">
						<uni-tag :style="{margin:'3px 0',backgroundColor:item.league_color[0],border:0}"
							:text="item.league_name" type="primary" size="small" />
						<text style="color:#666">{{dayjs(item.bet_time).format('MM-DD HH:mm')}}</text>
						<!-- <text style="color:#019AFE;font-size:12px;">分析</text> -->
					</view>
					<view class="content-r">
						<view class="table-wrap">
							<table ref="table">
								<tr>
									<td class="td" @click="tdClick(item,'left',key)">
										<view class="td-wrap" :class="{'active':item.leftActive}">
											<text class="label">{{item.host_name_l}}</text>
											<text class="val">{{item.odds[3]??'未受注'}}</text>
										</view>
									</td>
									<td class="td" @click="tdClick(item,'middle',key)">
										<view class="td-wrap" :class="{'active':item.middleActive}">
											<text class="label">平局</text>
											<text class="val">{{item.odds[1]??'未受注'}}</text>
										</view>
									</td>
									<td class="td last" @click="tdClick(item,'right',key)">
										<view class="td-wrap" :class="{'active':item.rightActive}">
											<text class="label">{{item.guest_name_l}}</text>
											<text class="val">{{item.odds[0]??'未受注'}}</text>
										</view>
									</td>
								</tr>
							</table>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="opt-wrap">
			<view class="select-tip" v-if="selectCount<14">
				<text class="title">已选{{selectCount}}场，还需要选{{14-selectCount}}场</text>
				<text @click="goExplain" style="text-decoration: underline;">{{noSelectDescTip}}</text>
			</view>
			<view v-if="selectCount>=14">
				<view class='select-info'>
					<view class="scale-block">
						<uni-number-box :min="1" :max="50000" :width="60" :value="scaleValue" @change="changeNumBox" />
						<text>倍</text>
					</view>

					<view class="select-amount">
						<text class="amount-tit">金额<text>{{amountValue}}</text>元</text>
					</view>
				</view>
				<view class="btns">
					<view class="btns-item btns-prize"></view>
					<view @click="submitOrder(3)" class="btns-item">保存</view>
					<!-- <view class="btns-item">合买</view> -->
					<view @click="submitOrder(0)" class="btns-item btns-next">下一步</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import buttonGroup from '../component/button-group/button-group.vue';
	import request from '../../common/request.js';
	import dayjs from 'dayjs';
	import _ from 'lodash';
	import config from '@/common/config.js'
	import {
		getUserInfo,
		getCurrentShop
	} from '../../common/util';
	export default {
		data() {
			return {
				fixH: 60,
				scaleValue: 1,
				selectedTipFlag: 0,
				noSelectDescTip: '竞猜数据仅供参考，请以实票为准',
				tabIndex: 0,
				iStatusBarHeight: 0,
				list: [],
				selectList: [],
				scheduleList: [],
				scheduleIndex: 0,
				dayjs,
				actions: [
				        { text: '开奖结果' },
				        { text: '选号记录' },
				        { text: '即时比分' },
						{ text: '玩法说明' },
				    ]
			}
		},
		components: {
			buttonGroup
		},
		computed: {
			scrollHeight() {
				const tHeight = (this.iStatusBarHeight + 460) + 'px'
				const data = window.innerHeight - tHeight
				return data
			},
			amountValue() {
				const obj = _.groupBy(this.selectList, (o) => o.key)
				const arr = []
				for (let pro in obj) {
					arr.push(obj[pro])
				}
				let result = [];
				let current = [];
				this.combine(arr, result, current, 0, 14)
				return result.length * 2 * this.scaleValue
			},
			endTime() {
				if (this.scheduleList.length === 0) {
					return ''
				}
				const {
					endTime
				} = this.scheduleList[this.scheduleIndex]
				return dayjs(endTime).format('MM-DD HH:mm')
			},
			selectCount() {
				return _.uniqBy(this.selectList, (o) => o.key).length
			}
		},
		methods: {
			select(item){
				if("玩法说明" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/football14/description/description'
					})
				}else if("即时比分" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/football14/score/score'
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
				}else if("开奖结果" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/football14/lotteryResult/lotteryResult'
					})
				}
			},
			combine(odds, result, current, start, n) {
				if (n === 0) {
					result.push(current.slice()); // 使用 slice() 创建 current 的副本
					return;
				}
				for (let i = start; i < odds.length; i++) {
					for (let j = 0; j < odds[i].length; j++) {
						current.push(odds[i][j]);
						this.combine(odds, result, current, i + 1, n - 1);
						current.pop(); // 移除最后一个元素
					}
				}
			},
			async submitOrder(orderType) {
				let selectListObj = _.groupBy(this.selectList, (o) => o.key)
				let lotteryOrderOdds = []
				for (let key in selectListObj) {
					const item = selectListObj[key]
					let sfpData = {}
					let sfpGameData = []
					item.map(o => {
						sfpData[o.result === '胜' ? 'homeOddsName' : (o.result === '负' ? 'awayOddsName' :
							'drawOddsName')] = o.result
						sfpData[o.result === '胜' ? 'homeOdds' : (o.result === '负' ? 'awayOdds' : 'drawOdds')] =
							o.value
					})
					sfpData.key=key
					sfpGameData.push({
						homeOddsName: '胜',
						homeOdds: this.list.match_list[key].odds[3],
						drawOddsName: '平',
						drawOdds: this.list.match_list[key].odds[1],
						awayOddsName: '负',
						awayOdds: this.list.match_list[key].odds[0]
					})
					sfpGameData.key=key
					lotteryOrderOdds.push({
						matchCode: key,
						matchDate: this.list.match_list[key].bet_time,
						league: this.list.match_list[key].league_name,
						homeTeam: this.list.match_list[key].rank[1].team_name,
						awayTeam: this.list.match_list[key].rank[2].team_name,
						sfpData: JSON.stringify(sfpData),
						sfpGameData: JSON.stringify(sfpGameData),
					})
				}

				let options = {
					userId: getUserInfo()?.userId,
					userName: getUserInfo()?.userName,
					storeId: getCurrentShop()?.id,
					lotteryAmount: this.amountValue,
					payType: 1,
					lotteryType: 3,
					orderType,
					multiple: this.scaleValue,
					customsClearanceMode: '',
					periods: this.scheduleList[this.scheduleIndex]?.lottery_no,
					lotteryOrderOdds,
				}
				if(orderType===3){
					const {topBonusAmount,maskLotteryId} = await request({
						url: `${config.baseURL}/mobile/lotteryOrder/submitOrder`,
						method: 'post',
						data: options,
						loading: true,
						isSendTicket: this.isSendTicket,
						showSuccessToast: true,
						showErrorToast: true,
						successMsg: '提交成功'
					});
					getApp().globalData.detailOptions = { ...options,topBonusAmount,maskLotteryId };
					uni.navigateTo({
						url:'/pages/tabBar/record/component/football14/football14'
					})
				}else{
					getApp().globalData.detailOptions= {...options}
					uni.navigateTo({
						url: '/pages/tabBar/record/component/order/order'
					});
				}
				// getApp().globalData.detailOptions = options
				// uni.navigateTo({
				// 	url: '/pages/tabBar/record/component/football14/football14'
				// })
			},
			clearSelect(value){
				this.findList()
			},
			reset() {
				uni.showModal({
					title: '提示',
					content: '是否清空已投注选项？',
					confirmText: '确定',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							this.selectList = []
							this.findList()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			goExplain() {
				uni.navigateTo({
					url: '/pages/explain/explain'
				})
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
			closeDrawer() {
				this.$refs.showRight.close();
			},
			tdClick(row, pos, key) {
				if (!row) {
					return
				}
				row[`${pos}Active`] = !row[`${pos}Active`]

				this.handleSelectList(row, pos, key)
			},
			handleSelectList(row, pos, key) {
				const obj = {
					left: 3,
					middle: 1,
					right: 0
				}
				const index = obj[pos]
				if (row[`${pos}Active`]) {
					this.selectList.push({
						value: row.odds[index],
						key,
						pos,
						result: pos === 'left' ? '胜' : pos === 'middle' ? '平' : '负',
						row,
					})
				} else {
					this.selectList = this.selectList.filter(o => !(o.pos === pos && o.key === key))
				}
			},
			async findList() {
				const options = {
					platform: 'koudai_mobile',
					_prt: 'https',
					ver: '20180101000000',
					lottery_type: 'ToTo',
					lottery_no: this.scheduleList[this.scheduleIndex].lottery_no,
					station_user_id: '54275526',
					station_uuid: 'b9cfdcrpfsj3fd1661155817'
				}

				const data = await request({
					url: '/api/zucai/selectlist',
					data: options,
					showLoading: true,
				})
				this.list = data
			},
			async getSchedule() {
				const options = {
					platform: 'koudai_mobile',
					_prt: 'https',
					ver: '20180101000000',
					lottery_type: 'ToTo',
					station_user_id: '54275526',
					station_uuid: 'b9cfdcrpfsj3fd1661155817'
				}

				const data = await request({
					url: '/api/zucai/getschedule',
					data: options,
					showLoading: true,
				})
				this.scheduleList = data.list;
				this.findList()
			}
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.getSchedule()
		},
	}
</script>

<style scoped lang="scss">
	.page-content {
		height: 100%;
	}

	.nav-title {
		height: 48px;
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

	.title-center {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.main-tit {
			font-size: 16px;
		}
	}

	.content {
		padding: 0 10px;
		margin-bottom: 18px;

		.content-item {
			display: flex;
			flex-direction: row;
			margin-bottom: 10px;
			align-items: center;
		}

		.content-l {
			width: 60px;
			display: flex;
			flex-direction: column;
			text-align: center;
			margin-right: 10px;

			text {
				font-size: 10px;
			}
		}

		.content-r {
			flex: 1;

			.content-r-top {
				display: flex;
				flex-direction: row;
				justify-content: center;
				text-align: center;
				margin-bottom: 8px;

				.content-r-sub {
					display: flex;
					flex-direction: column;

					text {
						color: #999;
						font-size: 12px;
					}
				}

				.content-r-vs {
					margin: 0 10px;
					color: #333;
					font-size: 14px;
				}
			}

			.table-wrap {
				display: flex;
				flex-direction: row;

				.td-wrap {
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 8px;
					background-color: #fff;
					flex: 1;

					.label {
						color: #000000;
					}

					.val {
						flex: 1;
						color: #666666
					}
				}

				.td-wrap.active {
					background-color: #cc0002;

					text {
						color: #fff;
					}
				}

				.table-left {
					display: flex;
					flex-direction: column;
					margin-right: 6px;

					.dot {
						width: 16px;
						height: 16px;
						line-height: 16px;
						background-color: #ccc;
						color: #fff;
						font-size: 12px;
						text-align: center;
						border-radius: 50%;
						margin-top: 12px;
					}

					.dot.success {
						background-color: #4cd964;
					}

					.dot.danger {
						background-color: #cc0002;
					}
				}

			}

		}
	}

	.active {
		background-color: #cc0002;

		text {
			color: #fff;
		}
	}

	table {
		width: 100%;
		border-spacing: 0;
		border-collapse: collapse;

		tr {
			td {
				border-spacing: 0;
				border-collapse: collapse;
				position: relative;
				// background-color: #fff;
				width: 33.33%
			}
		}
	}

	table,
	th,
	td {
		border: 1px solid #ddd;
		margin: 0;
		padding: 0;
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

			.scale-block {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-left: 15px;

				text {
					margin-left: 5px;
				}
			}
		}

		.btns {
			display: flex;
			flex-direction: row;
			// align-items:center;
			border-top: 1px solid #ddd;

			.btns-item {
				padding: 10px 16px;
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
				width: 100px;
				color: #fff;
				font-size: 16px;
			}
		}
	}

	.seq {
		font-size: 15px;
		color: #999;
		width: 20px;
		text-align: center;
		margin-right: 10px;
	}
</style>