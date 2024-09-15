<script>
	import {
		mapMutations
	} from 'vuex'
	import {
		version
	} from './package.json'
	import config from '@/common/config.js'
	export default {
		onLaunch: function() {
			// #ifdef H5
			console.log(
				`%c hello uniapp %c v${version} `,
				'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
				'background:#007aff ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;'
			)
			// #endif
			// 线上示例使用
			// console.log('%c uni-app官方团队诚邀优秀前端工程师加盟，一起打造更卓越的uni-app & uniCloud，欢迎投递简历到 hr2013@dcloud.io', 'color: red');
			console.log('App Launch');
			// #ifdef APP-PLUS
			// App平台检测升级，服务端代码是通过uniCloud的云函数实现的，详情可参考：https://ext.dcloud.net.cn/plugin?id=4542
			if (plus.runtime.appid !== 'HBuilder') { // 真机运行不需要检查更新，真机运行时appid固定为'HBuilder'，这是调试基座的appid
				checkUpdate()
			}

			// 一键登录预登陆，可以显著提高登录速度
			uni.preLogin({
				provider: 'univerify',
				success: (res) => {
					// 成功
					this.setUniverifyErrorMsg();
					console.log("preLogin success: ", res);
				},
				fail: (res) => {
					this.setUniverifyLogin(false);
					this.setUniverifyErrorMsg(res.errMsg);
					// 失败
					console.log("preLogin fail res: ", res);
				}
			})

			plus.runtime.getProperty(plus.runtime.appid, (inf) => {
				this.currentAppVersion(inf.version);
			});
			// #endif

		},
		onShow: function() {
			console.log('App Show')
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (inf) => {
				this.currentAppVersion(inf.version);
			});
			// #endif
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			currentShop: null,
			userInfo: null,
		},
		methods: {
			...mapMutations(['setUniverifyErrorMsg', 'setUniverifyLogin']),
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
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	@import '@/static/customicons.css';
	/* H5 兼容 pc 所需 */
	/* #ifdef H5 */
	@media screen and (min-width: 768px) {
		body {
			overflow-y: scroll;
		}
	}

	/* 顶栏通栏样式 */
	/* .uni-top-window {
	    left: 0;
	    right: 0;
	} */

	uni-page-body {
		background-color: #F5F5F5 !important;
		min-height: 100% !important;
		height: auto !important;
	}

	.uni-top-window uni-tabbar .uni-tabbar {
		background-color: #fff !important;
	}

	.uni-app--showleftwindow .hideOnPc {
		display: none !important;
	}

	/* #endif */

	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background-color: #efeff4;
		height: 100%;
		font-size: 28rpx;
		/* line-height: 1.8; */
	}

	.fix-pc-padding {
		padding: 0 50px;
	}

	.uni-header-logo {
		padding: 30rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
	}

	.uni-header-image {
		width: 100px;
		height: 100px;
	}

	.uni-hello-text {
		color: #7A7E83;
	}

	.uni-hello-addfile {
		text-align: center;
		line-height: 300rpx;
		background: #FFF;
		padding: 50rpx;
		margin-top: 10px;
		font-size: 38rpx;
		color: #808080;
	}

	/* #endif*/
	.wrap .checklist-box{
		margin-right:0!important;
	}
</style>
