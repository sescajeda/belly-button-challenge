// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let myMetadata = metadata.filter(x => (x.id == sample))[0];
    console.log('myMetadata', myMetadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    let printPanel = d3.select('#sample-metadata')

    // Use `.html("") to clear any existing metadata
    printPanel.html("")
    
    let ul = printPanel.append('ul')
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (var key in myMetadata) {  
      ul.append('li').text(key + ": " + myMetadata[key] + "  "
      )
    }
  
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let mySample = samples.filter(x => (x.id == sample))[0];
    console.log('mySample', mySample);
    
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = mySample.otu_ids;
    let otu_labels = mySample.otu_labels;
    let sample_values = mySample.sample_values;

    // Build a Bubble Chart
    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    };
    
    var bubbleData = [bubbleTrace];
    
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      showlegend: false,
      height: 600,
      width: 1000
    };
    
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    
    // Combine the data into an array of objects
    let combinedData = otu_ids.map((id, index) => {
      return {
          otu_id: id,
          otu_label: otu_labels[index],
          sample_value: sample_values[index]
      };
    });

    // Sort the data by sample_value in descending order and slice the top 10
    let top10 = combinedData.sort((a, b) => b.sample_value - a.sample_value).slice(0, 10);

    // Reverse the order for the chart if needed (smallest to greatest)
    top10.reverse();

     // Create the plot
    let trace = {
      x: top10.map(d => d.sample_value),
      y: top10.map(d => `OTU ${d.otu_id}`), // Create labels for y-axis
      text: top10.map(d => d.otu_label), // Hover text
      type: 'bar',
      orientation: 'h' // Horizontal bar chart
    };

    let dataToPlot = [trace];

    let layout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
      height: 400,
      width: 700
      
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', dataToPlot, layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let ii = 0; ii<names.length; ii++ ) {  
      let myName = names[ii];
      dropdown.append('option').text(myName);
    }

    // Get the first sample from the list
    let firstName = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstName)
    buildCharts(firstName)

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Initialize the dashboard
init();
