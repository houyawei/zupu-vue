<template>
    <div class="hello">
        <h1>{{ msgH1 }}</h1>
        <ul class="operaGen">
            <!--<li>-->
            <!--<div>-->
            <!--<el-input class="operaGenInput" placeholder="请输入要删除的名字" v-model="delName" clearable></el-input>-->
            <!--<el-button>删&nbsp;&nbsp;&nbsp;&nbsp;除</el-button>-->
            <!--</div>-->
            <!--</li>-->
            <li>
                <div>
                    <el-input class="operaGenInput" placeholder="请输入要查询的名字" v-model="findName" clearable></el-input>
                    <el-button @click="inquire">查&nbsp;&nbsp;&nbsp;&nbsp;询</el-button>
                </div>
            </li>
            <li>
                <div>
                    <div class="dd">
                        <el-input class="operaGenInput" placeholder="请输入添加人父亲的名字" v-model="fatherName"
                                  clearable></el-input>
                        <el-date-picker v-model="fatherBar" class="dataInput" value-format="yyyy-MM-dd" type="date"
                                        placeholder="父亲出生日期"></el-date-picker>
                    </div>
                    <div class="dd">
                        <el-input class="operaGenInput" placeholder="请输入要添加的名字" v-model="nameAdd" clearable></el-input>
                        <el-date-picker v-model="nameBar" class="dataInput" value-format="yyyy-MM-dd" type="date"
                                        placeholder="添加人出生日期"></el-date-picker>
                    </div>
                    <el-button class="addBtn" @click="addFun()">添&nbsp;&nbsp;&nbsp;&nbsp;加</el-button>
                </div>
            </li>
        </ul>
        <div v-if="eachFlag" id="myChart" class="myChart" :style="{width: '100%', height: '700px'}"></div>
        <el-dialog
                title="提示"
                :visible.sync="centerDialogVisible"
                width="30%"
                center>
            <span class="promptCon">请输入名字~~</span>
        </el-dialog>
        <el-dialog
                title="提示"
                :visible.sync="queNoResFalg"
                width="30%"
                center>
            <span class="promptCon">没有查询到此人，请确认名字是否正确！</span>
        </el-dialog>
        <el-dialog
                title="提示"
                :visible.sync="queNoFatResFalg"
                width="30%"
                center>
            <span class="promptCon">没有查询到此人父亲的名字，请确认名字是否正确！</span>
        </el-dialog>
        <!--<div class="oblicv"></div>-->
    </div>
</template>

<script>
	import zupuInfo from '../../mockData/data.js'

	export default {
		name: 'HelloWorld',
		props: {
			msgH1: String
		},
		data() {
			return {
				msg: 'Welcome to Your Vue.js App',
				findData: {
					"name": "flare",
					"children": []
				},
				findName: '',
				nameShanChu: "",
				nameAdd: "",
				nameBar: "",
				fatherName: '',
				fatherBar: '',
				// 找到的数据
				selObj: {},
				copyZupuInfo: {},
				centerDialogVisible: false,
				queNoResFalg: false,
				queNoFatResFalg: false,
				delName: '',
				allData: null,
				selFlag: true,
				eachFlag: true,
				fatSelFlag: true
			}
		},
		mounted() {
			try {
				this.drawLine(zupuInfo);
				// this.drawLine(this.allData);
				// this.getData();
			} catch (e) {
				console.log(e, 'catch');
			}
		},
		methods: {
			drawLine(data) {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('myChart'));
				// 绘制图表
				myChart.setOption({
					tooltip: {
						trigger: 'item',
						triggerOn: 'mousemove'
					},
					series: [
						{
							type: 'tree',
							data: [data],
							left: '2%',
							right: '2%',
							top: '8%',
							bottom: '20%',
							symbol: 'emptyCircle',
							orient: 'vertical',
							expandAndCollapse: true,
							roam: true,
							initialTreeDepth: 5,
							label: {
								normal: {
									position: 'top',
									rotate: -90,
									verticalAlign: 'middle',
									align: 'right',
									fontSize: 9
								},
							},
							leaves: {
								label: {
									normal: {
										position: 'bottom',
										rotate: -90,
										verticalAlign: 'middle',
										align: 'left'
									}
								}
							},
							animationDurationUpdate: 750
						}
					]
				}, true);
			},
			// 添加
			addFun() {

				this.zhiXingaddFun(this.fatherName, this.nameAdd, zupuInfo);
				if (this.fatSelFlag) {
					this.queNoFatResFalg = true;
				} else {
					let obj = {
						pname: this.fatherName,
						pbirthdate: this.fatherBar,
						cname: this.nameAdd,
						cbirthdate: this.nameBar
					};
					this.$http.post('fillAll.do', obj).then(res => {
						if (res.data) {
							this.drawLine(res.data);
						}
						console.log(res, 'res');
					}).catch(error => {
						console.log(error, 'error');
					})
				}
			},
			zhiXingaddFun(fatherName, name, obj) {
				if (obj.children) {
					for (let i = 0; i < obj.children.length; i++) {
						if (obj.children[i].name === fatherName) {
							if (!obj.children[i].children) {
								obj.children[i].children = [];
							}
							obj.children[i].children.push({name: name});
							this.fatherName = '';
							this.nameAdd = '';
							this.fatSelFlag = false;
							return;
						} else if (obj.children[i].name !== name && obj.children[i].children) {
							this.zhiXingaddFun(fatherName, name, obj.children[i]);
						}
					}
				}
			},
			// 查询
			inquire() {
				let _this = this;
				if (this.eachFlag) {
					this.eachFlag = false;
				}
				setTimeout(function () {
					_this.eachFlag = true;
					setTimeout(function () {
						_this.zhixing();
					}, 10);
				}, 10);
			},
			zhixing() {
				let _this = this;
				this.copyZupuInfo = JSON.parse(JSON.stringify(zupuInfo));
				this.delNotSelItem(this.findName, this.copyZupuInfo);
				if (this.selFlag) {
					this.queNoResFalg = true;
				} else {
					setTimeout(function () {
						_this.drawLine(_this.copyZupuInfo);
					});
				}
			},

			// 只负责找出查询的数据
			delNotSelItem(name, obj) {
				if (obj.children) {
					for (let i = 0; i < obj.children.length; i++) {
						if (obj.children[i].name === name) {
							this.selObj = JSON.parse(JSON.stringify(obj.children[i]));
							obj.children.forEach(function (item) {
								if (item.name !== name && item.children) {
									item.children.splice(0, item.children.length);
								}
							});
							this.traveData(obj.name, this.copyZupuInfo);
							this.selFlag = false;
							return;
						} else if (obj.children[i].name !== name && obj.children[i].children) {
							this.delNotSelItem(name, obj.children[i]);
						}
					}
				}
			},

			// 删除多余的数据
			traveData(name, obj) {
				for (let i = 0; i < obj.children.length; i++) {
					if (obj.children[i].name === name) {
						for (let j = 0; j < obj.children.length; j++) {
							if (obj.children[j].name !== name && obj.children[j].children) {
								obj.children[j].children.splice(0, obj.children[j].children.length);
							}
						}
						this.traveData(obj.name, this.copyZupuInfo);
						return;
					} else if (obj.children[i].name !== name && obj.children[i].children) {
						this.traveData(name, obj.children[i]);
					}
				}
			},

			// 发送数据
			// 		O2t7pZre1OkhDu7s9zr4bfoI3ETKuG9a
			getData() {
				this.$http.get('fillAll.do').then(res => {
					if (res.data) {
						this.allData = res.data;
					}
					console.log(res, 'res');
				}).catch(error => {
					console.log(error, 'error');
				})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .dd {
        margin-bottom: 20px;
    }

    li .addBtn {
        position: absolute;
        top: 20%;
        right: 10%;
    }

    .oblicv {
        position: absolute;
        top: 5%;
        left: 5%;
        width: 10%;
        height: 5%;
        background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)); /* 标准的语法（必须放在最后） */
    }

    .hello {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .hello > h1 {
        margin-top: 2%;
        font-family: "STKaiti";
    }

    .hello .myChart {
        position: absolute;
        bottom: 3%;
    }

    .operaGen {
        list-style: none;
        margin: 2% 0;
        display: flex;
        justify-content: space-around;
    }

    .operaGen > li:last-child {
        width: 50%;
    }

    .operaGen > li:last-child div > .operaGenInput {
        width: 30%;
        margin-right: 1%;
    }

    .operaGen div > .operaGenInput {
        width: 65%;
        margin-right: 2%;
    }

    .el-dialog__body .promptCon {
        font-size: 24px;
        font-weight: 500;
    }

    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
        position: relative;
    }

    a {
        color: #42b983;
    }

    .el-date-editor.dataInput {
        /*width: 150px;*/
    }
</style>
