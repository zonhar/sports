<template>
	<view class="page-content">
		<scroll-view scroll-y="true" :style="{paddingBottom:'90px'}">
			<!-- <view><uni-notice-bar style="margin-bottom:0;" show-icon :text="lottery.desc" /></view> -->
			<view class="prize-tit">
				<text>第{{info.lottery_no}}期<text class="red">{{formats(dayjs(info.itou_end_time).unix())}} {{dayjs(info.itou_end_time).format('HH:mm')}}</text>截止 </text>
			</view>
			<button-group
				ref="buttonGroupRef"
				:buttons="buttons"
				unactiveBackgroundColor='#fff'
				unactiveColor='#cc0002'
				@change="change"
			>
			</button-group>

			<view class="wraps">
				<view class="wraps-item" v-for="(item,index) in selectedList" :key="index">
					<uni-icons @click="delSelect(index)" style="margin-right:10px;" type='closeempty' size="20" color="#666"></uni-icons>
					<view class="wraps-subItem" v-for="(subItem,subIndex) in item.data" :key="subIndex">
						<!-- 排列5 -->
						<template v-if="item.lotteryType===10">
							<view class="circle" v-for="grand in subItem?.permutationNum?.one">{{grand}}</view>
							<view class="bor"></view>
							<view class="circle" v-for="grand in subItem?.permutationNum?.two">{{grand}}</view>
							<view class="bor"></view>
							<view class="circle" v-for="grand in subItem?.permutationNum?.three">{{grand}}</view>
							<view class="bor"></view>
							<view class="circle" v-for="grand in subItem?.permutationNum?.four">{{grand}}</view>
							<view class="bor"></view>
							<view class="circle" v-for="grand in subItem?.permutationNum?.five">{{grand}}</view>
						</template>
						<!-- 七星彩 -->
						<template v-if="item.lotteryType===8">
							<view class="circle" v-for="grand in subItem?.permutationNum?.one">{{grand}}</view>
							<view class="bor"></view>
							<view class="circle" v-for="grand in subItem?.permutationNum?.two">{{grand}}</view>
							<view class="bor"></view>
							<view class="circle" v-for="grand in subItem?.permutationNum?.three">{{grand}}</view>
							<view class="bor"></view>
							<view class="circle" v-for="grand in subItem?.permutationNum?.four">{{grand}}</view>
							<view class="bor"></view>
							<view class="circle" v-for="grand in subItem?.permutationNum?.five">{{grand}}</view>
							<view class="bor"></view>
							<view class="circle" v-for="grand in subItem?.permutationNum?.six">{{grand}}</view>
							<view class="bor"></view>
							<view class="circle circle-blue" v-for="grand in subItem?.permutationNum?.seven">{{grand}}</view>
						</template>
						<!-- 大乐透 -->
						<template v-if="item.lotteryType===7">
							<view style="margin-top:7px;" v-if="subItem?.permutationNum?.redFixed.length>0">[胆:</view>
							<view class="circle" v-for="grand in subItem?.permutationNum?.redFixed">{{grand}}</view>
							<view style="margin-top:7px;" v-if="subItem?.permutationNum?.redFixed.length>0">]</view>
							<view class="circle" v-for="grand in subItem?.permutationNum?._red">{{grand}}</view>
							<view style="margin-top:7px;" v-if="subItem?.permutationNum?.blueFixed.length>0">[胆:</view>
							<view class="circle circle-blue" v-for="grand in subItem?.permutationNum?.blueFixed">{{grand}}</view>
							<view style="margin-top:7px;" v-if="subItem?.permutationNum?.blueFixed.length>0">]</view>
							<view class="circle circle-blue" v-for="grand in subItem?.permutationNum?._blue">{{grand}}</view>
						</template>
					</view>
				</view>
			</view>

		</scroll-view>
		<view class="opt-wrap">
			<view style="font-size:14px;padding:10px;text-align: center; position: relative;">
				<view>共<text class="red">{{amountValue}}</text>元</view>
				<view class="append" v-if="lotteryType===7">
					<uni-data-checkbox v-model="isAppend" multiple :localdata="appendData" @change="appendChange"></uni-data-checkbox>
					<uni-icons @click="tip" type="help" size="16" color="#999"></uni-icons>
				</view>
			</view>
			<view class="btns">
				<view class="scale-block">
					<uni-number-box :min="1" :max="50000" :width="60" :value="scaleValue" @change="changeNumBox" />
					<text>倍</text>
				</view>
				<view style="flex:1"></view>
				<view class="btns-item" @click="submitOrder(3)">保存</view>
				<view @click="submitOrder(0)" class="btns-item btns-next">下一步</view>
			</view>
		</view>
		<uni-popup ref="popup" :mask-click="false">
			
				<view class="tit-tip"><text>大乐透追加规则</text></view>
			<view class="tip-content">
				<view>
					<text>
						在基本投注的基础上可进行追加投注，每注追加金额为人民币1元，如追加投注中得浮动奖，则追加投注单注奖金为当期基本投注对应单注奖金的80%。
					</text>
				</view>
				<view style="margin-top:10px;">
					<text>例:</text>
				</view>
				<view>
					<table border>
						<tr>
							<th>浮动奖级</th>
							<th>不追加奖金</th>
							<th>追加后奖金</th>
						</tr>
						<tr>
							<td>一等奖</td>
							<td>500万</td>
							<td>900万</td>
						</tr>
						<tr>
							<td>二等奖</td>
							<td>10万</td>
							<td>18万</td>
						</tr>
					</table>
				</view>
			</view>
			
			<view class="footer-tip" @click="close"><text style="color:#019AFE">知道了</text></view>	
		</uni-popup>
	</view>
</template>

<script>
	import request from '../../common/request.js';
	import dayjs from 'dayjs';
	import {formatNumber,formats,factorials,getUserInfo,getCurrentShop} from '../../common/util.js'
	import config from '@/common/config.js'
	import buttonGroup from '../component/button-group/button-group.vue';
	import _ from 'lodash'
	export default {
		data() {
			return {
				isAppend:[],
				appendData:[{text:'追加',value:1}],
				_,
				selectedList: [],
				buttons: [
					{
					  title: '继续添加',
					},
					{
					  title: '机选5注',
					},
					{
					  title: '机选1注',
					},
					{
					  title: '清空',
					},
				],
				tabIndex:0,
				optTabIndex:0,
				formats,
				dayjs,
				scaleValue:1,
				iStatusBarHeight: 0,
				info:{},
				lotteryType:''

			}
		},
		components:{
			buttonGroup
		},
		computed:{
			scrollHeight(){
				const tHeight = (this.iStatusBarHeight + 460) + 'px'
				const data =  window.innerHeight - tHeight
				return data
			},
			amountValue(){
				let sum = this.selectedList.reduce(function (prev, cur) {
					return prev + cur.amount;
				},0);
				return (this.lotteryType===7 && this.isAppend[0]) ? (sum+sum/2)*this.scaleValue:sum*this.scaleValue
			},
			permutationThreeType(){
				if(this.optTabIndex===0){
					return '1'
				}
				if(this.optTabIndex===1){
					return '2'
				}
				return '1'
			}
		},
		watch:{
			selectedList:{
				handler:function(val){
					uni.setStorageSync(`selectedList${this.lotteryType}`,val || [])
				}
			}
		},
		methods: {
			tip(){
				this.$refs.popup.open('center')
			},
			close(){
				this.$refs.popup.close()
			},
			makeRandom(arr,maxV=35){
				let val = Math.ceil(Math.random() * maxV);
				if(arr.includes(val)){
					return this.makeRandom(arr,maxV)
				}
				return val;
			},
			async submitOrder(orderType){
				if(this.selectedList.length===0){
					uni.showToast({
						title:'请至少选中一注号码',
						icon:'none'
					})
					return
				}

				let options = {
					userId: getUserInfo()?.userId,
					userName: getUserInfo()?.userName,
					storeId: getCurrentShop()?.id,
					lotteryAmount: this.amountValue,
					payType:1,
					orderType,
					endDate:this.endDate,
					lotteryType:this.lotteryType,
					multiple: this.scaleValue,
					customsClearanceMode: '',
					periods:this.info.lottery_no,
					isOrderSource: true,
					lotteryOrderOdds:this.selectedList.map(item=>{
						return  {
							permutationFiveType: item.permutationFiveType,
							permutationNum:JSON.stringify(item.data[0].permutationNum)
						}
					}),
				}
				
				
				
				if(this.lotteryType===7){
					options.isAppend = this.isAppend[0]?1:0
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
					//保存成功，清理已选项
					try{
						uni.removeStorageSync(`selectedList${this.lotteryType}`)
					}catch(e){
						//TODO handle the exception
					}
					
					if(options.lotteryType === 7){
						uni.navigateTo({
						  url: '/pages/tabBar/record/component/dlt/dlt',
						})
					}else if(options.lotteryType === 8){
						uni.navigateTo({
						  url: '/pages/tabBar/record/component/qxc/qxc',
						})
					}else if(options.lotteryType === 10){
						uni.navigateTo({
						  url: '/pages/tabBar/record/component/pl5/pl5',
						})
					}
				}else{
					getApp().globalData.detailOptions= {...options}
					uni.navigateTo({
						url: `/pages/tabBar/record/component/order/order?lotteryType=${this.lotteryType}`
					});
				}
				
				
				
			},
			appendRandom(n){
				let arr = []
				for(let i=0;i<n;i++){
					let r1 = Math.floor(Math.random() * 10)
					let r2 = Math.floor(Math.random() * 10)
					let r3 = Math.floor(Math.random() * 10)
					let r4 = Math.floor(Math.random() * 10)
					let r5 = Math.floor(Math.random() * 10)
					let r6 = Math.floor(Math.random() * 10)
					let r7 = Math.floor(Math.random() * 10)
					if(this.lotteryType===7){
						r1 = this.makeRandom([])
						r2 = this.makeRandom([r1])
						r3 = this.makeRandom([r1,r2])
						r4 = this.makeRandom([r1,r2,r3])
						r5 = this.makeRandom([r1,r2,r3,r4])
						r6 = this.makeRandom([],12)
						r7 = this.makeRandom([r6],12)
					}
					arr.push({
						lotteryType:this.lotteryType,
						amount:2,
						permutationThreeType:8,
						data:[
							{
								permutationNum:this.lotteryType===10?{
									one:[r1],
									two:[r2],
									three:[r3],
									four:[r4],
									five:[r5]
								}:(this.lotteryType===8?{
									one:[r1],
									two:[r2],
									three:[r3],
									four:[r4],
									five:[r5],
									six:[r6],
									seven:[r7],
								}:{
									red:[r1,r2,r3,r4,r5],
									_red:[r1,r2,r3,r4,r5],
									redFixed:[],
									blue:[r6,r7],
									_blue:[r6,r7],
									blueFixed:[],
								})
							}
						],
					})
				}
				return arr
			},
			delSelect(index){
				this.selectedList.splice(index,1)
				uni.setStorageSync(`selectedList${this.lotteryType}`,this.selectedList)
			},
			clearAll(){
				uni.removeStorageSync(`selectedList${this.lotteryType}`)
			},
			change(index){
				if(index===3){
					this.selectedList = []
					this.clearAll()
				}
				if(index===2){
					const data = this.appendRandom(1)
					data.map(item=>{
						this.selectedList.push(item)
					})
					uni.setStorageSync(`selectedList${this.lotteryType}`,this.selectedList)
				}
				if(index===1){
					const data = this.appendRandom(5)
					data.map(item=>{
						this.selectedList.push(item)
					})
					uni.setStorageSync(`selectedList${this.lotteryType}`,this.selectedList)
				}
				if(index===0){
					uni.navigateBack()
				}
			},

			changeNumBox(value){
				this.scaleValue=value
			},

			async findList(){
				let url = `platform=koudai_mobile&_prt=https&ver=20180101000000&lottery_type=P3&station_user_id=54275526&station_uuid=b9cfdcrpfsj3fd1661155817&t=254689&_=1713826090148`
				const data = await request({
					url:'/api/shuzi/infocurrent?'+url,
					method:'POST',
					data:{},
					showLoading:true,
				})
				this.info = data
			},

			init(){
				this.findList()
			},
			handleSelectedList(){
				const lotteryType = uni.getStorageSync('lotteryType')
				this.lotteryType = lotteryType
				this.selectedList = uni.getStorageSync(`selectedList${lotteryType}`) || []

				const amountValue = uni.getStorageSync('amountValue')
				this.endDate = uni.getStorageSync('endDate')
				let result = uni.getStorageSync('lotteryOrderOdds');
				if(!result){
					return
				}
				result[0].permutationNum = JSON.parse(result[0].permutationNum)
				if(this.lotteryType===7){
					result[0].permutationNum._red = _.difference(result[0].permutationNum.red,result[0].permutationNum.redFixed)
					result[0].permutationNum._blue = _.difference(result[0].permutationNum.blue,result[0].permutationNum.blueFixed)
				}
				this.selectedList.push({lotteryType,data:result,amount:amountValue})
				//删除缓存
				uni.removeStorageSync('lotteryOrderOdds');
			}
		},
		onShow(){
			this.init()
			this.handleSelectedList()
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;

		},
	}
</script>

<style scoped lang="scss">
.wraps{
	background-color: #fff;
	padding:0 10px;
}
.wraps-item{
	display: flex;
	flex-direction: row;
	align-items: center;
	// padding:5px 0;
	border-bottom:1px dashed #ddd;
	// margin-bottom: 5px;
}
.wraps-subItem{
	display: flex;
	flex-direction: row;
	// padding:5px 0;
	flex-wrap:wrap;
	text-align: center;
	justify-content: center;
}
.bor{
	border-right: 1px solid #ddd;
}
.bor:last-child{
	border-right:0;
}
.page-content{
	height:100%;
}
.nav-bar{
	position: fixed;
	top:0;
	left:0;
	width:100%;
	z-index:1000;
	height:48px;
	background-color: #cc0002;
}

.content{
	padding:0 10px;
}
// .active{
// 	background-color: #cc0002!important;
// 	text{
// 		color:#fff;
// 	}
// }

.opt-wrap{
	background-color: #fff;
	position:fixed;
	left:0;
	bottom:0;
	z-index:100;
	width:100%;
	box-sizing: border-box;
	border-top:1px solid #ddd;
	.select-tip{
		display: flex;
		padding:10px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size:12px;
		color:#999;
		.title{
			font-size:13px;
			color: red;
		}
	}
	.select-info{
		display: flex;
		flex-direction: row;
		align-items: center;
		padding:5px 10px;
		.flag-box{
			padding:3px 10px;
			border:1px solid #ddd;
			border-radius:3px;
		}
		.text{
			font-size:12px;
		}
		.select-amount{
			flex:1;
			text-align: center;
			display: flex;
			flex-direction: column;
			text-align:right;

			.amount-tit{
				font-size:15px;
				text{
					color:red;
					font-weight:bold;
					font-size:17px;
					margin: 0 3px;
				}
			}
			.amount-desc{
				font-size:14px;
				text{
					text-decoration: underline;
					color:red;
				}
			}
		}

	}
	.btns{
		display: flex;
		flex-direction: row;
		align-items:center;
		// border-top:1px solid #ddd;
		.btns-item{
			padding:10px;
			text-align: center;
			font-size:15px;
			color:#333;
			background-color: #f2f2f2;
			border-left:1px solid #ddd;
		}
		.btns-prize{
			flex:1;
			color:#666;
			background-color: #fff;
		}
		.btns-next{
			background-color: #cc0002;
			color:#fff;
			width:110px;
			font-size:15px;
		}
	}
}
.uni-collapse .content{
	background-color: #f2f2f2;
	padding:10px 10px 0 10px;
}
::v-deep .uni-collapse-item__title-box{
	height:40px;
	line-height:40px;
}
.tit{
	margin-bottom:10px;
}

.red{
	color:red;
}
.opt{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding:5px 10px 0 10px;
	.opt-tab{
		flex:1;
		display: flex;
		flex-direction: row;
		align-items: center;
		view{
			padding:5px 0;
			border-bottom:2px solid #f2f2f2;
			margin-right:10px;
		}
		view.active{
			color:#cc0002;
			border-bottom:2px solid #cc0002;
		}
	}

	.opt-btn{
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align:right;
		justify-content: flex-end;
	}
}

.prize-tit{
	padding:10px 0;
	background-color: #fff;
	text-align:center;
}
.seven-container{
	flex:1;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.titbar{
	padding:10px 0 0 120px;
	background-color: #fff;

}
.scale-block{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 10px;
	// margin-left: 15px;
	text{
		margin-left:5px;
	}
}
.circle{
	 width:24px;
	 height:24px;
	 line-height:24px;
	 background-color: #cc0002;
	 text-align: center;
	 color:#fff;
	 border-radius:50%;
	 margin:8px;
}
.circle-blue{
	background-color: #017CDE;
}
.append{
	display: flex;
	flex-direction: row;
	align-items: center;
	position:absolute;
	right:10px;
	top:0;
	height:40px;
	line-height:40px;
	:deep(.uni-data-checklist .checklist-group .checklist-box){
		margin-right: 0;
	}
}
.tip-content{
	background-color: #fff;
	padding:10px 20px;
}
.footer-tip{
	padding:10px 0;
	border-top:1px solid #f5f5f5;
	background-color: #fff;
	text-align: center;
}
.tit-tip{
	font-size:16px;
	padding:10px 0;
	border-bottom:1px solid #f5f5f5;
	text-align: center;
	background-color: #fff;
	color:#333;
	
}
table{
	width:100%;
	border-spacing: 0;
	border-collapse: collapse;
}
</style>
