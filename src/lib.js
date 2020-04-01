function element(tagName, config, ...childs) {
  let tag = document.createElement(tagName)
  config(tag)
  for (let child of childs) tag.appendChild(child)
  return tag;
}

function configured(...configs) {
  return e => { for (let config of configs) config(e) }
}

function withDefaults() { return e => {} }

function withAttr(name, content) {
  return e => { e.setAttribute(name, content) }
}

function helem(id) { return document.getElementById(id) }

Object.entries = Object.entries || function entries(obj) {
  let entrys = [];
  for (let key in obj) {
    if (!obj.hasOwnProperty(key) || !obj.propertyIsEnumerable(key)) continue;
    entrys.push([key, obj[key]])
  }
  return entrys;
};
Object.fromEntries = Object.fromEntries || function fromEntries(entries) {
  let obj = {};
  for (let [k, v] of entries) obj[k] = v;
  return obj;
};


function associateByIndex(ks, vs) {
  let dict = {};
  for (let i=0; i<Math.min(ks.length, vs.length); i++) {
    dict[ks[i]] = vs[i];
  }
  return dict;
}

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

function updateRequestRouter(fn, urls) {
  const listeners = browser.webRequest.onBeforeRequest;
  if (listeners.hasListener(fn)) listeners.removeListener(fn);

  listeners.addListener(fn, {urls: urls}, ["blocking"]);
}

function translateAllIn(e, nouns, verbs, gettext) {
  const qs = css => document.querySelectorAll(css);
  const translate = (name, dict) => qs(`*[${name}=""]`).forEach(it => { it.innerText = dict[it.innerText] });
  translate("noun", nouns)
  translate("verb", verbs)
  for (let it of qs("*[phrase=\"\"]")) {
    let translated = gettext(it.innerText);
    if (translated == "<") continue;
    else it.innerText = translated;
  }
}
