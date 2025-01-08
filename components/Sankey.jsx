/* eslint-disable react/prop-types */

// import * as d3 from 'd3';
import { sankey, sankeyCenter, sankeyLinkHorizontal } from "d3-sankey";

const marginY = 25;
const marginX = 5;

const colors = {
  red: '#ff0200', 
  yellow: '#feff06',
  green: '#008001',
  black: '#000000',
  grey: '#808080', 
}

const Sankey = ({width, height, data}) => {

  const sankeyGenerator = sankey()  
    .nodeWidth(20)
    .nodePadding(10)
    .extent([
      [marginX, marginY],
      [width - marginX, height - marginY],
    ])
    .nodeId((node) => node.index)
    .nodeAlign(sankeyCenter);  

  const { nodes, links } = sankeyGenerator(data);
  // console.log('nodes', nodes)
  // console.log('links', links)

  const getNodeColor = (node) => {
    if (node.layer === 0 || node.layer === 1) {
      // Match `cat_code` to a color in the colors object
      if (node.name.includes("red")) return colors.red;
      if (node.name.includes("yellow")) return colors.yellow;
      if (node.name.includes("green")) return colors.green;
      if (node.name.includes("black")) return colors.black;
      if (node.name.includes("grey")) return colors.grey;
    } else if (node.layer === 2) {
      // Layer 3 nodes are always black
      return colors.black;
    }
    return "#cccccc"; // Default color
  };

  const allNodes = nodes.map((node) => {

    const fillColor = getNodeColor(node);

    return (
      <g key={node.index}>
        <rect
          height={node.y1 - node.y0}
          width={sankeyGenerator.nodeWidth()}
          x={node.x0}
          y={node.y0}
          stroke={"black"}
          fill={fillColor}
          fillOpacity={0.8}
          rx={2}
        />
      </g>
    );
  });

  const allLinks = links.map((link, i) => {
    const linkGenerator = sankeyLinkHorizontal();
    const path = linkGenerator(link);

    const sourceNode = nodes[link.source.index];
    const linkColor = getNodeColor(sourceNode); // Use the same color as the source node

    return (
      <path
        key={i}
        d={path}
        stroke={linkColor}
        fill="none"
        strokeOpacity={0.4}
        strokeWidth={link.width}
      />
    );
  });

  const allLabels = nodes.map((node, i) => {
    return (
      <text
        key={i}
        x={node.x0 < width / 2 ? node.x1 + 6 : node.x0 - 6}
        y={(node.y1 + node.y0) / 2}
        dy="0.35rem"
        textAnchor={node.x0 < width / 2 ? "start" : "end"}
        fontSize={12}
        fill='#000000'
      >
        {node.name}
      </text>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        {allNodes}
        {allLinks}
        {allLabels}
      </svg>
    </div>
  )
}
export default Sankey;