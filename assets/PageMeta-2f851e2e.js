import { c as t, aC as c, aD as e } from "./entry-client-dcf17ba4.js";
const s = "/assets/meta-e24a6525.jpg",
  a = "Iris x John",
  g =
    "Iris x John";
function u(n) {
  const r = () => (n.title ? `${n.title} | ${a}` : a),
    i = () => n.description ?? g,
    o = () => n.image ?? s;
  return [
    t(c, {
      get children() {
        return r();
      }
    }),
    t(e, {
      name: "description",
      get content() {
        return i();
      }
    }),
    t(e, {
      itemprop: "name",
      get content() {
        return r();
      }
    }),
    t(e, {
      itemprop: "description",
      get content() {
        return i();
      }
    }),
    t(e, {
      itemprop: "image",
      get content() {
        return o();
      }
    }),
    t(e, {
      property: "og:title",
      get content() {
        return r();
      }
    }),
    t(e, {
      property: "og:description",
      get content() {
        return i();
      }
    }),
    t(e, {
      property: "og:image",
      get content() {
        return o();
      }
    }),
    t(e, {
      name: "twitter:title",
      get content() {
        return r();
      }
    }),
    t(e, {
      name: "twitter:description",
      get content() {
        return i();
      }
    }),
    t(e, {
      name: "twitter:image",
      get content() {
        return o();
      }
    })
  ];
}
export { u as P };
