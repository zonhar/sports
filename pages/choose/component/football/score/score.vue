<template>
	<view  style="flex:1" >
		<web-view 
			style="flex:1;top:0;" 
			ref="webview" 
			:webview-styles="webviewStyles" 
			:src="webviewSrc" 
		></web-view>
	</view>
</template>

<script>
	var wv; //计划创建的webview
	export default {
		data() {
			return {
				iStatusBarHeight: 0,
				webviewSrc:'https://koudai.17itou.com/127/livescore/762/jingcai/?back=%2F783%2Fjingcai%2F%3Fback%3D%252F861%252Fuser%252F417%252Fshop%252Fdetails%252Fcontent_82Gu18n.html%253Fid%253D54275526%2526station_uuid%253Db9cfdcrpfsj3fd1661155817%2526back%253D%25252F%26scene%3Dstation_lottery%26station_id%3D54275526%26bsrc1%3Dselect_list%26bsrc2%3Djczq',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				canBack: false,
			}
		},
		
		onReady() {
			
		    // #ifdef APP-PLUS
			let currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
			let that = this
			setTimeout(function() {
				wv = currentWebview.children()[0]
				wv.setStyle({top:that.iStatusBarHeight})
				wv.addEventListener('progressChanged', function(e) {
					wv.canBack(function(e) {
						that.canBack = e.canBack
					})
				})
				
			}, 1000); //如果是页面初始化调用时，需要延时一下
			// #endif
		    
	    },
		onBackPress(options) {
			console.log('this.canBack',this.canBack)
			if (this.canBack) {
				wv.back()
				return true //不返回提示再按一次退出应用
			}
			return false
		},
		
	    onLoad() {
	  	   this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		   // #ifdef APP-PLUS  
		   var currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()  
		   this.timer = setInterval(function() {  
			   const jsCode = `
			   	var headers = document.getElementsByClassName('backlink');
				headers.style.display = 'none';
			   `;
			   wv = currentWebview.children()[0];  
			   wv.evalJS(jsCode);  
		   }, 100); //如果是页面初始化调用时，需要延时一下  
		   // #endif
		   //
		   document.getElementsByClassName()
	    },
		onUnload(){
			 this.timer && clearInterval(this.timer)
		}
	}
</script>

<style>

</style>
