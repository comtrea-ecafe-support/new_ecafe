<template>
  <Content>
    <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
  </Content>
</template>
<script>
import Echarts from 'echarts'
export default {
  name: 'Other',
  data () {
    return {
      msg: 'sss'
    }
  },
  mounted () {
    this.drawLine();
  },
  methods: {
    drawLine () {
      let myChart = Echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        title: { text: 'Use echarts in Vue' },
        tooltip: {},
        xAxis: {
          data: ["shirt", "Wool sweater", "Chiffon shirt", "Pants", "High heel", "sock"]
        },
        yAxis: {},
        series: [{
          name: 'Sales',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });
    }
  }
}
</script>
