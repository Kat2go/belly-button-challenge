//Use the D3 library to read in samples.json from the URL 
//https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.
//url in a constant variable
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'



//create a horizontal bar chart with dropdown menu to display top 10 OTUs found in that individual
//use sample_values as the values for the bar chart
//use otu_ids as the labels for the bar chart
//use otu_labels as the hovertext for the chart
function panelInfo(id) {
    d3.json(url).then(function (data) {
        let SampData = data;
        let metadata = SampData.metadata;
        let identifier = metadata.filter(sample =>
            sample.id.toString() === id)[0];
        let panel = d3.select('#sample-metadata');
        panel.html('');
        Object.entries(identifier).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        })
    })
};

function Plots(id) {
    d3.json(url).then(function (data) {
        let SampData = data;
        let samples = SampData.samples;
        let identifier = samples.filter(sample => sample.id === id);
        let filtered = identifier[0];
        let OTUvalues = filtered.sample_values.slice(0, 10).reverse();
        let OTUids = filtered.otu_ids.slice(0, 10).reverse();
        let labels = filtered.otu_labels.slice(0, 10).reverse();
        let barGraphTrace = {
            x: OTUvalues,
            y: OTUids.map(object => 'OTU ' + object),
            name: labels,
            type: 'bar',
            orientation: 'h'
        };
        let barGraphLayout = {
            title: `Top 10 OTUs for ID #${id}`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ID' }
        };
        let barGraphData = [barGraphTrace];
        Plotly.newPlot('bar', barGraphData, barGraphLayout);
        let bubbleGraphTrace = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            mode: 'markers',
            marker: {
                size: filtered.sample_values,
                color: filtered.otu_ids,
                           },
            text: filtered.otu_labels,
        };


//Create a bubble chart that displays each sample.
//Use otu_ids for the x values.
//Use sample_values for the y values.
//Use sample_values for the marker size.
//Use otu_ids for the marker colors.
//Use otu_labels for the text values.
        let bubbleGraphData = [bubbleGraphTrace];
        let bubbleGraphLayout = {
            title: `OTUs for ID #${id}`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };
        Plotly.newPlot('bubble', bubbleGraphData, bubbleGraphLayout);
    })
};

function optionChanged(id) {
    Plots(id);
    panelInfo(id);
};

function init() {
    let dropDown = d3.select('#selDataset');
    let id = dropDown.property('value');
    d3.json(url).then(function (data) {
        sampData = data;
        let names = sampData.names;
        let samples = sampData.samples;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        panelInfo(names[0]);
        Plots(names[0])
    })
};

init();