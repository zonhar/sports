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
				webviewSrc:'https://koudai.17itou.com/94/prizehall/?back=%2F675%2Fuser%2F491%2Fshop%2Fdetails%2Fmylist_PmnZe.html%3Fid%3D54275526%26station_uuid%3Db9cfdcrpfsj3fd1661155817%26back%3D%252F',
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
				
				// wv.overrideUrlLoading({
				// 	mode: 'allow',
				// 	match: '.*jd\.com/.*'
				// }, function(e) {
				// 	try {
				// 		// 根据自己的业务需求，处理链接上的参数，进行跳转
				// 		var navURL =`/pages/index/order/order?id=${xxx}`;
				// 		uni.navigateTo({
				// 			url: navURL,
				// 			animationType: 'pop-in'
				// 		})
				// 	} catch (e) {
				// 		console.log(e)
				// 		//TODO handle the exception
				// 	}
				// 	console.log('reject Url', url);
				// })
				
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
			   	var headers = document.getElementsByTagName('header');
			   	for (var i = 0; i < headers.length; i++) {
			   	    headers[i].style.display = 'none';
			   	};
			   `;
			   wv = currentWebview.children()[0];  
			   wv.evalJS(jsCode);  
		   }, 100); //如果是页面初始化调用时，需要延时一下  
		   // #endif
		   
	    },
		onUnload(){
			 this.timer && clearInterval(this.timer)
		}
	}
</script>

<style>

</style>
