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

function onLink(url) {
  const check = it => { for (let [pat, dst] of Object.entries(it.mapping || {})) {
    let match = RegExp(pat, "y").exec(url);
    if (match != null) { document.location = format(dst, i => match[i]); }
  } };
  browser.storage.sync.get("mapping").then(check);
}
onLink(document.location);
