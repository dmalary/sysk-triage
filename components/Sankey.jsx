/* eslint-disable react/prop-types */

import * as d3 from 'd3';
import { sankey, sankeyCenter, sankeyLinkHorizontal } from "d3-sankey";

const marginY = 25;
const marginX = 5;
const colors = ['#ff0200','#feff06','#008001','#000000','#808080',]

const Sankey = ({width, height, data}) => {
  const allGroups = [...new Set(data.nodes.map((d) => d.category))].sort();
  const colorScale = d3.scaleOrdinal().domain(allGroups).range(colors);

  const sankeyGenerator = sankey()  
    .nodeWidth(26)
    .nodePadding(12)
    .extent([
      [marginX, marginY],
      [width - marginX, height - marginY],
    ])
    .nodeId((node) => node.index)
    .nodeAlign(sankeyCenter);  

  const { nodes, links } = sankeyGenerator(data);

  // console.log('nodes', nodes)

  const allNodes = nodes.map((node) => {
    return (
      <g key={node.index}>
        <rect
          height={node.y1 - node.y0}
          width={sankeyGenerator.nodeWidth()}
          x={node.x0}
          y={node.y0}
          stroke={"black"}
          fill="#a53253"
          fillOpacity={0.8}
          rx={0.9}
        />
      </g>
    );
  });

  // console.log('links', links)

  const allLinks = links.map((link, i) => {
    const linkGenerator = sankeyLinkHorizontal();
    const path = linkGenerator(link);

    return (
      <path
        key={i}
        d={path}
        stroke={colorScale(link.source.category)}
        fill="none"
        strokeOpacity={0.3}
        strokeWidth={link.width}
      />
    );
  });

  // const allLabels = nodes.map((node, i) => {
  //   return (
  //     <text
  //       key={i}
  //       x={node.x0 < width / 2 ? node.x1 + 6 : node.x0 - 6}
  //       y={(node.y1 + node.y0) / 2}
  //       dy="0.35rem"
  //       textAnchor={node.x0 < width / 2 ? "start" : "end"}
  //       fontSize={12}
  //     >
  //       {node.name}
  //     </text>
  //   );
  // });

  data.links.forEach((link, i) => {
    console.log(`Link ${i}:`, link);
  });

  return (
    <div>
      <svg width={width} height={height}>
        {allNodes}
        {/* {allLinks} */}
        {/* {allLabels} */}
      </svg>
    </div>
  )
}
export default Sankey;