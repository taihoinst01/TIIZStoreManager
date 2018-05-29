
  var myDiagram, myDiagram_hist;

  $(document).ready(function() {

    // div 초기화
    init_div();
    init_div_one();

    data_initialize();

    $("#myDiagramDiv").show();
    $("#myDiagramDiv_hist").hide();

  });

  function init_div() {
    //if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
      $(go.Diagram, "myDiagramDiv",
        /**  */
        {
          mouseOver: function(e) {
              var xx = e.viewPoint.x + 110;
              var yy = e.viewPoint.y + 45;
              console.log("hist.push(new go.Point(" + xx + ","+ yy +"));");
              //console.log(e.viewPoint)
              //console.log(e.viewPoint.toString())
        }},
        {
          initialContentAlignment: go.Spot.TopLeft,
          isReadOnly: true,  // allow selection but not moving or copying or deleting
          scaleComputation: function(d, newsc) {
            // only allow scales that are a multiple of 0.1
            var oldsc = Math.round(d.scale * 10);
            var sc = oldsc + ((newsc * 10 > oldsc) ? 1 : -1);
            if (sc < 1) sc = 1;  // but disallow zero or negative!
            return sc / 10;
          },
          "toolManager.hoverDelay": 100  // how quickly tooltips are shown
        });

    // the background image, a floor plan
    myDiagram.add(
      $(go.Part,  // this Part is not bound to any model data
        { layerName: "Background", position: new go.Point(0, 0),
          selectable: false, pickable: false },
        //$(go.Picture, "https://upload.wikimedia.org/wikipedia/commons/9/9a/Sample_Floorplan.jpg") /** 842 * 569 */
        // $(go.Picture, "images/Sample_Floorplan.jpg") /** 842 * 569 */
        $(go.Picture, "./img/bg.png") /** 842 * 569 */
      ));

    // the template for each kitten, for now just a colored circle
    myDiagram.nodeTemplate =
      $(go.Node,
        new go.Binding("location", "loc"),  // specified by data
        { locationSpot: go.Spot.Center },   // at center of node
//          $(go.Shape, "Circle",
//            { width: 40, height: 40, strokeWidth: 3 },
//            new go.Binding("fill", "color", makeFill),
//            new go.Binding("stroke", "color", makeStroke)
//            ),  // also specified by data
        $(go.Picture, { margin: 3 },
          new go.Binding("source", "src", function(s) { return "images/" + s + ".png"; })),
        { // this tooltip shows the name and picture of the kitten
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "#58ACFA" }),
              $(go.Panel, "Horizontal",
                
                  $(go.Panel, "Table",{
                    maxSize: new go.Size(200, 1500),
                    margin: new go.Margin(6, 10, 0, 3),
                    defaultAlignment: go.Spot.Center
                  },
                  $(go.RowColumnDefinition, { column: 3, width: 4 }),
                  $(go.Picture,  // the name
                  {
                    row: 0, column: 0, 
                  },
                  new go.Binding("source", "src", function(s) { return "images/" + s + ".png"; })),
                  $(go.TextBlock, textStyle(),
                  {
                    row: 1, column: 0, 
                    font: "14pt Segoe UI,sans-serif",
                    editable: true, isMultiline: false,
                    minSize: new go.Size(10, 16)
                  },
                  new go.Binding("text", "key").makeTwoWay()),
                  $(go.TextBlock, textStyle(),
                  {
                    row: 0, column: 1, 
                    font: "12pt Segoe UI,sans-serif",
                    editable: true, isMultiline: false,
                    minSize: new go.Size(10, 16)
                  },
                  new go.Binding("text", "sex").makeTwoWay()),
                  $(go.TextBlock, textStyle(),
                  {
                    row: 0, column: 2,
                    font: "12pt Segoe UI,sans-serif",
                    editable: true, isMultiline: false,
                    minSize: new go.Size(10, 16)
                  },
                  new go.Binding("text", "age").makeTwoWay()),
                  $(go.TextBlock, 
                  {
                    row: 1, column: 1,
                    font: "12pt Segoe UI,sans-serif",
                    editable: true, isMultiline: false,
                    minSize: new go.Size(10, 16),
                    margin: new go.Margin(0, 0, 0, 6)
                  },
                  new go.Binding("text", "curr_car").makeTwoWay()),
                  $(go.TextBlock, 
                  {
                    row: 1, column: 2,
                    font: "12pt Segoe UI,sans-serif",
                    editable: true, isMultiline: false,
                    minSize: new go.Size(10, 16),
                    margin: new go.Margin(0, 0, 0, 12)
                  },
                  new go.Binding("text", "inst_car").makeTwoWay()),
                )

                  
              )
            )  // end Adornment
        }
      );

      ////////////////////////////////////
    myDiagram.addDiagramListener("ObjectSingleClicked",
          function(e) {
            var part = e.subject.part;
            // View 표시 변환
              show_hist(part.data.key);
            // if (!(part instanceof go.Link)) showMessage("Clicked on " + part.data.key);
          });
      ////////////////////////////////////

//      // pretend there are four kittens
//      myDiagram.model.nodeDataArray = [
//        { key: "Alonzo", src: "HS1", loc: new go.Point(220, 130), color: 2, hist: [], hist_idx: 0, sex: "man", age: 34, curr_car: "sonata", inst_car: "grandeur" },
//        // key: "Alonzo", src: "HS1", loc: new go.Point(220, 130), color: 2, hist: [], hist_idx: 0, sex: "man", age: 34, curr_car: "sonata", inst_car: "grandeur" },
//        //{ key: "Alonzo", src: "50x40", loc: new go.Point(220, 130), color: 2, hist: [], hist_idx: 0, sex: "man", age: 34, curr_car: "sonata", inst_car: "grandeur" },
////         { key: "Coricopat", src: "55x55", loc: new go.Point(420, 250), color: 4, hist: [], hist_idx: 0, sex: "man", age: 34, curr_car: "sonata", inst_car: "grandeur" },
////         { key: "Garfield", src: "60x90", loc: new go.Point(640, 450), color: 6, hist: [], hist_idx: 0, sex: "man", age: 34, curr_car: "sonata", inst_car: "grandeur" },
////         { key: "Demeter", src: "80x50", loc: new go.Point(140, 350), color: 8, hist: [], hist_idx: 0, sex: "man", age: 34, curr_car: "sonata", inst_car: "grandeur" },
////         { key: "HS3", src: "HS3", loc: new go.Point(160, 370), color: 1, hist: [], hist_idx: 0, sex: "man", age: 34, curr_car: "sonata", inst_car: "grandeur" },
////         { key: "HS4", src: "HS4", loc: new go.Point(170, 380), color: 2, hist: [], hist_idx: 0, sex: "man", age: 34, curr_car: "sonata", inst_car: "grandeur" },
////         { key: "HS5", src: "HS5", loc: new go.Point(180, 390), color: 3, hist: [], hist_idx: 0, sex: "man", age: 34, curr_car: "sonata", inst_car: "grandeur" },
////         { key: "HS6", src: "HS6", loc: new go.Point(190, 400), color: 4, hist: [], hist_idx: 0, sex: "man", age: 34, curr_car: "sonata", inst_car: "grandeur" }
//      ];
//
////      var data = myDiagram.model.findNodeDataForKey(key_param);
//      var Alonzo = myDiagram.model.findNodeDataForKey("Alonzo");
//      var hist = Alonzo.hist;
//      var xx = 220, yy = 130;
//      for (var i = 0; i < 100; i++) {
//          xx = xx + 10;
//          yy = yy + 10;
//          hist.push(new go.Point(xx, yy));
//      }

    //////////////////////////////////////

    function textStyle() {
      return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
    }

    // simulate some real-time position monitoring, once every 2 seconds
    function randomMovement() {
      var model = myDiagram.model;
      model.startTransaction("update locations");
      var arr = model.nodeDataArray;
      var picture = myDiagram.parts.first();

      for (var i = 0; i < arr.length; i++) {
        var data = arr[i];
        var pt = data.loc;

        // history 관련 비표시
        var key = data.key;
        if (key.indexOf("_hist_") >= 0) {
          break;
        }

        /////////////////////////////////////
        /////////////////////////////////////
        /////////////////////////////////////
        var hist = data.hist;
        var hist_idx = data.hist_idx;
        //hist.push(pt);

          /** TODO : 삭제
          for (var kk = 0; kk < hist.length; kk++) {
              // console.log("hist[kk].x:" + hist[kk].x);
              // console.log("hist[kk].y:" + hist[kk].y);
            // myDiagram.model.addNodeData({ key: "hist_Coricopat"+hist[kk].x, src: "", loc: hist[kk], color: data.color});
            myDiagram.model.addLinkData({ key: key + "_hist_" + kk, src: "", loc: hist[kk], color: data.color});
          }
            */

          hist_idx = Number(hist_idx) + 1;
          if (hist.length == hist_idx) hist_idx = 0;
        model.setDataProperty(data, "hist", hist);
        model.setDataProperty(data, "hist_idx", hist_idx);
        /////////////////////////////////////
        /////////////////////////////////////
        model.setDataProperty(data, "loc", hist[hist_idx]);
        /////////////////////////////////////

        /** 랜덤 기능 삭제
        var x = pt.x + 20 * Math.random() - 10;
        var y = pt.y + 20 * Math.random() - 10;
        // make sure the kittens stay inside the house
        var b = picture.actualBounds;
        if (x < b.x || x > b.right) x = pt.x;
        if (y < b.y || y > b.bottom) y = pt.y;
        model.setDataProperty(data, "loc", new go.Point(x, y));
          */
      }
      model.commitTransaction("update locations");
    }
    function loop() {
      setTimeout(function() { randomMovement(); loop(); }, 100);
    }
    loop();  // start the simulation

    // generate some colors based on hue value
    function makeFill(number) {
      return HSVtoRGB(0.1 * number, 0.5, 0.7);
    }
    function makeStroke(number) {
      return HSVtoRGB(0.1 * number, 0.5, 0.5); // same color but darker (less V in HSV)
    }
    function HSVtoRGB(h, s, v) {
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return 'rgb(' +
            Math.floor(r * 255) + ',' +
            Math.floor(g * 255) + ',' +
            Math.floor(b * 255) + ')';
    }
  }

  function init_div_one() {

    //////////////////////////////////////
    //if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram_hist =
      $(go.Diagram, "myDiagramDiv_hist",
        {
          initialContentAlignment: go.Spot.TopLeft,
          isReadOnly: true,  // allow selection but not moving or copying or deleting
          scaleComputation: function(d, newsc) {
            // only allow scales that are a multiple of 0.1
            var oldsc = Math.round(d.scale * 10);
            var sc = oldsc + ((newsc * 10 > oldsc) ? 1 : -1);
            if (sc < 1) sc = 1;  // but disallow zero or negative!
            return sc / 10;
          },
          "toolManager.hoverDelay": 100  // how quickly tooltips are shown
        });

    // the background image, a floor plan
    myDiagram_hist.add(
      $(go.Part,  // this Part is not bound to any model data
        { layerName: "Background", position: new go.Point(0, 0),
          selectable: false, pickable: false },
        //$(go.Picture, "https://upload.wikimedia.org/wikipedia/commons/9/9a/Sample_Floorplan.jpg") /** 842 * 569 */
        // $(go.Picture, "images/Sample_Floorplan.jpg") /** 842 * 569 */
        $(go.Picture, "./img/bg.png") /** 842 * 569 */
      ))

    // the template for each kitten, for now just a colored circle
    myDiagram_hist.nodeTemplate =
      $(go.Node,
        new go.Binding("location", "loc"),  // specified by data
        { locationSpot: go.Spot.Center },   // at center of node
        $(go.Shape, "Circle",
          { width: 5, height: 5, strokeWidth: 3 },
          new go.Binding("fill", "color", makeFill),
          new go.Binding("stroke", "color", makeStroke)
          ),  // also specified by data
        { // this tooltip shows the name and picture of the kitten
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "lightyellow" }),
              $(go.Panel, "Vertical",
                $(go.Picture, { margin: 3 },
                  new go.Binding("source", "src", function(s) { return "images/" + s + ".png"; })),
                $(go.TextBlock, { margin: 3 },
                  new go.Binding("text", "key"))
              )
            )  // end Adornment
        }
      );

      ////////////////////////////////////

    myDiagram_hist.addDiagramListener("ObjectSingleClicked",
          function(e) {
            var part = e.subject.part;
            // View 표시 변환
              show_div();
              
            // if (!(part instanceof go.Link)) showMessage("Clicked on " + part.data.key);
          });
      
      ////////////////////////////////////
      myDiagram_hist.addDiagramListener("BackgroundSingleClicked",
          function (e) {
              // View 표시 변환
              show_div();
          });
      ////////////////////////////////////

    // pretend there are four kittens
    myDiagram_hist.model.nodeDataArray = [];

    // generate some colors based on hue value
    function makeFill(number) {
      return HSVtoRGB(0.1 * number, 0.5, 0.7);
    }
    function makeStroke(number) {
      return HSVtoRGB(0.1 * number, 0.5, 0.5); // same color but darker (less V in HSV)
    }
    function HSVtoRGB(h, s, v) {
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return 'rgb(' +
            Math.floor(r * 255) + ',' +
            Math.floor(g * 255) + ',' +
            Math.floor(b * 255) + ')';
    }

    }

  // 사용자맵 보여주기
  function show_div() {
    $("#myDiagramDiv").show();
    $("#myDiagramDiv_hist").hide();
  }

  // 동선 보여주기
  function show_hist(key_param) {

    // myDiagram_hist.model.removeNodeData()
    myDiagram_hist.model.nodeDataArray = []

    var data = myDiagram.model.findNodeDataForKey(key_param);
    var hist = data.hist;
    var key = data.key;
    for (var kk = 0; kk < hist.length; kk++) {
      myDiagram_hist.model.addNodeData({ parent: key, to:key + "_hist_" + kk, key: key + "_hist_" + kk, src: "", loc: hist[kk], color: data.color});
    }

    // change div
    $("#myDiagramDiv").hide();
    $("#myDiagramDiv_hist").show();
  }
