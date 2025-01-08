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
      nodes.push({ node: index, name });
    }
    return nodeMap.get(name);
  };

  data.forEach((entry) => {
    const catCodeIndex = addNode(entry.cat_code);
    const systemStepName = `Step ${entry.system_step} (${entry.category})`; 
    const systemStepIndex = addNode(systemStepName);
    const systemCountry = `${entry.system} - ${entry.country}`
    // const systemIndex = addNode(entry.system);
    const systemIndex = addNode(systemCountry);
  
    // Create links
    links.push({ source: catCodeIndex, target: systemStepIndex, value: 1 });
    links.push({ source: systemStepIndex, target: systemIndex, value: 1 });
  });

  const result = { nodes, links };
  console.log(result);

  return (
    <>
      <Sankey />
    </>
  )
}

export default App
