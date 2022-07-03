<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <github-corner class="github-corner" />

      <panel-group @handleSetLineChartData="handleSetLineChartData" />

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <el-row type="flex" justify="center" style="position:relative">
          <el-date-picker
            v-model="dates"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="inDateChange"
            style="position:absolute;left:0"
          >
          </el-date-picker>
          <span style="font-weight:bold;display:inline-block;height:25px"
            >入库</span
          >
        </el-row>
        <line-chart :chart-data="lineChartData" />
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <el-row type="flex" justify="center" style="position:relative">
          <el-date-picker
            v-model="outDates"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="outDateChange"
            style="position:absolute;left:0"
          >
          </el-date-picker>
          <span style="font-weight:bold;display:inline-block;height:25px"
            >出库</span
          >
        </el-row>
        <line-chart :chart-data="outLineChartData" />
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <el-row type="flex" justify="center" style="position:relative">
          <el-date-picker
            v-model="inComeDates"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="inComeDateChange"
            style="position:absolute;left:0"
          >
          </el-date-picker>
          <span style="font-weight:bold;display:inline-block;height:25px"
            >收入</span
          >
        </el-row>
        <line-chart :chart-data="inComeLineChartData" />
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <radar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import GithubCorner from "@/components/GithubCorner";
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import RadarChart from "@/components/Echarts/RadarChart";
import PieChart from "@/components/Echarts/PieChart";
import BarChart from "@/components/Echarts/BarChart";
import { stockIn, stockOut, stockOutMoney } from "@/api/dashboard/index";
import { dateFormat } from "@/utils/index";

import DateRangePicker from "@/components/DateRangePicker";
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
};

//默认最近一个月
const end = new Date();
const start = end.getTime() - 3600 * 1000 * 24 * 30;
let defaultDate = [
  dateFormat(start, "yyyy-MM-dd"),
  dateFormat(end, "yyyy-MM-dd")
];

export default {
  name: "Dashboard",
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RadarChart,
    PieChart,
    BarChart,
    DateRangePicker
  },
  data() {
    return {
      dates: defaultDate,
      outDates: defaultDate,
      inComeDates: defaultDate,
      // lineChartData: lineChartData.newVisitis,
      lineChartData: {}, //入库图表数据
      outLineChartData: {}, //出库图表
      inComeLineChartData: {}, //收入图表
      pickerOptions: this.$store.state.settings.defaultPickerOptions
    };
  },
  mounted() {
    this.inDateChange(defaultDate);
    this.outDateChange(defaultDate);
    this.inComeDateChange(defaultDate);
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    inDateChange(val) {
      let params = {
        beginDate: defaultDate[0],
        endDate: defaultDate[1]
      };
      if (val && val.length) {
        params = {
          beginDate: val[0],
          endDate: val[1]
        };
      }

      this.reqeustStockIn(params);
    },
    outDateChange(val) {
      let params = {
        beginDate: defaultDate[0],
        endDate: defaultDate[1]
      };
      if (val && val.length) {
        params = {
          beginDate: val[0],
          endDate: val[1]
        };
      }
      this.reqeustStockOut(params);
    },
    inComeDateChange(val) {
      let params = {
        beginDate: defaultDate[0],
        endDate: defaultDate[1]
      };
      if (val && val.length) {
        params = {
          beginDate: val[0],
          endDate: val[1]
        };
      }
      this.reqeustStockOutMoney(params);
    },
    //出库金额数据
    reqeustStockOutMoney(params) {
      stockOutMoney(params)
        .then(res => {
          console.log("出库金额数据===", res);
          this.inComeLineChartData = res;
        })
        .catch(() => {});
    },
    //入库数据
    reqeustStockIn(params) {
      stockIn(params)
        .then(res => {
          console.log("入库数据===", res);
          this.lineChartData = res;
        })
        .catch(() => {});
    },
    //出库数据
    reqeustStockOut(params) {
      stockOut(params)
        .then(res => {
          console.log(res);
          this.outLineChartData = res;
        })
        .catch(() => {});
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
