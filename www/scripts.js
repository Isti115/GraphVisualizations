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
  
  document.getElementById("drawButton").addEventListener("click", reDraw, false);
  document.getElementById("processButton").addEventListener("click", process, false);
  document.getElementById("exampleButton").addEventListener("click", example, false);
  document.getElementById("configShare").addEventListener("click", share, false);
  document.getElementById("shareCodeContainer").addEventListener("click", shareHide, false);
  
  output = document.getElementById("output");
  output.addEventListener("mousedown", outputDown, false);
  
  graphics = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  graphics.setAttribute("id", "outputGraphics");
  
  output.appendChild(graphics);
  
  var configInputs = document.getElementsByClassName("configInput");
  
  for (var i = 0; i < configInputs.length; i++) {
    configInputs[i].addEventListener("change", configUpdate, false);
  }
  
  graphEditor_load();
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

var processData;
var processQueue = [];
var stepDelay = 250;

function step() {
  if (processQueue.length == 0) {
    return;
  }
  
  var currentStep = processQueue.shift();
  
  if (currentStep.type == "newGroup") {
    var i = 0;
    while (i < graph.vertices.length && processData.processed.vertices.indexOf(graph.vertices[i]) != -1) {i++;}
    if (i < graph.vertices.length) {
      processData.currentGroup++;
      processData.processed.vertices.push(graph.vertices[i]);
      processQueue.push({type: "groupVertex", data: {vertex: graph.vertices[i], group: processData.currentGroup}});
    } else {
      return;
    }
  } else if (currentStep.type == "groupVertex") {
    currentStep.data.vertex.group = currentStep.data.group;
    for (var currentEdge of currentStep.data.vertex.edges.out) {
      if (processData.processed.edges.indexOf(currentEdge) == -1) {
        processData.processed.edges.push(currentEdge);
        if (currentEdge.pair != undefined) {
          processData.processed.edges.push(currentEdge.pair);
        }
        processQueue.push({type: "groupEdge", data: {edge: currentEdge, group: currentStep.data.group}});
        currentEdge.selected = true;
      }
    }
  } else if (currentStep.type == "groupEdge") {
    currentStep.data.edge.group = currentStep.data.group;
    currentStep.data.edge.selected = false;
    if (currentStep.data.edge.pair != undefined) {
      currentStep.data.edge.pair.group = currentStep.data.group;
      currentStep.data.edge.pair.selected = false;
    }
    if (processData.processed.vertices.indexOf(currentStep.data.edge.vertices[1]) == -1) {
      processData.processed.vertices.push(currentStep.data.edge.vertices[1]);
      processQueue.push({type: "groupVertex", data: {vertex: currentStep.data.edge.vertices[1], group: currentStep.data.group}});
    }
  }
  
  updateDraw();
  // console.log("---");
  // console.log(currentStep);
  // console.log(processData.processed);
  // console.log(processQueue);
  
  if (processQueue.length == 0) {
    processQueue.push({type: "newGroup"});
  }
  setTimeout(step, stepDelay);
}

function resetGroups() {
  for (var currentEdge of graph.edges) {
    delete currentEdge.group;
  }
  for (var currentVertex of graph.vertices) {
    delete currentVertex.group;
  }
}

function process() {
  processData = {currentGroup: -1, processed: {vertices: [], edges: []}};
  resetGroups();
  processQueue.push({type: "newGroup"});
  step();
}
