<template>
	<view class="page-content">
		<view class="nav-bar">
			<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#cc0002'}"></view>
			<uni-nav-bar left-icon="left" background-color="#cc0002" color="#ffffff" height="40px"
				@clickLeft="clickLeft" @clickRight="clickRight">
				<view class="button-center">
					<button-group ref="buttonGroupRef" :buttons="buttons" @change="change"
						:before-change="beforeChange"></button-group>
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
						{{dayjs(info.itou_end_time).format('HH:mm')}}</text>截止 </text>
			</view>
			<view class="opt">
				<view class="opt-tab">
					<view :class="{'active':optTabIndex===0}" @click="onOptTabClick(0)"><text>普通投注</text></view>
					<view :class="{'active':optTabIndex===1}" @click="onOptTabClick(1)"><text>和值投注</text></view>
					<view v-if="tabIndex===1" :class="{'active':optTabIndex===2}" @click="onOptTabClick(2)">
						<text>组3单式</text></view>
				</view>
				<view class="opt-btn" v-if="optTabIndex===0">
					<view class="opt-btn-r">
						<uni-data-checkbox multiple v-model="checkboxAll" :localdata="chxAll"></uni-data-checkbox>
					</view>
				</view>
			</view>

			<view v-if="optTabIndex===0">
				<view v-if="tabIndex===0" class="redBall" v-for="(item,index) in redBalls">
					<view style="margin:5px 10px 0 0">
						<text>{{item.label}}</text>
					</view>
					<view class="seven-container">
						<view class="redBall-item" v-for="(subItem,subIndex) in item.data" :key="subIndex">
							<view :class="{'active':selectedRedIndex[index]?.includes(subIndex)}" class="circle"
								@click="onItemClick(subIndex,index,'selectedRedIndex')">{{subItem.value}}</view>
							<view class="redBall-item-desc">
								<text v-if="checkboxAll[0]==='all'">{{ gapArr[index][subIndex] }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="container-bg" v-if="tabIndex===1">
					<view class="btns-block">
						<view @click="onTeanTabClick(3)" :class="{'active':teams.includes(3)}" class="btns-block-item">
							组3
							<view v-if="teams.includes(3)" class="btns-block-tag"></view>
						</view>
						<view @click="onTeanTabClick(6)" :class="{'active':teams.includes(6)}" class="btns-block-item">
							组6
							<view v-if="teams.includes(6)" class="btns-block-tag"></view>
						</view>
					</view>
					<view class="circles">
						<view class="circles-block" v-for="(item,index) in circles">
							<view @click="onTeamItemClick(item)"
								:class="{'active':teamSelected.includes(item.text),'tdan':item.chx[0]===item.text}"
								class="circles-item">{{item.text}}
								<view v-if="[0,5].includes(item.text)" class="dan">设胆</view>
							</view>
							<uni-data-checkbox @change="onTeamCheckboxClick(item,index)" multiple v-model="item.chx"
								:localdata="item.localdata"></uni-data-checkbox>
						</view>

					</view>
				</view>
			</view>

			<view class="redBall" v-if="optTabIndex===1" v-for="(item,index) in sumNum">
				<view class="redBall-item" v-for="subItem in item" :key="subItem">
					<view v-if="tabIndex===0" :class="{'active': selectedValIndex[0]?.includes(subItem-1)}"
						class="circle" @click="onItemClick(subItem-1,index,'selectedValIndex')">{{subItem-1}}</view>
					<view v-if="tabIndex===1" :class="{'active': selectedValIndex[0]?.includes(subItem)}" class="circle"
						@click="onItemClick(subItem,index,'selectedValIndex')">{{subItem}}</view>
					<view class="redBall-item-desc">
						<text v-if="checkboxAll[0]==='all'"></text>
					</view>
				</view>
			</view>

			<view v-if="optTabIndex===2" class="d-wrap">
				<view class="d-block">
					<view style="margin-top:5px;width:100px;">对子号码</view>
					<view class="d-block-num">
						<view class="d-item" v-for="item in 10">
							<view @click="onDclick(item-1,'doubles')" :class="{'active':doubles.includes(item-1)}"
								class="circle">{{item-1}}</view>
						</view>

					</view>
				</view>
				<view class="d-block">
					<view style="margin-top:5px;width:100px;">非对子号码</view>
					<view class="d-block-num">
						<view class="d-item" v-for="item in 10">
							<view @click="onDclick(item-1,'singles')" :class="{'active':singles.includes(item-1)}"
								class="circle">{{item-1}}</view>
						</view>

					</view>
				</view>
				<view class="tips">
					<view>示例</view>
					<view>对子号码选择0，非对子号码选择1，则组3单式号码为001</view>
					<view>对子号码选择0和1，非对子号码选择2，则组3单式号码为002、112</view>
				</view>
			</view>

		</scroll-view>
		<view class="opt-wrap">

			<view class="btns">
				<view class="btns-item" @click="reset"><uni-icons type="trash" color='#666' size="20"></uni-icons>
				</view>
				<!-- <view class="scale-block">
					<uni-number-box :min="1" :max="50000" :width="60" :value="scaleValue" @change="changeNumBox" />
					<text>倍</text>
				</view> -->
				<view style="flex:1">
					<view style="background-color: #fff;text-align:center">
						<view v-if="!isSelectedOk" class="btns-item btns-prize">
							<text v-if="tabIndex===0 || optTabIndex===2">每位至少选择1个<text
									v-if="optTabIndex===2">不同</text>号码</text>
							<text v-if="tabIndex===1 && optTabIndex===0">至少选择{{teams.includes(6)?3:2}}个号码</text>
						</view>
						<view v-if="isSelectedOk" class="btns-item btns-prize">
							<view style="font-size:14px;">共<text class="red">{{amountValue}}</text>元</view>
						</view>
					</view>
				</view>
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
	import buttonGroup from '../component/button-group/button-group.vue';
	import {
		calculateGroupThree,
		calculateGroupSix,
		calculateGroupThreeSix
	} from '@/common/util.js'
	import _ from 'lodash'
	export default {
		data() {
			return {
				doubles: [],
				singles: [],
				sumNum: [28],
				teamSelected: [],
				circles: [{
						text: 0,
						chx: [],
						localdata: [{
							text: '',
							value: 0,
							gap: ''
						}]
					},
					{
						text: 1,
						chx: [],
						localdata: [{
							text: '',
							value: 1,
							gap: ''
						}]
					},
					{
						text: 2,
						chx: [],
						localdata: [{
							text: '',
							value: 2,
							gap: ''
						}]
					},
					{
						text: 3,
						chx: [],
						localdata: [{
							text: '',
							value: 3,
							gap: ''
						}]
					},
					{
						text: 4,
						chx: [],
						localdata: [{
							text: '',
							value: 4,
							gap: ''
						}]
					},
					{
						text: 5,
						chx: [],
						localdata: [{
							text: '',
							value: 5,
							gap: ''
						}]
					},
					{
						text: 6,
						chx: [],
						localdata: [{
							text: '',
							value: 6,
							gap: ''
						}]
					},
					{
						text: 7,
						chx: [],
						localdata: [{
							text: '',
							value: 7,
							gap: ''
						}]
					},
					{
						text: 8,
						chx: [],
						localdata: [{
							text: '',
							value: 8,
							gap: ''
						}]
					},
					{
						text: 9,
						chx: [],
						localdata: [{
							text: '',
							value: 9,
							gap: ''
						}]
					}
				],
				teams: [3, 6],
				buttons: [{
						title: '直选',
					},
					{
						title: '组选',
					}
				],
				optTabIndex: 0,
				tabIndex: 0,
				gap: {},
				gapArr: {
					0: [],
					1: [],
					2: []
				},
				formatNumber,
				formats,
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
				selectedValIndex: {},
				sumObj: {
					'1': 2,
					'2': 4,
					'3': 4,
					'4': 8,
					'5': 10,
					'6': 12,
					'7': 16,
					'8': 20,
					'9': 22,
					'10': 26,
					'11': 28,
					'12': 28,
					'13': 30,
					'14': 30,
					'15': 28,
					'16': 28,
					'17': 26,
					'18': 22,
					'19': 20,
					'20': 16,
					'21': 12,
					'22': 10,
					'23': 8,
					'24': 4,
					'25': 4,
					'26': 2
				},
				actions: [{
						text: '历史开奖'
					},
					{
						text: '选号记录'
					},
					{
						text: '玩法说明'
					},
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
			isSelectedOk() {
				if (this.tabIndex === 0) {
					if (this.optTabIndex === 0) {
						return Object.values(this.selectedRedIndex).length === 3
					}
					return this.selectedValIndex[0]?.length > 0
				}
				if (this.tabIndex === 1) {
					if (this.optTabIndex === 0) {
						if (this.teams.length === 1 && this.teams[0] === 6) {
							return this.teamSelected.length > 2
						} else {
							return this.teamSelected.length > 1
						}
					} else if (this.optTabIndex === 1) {
						return this.selectedValIndex[0]?.length > 0
					} else if (this.optTabIndex === 2) {
						if (this.doubles.length === 1 && this.singles.length === 1 && this.doubles[0] === this.singles[
							0]) {
							return false
						}
						return this.doubles.length > 0 && this.singles.length > 0
					}

				}
				return false

			},
			amountValue() {
				if (this.tabIndex === 0) {
					if (this.optTabIndex === 0 && Object.values(this.selectedRedIndex).length === 3) {
						const selectedRedData = Object.values(this.selectedRedIndex)
						let resultRed = 1
						selectedRedData.map(item => {
							if (item.length > 1) {
								resultRed = resultRed * (item.length)
							}
						})
						return resultRed * 2 * this.scaleValue
					} else if (this.optTabIndex === 1) {
						let counts = [];
						for (let i = 0; i < this.selectedValIndex[0]?.length; i++) {
							let sum = this.selectedValIndex[0][i]
							let count = 0
							for (let s1 = 0; s1 < 10; s1++) {
								for (let s2 = 0; s2 < 10; s2++) {
									for (let s3 = 0; s3 < 10; s3++) {
										if (s1 + s2 + s3 === sum) {
											count++
										}
									}
								}
							}
							counts.push(count)
						}
						const result = counts.reduce((prev, currentValue) => prev + currentValue, 0)
						return result * 2 * this.scaleValue
					}
				} else {
					if (this.optTabIndex === 0) {
						const obj = this.getSelected3And6()
						if (this.teams.length === 2) {
							return calculateGroupThreeSix(obj.danma, obj.tumas) * 2
						} else if (this.teams[0] === 3) {
							return calculateGroupThree(obj.danma, obj.tumas) * 2
						} else {
							return calculateGroupSix(obj.danma, obj.tumas) * 2
						}
					} else if (this.optTabIndex === 1) {
						if (this.selectedValIndex[0]) {
							let sum = 0;
							this.selectedValIndex[0].map(item => {
								sum += this.sumObj[item]
							})
							return sum;
						}
						return this.selectedValIndex
					} else if (this.optTabIndex === 2) {
						if (this.doubles.length > 0 && this.singles.length > 0) {
							const _same = _.intersection(this.doubles, this.singles)
							return (this.doubles.length * this.singles.length - _same.length) > 0 ? (this.doubles.length *
								this.singles.length - _same.length) * 2 : 2
						}
					}
				}
				return 0
			},
			permutationThreeType() {
				if (this.optTabIndex === 0) {
					return '1'
				}
				if (this.optTabIndex === 1) {
					return '2'
				}
				return '1'
			}
		},
		methods: {
			select(item){
				if("玩法说明" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/three/description/description'
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
						url: '/pages/choose/component/three/lotteryResult/lotteryResult'
					})
				}
			},
			onDclick(val, type) {
				if (this[type].includes(val)) {
					this[type] = this[type].filter(o => o !== val)
				} else {
					this[type].push(val)
				}
			},
			onTeamItemClick(item) {
				if (this.teamSelected.includes(item.text)) {
					this.teamSelected = this.teamSelected.filter(o => o !== item.text)
				} else {
					this.teamSelected.push(item.text)
				}
			},
			onTeamCheckboxClick(item, index) {
				const dans = this.circles.filter(o => o.chx[0] >= 0)
				if (this.teams.length === 1) {
					if (this.teams[0] === 3) {
						if (dans.length > 1) {
							uni.showToast({
								title: '组3只能设置一个胆',
								icon: 'none'
							})
							this.circles[index].chx = []
							return
						}
					} else if (this.teams[0] === 6) {
						if (dans.length > 2) {
							uni.showToast({
								title: '组6只能设置二个胆',
								icon: 'none'
							})
							this.circles[index].chx = []
							return
						}
					}
				} else if (this.teams.length === 2) {
					if (dans.length > 2) {
						uni.showToast({
							title: '组3组6只能设置二个胆',
							icon: 'none'
						})
						this.circles[index].chx = []
						return
					}
				}
			},
			onTeanTabClick(val) {
				if (this.teams.includes(val)) {
					this.teams = this.teams.filter(o => o !== val)
				} else {
					this.teams.push(val)
				}
				if (this.teams.length === 0) {
					this.teams = [3, 6].filter(o => o !== val)
				}
				//自动去掉多余的胆
				const dans = this.circles.filter(o => o.chx[0] >= 0)
				if (dans.length > 1) {
					if (this.teams.length === 1 && this.teams[0] === 3) {
						const reduceDanVal = dans[dans.length - 1].chx[0]
						for (let i = 0; i < this.circles.length; i++) {
							if (this.circles[i].chx[0] === reduceDanVal) {
								this.circles[i].chx = []
								break;
							}
						}
					}
				}
			},
			getSelected3And6() {
				const danma = this.circles.filter(o => o.chx[0] >= 0).map(item => item.chx[0])
				const allSelected = [...new Set([...this.teamSelected, ...danma])]
				const tumas = _.difference(allSelected, danma)
				return {
					danma,
					tumas
				}
			},
			next() {
				if (!this.isSelectedOk) {
					uni.showToast({
						icon: 'none',
						title: '请选择'
					})
					return
				}
				let selectedArr;
				if (this.tabIndex === 0) {
					selectedArr = this.getSelectedBalls()

				} else {
					if (this.optTabIndex === 0) {
						const danSelected = this.circles.filter(o => o.chx[0] >= 0).map(item => item.chx[0])
						const allSelected = [...new Set([...this.teamSelected, ...danSelected])]
						selectedArr = [danSelected, allSelected]
					} else if (this.optTabIndex === 1) {
						selectedArr = [this.selectedValIndex[0]]
					} else if (this.optTabIndex === 2) {
						selectedArr = [
							[...this.doubles],
							[...this.singles]
						]
					}

				}
				uni.setStorageSync('lotteryType', 9)
				uni.setStorageSync('tabIndex', this.tabIndex)
				uni.setStorageSync('optTabIndex', this.optTabIndex)
				uni.setStorageSync('amountValue', this.amountValue)
				uni.setStorageSync('endDate', this.info.end_time)

				if (this.tabIndex === 0) {
					uni.setStorageSync(`optTabIndex${this.optTabIndex}`, selectedArr)
					uni.setStorageSync(`optTabIndex${this.optTabIndex}amount`, this.amountValue)
				} else {
					if (this.optTabIndex === 0) {
						if (this.teams.length === 1 && this.teams[0] === 3) {
							//3
							uni.setStorageSync(`teamIndex`, 3)
							uni.setStorageSync(`team3`, selectedArr)
						} else if (this.teams.length === 1 && this.teams[0] === 6) {
							//4
							uni.setStorageSync(`teamIndex`, 4)
							uni.setStorageSync(`team4`, selectedArr)
						} else {
							//5
							uni.setStorageSync(`teamIndex`, 5)
							uni.setStorageSync(`team5`, selectedArr)
						}
					}
					if (this.optTabIndex === 1) {
						//6
						uni.setStorageSync(`teamIndex`, 6)
						uni.setStorageSync(`team6`, selectedArr)
					}
					if (this.optTabIndex === 2) {
						//7
						uni.setStorageSync(`teamIndex`, 7)
						uni.setStorageSync(`team7`, selectedArr)

					}
				}
				let lotteryType = 1
				if (this.tabIndex === 0) {
					if (this.optTabIndex === 1) {
						lotteryType = 2
					}
				} else {
					if (this.optTabIndex === 0) {
						if (this.teams.length == 2) {
							lotteryType = 5
						} else if (this.teams.length == 1 && this.teams[0] === 3) {
							lotteryType = 3
						} else if (this.teams.length == 1 && this.teams[0] === 6) {
							lotteryType = 4
						}
					} else if (this.optTabIndex === 1) {
						lotteryType = 6
					} else if (this.optTabIndex === 2) {
						lotteryType = 7
					}
				}

				uni.navigateTo({
					url: '/pages/choose/threeNext'
				})
			},
			onOptTabClick(index) {
				this.optTabIndex = index;
			},
			getSelectedBalls() {
				let result;
				if (this.optTabIndex === 0) {
					result = Object.values(this.redBalls).map((item, index) => {
						let arr = []
						item.data.map((subItem, subIndex) => {
							if (this.selectedRedIndex[index]?.includes(subIndex)) {
								arr.push(subItem.value)
							}
						})
						item = {
							coord: item.label,
							periods: this.info.lottery_no,
							permutationNumList: arr,
						}
						return item
					})
				} else if (this.optTabIndex === 1) {
					result = this.selectedValIndex[0].sort(function(a, b) {
						return a - b
					})
				}
				return result
			},
			checkSelected() {
				if (this.tabIndex === 0) {
					if (this.optTabIndex === 0) {
						const result = Object.values(this.selectedRedIndex).length < 3
						if (result) {
							uni.showToast({
								title: '每位至少选择1个号码',
								icon: 'none'
							})
						}
						return result
					}
					if (this.optTabIndex === 1) {
						const result = Object.values(this.selectedValIndex).length === 0
						if (result) {
							uni.showToast({
								title: '每位至少选择1个号码',
								icon: 'none'
							})
						}
						return result
					}
				}
				return false
			},
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
							this.selectedRedIndex = {}
							this.init()
						}
					}
				});
			},
			clear() {
				this.selectedRedIndex = {}
				this.selectedValIndex = {}
				this.teamSelected = []
				this.circles = this.circles.map(o => {
					o.chx = []
					return o
				})
				this.doubles = []
				this.singles = []
			},
			change(index) {
				const item = this.buttons[index]
				this.tabIndex = index;
				this.sumNum = index === 1 ? [26] : [28],
					uni.removeStorageSync('selectedList')
				this.optTabIndex = 0
			},
			beforeChange(callback) {
				if (this.tabIndex === 0) {
					if (Object.values(this.selectedRedIndex).length > 0) {
						uni.showModal({
							title: '提示',
							content: '切换玩法将清除已选项,确定切换吗？',
							confirmText: '确定',
							cancelText: '取消',
							success: (res) => {
								if (res.confirm) {
									this.clear()
									this.$refs.buttonGroupRef.toggle()
								}
							}
						});
						callback(false)
					} else {
						callback(true)
					}
				} else {
					callback(true)
				}

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
					`platform=koudai_mobile&_prt=https&ver=20180101000000&lottery_type=P3&station_user_id=54275526&station_uuid=b9cfdcrpfsj3fd1661155817&t=254689&_=1713826090148`
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
						lottery_type: 'P3',
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
						lottery_type: 'P3',
						t: 697619,
						_: 1713826090146
					}
				})
				this.gap = data
				const {
					P_1,
					P_2,
					P_3
				} = data
				P_1.map(item => {
					this.gapArr[0].push(item.gap)
				})
				P_2.map(item => {
					this.gapArr[1].push(item.gap)
				})
				P_3.map(item => {
					this.gapArr[2].push(item.gap)
				})
			},
			init() {
				this.findList()
				this.getAd()
				this.getGap()
			}
		},
		onShow() {
			this.init()
			this.clear()
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;

		},
	}
</script>

<style scoped lang="scss">
	.page-content {
		height: 100%;
		background-color: #fff;
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
			align-items: center;

			// border-top:1px solid #ddd;
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
		padding: 5px 10px 0 10px;

		.opt-tab {
			flex: 1;
			display: flex;
			flex-direction: row;
			align-items: center;

			view {
				padding: 5px 0;
				border-bottom: 2px solid #f2f2f2;
				margin-right: 10px;
			}

			view.active {
				color: #cc0002;
				border-bottom: 2px solid #cc0002;
			}
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
		padding: 0 20px;
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

	.btns-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 10px 0;
	}

	.btns-block-item {
		padding: 5px 35px;
		border: 1px solid #ddd;
		border-radius: 5px;
		background-color: #fff;
		margin: 0 10px;
		position: relative;
		overflow: hidden;
	}

	.btns-block-item.active {
		border: 1px solid #CC0002;
	}

	.btns-block-tag {
		width: 20px;
		height: 20px;
		background-color: #CC0002;
		position: absolute;
		bottom: -10px;
		right: -10px;
		transform: rotate(45deg);
	}

	.container-bg {
		background-color: #fff;
	}

	.circles {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		padding: 0 30px;

		.circles-block {
			width: 20%;
			text-align: center;
			margin-bottom: 10px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			position: relative;

		}

		.circles-item {
			width: 35px;
			height: 35px;
			border: 1px solid #ddd;
			line-height: 35px;
			text-align: center;
			border-radius: 50%;
			margin: 10px auto;
			color: #333;
		}

		.circles-item.active {
			background-color: #CC0002;
			color: #fff;
			border: 1px solid #CC0002;
		}

		.circles-item.tdan {
			background-color: #ff7162;
			color: #fff;
			border: 1px solid #ff7162;
		}
	}

	:v-deep(.uni-data-checklist .checklist-group .checklist-box) {
		margin-right: 0;
	}

	.dan {
		position: absolute;
		left: -15px;
		color: #999;
	}

	.d-block {
		display: flex;
		flex-direction: row;
		padding: 10px 16px;
		border-bottom: 1px solid #f5f5f5;
		margin-bottom: 10px;
	}

	.d-block-num {
		display: flex;
		flex: 1;
		flex-direction: row;
		flex-wrap: wrap;
		margin-left: 10px;

		.d-item {
			width: 20%;
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
			margin-bottom: 15px;
		}

		.circle {
			width: 35px;
			height: 35px;
			line-height: 35px;
			border: 1px solid #ddd;
			border-radius: 50%;
			box-sizing: border-box;
			text-align: center;
			color: #CC0002;
		}

		.circle.active {
			border: 1px solid #CC0002;
			background: #CC0002;
			color: #fff;
		}
	}

	.tips {
		padding: 16px;
		color: #999;
		font-size: 12px;
	}
</style>