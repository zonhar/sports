# zb-tab  tab 切换

### 微信=》 19550102670 拉进群

### 友情链接
#### 在线预览点击 —— [企业级、通用型中后台前端解决方案 ](https://yuanzbz.gitee.io/vue-admin-perfect/#/home)
#### vue-admin-perfect —— [企业级、通用型中后台前端解决方案（基于vue3.0+TS+Element-Plus  最新版，同时支持电脑，手机，平板)](https://github.com/zouzhibin/vue-admin-perfect)


### zb-tab Props 属性
| 参数          | 说明           | 类型                        | 默认值      | 是否必须 |
|-------------|--------------|---------------------------|----------|------|
| v-model     | 绑定当前选中标签的标识符 | number  , string] | 0    |非必须 |
| data        | 数组对象         | Array                     | []       | 必须   |
| height      | 设置tab高度      | string,number             | 40px     | --   |
| shrink      | 是否开启左侧收缩布局   | boolean                   | false    | 非必须  |
| lineWidth   | 底部条宽度        | 	number , string          | --   | - |
| lineColor   | 底部条颜色        | 	string	                  | #ee0a24  | -    |
| activeStyle | 设置选中样式       | 	object	                  | {}       | -    |
| scrollable  | 菜单是否可以滚动     | 	boolean	                 | true     | -    |

### 特别注意
v-model v-model绑定的变量值与data绑定的数组内某一项元素的value值相等才能显示默认下划线。
对应的是 data中的 value值

未选中class 可以用 zb-no-active 来覆盖样式

##3 DropdownItem Events
| 参数 | 说明 | 回调参数 |
| ------ | ------ | ------ | ------ | ------ |------ |
| change | 选项改变导致 value 变化时触发 | item |
| click-tab | 点击选项改变导致 value 变化时触发 | item |


### 使用示例
```
<zb-tab
  :activeStyle="{
    fontWeight: 'bold',
    transform: 'scale(1.1)'
    }"
  :data="list"
  v-model="active"
 ></zb-tab>
 
 v-model 对应得是 data中选中得value
```
### 数据格式
```
list0 = [{
    name: '标签1',
    value: 0,
}, {
    name: '标签2',
    value: 1,
}, {
    name: '标签3',
    value: 2,
}, {
    name: '标签4',
    value: 3,
}]
```


 