// == App ==
const sync = browser.storage.sync;

document.addEventListener("DOMContentLoaded", () => {
const tableReplaceDict = helem("replace-dict");

const _renderRow = kv => element("tr", withDefaults(),
  element("td", withDefaults(), element("input", e => { e.value = kv[0] })),
  element("td", withDefaults(), element("input", e => { e.value = kv[1] })),
  element("button", e => { e.innerText=  "⌫" })
);
const renderRow = kv => {
  let elem = _renderRow(kv);
  elem.children[2].onclick = () => tableReplaceDict.removeChild(elem);
  return elem; //^ add self remove
};

const render = obj => Object.entries(obj).map(renderRow)
  .forEach(it => tableReplaceDict.appendChild(it));
const scrape = () => [...tableReplaceDict.children].map(tr =>
  [tr.children[0].firstChild.value, tr.children[1].firstChild.value]
);

helem("save").onclick = () => sync.set({ mapping: Object.fromEntries(scrape()) });

helem("add").onclick = () => tableReplaceDict.appendChild(renderRow(["", ""]));

sync.get("mapping").then(it => render(it.mapping || {}));

});
