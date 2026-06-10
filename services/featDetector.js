const titlePatterns = [
  /\bavec\s+([^\-|,]+)/gi,
  /\bfeat\.?\s+([^\-|,]+)/gi,
  /\bft\.?\s+([^\-|,]+)/gi,
  /\bx\s+([^\-|,]+)/gi
];

export function detectCollaborators(title, description) {
  // const collaborators = new Set();

  const simple_regex = /(?:^|\s)@([A-Za-z0-9_]+)(?=\s|$)/g;

  const title_candidate = [...title.matchAll(simple_regex)].map(m => m[1])
  const description_candidate = [...description.matchAll(simple_regex)].map(m => m[1])

  const candidate = new Set([...title_candidate, ...description_candidate])
   
  return [...candidate].map(gest => gest.toLowerCase())


  // for (const regex of titlePatterns) {
  //   let match;

  //   while ((match = regex.exec(title)) !== null) {
  //     collaborators.add(
  //       match[1].trim()
  //     );
  //   }
  // }

  // const mentionRegex = /@([a-zA-Z0-9_]+)/g;

  // let mention;

  // while (
  //   (mention = mentionRegex.exec(description)) !== null
  // ) {
  //   collaborators.add(mention[1]);
  // }

  // const youtubeLinks =
  //   /youtube\.com\/@([a-zA-Z0-9_-]+)/gi;

  // let link;

  // while (
  //   (link = youtubeLinks.exec(description)) !== null
  // ) {
  //   collaborators.add(link[1]);
  // }

  // return [...collaborators];
}