import axios from 'axios';

const service = axios.create({
	baseURL: 'http://localhost:8080/HgenealogyController/',
	timeout: 10000
	// headers: {
	// 	'Content-Type': 'application/json;charset=UTF-8'
	// }
});

export default {
	get: function (url, data) {
		return service({
			url: url, // 假地址 自行替换
			method: 'get',
			params: data
		})
	},
	post: function (url, data) {
		return service({
			url: url, // 假地址 自行替换
			method: 'post',
			data: data
		});
	}
}
