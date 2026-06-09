<script setup>
import { ref } from 'vue'

// 节点数据：位置、颜色、标签、图标类型
const nodes = ref([
  { id: 1, label: '虚假人员2', x: 100, y: 250, color: '#4299e1', icon: 'user' },
  { id: 2, label: '信用卡', x: 280, y: 230, color: '#38a169', icon: 'card' },
  { id: 3, label: '银行帐户', x: 480, y: 150, color: '#48bb78', icon: 'bank' },
  { id: 4, label: '无担保贷款', x: 650, y: 230, color: '#fc8181', icon: 'loan' },
  { id: 5, label: '虚假人员1', x: 850, y: 200, color: '#4299e1', icon: 'user' },
  { id: 6, label: 'SSN 2', x: 180, y: 500, color: '#f6ad55', icon: 'ssn' },
  { id: 7, label: '电话号码', x: 380, y: 450, color: '#cbd5e0', icon: 'phone' },
  { id: 8, label: '帐户持有人1', x: 500, y: 380, color: '#4299e1', icon: 'user' },
  { id: 9, label: 'SSN 1', x: 670, y: 450, color: '#f6ad55', icon: 'ssn' },
  { id: 10, label: '电话号码', x: 800, y: 500, color: '#cbd5e0', icon: 'phone' },
  { id: 11, label: '帐户持有人2', x: 300, y: 650, color: '#4299e1', icon: 'user' },
  { id: 12, label: '地址', x: 500, y: 650, color: '#3182ce', icon: 'address' },
  { id: 13, label: '帐户持有人3', x: 670, y: 650, color: '#4299e1', icon: 'user' },
  { id: 14, label: '信用卡', x: 200, y: 820, color: '#38a169', icon: 'card' },
  { id: 15, label: '银行帐户', x: 400, y: 820, color: '#48bb78', icon: 'bank' },
  { id: 16, label: '银行帐户', x: 580, y: 820, color: '#48bb78', icon: 'bank' },
  { id: 17, label: '无担保贷款', x: 750, y: 820, color: '#fc8181', icon: 'loan' },
])

// 节点之间的连线（节点ID对）
const links = ref([
  [1, 2], [1, 6], [1, 8],
  [2, 3], [2, 8],
  [3, 8], [3, 4],
  [4, 5], [4, 9],
  [5, 9], [5, 10],
  [6, 11],
  [7, 8], [7, 11],
  [8, 12],
  [9, 10], [9, 13],
  [11, 14], [11, 15], [11, 12],
  [12, 13], [12, 16],
  [13, 16], [13, 17],
])
</script>

<template>
  <div class="graph-container">
    <svg width="1000" height="950" viewBox="0 0 1000 950">
      <!-- 连线 -->
      <g stroke="#ccc" stroke-width="1.5">
        <line
            v-for="(link, idx) in links"
            :key="idx"
            :x1="nodes.find(n => n.id === link[0]).x"
            :y1="nodes.find(n => n.id === link[0]).y"
            :x2="nodes.find(n => n.id === link[1]).x"
            :y2="nodes.find(n => n.id === link[1]).y"
        />
      </g>

      <!-- 节点 -->
      <g>
        <g v-for="node in nodes" :key="node.id">
          <!-- 节点圆 -->
          <circle
              :cx="node.x"
              :cy="node.y"
              r="40"
              :fill="node.color"
              stroke="#fff"
              stroke-width="2"
          />
          <!-- 节点标签 -->
          <rect
              :x="node.x - 45"
              :y="node.y + 50"
              width="90"
              height="30"
              fill="#fff"
              stroke="#eee"
          />
          <text
              :x="node.x"
              :y="node.y + 70"
              text-anchor="middle"
              font-size="14"
              fill="#333"
          >
            {{ node.label }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.graph-container {
  width: 100%;
  display: flex;
  justify-content: center;
  background: #fff;
}
svg {
  max-width: 100%;
  height: auto;
}
</style>