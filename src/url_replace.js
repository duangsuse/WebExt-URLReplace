function drop(n, str) { return str.substring(n, str.length); }
function format(str, replace, prefix = '\\' , take = view => /(\d+)/.exec(view)[0], transform = Number.parseInt) {
  let view = str;
  let result = [];
  while (view.length != 0) {
    let prefixIdx = view.indexOf(prefix); if (prefixIdx == (-1)) break;
    result.push( view.substring(0, prefixIdx) );
    view = drop(prefixIdx+prefix.length, view);
    let took = take(view);
    if (took == null) throw SyntaxError(`Unexpected ${view} after ${prefix}`);
    result.push( replace(transform(took)) );
    view = drop(took.length, view);
  }
  result.push(view);
  return result.join("");
}

const REGEX_TRIM = /(\([^\)]*)|\^|\$|\*|\(|\)|\[|\{|\\|\|/g; // rest metachar: .+?-
const trimRegex = s => s.replace(REGEX_TRIM, "");

let mapping; //< globals

function updateRequestRouter(fn, urls) {
  const listeners = browser.webRequest.onBeforeRequest;
  if (listeners.hasListener(fn)) listeners.removeListener(fn);

  listeners.addListener(fn, {urls: urls}, ["blocking"]);
}


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
