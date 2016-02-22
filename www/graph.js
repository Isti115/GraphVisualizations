"use strict";

class Vertex {
  constructor(name) {
    this.name = name;
    this.edges = {in: [], out: []};
  }
}

class Edge {
  constructor(v1, v2) {
    this.vertices = [v1, v2];
    
    this.vertices[0].edges.out.push(this);
    this.vertices[1].edges.in.push(this);
    
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
  
  removeVertex(vertex) {
    // var affectedEdges = this.edges.filter(e => e.vertices.indexOf(vertex) != -1);
    // var affectedEdges = vertex.edges.in.concat(vertex.edges.out);
    
    // for (var edge of affectedEdges) {
    //   this.edges.splice(this.edges.indexOf(edge), 1);
    // }
    
    for (var inEdge of vertex.edges.in) {
      inEdge.vertices[0].edges.out.splice(inEdge.vertices[0].edges.out.indexOf(inEdge), 1);
      this.edges.splice(this.edges.indexOf(inEdge), 1);
    }
    
    for (var outEdge of vertex.edges.out) {
      outEdge.vertices[1].edges.in.splice(outEdge.vertices[1].edges.in.indexOf(outEdge), 1);
      this.edges.splice(this.edges.indexOf(outEdge), 1);
    }
    
    this.vertices.splice(this.vertices.indexOf(vertex), 1);
  }
  
  addEdge(v1Name, v2Name, symmetrical) {
    if (this.edges.filter(e => e.vertices[0].name == v1Name && e.vertices[1].name == v2Name).length > 0) {
      console.log("edge alredy exists");
      return;
    }
    
    var e1 = new Edge(...this.vertices.filter(v => v.name == v1Name), ...this.vertices.filter(v => v.name == v2Name));
    this.edges.push(e1);
    
    var reverseEdges = this.edges.filter(e => e.vertices[1].name == v1Name && e.vertices[0].name == v2Name);
    
    if (reverseEdges.length > 0) {
      reverseEdges[0].pair = e1;
      e1.pair = reverseEdges[0];
    } else if (symmetrical) {
      var e2 = new Edge(...this.vertices.filter(v => v.name == v2Name), ...this.vertices.filter(v => v.name == v1Name));
      this.edges.push(e2);
      
      e1.pair = e2;
      e2.pair = e1;
    }
  }
  
  removeEdge(edge) {
    this.edges.splice(this.edges.indexOf(edge), 1);
  }
}
