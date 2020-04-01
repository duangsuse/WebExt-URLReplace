const REGEX_TRIM = /(\([^\)]*)|\^|\$|\*|\(|\)|\[|\{|\\|\|/g; // rest metachar: .+?-
const trimRegex = s => s.replace(REGEX_TRIM, "");

let mapping; //< globals

function tryRewriteUrl(request) {
  const url = request.url;
  for (let [pat, dst] of Object.entries(mapping)) {
    let match = RegExp(pat, "y").exec(url);
    if (match != null) { return format(dst, i => match[i]); }
  }
  return null;
}

function urlPatterns(map) {
  return Object.keys(mapping).map(it => {
    let url = new URL(trimRegex(it));
    return `${url.protocol}//*.${url.hostname}/*`;
  });
}

function refreshUrlReplace() {
browser.storage.sync.get("mapping").then(it => {
  mapping = it.mapping || {};
  let urlPats = mapping["<use_all_urls>"]? ["<all_urls>"] : urlPatterns(mapping); console.log(mapping, urlPats);
  if (mapping.length != 0) updateRequestRouter(req => {
    let res = tryRewriteUrl(req);
    return (res!=null)? {redirectUrl: res} : {};
  }, urlPats);
});


} //refreshUrlReplace

refreshUrlReplace();
