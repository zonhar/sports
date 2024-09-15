<template>
	<view class="page-content">
		<view class="nav-bar">
			<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#cc0002'}"></view>
			<uni-nav-bar left-icon="left" background-color="#cc0002" color="#ffffff" height="40px"
				@clickLeft="clickLeft" @clickRight="clickRight">
				<view class="button-center">
					胜负过关
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
			<view class="noData" v-if="list.length===0">暂无数据</view>
			<uni-collapse>
				<uni-collapse-item v-for="(item,key) in list" :key="key" :title="formatTitle(item,key)" :open="true">
					<view class="content">
						<view class="content-item" v-for="(subItem,subKey) in item" :key="subItem">
							<view class="content-l">
								<text>{{subKey}}</text>
								<uni-tag :style="{margin:'3px 0',backgroundColor:subItem.league_color[0],border:0}"
									:text="subItem.league_name" type="primary" size="small" />
								<text>{{dayjs(subItem.bet_time).format('HH:mm')}}</text>
								<text style="color:#019AFE">分析</text>
							</view>
							<view class="content-r">
								<view class="content-r-top">
									<view class="content-r-sub">
										<text>[{{ subItem.rank && subItem.rank['1'].rank}}]</text>
										<text>{{ subItem.rank && subItem.rank['1'].rank_league}}</text>
									</view>
									<view class="content-r-vs">
										{{subItem.rank && subItem.rank['1'].team_name}} <text>VS</text>
										{{subItem.rank && subItem.rank['2'].team_name}}
									</view>
									<view class="content-r-sub">
										<text>[{{subItem.rank && subItem.rank['2'].rank}}]</text>
										<text>{{subItem.rank && subItem.rank['2'].rank_league}}</text>
									</view>
								</view>
								<view class="table-wrap">

									<table ref="table" border>
										<tr>
											<td class="td" :class="{'active':subItem.list?.WL?.leftActive}"
												@click="tdClick(subItem.list?.WL,'left',key,subKey,'WL')"
												style="width:38%">
												<view class="td-wrap">
													<text class="label">胜</text>
													<text class="val">{{subItem.list?.WL?.odds['3']??'未受注'}}</text>
												</view>
											</td>
											<td class="td"
												style="width:24%;background-color: #f8f8f8;text-align: center;">
												<text
													:class="{'success':subItem.list?.WL?.boundary>0,'danger':subItem.list?.WL?.boundary<0}">
													{{subItem.list?.WL?.boundary>0?'+':''}}{{subItem.list?.WL?.boundary}}球
												</text>
											</td>
											<td class="td" :class="{'active':subItem.list?.WL?.rightActive}"
												@click="tdClick(subItem.list?.WL,'right',key,subKey,'WL')"
												style="width:38%">
												<view class="td-wrap">
													<text class="label">负</text>
													<text class="val">{{subItem.list?.WL?.odds['0']??'未受注'}}</text>
												</view>
											</td>
										</tr>
									</table>
								</view>
							</view>
						</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</scroll-view>
		<view class="opt-wrap">
			<view class="select-tip" v-if="selectCount<3">
				<text class="title">{{noSelectTitleTip}}</text>
				<text @click="goExplain" style="text-decoration: underline;">{{noSelectDescTip}}</text>
			</view>
			<view v-if="selectCount>=3">
				<view class='select-info'>
					<!-- <uni-badge class="uni-badge-left-margin" :text="selectCount" absolute="rightTop" size="small">
						<view class="flag-box"><text class="text">{{selectCount}}</text></view>
					</uni-badge> -->
					<uni-badge class="uni-badge-left-margin" :text="poupSelected.length" absolute="rightTop"
						size="small">
						<view class="flag-box" @click="openDialog" v-if="poupSelected.length<1">选择过关</view>
						<view class="flag-box" @click="openDialog" v-else>{{`${poupSelected.join(',')}`}}</view>
					</uni-badge>
					<view class="scale-block">
						<uni-number-box :min="1" :max="50000" :width="60" :value="scaleValue" @change="changeNumBox" />
						<text>倍</text>
					</view>

					<view class="select-amount">
						<text class="amount-tit">金额<text>{{amountValue}}</text>元</text>
						<text class='amount-desc'>最高奖<text>{{prizeValue}}</text>元</text>
					</view>
				</view>
				<view class="btns">
					<view class="btns-item" @click="reset"><uni-icons type="trash" color='#666' size="20"></uni-icons>
					</view>
					<view class="btns-item btns-prize"></view>
					<view class="btns-item" @click='submitOrder(3)'>保存</view>
					<!-- <view class="btns-item">合买</view> -->
					<view @click='submitOrder(0)' class="btns-item btns-next">下一步</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
			<view class="poup-container">
				<view class="poup-tit">过关方式 <uni-icons @click="closeDialog" class="closeIcon" type='close' color="#666"
						size="24"></uni-icons></view>
				<scroll-view class="poup-wrap" scroll-y="true">
					<view class="poup-item-wrap">
						<view class="poup-block" v-for="item in selectedTipFlagFilter" :key="item">
							<view :class="{'active':poupSelected.includes(`${item}串1`)}" @click="onPoupItemClick(item)"
								class="poup-item">{{item}}串1</view>
						</view>
					</view>
					<view class="more-poup">更多过关</view>

				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import request from '../../common/request.js';
	import dayjs from 'dayjs';
	import _ from 'lodash'
	import config from '@/common/config.js'
	import {
		calculateTotalCombinations,
		getUserInfo,
		getCurrentShop
	} from '@/common/util.js'
	export default {
		data() {
			return {
				scheduleIndex: 0,
				poupSelected: [],
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
				hobbys: [],
				dayjs,
				fixH: 60,
				scaleValue: 1,
				flag: 1,
				selectedTipFlag: 0,
				noSelectTitleTip: '至少选择三场比赛（竞猜全场90分钟的比赛结果）',
				noSelectTitleTip2: '红色选框为回报更高的竞彩单关',
				noSelectTitleTip3: '红色框选项可投单关，至少选择二场比赛',
				noSelectDescTip: '竞猜90分钟比赛结果，数据仅供参考，请以实票为准',
				tabIndex: 0,
				iStatusBarHeight: 0,
				list: [],
				selectList: [],
				filters: '',
				scheduleList: [],
				actions: [
				        { text: '开奖结果' },
				        { text: '选号记录' },
				        { text: '即时比分' },
						{ text: '玩法说明' },
				    ]
			}
		},
		components: {

		},
		computed: {
			selectedTipFlagFilter() {
				const selectCount = _.uniqBy(this.selectList, (o) => o.subKey).length
				let arr = []
				for (let i = 3; i <= selectCount; i++) {
					arr.push(i)
				}
				return arr
			},
			scrollHeight() {
				const tHeight = (this.iStatusBarHeight + 460) + 'px'
				const data = window.innerHeight - tHeight
				return data
			},
			amountValue() {
				let rs = []
				let result = 0
				let selectListObj = _.groupBy(this.selectList, (o) => o.subKey)
				for (let key in selectListObj) {
					rs.push(selectListObj[key].length)
				}
				//计算金额
				for (let i = 0; i < this.poupSelected.length; i++) {
					const n = this.poupSelected[i].split('串')[0]
					result += calculateTotalCombinations(rs, n)
				}
				return this.scaleValue * 2 * result
			},
			prizeValue() {
				if (this.selectList.length === 0) {
					return 0
				}
				const arr = this.selectList.map(item => Number(item.value))
				return Number(Math.max.apply(null, arr) * this.scaleValue).toFixed(2)
			},
			selectCount() {
				return _.uniqBy(this.selectList, (o) => o.subKey).length
			}
		},
		methods: {
			select(item){
				if("玩法说明" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/bjdc/description/description'
					})
				}else if("即时比分" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/bjdc/score/score'
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
						url: '/pages/choose/component/bjdc/lotteryResult/lotteryResult'
					})
				}
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
			},
			onPoupItemClick(item) {
				if (this.poupSelected.includes(`${item}串1`)) {
					this.poupSelected = this.poupSelected.filter(o => o !== `${item}串1`)
				} else {
					this.poupSelected.push(`${item}串1`)
				}
				this.poupSelected = this.poupSelected.sort()
				this.changeFlagStatus = true
			},
			openDialog() {
				this.$refs.popup.open('bottom')
			},
			closeDialog() {
				this.$refs.popup.close()
			},
			async submitOrder(orderType) {
				if (this.selectCount >= 3) {
					let options = {
						userId: getUserInfo()?.userId,
						userName: getUserInfo()?.userName,
						storeId: getCurrentShop()?.id,
						lotteryAmount: this.amountValue,
						payType: 1,
						lotteryType: 6,
						orderType,
						periods: this.scheduleList[this.scheduleIndex]?.lottery_no,
						multiple: this.scaleValue,
						customsClearanceMode: `${this.poupSelected.join(',')}`,
						lotteryOrderOdds: []
					}
					let selectListObj = _.groupBy(this.selectList, (o) => o.subKey)
					let result = 1;

					let sfpGameData = []
					
					for (let key in selectListObj) {
						const item = selectListObj[key]
						let sfpData = {}
						item.map(o => {
							let obj = {
								[o.result === '胜' ? 'homeOddsName' : 'awayOddsName']: o.result,
								boundary: o.row.boundary,
								[o.result === '胜' ? 'homeOdds' : 'awayOdds']: o.value
							}
							sfpData = {...sfpData,...obj}
						})
						let {
							WL
						} = this.list[item[0].key][key].list
						options.periods = this.list[item[0].key][key].lottery_no
						sfpGameData = [
							{
								homeOddsName: '胜',
								boundary: WL.boundary,
								homeOdds: WL.odds[3]
							},
							{
								awayOddsName: '负',
								boundary: WL.boundary,
								awayOdds: WL.odds[0]
							}
						]
						options.lotteryOrderOdds.push({
							matchCode: key,
							matchDate: this.list[item[0].key][key].bet_time,
							league: this.list[item[0].key][key].league_name,
							homeTeam: this.list[item[0].key][key].rank[1].team_name,
							awayTeam: this.list[item[0].key][key].rank[2].team_name,
							sfpData: JSON.stringify(sfpData),
							sfpGameData: JSON.stringify(sfpGameData),
						})
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
						getApp().globalData.detailOptions = { ...options, topBonusAmount,maskLotteryId };
						uni.navigateTo({
							url: '/pages/tabBar/record/component/sfpass/sfpass'
						});
					}else{
						getApp().globalData.detailOptions = {...options}
						uni.navigateTo({
							url: '/pages/tabBar/record/component/order/order'
						});
					}
					
					
					return
				}
				uni.showToast({
					title: '请选择',
					icon: 'none'
				})
			},
			guessExplain() {
				uni.navigateTo({
					url: '/pages/explain/guessOne'
				})
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
			formatTitle(item, key) {
				const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
				const index = dayjs(key).format('d')
				return dayjs(key).format('MM-DD') + ' ' + weeks[index] + ' ' + `共${Object.keys(item).length}场`
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
			cancel() {
				this.$refs.showRight.close();
			},
			confirm() {
				let str = ''
				this.checkbox1.map((item, index) => {
					str += '&' + `odds_list[${index}][]=${item.split(',')[0]}`
					str += '&' + `odds_list[${index}][]=${item.split(',')[1]}`
				})
				this.checkbox2.map((item) => {
					str += '&' + `league_name[]=${item}`
				})
				this.filters = str
				this.$refs.showRight.close();
				this.findList()
			},
			tdClick(row, pos, key, subKey, postname) {
				if (!row) {
					return
				}
				row[`${pos}Active`] = !row[`${pos}Active`]
				this.handleSelectList(row, pos, key, subKey, postname)
				// this.selectedTipFlag = this.handleRule()
			},
			handleSelectList(row, pos, key, subKey, postname) {
				const obj = {
					left: 3,
					middle: 1,
					right: 0
				}
				const index = obj[pos]
				if (row[`${pos}Active`]) {
					this.selectList.push({
						key,
						subKey,
						pos,
						postname,
						value: row.odds[index],
						result: pos === 'left' ? '胜' : pos === 'middle' ? '平' : '负',
						row,
					})
				} else {
					this.selectList = this.selectList.filter(o => !(o.key === key && o.subKey === subKey && o.pos ===
						pos && o.postname === postname))
				}
				const selectedCount = _.uniqBy(this.selectList, (o) => o.subKey).length
				this.poupSelected = [`${selectedCount}串1`]
			},
			uniqueArrayJSON(arr) {
				var unique = arr.map(JSON.stringify) // 将每个对象转为字符串
					.filter((item, index, arr) => arr.indexOf(item) === index) // 去重
					.map(JSON.parse); // 再将字符串转回对象
				return unique;
			},
			handleRule() {
				if (this.selectList.length === 0) {
					return 0
				}
				let data = this.selectList.filter(o => o.row.is_single === '0').map(item => ({
					key: item.key,
					subKey: item.subKey
				}))
				data = this.uniqueArrayJSON(data)
				if (data.length === 0) {
					//  选单场
					return this.selectList.length === 1 ? 'is_single' : 'is_double'
				}
				if (data.length === 1) {
					return 1
				}
				return data.length
			},
			async findList() {
				let url =
					`platform=koudai_mobile&_prt=https&ver=20180101000000&lottery_type=WL&station_user_id=54275526&station_uuid=b9cfdcrpfsj3fd1661155817${this.filters}`
				const data = await request({
					url: '/api/dc/selectlist?' + url,
					data: {},
					showLoading: true,
				})
				this.list = data
			},
			async findType() {
				const data = await request({
					url: '/api/match/leaguequerylist',
					data: {
						platform: 'koudai_mobile',
						_prt: 'https',
						ver: 20180101000000
					}
				})
				this.hobbys = data.league_list.map(item => ({
					text: item,
					value: item
				}))
			}
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.findList()
			this.findType()
			this.getSchedule()
		},
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

	.button-center {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-size: 17px;
	}

	.content {
		padding: 0 10px;

		.content-item {
			display: flex;
			flex-direction: row;
			padding-bottom: 12px;
		}

		.content-l {
			display: flex;
			flex-direction: column;
			text-align: center;
			margin-right: 15px;
			width: 60px;

			text {
				font-size: 12px;
			}
		}

		.content-r {
			flex: 1;

			.content-r-top {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				text-align: center;
				margin-bottom: 3px;

				.content-r-sub {
					display: flex;
					flex-direction: column;

					text {
						color: #666;
						font-size: 12px;
					}
				}

				.content-r-vs {
					margin: 0 10px;
					color: #000;
					font-size: 14px;

					text {
						margin: 0 3px;
					}
				}
			}

			.table-wrap {
				display: flex;
				flex-direction: row;

				.td-wrap {
					display: flex;
					flex-direction: row;
					align-items: center;

					.val {
						flex: 1;
						text-align: right;
					}
				}
			}

		}
	}

	.table-left {
		display: flex;
		flex-direction: column;
		margin-right: 5px;
		margin-top: 30px;

		.dot {
			width: 16px;
			height: 16px;
			line-height: 16px;
			background-color: #ccc;
			color: #fff;
			font-size: 12px;
			text-align: center;
			border-radius: 50%;
			margin-top: 16px;
		}
	}

	.success {
		color: #4cd964;
	}

	.danger {
		color: #cc0002;
	}

	.active {
		background-color: #cc0002 !important;

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
				border: 1px solid #ddd;
				border-collapse: collapse;
				position: relative;
			}
		}
	}

	td {
		padding: 8px 5px;
		font-size: 13px;
		color: #000;
		background-color: #fff;
		flex: 1;
	}

	.guess-tip {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 10px;
		background-color: #FFF7E7;
		text-align: center;
		color: #333;
		font-size: 13px;
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
				padding: 3px 5px;
				border: 1px solid #ddd;
				border-radius: 3px;
				width: 50px;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #cc0002;
				font-size: 12px;
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
		height: 30px;
		line-height: 30px;
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

	.poup-container {
		padding-bottom: 100px;
		background-color: #fff;
	}

	.poup-wrap {
		padding: 10px 0;
		height: 250px;
	}

	.poup-desc {
		color: #666;
		text-align: center;
	}

	.poup-item-wrap {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.poup-block {
		width: 25%;
		padding: 10px;
		box-sizing: border-box;

	}

	.poup-item {
		border-radius: 5px;
		padding: 5px 0;
		text-align: center;
		border: 1px solid #ddd;
	}

	.poup-item.active {
		background-color: #cc0002;
		color: #fff;
	}

	.poup-tit {
		padding: 10px 0;
		text-align: center;
		background-color: #f5f5f5;
		border-bottom: 1px solid #ddd;
		position: relative;

		.closeIcon {
			position: absolute;
			top: 7px;
			right: 15px;
		}
	}

	.more-poup {
		text-align: center;
		font-size: 12px;
		color: #666;
		padding: 10px 0;
	}
</style>