async function loadGraph() {

  const response =
    await fetch(
      `/api/graph`
    );

  const graph =
    await response.json();

  console.log(graph)
  const container =
    document.getElementById("network");

  const data = {
    nodes: new vis.DataSet(
      graph.nodes
    ),
    edges: new vis.DataSet(
      graph.edges
    )
  };

  const options = {
    physics: {
      enabled: true,
      solver: "barnesHut",
      stabilization: {
        enabled: true,
        iterations: 2000,
        fit: true
      },
      barnesHut: {
        gravitationalConstant: -8000,
        springLength: 120,
        springConstant: 0.04,
        damping: 0.2
      }
    },

    nodes: {
      shape: "dot",
      size: 20
    },

    edges: {
      scaling: {
        min: 1,
        max: 10
      }
    }
  };

  new vis.Network(
    container,
    data,
    options
  );
}

loadGraph();