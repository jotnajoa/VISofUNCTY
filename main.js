var svg; var xscale; var yscale;
var sdata; var xaxis; var yaxis;
const M={t:10,r:10,b:10,l:10};
const width=$(".canvas").width()*0.95
      height=$(".canvas").height()

// var width=800; var height=400; 

var margin=10;
var duration =250; var vader ='vader'; var textblob='textblob';
var delay =5000; var areas; var circles1,circles2;
var sdata1,sdata2
var brush;
var uarea
var color1, color2;
var color1b,color2b;
var extent;
var clearcolor
var cyscale
var linegraph
var lineGenerator
var yr;
var whiteline;
var dummyarray=[];
var axisarray=[]

dummyarray=[
    [40,50],[45,30],[55,40],[60,25],[70,15],[84,45],[90,40]]
axisarray=[
    [40,37],[90,37]
]
var legendsymbol=
  d3.select('.legendsymbol3').append('rect')
  .attr('x',200).attr('y',0)
  .attr('width',3).attr('height',70)
  .attr('fill','rgba(82, 229, 255, 0.445)')

  d3.select('.legendsymbol3').append('line').classed('dashline',true)
  .attr('x1',235).attr('y1',20)
  .attr('x2',235).attr('y2',50)
  .style('stroke','rgba(221, 221, 221, 0.8)')

var legendgraph=
d3.select('.legendsymbol4').append('path')
  .datum(dummyarray)
  .attr('d',d3.line())
  .attr('stroke','rgba(221, 221, 221, 0.7)')
  .attr('fill','none')
  .attr('stroke-width',0.8)
  .attr('transform','scale(2) translate(0,10)')

var graphsaxis=
  d3.select('.legendsymbol4').append('path')
  .datum(axisarray)
  .attr('d',d3.line())
  .attr('stroke','rgba(221, 221, 221, 0.5)')
  .attr('fill','none')
  .attr('stroke-width',0.8)
  .attr('transform','scale(2) translate(0,7)')


  function movingleg1(){
    legendsymbol
    .transition()
    .duration(800)
    .attr('height',10)
    .transition()
    .duration(800)
    .attr('height',70)
    .on('end',movingleg1)
}
 
  movingleg1()



    
    // files[0] will contain file1.csv
    // files[1] will contain file2.csv


//
// var arrowcoord=[
//     [0,0],[30,50],[0,100],[0,0]
// ];
// setTimeout(arrows,5000)
// function arrows(){
//             d3.select('.pagearrow').append('svg')
//              .append('path')     
//              .datum(arrowcoord)
//             .attr('d',d3.line()
//             .x(function(d){return d[0]})
//             .y(function(d){return d[1]})
//             )
//             }

svg=d3.select('.canvas').append('svg').attr('width',width).attr('height',height).append('g')
sidebar();
Promise.all([
    d3.csv('./tweetdata.csv'),
    d3.csv('./surveydata.csv'),
]).then(function(data) {
    whiteline='rgba(255, 255, 255, 0.397)'
    color1='rgba(242, 118, 51, 0.886)'
    color2='rgba(212, 209, 51, 0.76)'
    color1b='rgba(242, 118, 51, 0.886)'
    color2b='rgba(112, 99, 230, 0.828)'
    clearcolor='rgba(189, 189, 189, 0.355)'
    var parser = d3.timeParse("%m/%d/%y")
    
    // Conventional Data processing

    //lock the pages
    d3.select('.canvas').attr('overflow-y','hidden')

    // d3.select('.forceLink').style('display','none')
    // d3.select('.forceX').style('display','none')
    //
    cdata= data[1];

    cdata.forEach(function(d){
        d.ICS= +d.ICS;
        d.ICC= + d.ICC;
        d.ICE = +d.ICE;
        d.Year = +d.Year;
        d.Time=parser(d.Time) 
    })
    yr=8

    // cdata= cdata.filter(function(d){d.Year==yr});


    // data를 처리했고, date parser 하는 법 다시한번 명심하자.
    sdata = data[0];
    sdata.forEach(function(d){
        d.vader = +d.vader;
        d.textblob= + d.textblob;
        d.date=parser(d.date)
        
    })
   
  

    // scale을 정해야 함. 나중에 brushable한 범위로 고쳐야함. nice()안하면 정렬도안되고, 첫번째 엔트리 미싱이고
    // 난리도 아님.

    //xscale은 모두 적용해도 둘다 날짜라서 문제없음.
    //yscale은 제 정의해야함.

    xscale=d3.scaleTime()
    .domain(d3.extent(sdata.filter( (d)=>d.Year==7 ), function(d) {return d.date }))
    .range([0,width*9/10])
    .nice()


    
    

    yscale =d3.scaleLinear()
    .domain(d3.extent([-1,1]))
    .range([height*4/5,height*1/5])
    .nice()
    
    //현재는 ICS로 해놨지만, 변경가능하게, interactive하게 바꿔줄 필요가있다.
    cyscale = d3.scaleLinear()
    .domain(d3.extent(cdata,function(d) {return d.ICS})) //이 부분 나중에 변경할 수 있도록 해줘야함.
    .range([height*4/5,height*1/5])
    .nice()

    
    //yaxis는 필요 없을 것 같은데.

    //캔버스에 축을 그려야 함 단, translate해서 중간에 걸치게 해야함.

    xaxis=svg.append('g').attr('class','xaxis')
       .call(d3.axisBottom(xscale))
       .attr('transform','translate('+margin+','+height*1/2+')')

    //path-clip 가능하도록 기능추가


    //클립패쓰, 써클 그래프, 브러쉬 모두 하나의 캔버스에 적용해야함.
    //새로운 그래프도 renderarea에 그려져야함.
    
    var renderarea = svg.append('g').attr('class','renderarea')
    
  
    // var linegraph = renderarea.attr('class','linegraph') 이게 워크아웃을 안하네??

    var circles = renderarea.attr('class','circles')
    var area = renderarea.attr('class','pathline')
    //brush를 그 캔버스에 적용

    


                   
    firststage();    
    //generator로 데이터를 하나씩 떨어뜨리도록 한다.
    function firststage(){
    function* vaderdropping(data){
        for( let i=0;i<355;i++){

            //원래는 data.length 였는데, 355로 바꿀까 아니면 조건을 넣을까.

            if( i%25==0) yield svg.node();

            let cx = margin+xscale(data[i].date)
            let cy = height-yscale(data[i].vader)

        circles1=circles.append('circle')
               .attr('class','circles1')
               .attr('cx',cx)
               .attr('cy',0)
               .transition()
               .duration(duration)
               .ease(d3.easeBounce)
               .attr('cy',cy)
               .attr('r',2)
               .style('fill',color1)   
        }     
        yield svg.node()    

    }
    //generator 돌리는 부분
    
    
    let vadergen = vaderdropping(sdata);
    let result = vadergen.next()
    let interval = setInterval(function(){
        if(!result.done) {
          vadergen.next();
        }
        else {
         clearInterval(interval)
         
        }
     }, 100);
    
     //pathgraph





    lineGenerator = d3.line()
                          .x(function(d){return margin+xscale(d.Time)})
                          .y(function(d){return height-cyscale(d.ICS)})


// 데이텀안먹이고, lineGenerator(cdata) 하면되고, data(cdata)하면 안되네?

    

  
setTimeout(secondstage,500)
}
    

     function secondstage(){
     function* textblobdropping(data){
        for( let i=0;i<355;i++){

            //data.length 였는데 편의상, 355로 바꾸자 07년만 보여주는거니
            if( i%25==0) yield svg.node();

            let cx = margin+xscale(data[i].date)
            let cy = height-yscale(data[i].textblob)

        circles2=circles.append('circle')
               .attr('class','circles2')
               .attr('cx',cx)
               .attr('cy',0)
               .transition()
               .duration(duration)
               .ease(d3.easeBounce)
               .attr('cy',cy)
               .attr('r',2)
               .style('fill',color2)   
        }     
        yield svg.node()    

    }
    //generator 돌리는 부분
    
    let textblobgen = textblobdropping(sdata);
    let tresult = textblobgen.next()
    let tinterval = setInterval(function(){
        if(!tresult.done) {
          textblobgen.next();
        }
        else {
         clearInterval(tinterval)
        
        }
     }, 100);

     setTimeout(thirdstage,2000)


    }

    function thirdstage(){
        function drawline(){
            linegraph=renderarea
               .append('path')
               .attr('class','linegraph')
        
        
               .datum(cdata.filter(function(d){return d.Year==7}))
               .attr('d',d3.line()
               .x(function(d){return margin+xscale(d.Time)})
               .y(function(d){return height-cyscale(d.ICS)}))
        
        
        
               .attr('fill','none')
               .attr("stroke-linejoin", "round")
               .attr("stroke-linecap", "round")
               .attr('stroke','rgba(230, 230, 230, 0.239)')
               .attr('stroke-width',0.5)
            //    .node().getTotalLength() 
            // 가 뭔가 하고있군. 나중에 알아보고
        
        
            const pathLength = linegraph.node().getTotalLength();
            // 트렌지션을 커스터마이징하고
            
            const transitionPath = d3
              .transition()
              .ease(d3.easeSin)
              .duration(2000); 
            
              //   여기서 애니메이션이 일어나는것임
          linegraph
          .attr("stroke-dashoffset", pathLength)
          .attr("stroke-dasharray", pathLength)
          .transition(transitionPath)
          .attr("stroke-dashoffset", 0)
          .attr('stroke-width',0.5)
          .attr('stroke',whiteline)
               
            }
        
         drawline();
         setTimeout(fourthstage,2000)
        }
        //진동을 만들기 위해서, 
        //베이다와 텍스트 블랍 값을 플립한거다 (제발 워크 아웃하길...)
        //그 다음 트윈으로 sdata 와 sdata1을 왔다갔다 하게하면 되지않을까?
        function fourthstage(){
             sdata1 = sdata.map(function(x){
                var y={};
                y['date']=x.date;
                y['vader']=x.textblob;
                y['textblob']=x.vader;
                return y});
             sdata2 = sdata.map(function(x){
                
                var y={};
                    y['date']=x.date;
                    y['vader']=0;
                    y['textblob']=0;
                    return y});
      
           
            
            



            
            //areas는 일종의 함수다, 에리아에다가 데이터를 먹이면,
            //에리아를 그리는 역할을 하는것임.

            areas = d3.area()
            .x(function(d){return margin+xscale(d.date)})
            .y0(function(d){return height-yscale(d.vader)})
            .y1(function(d){return height-yscale(d.textblob)})
            .curve(d3.curveStepBefore)

            //이렇게 하지말고, sdata2도 만들었으니까 2->1->0 반복하는
            // 무한반복 on('end','repeat') loop를 만들어보자.
            
            uarea=area.append('path').attr('class','areagraph')
            setTimeout(repeat,500)
            
            function repeat(){
            uarea
            // .style('fill','rgba(1, 60, 230, 0.3)')  
            .attr('d', areas( sdata.filter( function(d){return d.Year==7} )  ) )
            .attr('fill','rgba(10,10,10,0.2)')
            .transition()
            .duration(900)
            .attrTween('d',function(){
                var interpolator=d3.interpolateArray(sdata,sdata1);
                return function(t){
                    return areas(interpolator(t))
                }
            })
            // .transition()
            // .duration(500)
            // .attrTween('d',function(){
            //     var interpolator=d3.interpolateArray(sdata1,sdata2);
            //     return function(t){
            //         return areas(interpolator(t))
            //     }
            // })
            .transition()
            .duration(900)
            .attrTween('d',function(){
                var interpolator=d3.interpolateArray(sdata1,sdata);
                return function(t){
                    return areas(interpolator(t))
                }
            })
            .on('end',repeat)
            }
            setTimeout(fifthstage,500)
    }
        //fourth stage는 원들을 움직이게 하는 함수인데, 이것은 optional



        function fifthstage(){
           d3.selectAll('.circles1').remove()
           d3.selectAll('.circles2').remove()


            // d3.selectAll('circle').remove()
            // console.log(d3.selectAll('circle#circles1').node())
            // d3.selectAll('circle').remove()

            circles1= renderarea.append('g').selectAll('circle').data(sdata)
                    .enter().append('circle').classed('circles1',true)
                    .attr('cx',function(d){return margin+xscale(d.date)})
                    .attr('cy',function(d){return height-yscale(d.vader)})
                    .style('fill',clearcolor)
                    .attr('r',0)
            
            circles2= renderarea.append('g').selectAll('circle').data(sdata)
            .enter().append('circle').classed('circles2',true)
            .attr('cx',function(d){return margin+xscale(d.date)})
            .attr('cy',function(d){return height-yscale(d.textblob)})
            .style('fill',clearcolor)
            .attr('r',0)

            

            // d3.interval(()=>{
            // d3.selectAll('.circles1')
            //   .transition()
            //   .duration(500)     
    
            //    .attr('cy',function(d, i){
            //         return height-yscale(sdata1[i].vader)
            //     })
            //       .transition()
            //       .duration(500)     

            //        .attr('cy',function(d, i){
            //             return height-yscale(sdata[i].vader)
            //         })
            //     },1500)
            
            //     d3.interval(()=>{
            //         d3.selectAll('.circles2')
            //           .transition()
            //           .duration(500)     
            
            //            .attr('cy',function(d, i){
            //                 return height-yscale(sdata1[i].textblob)
            //             })
            //               .transition()
            //               .duration(500)     
        
            //                .attr('cy',function(d, i){
            //                     return height-yscale(sdata[i].textblob)
            //                 })
            //             },1500)
                
            setTimeout(sixthstage,500)
        }

        function sixthstage(){
            // d3.select('.forceLink').style('display','block')
            // d3.select('.forceX').style('display','block')

        var clip = svg.append('clipPath')
        .attr('id','clip')
        .append('rect')//없어도 될것 같음
        .attr('width',width)
        .attr('height',height)
        .attr('x',margin)
        .attr('y',0)
        // .style('fill','navy')

// //Brush specification 정하기. 범위& 브러쉬 된 후 실행할 것
        brush = d3.brushX()
        .extent([[margin,0],[width+margin,height]])
        .on('end',updateChart)

        renderarea.attr('clip-path',"url('#clip')")
        renderarea.append('g').attr('class','brush')
        .call(brush);

      
        

        function updateChart(){
            d3.selectAll('circle').style('display','block')
            circles1.style('fill',color1).attr('r',4)
            circles2.style('fill',color2).attr('r',4)
            // d3.selectAll('circle').remove()




            // d3.select('svg').transition().duration(400).style('background-color','rgb(0, 0, 0)')
            // d3.select('body').transition().duration(400).style('background-color','rgb(0, 0, 10)')
            extent = d3.event.selection
            d3.selectAll('.areagraph').style('display','none')

            
            
            // uarea.transition().duration(1000).remove()

            if(extent){
                xscale.domain([xscale.invert(extent[0]), xscale.invert(extent[1])])
                renderarea.select('.brush').call(brush.move,null)
               
            }

            xaxis.transition().duration(2000).call(d3.axisBottom(xscale))

                    circles1.classed('bigcircles1',true)
                    .transition().duration(900)
                       .attr('cx',function(d){return margin+xscale(d.date)})
                       .attr('cy',function(d){return height-yscale(d.vader)})
                    //    .style('fill',color1b)
                    //    .attr('r',2)
            
                    circles2.classed('bigcircles2',true)
                        .transition().duration(900)
                        .attr('cx',function(d){return margin+xscale(d.date)})
                        .attr('cy',function(d){return height-yscale(d.textblob)})
                        // .style('fill',color2b)
                        // .attr('r',2)
             
                    linegraph
                      .transition().duration(200)
                      .attr('d',lineGenerator(cdata))
                      .attr('fill','none')
                      .attr('stroke',whiteline)
                      .attr('stroke-width',5)
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                    

            d3.interval(()=>{
                circles1
                  .transition()
                  .duration(500)     
                    
                   .attr('cy',function(d, i){
                        return height-yscale(sdata1[i].vader)
                    })
                      .transition()
                      .duration(500)     
                
                       .attr('cy',function(d, i){
                            return height-yscale(sdata[i].vader)
                        })
                    },1200)
                            
            d3.interval(()=>{
                circles2
                  .transition()
                  .duration(500)     
                            
                   .attr('cy',function(d, i){
                        return height-yscale(sdata1[i].textblob)
                    })
                      .transition()
                      .duration(500)     
                        
                       .attr('cy',function(d, i){
                            return height-yscale(sdata[i].textblob)
                        })
                    },1200)

        }

    }
    const controller = new ScrollMagic.Controller();
    const yearChange =  new ScrollMagic.Scene({
        triggerElement:".forceLink"})
    
        .on("enter",(e)=>{

            yr=8;
            document.body.style.backgroundColor = 'none'
            update(yr)
          })
          .on("leave", (e)=>{                            
            document.body.style.backgroundColor = 'none'
        })
        .addTo(controller)
    
    })

function update(yr){

    d3.selectAll('.circles1').style('display','none')
    d3.selectAll('.circles2').style('display','none')

    updateAxis(yr)
    updateLine(yr)
    updateArea(yr)
    updateCircle(yr)


    // updateLine(yr);

    }



function updateAxis(yr){

    // d3.selectAll('circle').remove()

    xscale.domain(     

    d3.extent(cdata.filter( function(d){return d.Year==yr}    ), function(d) {return d.Time })

    )
    .range([0,width*9/10])
    .nice()

    xaxis
    .call(d3.axisBottom(xscale))
    }

    
       
      
function updateLine(yr){
    linegraph
    .datum(cdata.filter(function(d){return d.Year==yr}))
    .transition()
    .duration(1000)
    .attr('d',d3.line()
    // .transition()
    // .duration(300)
    .x(function(d){return margin+xscale(d.Time)})
    .y(function(d){return height-cyscale(d.ICS)})
    )
    .attr('fill','none')
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr('stroke-width',0.9)
    .duration(1000)
    .attr('stroke',whiteline)
    
    }

function updateArea(yr){

    // updaterepeat(yr)

    // function updaterepeat(yr){

    uarea
    // .transition()
    // .duration(1000)
    .attr('d', areas(sdata.filter((d)=>d.Year==yr)))
    d3.selectAll('.areagraph').style('display','block')

}

function updateCircle(yr){



    circles1
    .selectAll('circle')
    .remove()
    .exit()
    .selectAll('circle')
    .data(sdata.filter(function(d){return d.Year==yr}))
    .enter()
    .append('circle')
    .attr('cx',function(d){return margin+xscale(d.date)})
    .attr('cy',function(d){return height-yscale(d.vader)})
    .attr('r',0)
    

    
    circles2
    .selectAll('circle')
    .remove()
    .exit()
    .selectAll('circle')
    .data(sdata.filter(function(d){return d.Year==yr}))
    .enter()
    .append('circle')
    .attr('cx',function(d){return margin+xscale(d.date)})
    .attr('cy',function(d){return height-yscale(d.textblob)})
    .attr('r',0)

    // 이렇게 data만 바꿔치는게 가능할지? 혹은 지우고 다시 해야하는지 알아보쟈아.

}

function sidebar(){
    var line = d3.line()

    var vertcoord =[[0,0],[0,1000]]
    
    d3.select('.allDots').append('svg').append('rect')
      .attr('x',0)
      .attr('y',0)
      .attr('width',3)
      .attr('height',1000)
    //   .attr('stroke','#fff')
      .attr('fill','none')
    
    d3.select('.forceLink').append('svg').append('rect')
    .attr('x',0)
    .attr('y',0)
    .attr('width',3)
    .attr('height',1000)
    // .attr('stroke','#fff')
    .attr('fill','none')

    d3.select('.forceX').append('svg').append('rect')
    .attr('x',0)
    .attr('y',0)
    .attr('width',3)
    .attr('height',1000)
    // .attr('stroke','#fff')
    .attr('fill','none')


    


      

    //   .attr('stroke','rgba(200, 0, 255, 0.208)')
    //   .attr('stroke-width',1)
    
}


  
  
  


