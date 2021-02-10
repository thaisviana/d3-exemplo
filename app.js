function get_dtInfo(datestr){
    return new Date((datestr+ '').slice(0, 4),(datestr+ '').slice(4, 6)-1,(datestr+ '').slice(6, 8))
}

// GRÁFICO de PIZZA
// FILTRO TEMPORAL
// FILTRO POR TIPO


(async () => {
    const width = 960;
    const height = 500;
    const margin = {top: 20, right: 20, bottom: 60, left: 80};


    // Step 2. Prepare the data.
    const data = (await d3.csv('blood_donors.csv', d3.autoType))
      .map(({datestr, total, A_minus,A_plus,AB_minus,AB_plus,B_minus,B_plus,O_minus,O_plus}) => ({
        date: get_dtInfo(datestr),
        value: total,
        A_minus : A_minus,
        A_plus : A_plus,
        AB_minus : AB_minus,
        AB_plus : AB_plus,
        B_minus : B_minus,
        B_plus : B_plus,
        O_minus : O_minus,
        O_plus : O_plus,
      }));
    
    const types = ['A_minus','A_plus','AB_minus','AB_plus','B_minus','B_plus','O_minus','O_plus']
    const colors = ['black','red','yellow','purple','green','grey','blue','pink']


    for(let i=0; i<8;i++){
      document.getElementById('legend').innerHTML += `<span>
      <div class="box ${colors[i]}"></div>${types[i]}
      </span>`
  }

    series = types.map((type) => ({
        id: type, 
        values: data.map((d) => ({date: d.date, value: d[type]}))
    }))
    console.log(series)

    const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(series, (s) => d3.max(s.values, (d) => d.value))]).nice()
    .range([height - margin.bottom, margin.top])

    const xAxis = (label) =>(g) => g
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call((d3.axisBottom(xScale)).tickSizeOuter(0))
    .append('text')
    .attr('class', 'axis-label')
    .text(label)
    .attr('x', margin.left + (width - margin.left - margin.right) / 2)
    .attr('y', 50) // Relative to the x axis.

    const yAxis = (label) =>(g) => g
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale))
    .append('text')
    .attr('class', 'axis-label')
    .text(label)
    .attr('transform', 'rotate(-90)')
    .attr('x', -(margin.top + (height - margin.top - margin.bottom) / 2))
    .attr('y', -50) // Relative to the y axis.

    const line = d3.line()
    .defined(info => !isNaN(info.value))
    .x(info => xScale(info.date))
    .y(info => yScale(info.value))
    .curve(d3.curveBasis);

    const svg = d3.select('#hemorio')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    // Draw the x and y axes.
    svg.append('g').call(xAxis('Meses'))
    svg.append('g').call(yAxis('Número de doadores (2013)'))

     // Draw the line.
     svg.append('g')
    .selectAll('path')
    .data(series)//Month
    .join('path')
    .attr('d', (d) => line(d.values));

})();