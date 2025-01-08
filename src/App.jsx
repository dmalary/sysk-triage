import './App.css'

import Sankey from '../components/Sankey'

import data from '../data/data.json'

function App() {
  console.log('data', data)

  const nodes = [];
  const links = [];

  const nodeMap = new Map();

  const addNode = (name) => {
    if (!nodeMap.has(name)) {
      const index = nodes.length;
      nodeMap.set(name, index);
      // nodes.push({ node: index, name });
      nodes.push({ id: name, name });
    }
    return nodeMap.get(name);
  };

  data.forEach((entry) => {
    const catCodeNAme = `${entry.cat_code_color} (${entry.cat_code})`;
    const catCodeIndex = addNode(catCodeNAme);
    // const catCodeIndex = addNode(entry.cat_code);
    const systemStepName = `Step ${entry.system_step} (${entry.category})`; 
    const systemStepIndex = addNode(systemStepName);
    const systemCountry = `${entry.system} (${entry.country})`
    // const systemIndex = addNode(entry.system);
    const systemIndex = addNode(systemCountry);
  
    // Create links
    links.push({ source: catCodeIndex, target: systemStepIndex, value: 1 });
    links.push({ source: systemStepIndex, target: systemIndex, value: 1 });
  });

  const chartData = { nodes, links };
  console.log(chartData);

  return (
    <>
      <Sankey width={800} height={600} data={chartData}/>
    </>
  )
}

export default App
