<script setup>
</script>

<template>
  <div style="width: 700px; height: 550px;">
    <svg width="700" height="550" viewBox="0 0 700 550">
      <!-- 箭头定义 -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
        </marker>
      </defs>

      <!-- 图例部分 -->
      <g transform="translate(520, 50)">
        <!-- Nodes 图例 -->
        <circle cx="30" cy="30" r="20" class="legend-node"/>
        <text x="70" y="35" class="legend-text">节点</text>

        <!-- Relationships 图例 -->
        <line x1="0" y1="100" x2="60" y2="100" class="legend-edge"/>
        <polygon points="60 96, 70 100, 60 104" fill="#000"/>
        <text x="90" y="105" class="legend-text">关系</text>
      </g>

      <!-- 主图节点 -->
      <circle cx="150" cy="120" r="60" class="node"/>
      <text x="150" y="120" class="text">1</text>

      <circle cx="350" cy="120" r="60" class="node"/>
      <text x="350" y="120" class="text">2</text>

      <circle cx="250" cy="300" r="60" class="node"/>
      <text x="250" y="300" class="text">3</text>

      <circle cx="450" cy="300" r="60" class="node"/>
      <text x="450" y="300" class="text">4</text>

      <circle cx="150" cy="480" r="60" class="node"/>
      <text x="150" y="480" class="text">5</text>

      <circle cx="350" cy="480" r="60" class="node"/>
      <text x="350" y="480" class="text">6</text>

      <circle cx="550" cy="480" r="60" class="node"/>
      <text x="550" y="480" class="text">7</text>

      <!-- 边（和原图完全一致的箭头方向） -->
      <path d="M210 120 L290 120" class="edge"/>
      <path d="M180 165 L220 255" class="edge"/>
      <path d="M320 165 L280 255" class="edge"/>
      <path d="M310 300 L390 300" class="edge"/>
      <path d="M220 345 L180 435" class="edge"/>
      <path d="M420 345 L380 435" class="edge"/>
      <path d="M210 480 L290 480" class="edge"/>
      <path d="M410 480 L490 480" class="edge"/>
    </svg>
  </div>
</template>

<style scoped>
.node { fill: #fff; stroke: #000; stroke-width: 3; }
.text { font-size: 24px; text-anchor: middle; dominant-baseline: middle; fill: #000; }
.edge { stroke: #000; stroke-width: 3; fill: none; marker-end: url(#arrowhead); }
.legend-node { fill: #fff; stroke: #000; stroke-width: 2; }
.legend-edge { stroke: #000; stroke-width: 3; }
.legend-text { font-size: 28px; fill: #000; dominant-baseline: middle; }
</style>