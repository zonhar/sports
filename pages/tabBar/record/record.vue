<template>
	<view>
		<!-- <uni-datetime-picker v-model="daterange" type="daterange" return-type="date" rangeSeparator="至"
			:clear-icon="false" @change="change" /> -->
		<view class="list">
			<view v-if='records.length===0' class="empty">暂无记录</view>
			<view class='records-wrap' v-for="record in records" :key="record.maskLotteryId">

				<view class="records-content" @click="openDetail(record)">
					<view class="date-wrap">
						<view class="date-wrap-item active"><text>{{ dayjs(record.createTime).format('DD') }}</text></view>
						<view class='date-wrap-item'><text>{{ dayjs(record.createTime).format('MM') }}</text></view>
					</view>
					
				</view>
				<view class="result" :class="{'active':record.isLottery===1,'green':record.orderType===3}">
					<text v-if="record.orderType===3">保存订单</text>
					<text v-else>
						<text v-if="record.orderType===0">
							<text v-if="record.openLottery==='{}' || !record.openLottery">待开奖</text>
							<text v-else>
								<text v-if="record.isLottery===0">未中奖</text>
								<text v-if="record.isLottery===1">奖金:{{record.winningAmount}}</text>
							</text>
						</text>
						<text v-else>未中奖</text>
					</text>
					
				</view>
				<view style="flex:1;"></view>
				<view style="text-align:right;color:#666" @click="openDetail(record)">
				<!-- 	<view style="font-size:12px;">第{{record.periods}}期<text style="margin-left:10px;">{{orderTypes[record.lotteryType]}}</text></view>
					<view class="time"><text>{{record.createTime}}</text></view> -->
					<view style="font-size:12px;"><text style="margin-left:10px;">{{orderTypes[record.lotteryType]}}</text></view>
					<text class="amount">
						<text style="color:red;">{{record.lotteryAmount}}</text></text>
				</view>
				
				<view style="padding-left:10px;">
					<uni-icons type="right" size="16" color="#999"></uni-icons>
				</view>

			</view>
			<uni-load-more @clickLoadMore="clickLoadMore" v-if="records.length>0" :status="status"
				:content-text="contentText" />

		</view>

	</view>
</template>

<script>
	import request from '@/common/request.js';
	import dayjs from 'dayjs';
	import _ from 'lodash'
	import config from '@/common/config.js'
	import { getUserInfo, getCurrentShop,orderTabs,orderTypes } from '@/common/util';
	export default {
		data() {
			return {
				dayjs,
				orderTabs,
				orderTypes,
				daterange: [dayjs(dayjs().subtract(90, 'day')).format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
				status: 'no-more', //more、loading
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				total: 0,
				pageNum: 1,
				pageSize: 10,
				current: 0,
				list: [{
					name: '店内',
					value: 0,
				}, {
					name: '保存',
					value: 1,
				}, {
					name: '推荐',
					value: 2,
				}, {
					name: '合买',
					value: 3,
				}],
				records: {
					// 0: [{
					// 	createtime: '2024-05-01 04:29 04:28',
					// 	lottery_name: '竞足胜平负',
					// 	lottery_amount: '20'
					// }],
					// 1: [],
					// 2: [],
					// 3: []
				},

			}
		},
		computed:{
			month(){
				return dayjs(this.record?.createTime).format('MM')
			}
		},
		methods: {
			openDetail(record) {
				getApp().globalData.detailOptions = record
				if(record.lotteryType == 1){
					uni.navigateTo({
					  url: '/pages/tabBar/record/component/jczqOrderDetails/jczqOrderDetails?info=' + encodeURIComponent(JSON.stringify(record)),
					})
				}else if(record.lotteryType == 2){
					uni.navigateTo({
					  url: '/pages/tabBar/record/component/jclqOrderDetails/jclqOrderDetails?info=' + encodeURIComponent(JSON.stringify(record)),
					})
				}else if(record.lotteryType == 3){
					uni.navigateTo({
					  url: '/pages/tabBar/record/component/football14/football14?info=' + encodeURIComponent(JSON.stringify(record)),
					})
				}else if(record.lotteryType == 4){
					uni.navigateTo({
					  url: '/pages/tabBar/record/component/football9/football9?info=' + encodeURIComponent(JSON.stringify(record)),
					})
				}else if(record.lotteryType == 5){
					uni.navigateTo({
					  url: '/pages/tabBar/record/component/beijindanchang/beijindanchang?info=' + encodeURIComponent(JSON.stringify(record)),
					})
				}else if(record.lotteryType == 6){
					uni.navigateTo({
					  url: '/pages/tabBar/record/component/sfpass/sfpass?info=' + encodeURIComponent(JSON.stringify(record)),
					})
				}else if(record.lotteryType == 7){
					uni.navigateTo({
					  url: '/pages/tabBar/record/component/dlt/dlt?info=' + encodeURIComponent(JSON.stringify(record)),
					})
				}else if(record.lotteryType == 8){
					uni.navigateTo({
					  url: '/pages/tabBar/record/component/qxc/qxc?info=' + encodeURIComponent(JSON.stringify(record)),
					})
				}else if(record.lotteryType == 9){
					uni.navigateTo({
					  url: '/pages/tabBar/record/component/pl3/pl3?info=' + encodeURIComponent(JSON.stringify(record)),
					})
				}else if(record.lotteryType == 10){
					uni.navigateTo({
					  url: '/pages/tabBar/record/component/pl5/pl5?info=' + encodeURIComponent(JSON.stringify(record)),
					})
				}

			},
			async change(val) {
				this.daterange = [dayjs(val[0]).format('YYYY-MM-DD'), dayjs(val[1]).format('YYYY-MM-DD')]
				this.pageNum = 1
				this.records = []
				this.findList()
			},
			async findList() {
				const options = {
					url: `${config.baseURL}/mobile/lotteryOrder/orderQueryPage`,
					method: 'get',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						lotteryType: '',
						startDate: this.daterange[0],
						endDate: this.daterange[1],
						userId: getUserInfo()?.userId,
						storeId: getCurrentShop()?.id,
					},
					loading: true,
				}
				const data = await request(options)
				this.total = data.total

				if (this.pageNum === 1) {
					this.records = data.records
				} else {

					this.records = [...this.records, ...data.records]
				}
				if (this.total > this.records.length) {
					this.status = 'more'
				} else {
					this.status = 'no-more'
				}
			},
			clickTab(item) {
				// console.log('当前选中的项：' + item.value)
			},
			onChange(e) {
				this.status = e.detail.value
			},
			clickLoadMore(e) {
				if (e.detail.status === 'more') {
					this.status = 'loading'
					this.pageNum++
					this.findList()
				}

			},
			clearSelect(value){
				this.findList()
			},
		},

		onShow: function() {
			// setTimeout(function () {
			// 	console.log('start pulldown');
			// }, 1000);
			// uni.startPullDownRefresh();
			this.findList()

		},

		onPullDownRefresh() {
			this.pageNum = 1
			this.records = []
			this.findList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>

<style scoped lang="scss">
	.list {
		padding: 12px;
		background-color: #ffffff;
		margin-top: 12px;
		min-height: 90vh;
	}

	.empty {
		color: #999;
		text-align: center;
		padding-top: 100px;
	}

	.records-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom: 1px solid #f5f5f5;
		margin-bottom: 15px;
		padding-bottom: 15px;

		.records-content {
			font-size: 14px;

			.tit {
				font-size: 16px;
				margin-bottom:3px;
			}



		}

		.time {
			font-size: 14px;
			color: #666;
		}
	}
	.amount {
		font-size: 15px;
	}
	.date-wrap{
		width:40px;
		border:1px solid #ddd;
		border-radius:5px;
	}
	.date-wrap-item{
		padding:3px 0;
		text-align: center;
	}
	.date-wrap-item.active{
		background-color: #c2ddfd;
	}
	.result{
		width:90px;
		height:26px;
		line-height:26px;
		border-radius: 15px;
		background-color: #ccc;
		text-align: center;
		font-size:12px;
		margin:0 15px;
	}
	.result.active{
		background-color: #fd9700;
		color:#fff;
	}
	.result.green{
		background-color: #4db04b;
		color:#fff;
	}
</style>
