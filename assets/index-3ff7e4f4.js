import {
  Z as N,
  _ as E,
  $ as g,
  a0 as R,
  a as m,
  T as l,
  g as I,
  b as P,
  k as x,
  n as H,
  a1 as b,
  a2 as T,
  t as A,
  a3 as V,
  a4 as $,
  a5 as F,
  c as r,
  H as q,
  i as z,
  a6 as D,
  a7 as w,
  z as h,
  q as O,
  F as j,
  v as G,
  w as Q,
  x as U,
  y as Z,
  m as B
} from "./entry-client-dcf17ba4.js";
import { P as J } from "./PageMeta-2f851e2e.js";
const K = "_pictureContainer_zhbfo_1",
  W = { pictureContainer: K },
  X = "_videoContainer_bqrlm_1",
  Y = { videoContainer: X };
function ee(e, o) {
  for (const [i, t] of Object.entries(o))
    e.addEventListener(i, t),
      R(() => {
        e.removeEventListener(i, t);
      });
}
function M(e, o = {}) {
  const [i, t] = N({
    ready: !1,
    playing: !1,
    ended: !1,
    error: !1,
    currentTime: 0
  });
  E(() =>
    g(e, n => {
      ee(n, {
        canplaythrough: () => t("ready", !0),
        loadstart: () => t("ready", !1),
        playing: () => t("playing", !0),
        pause: () => t("playing", !1),
        ended: () => t("ended", !0),
        error: () => t("error", !0),
        timeupdate: () => t("currentTime", n.currentTime)
      }),
        (n.muted = !0),
        (n.volume = 0),
        n.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA && t("ready", !0);
    })
  );
  function s() {
    g(e, n => {
      t("ended", !1),
        (n.currentTime = 0),
        n.play().catch(c => {
          c.name === "NotAllowedError" && t("error", !0);
        });
    });
  }
  function d() {
    g(e, n => {
      n.pause(), (n.currentTime = 0);
    });
  }
  return (
    E(() => {
      g(o.playing, n => {
        n ? s() : d();
      });
    }),
    i
  );
}
var te = A(
  "<div><video playsinline muted></video><video loop playsinline muted>"
);
function _(e) {
  const [o, i] = m(),
    [t, s] = m(),
    [d, n] = m(!1),
    c = M(o, { playing: () => V() && !d() }),
    k = M(t, { playing: l(() => d() || c.currentTime >= e.loopStartTime) });
  return (() => {
    var f = I(te),
      u = f.firstChild,
      v = u.nextSibling;
    return (
      P(i, u),
      v.addEventListener("animationend", a => n(!0, a)),
      P(s, v),
      x(
        a => {
          var S = Y.videoContainer,
            p = e.introSrc,
            y = !c.playing,
            L = e.loopSrc,
            C = !k.playing;
          return (
            S !== a.e && H(f, (a.e = S)),
            p !== a.t && b(u, "src", (a.t = p)),
            y !== a.a && T(u, "hidden", (a.a = y)),
            L !== a.o && b(v, "src", (a.o = L)),
            C !== a.i && T(v, "hidden", (a.i = C)),
            a
          );
        },
        { e: void 0, t: void 0, a: void 0, o: void 0, i: void 0 }
      ),
      f
    );
  })();
}
var re = A("<div>");
function ne(e) {
  const [o, i] = m(!1),
    t = $("(orientation: portrait)");
  return (
    F(() => {
      i(!0);
    }),
    r(U, {
      backgroundColor: "var(--color-palePeach)",
      textColor: "var(--color-darkRed)",
      fillColor: "var(--color-darkRed)",
      get children() {
        return [
          r(J, {}),
          r(q, { fixed: !0, withHeading: !0 }),
          (() => {
            var s = I(re);
            return (
              z(
                s,
                r(D, {
                  get children() {
                    return [
                      r(w, {
                        get when() {
                          return l(() => !!o())() && t();
                        },
                        get children() {
                          return r(h, {
                            get when() {
                              return (
                                l(() => !!e.videoIntroPortraitSrc())() &&
                                e.videoLoopPortraitSrc()
                              );
                            },
                            get children() {
                              return r(_, {
                                get introSrc() {
                                  return e.videoIntroPortraitSrc();
                                },
                                get loopSrc() {
                                  return e.videoLoopPortraitSrc();
                                },
                                loopStartTime: 27
                              });
                            }
                          });
                        }
                      }),
                      r(w, {
                        get when() {
                          return l(() => !!o())() && !t();
                        },
                        get children() {
                          return r(h, {
                            get when() {
                              return (
                                l(() => !!e.videoIntroLandscapeSrc())() &&
                                e.videoLoopLandscapeSrc()
                              );
                            },
                            get children() {
                              return r(_, {
                                get introSrc() {
                                  return e.videoIntroLandscapeSrc();
                                },
                                get loopSrc() {
                                  return e.videoLoopLandscapeSrc();
                                },
                                loopStartTime: 27.5
                              });
                            }
                          });
                        }
                      })
                    ];
                  }
                })
              ),
              x(() => H(s, W.pictureContainer)),
              s
            );
          })(),
          r(O, { fixed: !0 }),
          r(j, {
            get each() {
              return e.subtitles;
            },
            children: s => r(G, s)
          }),
          r(Q, {})
        ];
      }
    })
  );
}
function ie() {
  const { page: e, ...o } = Z();
  return r(h, {
    get when() {
      return e();
    },
    keyed: !0,
    children: i => r(ne, B(i, o))
  });
}
export { ie as default };
