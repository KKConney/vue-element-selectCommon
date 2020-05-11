import Vue from 'vue'
import Router from 'vue-router'

//组件模块
import selectCommon from '@/components/selectCommon'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'selectCommon',
			component: selectCommon
		}
	]
})
