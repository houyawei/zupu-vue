<template>
    <div id="app">
        <HelloWorld msgH1="侯氏族谱"/>
    </div>
</template>

<script>
	import HelloWorld from './components/HelloWorld.vue'

	export default {
		name: 'app',
		components: {
			HelloWorld
		}
	}
</script>

<style>
    @import "assets/comm.css";

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }
</style>
