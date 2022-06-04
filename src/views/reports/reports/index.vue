<template>
  <div>
    <!-- 面包屑 -->
    <Crumbs firstMenu="数据统计" secondMenu="数据报表"></Crumbs>
    <!-- 主体 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin: 20px 0px">
      <div class="lineCharts" ref="lineCharts"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'
export default {
  name: 'reports',
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    this.getLineCharts()
  },
  methods: {
    // 获取时间统计折线图
    getLineCharts() {
      const lineCharts = echarts.init(this.$refs.lineCharts)
      this.$store.dispatch('getTimeLineCharts')
      // 合并完整的数据
      const option = Object.assign(this.options, this.timeLineCharts)
      lineCharts.setOption(option)
    }
  },
  computed: {
    ...mapState({
      timeLineCharts: (state) => state.Reports.timeLineCharts
    })
  }
}
</script>

<style lang="less" scoped>
.lineCharts {
  width: 100%;
  height: 600px;
}
</style>
