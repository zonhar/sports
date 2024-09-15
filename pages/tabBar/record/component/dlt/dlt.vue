<template>
	<view style="padding-bottom:200px;">
		<uni-card is-full :is-shadow="false">
			<view>
				<text class="label" style="width:60px;">{{ orders[record.orderType] }}方案</text>
				<text class="desc">{{ scheduleStatus }}</text>
			</view>
			<view>
				<text class="label" style="width:60px;">方案号</text>
				<text style="margin-left:20px;font-weight:400">{{ record.maskLotteryId }}</text>
			</view>
			<view>
				<text class="label" style="width:60px;">是否传票</text>
				<image 
					v-if="record.pic"
					style="width: 30px; height: 30px;margin-left:20px; background-color: #eeeeee;" 
					mode="scaleToFill" 
					:src="`${config.baseURL}${record.pic}`"
					@click="openImg"
				>
				</image>
				<text v-else style="margin-left:20px;font-weight:400">未传票</text>
			</view>
			<view>
				<text class="label" style="width:60px;">是否中奖</text>
				<text v-if="record.openLottery==='{}' || !record.openLottery" style="margin-left:20px;font-weight:400">待开奖</text>
				<text v-else>
					<text v-if="record.isLottery===0" style="margin-left:20px;font-weight:400">未中奖</text>
					<text v-if="record.isLottery===1" style="margin-left:20px;font-weight:400">已中奖</text>
				</text>
			</view>
		</uni-card>

		<uni-card title="方案详情" :is-shadow="false" style="margin: 30rpx 0 0 0;padding:0;">
			<view class="flex">
				<view class="flex-item">
					<text>
						金额:
						<text class="amount">{{ record.lotteryAmount }}</text>
						元
					</text>
					<text>[{{ record.multiple }}]倍</text>
				</view>
				<view>
					<text v-if="record.isLottery===1">预计中奖奖金:<text style="color:red">{{record.winningAmount}}</text>元</text>
				</view>
				<!-- <view>
					<text>理论最高奖金:<text class="amount">{{maxAmount}}</text>元</text>
				</view> -->
			</view>
			<view>
				<text style="color:#019AFE">{{ orderTypes[record.lotteryType] }}</text>
				<text style="margin-left:10px;" class="amount">{{ record.customsClearanceMode }}</text>
			</view>

			<view style="margin-top: 10rpx;">
				<scroll-view scroll-y style="height: 850rpx;">
					<view v-for="(item, i) in this.lotteryOrderOdds">
						<uni-card>
							<text v-if="item.redFixed.length > 0">
								胆[
								<uni-badge v-for="(itemz, i) in item.redFixed" size="normal" class="uni-badge-left-margin" :text="itemz" />
								]
							</text>
							<uni-badge v-for="(itemz, i) in item.red" size="normal" class="uni-badge-left-margin" :text="itemz" />
							|
							<text v-if="item.blueFixed.length > 0">
								胆[
								<uni-badge v-for="(itemz, i) in item.blueFixed" type="primary" size="normal" class="uni-badge-left-margin" :text="itemz" />
								]
							</text>
							<uni-badge v-for="(itemz, i) in item.blue" type="primary" size="normal" class="uni-badge-left-margin" :text="itemz" />
						</uni-card>
					</view>
				</scroll-view>
			</view>
		</uni-card>
		<uni-popup ref="popup" type="center" border-radius="10px 10px 0 0">
			<view class="poup-container" style="width: 550rpx;height: 400rpx;">
				<view class="image-content"><image style="width: 550rpx;height: 400rpx; background-color: #eeeeee;" :src="src"></image></view>
			</view>
		</uni-popup>
		<OrderFooter v-if="showOrder" @confirmOrder="confirmOrder"></OrderFooter>
	</view>
</template>

<script>
import OrderFooter from '../OrderFooter.vue';
import config from '@/common/config.js';
import request from '@/common/request.js';
import _ from 'lodash';
import dayjs from 'dayjs';
import { orderTypes } from '@/common/util.js';
export default {
	components: {
		OrderFooter
	},
	data() {
		return {
			orderTypes,
			orders: ['订单', '推单', '合买', '保存'],
			scheduleStatus: '',
			current: 0,
			record: {},
			lotteryOrderOdds: [],
			list: [
				{
					name: '方案',
					value: 0
				},
				{
					name: '开奖',
					value: 1
				}
			],
			isOrderSource: false,
			src: '',
			config
		};
	},
	computed: {
		showOrder() {
			if (this.record.orderType === 3 && this.scheduleStatus.indexOf('方案已过官网停售时间') === -1) {
				return true;
			}
			if (this.record.orderType === 0 && !this.record.maskLotteryId) {
				return true;
			}
			return false;
		}
	},
	methods: {
		confirmOrder(isSendTicket) {
			uni.navigateTo({
				url:'/pages/tabBar/record/component/order/order'
			})
		},
		async submitOrder() {
			const data = await request({
				url: `${config.baseURL}/mobile/lotteryOrder/submitOrder`,
				method: 'post',
				data: { ...this.detailOptions, isSendTicket: this.isSendTicket, orderType: this.detailOptions.maskLotteryId ? 0 : this.detailOptions.orderType },
				loading: true,
				isSendTicket: this.isSendTicket,
				showSuccessToast: true,
				showErrorToast: true,
				successMsg: '提交成功'
			});
			uni.navigateTo({
				url: '/pages/choose/dlt'
			});
		},
		openImg() {
			if (this.record.pic !== null && this.record.pic !== '') {
				this.src = `${config.baseURL}` + this.record.pic;
				this.$refs.popup.open('center');
			} else {
				uni.showToast({
					title: '商家还没传票!',
					duration: 2000,
					icon: 'error'
				});
			}
		}
	},
	onLoad(options) {
		this.detailOptions = JSON.parse(JSON.stringify(getApp().globalData.detailOptions));
		let detailOptions = JSON.parse(JSON.stringify(this.detailOptions))
		let matchDates = [this.detailOptions.endDate];
		let info = this.detailOptions;
		for (let i = 0; i < info.lotteryOrderOdds.length; i++) {
			const lotteryOrderOdd = info.lotteryOrderOdds[i];
			try {
				const dltData = JSON.parse(lotteryOrderOdd.permutationNum);
				const odds = {
					red: [],
					redFixed: [],
					blue: [],
					blueFixed: []
				};

				if (dltData.redFixed.length == 0) {
					odds.red = dltData.red;
				} else {
					odds.red = dltData.red;
					odds.red = odds.red.filter(item => !dltData.redFixed.includes(item));
					odds.redFixed = dltData.redFixed;
				}

				if (dltData.blueFixed.length == 0) {
					odds.blue = dltData.blue;
				} else {
					odds.blue = dltData.blue;
					odds.blue = odds.blue.filter(item => !dltData.blueFixed.includes(item));
					odds.blueFixed = dltData.blueFixed;
				}

				this.lotteryOrderOdds.push(odds);
			} catch (e) {
				//TODO handle the exception
			}
		}

		// if(!options.isOrderSource == null || !options.isOrderSource === ''){
		// 	this.isOrderSource= true;
		// }
		// this.isOrderSource = info.isOrderSource;

		this.record = info;
		console.log('record', this.record);
		const arr = matchDates.map(date => new Date(date));
		const minDate = dayjs(Math.min.apply(null, arr)).format('YYYY-MM-DD HH:mm');
		const diffM = dayjs().diff(dayjs(minDate), 'minutes');
		if (diffM > 15) {
			this.scheduleStatus = '方案已过官网停售时间';
		} else {
			this.scheduleStatus = dayjs(minDate).format('MM-DD HH:mm') + ' 截止';
		}
		detailOptions.scheduleStatus = this.scheduleStatus
		getApp().globalData.detailOptions = detailOptions
	}
};
</script>

<style scoped>
.poup-container {
	padding-bottom: 100px;
	width: 500rpx;
	background-color: #fff;
}
.desc {
	/* font-size:13px; */
	/* color:#999; */
	font-weight: normal;
	margin-left: 20px;
}
.label {
	/* width:60px; */
	display: inline-block;
	color: #000;
}
.flex {
	display: flex;
	flex-direction: row;
	align-items: center;
}
.amount {
	color: red;
}
.flex-item {
	flex: 1;
}
.tip {
	padding: 8px 12px;
	background: #fbeee4;
	border: 1px solid #ffe3cd;
	font-size: 12px;
}
</style>
