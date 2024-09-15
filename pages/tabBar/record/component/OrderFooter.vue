<template>
	<view class="wrap">
		<!-- <view class="wrap-item">
			<view style="width:60px;"><uni-data-checkbox multiple v-model="needTakePhone" :localdata="TakePhoneArr"></uni-data-checkbox></view>
			<view style="flex:1">
				<text>要求拍照上传票样</text>
				<view><text>要求店主出票后上传票样，您可至方案详情进行查看</text></view>
			</view>
		</view>
		<view class="wrap-item">
			<view style="width:60px;"><uni-data-checkbox multiple v-model="needAgree" :localdata="agreeArr"></uni-data-checkbox></view>
			<text>我已年满18周岁,同意并接受《用户服务协议》和《隐私政策》</text>
		</view> -->
		<button style="margin-top:15px;" @click="confirmOrder" type='warn'>已保存,下一步</button>
	</view>
</template>

<script>
	export default {
		name:'OrderFooter',
		data(){
			return {
				agreeArr:[{value: 1,"text": ""}],
				needAgree:[1],
				TakePhoneArr:[{value: 1,"text": ""}],
				needTakePhone:[]
			}
		},

		methods:{
			change(val){
				console.log('val',val)
			},
			confirmOrder(){
				if(this.needAgree.length <= 0){
					uni.showToast({
						title: '请勾选协议',
						//将值设置为 success 或者直接不用写icon这个参数
						icon: 'error',
						//显示持续时间为 2秒
						duration: 2000
					})
					return;
				}else {
					this.$emit('confirmOrder',this.needTakePhone,this.needAgree)
				}

			}
		}

	}
</script>

<style scoped lang="scss">
	.wrap{
		padding:10px;
		position: fixed;
		width:100%;
		box-sizing: border-box;
		bottom:0;
		left:0;
		z-index: 100;
		background-color: #fff;
	}
	.wrap-item{
		display: flex;
		flex-direction: row;
		text{
			flex:1;
			color:#666;
		}

	}

</style>
