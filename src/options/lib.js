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
