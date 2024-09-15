/**
  * 检测版本升级	js sdk
  * 版本号:是指 manifest.json->基础配置->应用版本名称的值，以2个点号分隔的3组数字，如 1.0.0  2.1.9 等
  * post请求将app版本号发往后端服务器，与服务器上的apk wgt 版本号进行比对后，返回最新版本的url下载地址。
  * 需自行完成后端比对代码，只要返回符合下列各式的json即可（附带一个php版后端示例代码)
  * POST 请求数据为 
  * 	{
  * 		version:'数字.数字.数字 形式版本号',
  * 		platform:'android或ios'
  * 	}
  * 存在新wgt 或 apk，返回
  * {
	    code:0
		msg:"ok"
		version:1.2.1//版本号
		url:'http...apk|wgt'//url下载地址，如果存在新wgt，则为wgt下载地址，否则再判断如果是ios，则处为 appstore地址
		log:''//更新文字说明，支持 \n 换行
		force:1// 是否强制升级，force=1则是强制升级，用户无法关闭升级提示框
	}
	如果不存在新wgt或apk，则返回
	{
		code:1,
		msg:"no"
	}
	//  后端更新检测示例代码，php版本
	+----http://a.com/根目录
		+---update.php
		+---apk
			+----1.0.1.apk
			+----1.0.2.apk
			+----1.0.3.wgt
		<?php
		   // 在此填写ios的最新版本号及在appstore市场的url地址，用于比对是否转向去appstore市场更新
		    $ios='1.0.8';
		    $iosurl='https://appstor.apple.com/xxxxxxxxxxxxxx/xxxxxxxxxx';
		
			// 示例代码 update.php，此示例代码要求符合如下规则
			// 1. manifest.json->基础配置->应用版本名称的值必须是以2个点号分隔开的3组数字，即  "数字.数字.数字" 比如 1.0.2   2.1.3 等，不可含有其他字符，且形式必须符合 数字.数字.数字 的形式
			// 2. 该示例代码文件同目录下有 apk wgt等 文件夹，此文件夹下存放以版本号命名的apk包或wgt包，如果apk和wgt包版本号相同，则优先返回wgt，如 1.0.2.apk  1.2.4.apk 1.3.4.wgt等
			// 3. 更新检测接口地址 http://a.com/update.php, apk下载url地址 http://a.com/apk/数字.数字.数字.apk或wgt
			
			//0 不强制更新，1强制更新
			$force=0;
			//更新日志	
			$log='修复已知bug；优化性能';
			
	        // $new 存放最大的版本号，初始为 app中传来的版本号
			$new=$_POST['version'];
			
			// 存放apk或wgt的绝对路径地址
	        // 	首先判断是否有待更新的资源 wgt
			$path=__DIR__.'/apk/';
			// 此处使用了exec调用linux上系统命令返回目录下所有的apk文件名称，需要php中启用exec函数
			exec("find  {$path}  -type f -regex  '.*\(apk\|wgt\)'",$out);
			
			foreach ($out as $k=>$v){
				// 循环将最大的版本号赋给$new
				$new=getbig($new,substr(basename($v),0,-4));
			}
			header('Content-Type:application/json;charset=utf-8');
	        // 	如果版本号发生了变化，且 是热更新资源wgt，则无论ios还是android均返回资源wgt
			if($new !=$_POST['version'] && file_exists($path.$new.'.wgt')){
			    //   如果是wgt，则无论ios还是android都返回
			    echo json_encode([
					'code'=>0,
					'msg'=>'ok',
					'version'=>$new,
					'url'=>'https://exam.wonyes.org/apk/'.$new.'.wgt',
					'log'=>'新版本'.$new.','.$log,
					'force'=>$force
				]);
				exit;
			}
			
	        // 	IOS 更新判断	
			// $_POST 请求数据为 [version=>'数字.数字.数字 形式版本号',platform=>'android或ios']
			if($_POST['platform']=='ios'){
				// 如果是ios，则直接填写最新版本号和商店下载地址
				$new=$ios;//最新的版本号
				$url=$iosurl;//苹果商店地址
				// getbig($new,$_POST['version']) 函数会返回 所传入版本号参数中较大的那个
				
				if($_POST['version']!=getbig($new,$_POST['version'])){
					// 如果返回值不等于 $_POST['version']，说明 $new 是新版本
					// 返回地址
					echo json_encode([
						'code'=>0,
						'msg'=>'ok',
						'version'=>$new,
						'url'=>$url,
						'log'=>$log,
						'force'=>$force
					]);
				}else{
				    echo json_encode([
	    				'code'=>1,
	    				'msg'=>'no'
	    			]);
				}
				exit;
			}
			
	        // 	android下判断	
			// 如果 $new 无变化，则无更新
			if($new==$_POST['version']){
				echo json_encode([
					'code'=>1,
					'msg'=>'no'
				]);
				 exit;
			}else{
				echo json_encode([
						'code'=>0,
						'msg'=>'ok',
						'version'=>$new,
						'url'=>'https://exam.wonyes.org/apk/'.$new.'.apk',
						'log'=>'新版本'.$new.','.$log,
						'force'=>$force
				]);
			}
			
			
			
			// 判断2个版本号的大小，并返回较大的那个，比如 1.0.9  1.1.0 ，则返回 1.1.0
		    // 传入由2个点分隔为3组的版本号，返回较大的那个
		    // 1.0.3  1.2.9 等
		    function getbig($one,$two){
		        $onearr=explode('.',$one);
		        $twoarr=explode('.',$two);
		        if(intval($onearr[0]) !== intval($twoarr[0])){
		            return intval($onearr[0])>intval($twoarr[0])?$one:$two;
		        }
		        
		        if(intval($onearr[1]) !== intval($twoarr[1])){
		            return intval($onearr[1])>intval($twoarr[1])?$one:$two;
		        }
		        if(intval($onearr[2]) !== intval($twoarr[2])){
		            return intval($onearr[2])>intval($twoarr[2])?$one:$two;
		        }
		        return $one;
	}
 * 
 */
function check(param = {}) {
	// 合并默认参数
	param = Object.assign({
		title: "检测到有新版本！",
		content: "请升级app到最新版本！",
		canceltext: "暂不升级",
		oktext: "立即升级",
		barbackground:"rgba(50,50,50,0.8)",
		barbackgroundactive:"rgba(32,165,58,1)"
	}, param)
	if (!param.api) {
		return false;
	}
	
	plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
		
		let platform = plus.os.name.toLocaleLowerCase()
		uni.request({
			url: param['api'],
			data: {
				platform: platform,
				version: widgetInfo.version
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			dataType: 'json',
			success: (result) => {
				let data = result.data ? result.data : null			

				if (data && data.code === 0 && data.url) {
					if(/\.wgt$/i.test(data.url) || (platform == 'android' &&  /\.apk$/i.test(data.url))){
						// 如果是热更新  wgt 或 android平台下apk
						startdownload(param,data);
						return
					}
					if (platform == 'ios') {
						// 如果是ios,则跳转到appstore
						plus.runtime.openURL(result.data.data.url)
						
					}
				}
			},
			fail: (res) => {
				
			}
		})
	});
}

function startdownload(param,data){
	uni.showModal({
		title: param.title,
		content: data.log ? data.log : param.content,
		showCancel: data.force ? false : true,
		confirmText: param.oktext,
		cancelText: param.canceltext,
		success: res => {
			if (!res.confirm) {
				console.log('取消了升级');
				return
			}
			if (data.shichang === 1 && /\.apk$/i.test(data.url)) {
				//去应用市场更新
				plus.runtime.openURL(data.shichangurl);
				plus.runtime.restart();
			} else {
				// 开始下载
				// 创建下载任务
				var dtask = plus.downloader.createDownload(data.url, {
						filename: "_downloads/"
					},
					function(d, status) {
						console.log('d',d)
						// 下载完成
						if (status == 200) {
							plus.runtime.install(d.filename, {
								force: false
							}, function() {
								//进行重新启动;
								plus.runtime.restart();
							}, (e) => {
								uni.showToast({
									title: '安装升级包失败:' + JSON.stringify(e),
									icon: 'none'
								})
							});
						} else {
							plus.nativeUI.alert("下载升级包失败，请手动去站点下载安装，错误码: " + status);
						}
				});
				
				let wrapwidth=parseInt(plus.screen.resolutionWidth / 2);
				let view = new plus.nativeObj.View("maskView", {
					backgroundColor: param.barbackground,
					left: (wrapwidth/2) + "px",
					bottom: "80px",
					width: wrapwidth+"px",
					height: "10px"
				});
				
				view.show()
				let viewinner = new plus.nativeObj.View("maskViewinner", {
					backgroundColor: param.barbackgroundactive,
					left: (wrapwidth/2)+"px",
					bottom: "80px",
					width: "1px",
					height: "10px"
				});
				viewinner.show()
				dtask.addEventListener("statechanged", (e) => {
					if (e && e.downloadedSize > 0) {
						let jindu = parseInt((e.downloadedSize / e.totalSize)*wrapwidth)
						viewinner.setStyle({width:jindu+'px'});
					}
				}, false);
				dtask.start();
			}
		}
	});
}

export default {
	check
}
