<!--
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 -->

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, PolarArea, Radar } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps<{
  config: {
    chartType?: string;
    data?: ChartData<any>;
    options?: ChartOptions<any>;
    [key: string]: any;
  };
}>();

const chartType = computed(() => props.config?.chartType || 'bar');
const chartData = computed(() => props.config?.data || { labels: [], datasets: [] });
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  ...props.config?.options,
}));

const chartComponents: Record<string, any> = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  polarArea: PolarArea,
  radar: Radar,
};

const currentChartComponent = computed(() => chartComponents[chartType.value] || Bar);
</script>

<template>
  <div class="chart-container">
    <component
      :is="currentChartComponent"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
  min-height: 200px;
}
</style>
