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
  console.log('nodes', nodes)
  // console.log('links', links)

  const getNodeColor = (node) => {
    // if (node.layer === 0 || node.layer === 1) {
    if (node.layer === 0) {
      // Match `cat_code` to a color in the colors object
      if (node.name.includes("red")) return colors.red;
      if (node.name.includes("yellow")) return colors.yellow;
      if (node.name.includes("green")) return colors.green;
      if (node.name.includes("black")) return colors.black;
      if (node.name.includes("grey")) return colors.grey;
    // } else if (node.layer === 2) {
    //   return colors.black;
    // }
      } else if (node.layer >= 1) {
      // } else if (node.layer === 1) {
        return '#cccccc';
      // } else if (node.layer === 2) {
      //   return '#000000';
      }
    return "#cccccc"; // Default color
  };

  const getLinkColor = (link) => {
    const sourceNode = nodes[link.source.index];
    const targetNode = nodes[link.target.index];

    if (sourceNode.layer === 0 && targetNode.layer === 1) {
      return getNodeColor(sourceNode); // Inherit color from the Layer 0 source node
    }

    // if (sourceNode.layer === 1 && targetNode.layer === 2) {
    //   // Match color based on system_step from data
    //   const systemStep = data.find((d) => sourceNode.name.includes(d.system));
    //   if (systemStep) {
    //     switch (systemStep.cat_code_color) {
    //       case "red":
    //         return colors.red;
    //       case "yellow":
    //         return colors.yellow;
    //       case "green":
    //         return colors.green;
    //       default:
    //         return colors.grey; // Default to grey if no match
    //     }
    //   }
    // }

    return "#cccccc"; // Fallback color
  };
  
  // v1
  // const allNodes = nodes.map((node) => {

  //   const fillColor = getNodeColor(node);

  //   return (
  //     <g key={node.index}>
  //       {/* only for node layer 0 */}
  //       {node.layer === 0 && (
  //         <rect
  //           height={node.y1 - node.y0}
  //           width={sankeyGenerator.nodeWidth()}
  //           x={node.x0}
  //           y={node.y0}
  //           stroke={"black"}
  //           fill={fillColor}
  //           // fill={getNodeColor(node)}
  //           fillOpacity={0.8}
  //           rx={2}
  //         />
  //       )}
  //       {/* node layer 1 and 2 check for node source color. add another rect, and stack it */}
  //       {node.layer > 0 && (
  //         <>
  //           {/* Top half of the node */}
  //           <rect
  //             height={(node.y1 - node.y0) / 2}
  //             width={sankeyGenerator.nodeWidth()}
  //             x={node.x0}
  //             y={node.y0}
  //             stroke={"black"}
  //             fill={fillColor}
  //             fillOpacity={0.8}
  //             rx={2}
  //           />
  //           {/* Bottom half of the node */}
  //           <rect
  //             height={(node.y1 - node.y0) / 2}
  //             width={sankeyGenerator.nodeWidth()}
  //             x={node.x0}
  //             y={node.y0 + (node.y1 - node.y0) / 2}
  //             stroke={"black"}
  //             fill={fillColor}
  //             fillOpacity={0.6} // Slightly different opacity for visual distinction
  //             rx={2}
  //           />
  //         </>
  //       )}
  //     </g>
  //   );
  // });

  // v2
  const allNodes = nodes.map((node) => {
    const nodeHeight = node.y1 - node.y0;
    const nodeWidth = sankeyGenerator.nodeWidth();
  
    if (node.layer === 1) {
      // Group incoming links by color for Layer 1
      const incomingLinks = links.filter((link) => link.target.index === node.index);
      const colorGroups = incomingLinks.reduce((groups, link) => {
        const color = getLinkColor(link); // Determine the link color
        if (!groups[color]) groups[color] = [];
        groups[color].push(link);
        return groups;
      }, {});
  
      const groupCount = Object.keys(colorGroups).length;
      const rectHeight = nodeHeight / groupCount; // Divide height equally among groups
  
      return (
        <g key={node.index}>
          {Object.entries(colorGroups).map(([color, _], i) => (
            <rect
              key={i}
              height={rectHeight}
              width={nodeWidth}
              x={node.x0}
              y={node.y0 + i * rectHeight} // Stack vertically by group
              stroke="black"
              fill={color} // Use the group's color
              fillOpacity={0.8}
              rx={2}
            />
          ))}
        </g>
      );
    } else if (node.layer === 2) {
      // Generate one rectangle per source link for Layer 2
      const incomingLinks = links.filter((link) => link.target.index === node.index);
      const linkCount = incomingLinks.length || 1; // Default to 1 if no incoming links
      const rectHeight = nodeHeight / linkCount; // Divide height equally among links
  
      return (
        <g key={node.index}>
          {incomingLinks.map((link, i) => (
            <rect
              key={i}
              height={rectHeight}
              width={nodeWidth}
              x={node.x0}
              y={node.y0 + i * rectHeight} // Stack vertically by link
              stroke="black"
              fill={getLinkColor(link)} // Color based on the link
              fillOpacity={0.8}
              rx={2}
            />
          ))}
        </g>
      );
    } else {
      // Default behavior for Layer 0
      const fillColor = getNodeColor(node);
  
      return (
        <g key={node.index}>
          <rect
            height={nodeHeight}
            width={nodeWidth}
            x={node.x0}
            y={node.y0}
            stroke="black"
            fill={fillColor}
            fillOpacity={0.8}
            rx={2}
          />
        </g>
      );
    }
  });
  

  const allLinks = links.map((link, i) => {
    const linkGenerator = sankeyLinkHorizontal();
    const path = linkGenerator(link);

    // const sourceNode = nodes[link.source.index];
    // const linkColor = getNodeColor(sourceNode); // Use the same color as the source node

    // Get the color from the Layer 0 source node
    // let sourceNode = link.source;
    // while (sourceNode.layer > 0) {
    //   sourceNode = nodes.find((node) => node.index === links.find((l) => l.target.index === sourceNode.index).source.index);
    // }
    // const linkColor = getNodeColor(sourceNode); // Color is based on the Layer 0 source


    const linkColor = getLinkColor(link); // Color is based on the Layer 0 source


    return (
      <path
        key={i}
        d={path}
        stroke={linkColor}
        // stroke={getLinkColor(link)}
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