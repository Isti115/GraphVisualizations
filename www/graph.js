"use strict";

class Vertex {
  constructor(name) {
    this.name = name;
    this.edges = [];
  }
}

class Edge {
  constructor(v1, v2) {
    this.vertices = [v1, v2];
    
    this.vertices[0].edges.push(this);
    this.vertices[1].edges.push(this);
    
    this.pair = undefined;
  }
}

class Graph {
  constructor() {
    this.vertices = [];
    this.edges = [];
  }
  
  addVertex(name) {
    this.vertices.push(new Vertex(name));
  }
  
  addEdge(v1Name, v2Name, symmetrical) {
    var e1 = new Edge(...this.vertices.filter(v => v.name == v1Name), ...this.vertices.filter(v => v.name == v2Name));
    this.edges.push(e1);
    
    if (symmetrical) {
      var e2 = new Edge(...this.vertices.filter(v => v.name == v2Name), ...this.vertices.filter(v => v.name == v1Name));
      this.edges.push(e2);
      
      e1.pair = e2;
      e2.pair = e1;
    }
  }
}
