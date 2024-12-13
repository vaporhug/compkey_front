<template>
  <div ref="chart" class="w-full h-screen bg-[#1a1a1a] rounded-xl  shadow-md"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'NodeGraph',
  props: {
    nodes: { type: Array, default: () => [] },
    links: { type: Array, default: () => [] },
  },
  mounted() {
    this.drawGraph();
  },
  watch: {
    nodes: 'drawGraph',
    links: 'drawGraph',
  },
  methods: {
    drawGraph() {
      d3.select(this.$refs.chart).selectAll("*").remove();

      const width = this.$refs.chart.clientWidth;
      const height = this.$refs.chart.clientHeight;

      const svg = d3.select(this.$refs.chart)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .style("background-color", "#1a1a1a"); // 黑色背景

      const defs = svg.append("defs");

      // 为不同节点类型定义渐变
      const createGradient = (id, startColor, endColor) => {
        const gradient = defs
            .append("radialGradient")
            .attr("id", id)
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%");
        gradient.append("stop").attr("offset", "0%").attr("stop-color", startColor);
        gradient.append("stop").attr("offset", "100%").attr("stop-color", endColor);
      };

      createGradient("centerGradient", "#ffffff", "#bbbbbb"); // 中心节点
      createGradient("competitorGradient", "#bbbbbb", "#888888"); // 竞争节点
      createGradient("smallGradient", "#dddddd", "#aaaaaa"); // 小节点

      // 定义连接线渐变
      const linearGradient = defs
          .append("linearGradient")
          .attr("id", "lineGradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");
      linearGradient.append("stop").attr("offset", "0%").attr("stop-color", "#aaaaaa");
      linearGradient.append("stop").attr("offset", "100%").attr("stop-color", "transparent");

      const simulation = d3.forceSimulation(this.nodes)
          .force(
              "link",
              d3.forceLink(this.links).id((d) => d.id).distance(100)
          )
          .force("charge", d3.forceManyBody().strength(-300))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .on("tick", ticked);

      // 边样式
      const link = svg
          .append("g")
          .attr("stroke-opacity", 0.6)
          .selectAll("line")
          .data(this.links)
          .enter()
          .append("line")
          .attr("stroke-width", (d) => Math.sqrt(d.value || 1))
          .attr("stroke", "url(#lineGradient)") // 渐变颜色
          .attr("stroke-dasharray", (d) => (d.value < 0.5 ? "4 2" : "0")); // 小权重线为虚线

      // 节点样式
      const node = svg
          .append("g")
          .selectAll("circle")
          .data(this.nodes)
          .enter()
          .append("circle")
          .attr("r", (d) => getNodeRadius(d))
          .attr("fill", (d) => getNodeColor(d))
          .style("filter", "url(#shadow)") // 添加阴影
          .on("click", (event, d) => { this.$emit('node-clicked', d); })
          .call(
              d3
                  .drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended)
          );

      // 定义渐变
      const textGradient = defs.append("linearGradient")
          .attr("id", "textGradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");
      textGradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#000"); // 黑色
      textGradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#555"); // 深灰色

// 添加文字
      const label = svg
          .append("g")
          .selectAll("text")
          .data(this.nodes.filter((d) => d.type !== "small"))
          .enter()
          .append("text")
          .attr("dy", (d) => (d.type === "center" ? "1.5em" : "1.2em")) // 文字放在节点下方
          .attr("dx", (d) => (d.type === "center" ? "0" : "1em")) // 偏移右侧，避免重叠
          .attr("text-anchor", "middle")
          .attr("fill", (d) => (d.type === "center" ? "url(#textGradient)" : "#e0e0e0")) // 中心节点使用渐变
          .style("font-size", "12px")
          .text((d) => `${d.id}${d.score ? ` (${d.score})` : ""}`); // 显示分数

      function ticked() {
        link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        label.attr("x", (d) => d.x).attr("y", (d) => d.y);
      }

      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      function getNodeRadius(d) {
        if (d.type === "center") return 30;
        if (d.type === "competitor") return 20;
        if (d.type === "small") return 5;
        return 10;
      }

      function getNodeColor(d) {
        if (d.type === "center") return "url(#centerGradient)";
        if (d.type === "competitor") return "url(#competitorGradient)";
        if (d.type === "small") return "url(#smallGradient)";
        return "#aaa";
      }
    },
  },
};
</script>