<template>
	<view>
		<view class="logo">
			 <image style="width: 130rpx; height: 130rpx;"  src="@/static/logo.png"></image>
			<h4>Win牛店</h4>
			<h4 style="margin-top: 0rpx;">Version {{version}}</h4>
		</view>
		<view class="block-wrap">
			<uni-list>
				<uni-list-item
					:show-extra-icon="false"
					showArrow
					:extra-icon="{
						color: '#666',
						size: '22',
						type: 'wallet'
					}"
					clickable
					@click="goPersonal('/pages/appInfo/shopInfo/shopInfo')"
					title="店铺服务介绍"
				/>
				<uni-list-item
					:show-extra-icon="false"
					showArrow
					:extra-icon="{
						color: '#666',
						size: '22',
						type: 'wallet'
					}"
					clickable
					@click="updateVersion()"
					title="检查新版本"
				/>
			</uni-list>
			{{}}
		</view>
	</view>
</template>

<script>
	import silenceUpdate from '@/uni_modules/rt-uni-update/js_sdk/silence-update.js'
	import config from '@/common/config.js'
	import request from '@/common/request.js'
	export default {
		data() {
			return {
				version: '1.0.0'
			}
		},
		methods: {
			goPersonal(url){
				uni.navigateTo({
					url
				})
			},
			updateVersion(){
				//#ifdef APP-PLUS
				uni.showLoading({title: '检查中...',mask:true});
				plus.runtime.getProperty(plus.runtime.appid, (inf) => {
					this.currentAppVersion(inf.version);
				});
				//#endif

			},
			 currentAppVersion(version){

				      //获取服务器的版本号
				        uni.request({
				                url: `${config.baseURL}/system/version/currentAppVersion`,
				                success: (res) => {
				                     if (this.compareVersion(res.data.data.version,version) > 0) {

											  const parms = {
												  describe: res.data.data.updateDescription,
												  edition_url: config.baseURL +res.data.data.updateUrl,
												  edition_force: 1,
												  package_type: 0,
												  edition_issue: 0,
												  edition_number: res.data.data.version,
												  edition_name: res.data.data.version,
												  edition_silence: 0
											  };
											// //关闭加载中
											setTimeout(function () {uni.hideLoading();}, 100);
											//跳转更新页面 （注意！！！如果pages.json第一页的代码里有一打开就跳转其他页面的操作，下面这行代码最好写在setTimeout里面设置延时3到5秒再执行）
											uni.navigateTo({
											    url: '/uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update?obj=' +
											       JSON.stringify(parms)
											});

				                     } else {
				                         uni.showModal({
				                             title: '提示',
				                             content: '已是最新版本',
				                             showCancel: false
				                         });
										 // //关闭加载中
										 setTimeout(function () {uni.hideLoading();}, 100);
				                     }
				                }

				            })
			},
			 compareVersion(v1, v2) {
			  const v1Arr = v1.split('.');
			  const v2Arr = v2.split('.');
			  const len = Math.max(v1Arr.length, v2Arr.length);

			  while (v1Arr.length < len) {
				v1Arr.push('0');
			  }
			  while (v2Arr.length < len) {
				v2Arr.push('0');
			  }

			  for (let i = 0; i < len; i++) {
				const num1 = parseInt(v1Arr[i]);
				const num2 = parseInt(v2Arr[i]);

				if (num1 > num2) {
				  return 1;
				} else if (num1 < num2) {
				  return -1;
				}
			  }

			  return 0;
			}
		},onLoad(){
			const that = this;
			//#ifdef APP-PLUS
			 plus.runtime.getProperty(plus.runtime.appid, (inf) => {
				that.version = inf.version;
			 });

			//#endif
		}
	}
</script>

<style scoped>
.logo {
	    -webkit-text-size-adjust: none!important;
	    font-family: Helvetica Neue,HelveticaNeue,Helvetica-Neue,Helvetica,BBAlpha Sans,microsoft yahei,sans-serif;
	    color: #969799;
	    font-size: 14px;
	    line-height: 30px;
	    -webkit-tap-highlight-color: rgba(255,255,255,0);
	    margin: 0;
	    box-sizing: border-box;
	    user-select: none;
	    text-align: center;
	    padding: .8rem 0;
}
.block-wrap{
	padding: 10px;
}

h4 {
	line-height: 40rpx;
}
</style>
