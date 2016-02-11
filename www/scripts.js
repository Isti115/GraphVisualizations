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
  
  graphics = document.getElementById("outputGraphics");
  
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

function draw() {
  for (var i = 0; i < graph.vertices.length; i++) {
    var currentVertex = document.createElementNS(svgNS, "circle");
    // currentVertex.setAttributeNS(null, "r", 10);
    
    var cx = Math.random() * graphics.clientWidth;
    currentVertex.setAttributeNS(null, "cx", cx);
    
    var cy = Math.random() * graphics.clientHeight;
    currentVertex.setAttributeNS(null, "cy", cy);
    
    verticePositions[graph.vertices[i].name] = {x: cx, y:cy};
    
    graphics.appendChild(currentVertex);
  }
  
  for (var i = 0; i < graph.edges.length; i++) {
    var currentEdge = document.createElementNS(svgNS, "line");
    
    currentEdge.setAttributeNS(null, "x1", verticePositions[graph.edges[i].vertices[0].name].x);
    currentEdge.setAttributeNS(null, "y1", verticePositions[graph.edges[i].vertices[0].name].y);
    
    currentEdge.setAttributeNS(null, "x2", verticePositions[graph.edges[i].vertices[1].name].x);
    currentEdge.setAttributeNS(null, "y2", verticePositions[graph.edges[i].vertices[1].name].y);
    
    graphics.appendChild(currentEdge);
  }
}

function process() {
  
}
