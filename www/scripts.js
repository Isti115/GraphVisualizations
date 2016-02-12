"use strict";

var svgNS = "http://www.w3.org/2000/svg";

window.addEventListener("load", load, false);

var examples = [
  {
    vertices: [
      
    ],
    edges: [
      
    ]
  },
  {
    vertices: [
      
    ],
    edges: [
      
    ]
  }
];

var currentExample = -1;

var speed = 1;

var output, graphics;

var graph;
var verticePositions = {};

function load() {
  graph = new Graph();
  graph.addVertex("A");
  graph.addVertex("B");
  graph.addVertex("C");
  graph.addVertex("D");
  
  graph.addEdge("A", "B", true);
  graph.addEdge("C", "B");
  graph.addEdge("B", "D");
  graph.addEdge("A", "D");
  
  var configDiv = document.getElementById("config");
  
  configDiv.addEventListener("mouseover", function(){
    configDiv.style.transition = "width 0.3s, height 0.7s ease 0.3s";
  }, false);
  
  configDiv.addEventListener("mouseout", function(){
    configDiv.style.transition = "height 0.7s, width 0.3s ease 0.7s";
  }, false);
  
  document.getElementById("title").addEventListener("click", function () {
    location.hash = "";
    location.reload();
  }, false);
  
  document.getElementById("drawButton").addEventListener("click", draw, false);
  document.getElementById("processButton").addEventListener("click", process, false);
  document.getElementById("exampleButton").addEventListener("click", example, false);
  document.getElementById("configShare").addEventListener("click", share, false);
  document.getElementById("shareCodeContainer").addEventListener("click", shareHide, false);
  
  output = document.getElementById("output");
  
  graphics = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  graphics.setAttribute("id", "outputGraphics");
  
  output.appendChild(graphics);
  
  var configInputs = document.getElementsByClassName("configInput");
  
  for (var i = 0; i < configInputs.length; i++) {
    configInputs[i].addEventListener("change", configUpdate, false);
  }
}

function share() {
  document.getElementById("shareCode").innerHTML = location.href;
  document.getElementById("shareCodeContainer").style.top = "100px";
}

function shareHide() {
  document.getElementById("shareCodeContainer").style.top = "-500px";
}

function configUpdate() {
  speed = parseInt(document.getElementById("speedInput").value);
  
  document.getElementById("speedCounter").innerHTML = "Speed (" + speed + "):";
}

function example() {
  var random = -1;
  
  do {
    random = Math.floor(Math.random() * examples.length);
  } while (random == currentExample)
  
  currentExample = random;
  
  configUpdate();
}

var grabbedVertexName = "";

function grabStart(e) {
  grabbedVertexName = graph.vertices[parseInt(e.srcElement.getAttribute("id"))].name;
  
  graphics.addEventListener("mousemove", grabMove, false);
  graphics.addEventListener("mouseup", grabEnd, false);
}

function grabMove(e) {
  verticePositions[grabbedVertexName] = {
    x: e.clientX,
    y: e.clientY
  };
  draw();
}

function grabEnd(e) {
  graphics.removeEventListener("mousemove", grabMove, false);
  graphics.removeEventListener("mouseup", grabEnd, false);
}

function draw() {
  while (graphics.firstChild) {
    graphics.removeChild(graphics.firstChild);
  }
  
  for (var currentVertex of graph.vertices) {
    if (!(currentVertex.name in verticePositions)) {  
      var cx = Math.random() * graphics.clientWidth;
      var cy = Math.random() * graphics.clientHeight;
      verticePositions[currentVertex.name] = {x: cx, y:cy};
    }
  }
  
  for (var currentEdge of graph.edges) {
    var currentEdgeLine = document.createElementNS(svgNS, "line");
    
    currentEdgeLine.setAttributeNS(null, "id", graph.edges.indexOf(currentEdge));
    
    currentEdgeLine.setAttributeNS(null, "x1", verticePositions[currentEdge.vertices[0].name].x);
    currentEdgeLine.setAttributeNS(null, "y1", verticePositions[currentEdge.vertices[0].name].y);
    
    currentEdgeLine.setAttributeNS(null, "x2", verticePositions[currentEdge.vertices[1].name].x);
    currentEdgeLine.setAttributeNS(null, "y2", verticePositions[currentEdge.vertices[1].name].y);
    
    graphics.appendChild(currentEdgeLine);
  }
  
  for (var currentVertex of graph.vertices) {
    // var currentVertexGroup = document.createElementNS(svgNS, "g");
    
    var currentVertexCircle = document.createElementNS(svgNS, "circle");
    
    currentVertexCircle.setAttributeNS(null, "id", graph.vertices.indexOf(currentVertex));
    
    // currentVertexCircle.setAttributeNS(null, "r", 10);
    
    currentVertexCircle.setAttributeNS(null, "cx", verticePositions[currentVertex.name].x);
    currentVertexCircle.setAttributeNS(null, "cy", verticePositions[currentVertex.name].y);
    
    currentVertexCircle.addEventListener("mousedown", grabStart, false);
    
    graphics.appendChild(currentVertexCircle);
    
    // currentVertexGroup.appendChild(currentVertexCircle);
    // graphics.appendChild(currentVertexGroup);
  }
}

function process() {
  
}
