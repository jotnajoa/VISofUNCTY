
    areas = d3.area()
    .x(function(d){return margin+xscale(d.date)})
    .y0(function(d){return height-yscale(d.vader)})
    .y1(function(d){return height-yscale(d.textblob)})
    .curve(d3.curveStepBefore)

    //이렇게 하지말고, sdata2도 만들었으니까 2->1->0 반복하는
    // 무한반복 on('end','repeat') loop를 만들어보자.
    
    uarea=area.append('path').attr('class','areagraph')