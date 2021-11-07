try {
  console.log(
    `%c init Roads Technology components `,
    "background:blue;color:gold"
  );
  /********************************************************************************/
  customElements.define(
    "letter-hunt",
    class extends HTMLElement {
      connectedCallback() {
        this.id = "letterHunt001";
        let html = "",
          letters = [],
          word = "";
        if (this.hasAttribute("word")) {
          //localStorage.removeItem(this.id);
          let foundword = localStorage.getItem(this.id) || false;
          console.log(foundword);
          if (!foundword) {
              foundword = "................".substring(
                  0,
                  this.getAttribute("word").length
                  );
            //      console.log(foundword);
            localStorage.setItem(this.id, foundword);
          }
          let searchParams = new URLSearchParams(document.location.search);
          let foundposition = Number(searchParams.get("lhposition") || 0);
          if (foundposition) {
            let foundletter = searchParams.get("lhletter") || "?";
            foundword =
              foundword.substring(0, foundposition - 1) +
              foundletter +
              foundword.substring(foundposition);
            localStorage.setItem(this.id, foundword);
          }
          word = foundword || this.getAttribute("word") || this.nodeName;
          html +=
            `<style>:host{display:flex;justify-content:center;gap:1vw}` +
            `div{width:5vw;font:5vw Arial;font-weight:bold;float:left;border:1px solid grey;padding:.5em .25em;position:relative}` +
            `div{background:#005a9a;color:gold;text-align:center}` +
            `div[letter*="."]{background:#41a9d5;color:black;}` +
            //`div:after{position:absolute;content:attr(idx);bottom:0;font-size:50%;left:0}</style>`
            ``;
          letters = word.split("").map((letter, idx) => {
            let div = document.createElement("div");
            div.setAttribute("idx", idx + 1);
            div.setAttribute("letter", letter);
            div.setAttribute("part", this.localName + "-letter");
            div.innerHTML = letter;
            return div;
          });
        } else {
          // make sure this element is in <body> so position:absolute renders it in the bottom-right
          if (this.parentNode == document.body) {
            html = this.letterHTML();
          } else {
            // move this Element into body, so it can be displayed on top of everything
            document.body.append(this);
          }
        }
        this.attachShadow({
          mode: "open",
        }).innerHTML = html;
        this.shadowRoot.append(...letters);
      }
      letterHTML() {
        let href =
          this.getAttribute("href") ||
          "https://roads-technology.nl/letterspeurtocht";
        let imgsrc =
          this.getAttribute("imgsrc") ||
          "//christmas-corner.github.io/corner_christmas_500.png";
        let letter = this.getAttribute("letter") || "";
        let position = this.getAttribute("position") || "onbekend";

        let initsvg =
          "width:6vw;opacity:" +
          (document.location.host.includes("tech") ? 1 : 1);
        // style when hovered over IMG to show letter
        let style = `<style>svg:hover{opacity:1}svg:hover text{stroke:darkred;fill:gold}</style>`;
        // style: put SVG in bottom-right corner
        style += `<style>svg{${initsvg};position:fixed;right:0;bottom:0;z-index:9999}</style>`;

        let html =
          style +
          //`<link rel="prefetch" href="${href}">` +
          `<a href="${href}?lhletter=${letter}&lhposition=${position}"` +
          `   onclick="this.getRootNode().host.clicked()">` +
          `<svg viewBox="0 0 100 100">` + // all SVG including IMG background and letter
          `<image height="100" href="${imgsrc}"/>` +
          `<text y="50%" fill="none" font-size="70px">${letter}</text></svg>` +
          `</a>`;

        console.log(`%c ${this.outerHTML}`, "background:firebrick;color:gold");
        return html;
      }
      clicked() {
        this.width = "100vw";
      }
      set width(value) {
        this.shadowRoot.querySelector("svg").style.width = value;
      }
    }
  );
  /********************************************************************************/
} catch (e) {
  console.error(`RT wp-sitemanager error:\n`, e);
}
