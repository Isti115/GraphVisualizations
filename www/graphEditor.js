var vertexNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q",  "R", "S", "T", "U", "V", "W", "X", "Y", "Z", ];

function graphEditor_load() {
  document.getElementById("addVertexButton").addEventListener("click", function () {
    operation = "addVertex";
    output.setAttribute("operation", "addVertex");
  }, false);
  
  document.getElementById("renameVertexButton").addEventListener("click", function () {
    operation = "renameVertex";
    output.setAttribute("operation", "renameVertex");
  }, false);
  
  document.getElementById("removeVertexButton").addEventListener("click", function () {
    operation = "removeVertex";
    output.setAttribute("operation", "removeVertex");
  }, false);
  
  document.getElementById("addEdgeButton").addEventListener("click", function () {
    operation = "addEdge";
    output.setAttribute("operation", "addEdge1");
  }, false);
  
  document.getElementById("addSymmetricalEdgeButton").addEventListener("click", function () {
    operation = "addSymmetricalEdge";
    output.setAttribute("operation", "addEdge1");
  }, false);
}

var operation = "dragVertex";
var vertexPositions = {};

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
  } else if (operation == "removeVertex") {
    removeVertex(e);
  } else if (operation == "addEdge") {
    addEdge(e);
  } else if (operation == "addSymmetricalEdge") {
    addSymmetricalEdge(e);
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
    vertexPositions[draggedVertexName] = {
      x: e.clientX,
      y: e.clientY
    };
    reDraw();
  }

  function dragVertexEnd(e) {
    graphics.removeEventListener("mousemove", dragVertexMove, false);
    graphics.removeEventListener("mouseup", dragVertexEnd, false);
    
    draggedVertexName = "";
    
    reDraw();
  }

"REGION: addVertex";
  function addVertex(e) {
    var currentVertexName = vertexNames.pop();
    graph.addVertex(currentVertexName);
    
    vertexPositions[currentVertexName] = {
      x: e.clientX,
      y: e.clientY
    };
    
    output.setAttribute("operation", "dragVertex");
    operation = "dragVertex";
    
    reDraw();
  }

"REGION: renameVertex";
  function renameVertex(e) {
    var currentVertex = graph.vertices[parseInt(e.srcElement.getAttribute("id"))];
    var newName = prompt("New name:");
    
    vertexPositions[newName] = vertexPositions[currentVertex.name];
    delete vertexPositions[currentVertex.name];
    
    currentVertex.name = newName;
    
    output.setAttribute("operation", "dragVertex");
    operation = "dragVertex";
    
    reDraw();
  }

"REGION: removeVertex";
  function removeVertex(e) {
    var currentVertex = graph.vertices[parseInt(e.srcElement.getAttribute("id"))];
    
    vertexNames.push(currentVertex.name);
    delete vertexPositions[currentVertex.name];
    
    graph.removeVertex(currentVertex);
    
    output.setAttribute("operation", "dragVertex");
    operation = "dragVertex";
    
    reDraw();
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
      
      reDraw();
    }
  }

"REGION: addSymmetricalEdge";
  var addEdgeVertices = [];
  function addSymmetricalEdge(e) {
    addEdgeVertices.push(graph.vertices[parseInt(e.srcElement.getAttribute("id"))].name);
    
    output.setAttribute("operation", "addEdge2");
    
    if (addEdgeVertices.length == 2) {
      graph.addEdge(...addEdgeVertices, true);
      
      addEdgeVertices = [];
      
      output.setAttribute("operation", "dragVertex");
      operation = "dragVertex";
      
      reDraw();
    }
  }

function reDraw() {
  while (graphics.firstChild) {
    graphics.removeChild(graphics.firstChild);
  }
  
  for (var currentVertex of graph.vertices) {
    if (!(currentVertex.name in vertexPositions)) {
      var cx = Math.floor(Math.random() * graphics.clientWidth);
      var paddingTop = 200;
      var cy = Math.floor(Math.random() * (graphics.clientHeight - paddingTop) + paddingTop);
      vertexPositions[currentVertex.name] = {x: cx, y:cy};
    }
  }
  
  for (var currentEdge of graph.edges) {
    var currentEdgeLine = document.createElementNS(svgNS, "line");
    
    currentEdgeLine.setAttribute("id", graph.edges.indexOf(currentEdge));
    
    currentEdgeLine.setAttributeNS(null, "x1", vertexPositions[currentEdge.vertices[0].name].x);
    currentEdgeLine.setAttributeNS(null, "y1", vertexPositions[currentEdge.vertices[0].name].y);
    
    currentEdgeLine.setAttributeNS(null, "x2", vertexPositions[currentEdge.vertices[1].name].x);
    currentEdgeLine.setAttributeNS(null, "y2", vertexPositions[currentEdge.vertices[1].name].y);
    
    graphics.appendChild(currentEdgeLine);
  }
  
  for (var currentVertex of graph.vertices) {
    // var currentVertexGroup = document.createElementNS(svgNS, "g");
    
    var currentVertexCircle = document.createElementNS(svgNS, "circle");
    
    currentVertexCircle.setAttribute("id", graph.vertices.indexOf(currentVertex));
    
    if (draggedVertexName == currentVertex.name) {
      currentVertexCircle.style.r = 12.5;
    }
    
    currentVertexCircle.setAttributeNS(null, "cx", vertexPositions[currentVertex.name].x);
    currentVertexCircle.setAttributeNS(null, "cy", vertexPositions[currentVertex.name].y);
    
    currentVertexCircle.addEventListener("mousedown", vertexDown, false);
    
    graphics.appendChild(currentVertexCircle);
    
    // currentVertexGroup.appendChild(currentVertexCircle);
    // graphics.appendChild(currentVertexGroup);
    
    
    var currentVertexLabel = document.createElementNS(svgNS, "text");
    
    currentVertexLabel.setAttributeNS(null, "id", graph.vertices.indexOf(currentVertex));
    
    currentVertexLabel.setAttributeNS(null, "x", vertexPositions[currentVertex.name].x - 5);
    currentVertexLabel.setAttributeNS(null, "y", vertexPositions[currentVertex.name].y + 5);
    
    var currentVertexLabelText = document.createTextNode(currentVertex.name);
    currentVertexLabel.classList.add("noselect");
    currentVertexLabel.appendChild(currentVertexLabelText);
    
    graphics.appendChild(currentVertexLabel);
  }
  
  updateDraw();
  output.setAttribute("operation", "dragVertex");
}

var groupColors = ["blue", "white", "green", "yellow", "magenta", "red"];

function updateDraw() {
  for (var currentEdge of graph.edges) {
    var currentEdgeLine = document.querySelector("line[id='" + graph.edges.indexOf(currentEdge) + "'");
    
    if (currentEdge.group != undefined) {
      currentEdgeLine.style.stroke = groupColors[currentEdge.group];
    } else {
      currentEdgeLine.style.stroke = "";
    }
    
    if (currentEdge.selected) {
      currentEdgeLine.style.strokeWidth = "5px";
    } else {
      currentEdgeLine.style.strokeWidth = "";
    }
    
    currentEdgeLine.setAttributeNS(null, "x1", vertexPositions[currentEdge.vertices[0].name].x);
    currentEdgeLine.setAttributeNS(null, "y1", vertexPositions[currentEdge.vertices[0].name].y);
    
    currentEdgeLine.setAttributeNS(null, "x2", vertexPositions[currentEdge.vertices[1].name].x);
    currentEdgeLine.setAttributeNS(null, "y2", vertexPositions[currentEdge.vertices[1].name].y);
  }
  
  for (var currentVertex of graph.vertices) {
    var currentVertexCircle = document.querySelector("circle[id='" + graph.vertices.indexOf(currentVertex) + "'");
    
    currentVertexCircle.setAttributeNS(null, "cx", vertexPositions[currentVertex.name].x);
    currentVertexCircle.setAttributeNS(null, "cy", vertexPositions[currentVertex.name].y);
    
    if (currentVertex.group != undefined) {
      currentVertexCircle.style.fill = groupColors[currentVertex.group];
    } else {
      currentVertexCircle.style.fill = "";
    }
    
    var currentVertexLabel = document.querySelector("text[id='" + graph.vertices.indexOf(currentVertex) + "'");
    
    currentVertexLabel.setAttributeNS(null, "x", vertexPositions[currentVertex.name].x - 5);
    currentVertexLabel.setAttributeNS(null, "y", vertexPositions[currentVertex.name].y + 5);
  }
}
