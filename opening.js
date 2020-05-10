var miniwidth
var miniheight
var minimargin;
var minicoordinates;
var whiteline='rgba(255, 255, 255, 0.397)'
var color1='rgba(242, 118, 51, 0.886)';
var color2='rgba(212, 209, 51, 0.76)';
var minicircles1;
var minicircles2;
var minidata;



var minixscale;

miniheight=100;

miniwidth=400;

var arrow= d3.select('.pagearrow').append('svg').attr('width',1000)


d3.csv('./dummydata.csv').then(function(data){
    arrow
    .append('path')
    .attr('d',"M0,0L30,50L0,100L0,0")
    .on('click',showintro)
    .attr('transform','translate(50)')
  
  function showintro(){
      console.log('clicked')

      console.log(document.getElementsByTagName('html')[0].style.overflow)

      document.getElementsByTagName('body')[0].style.overflow='auto'

      d3.select('.convapproach')
      .transition()
      .duration(500)
      .style('display','block')


  
      d3.select('.pjtTitle')
      .transition()
      .duration(100)
      .style('display','none')
  
      d3.select('.explanation')
      .transition()
      .duration(100)
      .style('display','none')
  
      d3.select('.pagearrow').selectAll('path')
        .remove()
      
      firstgraph();
  
  }



var convgraph=d3.select('.convapproach').append('svg').attr('height',300)

minidata=data;

minixscale =d3.scaleLinear()
.domain([0,10])
.range([0,miniwidth])

miniyscale =d3.scaleLinear()
.domain([-1,1])
.range([miniheight,0])

let minixaxis;

minixaxis=convgraph.append('g').attr('class','minigraphaxis')
                   .call(d3.axisBottom(minixscale))
                   .selectAll('text').remove()
                   

function firstgraph(){
// 아이씨에쓰 설명 띄우기. 
d3.select('.icsdescription')
  .transition()
  .duration(2500)
  .style('opacity',1)
  .transition()
  .duration(1000)
  .attr("transform", "translate(0,30)")
  

var minilinegraph=convgraph.append('path')
         .datum(minidata)
         .attr('d',d3.line()
                  .x(function(d){return minixscale(d.TIME)})
                  .y(function(d){return miniyscale(d.ICS)})
         )
         .attr('stroke','white')
         .attr('fill','none')
         .style('stroke-width',2)

convgraph
         .append('line')
         .attr('x1',0).attr('y1',0).attr('x2',20).attr('y2',0)
         .style('stroke',whiteline)
         .style('stroke-width',2)
         .attr('transform','translate(0,143)')


convgraph.append('text')
         .attr('class','descriptionone')
         .text('ICS GRAPH')
         .attr('dx',30)
         .attr('dy',150)
         .attr('fill',whiteline)
         .style('font-family','arial')
         .style('stroke','2px')

const transitionPath = d3
.transition()
.ease(d3.easeSin)
.duration(2000);    

const pathLength = minilinegraph.node().getTotalLength();

         minilinegraph
         .attr("stroke-dashoffset", pathLength)
         .attr("stroke-dasharray", pathLength)
         .transition(transitionPath)
         .attr("stroke-dashoffset", 0)
         .attr('stroke-width',0.5)
         .attr('stroke',whiteline)         
}

const controller = new ScrollMagic.Controller();
const explainone =  new ScrollMagic.Scene({
    triggerElement:".txtdescription"})

    .on("enter",(e)=>{
        blobvadar();

      })
    .addTo(controller)

const explaintwo =  new ScrollMagic.Scene({
    triggerElement:".uncertaintyanimation"})

    .on("enter",(e)=>{
        uncertaintywave();

      })
    .addTo(controller)



function blobvadar(){

    minicircles1=convgraph.append('g')
                    .attr('class','vadarcircle')
                    .selectAll('circle')
                    .data(minidata).enter()
                    .append('circle')
                    .attr('cx',(d)=>{return minixscale(d.TIME)})
                    .attr('cy',(d)=>{return miniyscale(d.VADAR)})
                    .transition()
                    .delay(function(d,i){return i*10})
                    .attr('r',3)
                    .style('fill',color1) 

    minicircles2=convgraph.append('g')
                    .attr('class','textblobcircle')
                    .selectAll('circle')
                    .data(minidata).enter()
                    .append('circle')
                    .attr('cx',(d)=>{return minixscale(d.TIME)})
                    .attr('cy',(d)=>{return miniyscale(d.TEXTBLOB)})
                    .transition()
                    .delay(function(d,i){return i*10})
                    .attr('r',3)
                    .style('fill',color2) 

        convgraph.append('circle')
                   .attr('cx',10)
                   .attr('cy',200)
                   .attr('r',8)
                   .attr('fill',color1)

        convgraph.append('circle')
                   .attr('cx',10)
                   .attr('cy',250)
                   .attr('r',8)
                   .attr('fill',color2)
               
        convgraph.append('text')
        .text('VADAR Sentiment Score')
        .attr('dx',30)
        .attr('dy',205)
        .attr('fill',whiteline)
        .style('font-family','News Cycle')

        convgraph.append('text')
        .text('TEXTBLOB Sentiment Score')
        .attr('dx',30)
        .attr('dy',255)
        .attr('fill',whiteline)
        .style('font-family','News Cycle')
                     
        
            }  
            
function uncertaintywave(){
    console.log('hi')

    d3.selectAll('.vadarcircle')
    .selectAll('circle')
    .transition()
    .duration(500)
    .attr('cy',(d)=>{return miniyscale(d.TEXTBLOB)})
    .transition()
    .duration(500)
    .attr('cy',(d)=>{return miniyscale(d.VADAR)})
    .transition()
    .duration(500)
    .attr('cy',(d)=>{return miniyscale(d.TEXTBLOB)})
    .transition()
    .duration(500)
    .attr('cy',(d)=>{return miniyscale(d.VADAR)})
    .transition()
    .duration(500)
    .style('opacity',0)


    d3.selectAll('.textblobcircle')
    .selectAll('circle')
    .transition()
    .duration(500)
    .attr('cy',(d)=>{return miniyscale(d.VADAR)})
    .transition()
    .duration(500)
    .attr('cy',(d)=>{return miniyscale(d.TEXTBLOB)})
    .transition()
    .duration(500)
    .attr('cy',(d)=>{return miniyscale(d.VADAR)})
    .transition()
    .duration(500)
    .attr('cy',(d)=>{return miniyscale(d.TEXTBLOB)})
    .transition()
    .duration(500)
    .style('opacity',0)

    setTimeout(arrowshowing,2500)

    function arrowshowing(){
    d3.select('.uncertaintyanimation').select('svg')
    .append('path')
    .attr('d',"M0,0L30,50L0,100L0,0")
    // .on('click',gotomain)
    // .attr('transform','translate(250,0)')
    .style('fill',whiteline)
    .attr('transform','scale(0.6)')

    d3.select('#lasttext').style('display','block')

    }
}


})

