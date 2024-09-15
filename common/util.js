import dayjs from 'dayjs';
import _ from 'lodash'
import {
	transform
} from 'lodash';

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

/**
 * 判断是否为昨天
 * @param time 秒数
 * @returns boolean
 */
function isYesterday(time) {
	return (
		// 如果传入的时间月日和当前的时间减一天月日相等就是昨天
		dayjs(time * 1000).format("YYYY-MM-DD") === dayjs().subtract(1, "day").format("YYYY-MM-DD")
	);
}
/**
 * 判断是否为今天
 * @param time 秒数
 * @returns boolean
 */
function isToday(time) {
	return (
		// 如果传入的时间月日和当前的时间月日相等就是今天
		dayjs(time * 1000).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
	);
}

/**
 * 判断是否为明天
 * @param time 秒数
 * @returns boolean
 */
function isTomorrow(time) {
	return (
		// 如果传入的时间月日和当前的时间加一天月日相等就是明天
		dayjs(time * 1000).format("YYYY-MM-DD") ===
		dayjs().add(1, "day").format("YYYY-MM-DD")
	);
}

/**
 * 判断是否为后天
 * @param time 秒数
 * @returns boolean
 */
function isAfterTomorrow(time) {
	return (
		dayjs(time * 1000).format("YYYY-MM-DD") ===
		dayjs().add(2, "day").format("YYYY-MM-DD")
	);
}

// 重写时间函数
function formats(time) {
	let prev = "";
	if (isToday(time)) {
		prev = "今天";
	} else if (isTomorrow(time)) {
		prev = "明天";
	} else if (isAfterTomorrow(time)) {
		prev = "后天";
	} else {
		prev = "";
	}
	return prev || dayjs(time * 1000).format("MM月DD日");
}

// 数字转换
function formatNumber(value) {
	var param = {};
	var k = 10000,
		sizes = ['', '万', '亿', '万亿'],
		i;
	if (value < k) {
		param.value = value
		param.unit = ''
	} else {
		i = Math.floor(Math.log(value) / Math.log(k));

		param.value = ((value / Math.pow(k, i))).toFixed(1);
		param.unit = sizes[i];
	}
	return param.value + param.unit;
}

function factorials(n, m) {
	if (n >= m) {
		return factorial(n) / (factorial(m) * factorial(n - m))
	}
	return null
}

function factorial(n) {
	if (n === 0 || n === 1) {
		return 1;
	}
	return n * factorial(n - 1);
}

function transformVsItem(val) {
	console.log('val', val)
	return val === '3' ? '胜' : (val === '1' ? '平' : '负')
}

function transformVs(str) {
	let num = str.replace(/active/, '')
	const start = num.split('')[0]
	const end = num.split('')[1]
	return transformVsItem(start) + '/' + transformVsItem(end)
}

function transformScore(str) {
	return str.split('')[0] + ':' + str.split('')[1]
}

function _factorial(n) {
	let result = 1;
	for (let i = 2; i <= n; i++) {
		result *= i;
	}
	return result;
}

function combination(n, k) {
	if (k > n) {
		return 0;
	}
	return _factorial(n) / (_factorial(k) * _factorial(n - k));
}

function generateCombinations(arr, r) {
	const results = [];
	const combiner = (chosen, rest, r) => {
		if (r === 0) {
			results.push(chosen);
			return;
		}
		for (let i = 0; i < rest.length; i++) {
			combiner([...chosen, rest[i]], rest.slice(i + 1), r - 1);
		}
	};

	combiner([], arr, r);
	return results;
}

function calculateTotalCombinations(elementsPerGroup, r) {
	let totalCombinations = 0;
	const indicesCombinations = generateCombinations(elementsPerGroup, r);
	for (const combination of indicesCombinations) {
		totalCombinations += combination.reduce((product, number) => product * number, 1);
	}
	return totalCombinations;
}

function calculateBeijingdanchangTotalCombinations(elementsPerGroup, r) {
	let total = 0;
	let arr = elementsPerGroup.sort((a,b)=>{
		return b-a
	})
    arr = combineArr(arr,Number(r))
	arr.map(item=>{
		total += item.reduce((prev,current)=>prev*current,1)
	})
	return total;
}

// // 使用示例
// const elementsPerGroup = [3, 4, 2, 5]; // 每组的元素数量
// const r = 3; // 需要选取的组数
// console.log(calculateTotalCombinations(elementsPerGroup, r)); // 计算并打印结果

function calculateCombination(n, k) {
	if (k > n) return 0;
	if (k === 0 || k === n) return 1;
	if (k > n - k) k = n - k;
	let result = 1;

	for (let i = 1; i <= k; i++) {
		result *= n - i + 1;
		result /= i;
	}
	return result
}

function calculateGroupThree(danma, tumas) {
	console.log(danma, tumas)
	if (danma.length + tumas.length < 2) return 0;
	let sum = 0;
	if (danma.length === 1) {
		sum = 2 * tumas.length
	} else if (danma.length === 2) {
		sum = 2
	} else if (danma.length === 0) {
		sum = tumas.length * (tumas.length - 1)
	}
	return sum
}

function calculateGroupNine(danmaL, totalNumbers) {
	let tumasL = totalNumbers - danmaL
	if (totalNumbers < 9) return 0;
	let combination = factorials(tumasL, 9 - danmaL)
	return combination
}


function calculateGroupSix(danma, tumas) {
	let totalNumbers = danma.length + tumas.length;
	if (totalNumbers < 3) return 0;
	let combination = factorials(tumas.length, 3 - danma.length)
	return combination
}

function calculateGroupThreeSix(danma, tumas) {
	return calculateGroupThree(danma, tumas) + calculateGroupSix(danma, tumas)
}

// 任选9+胆码
function calculateBettingAmount(danIndexes, matchOptions) {
	// 验证是否选择了9场比赛
	if (matchOptions.length < 9) {
		return "场次数不足以组成一个有效的9场组合";
	}

	// 过滤出胆码场次的选项
	let danOptions = [];
	danIndexes.forEach(index => {
		if (index < matchOptions.length) {
			danOptions.push(matchOptions[index]);
		}
	});

	// 计算胆码固定的组合数
	let danCombinations = 1;
	danOptions.forEach(options => {
		danCombinations *= options.length;
	});

	// 确定需要从非胆码场次选择的场次数
	let nonDanRequired = 9 - danIndexes.length;
	let nonDanOptions = matchOptions.filter((_, idx) => !danIndexes.includes(idx));

	// 计算非胆码场次的组合数
	let totalNonDanCombinations = combineNonDans(nonDanOptions, nonDanRequired);

	// 总投注金额 = 胆码组合数 × 非胆码组合数 × 每注2元
	const totalAmount = danCombinations * totalNonDanCombinations * 2;

	return totalAmount;
}

// 从非胆码中选择足够场次的组合数
function combineNonDans(optionsArray, k) {
	if (optionsArray.length < k) return 0; // 如果可选场次不足，无法组成有效组合

	var allCombinations = combine(optionsArray, k);
	let totalCombinations = 0;
	allCombinations.forEach(comb => {
		let combResult = comb.reduce((acc, options) => acc * options.length, 1);
		totalCombinations += combResult;
	});
	return totalCombinations;
}

// 实现组合选择的函数
function combine(array, k) {
	var i, subI, ret = [],
		sub, next;
	for (i = 0; i < array.length; i++) {
		if (k === 1) {
			ret.push([array[i]]);
		} else {
			sub = combine(array.slice(i + 1), k - 1);
			for (subI = 0; subI < sub.length; subI++) {
				next = sub[subI];
				next.unshift(array[i]);
				ret.push(next);
			}
		}
	}
	return ret;
}

// // 示例调用
// const danIndexes = [0, 1, 2]; // 胆码场次序号
// const matchOptions = [[3], [3], [2], [1, 2], [2], [2], [3, 2], [1], [1], [1, 2], [2], [1, 3], [3, 3]];
// console.log(calculateBettingAmount(danIndexes, matchOptions)); // 示例输入

// 获取token
function getToken() {
	const token = uni.getStorageSync('token')
	return token;
}

// 设置token
function setToken(key, value) {
	uni.setStorageSync(key, value)
	getApp().globalData.token = value
}

// 删除token
function removeToken() {
	uni.removeStorageSync('token')
	getApp().globalData.token = null
}


// 删除用户信息
function removeUserInfo() {
	uni.removeStorageSync('userInfo')
	getApp().globalData.userInfo = null
}

// 获取用户信息
function getUserInfo() {
	const userInfo = uni.getStorageSync('userInfo')
	return userInfo
}

// 设置用户信息
function setUserInfo(key, value) {
	uni.setStorageSync(key, value)
	getApp().globalData.userInfo = value
}

// 获取店铺列表
function getShop() {
	const shopList = uni.getStorageSync('shopList')
	return shopList
}

// 设置店铺
function setShop(key, value) {
	uni.setStorageSync(key, value)
	getApp().globalData.shopList = value
}

// 获取当前店铺
function getCurrentShop() {
	const shopList = getShop()
	if (shopList.length > 0) {
		const defaultShop = shopList.filter(item => item.isDefault === 1)
		const lastVisitShop = shopList.filter(item => item.lastVisitShop === 1)
		const currentShop = lastVisitShop[0] ?? defaultShop[0] ?? shopList[0]
		getApp().globalData.currentShop = currentShop
		return currentShop
	}
	return null
}

// 删除门店
function removeShop() {
	uni.removeStorageSync('shopList')
	getApp().globalData.shopList = null
}

// 清除所有缓存
function clearStorage() {
	removeToken()
	removeUserInfo()
	removeShop()
}

// 检查版本升级
async function checkForUpdate() {
	try {
		// 请求服务器端的版本信息
		const response = await uni.request({
			url: 'https://example.com/version.json', // 替换为你的版本信息URL
			method: 'GET'
		});

		const serverData = response[1].data;
		const serverVersion = serverData.version;

		// 获取当前应用的版本信息
		const res = await uni.getSystemInfo();
		const currentVersion = res.appVersion;

		// 比较版本号，如果服务器版本更新，则提示用户
		if (this.compareVersion(serverVersion, currentVersion) > 0) {
			uni.showModal({
				title: '版本更新',
				content: `发现新版本 ${serverVersion}，是否前往更新？\n\n更新内容：\n${serverData.updateDescription}`,
				success: (res) => {
					if (res.confirm) {
						// 如果用户点击确定，跳转到下载链接
						uni.downloadFile({
							url: serverData.updateUrl,
							success: (downloadRes) => {
								if (downloadRes.statusCode === 200) {
									uni.saveFile({
										tempFilePath: downloadRes.tempFilePath,
										success: (saveFileRes) => {
											uni.openDocument({
												filePath: saveFileRes
													.savedFilePath
											});
										}
									});
								}
							}
						});
					}
				}
			});
		}
	} catch (error) {
		console.error('检查更新失败', error);
	}
}

function compareVersion(v1, v2) {
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

const orderTabs = ['订单', '推单', '合买', '保存']
const orderTypes = {
	1: '竞彩足球',
	2: '竞彩篮球',
	3: '足彩14场',
	4: '任选9场',
	5: '北京单场',
	6: '胜负过关',
	7: '大乐透',
	8: '七星彩',
	9: '排列3',
	10: '排列5'
}

function calculateMaxReward(matches, combinationArray) {
	const matchRewards = matches.map(match => {
		let maxSpfReward = 0;
		let maxBfReward = 0;
		let maxZjqReward = 0;
		let maxBqcReward = 0;

		// 计算胜平负的最大奖金
		maxSpfReward = match.spfOptions?.reduce((max, option) => Math.max(max, option.multiplier), 0) || 0;

		// 计算比分的最大奖金
		maxBfReward = match.bfOptions?.reduce((max, option) => Math.max(max, option.multiplier), 0) || 0;

		// 计算总进球数的最大奖金
		maxZjqReward = match.zjqOptions?.reduce((max, option) => Math.max(max, option.multiplier), 0) || 0;

		// 计算半全场的最大奖金
		maxBqcReward = match.bqcOptions?.reduce((max, option) => Math.max(max, option.multiplier), 0) || 0;

		// 找出四种玩法中的最大值
		let maxReward = Math.max(maxSpfReward, maxBfReward, maxZjqReward, maxBqcReward);
		let additionalRewards = 0;

		if (maxReward === maxBfReward) {
			// 获取比分结果，计算对应的胜平负和总进球数的倍数
			const bfOption = match.bfOptions.find(option => option.multiplier === maxBfReward);
			if (bfOption) {
				const result = bfOption.result.split(' ')[1];
				const homeGoals = parseInt(bfOption.result.split(':')[0]);
				const awayGoals = parseInt(bfOption.result.split(':')[1]);
				const totalGoals = homeGoals + awayGoals;

				// 判断胜平负
				if (result === '胜') {
					const spfWin = match.spfOptions?.find(o => o.result === '胜');
					if (spfWin) additionalRewards += spfWin.multiplier;
				} else if (result === '平') {
					const spfDraw = match.spfOptions?.find(o => o.result === '平');
					if (spfDraw) additionalRewards += spfDraw.multiplier;
				} else if (result === '负') {
					const spfLose = match.spfOptions?.find(o => o.result === '负');
					if (spfLose) additionalRewards += spfLose.multiplier;
				}

				// 判断总进球数
				const zjqOption = match.zjqOptions?.find(o => parseInt(o.result) === totalGoals);
				if (zjqOption) additionalRewards += zjqOption.multiplier;
			}
		} else if (maxReward === maxSpfReward) {
			// 获取胜平负结果，计算对应的比分和总进球数的倍数
			const spfOption = match.spfOptions.find(option => option.multiplier === maxSpfReward);
			if (spfOption) {
				const result = spfOption.result;

				// 判断比分
				match.bfOptions?.forEach(bfOption => {
					const bfResult = bfOption.result.split(' ')[1];
					if ((result === '胜' && bfResult === '胜') ||
						(result === '平' && bfResult === '平') ||
						(result === '负' && bfResult === '负')) {
						additionalRewards += bfOption.multiplier;
					}
				});

				// 判断总进球数
				match.zjqOptions?.forEach(zjqOption => {
					const totalGoals = parseInt(zjqOption.result);
					if ((result === '胜' && totalGoals > 0) || (result === '负' && totalGoals >= 0)) {
						additionalRewards += zjqOption.multiplier;
					}
				});
			}
		}

		return maxReward + additionalRewards;
	});

	// 计算组合的最高奖励金额
	let totalMaxReward = 0;
	combinationArray.forEach(combination => {
		const [numOfMatches] = combination.split('串').map(Number);
		const combinations = getCombinations(matchRewards, numOfMatches);

		// 计算每个组合的奖励金额并求和
		combinations.forEach(comb => {
			const combinationReward = comb.reduce((acc, reward) => acc * reward, 1);
			totalMaxReward += combinationReward;
		});
	});

	return totalMaxReward;
}
// 获取数组的所有组合
function getCombinations(array, length) {
	const result = [];
	const f = (prefix, array) => {
		for (let i = 0; i < array.length; i++) {
			const newPrefix = prefix.concat([array[i]]);
			if (newPrefix.length === length) {
				result.push(newPrefix);
			} else {
				f(newPrefix, array.slice(i + 1));
			}
		}
	};
	f([], array);
	return result;
}

function combineArr(arr, n) {
  if (n === 1) return arr.map(item => [item]);
  if (n === 0) return [[]];
 
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    const remaining = arr.slice(i + 1);
    const combos = combine(remaining, n - 1);
    result.push(...combos.map(combo => [arr[i], ...combo]));
  }
  return result;
}


// 示例数据
// const matches = [
//     {
//         spfOptions: [{ result: '胜', multiplier: 1.5 }, { result: '平', multiplier: 3.2 }, { result: '负', multiplier: 2.8 }],
//         bfOptions: [{ result: '1:0 胜', multiplier: 5.5 }, { result: '2:1 胜', multiplier: 8.0 }, { result: '3:2 胜', multiplier: 12.0 }],
//         zjqOptions: [{ result: '0-1球', multiplier: 3.0 }, { result: '2-3球', multiplier: 4.5 }, { result: '4-5球', multiplier: 7.0 }],
//         bqcOptions: [{ result: '胜-胜', multiplier: 6.5 }, { result: '平-平', multiplier: 4.2 }, { result: '负-胜', multiplier: 15.0 }]
//     },
//     {
//         spfOptions: [{ result: '胜', multiplier: 2.0 }, { result: '平', multiplier: 3.0 }, { result: '负', multiplier: 4.0 }],
//         bfOptions: [{ result: '2:0 胜', multiplier: 6.0 }, { result: '3:1 胜', multiplier: 9.0 }, { result: '4:2 胜', multiplier: 10.0 }],
//         zjqOptions: [{ result: '0-1球', multiplier: 2.5 }, { result: '2-3球', multiplier: 5.0 }, { result: '4-5球', multiplier: 6.5 }],
//         bqcOptions: [{ result: '胜-胜', multiplier: 7.0 }, { result: '平-平', multiplier: 3.5 }, { result: '负-胜', multiplier: 14.0 }]
//     },
//     {
//         spfOptions: [{ result: '胜', multiplier: 1.8 }, { result: '平', multiplier: 3.1 }, { result: '负', multiplier: 2.9 }],
//         bfOptions: [{ result: '1:0 胜', multiplier: 5.8 }, { result: '2:1 胜', multiplier: 7.5 }, { result: '3:2 胜', multiplier: 11.0 }],
//         zjqOptions: [{ result: '0-1球', multiplier: 3.2 }, { result: '2-3球', multiplier: 4.0 }, { result: '4-5球', multiplier: 8.0 }],
//         bqcOptions: [{ result: '胜-胜', multiplier: 5.0 }, { result: '平-平', multiplier: 4.5 }, { result: '负-胜', multiplier: 13.0 }]
//     }
// ];

// const combinationArray = ['2串1', '3串1'];

// // 计算最高奖励金额
// const maxReward = calculateMaxReward(matches, combinationArray);
// console.log(`最高奖励金额的倍数为: ${maxReward}`);


// 判断平台
function checkPlatform() {
    const systemInfo = uni.getSystemInfoSync();
	if(systemInfo.uniPlatform === 'web'){
		return 'h5'
	}
	switch (systemInfo.platform) {
	  case 'android':
	    return 'android';
	  case 'ios':
	    return 'ios';
	  default:
	    return 'other';
	}
}

export {
	checkPlatform,
	calculateBeijingdanchangTotalCombinations,
	calculateMaxReward,
	orderTabs,
	orderTypes,
	calculateBettingAmount,
	calculateGroupThree,
	calculateGroupSix,
	calculateGroupThreeSix,
	calculateGroupNine,
	calculateTotalCombinations,
	transformScore,
	transformVs,
	factorial,
	factorials,
	formatNumber,
	formats,
	formatTime,
	formatLocation,
	dateUtils,
	getToken,
	setToken,
	getUserInfo,
	setUserInfo,
	removeToken,
	removeUserInfo,
	removeShop,
	getShop,
	setShop,
	getCurrentShop,
	clearStorage,
}
