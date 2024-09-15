<template>
	<view>
		<view class="tip"><text>本店是实体店铺，如您对本店提供的服务有任何疑问或建议，请选择以下任一方式和本店联系：</text></view>
		<uni-list>
			<!-- <uni-list-item 
				:show-extra-icon="true"  
				:extra-icon="{
					color: '#cc0002',
					size: '22',
					type: 'shop'
				}" 
				clickable
				@click="goPersonal"
				title="在线客服" 
				showArrow
				rightText='立即联系'
			>
				<view class="chat-custom-right">
					<button size="mini" type="warn" plain>立即联系</button>
				</view>
			</uni-list-item> -->
			<uni-list-item :show-extra-icon="true" clickable @click="tel" :extra-icon="{
					color: '#666',
					size: '22',
					type: 'phone'
				}" showArrow rightText='拨打手机' title="手机">
			</uni-list-item>
			<uni-list-item :show-extra-icon="true" :extra-icon="{
					color: '#42b983',
					size: '22',
					type: 'weixin'
				}" :rightText='storeInfo.storeWechat' title="微信" />
		</uni-list>
		<view class="wx">
			<image mode="widthFix" style="width:100px;height:100px;" :src="wechatImage" @click="look()"></image>
			<view><text>使用微信扫一扫/长按识别二维码联系本店</text></view>
		</view>
	</view>
</template>

<script>
	import config from '@/common/config.js'
	import request from '@/common/request.js'
	export default {
		data() {
			return {
				baseURL: config.baseURL,
				userInfo: {},
				storeInfo: {},
				wechatImage: ''
			}
		},
		methods: {
			look() {
				uni.previewImage({
					urls: [this.wechatImage],
					current: [this.wechatImage]
				})

			},
			tel() {

				if (this.storeInfo.mobile == null || this.storeInfo.mobile === '') {
					uni.showToast({
						title: '商家未提供手机号',
						icon: 'error',
						duration: 1000
					});
					return;
				}

				uni.makePhoneCall({
					phoneNumber: this.storeInfo.mobile
				});
			},
			async getShopInfo() {
				const options = {
					url: `${config.baseURL}/service/store/getStoreById`,
					method: 'get',
					data: {
						id: getApp().globalData.currentShop.id
					}
				}
				const data = await request(options);
				this.wechatImage = config.baseURL + data.storeWechatCode;
				this.storeInfo = data;
			}

		},
		onLoad() {
			this.userInfo = getApp().globalData.userInfo;
			this.getShopInfo();
		}
	}
</script>

<style scoped lang='scss'>
	.tip {
		padding: 10px;
		background-color: #fff;
		font-size: 12px;
		color: #666;
	}

	.wx {
		text-align: center;
		padding: 10px 0;
		background-color: #fff;

		view {
			font-size: 12px;
			color: #666;
			margin-top: 5px;
		}
	}
</style>