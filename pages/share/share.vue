<template>
	<view style="height:100vh;background-color:  #FCF5E6;">
		<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#cc0002'}"></view>
		<image class="image" mode="widthFix" style="width:100%;" :src="filePath" />
		<view class="saveBlum">
			<button @click="save" type="warn">保存到相册 
				<uni-icons 
					style="position:absolute;color:#fff;margin-top:-15px;" 
					type="download" 
					size="30">
				</uni-icons>
			</button>
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				iStatusBarHeight:0,
				filePath:'../../../static/share.jpg'
			}
		},
		methods: {
			save(){
				uni.saveImageToPhotosAlbum({
					filePath: this.filePath,
					success: function () {
						console.log('save success');
						wx.showToast({
							title: '保存成功',
							icon:'success'
						})
					}
				});
			}
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			// setTimeout(function () {
			// 	console.log('start pulldown');
			// }, 1000);
			// uni.startPullDownRefresh();
		},
	}
</script>

<style scoped lang="scss">
.saveBlum{
	width:100%;
	box-sizing: border-box;
	position: absolute;
	bottom:30px;
	padding:0 15px;
	button{
		width:100%;
	}
}
</style>
