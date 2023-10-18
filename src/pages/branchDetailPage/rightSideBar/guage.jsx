import React from "react";
import ReactApexChart from 'react-apexcharts';
export class Guage extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [100],
        options: {
          chart: {
            height: 80,
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '60%',
              },
              dataLabels: {
                showOn: 'always',
                name: {
                  show: true, // Hide the series name
                },
                value:{
                  show: false
                }
              },
      
            },
          },
          labels: ['Skill 0 / 11'],
        },
      
      
      };
    }

  

    render() {
      return (
        

    <p id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={135}  />
    </p>


      );
    }
  }
