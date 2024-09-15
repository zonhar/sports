<template>
	<view style="padding-bottom:200px;">
		<view>
			<uni-card is-full :is-shadow="false">
				<view>
					<text class="label" style="width:60px;">{{ orderTabs[record.orderType] }}方案</text>
					<text class="desc">{{ scheduleStatus }}</text>
				</view>
				<view>
					<text class="label" style="width:60px;">方案号</text>
					<text style="margin-left:20px;font-weight:400">{{ record.maskLotteryId }}</text>
				</view>
				<view v-if="record.isSendTicket === 0">
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
			<view style="margin-top: 10rpx;">
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
					</view>
					<view>
						<text style="color:#019AFE">{{ orderTypes[record.lotteryType] }}</text>
						<text style="margin-left:10px;" class="amount">{{ record.customsClearanceMode }}</text>
					</view>

					<scroll-view scroll-y style="height: 680rpx;">
						<view v-for="(item, i) in record.lotteryOrderOdds">
							<uni-card>
								<view style=" flex-direction: row; display: flex;">
									<!--第一位-->
									<view v-for="(itemz, i) in item.permutationNum.one"><uni-badge size="normal" class="uni-badge-left-margin" :text="itemz" /></view>

									<view v-for="(itemz, i) in item.permutationNum.two">
										|
										<uni-badge size="normal" class="uni-badge-left-margin" :text="itemz" />
									</view>

									<view v-for="(itemz, i) in item.permutationNum.three">
										|
										<uni-badge size="normal" class="uni-badge-left-margin" :text="itemz" />
									</view>

									<view v-for="(itemz, i) in item.permutationNum.four">
										|
										<uni-badge size="normal" class="uni-badge-left-margin" :text="itemz" />
									</view>

									<view v-for="(itemz, i) in item.permutationNum.five">
										|
										<uni-badge size="normal" class="uni-badge-left-margin" :text="itemz" />
									</view>

									<view v-for="(itemz, i) in item.permutationNum.six">
										|
										<uni-badge size="normal" class="uni-badge-left-margin" :text="itemz" />
									</view>

									<view v-for="(item, i) in item.permutationNum.seven">
										<uni-badge size="normal" type="primary" class="uni-badge-left-margin" :text="item" />
									</view>
								</view>
							</uni-card>
						</view>
					</scroll-view>
				</uni-card>
			</view>
		</view>
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
import { orderTypes, orderTabs } from '@/common/util.js';
import dayjs from 'dayjs';
import _ from 'lodash';
export default {
	components: {
		OrderFooter
	},
	data() {
		return {
			scheduleStatus: '',
			orderTypes,
			orderTabs,
			record: {},
			current: 0,
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
			config,
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
		},
		async confirmOrder(needTakePhone, needAgree) {
			uni.navigateTo({
				url:'/pages/tabBar/record/component/order/order'
			})
			// if (needTakePhone.length > 0) {
			// 	this.record.isSendTicket = 0;
			// } else {
			// 	this.record.isSendTicket = 1;
			// }
			// this.detailOptions.lotteryOrderOdds = this.detailOptions.lotteryOrderOdds.map(item => {
			// 	try {
			// 		item.permutationNum = JSON.stringify(item.permutationNum);
			// 	} catch (e) {
			// 		//TODO handle the exception
			// 	}

			// 	return item;
			// });
			// try {
			// 	const data = await request({
			// 		url: `${config.baseURL}/mobile/lotteryOrder/submitOrder`,
			// 		method: 'post',
			// 		data: { ...this.detailOptions, isSendTicket: this.record.isSendTicket, orderType: this.detailOptions.maskLotteryId ? 0 : this.detailOptions.orderType },
			// 		loading: true,
			// 		showSuccessToast: true,
			// 		successMsg: '下单成功'
			// 	});
			// 	uni.navigateBack({
			// 		delta: 1,
			// 		success: () => {
			// 			prevPage.$vm.init(); // 直接调用上个页面的刷新方法
			// 		}
			// 	});
			// } catch (e) {
			// 	console.log(e);
			// 	//TODO handle the exception
			// }
		}
	},
	onLoad(options) {
		this.detailOptions = JSON.parse(JSON.stringify(getApp().globalData.detailOptions));
		let detailOptions1 = JSON.parse(JSON.stringify(this.detailOptions))
		let matchDates = [this.detailOptions.endDate];
		this.isOrderSource = options.isOrderSource;
		let info = this.detailOptions;
		info.lotteryOrderOdds = info.lotteryOrderOdds.map(item => {
			try {
				item.permutationNum = JSON.parse(item.permutationNum);
			} catch (e) {
				//TODO handle the exception
			}
			return item;
		});

		this.isOrderSource = info.isOrderSource;
		this.record = info;
		console.log('七星彩', this.record);
		const arr = matchDates.map(date => new Date(date));
		const minDate = dayjs(Math.min.apply(null, arr)).format('YYYY-MM-DD HH:mm');
		const diffM = dayjs().diff(dayjs(minDate), 'minutes');
		if (diffM > 15) {
			this.scheduleStatus = '方案已过官网停售时间';
		} else {
			this.scheduleStatus = dayjs(minDate).format('MM-DD HH:mm') + ' 截止';
		}
		detailOptions1.scheduleStatus = this.scheduleStatus
		getApp().globalData.detailOptions = detailOptions1
	}
};
</script>

<style scoped lang="scss">
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
