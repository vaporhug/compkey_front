import * as d3 from 'd3';

let svg, linkGroup, nodeGroup, labelGroup, simulation;
let onNodeClickCb = null;

export function initGraph(container) {
    const width = container.clientWidth;
    const height = container.clientHeight;

    svg = d3.select(container).select('svg');
    if (!svg.node()) {
        svg = d3.select(container).append("svg")
            .attr("width", width)
            .attr("height", height);
    }

    let graphG = svg.select('g.graph-group');
    if (!graphG.node()) {
        graphG = svg.append('g').attr('class', 'graph-group');
    }

    linkGroup = graphG.append("g")
        .attr("stroke", "#aaa")
        .attr("stroke-opacity", 0.6);

    nodeGroup = graphG.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);

    labelGroup = graphG.append("g")
        .attr("class", "labels");

    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(d => d.type === 'small' ? 30 : 80))
        .force("charge", d3.forceManyBody().strength(-250))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => getNodeRadius(d)+5))
        .on("tick", ticked);
}

export function drawGraph(data, onNodeClick) {
    onNodeClickCb = onNodeClick;
    updateSelection(data, true);
}

export function updateGraph(newData) {
    updateSelection(newData, false);
}

// 封装更新逻辑
function updateSelection(data, initial) {
    const links = linkGroup.selectAll("line")
        .data(data.links, d => d.source.id + "-" + d.target.id);

    links.enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value || 1))
        .merge(links)
        .transition().duration(500);

    links.exit().remove();

    const nodes = nodeGroup.selectAll("circle")
        .data(data.nodes, d => d.id);

    const nodeEnter = nodes.enter().append("circle")
        .attr("fill", d => getNodeColor(d))
        .attr("r", d => getNodeRadius(d))
        .on("click", (event, d) => { if (onNodeClickCb) onNodeClickCb(d); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    nodes.merge(nodeEnter)
        .transition().duration(1000)
        .attr("r", d => getNodeRadius(d))
        .attr("fill", d => getNodeColor(d));

    nodes.exit().remove();

    // 标签只对center和competitor显示
    const labelData = data.nodes.filter(d => d.type === 'center' || d.type === 'competitor');
    const labels = labelGroup.selectAll("text")
        .data(labelData, d => d.id);

    labels.enter()
        .append("text")
        .text(d => d.id)
        .attr("font-size", d => d.type === 'center' ? "16px" : "12px")
        .attr("fill", "#333")
        .attr("text-anchor", "middle")
        .attr("dy", "-1.2em")
        .merge(labels)
        .transition().duration(500);

    labels.exit().remove();

    simulation.nodes(data.nodes);
    simulation.force("link").links(data.links);
    simulation.alpha(1).restart();

    if (initial) {
        // 初始时可随机微调竞争节点位置，让布局更有美感
        data.nodes.forEach(d => {
            if (d.type === 'competitor') {
                d.x += (Math.random() - 0.5) * 50;
                d.y += (Math.random() - 0.5) * 50;
            }
        });
    }
}

function ticked() {
    linkGroup.selectAll("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    nodeGroup.selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    labelGroup.selectAll("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y);
}

function getNodeRadius(d) {
    if (d.type === 'center') return 30;
    if (d.type === 'competitor') return 18;
    if (d.type === 'small') return 6;
    return 10;
}

function getNodeColor(d) {
    if (d.type === 'center') return "radial-gradient(circle, #1E90FF, #0055FF)"; // 纯D3中不支持CSS渐变填充SVG circle直接用此字符串，需要改用defs定义渐变或用纯色
    // 可以简单用纯色代替，如 return "#1E90FF";
    if (d.type === 'competitor') return "#7FBF7F";
    if (d.type === 'small') return "rgba(127,127,127,0.3)";
    return "#ccc";
}

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
}
function dragged(event, d) {
    d.fx = event.x; d.fy = event.y;
}
function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null; d.fy = null;
}