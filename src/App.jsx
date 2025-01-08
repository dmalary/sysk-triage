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

  // Normalization function for system_step
  const normalizeSystemStep = (step) => {
    const stepMapping = {
      "1": "Step 1",
      "2": "Step 2",
      "3": "Step 3",
      "4": "Step 4",
      "5": "Step 5",
      "6": "Step 6",
      "7": "Step 7",
    };

    return stepMapping[step.toString()] || "Step 7";
  };

  data.forEach((entry) => {
    // const catCodeName = `${entry.cat_code_color} (${entry.cat_code})`;
    // const catCodeIndex = addNode(catCodeName);
    // const catCodeIndex = addNode(entry.cat_code);
    const catCodeIndex = addNode(entry.cat_code_color);

    const normalizedStep = normalizeSystemStep(entry.system_step);
    const systemStepIndex = addNode(normalizedStep);

    const systemCountry = `${entry.system} (${entry.country})`;
    const systemIndex = addNode(systemCountry);

    links.push({ source: catCodeIndex, target: systemStepIndex, value: 1 });
    links.push({ source: systemStepIndex, target: systemIndex, value: 1 });
  });

  const chartData = { nodes, links };
  // console.log('chartData', chartData)

  return (
    <>
      <Sankey width={800} height={650} data={chartData}/>
    </>
  )
}

export default App
