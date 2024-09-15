<template>
	<view>
		<view class="block">
			<view class="block-tit">
				<text>店内账本数额</text>
				<uni-icons @click="goDetail('/pages/shop/shopTip3')" style="margin-left:5px;" type='help' size="22"
					color="#999999"></uni-icons>
				<text @click="goDetail('/pages/ledgerDetail/ledgerDetail')" class="ledger-detail">账本明细</text>
			</view>
			<view class="ledger-value">{{ parseFloat(resData.balance).toFixed(2) }}</view>
			<view class="ledger-btns">
				<button @click='goContact' style="flex:1;margin-right: 12px;" type="primary">联系店铺立即加账</button>
				<button @click="applyForClearingAccount" type="default" plain="true">申请清账</button>
				
				<uni-popup ref="popup" background-color="#fff">
					<view class="popup-content">
						<text class="hs">
							清帐申请确认
						</text>
						<view class="user-insert-line"></view>
						<view style="margin-top: 30rpx;">
							<text style="margin-top: 20rpx;">请选择你希望的清账方式:</text>
							<view class="uni-flex uni-column" >
							    <view class="flex-item flex-item-V" style="margin-top: 20rpx;">
									<label class="radio"></label>
										<uni-row style="margin-bottom: 10px;" :gutter="24">
											<uni-col :span="12">
												<view >
													<radio style="transform: scale(0.7);" value="wx" :checked="wxChecked" @click="checkClick('wx')" @change="checkClick('wx')"/>
													<image src="~@/static/icons/weixin.png" style="width: 35rpx;height: 35rpx;position: absolute;" mode="scaleToFill" />
													<text style="margin-left: 45rpx;color: #a5b1c2;">{{userZhData.wechat == null || userZhData.wechat == '' ? '未填账号' : userZhData.wechat }}</text>
												</view>
											</uni-col>
											<uni-col :span="7">
												<view>
													<text>
														<text  v-if="userZhData.wechatPaymentCode !==null && userZhData.wechatPaymentCode !== ''" style="color: #a5b1c2;">已传收款码</text>
														<text v-if="userZhData.wechatPaymentCode ==null || userZhData.wechatPaymentCode == ''" style="color: #a5b1c2;">未传收款码</text>
													</text>
													
												</view>
											</uni-col>
											<uni-col :span="3">
												<view >
													<text style="color: #019afe;"  @click="showInfo('wx')" >编辑</text>
												</view>
											</uni-col>
											
										</uni-row>
									
								</view>
								
							    <view class="flex-item flex-item-V">
									<label class="radio"></label>
										<uni-row style="margin-bottom: 10px;" :gutter="24">
											<uni-col :span="12">
												<view >
													<radio style="transform: scale(0.7);" value="aliPay" :checked="aliPayChecked" @click="checkClick('aliPay')" @change="checkClick('aliPay')"/>
													<image src="~@/static/icons/aliPay.png" style="width: 35rpx;height: 35rpx;position: absolute;" mode="scaleToFill" />
													<text style="margin-left: 45rpx;color: #a5b1c2;">
														{{userZhData.alipay == null || userZhData.alipay == '' ? '未填账号' : userZhData.alipay }}
													</text>
												</view>
											</uni-col>
											<uni-col :span="7">
												<view>
													<text style="color: #a5b1c2;">
														<text>
															<text  v-if="userZhData.alipayPaymentCode !==null && userZhData.alipayPaymentCode !== ''" style="color: #a5b1c2;">已传收款码</text>
															<text v-if="userZhData.alipayPaymentCode ==null || userZhData.alipayPaymentCode == ''" style="color: #a5b1c2;">未传收款码</text>
														</text>
													</text>
												</view>
											</uni-col>
											<uni-col :span="3">
												<view>
													<text style="color: #019afe;"  @click="showInfo('alipay')">编辑</text>
												</view>
											</uni-col>
											
										</uni-row>
									
								</view>
								
							    <view class="flex-item flex-item-V">
									<label class="radio"></label>
										<uni-row style="margin-bottom: 10px;" :gutter="24">
											<uni-col :span="19">
												<view >
													<radio style="transform: scale(0.7);" value="yl" :checked="ylChecked" @click="checkClick('yl')" @change="checkClick('yl')"/>
													<image src="~@/static/icons/yhk.png" style="width: 35rpx;height: 35rpx;position: absolute;" mode="scaleToFill" />
													<text style="margin-left: 45rpx;color: #a5b1c2;">
														{{userZhData.cardNo == null || userZhData.cardNo == '' ? '未添加银行卡' : userZhData.cardNo }}
													</text>
												</view>
											</uni-col>
											
											<uni-col :span="3">
												<view>
													<text style="color: #019afe;" @click="showInfo('yh')">编辑</text>
												</view>
											</uni-col>
											
										</uni-row>
									
								</view>
								
								<view class="flex-item flex-item-V">
									<label class="radio"></label>
									<uni-row style="margin-bottom: 10px;" :gutter="24">
										<uni-col :span="24">
											<view >
												<radio style="transform: scale(0.7);" value="xz" :checked="xzChecked" @click="checkClick('xz')" @change="checkClick('xz')"/>
												<image src="~@/static/icons/money.png" style="width: 35rpx;height: 35rpx;position: absolute;" mode="scaleToFill" />
												<text style="margin-left: 45rpx;color: #a5b1c2;">提交申请后请到柜台前找店员处理</text>
											</view>
										</uni-col>
									</uni-row>
								</view>
							</view>
						</view>
						
						<view style="margin-top: 30rpx;">
							<text style="margin-top: 20rpx;">请输入需要清帐的数值:</text>
							<view style="margin-top: 10rpx;">
								<uni-easyinput v-model='form.amount'  placeholder="请输入<=非礼金账本0.00" />
							</view>
						</view>
						<view style="margin-top: 10px;" class="button-group">
							<uni-row  :gutter="24">
								<uni-col :span="12">
									<button type="default"  @click="cancel()">取消</button>
								</uni-col>
								<uni-col :span="12">
									<button type="primary"  @click="submit()">提交清账申请</button>
								</uni-col>
							</uni-row>
						</view>
					</view>
					
				</uni-popup>
			</view>
		
			<view>
				<uni-popup ref="wxPopup" background-color="#fff">
					<view class="popup-content" style="height: 980rpx;">
						<text class="hs">
							编辑微信清账信息
						</text>
						<view class="user-insert-line"></view>
						
						<view class="tip">
							<text style="margin-left: 0rpx;margin-right: 0rpx;">
								为避免店铺为您处理清账时转错账，请您完善并确保所填信息正确。信息仅用于店铺清账和联系核验，未经您的同意不会用于其他用途。
							</text>
						</view>
						<view class="uni-flex uni-column" >
							 <view class="flex-item flex-item-V" style="margin-top: 100rpx;">
								 <form @submit="formSubmit" @reset="formReset">
									<view class="uni-form-item uni-column">
										<view class="title">账号</view>
										<input class="uni-input" v-model="wxInfo.wechat" placeholder="请输入微信账号" />
									</view>
									<view class="uni-form-item uni-column">
										<view class="title">收款码
										<text style="color: red;font-size: 25rpx;">&nbsp; &nbsp; 请上传保存的个人收款码（微信个人收款码的截图无法清账）</text>
										</view>
										
										<view>
											<uni-file-picker
												v-model="imageValue" 
												return-type="object"
												fileMediatype="image" 
												limit="1"
												mode="grid" 
												@select="select" 
												@progress="progress" 
												@success="success" 
												@fail="fail" 
											/>
										</view>
									</view>
								 	<view class="uni-form-item uni-column">
								 		<view class="title">姓名</view>
								 		<input class="uni-input" v-model="wxInfo.wechatName" placeholder="请输入姓名" />
								 	</view>
									<view style="margin-top: 10px;" class="button-group">
										<uni-row  :gutter="24">
											<uni-col :span="12">
												<button type="default"  @click="cancelWx()">取消</button>
											</uni-col>
											<uni-col :span="12">
												<button type="primary"  @click="submitWx()">保存</button>
											</uni-col>
										</uni-row>
									</view>
								 </form>
							 </view>
						</view>
					</view>
					<view>
						
					</view>
				</uni-popup>
			</view>
		
			
			<view>
				<uni-popup ref="aliPayPopup" background-color="#fff">
					<view class="popup-content" style="height: 980rpx;">
						<text class="hs">
							编辑支付宝清账信息
						</text>
						<view class="user-insert-line"></view>
						
						<view class="tip">
							<text style="margin-left: 0rpx;margin-right: 0rpx;">
								为避免店铺为您处理清账时转错账，请您完善并确保所填信息正确。信息仅用于店铺清账和联系核验，未经您的同意不会用于其他用途。
							</text>
						</view>
						<view class="uni-flex uni-column" >
							 <view class="flex-item flex-item-V" style="margin-top: 100rpx;">
								 <form @submit="formSubmit" @reset="formReset">
									<view class="uni-form-item uni-column">
										<view class="title">账号</view>
										<input class="uni-input" v-model="aliPayInfo.alipay" placeholder="请输入支付宝账号" />
									</view>
									<view class="uni-form-item uni-column">
										<view class="title">收款码
										<text style="color: red;font-size: 25rpx;">&nbsp; &nbsp; 请上传保存的个人收款码（支付宝个人收款码的截图无法清账）</text>
										</view>
										
										<view>
											<uni-file-picker
												v-model="imageValue" 
												return-type="object"
												fileMediatype="image" 
												limit="1"
												mode="grid" 
												@select="select" 
												@progress="progress" 
												@success="success" 
												@fail="fail" 
											/>
										</view>
									</view>
								 	<view class="uni-form-item uni-column">
								 		<view class="title">姓名</view>
								 		<input class="uni-input" v-model="aliPayInfo.alipayName" placeholder="请输入姓名" />
								 	</view>
									<view style="margin-top: 10px;" class="button-group">
										<uni-row  :gutter="24">
											<uni-col :span="12">
												<button type="default"  @click="cancelAliPay()">取消</button>
											</uni-col>
											<uni-col :span="12">
												<button type="primary"  @click="submitAliPay()">保存</button>
											</uni-col>
										</uni-row>
									</view>
								 </form>
							 </view>
						</view>
					</view>
					<view>
						
					</view>
				</uni-popup>
			</view>
			
			<view>
				<uni-popup ref="yhPopup" background-color="#fff">
					<view class="popup-content" style="height: 720rpx;">
						<text class="hs">
							编辑银行卡清账信息
						</text>
						<view class="user-insert-line"></view>
						
						<view class="tip">
							<text style="margin-left: 0rpx;margin-right: 0rpx;">
								<text>
									请尽量填写
									<text style="color: red;">，以避免转账额度、金额使用等受到限制。</text>
									，以避免转账额度、金额使用等受到限制。
								</text>
								<p>为避免店铺为您处理清账时转错账，请您完善并确保所填信息正确。信息仅用于店铺清账和联系核验，未经您的同意不会用于其他用途。</p>
							</text>
						</view>
						<view class="uni-flex uni-column" >
							 <view class="flex-item flex-item-V" style="margin-top: 180rpx;">
								 <form @submit="formSubmit" @reset="formReset">
									<view class="uni-form-item uni-column">
										<view class="title">银行名称</view>
										<input class="uni-input" v-model="ykInfo.bank" placeholder="请输入银行名称" />
									</view>
									
								 	<view class="uni-form-item uni-column">
								 		<view class="title">银行卡</view>
								 		<input class="uni-input" v-model="ykInfo.cardNo" placeholder="请输入银行卡号" />
								 	</view>
									<view style="margin-top: 10px;" class="button-group">
										<uni-row  :gutter="24">
											<uni-col :span="12">
												<button type="default"  @click="cancelYh()">取消</button>
											</uni-col>
											<uni-col :span="12">
												<button type="primary"  @click="submitYh()">保存</button>
											</uni-col>
										</uni-row>
									</view>
								 </form>
							 </view>
						</view>
					</view>
					<view>
						
					</view>
				</uni-popup>
			</view>
		</view>
		
		

		<view class="block" style="padding:12px 0;">
			<view class="block-title"><text>店内账本说明</text></view>
			<view class="explain-text">
				本店是实体店,利润微薄,概不赊账。由于本店店员是一对多服务，店内需要出票的顾客较多，每个顾客在柜台付款时店员收款找零、店员出票后顾客核对选号会占用大量时间。因此，店内服务高峰期及销售临场前，您在柜台排队付款时，可能会错过销售时间，导致无法为您成功出票。
			</view>
		</view>

		<view class="block" style="padding:12px 0;">
			<view class="block-title"><text>礼金说明</text></view>
			<view class="amount-text">
				<view><text>1、礼金可用于本店消费，在本店消费优先扣除礼金</text></view>
				<view><text>2、为了规范记账行为，礼金暂不支持清账</text></view>
				<view><text>3、本店诚信经营，如有疑问可联系店小二处理</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	import config from '@/common/config.js'
	import { getUserInfo, getCurrentShop } from '../../../common/util';
	
	export default {
		data() {
			return {
				resData: {
					balance: 0.00
				},
				showSubPage: false,
				alipayAccount: '',
				wechatAccount: '',
				bankAccount: '',
				otherAccount: '',
				wxChecked: false,
				aliPayChecked: false,
				ylChecked: false,
				xzChecked: false,
				userZhData: {
					wechat: ''
				},
				form: {
					storeId: null,
					userId: null,
					dealType: null,
					amount: null
				},
				imageValue:[],
				wxInfo: {
					id: null,
					userId: null,
					wechat: null,
					wechatPaymentCode: null,
					wechatName: null
				},
				aliPayInfo: {
					id: null,
					userId: null,
					alipay: null,
					alipayPaymentCode: null,
					alipayName: null
				},
				ykInfo: {
					id: null,
					userId: null,
					bank: null,
					cardNo: null
				}
			}
		},
		methods: {
			// 获取上传状态
			select(e){
				uni.uploadFile({
					url: `${config.baseURL}/service/upload`,
					filePath: e.tempFilePaths[0],
					fileType: 'image',
					name: 'file',
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`
					},
					success: (res) => {
						if(res.code == 401 || res.code == 500){
							uni.showModal({
								content: '上传失败',
								showCancel: false
							})
						}else {
							const url = `${config.baseURL}` + JSON.parse(res.data).fileName;
							const file =[
								{
									"name":"file.txt",
									"extname":"txt",
									"url":url,
								}
							];
							this.imageValue = file;
							this.wxInfo.wechatPaymentCode = JSON.parse(res.data).fileName;
							this.aliPayInfo.alipayPaymentCode = JSON.parse(res.data).fileName;
							uni.showToast({
								title: '上传成功',
								icon: 'success',
								duration:1000
							})
						}
						
					},
					fail: (err) => {
						uni.showModal({
							content: '上传失败',
							showCancel: false
						})
					}
				})
			},
						// 获取上传进度
			progress(e){
				// console.log('上传进度：',e)
			},
						
			// 上传成功
			success(e){
				//this.$refs.files.upload()
				// console.log('上传成功')
			},
						
			// 上传失败
			fail(e){
					// 判断是否允许调用摄像头
					uni.getSetting({
						success: (res) => {
						let authStatus = res.authSetting['scope.album'];
							if (!authStatus) {
								uni.showModal({
								title: '授权失败',
									content: '需要从您的相册获取图片，请在设置界面打开相关权限',
									success: (res) => {
										if (res.confirm) {
											uni.openSetting()
										}
									}
								})
							}
						}
				})
			},
			showInfo(type){
				if('wx' === type){
					this.wxInfo.id = this.userZhData.id;
					this.wxInfo.userId = getUserInfo()?.userId;
					this.wxInfo.wechat = this.userZhData.wechat;
					this.wxInfo.wechatName = this.userZhData.wechatName
					if(this.userZhData.wechatPaymentCode){
						const url = `${config.baseURL}` + this.userZhData.wechatPaymentCode;
						const file =[
							{
								"name":"file.txt",
								"extname":"txt",
								"url":url,
							}
						];
						this.imageValue = file;
						this.wxInfo.wechatPaymentCode = this.userZhData.wechatPaymentCode;
					}
					this.$refs.wxPopup.open('bottom');
				}else if('alipay' === type){
					this.aliPayInfo.id = this.userZhData.id;
					this.aliPayInfo.userId = getUserInfo()?.userId;
					this.aliPayInfo.alipay = this.userZhData.alipay;
					this.aliPayInfo.alipayName = this.userZhData.alipayName


					if(this.userZhData.alipayPaymentCode){
						const url = `${config.baseURL}` + this.userZhData.alipayPaymentCode;
						const file =[
							{
								"name":"file.txt",
								"extname":"txt",
								"url":url,
							}
						];
						this.imageValue = file;
						this.aliPayInfo.alipayPaymentCode = this.userZhData.alipayPaymentCode;
					}
					this.$refs.aliPayPopup.open('bottom');
				}else if('yh' === type){
					this.ykInfo.id = this.userZhData.id;
					this.ykInfo.userId = getUserInfo()?.userId;
					this.ykInfo.bank = this.userZhData.bank;
					this.ykInfo.cardNo = this.userZhData.cardNo;
					this.$refs.yhPopup.open('bottom');
				}
				
				
			},
			submitWx(){
				this.updateCustomer(this.wxInfo,'wx');
			},
			submitAliPay(){
				this.updateCustomer(this.aliPayInfo,'aliPay');
			},
			submitYh(){
				this.updateCustomer(this.ykInfo,'yh');
			},
			cancelWx(){
				this.$refs.wxPopup.close();
			},
			cancelAliPay() {
				this.$refs.aliPayPopup.close();
			},
			cancelYh(){
				this.$refs.yhPopup.close();
			},
			submit(){
				if(this.form.dealType == null || this.form.dealType === ''){
					uni.showToast({
						title: '请选择清账方式',
						//将值设置为 success 或者直接不用写icon这个参数
						icon: 'error',
						//显示持续时间为 2秒
						duration: 2000
					});
					return ;
				}
				if(this.form.dealType == 0 && (this.userZhData.wechat == null || this.userZhData.wechat === '')){
					uni.showModal({
					    title: '提示',
					    content: '未填微信账号，编辑填写后可更快为你处理清账',
					    success: function (res) {
					         that.$refs.wxPopup.open('bottom');
					    }
					});
					return ;
				}else if(this.form.dealType == 1 && (this.userZhData.alipay == null || this.userZhData.alipay === '')){
					uni.showModal({
					    title: '提示',
					    content: '未填支付宝账号，编辑填写后可更快为你处理清账',
					    success: function (res) {
					         that.$refs.wxPopup.open('bottom');
					    }
					});
					return ;
				}else if(this.form.dealType == 2 && (this.userZhData.cardNo == null || this.userZhData.cardNo === '')){
					uni.showModal({
					    title: '提示',
					    content: '未填银行卡号，编辑填写后可更快为你处理清账',
					    success: function (res) {
					         that.$refs.wxPopup.open('bottom');
					    }
					});
					return ;
				}
				
				if(this.form.amount == null || this.form.amount === ''){
					uni.showToast({
						title: '请填写清账数值',
						//将值设置为 success 或者直接不用写icon这个参数
						icon: 'error',
						//显示持续时间为 2秒
						duration: 2000
					});
					return ;
				}
				
				if(this.resData.balance <= 0){
					uni.showToast({
						title: '清账数值不足',
						icon: 'error',
						//显示持续时间为 2秒
						duration: 2000
					});
					return ;
				}
				
				if(this.form.amount > this.resData.balance){
					uni.showToast({
						title: '清账数值不足',
						icon: 'error',
						//显示持续时间为 2秒
						duration: 2000
					});
					return ;
				}
				
				this.sendWithdrawa();
			},
			async sendWithdrawa(){
				this.form.userId = getUserInfo()?.userId;
				this.form.storeId = getCurrentShop()?.id;
				const options = {
					url: `${config.baseURL}/service/audit/withdrawa`,
					method: 'post',
					data: this.form
				};
				const data = await request(options);
				if(data == true){
					uni.showToast({
						title: '提现已提交，请等待审核通过',
						icon: 'success',
						duration:1000
					})
					this.$refs.wxPopup.close();
					this.$refs.aliPayPopup.close();
					this.$refs.yhPopup.close();
					this.$refs.popup.close();
				}else {
					uni.showToast({
						title: '提现失败，请到门店店员处理',
						icon: 'error',
						duration:1000
					})
				}
				
			},
			checkClick(name){
				const that = this;
				if('wx' === name){
					this.wxChecked = true;
					this.form.dealType = 0;
					this.aliPayChecked = false;
					this.ylChecked =false;
					this.xzChecked =false;
					if(this.userZhData.wechat == null || this.userZhData.wechat === ''){
						uni.showModal({
						    title: '提示',
						    content: '未填微信账号，编辑填写后可更快为你处理清账',
						    success: function (res) {
						         that.$refs.wxPopup.open('bottom');
						    }
						});
					}
				}else if('aliPay' === name){
					this.form.dealType = 1;
					this.wxChecked = false;
					this.aliPayChecked = true;
					this.ylChecked =false;
					this.xzChecked =false;
					if(this.userZhData.alipay == null || this.userZhData.alipay === ''){
						uni.showModal({
						    title: '提示',
						    content: '未填支付宝账号，编辑填写后可更快为你处理清账',
						    success: function (res) {
						         that.$refs.aliPayPopup.open('bottom');
						    }
						});
					}
				}else if('yl' === name){
					this.form.dealType = 2;
					this.wxChecked = false;
					this.aliPayChecked = false;
					this.ylChecked =true;
					this.xzChecked =false;
					if(this.userZhData.cardNo == null || this.userZhData.cardNo === ''){
						uni.showModal({
						    title: '提示',
						    content: '未填银行卡，编辑填写后可更快为你处理清账',
						    success: function (res) {
						         that.$refs.yhPopup.open('bottom');
						    }
						});
					}
				}else if('xz' === name){
					this.form.dealType = 3;
					this.wxChecked = false;
					this.aliPayChecked = false;
					this.ylChecked =false;
					this.xzChecked =true;
				}
			},
			cancel(){
				this.$refs.popup.close();
			},
			goContact() {
				uni.navigateTo({
					url: '/pages/service/service'
				})
			},
			goDetail(url) {
				uni.navigateTo({
					url
				})
			},
			applyForClearingAccount() {
				this.getCustomerExtendedByUserId();
				this.$refs.popup.open('bottom');
			},
			async updateCustomer(wxInfo,type){
				const options = {
					url: `${config.baseURL}/service/customer/updateCustomerExtended`,
					method: 'post',
					data: wxInfo
				};
				const data = await request(options);
					if(data){
						this.$refs.wxPopup.close();
						this.$refs.aliPayPopup.close();
						this.$refs.yhPopup.close();
						this.getCustomerExtendedByUserId();
						uni.showToast({
							title: '保存成功',
							icon: 'success',
							duration:1000
						})
					}else {
						uni.showToast({
							title: '保存失败',
							//将值设置为 success 或者直接不用写icon这个参数
							icon: 'error',
							//显示持续时间为 2秒
							duration: 2000
						});
					}
			},
			async getCustomerExtendedByUserId(){
				const options = {
					url: `${config.baseURL}/service/customer/getCustomerExtendedByUserId`,
					method: 'get',
					data: {
						userId:  getUserInfo()?.userId
					}
				}
				const data = await request(options);
				this.userZhData = data;
			},
			async getFunds() {
				const options = {
					url: `${config.baseURL}/service/fundsTable/getFunds`,
					method: 'post',
					data: {
						"storeId": getCurrentShop()?.id,
						"userId": getUserInfo()?.userId
					}
				}
				const data = await request(options);
				this.resData = data
				getApp().globalData.balance = data.balance
			}
		},
		onLoad() {
			this.getFunds();	
		},
		onShow(){
			this.getFunds();	
		},
		onTabItemTap () {
			this.$refs.wxPopup.close();
			this.$refs.aliPayPopup.close();
			this.$refs.yhPopup.close();
			this.$refs.popup.close();
		}
	}
</script>

<style scoped lang="scss">
	.block {
		background-color: #ffffff;
		padding: 12px;
		margin-bottom: 12px;
	}

	.block-tit {
		display: flex;
		flex-direction: row;
		align-items: center;

		text {
			font-size: 16px;
		}
	}
	.uni-form-item .title {
		padding: 20rpx 0;
	}
	.ledger-detail {
		flex: 1;
		text-align: right;
		color: #2196F3;
	}

	.ledger-value {
		padding: 25px 0;
		font-size: 32px;
		color: #333333;
	}

	.ledger-btns {
		display: flex;
		flex-direction: row;
		align-items: center;

		button {
			font-size: 15px;
		}

	}

	.block-title {
		padding: 0 12px 12px 12px;
		font-size: 14px;
		color: #333333;
		border-bottom: 1px solid #f5f5f5;
	}

	.explain-text {
		padding: 10px;
		line-height: 24px;
		text-indent: 2em;
	}

	.amount-text {
		padding: 10px;
	}

	.ledger-sub-page {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 70vh; //页面的高度设置为屏幕高度的一半
		background-color: #fff;
	}

	.page-title {
		text-align: center;
		font-size: 20px;
		padding: 10px 0;
		border-bottom: 1px solid #333;
	}

	.underline {
		width: 100%;
		height: 0.05px;
		background-color: #fff;
	}
	.subtitle {
	    text-align: left;
	    font-size: 18px;
	    padding: 10px, 0;
	}
	
	.payment-method {
	    width: 100%;
	    padding: 10px;
	    border: 1px solid #ddd;
	    border-radius: 5px;
	    margin-bottom: 10px;
	}
	.popup-content {
		//@include flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		height: 750rpx;
		background-color: #fff;
	}
	.hs {
		    text-align: center;
			flex: auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size:32rpx;
			font-weight:bold;
			height: 40rpx;
			width: 700rpx;
				
	}
	.user-insert-line::before {
	    position: absolute;
	    right: 0rpx;
	    bottom: 0;
	    top: 100rpx;
	    left: 0px;
	    height: 1px;
	    content: '';
	    -webkit-transform: scaleY(.5);
	    transform: scaleY(.5);
	    background-color: #c8c7cc;
	}
	.tip{
		position: absolute;
		width: 700rpx;
		margin-top: 30rpx;
		background-color: #fff;
		font-size:25rpx;
		color:#666;
		background-color: #ecf5fc;
	}
</style>