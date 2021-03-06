// == App ==
const sync = browser.storage.sync;
const gettext = browser.i18n.getMessage;
const backgroundPage = browser.extension.getBackgroundPage();

class UIMapConfig { constructor(e) { this.e = e; }
  static _renderRow(kv) {
    return element("tr", withDefaults(),
      element("td", withDefaults(), element("input", e => { e.value = kv[0] })),
      element("td", withDefaults(), element("input", e => { e.value = kv[1] })),
      element("button", e => { e.innerText=  "⌫" })
    );
  }
  renderRow(kv) {
    let elem = UIMapConfig._renderRow(kv);
    elem.children[2].onclick = () => this.e.removeChild(elem);
    return elem; //^ add self remove
  }
  render(obj) {
    Object.entries(obj).map(it => this.renderRow(it))
      .forEach(it => this.e.appendChild(it));
  }
  scrape() {
    let entries = [...this.e.children].map(tr =>
      [tr.children[0].firstChild.value, tr.children[1].firstChild.value]
    );
    return Object.fromEntries(entries);
  }
}

const
  template_noun = "URL Replace/Format/Destination".split("/"),
  template_verb = "Add/Save".split("/");
const nouns = associateByIndex(template_noun, gettext("Nouns").split("/"));
const verbs = associateByIndex(template_verb, gettext("Verbs").split("/")); //< logic could be extracted

document.addEventListener("DOMContentLoaded", () => {
const tableReplaceDict = helem("replace-dict");

const dict = new UIMapConfig(tableReplaceDict);

const add = (k, v) => tableReplaceDict.appendChild(dict.renderRow([k, v]));

helem("save").onclick = () => { sync.set({ mapping: dict.scrape() }); backgroundPage.refreshUrlReplace(); };

helem("add").onclick = () => add("", "");

helem("add_use_all_urls").onclick = () => add("<use_all_urls>", "true");

sync.get("mapping").then(it => dict.render(it.mapping || {}));

translateAllIn(document.body, nouns, verbs, gettext);
});
