var vertexNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q",  "R", "S", "T", "U", "V", "W", "X", "Y", "Z", ];

function graphEditor_load() {
  document.getElementById("drawButton").addEventListener("click", draw, false);
  document.getElementById("addVertexButton").addEventListener("click", function () {
    operation = "addVertex";
    output.setAttribute("operation", "addVertex");
  }, false);
  document.getElementById("renameVertexButton").addEventListener("click", function () {
    operation = "renameVertex";
    output.setAttribute("operation", "renameVertex");
  }, false);
  document.getElementById("addEdgeButton").addEventListener("click", function () {
    operation = "addEdge";
    output.setAttribute("operation", "addEdge1");
  }, false);
}

var operation = "dragVertex";
var verticePositions = {};

function outputDown(e) {
  if (operation == "addVertex") {
    addVertex(e);
  }
}

function vertexDown(e) {
  if (operation == "dragVertex") {
    dragVertexStart(e);
  } else if (operation == "renameVertex") {
    renameVertex(e);
  } else if (operation == "addEdge") {
    addEdge(e);
  }
}

"REGION: dragVertex";
  var draggedVertexName = "";

  function dragVertexStart(e) {
    draggedVertexName = graph.vertices[parseInt(e.srcElement.getAttribute("id"))].name;
    graphics.addEventListener("mousemove", dragVertexMove, false);
    graphics.addEventListener("mouseup", dragVertexEnd, false);
  }

  function dragVertexMove(e) {
    verticePositions[draggedVertexName] = {
      x: e.clientX,
      y: e.clientY
    };
    draw();
  }

  function dragVertexEnd(e) {
    graphics.removeEventListener("mousemove", dragVertexMove, false);
    graphics.removeEventListener("mouseup", dragVertexEnd, false);
    
    draggedVertexName = "";
    
    draw();
  }

"REGION: renameVertex";
  function renameVertex(e) {
    var currentVertex = graph.vertices[parseInt(e.srcElement.getAttribute("id"))];
    var newName = prompt("New name:");
    
    verticePositions[newName] = verticePositions[currentVertex.name];
    delete verticePositions[currentVertex.name];
    
    currentVertex.name = newName;
    
    output.setAttribute("operation", "dragVertex");
    operation = "dragVertex";
    
    draw();
  }

"REGION: addVertex";
  function addVertex(e) {
    var currentVertexName = vertexNames.pop();
    graph.addVertex(currentVertexName);
    
    verticePositions[currentVertexName] = {
      x: e.clientX,
      y: e.clientY
    };
    
    output.setAttribute("operation", "dragVertex");
    operation = "dragVertex";
    
    draw();
  }

"REGION: addEdge";
  var addEdgeVertices = [];
  function addEdge(e) {
    addEdgeVertices.push(graph.vertices[parseInt(e.srcElement.getAttribute("id"))].name);
    
    output.setAttribute("operation", "addEdge2");
    
    if (addEdgeVertices.length == 2) {
      graph.addEdge(...addEdgeVertices);
      
      addEdgeVertices = [];
      
      output.setAttribute("operation", "dragVertex");
      operation = "dragVertex";
      
      draw();
    }
  }

function draw() {
  while (graphics.firstChild) {
    graphics.removeChild(graphics.firstChild);
  }
  
  for (var currentVertex of graph.vertices) {
    if (!(currentVertex.name in verticePositions)) {
      var cx = Math.random() * graphics.clientWidth;
      var cy = Math.random() * (graphics.clientHeight - 150) + 150;
      verticePositions[currentVertex.name] = {x: cx, y:cy};
    }
  }
  
  for (var currentEdge of graph.edges) {
    var currentEdgeLine = document.createElementNS(svgNS, "line");
    
    currentEdgeLine.setAttribute("id", graph.edges.indexOf(currentEdge));
    
    currentEdgeLine.setAttributeNS(null, "x1", verticePositions[currentEdge.vertices[0].name].x);
    currentEdgeLine.setAttributeNS(null, "y1", verticePositions[currentEdge.vertices[0].name].y);
    
    currentEdgeLine.setAttributeNS(null, "x2", verticePositions[currentEdge.vertices[1].name].x);
    currentEdgeLine.setAttributeNS(null, "y2", verticePositions[currentEdge.vertices[1].name].y);
    
    graphics.appendChild(currentEdgeLine);
  }
  
  for (var currentVertex of graph.vertices) {
    // var currentVertexGroup = document.createElementNS(svgNS, "g");
    
    var currentVertexCircle = document.createElementNS(svgNS, "circle");
    
    currentVertexCircle.setAttribute("id", graph.vertices.indexOf(currentVertex));
    
    if (draggedVertexName == currentVertex.name) {
      currentVertexCircle.style.r = 12.5;
    }
    
    currentVertexCircle.setAttributeNS(null, "cx", verticePositions[currentVertex.name].x);
    currentVertexCircle.setAttributeNS(null, "cy", verticePositions[currentVertex.name].y);
    
    currentVertexCircle.addEventListener("mousedown", vertexDown, false);
    
    graphics.appendChild(currentVertexCircle);
    
    // currentVertexGroup.appendChild(currentVertexCircle);
    // graphics.appendChild(currentVertexGroup);
    
    
    var currentVertexLabel = document.createElementNS(svgNS, "text");
    
    currentVertexLabel.setAttributeNS(null, "id", graph.vertices.indexOf(currentVertex));
    
    currentVertexLabel.setAttributeNS(null, "x", verticePositions[currentVertex.name].x - 5);
    currentVertexLabel.setAttributeNS(null, "y", verticePositions[currentVertex.name].y + 5);
    
    var currentVertexLabelText = document.createTextNode(currentVertex.name);
    currentVertexLabel.classList.add("noselect");
    currentVertexLabel.appendChild(currentVertexLabelText);
    
    graphics.appendChild(currentVertexLabel);
  }
  
  output.setAttribute("operation", "dragVertex");
}
