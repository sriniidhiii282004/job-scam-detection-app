import { useLoaderData } from 'react-router';
import VisualizationSelector from '../components/VisualizationSelector';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

function VisualDashboardPage() {
  const allVisuals = useLoaderData();

  const [visuals, setVisuals] = useState([]);
  const [chartData, setChartData] = useState(null);
  console.log("allVisuals=========",visuals);
  useEffect(() => {
    setVisuals(allVisuals)

  }, [allVisuals])
  
  const handleSelectedVisual = async(visualType) => {
    console.log('handleSelectedVisual===', visualType);
    const response = await fetch('http://localhost:8080/visuals/' + visualType.id);
    console.log('handleSelectedVisual, response====', response);
  
    if (!response.ok) {
      throw new Response(JSON.stringify({ message: 'Could not fetch selected visual type' }), {status: 500});
    } else {
      const resData = await response.json();
      console.log('response==== visual', resData.visualization);
      setChartData(resData.visualization)
      return resData;
    }
  }

  console.log('Chart data', chartData);
  

  return (
    <div style={{justifyContent: 'center', alignItems: 'center', alignContent: 'center', backgroundColor: '#ffffe0', flex: 1, width: '100%'}}>
      <VisualizationSelector
        visualizationTypes={visuals}
        handleSelectedVisual={handleSelectedVisual} />
        {chartData && 
          <div style={{
            display: 'flex',
            justifyContent: 'center', // Center the plot horizontally
            width: '100%', // Ensure this div takes full width to provide centering space
            marginTop: '20px' // Add some space below the selector
          }}>
            <Plot
              data={chartData.data}
              layout={chartData.layout}
            />
          </div>
        
        }

    </div>
  );
}

export default VisualDashboardPage;

export async function visualsLoader() {
  // Replace this with your actual CSV loading logic
  const response = await fetch('http://localhost:8080/visuals');
  
  if (!response.ok) {
    throw new Response(JSON.stringify({ message: 'Could not fetch visual types.' }), {
      status: 500
    });
  }
  
  const resData = await response.json();
  console.log('resdata======', resData);
  
  return resData.visuals || [];
}
