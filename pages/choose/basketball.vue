<template>
	<view class="page-content">
		<view class="nav-bar">
			<view :style="{ height: iStatusBarHeight + 'px', backgroundColor: '#cc0002' }"></view>
			<uni-nav-bar left-icon="left" background-color="#cc0002" color="#ffffff" height="40px" @clickLeft="clickLeft" @clickRight="clickRight">
				<view class="button-center">竞彩篮球</view>
				<template v-slot:right>
					<zb-popover style="position: absolute;" placement="bottom-end" :options="actions" ref="ZbPopover" theme="dark" @select="select" class="item-popover">
						<view style="position:relative;padding-right:5px;">
							<uni-badge :is-dot="true" absolute="rightTop" size="small" :text="filters ? 1 : 0">
								<uni-icons type="list" size="22" color="#fff"></uni-icons>
							</uni-badge>
						</view>
					</zb-popover>
				</template>
			</uni-nav-bar>
		</view>

		<uni-drawer :width="280" ref="showRight" mode="right" :mask-click="false">
			<view :style="{ height: iStatusBarHeight + 'px', backgroundColor: '#fff' }"></view>
			<view style="padding:58px 10px 10px 10px;">
				<scroll-view :style="{ height: scrollHeight + 'px' }" scroll-y="true">
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

		<scroll-view scroll-y="true" :style="{ paddingTop: iStatusBarHeight + 48 + 'px', paddingBottom: '90px' }">
			<view class="noData" v-if="list.length === 0">暂无数据</view>
			<uni-collapse>
				<uni-collapse-item v-for="(item, key) in list" :key="key" :title="formatTitle(item, key)" :open="true">
					<view class="content">
						<view class="content-item" v-for="(subItem, subKey) in item" :key="subItem">
							<view class="content-l">
								<text>{{ subKey }}</text>
								<uni-tag
									:style="{ margin: '3px 0', backgroundColor: subItem.league_color[0], border: 0 }"
									:text="subItem.league_name"
									type="primary"
									size="small"
								/>
								<text>{{ dayjs(subItem.bet_time).format('HH:mm') }}</text>
								<!-- <text style="color:#019AFE">分析</text> -->
							</view>

							<view class="content-r">
								<view class="content-r-top">
									<view class="content-r-sub">
										<text>
											<text class="sub">客</text>
											[{{ subItem.rank && subItem.rank['2'].rank }}]
										</text>
										<!-- <text>{{ subItem.rank && subItem.rank['2'].rank_league}}</text> -->
									</view>
									<view class="content-r-vs">
										{{ subItem.rank && subItem.rank['2'].team_name }}
										<text>VS</text>
										{{ subItem.rank && subItem.rank['1'].team_name }}
									</view>
									<view class="content-r-sub">
										<text>
											[{{ subItem.rank && subItem.rank['1'].rank }}]
											<text class="sub">主</text>
										</text>
										<!-- <text>{{subItem.rank && subItem.rank['1'].rank_league}}</text> -->
									</view>
								</view>
								<view class="table-wrap">
									<table ref="table" border>
										<tr :class="{ single: subItem.list?.SportteryHWL?.is_single === '1' }">
											<td
												class="td"
												:class="{ active: subItem.list?.SportteryHWL?.leftActive }"
												@click="tdClick(subItem.list?.SportteryHWL, 'left', key, subKey, 'SportteryHWL')"
											>
												<view class="td-wrap">
													<text class="label">客胜</text>
													<text class="val">{{ subItem.list?.SportteryHWL?.odds['0'] ?? '未受注' }}</text>
												</view>
												<div v-if="subItem.list?.SportteryHWL?.is_single === '1'" class="single-tag">单</div>
											</td>
											<td class="td rowspan-td" rowspan="2">
												<view
													style="margin-bottom:10px;"
													:class="{ red: subItem.list?.SportteryHWL?.boundary < 0, green: subItem.list?.SportteryHWL?.boundary > 0 }"
												>
													<view>主{{ subItem.list?.SportteryHWL?.boundary > 0 ? '+' : '' }}{{ subItem.list?.SportteryHWL?.boundary }}</view>
												</view>
												<view class="red">{{ subItem.list?.SportteryBS?.boundary }}</view>
											</td>
											<td
												class="td last"
												:class="{ active: subItem.list?.SportteryHWL?.rightActive }"
												@click="tdClick(subItem.list?.SportteryHWL, 'right', key, subKey, 'SportteryHWL')"
											>
												<view class="td-wrap">
													<text class="label">主胜</text>
													<text class="val">{{ subItem.list?.SportteryHWL?.odds['3'] ?? '未受注' }}</text>
												</view>
											</td>
											<td
												@click="goMore(key, subKey, subItem)"
												class="rowspan"
												:class="{ 'selected-corner': subItem.isSelectedCorner }"
												style="width:30px;text-align:center;position:relative;"
												rowspan="2"
											>
												更多玩法
												<view></view>
											</td>
										</tr>
										<tr class="odd" :class="{ single: subItem.list?.SportteryBS?.is_single === '1' }">
											<td
												class="td"
												:class="{ active: subItem.list?.SportteryBS?.leftActive }"
												@click="tdClick(subItem.list?.SportteryBS, 'left', key, subKey, 'SportteryBS')"
											>
												<view class="td-wrap">
													<text class="label">大分</text>
													<text class="val">{{ subItem.list?.SportteryBS?.odds['3'] ?? '未受注' }}</text>
												</view>
												<div v-if="subItem.list?.SportteryBS?.is_single === '1'" class="single-tag">单</div>
											</td>
											<td
												class="td last"
												:class="{ active: subItem.list?.SportteryBS?.rightActive }"
												@click="tdClick(subItem.list?.SportteryBS, 'right', key, subKey, 'SportteryBS')"
											>
												<view class="td-wrap">
													<text class="label">小分</text>
													<text class="val">{{ subItem.list?.SportteryBS?.odds['0'] ?? '未受注' }}</text>
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
			<view class="select-tip" v-if="selectedTipFlag === 0 || selectedTipFlag === 1">
				<text class="title" v-if="selectedTipFlag === 0">{{ noSelectTitleTip }}}</text>
				<text class="title" v-if="selectedTipFlag === 1">{{ noSelectTitleTip3 }}}</text>
				<text @click="goExplain" style="text-decoration: underline;" v-if="selectedTipFlag === 0 || selectedTipFlag === 1">{{ noSelectDescTip }}</text>
			</view>
			<view v-if="selectedTipFlag === 'is_single' || selectedTipFlag > 1">
				<view class="select-info">
					<uni-badge class="uni-badge-left-margin" :text="selectedTipFlag === 'is_single' ? 1 : selectedTipFlag" absolute="rightTop" size="small">
						<view class="flag-box" @click="openDialog" v-if="poupSelected.length < 1">选择过关</view>

						<view class="flag-box" @click="openDialog" v-else>{{ selectedTipFlag === 'is_single' ? '单关' : `${poupSelected.join(',')}` }}</view>
					</uni-badge>
					<view class="scale-block">
						<uni-number-box :min="1" :max="50000" :width="60" :value="scaleValue" @change="changeNumBox" />
						<text>倍</text>
					</view>

					<view class="select-amount">
						<text class="amount-tit">
							金额
							<text>{{ amountValue }}</text>
							元
						</text>
						<text class="amount-desc">
							最高奖
							<text>{{ prizeValue }}</text>
							元
						</text>
					</view>
				</view>
				<view class="btns">
					<view class="btns-item" @click="delete"><uni-icons type="trash" color="#666" size="20"></uni-icons></view>
					<view class="btns-item btns-prize"></view>
					<view class="btns-item" @click="onsubmit(3)">保存</view>
					<view @click="onsubmit(0)" class="btns-item btns-next">下一步</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
			<view class="poup-container">
				<view class="poup-tit">
					过关方式
					<uni-icons @click="closeDialog" class="closeIcon" type="close" color="#666" size="24"></uni-icons>
				</view>
				<scroll-view class="poup-wrap" scroll-y="true">
					<view class="poup-item-wrap">
						<view class="poup-block" v-for="item in selectedTipFlagFilter" :key="item">
							<view :class="{ active: poupSelected.includes(`${item}串1`) }" @click="onPoupItemClick(item)" class="poup-item">{{ item }}串1</view>
						</view>
					</view>
					<view class="more-poup">更多过关</view>
				</scroll-view>
				<view class="poup-desc">命中{{ selectedTipFlag }}场可中奖</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import buttonGroup from '../component/button-group/button-group.vue';
import request from '../../common/request.js';
import dayjs from 'dayjs';
import _ from 'lodash';
import { factorial, getUserInfo, getCurrentShop, calculateTotalCombinations } from '@/common/util.js';
import config from '@/common/config.js';
export default {
	data() {
		return {
			changeFlagStatus: false,
			poupSelected: [],
			wsObj: {
				'01': '1-5',
				'02': '6-10',
				'03': '11-15',
				'04': '16-20',
				'05': '21-25',
				'06': '26+',
				'11': '1-5',
				'12': '6-10',
				'13': '11-15',
				'14': '16-20',
				'15': '21-25',
				'16': '26+'
			},
			checkbox1: [],
			checkbox2: [],
			hobby: [
				{
					text: '1.50以下',
					value: '0,1.5'
				},
				{
					text: '1.50-2.00',
					value: '1.5,2'
				},
				{
					text: '2.00以上',
					value: '2,0'
				}
			],
			hobbys: [],
			dayjs,
			fixH: 60,
			scaleValue: 1,
			flag: 1,
			flagText: '单关',
			selectedTipFlag: 0,
			noSelectTitleTip: '红色框选项可投单关，至少选择一场比赛',
			noSelectTitleTip2: '红色选框为回报更高的竞彩单关',
			noSelectTitleTip3: '红色框选项可投单关，至少选择二场比赛',
			noSelectDescTip: '竞猜90分钟比赛结果，数据仅供参考，请以实票为准',
			iStatusBarHeight: 0,
			buttons: [
				{
					title: '竞猜足球'
				},
				{
					title: '猜一场'
				}
			],
			list: [],
			selectList: [],
			filters: '',
			amountValue: 0,
			actions: [{ text: '开奖结果' }, { text: '选号记录' }, { text: '即时比分' }, { text: '玩法说明' }]
		};
	},
	components: {
		buttonGroup
	},
	computed: {
		selectedTipFlagFilter() {
			if (this.selectedTipFlag === 'is_single') {
				return [];
			}
			let arr = [];
			for (let i = 2; i <= this.selectedTipFlag; i++) {
				arr.push(i);
			}
			return arr;
		},
		scrollHeight() {
			const tHeight = this.iStatusBarHeight + 460 + 'px';
			const data = window.innerHeight - tHeight;
			return data;
		},
		prizeValue() {
			if (this.selectList.length === 0) {
				return 0;
			}
			const obj = _.groupBy(this.selectList, o => o.subKey);
			let result = 1;
			for (let pro in obj) {
				result = result * Number(_.maxBy(obj[pro], o => Number(o.value)).value);
			}
			return Number(result * 2 * this.scaleValue).toFixed(2);
		}
	},
	methods: {
		select(item) {
			if ('玩法说明' === item.text) {
				uni.navigateTo({
					url: '/pages/choose/component/basketball/description/description'
				});
			} else if ('即时比分' === item.text) {
				uni.navigateTo({
					url: '/pages/choose/component/basketball/score/score'
				});
			} else if ('选号记录' === item.text) {
				uni.switchTab({
					url: '/pages/tabBar/record/record',
					success: function(e) {
						// 成功跳转后的回调
					},
					fail: function(e) {
						// 失败的回调
					}
				});
			} else if ('开奖结果' === item.text) {
				uni.navigateTo({
					url: '/pages/choose/component/basketball/lotteryResult/lotteryResult'
				});
			}
		},
		beforeChange(callback) {
			if (this.selectList.length > 0) {
				uni.showModal({
					title: '提示',
					content: '切换玩法将清除已选项,确定切换吗？',
					confirmText: '确定',
					cancelText: '取消',
					success: res => {
						if (res.confirm) {
							this.reset();
							this.$refs.buttonGroupRef.toggle();
						}
					}
				});
				callback(false);
			} else {
				callback(true);
			}
		},
		reset() {
			this.selectList = [];
		},
		onPoupItemClick(item) {
			if (this.poupSelected.includes(`${item}串1`)) {
				this.poupSelected = this.poupSelected.filter(o => o !== `${item}串1`);
			} else {
				this.poupSelected.push(`${item}串1`);
			}
			this.poupSelected = this.poupSelected.sort();
			this.changeFlagStatus = true;
			this.autoCalc();
		},
		openDialog() {
			// if(this.selectedTipFlag==='is_single'){
			// 	return;
			// }
			this.$refs.popup.open('bottom');
		},
		closeDialog() {
			this.$refs.popup.close();
		},
		autoCalc() {
			let selectList = [];
			for (let key in this.list) {
				for (let subKey in this.list[key]) {
					const { SportteryHWL, SportteryBS, SportteryWL, SportteryWS } = this.list[key][subKey].list;
					if (SportteryHWL?.leftActive) {
						selectList.push({
							key,
							subKey,
							pos: 'left',
							postname: 'SportteryHWL',
							row: SportteryHWL,
							value: SportteryHWL?.odds[0],
							result: '客胜'
						});
					}
					if (SportteryHWL?.rightActive) {
						selectList.push({
							key,
							subKey,
							pos: 'right',
							postname: 'SportteryHWL',
							row: SportteryHWL,
							value: SportteryHWL.odds[3],
							result: '主胜'
						});
					}
					if (SportteryBS?.leftActive) {
						selectList.push({
							key,
							subKey,
							pos: 'right',
							postname: 'SportteryBS',
							row: SportteryBS,
							value: SportteryBS.odds[0],
							result: '大分'
						});
					}
					if (SportteryBS?.rightActive) {
						selectList.push({
							key,
							subKey,
							pos: 'right',
							postname: 'SportteryBS',
							row: SportteryBS,
							value: SportteryBS.odds[3],
							result: '小分'
						});
					}
					// wl 选中
					if (SportteryWL?.rightActive) {
						selectList.push({
							key,
							subKey,
							pos: 'right',
							postname: 'SportteryWL',
							row: SportteryWL,
							value: SportteryWL.odds[3],
							result: '主胜'
						});
					}
					if (SportteryWL?.leftActive) {
						selectList.push({
							key,
							subKey,
							pos: 'left',
							postname: 'SportteryWL',
							row: SportteryWL,
							value: SportteryWL.odds[0],
							result: '客胜'
						});
					}
					// ws 选中
					for (let pro in this.wsObj) {
						if (SportteryWS.odds[`${pro}Active`]) {
							selectList.push({
								key,
								subKey,
								pos: pro,
								postname: 'SportteryWS',
								row: SportteryWS,
								value: SportteryWS.odds[pro],
								result: this.wsObj[pro]
							});
						}
					}
				}
			}

			if (selectList.length > 0) {
				this.selectList = selectList;
			}

			let selectListObj = _.groupBy(this.selectList, o => o.subKey);
			let result = 0;
			let rs = [];
			let lotteryOrderOdds = [];

			for (let key in selectListObj) {
				const item = selectListObj[key];
				//胜负平

				let sfpData = [];
				let sfData = {};
				let scoreData = [];

				// 原始数据
				const { SportteryHWL, SportteryBS, SportteryWL, SportteryWS } = this.list[item[0].key][key].list;

				let sfpGameData = [
					{
						awayOddsName: '客胜',
						awayOdds: SportteryHWL.odds[0],
						postname: 'SportteryHWL'
					},
					{
						is_single: SportteryHWL.is_single,
						boundary: SportteryHWL.boundary
					},
					{
						homeOddsName: '主胜',
						homeOdds: SportteryHWL.odds[3],
						postname: 'SportteryHWL'
					},
					{
						awayOddsName: '大分',
						awayOdds: SportteryBS.odds[0],
						postname: 'SportteryBS'
					},
					{
						is_single: SportteryBS.is_single,
						boundary: SportteryBS.boundary
					},
					{
						homeOddsName: '小分',
						homeOdds: SportteryBS.odds[3],
						postname: 'SportteryBS'
					}
				];
				let sfGameData = SportteryWL
					? [
							{
								awayOddsName: '客胜',
								awayOdds: SportteryWL?.odds[0],
								postname: 'SportteryWL'
							},
							{
								homeOddsName: '主胜',
								homeOdds: SportteryWL?.odds[3],
								postname: 'SportteryWL'
							}
					  ]
					: [];

				let scoreGameData = [];

				for (let i in SportteryWS.odds) {
					scoreGameData.push({
						[i.split('')[0] == 0 ? 'homeScore' : 'awayScore']: this.wsObj[i],
						scoreOdds: SportteryWS.odds[i]
					});
				}

				item.map(o => {
					if (o.postname === 'SportteryHWL') {
						sfpData.push({
							[o.result === '客胜' ? 'awayOddsName' : 'homeOddsName']: o.result,
							boundary: o.row.boundary,
							[o.result === '客胜' ? 'awayOdds' : 'homeOdds']: o.value
						});
					}
					if (o.postname === 'SportteryBS') {
						sfpData.push({
							[o.result === '大分' ? 'awayOddsName' : 'homeOddsName']: o.result,
							boundary: o.row.boundary,
							[o.result === '小分' ? 'awayOdds' : 'homeOdds']: o.value
						});
					}
					if (o.postname === 'SportteryWL') {
						sfData[o.result === '客胜' ? 'awayOddsName' : 'homeOddsName'] = o.result;
						(sfData.boundary = o.row.boundary), (sfData[o.result === '客胜' ? 'awayOdds' : 'homeOdds'] = o.value);
					}
					if (o.postname === 'SportteryWS') {
						for (let i in o.row.odds) {
							if (o.row.odds[`${i}Active`]) {
								scoreData.push({
									[i.split('')[0] == 0 ? 'homeScore' : 'awayScore']: this.wsObj[i],
									scoreOdds: o.row.odds[i]
								});
							}
						}
					}
				});

				const rowNum = sfpData.length + (Object.keys(sfData).length === 5 ? 2 : Object.keys(sfData).length === 3 ? 1 : 0) + scoreData.length || 1;
				lotteryOrderOdds.push({
					matchCode: key,
					matchDate: this.list[item[0].key][key].bet_time,
					league: this.list[item[0].key][key].league_name,
					homeTeam: this.list[item[0].key][key].rank[1].team_name,
					awayTeam: this.list[item[0].key][key].rank[2].team_name,
					sfpData: JSON.stringify(sfpData),
					sfpGameData: JSON.stringify(sfpGameData),
					sfData: JSON.stringify(sfData),
					sfGameData: JSON.stringify(sfGameData),
					scoreData: JSON.stringify(scoreData),
					scoreGameData: JSON.stringify(scoreGameData)
				});
				rs.push(rowNum);
			}
			//  计算金额
			for (let i = 0; i < this.poupSelected.length; i++) {
				const n = this.poupSelected[i].split('串')[0];
				result += calculateTotalCombinations(rs, n);
			}
			this.amountValue = result * 2 * this.scaleValue;
			return lotteryOrderOdds;
		},
		async onsubmit(orderType) {
			if (this.selectedTipFlag > 1 && this.poupSelected.length === 0) {
				uni.showToast({
					title: '请选择过关方式',
					icon: 'none'
				});
				return;
			}
			let options = {
				userId: getUserInfo()?.userId,
				userName: getUserInfo()?.userName,
				storeId: getCurrentShop()?.id,
				lotteryAmount: this.amountValue,
				payType: 1,
				lotteryType: 2,
				orderType,
				multiple: this.scaleValue,
				customsClearanceMode: this.selectedTipFlag === 'is_single' ? '单关' : `${this.poupSelected.join(',')}`,
				lotteryOrderOdds: this.autoCalc()
			};
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
					url: '/pages/tabBar/record/component/jclqOrderDetails/jclqOrderDetails'
				});
			}else{
				getApp().globalData.detailOptions = {...options}
				uni.navigateTo({
					url: '/pages/tabBar/record/component/order/order'
				});
			}
			// getApp().globalData.detailOptions = { ...options, prizeValue: this.prizeValue };

			// uni.navigateTo({
			// 	url: '/pages/tabBar/record/component/jclqOrderDetails/jclqOrderDetails'
			// });
		},
		goMore(key, subKey, subItem) {
			getApp().globalData.subItem = subItem;
			getApp().globalData.clickRow = this.list;
			getApp().globalData.selectList = this.selectList;
			uni.navigateTo({
				url: `/pages/choose/basketballmore?key=${key}&subKey=${subKey}`
			});
		},
		guessExplain() {
			uni.navigateTo({
				url: '/pages/explain/guessOne'
			});
		},
		delete() {
			uni.showModal({
				title: '提示',
				content: '是否清空已投注选项？',
				confirmText: '确定',
				cancelText: '取消',
				success: res => {
					if (res.confirm) {
						this.selectList = [];
						this.findList();
					}
				}
			});
		},
		goExplain() {
			uni.navigateTo({
				url: '/pages/explain/explain'
			});
		},
		formatTitle(item, key) {
			const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
			const index = dayjs(key).format('d');
			return dayjs(key).format('MM-DD') + ' ' + weeks[index] + ' ' + `共${Object.keys(item).length}场`;
		},
		changeNumBox(value) {
			this.scaleValue = value;

			this.autoCalc();
		},
		clickLeft() {
			uni.navigateBack();
		},
		clickRight() {
			//this.$refs.showRight.open();
		},
		cancel() {
			this.$refs.showRight.close();
		},
		confirm() {
			let str = '';
			this.checkbox1.map((item, index) => {
				str += '&' + `odds_list[${index}][]=${item.split(',')[0]}`;
				str += '&' + `odds_list[${index}][]=${item.split(',')[1]}`;
			});
			this.checkbox2.map(item => {
				str += '&' + `league_name[]=${item}`;
			});
			this.filters = str;
			this.$refs.showRight.close();
			this.findList();
		},
		change(index) {
			const item = this.buttons[index];
			this.scaleValue = 1;
			this.findList();
		},
		tdClick(row, pos, key, subKey, postname) {
			if (!row) {
				return;
			}
			row[`${pos}Active`] = !row[`${pos}Active`];
			this.handleSelectList(row, pos, key, subKey, postname);
			this.selectedTipFlag = this.handleRule();
			// 默认选中n串1
			if (this.selectedTipFlag === 1) {
				this.poupSelected = [];
			}
			if (this.selectedTipFlag > 1 && !this.changeFlagStatus) {
				this.poupSelected = [`${this.selectedTipFlag}串1`];
			}
			this.autoCalc();
		},
		handleSelectList(row, pos, key, subKey, postname) {
			//  sfp
			if (postname === 'SportteryHWL' || postname === 'SportteryBS') {
				const obj = {
					left: 0,
					right: 3
				};
				const index = obj[pos];
				if (row[`${pos}Active`]) {
					this.selectList.push({
						key,
						subKey,
						pos,
						postname,
						value: row.odds[index],
						result: pos === 'left' ? (postname === 'SportteryHWL' ? '客胜' : '大分') : postname === 'SportteryHWL' ? '大分' : '小分',
						row
					});
				} else {
					this.selectList = this.selectList.filter(o => !(o.key === key && o.subKey === subKey && o.pos === pos && o.postname === postname));
				}
			}
			this.autoCalc();
		},
		uniqueArrayJSON(arr) {
			var unique = arr
				.map(JSON.stringify) // 将每个对象转为字符串
				.filter((item, index, arr) => arr.indexOf(item) === index) // 去重
				.map(JSON.parse); // 再将字符串转回对象
			return unique;
		},
		handleRule() {
			if (this.selectList.length === 0) {
				return 0;
			}
			const effectSelectList = _.uniqBy(this.selectList, o => {
				return o.subKey;
			});
			if (effectSelectList.length === 1) {
				if (effectSelectList[0].row.is_single === '1') {
					return 'is_single';
				}
				return 1;
			}
			return effectSelectList.length;
		},
		async findList() {
			let url = `platform=koudai_mobile&_prt=https&ver=20180101000000&hide_more=1&single_support=2&jc_type=basket&station_user_id=54275526&station_uuid=b9cfdcrpfsj3fd1661155817${
				this.filters
			}`;
			const data = await request({
				url: '/api/match/selectlist?' + url,
				data: {},
				showLoading: true
			});
			this.list = data;
		},
		async findType() {
			const data = await request({
				url: '/api/match/leaguequerylist',
				data: {
					platform: 'koudai_mobile',
					_prt: 'https',
					ver: 20180101000000
				}
			});
			this.hobbys = data.league_list.map(item => ({
				text: item,
				value: item
			}));
		},
		getValue(value) {
			// 回写选择玩法
			this.list[value.key][value.subKey] = getApp().globalData.subItem;
			this.list[value.key][value.subKey].isSelectedCorner = this.formatCorner(getApp().globalData.subItem);
			this.autoCalc();
		},
		formatCorner(subItem) {
			if (subItem.list?.SportteryWL?.leftActive || subItem.list?.SportteryWL?.rightActive) {
				return true;
			}
			let isSelected = false;
			for (let pro in subItem.list?.SportteryWS.odds) {
				if (pro.indexOf('Active') > -1 && subItem.list?.SportteryWS.odds[pro]) {
					isSelected = true;
					break;
				}
			}
			return isSelected;
		},
		formatHalf(val) {
			const val0 = val.split('')[0];
			const val1 = val.split('')[1];
			return this.formatVal(val0) + '/' + this.formatVal(val1);
		},
		formatVal(val) {
			return val === '3' ? '胜' : val === '1' ? '平' : '负';
		},
		clearSelect(value) {
			this.findList();
		}
	},

	onLoad(option) {
		this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		this.findList();
		this.findType();
	}
};
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
	font-size: 16px;
}

.content {
	padding: 0 10px;

	.content-item {
		display: flex;
		flex-direction: row;
		padding-bottom: 12px;
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

				.sub {
					color: #666;
					fongt-size: 10px;
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

	.dot.success {
		background-color: #4cd964;
	}

	.dot.danger {
		background-color: #cc0002;
	}
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

	tr.single {
		td.td {
			border: 1px solid #cc0002;
			background-color: rgba(231, 0, 0, 0.05);
			position: relative;

			.single-tag {
				position: absolute;
				top: -5px;
				left: 0;
				width: 14px;
				height: 14px;
				line-height: 14px;
				font-size: 12px;
				color: #fff;
				background-color: #cc0002;
				padding: 1px;
				box-shadow: 0 2px 5px #cc0002;
			}
		}

		td.rowspan-td {
			border: 1px solid #ddd;
			background-color: #e4e4e4;
			border-right: 0;
		}

		td.last::before {
			border-right: 1px solid #cc0002;
			border-top: 0;
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
		}

		td.rowspan {
			border-left: 2px solid #ddd;
		}
	}

	.odd.single {
		td::before {
			border-top: 1px solid #cc0002;
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
		}
	}
}

td {
	padding: 10px 5px;
	font-size: 13px;
	color: #000;
	background-color: #fff;
}

.guess-tip {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 10px;
	background-color: #fff7e7;
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

.selected-corner {
	color: red;
	overflow: hidden;

	view {
		width: 20px;
		height: 20px;
		background-color: #cc0002;
		position: absolute;
		right: -10px;
		bottom: -10px;
		color: #fff;
		font-size: 12px;
		text-align: left;
		font-weight: bold;
		padding: 3px;
		box-sizing: border-box;
		transform: rotate(45deg);
	}
}

.rowspan-td {
	background-color: #e4e4e4;
	text-align: center;
	padding: 0;
	width: 80px;
}

.red {
	color: red;
}

.green {
	color: green;
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
