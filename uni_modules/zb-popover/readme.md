## 介绍
弹出式的气泡菜单。


## 友情链接
#### vue-admin-perfect —— [企业级、通用型中后台前端解决方案 预览地址](https://yuanzbz.gitee.io/vue-admin-perfect/#/home/)
#### vue-admin-perfect —— [企业级、通用型中后台前端解决方案（基于vue3.0+TS+Element-Plus  最新版，同时支持电脑，手机，平板)](https://github.com/zouzhibin/vue-admin-perfect)

## Events 事件
|事件名 | 说明 | 回调参数 |
| ------ | ------ |
| select | 点击选项时触发	 | item |
| handleClick | 点击按钮事件	 | boolean |



## Tooltip 属性
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ------ | ------ | ------ | ------ |
| options | 选项列表 | Array |-- | [] |
| theme | 主题风格，可选值为 dark| String |dark,light | light |
| actionsDirection | 选项列表的排列方向，可选值为 horizontal| String |vertical,horizontal | vertical |
| placement | Tooltip 的出现位置 | String |top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | top |


placement 支持以下值：
```
top           # 顶部中间位置
top-start     # 顶部左侧位置
top-end       # 顶部右侧位置
left          # 左侧中间位置
left-start    # 左侧上方位置
left-end      # 左侧下方位置
right         # 右侧中间位置
right-start   # 右侧上方位置
right-end     # 右侧下方位置
bottom        # 底部中间位置
bottom-start  # 底部左侧位置
bottom-end    # 底部右侧位置
```

## Slots 插槽
| 参数 | 说明 |
| ------ | ------ |
| content | 显示提示框得内容 |


```
因为uniapp 中小程序中没有window对象，需手动调用 关闭
 第一种办法关闭：this.$refs.Popover.close()

```

示例
```
<zb-popover placement="bottom-start"
                 :options="actions"
                 ref="Popover1"
                 @handleClick="handleClick"
                 @select="onSelect"
                 class="item-popover">
          <button class="mini-btn"
                  type="primary"
                  size="mini">浅色风格</button>
        </zb-popover>


const actions = [
		{ text: '选项一' },
		{ text: '选项二' },
		{ text: '选项三' },
	];
```
