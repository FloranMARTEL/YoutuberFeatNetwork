export function buildGraph(collaborations) {
  const nodes = new Map();
  const edges = new Map();

  function addNode(name) {
    if (!nodes.has(name)) {
      nodes.set(name, {
        id: name,
        label: name
      });
    }
  }

  function addEdge(from, to, video) {
    if (from === to){
      return false
    }
    const key = [from, to]
      .sort()
      .join("|");

    if (!edges.has(key)) {
      edges.set(key, {
        from,
        to,
        value: 1,
        video : [video]
      });
    } else {
      edges.get(key).value++;
      edges.get(key).video.push(video);
    }
  }
  console.log("wwwwwwwwwwwwwwwwwwwwwwwwwww")
  console.log(collaborations)
  console.log("wwwwwwwwwwwwwwwwwwwwwwwwwww")
  for (const collab of collaborations) {
    const owner = collab.owner;
    const guest = collab.guest;
    const video = collab.video;

    addNode(owner);
    addNode(guest);
    addEdge(owner, guest, video);

  }

  return {
    nodes: [...nodes.values()],
    edges: [...edges.values()]
  };
}