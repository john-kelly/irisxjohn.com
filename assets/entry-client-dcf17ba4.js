const C = {
  context: void 0,
  registry: void 0,
  effects: void 0,
  done: !1,
  getContextId() {
    return xi(this.context.count);
  },
  getNextContextId() {
    return xi(this.context.count++);
  }
};
function xi(e) {
  const t = String(e),
    n = t.length - 1;
  return C.context.id + (n ? String.fromCharCode(96 + n) : "") + t;
}
function Re(e) {
  C.context = e;
}
function el() {
  return { ...C.context, id: C.getNextContextId(), count: 0 };
}
const Xo = !1,
  tl = (e, t) => e === t,
  Le = Symbol("solid-proxy"),
  Qo = typeof Proxy == "function",
  $n = Symbol("solid-track"),
  Cn = { equals: tl };
let Qt = null,
  Ko = ns;
const ke = 1,
  Yt = 2,
  Yo = { owned: null, cleanups: null, context: null, owner: null },
  er = {};
var Z = null;
let P = null,
  nl = null,
  te = null,
  me = null,
  de = null,
  Fn = 0;
function Oe(e, t) {
  const n = te,
    r = Z,
    i = e.length === 0,
    o = t === void 0 ? r : t,
    s = i
      ? Yo
      : {
          owned: null,
          cleanups: null,
          context: o ? o.context : null,
          owner: o
        },
    a = i ? e : () => e(() => ne(() => et(s)));
  (Z = s), (te = null);
  try {
    return Ce(a, !0);
  } finally {
    (te = n), (Z = r);
  }
}
function L(e, t) {
  t = t ? Object.assign({}, Cn, t) : Cn;
  const n = {
      value: e,
      observers: null,
      observerSlots: null,
      comparator: t.equals || void 0
    },
    r = i => (
      typeof i == "function" &&
        (P && P.running && P.sources.has(n)
          ? (i = i(n.tValue))
          : (i = i(n.value))),
      ts(n, i)
    );
  return [es.bind(n), r];
}
function Jt(e, t, n) {
  const r = rn(e, t, !0, ke);
  Rt(r);
}
function D(e, t, n) {
  const r = rn(e, t, !1, ke);
  Rt(r);
}
function H(e, t, n) {
  Ko = ul;
  const r = rn(e, t, !1, ke),
    i = ht && ie(ht);
  i && (r.suspense = i),
    (!n || !n.render) && (r.user = !0),
    de ? de.push(r) : Rt(r);
}
function k(e, t, n) {
  n = n ? Object.assign({}, Cn, n) : Cn;
  const r = rn(e, t, !0, 0);
  return (
    (r.observers = null),
    (r.observerSlots = null),
    (r.comparator = n.equals || void 0),
    Rt(r),
    es.bind(r)
  );
}
function rl(e) {
  return e && typeof e == "object" && "then" in e;
}
function Jr(e, t, n) {
  let r, i, o;
  typeof t == "function"
    ? ((r = e), (i = t), (o = n || {}))
    : ((r = !0), (i = e), (o = t || {}));
  let s = null,
    a = er,
    l = null,
    f = !1,
    u = !1,
    c = "initialValue" in o,
    d = typeof r == "function" && k(r);
  const g = new Set(),
    [m, p] = (o.storage || L)(o.initialValue),
    [b, $] = L(void 0),
    [A, N] = L(void 0, { equals: !1 }),
    [T, I] = L(c ? "ready" : "unresolved");
  C.context &&
    ((l = C.getNextContextId()),
    o.ssrLoadFrom === "initial"
      ? (a = o.initialValue)
      : C.load && C.has(l) && (a = C.load(l)));
  function z(O, v, y, w) {
    return (
      s === O &&
        ((s = null),
        w !== void 0 && (c = !0),
        (O === a || v === a) &&
          o.onHydrated &&
          queueMicrotask(() => o.onHydrated(w, { value: v })),
        (a = er),
        P && O && f
          ? (P.promises.delete(O),
            (f = !1),
            Ce(() => {
              (P.running = !0), re(v, y);
            }, !1))
          : re(v, y)),
      v
    );
  }
  function re(O, v) {
    Ce(() => {
      v === void 0 && p(() => O),
        I(v !== void 0 ? "errored" : c ? "ready" : "unresolved"),
        $(v);
      for (const y of g.keys()) y.decrement();
      g.clear();
    }, !1);
  }
  function R() {
    const O = ht && ie(ht),
      v = m(),
      y = b();
    if (y !== void 0 && !s) throw y;
    return (
      te &&
        !te.user &&
        O &&
        Jt(() => {
          A(),
            s &&
              (O.resolved && P && f
                ? P.promises.add(s)
                : g.has(O) || (O.increment(), g.add(O)));
        }),
      v
    );
  }
  function G(O = !0) {
    if (O !== !1 && u) return;
    u = !1;
    const v = d ? d() : r;
    if (((f = P && P.running), v == null || v === !1)) {
      z(s, ne(m));
      return;
    }
    P && s && P.promises.delete(s);
    const y = a !== er ? a : ne(() => i(v, { value: m(), refetching: O }));
    return rl(y)
      ? ((s = y),
        "value" in y
          ? (y.status === "success"
              ? z(s, y.value, void 0, v)
              : z(s, void 0, Ar(y.value), v),
            y)
          : ((u = !0),
            queueMicrotask(() => (u = !1)),
            Ce(() => {
              I(c ? "refreshing" : "pending"), N();
            }, !1),
            y.then(
              w => z(y, w, void 0, v),
              w => z(y, void 0, Ar(w), v)
            )))
      : (z(s, y, void 0, v), y);
  }
  return (
    Object.defineProperties(R, {
      state: { get: () => T() },
      error: { get: () => b() },
      loading: {
        get() {
          const O = T();
          return O === "pending" || O === "refreshing";
        }
      },
      latest: {
        get() {
          if (!c) return R();
          const O = b();
          if (O && !s) throw O;
          return m();
        }
      }
    }),
    d ? Jt(() => G(!1)) : G(!1),
    [R, { refetch: G, mutate: p }]
  );
}
function ft(e) {
  return Ce(e, !1);
}
function ne(e) {
  if (te === null) return e();
  const t = te;
  te = null;
  try {
    return e();
  } finally {
    te = t;
  }
}
function De(e, t, n) {
  const r = Array.isArray(e);
  let i,
    o = n && n.defer;
  return s => {
    let a;
    if (r) {
      a = Array(e.length);
      for (let f = 0; f < e.length; f++) a[f] = e[f]();
    } else a = e();
    if (o) return (o = !1), s;
    const l = ne(() => t(a, i, s));
    return (i = a), l;
  };
}
function Be(e) {
  H(() => ne(e));
}
function U(e) {
  return (
    Z === null ||
      (Z.cleanups === null ? (Z.cleanups = [e]) : Z.cleanups.push(e)),
    e
  );
}
function il(e, t) {
  Qt || (Qt = Symbol("error")),
    (Z = rn(void 0, void 0, !0)),
    (Z.context = { ...Z.context, [Qt]: [t] }),
    P && P.running && P.sources.add(Z);
  try {
    return e();
  } catch (n) {
    on(n);
  } finally {
    Z = Z.owner;
  }
}
function Tn() {
  return te;
}
function dt() {
  return Z;
}
function Jo(e, t) {
  const n = Z,
    r = te;
  (Z = e), (te = null);
  try {
    return Ce(t, !0);
  } catch (i) {
    on(i);
  } finally {
    (Z = n), (te = r);
  }
}
function Un(e) {
  if (P && P.running) return e(), P.done;
  const t = te,
    n = Z;
  return Promise.resolve().then(() => {
    (te = t), (Z = n);
    let r;
    return (
      ht &&
        ((r =
          P ||
          (P = {
            sources: new Set(),
            effects: [],
            promises: new Set(),
            disposed: new Set(),
            queue: new Set(),
            running: !0
          })),
        r.done || (r.done = new Promise(i => (r.resolve = i))),
        (r.running = !0)),
      Ce(e, !1),
      (te = Z = null),
      r ? r.done : void 0
    );
  });
}
const [ol, Ei] = L(!1);
function sl() {
  return [ol, Un];
}
function al(e) {
  de.push.apply(de, e), (e.length = 0);
}
function ve(e, t) {
  const n = Symbol("context");
  return { id: n, Provider: fl(n), defaultValue: e };
}
function ie(e) {
  let t;
  return Z && Z.context && (t = Z.context[e.id]) !== void 0
    ? t
    : e.defaultValue;
}
function mt(e) {
  const t = k(e),
    n = k(() => $r(t()));
  return (
    (n.toArray = () => {
      const r = n();
      return Array.isArray(r) ? r : r != null ? [r] : [];
    }),
    n
  );
}
let ht;
function ll() {
  return ht || (ht = ve());
}
function es() {
  const e = P && P.running;
  if (this.sources && (e ? this.tState : this.state))
    if ((e ? this.tState : this.state) === ke) Rt(this);
    else {
      const t = me;
      (me = null), Ce(() => In(this), !1), (me = t);
    }
  if (te) {
    const t = this.observers ? this.observers.length : 0;
    te.sources
      ? (te.sources.push(this), te.sourceSlots.push(t))
      : ((te.sources = [this]), (te.sourceSlots = [t])),
      this.observers
        ? (this.observers.push(te),
          this.observerSlots.push(te.sources.length - 1))
        : ((this.observers = [te]),
          (this.observerSlots = [te.sources.length - 1]));
  }
  return e && P.sources.has(this) ? this.tValue : this.value;
}
function ts(e, t, n) {
  let r = P && P.running && P.sources.has(e) ? e.tValue : e.value;
  if (!e.comparator || !e.comparator(r, t)) {
    if (P) {
      const i = P.running;
      (i || (!n && P.sources.has(e))) && (P.sources.add(e), (e.tValue = t)),
        i || (e.value = t);
    } else e.value = t;
    e.observers &&
      e.observers.length &&
      Ce(() => {
        for (let i = 0; i < e.observers.length; i += 1) {
          const o = e.observers[i],
            s = P && P.running;
          (s && P.disposed.has(o)) ||
            ((s ? !o.tState : !o.state) &&
              (o.pure ? me.push(o) : de.push(o), o.observers && rs(o)),
            s ? (o.tState = ke) : (o.state = ke));
        }
        if (me.length > 1e6) throw ((me = []), new Error());
      }, !1);
  }
  return t;
}
function Rt(e) {
  if (!e.fn) return;
  et(e);
  const t = Fn;
  Si(e, P && P.running && P.sources.has(e) ? e.tValue : e.value, t),
    P &&
      !P.running &&
      P.sources.has(e) &&
      queueMicrotask(() => {
        Ce(() => {
          P && (P.running = !0),
            (te = Z = e),
            Si(e, e.tValue, t),
            (te = Z = null);
        }, !1);
      });
}
function Si(e, t, n) {
  let r;
  const i = Z,
    o = te;
  te = Z = e;
  try {
    r = e.fn(t);
  } catch (s) {
    return (
      e.pure &&
        (P && P.running
          ? ((e.tState = ke),
            e.tOwned && e.tOwned.forEach(et),
            (e.tOwned = void 0))
          : ((e.state = ke), e.owned && e.owned.forEach(et), (e.owned = null))),
      (e.updatedAt = n + 1),
      on(s)
    );
  } finally {
    (te = o), (Z = i);
  }
  (!e.updatedAt || e.updatedAt <= n) &&
    (e.updatedAt != null && "observers" in e
      ? ts(e, r, !0)
      : P && P.running && e.pure
      ? (P.sources.add(e), (e.tValue = r))
      : (e.value = r),
    (e.updatedAt = n));
}
function rn(e, t, n, r = ke, i) {
  const o = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: Z,
    context: Z ? Z.context : null,
    pure: n
  };
  return (
    P && P.running && ((o.state = 0), (o.tState = r)),
    Z === null ||
      (Z !== Yo &&
        (P && P.running && Z.pure
          ? Z.tOwned
            ? Z.tOwned.push(o)
            : (Z.tOwned = [o])
          : Z.owned
          ? Z.owned.push(o)
          : (Z.owned = [o]))),
    o
  );
}
function Pn(e) {
  const t = P && P.running;
  if ((t ? e.tState : e.state) === 0) return;
  if ((t ? e.tState : e.state) === Yt) return In(e);
  if (e.suspense && ne(e.suspense.inFallback))
    return e.suspense.effects.push(e);
  const n = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Fn); ) {
    if (t && P.disposed.has(e)) return;
    (t ? e.tState : e.state) && n.push(e);
  }
  for (let r = n.length - 1; r >= 0; r--) {
    if (((e = n[r]), t)) {
      let i = e,
        o = n[r + 1];
      for (; (i = i.owner) && i !== o; ) if (P.disposed.has(i)) return;
    }
    if ((t ? e.tState : e.state) === ke) Rt(e);
    else if ((t ? e.tState : e.state) === Yt) {
      const i = me;
      (me = null), Ce(() => In(e, n[0]), !1), (me = i);
    }
  }
}
function Ce(e, t) {
  if (me) return e();
  let n = !1;
  t || (me = []), de ? (n = !0) : (de = []), Fn++;
  try {
    const r = e();
    return cl(n), r;
  } catch (r) {
    n || (de = null), (me = null), on(r);
  }
}
function cl(e) {
  if ((me && (ns(me), (me = null)), e)) return;
  let t;
  if (P) {
    if (!P.promises.size && !P.queue.size) {
      const r = P.sources,
        i = P.disposed;
      de.push.apply(de, P.effects), (t = P.resolve);
      for (const o of de)
        "tState" in o && (o.state = o.tState), delete o.tState;
      (P = null),
        Ce(() => {
          for (const o of i) et(o);
          for (const o of r) {
            if (((o.value = o.tValue), o.owned))
              for (let s = 0, a = o.owned.length; s < a; s++) et(o.owned[s]);
            o.tOwned && (o.owned = o.tOwned),
              delete o.tValue,
              delete o.tOwned,
              (o.tState = 0);
          }
          Ei(!1);
        }, !1);
    } else if (P.running) {
      (P.running = !1),
        P.effects.push.apply(P.effects, de),
        (de = null),
        Ei(!0);
      return;
    }
  }
  const n = de;
  (de = null), n.length && Ce(() => Ko(n), !1), t && t();
}
function ns(e) {
  for (let t = 0; t < e.length; t++) Pn(e[t]);
}
function ul(e) {
  let t,
    n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? (e[n++] = r) : Pn(r);
  }
  if (C.context) {
    if (C.count) {
      C.effects || (C.effects = []), C.effects.push(...e.slice(0, n));
      return;
    }
    Re();
  }
  for (
    C.effects &&
      (C.done || !C.count) &&
      ((e = [...C.effects, ...e]), (n += C.effects.length), delete C.effects),
      t = 0;
    t < n;
    t++
  )
    Pn(e[t]);
}
function In(e, t) {
  const n = P && P.running;
  n ? (e.tState = 0) : (e.state = 0);
  for (let r = 0; r < e.sources.length; r += 1) {
    const i = e.sources[r];
    if (i.sources) {
      const o = n ? i.tState : i.state;
      o === ke
        ? i !== t && (!i.updatedAt || i.updatedAt < Fn) && Pn(i)
        : o === Yt && In(i, t);
    }
  }
}
function rs(e) {
  const t = P && P.running;
  for (let n = 0; n < e.observers.length; n += 1) {
    const r = e.observers[n];
    (t ? !r.tState : !r.state) &&
      (t ? (r.tState = Yt) : (r.state = Yt),
      r.pure ? me.push(r) : de.push(r),
      r.observers && rs(r));
  }
}
function et(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(),
        r = e.sourceSlots.pop(),
        i = n.observers;
      if (i && i.length) {
        const o = i.pop(),
          s = n.observerSlots.pop();
        r < i.length &&
          ((o.sourceSlots[s] = r), (i[r] = o), (n.observerSlots[r] = s));
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) et(e.tOwned[t]);
    delete e.tOwned;
  }
  if (P && P.running && e.pure) is(e, !0);
  else if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) et(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  P && P.running ? (e.tState = 0) : (e.state = 0);
}
function is(e, t) {
  if ((t || ((e.tState = 0), P.disposed.add(e)), e.owned))
    for (let n = 0; n < e.owned.length; n++) is(e.owned[n]);
}
function Ar(e) {
  return e instanceof Error
    ? e
    : new Error(typeof e == "string" ? e : "Unknown error", { cause: e });
}
function Ai(e, t, n) {
  try {
    for (const r of t) r(e);
  } catch (r) {
    on(r, (n && n.owner) || null);
  }
}
function on(e, t = Z) {
  const n = Qt && t && t.context && t.context[Qt],
    r = Ar(e);
  if (!n) throw r;
  de
    ? de.push({
        fn() {
          Ai(r, n, t);
        },
        state: ke
      })
    : Ai(r, n, t);
}
function $r(e) {
  if (typeof e == "function" && !e.length) return $r(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let n = 0; n < e.length; n++) {
      const r = $r(e[n]);
      Array.isArray(r) ? t.push.apply(t, r) : t.push(r);
    }
    return t;
  }
  return e;
}
function fl(e, t) {
  return function(r) {
    let i;
    return (
      D(
        () =>
          (i = ne(
            () => (
              (Z.context = { ...Z.context, [e]: r.value }), mt(() => r.children)
            )
          )),
        void 0
      ),
      i
    );
  };
}
const dl = Symbol("fallback");
function $i(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function hl(e, t, n = {}) {
  let r = [],
    i = [],
    o = [],
    s = 0,
    a = t.length > 1 ? [] : null;
  return (
    U(() => $i(o)),
    () => {
      let l = e() || [],
        f = l.length,
        u,
        c;
      return (
        l[$n],
        ne(() => {
          let g, m, p, b, $, A, N, T, I;
          if (f === 0)
            s !== 0 &&
              ($i(o), (o = []), (r = []), (i = []), (s = 0), a && (a = [])),
              n.fallback &&
                ((r = [dl]),
                (i[0] = Oe(z => ((o[0] = z), n.fallback()))),
                (s = 1));
          else if (s === 0) {
            for (i = new Array(f), c = 0; c < f; c++)
              (r[c] = l[c]), (i[c] = Oe(d));
            s = f;
          } else {
            for (
              p = new Array(f),
                b = new Array(f),
                a && ($ = new Array(f)),
                A = 0,
                N = Math.min(s, f);
              A < N && r[A] === l[A];
              A++
            );
            for (
              N = s - 1, T = f - 1;
              N >= A && T >= A && r[N] === l[T];
              N--, T--
            )
              (p[T] = i[N]), (b[T] = o[N]), a && ($[T] = a[N]);
            for (g = new Map(), m = new Array(T + 1), c = T; c >= A; c--)
              (I = l[c]),
                (u = g.get(I)),
                (m[c] = u === void 0 ? -1 : u),
                g.set(I, c);
            for (u = A; u <= N; u++)
              (I = r[u]),
                (c = g.get(I)),
                c !== void 0 && c !== -1
                  ? ((p[c] = i[u]),
                    (b[c] = o[u]),
                    a && ($[c] = a[u]),
                    (c = m[c]),
                    g.set(I, c))
                  : o[u]();
            for (c = A; c < f; c++)
              c in p
                ? ((i[c] = p[c]), (o[c] = b[c]), a && ((a[c] = $[c]), a[c](c)))
                : (i[c] = Oe(d));
            (i = i.slice(0, (s = f))), (r = l.slice(0));
          }
          return i;
        })
      );
      function d(g) {
        if (((o[c] = g), a)) {
          const [m, p] = L(c);
          return (a[c] = p), t(l[c], m);
        }
        return t(l[c]);
      }
    }
  );
}
let os = !1;
function gl() {
  os = !0;
}
function h(e, t) {
  if (os && C.context) {
    const n = C.context;
    Re(el());
    const r = ne(() => e(t || {}));
    return Re(n), r;
  }
  return ne(() => e(t || {}));
}
function hn() {
  return !0;
}
const Cr = {
  get(e, t, n) {
    return t === Le ? n : e.get(t);
  },
  has(e, t) {
    return t === Le ? !0 : e.has(t);
  },
  set: hn,
  deleteProperty: hn,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: hn,
      deleteProperty: hn
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function tr(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function ml() {
  for (let e = 0, t = this.length; e < t; ++e) {
    const n = this[e]();
    if (n !== void 0) return n;
  }
}
function F(...e) {
  let t = !1;
  for (let s = 0; s < e.length; s++) {
    const a = e[s];
    (t = t || (!!a && Le in a)),
      (e[s] = typeof a == "function" ? ((t = !0), k(a)) : a);
  }
  if (Qo && t)
    return new Proxy(
      {
        get(s) {
          for (let a = e.length - 1; a >= 0; a--) {
            const l = tr(e[a])[s];
            if (l !== void 0) return l;
          }
        },
        has(s) {
          for (let a = e.length - 1; a >= 0; a--) if (s in tr(e[a])) return !0;
          return !1;
        },
        keys() {
          const s = [];
          for (let a = 0; a < e.length; a++) s.push(...Object.keys(tr(e[a])));
          return [...new Set(s)];
        }
      },
      Cr
    );
  const n = {},
    r = Object.create(null);
  for (let s = e.length - 1; s >= 0; s--) {
    const a = e[s];
    if (!a) continue;
    const l = Object.getOwnPropertyNames(a);
    for (let f = l.length - 1; f >= 0; f--) {
      const u = l[f];
      if (u === "__proto__" || u === "constructor") continue;
      const c = Object.getOwnPropertyDescriptor(a, u);
      if (!r[u])
        r[u] = c.get
          ? {
              enumerable: !0,
              configurable: !0,
              get: ml.bind((n[u] = [c.get.bind(a)]))
            }
          : c.value !== void 0
          ? c
          : void 0;
      else {
        const d = n[u];
        d &&
          (c.get
            ? d.push(c.get.bind(a))
            : c.value !== void 0 && d.push(() => c.value));
      }
    }
  }
  const i = {},
    o = Object.keys(r);
  for (let s = o.length - 1; s >= 0; s--) {
    const a = o[s],
      l = r[a];
    l && l.get ? Object.defineProperty(i, a, l) : (i[a] = l ? l.value : void 0);
  }
  return i;
}
function le(e, ...t) {
  if (Qo && Le in e) {
    const i = new Set(t.length > 1 ? t.flat() : t[0]),
      o = t.map(
        s =>
          new Proxy(
            {
              get(a) {
                return s.includes(a) ? e[a] : void 0;
              },
              has(a) {
                return s.includes(a) && a in e;
              },
              keys() {
                return s.filter(a => a in e);
              }
            },
            Cr
          )
      );
    return (
      o.push(
        new Proxy(
          {
            get(s) {
              return i.has(s) ? void 0 : e[s];
            },
            has(s) {
              return i.has(s) ? !1 : s in e;
            },
            keys() {
              return Object.keys(e).filter(s => !i.has(s));
            }
          },
          Cr
        )
      ),
      o
    );
  }
  const n = {},
    r = t.map(() => ({}));
  for (const i of Object.getOwnPropertyNames(e)) {
    const o = Object.getOwnPropertyDescriptor(e, i),
      s = !o.get && !o.set && o.enumerable && o.writable && o.configurable;
    let a = !1,
      l = 0;
    for (const f of t)
      f.includes(i) &&
        ((a = !0), s ? (r[l][i] = o.value) : Object.defineProperty(r[l], i, o)),
        ++l;
    a || (s ? (n[i] = o.value) : Object.defineProperty(n, i, o));
  }
  return [...r, n];
}
function Ae(e) {
  let t, n;
  const r = i => {
    const o = C.context;
    if (o) {
      const [a, l] = L();
      C.count || (C.count = 0),
        C.count++,
        (n || (n = e())).then(f => {
          !C.done && Re(o), C.count--, l(() => f.default), Re();
        }),
        (t = a);
    } else if (!t) {
      const [a] = Jr(() => (n || (n = e())).then(l => l.default));
      t = a;
    }
    let s;
    return k(() =>
      (s = t())
        ? ne(() => {
            if (!o || C.done) return s(i);
            const a = C.context;
            Re(o);
            const l = s(i);
            return Re(a), l;
          })
        : ""
    );
  };
  return (
    (r.preload = () => n || ((n = e()).then(i => (t = () => i.default)), n)), r
  );
}
let pl = 0;
function Dt() {
  return C.context ? C.getNextContextId() : `cl-${pl++}`;
}
const ss = e => `Stale read from <${e}>.`;
function fe(e) {
  const t = "fallback" in e && { fallback: () => e.fallback };
  return k(hl(() => e.each, e.children, t || void 0));
}
function Q(e) {
  const t = e.keyed,
    n = k(() => e.when, void 0, void 0),
    r = t ? n : k(n, void 0, { equals: (i, o) => !i == !o });
  return k(
    () => {
      const i = r();
      if (i) {
        const o = e.children;
        return typeof o == "function" && o.length > 0
          ? ne(() =>
              o(
                t
                  ? i
                  : () => {
                      if (!ne(r)) throw ss("Show");
                      return n();
                    }
              )
            )
          : o;
      }
      return e.fallback;
    },
    void 0,
    void 0
  );
}
function as(e) {
  const t = mt(() => e.children),
    n = k(() => {
      const r = t(),
        i = Array.isArray(r) ? r : [r];
      let o = () => {};
      for (let s = 0; s < i.length; s++) {
        const a = s,
          l = i[s],
          f = o,
          u = k(() => (f() ? void 0 : l.when), void 0, void 0),
          c = l.keyed ? u : k(u, void 0, { equals: (d, g) => !d == !g });
        o = () => f() || (c() ? [a, u, l] : void 0);
      }
      return o;
    });
  return k(
    () => {
      const r = n()();
      if (!r) return e.fallback;
      const [i, o, s] = r,
        a = s.children;
      return typeof a == "function" && a.length > 0
        ? ne(() =>
            a(
              s.keyed
                ? o()
                : () => {
                    if (ne(n)()?.[0] !== i) throw ss("Match");
                    return o();
                  }
            )
          )
        : a;
    },
    void 0,
    void 0
  );
}
function lt(e) {
  return e;
}
let $t;
function ls() {
  $t && [...$t].forEach(e => e());
}
function vl(e) {
  let t;
  C.context && C.load && (t = C.load(C.getContextId()));
  const [n, r] = L(t, void 0);
  return (
    $t || ($t = new Set()),
    $t.add(r),
    U(() => $t.delete(r)),
    k(
      () => {
        let i;
        if ((i = n())) {
          const o = e.fallback;
          return typeof o == "function" && o.length
            ? ne(() => o(i, () => r()))
            : o;
        }
        return il(() => e.children, r);
      },
      void 0,
      void 0
    )
  );
}
const yl = ve();
function ei(e) {
  let t = 0,
    n,
    r,
    i,
    o,
    s;
  const [a, l] = L(!1),
    f = ll(),
    u = {
      increment: () => {
        ++t === 1 && l(!0);
      },
      decrement: () => {
        --t === 0 && l(!1);
      },
      inFallback: a,
      effects: [],
      resolved: !1
    },
    c = dt();
  if (C.context && C.load) {
    const m = C.getContextId();
    let p = C.load(m);
    if (
      (p &&
        (typeof p != "object" || p.status !== "success"
          ? (i = p)
          : C.gather(m)),
      i && i !== "$$f")
    ) {
      const [b, $] = L(void 0, { equals: !1 });
      (o = b),
        i.then(
          () => {
            if (C.done) return $();
            C.gather(m), Re(r), $(), Re();
          },
          A => {
            (s = A), $();
          }
        );
    }
  }
  const d = ie(yl);
  d && (n = d.register(u.inFallback));
  let g;
  return (
    U(() => g && g()),
    h(f.Provider, {
      value: u,
      get children() {
        return k(() => {
          if (s) throw s;
          if (((r = C.context), o)) return o(), (o = void 0);
          r && i === "$$f" && Re();
          const m = k(() => e.children);
          return k(p => {
            const b = u.inFallback(),
              { showContent: $ = !0, showFallback: A = !0 } = n ? n() : {};
            if ((!b || (i && i !== "$$f")) && $)
              return (
                (u.resolved = !0),
                g && g(),
                (g = r = i = void 0),
                al(u.effects),
                m()
              );
            if (A)
              return g
                ? p
                : Oe(
                    N => (
                      (g = N),
                      r && (Re({ id: r.id + "F", count: 0 }), (r = void 0)),
                      e.fallback
                    ),
                    c
                  );
          });
        });
      }
    })
  );
}
const bl = void 0,
  _l = [
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "disabled",
    "formnovalidate",
    "hidden",
    "indeterminate",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "seamless",
    "selected"
  ],
  wl = new Set([
    "className",
    "value",
    "readOnly",
    "formNoValidate",
    "isMap",
    "noModule",
    "playsInline",
    ..._l
  ]),
  xl = new Set(["innerHTML", "textContent", "innerText", "children"]),
  El = Object.assign(Object.create(null), {
    className: "class",
    htmlFor: "for"
  }),
  Sl = Object.assign(Object.create(null), {
    class: "className",
    formnovalidate: { $: "formNoValidate", BUTTON: 1, INPUT: 1 },
    ismap: { $: "isMap", IMG: 1 },
    nomodule: { $: "noModule", SCRIPT: 1 },
    playsinline: { $: "playsInline", VIDEO: 1 },
    readonly: { $: "readOnly", INPUT: 1, TEXTAREA: 1 }
  });
function Al(e, t) {
  const n = Sl[e];
  return typeof n == "object" ? (n[t] ? n.$ : void 0) : n;
}
const $l = new Set([
    "beforeinput",
    "click",
    "dblclick",
    "contextmenu",
    "focusin",
    "focusout",
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "pointerdown",
    "pointermove",
    "pointerout",
    "pointerover",
    "pointerup",
    "touchend",
    "touchmove",
    "touchstart"
  ]),
  Cl = new Set([
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animate",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "color-profile",
    "cursor",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "font",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignObject",
    "g",
    "glyph",
    "glyphRef",
    "hkern",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "missing-glyph",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "set",
    "stop",
    "svg",
    "switch",
    "symbol",
    "text",
    "textPath",
    "tref",
    "tspan",
    "use",
    "view",
    "vkern"
  ]),
  Tl = {
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace"
  };
function Pl(e, t, n) {
  let r = n.length,
    i = t.length,
    o = r,
    s = 0,
    a = 0,
    l = t[i - 1].nextSibling,
    f = null;
  for (; s < i || a < o; ) {
    if (t[s] === n[a]) {
      s++, a++;
      continue;
    }
    for (; t[i - 1] === n[o - 1]; ) i--, o--;
    if (i === s) {
      const u = o < r ? (a ? n[a - 1].nextSibling : n[o - a]) : l;
      for (; a < o; ) e.insertBefore(n[a++], u);
    } else if (o === a)
      for (; s < i; ) (!f || !f.has(t[s])) && t[s].remove(), s++;
    else if (t[s] === n[o - 1] && n[a] === t[i - 1]) {
      const u = t[--i].nextSibling;
      e.insertBefore(n[a++], t[s++].nextSibling),
        e.insertBefore(n[--o], u),
        (t[i] = n[o]);
    } else {
      if (!f) {
        f = new Map();
        let c = a;
        for (; c < o; ) f.set(n[c], c++);
      }
      const u = f.get(t[s]);
      if (u != null)
        if (a < u && u < o) {
          let c = s,
            d = 1,
            g;
          for (
            ;
            ++c < i && c < o && !((g = f.get(t[c])) == null || g !== u + d);

          )
            d++;
          if (d > u - a) {
            const m = t[s];
            for (; a < u; ) e.insertBefore(n[a++], m);
          } else e.replaceChild(n[a++], t[s++]);
        } else s++;
      else t[s++].remove();
    }
  }
}
const Ci = "_$DX_DELEGATE";
function Ti(e, t, n, r = {}) {
  let i;
  return (
    Oe(o => {
      (i = o),
        t === document ? e() : x(t, e(), t.firstChild ? null : void 0, n);
    }, r.owner),
    () => {
      i(), (t.textContent = "");
    }
  );
}
function S(e, t, n, r) {
  let i;
  const o = () => {
      const a = r
        ? document.createElementNS(
            "http://www.w3.org/1998/Math/MathML",
            "template"
          )
        : document.createElement("template");
      return (
        (a.innerHTML = e),
        n
          ? a.content.firstChild.firstChild
          : r
          ? a.firstChild
          : a.content.firstChild
      );
    },
    s = t
      ? () => ne(() => document.importNode(i || (i = o()), !0))
      : () => (i || (i = o())).cloneNode(!0);
  return (s.cloneNode = s), s;
}
function Vn(e, t = window.document) {
  const n = t[Ci] || (t[Ci] = new Set());
  for (let r = 0, i = e.length; r < i; r++) {
    const o = e[r];
    n.has(o) || (n.add(o), t.addEventListener(o, us));
  }
}
function Il(e, t, n) {
  Xe(e) || (e[t] = n);
}
function oe(e, t, n) {
  Xe(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Ol(e, t, n, r) {
  Xe(e) || (r == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, r));
}
function Ll(e, t, n) {
  Xe(e) || (n ? e.setAttribute(t, "") : e.removeAttribute(t));
}
function M(e, t) {
  Xe(e) || (t == null ? e.removeAttribute("class") : (e.className = t));
}
function cs(e, t, n, r) {
  if (r)
    Array.isArray(n)
      ? ((e[`$$${t}`] = n[0]), (e[`$$${t}Data`] = n[1]))
      : (e[`$$${t}`] = n);
  else if (Array.isArray(n)) {
    const i = n[0];
    e.addEventListener(t, (n[0] = o => i.call(e, n[1], o)));
  } else e.addEventListener(t, n, typeof n != "function" && n);
}
function pt(e, t, n = {}) {
  const r = Object.keys(t || {}),
    i = Object.keys(n);
  let o, s;
  for (o = 0, s = i.length; o < s; o++) {
    const a = i[o];
    !a || a === "undefined" || t[a] || (Pi(e, a, !1), delete n[a]);
  }
  for (o = 0, s = r.length; o < s; o++) {
    const a = r[o],
      l = !!t[a];
    !a || a === "undefined" || n[a] === l || !l || (Pi(e, a, !0), (n[a] = l));
  }
  return n;
}
function It(e, t, n) {
  if (!t) return n ? oe(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return (r.cssText = t);
  typeof n == "string" && (r.cssText = n = void 0),
    n || (n = {}),
    t || (t = {});
  let i, o;
  for (o in n) t[o] == null && r.removeProperty(o), delete n[o];
  for (o in t) (i = t[o]), i !== n[o] && (r.setProperty(o, i), (n[o] = i));
  return n;
}
function Me(e, t = {}, n, r) {
  const i = {};
  return (
    r || D(() => (i.children = Ot(e, t.children, i.children))),
    D(() => typeof t.ref == "function" && ze(t.ref, e)),
    D(() => kl(e, t, n, !0, i, !0)),
    i
  );
}
function ze(e, t, n) {
  return ne(() => e(t, n));
}
function x(e, t, n, r) {
  if ((n !== void 0 && !r && (r = []), typeof t != "function"))
    return Ot(e, t, r, n);
  D(i => Ot(e, t(), i, n), r);
}
function kl(e, t, n, r, i = {}, o = !1) {
  t || (t = {});
  for (const s in i)
    if (!(s in t)) {
      if (s === "children") continue;
      i[s] = Ii(e, s, null, i[s], n, o, t);
    }
  for (const s in t) {
    if (s === "children") {
      r || Ot(e, t.children);
      continue;
    }
    const a = t[s];
    i[s] = Ii(e, s, a, i[s], n, o, t);
  }
}
function Bl(e, t, n = {}) {
  if (globalThis._$HY.done) return Ti(e, t, [...t.childNodes], n);
  (C.completed = globalThis._$HY.completed),
    (C.events = globalThis._$HY.events),
    (C.load = r => globalThis._$HY.r[r]),
    (C.has = r => r in globalThis._$HY.r),
    (C.gather = r => Li(t, r)),
    (C.registry = new Map()),
    (C.context = { id: n.renderId || "", count: 0 });
  try {
    return Li(t, n.renderId), Ti(e, t, [...t.childNodes], n);
  } finally {
    C.context = null;
  }
}
function E(e) {
  let t, n;
  return !Xe() || !(t = C.registry.get((n = Rl())))
    ? e()
    : (C.completed && C.completed.add(t), C.registry.delete(n), t);
}
function X(e) {
  let t = e,
    n = 0,
    r = [];
  if (Xe(e))
    for (; t; ) {
      if (t.nodeType === 8) {
        const i = t.nodeValue;
        if (i === "$") n++;
        else if (i === "/") {
          if (n === 0) return [t, r];
          n--;
        }
      }
      r.push(t), (t = t.nextSibling);
    }
  return [t, r];
}
function vt() {
  C.events &&
    !C.events.queued &&
    (queueMicrotask(() => {
      const { completed: e, events: t } = C;
      if (t) {
        for (t.queued = !1; t.length; ) {
          const [n, r] = t[0];
          if (!e.has(n)) return;
          t.shift(), us(r);
        }
        C.done &&
          ((C.events = _$HY.events = null),
          (C.completed = _$HY.completed = null));
      }
    }),
    (C.events.queued = !0));
}
function Xe(e) {
  return !!C.context && !C.done && (!e || e.isConnected);
}
function Nl(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function Pi(e, t, n) {
  const r = t.trim().split(/\s+/);
  for (let i = 0, o = r.length; i < o; i++) e.classList.toggle(r[i], n);
}
function Ii(e, t, n, r, i, o, s) {
  let a, l, f, u, c;
  if (t === "style") return It(e, n, r);
  if (t === "classList") return pt(e, n, r);
  if (n === r) return r;
  if (t === "ref") o || n(e);
  else if (t.slice(0, 3) === "on:") {
    const d = t.slice(3);
    r && e.removeEventListener(d, r, typeof r != "function" && r),
      n && e.addEventListener(d, n, typeof n != "function" && n);
  } else if (t.slice(0, 10) === "oncapture:") {
    const d = t.slice(10);
    r && e.removeEventListener(d, r, !0), n && e.addEventListener(d, n, !0);
  } else if (t.slice(0, 2) === "on") {
    const d = t.slice(2).toLowerCase(),
      g = $l.has(d);
    if (!g && r) {
      const m = Array.isArray(r) ? r[0] : r;
      e.removeEventListener(d, m);
    }
    (g || n) && (cs(e, d, n, g), g && Vn([d]));
  } else if (t.slice(0, 5) === "attr:") oe(e, t.slice(5), n);
  else if (t.slice(0, 5) === "bool:") Ll(e, t.slice(5), n);
  else if (
    (c = t.slice(0, 5) === "prop:") ||
    (f = xl.has(t)) ||
    (!i && ((u = Al(t, e.tagName)) || (l = wl.has(t)))) ||
    (a = e.nodeName.includes("-") || "is" in s)
  ) {
    if (c) (t = t.slice(5)), (l = !0);
    else if (Xe(e)) return n;
    t === "class" || t === "className"
      ? M(e, n)
      : a && !l && !f
      ? (e[Nl(t)] = n)
      : (e[u || t] = n);
  } else {
    const d = i && t.indexOf(":") > -1 && Tl[t.split(":")[0]];
    d ? Ol(e, d, t, n) : oe(e, El[t] || t, n);
  }
  return n;
}
function us(e) {
  if (C.registry && C.events && C.events.find(([l, f]) => f === e)) return;
  let t = e.target;
  const n = `$$${e.type}`,
    r = e.target,
    i = e.currentTarget,
    o = l => Object.defineProperty(e, "target", { configurable: !0, value: l }),
    s = () => {
      const l = t[n];
      if (l && !t.disabled) {
        const f = t[`${n}Data`];
        if ((f !== void 0 ? l.call(t, f, e) : l.call(t, e), e.cancelBubble))
          return;
      }
      return (
        t.host &&
          typeof t.host != "string" &&
          !t.host._$host &&
          t.contains(e.target) &&
          o(t.host),
        !0
      );
    },
    a = () => {
      for (; s() && (t = t._$host || t.parentNode || t.host); );
    };
  if (
    (Object.defineProperty(e, "currentTarget", {
      configurable: !0,
      get() {
        return t || document;
      }
    }),
    C.registry && !C.done && (C.done = _$HY.done = !0),
    e.composedPath)
  ) {
    const l = e.composedPath();
    o(l[0]);
    for (let f = 0; f < l.length - 2 && ((t = l[f]), !!s()); f++) {
      if (t._$host) {
        (t = t._$host), a();
        break;
      }
      if (t.parentNode === i) break;
    }
  } else a();
  o(r);
}
function Ot(e, t, n, r, i) {
  const o = Xe(e);
  if (o) {
    !n && (n = [...e.childNodes]);
    let l = [];
    for (let f = 0; f < n.length; f++) {
      const u = n[f];
      u.nodeType === 8 && u.data.slice(0, 2) === "!$" ? u.remove() : l.push(u);
    }
    n = l;
  }
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const s = typeof t,
    a = r !== void 0;
  if (
    ((e = (a && n[0] && n[0].parentNode) || e),
    s === "string" || s === "number")
  ) {
    if (o || (s === "number" && ((t = t.toString()), t === n))) return n;
    if (a) {
      let l = n[0];
      l && l.nodeType === 3
        ? l.data !== t && (l.data = t)
        : (l = document.createTextNode(t)),
        (n = xt(e, n, r, l));
    } else
      n !== "" && typeof n == "string"
        ? (n = e.firstChild.data = t)
        : (n = e.textContent = t);
  } else if (t == null || s === "boolean") {
    if (o) return n;
    n = xt(e, n, r);
  } else {
    if (s === "function")
      return (
        D(() => {
          let l = t();
          for (; typeof l == "function"; ) l = l();
          n = Ot(e, l, n, r);
        }),
        () => n
      );
    if (Array.isArray(t)) {
      const l = [],
        f = n && Array.isArray(n);
      if (Tr(l, t, n, i)) return D(() => (n = Ot(e, l, n, r, !0))), () => n;
      if (o) {
        if (!l.length) return n;
        if (r === void 0) return (n = [...e.childNodes]);
        let u = l[0];
        if (u.parentNode !== e) return n;
        const c = [u];
        for (; (u = u.nextSibling) !== r; ) c.push(u);
        return (n = c);
      }
      if (l.length === 0) {
        if (((n = xt(e, n, r)), a)) return n;
      } else
        f
          ? n.length === 0
            ? Oi(e, l, r)
            : Pl(e, n, l)
          : (n && xt(e), Oi(e, l));
      n = l;
    } else if (t.nodeType) {
      if (o && t.parentNode) return (n = a ? [t] : t);
      if (Array.isArray(n)) {
        if (a) return (n = xt(e, n, r, t));
        xt(e, n, null, t);
      } else
        n == null || n === "" || !e.firstChild
          ? e.appendChild(t)
          : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function Tr(e, t, n, r) {
  let i = !1;
  for (let o = 0, s = t.length; o < s; o++) {
    let a = t[o],
      l = n && n[e.length],
      f;
    if (!(a == null || a === !0 || a === !1))
      if ((f = typeof a) == "object" && a.nodeType) e.push(a);
      else if (Array.isArray(a)) i = Tr(e, a, l) || i;
      else if (f === "function")
        if (r) {
          for (; typeof a == "function"; ) a = a();
          i =
            Tr(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || i;
        } else e.push(a), (i = !0);
      else {
        const u = String(a);
        l && l.nodeType === 3 && l.data === u
          ? e.push(l)
          : e.push(document.createTextNode(u));
      }
  }
  return i;
}
function Oi(e, t, n = null) {
  for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function xt(e, t, n, r) {
  if (n === void 0) return (e.textContent = "");
  const i = r || document.createTextNode("");
  if (t.length) {
    let o = !1;
    for (let s = t.length - 1; s >= 0; s--) {
      const a = t[s];
      if (i !== a) {
        const l = a.parentNode === e;
        !o && !s
          ? l
            ? e.replaceChild(i, a)
            : e.insertBefore(i, n)
          : l && a.remove();
      } else o = !0;
    }
  } else e.insertBefore(i, n);
  return [i];
}
function Li(e, t) {
  const n = e.querySelectorAll("*[data-hk]");
  for (let r = 0; r < n.length; r++) {
    const i = n[r],
      o = i.getAttribute("data-hk");
    (!t || o.startsWith(t)) && !C.registry.has(o) && C.registry.set(o, i);
  }
}
function Rl() {
  return C.getNextContextId();
}
function Dl(e) {
  return C.context ? void 0 : e.children;
}
const Ml = () => {},
  On = !1,
  Hl = "http://www.w3.org/2000/svg";
function fs(e, t = !1) {
  return t ? document.createElementNS(Hl, e) : document.createElement(e);
}
const Fl = (...e) => (gl(), Bl(...e));
function ds(e) {
  const { useShadow: t } = e,
    n = document.createTextNode(""),
    r = () => e.mount || document.body,
    i = dt();
  let o,
    s = !!C.context;
  return (
    H(
      () => {
        s && (dt().user = s = !1), o || (o = Jo(i, () => k(() => e.children)));
        const a = r();
        if (a instanceof HTMLHeadElement) {
          const [l, f] = L(!1),
            u = () => f(!0);
          Oe(c => x(a, () => (l() ? c() : o()), null)), U(u);
        } else {
          const l = fs(e.isSVG ? "g" : "div", e.isSVG),
            f = t && l.attachShadow ? l.attachShadow({ mode: "open" }) : l;
          Object.defineProperty(l, "_$host", {
            get() {
              return n.parentNode;
            },
            configurable: !0
          }),
            x(f, o),
            a.appendChild(l),
            e.ref && e.ref(l),
            U(() => a.removeChild(l));
        }
      },
      void 0,
      { render: !s }
    ),
    n
  );
}
function Ul(e, t) {
  const n = k(e);
  return k(() => {
    const r = n();
    switch (typeof r) {
      case "function":
        return ne(() => r(t));
      case "string":
        const i = Cl.has(r),
          o = C.context ? E() : fs(r, i);
        return Me(o, t, i), o;
    }
  });
}
function we(e) {
  const [, t] = le(e, ["component"]);
  return Ul(() => e.component, t);
}
const Vl = "modulepreload",
  Gl = function(e) {
    return "/" + e;
  },
  ki = {},
  $e = function(t, n, r) {
    if (!n || n.length === 0) return t();
    const i = document.getElementsByTagName("link");
    return Promise.all(
      n.map(o => {
        if (((o = Gl(o)), o in ki)) return;
        ki[o] = !0;
        const s = o.endsWith(".css"),
          a = s ? '[rel="stylesheet"]' : "";
        if (!!r)
          for (let u = i.length - 1; u >= 0; u--) {
            const c = i[u];
            if (c.href === o && (!s || c.rel === "stylesheet")) return;
          }
        else if (document.querySelector(`link[href="${o}"]${a}`)) return;
        const f = document.createElement("link");
        if (
          ((f.rel = s ? "stylesheet" : Vl),
          s || ((f.as = "script"), (f.crossOrigin = "")),
          (f.href = o),
          document.head.appendChild(f),
          s)
        )
          return new Promise((u, c) => {
            f.addEventListener("load", u),
              f.addEventListener("error", () =>
                c(new Error(`Unable to preload CSS for ${o}`))
              );
          });
      })
    )
      .then(() => t())
      .catch(o => {
        const s = new Event("vite:preloadError", { cancelable: !0 });
        if (((s.payload = o), window.dispatchEvent(s), !s.defaultPrevented))
          throw o;
      });
  },
  Pr = Symbol("store-raw"),
  Tt = Symbol("store-node"),
  qe = Symbol("store-has"),
  hs = Symbol("store-self");
function gs(e) {
  let t = e[Le];
  if (
    !t &&
    (Object.defineProperty(e, Le, { value: (t = new Proxy(e, Zl)) }),
    !Array.isArray(e))
  ) {
    const n = Object.keys(e),
      r = Object.getOwnPropertyDescriptors(e);
    for (let i = 0, o = n.length; i < o; i++) {
      const s = n[i];
      r[s].get &&
        Object.defineProperty(e, s, {
          enumerable: r[s].enumerable,
          get: r[s].get.bind(t)
        });
    }
  }
  return t;
}
function tt(e) {
  let t;
  return (
    e != null &&
    typeof e == "object" &&
    (e[Le] ||
      !(t = Object.getPrototypeOf(e)) ||
      t === Object.prototype ||
      Array.isArray(e))
  );
}
function gt(e, t = new Set()) {
  let n, r, i, o;
  if ((n = e != null && e[Pr])) return n;
  if (!tt(e) || t.has(e)) return e;
  if (Array.isArray(e)) {
    Object.isFrozen(e) ? (e = e.slice(0)) : t.add(e);
    for (let s = 0, a = e.length; s < a; s++)
      (i = e[s]), (r = gt(i, t)) !== i && (e[s] = r);
  } else {
    Object.isFrozen(e) ? (e = Object.assign({}, e)) : t.add(e);
    const s = Object.keys(e),
      a = Object.getOwnPropertyDescriptors(e);
    for (let l = 0, f = s.length; l < f; l++)
      (o = s[l]), !a[o].get && ((i = e[o]), (r = gt(i, t)) !== i && (e[o] = r));
  }
  return e;
}
function Ln(e, t) {
  let n = e[t];
  return (
    n || Object.defineProperty(e, t, { value: (n = Object.create(null)) }), n
  );
}
function en(e, t, n) {
  if (e[t]) return e[t];
  const [r, i] = L(n, { equals: !1, internal: !0 });
  return (r.$ = i), (e[t] = r);
}
function jl(e, t) {
  const n = Reflect.getOwnPropertyDescriptor(e, t);
  return (
    !n ||
      n.get ||
      !n.configurable ||
      t === Le ||
      t === Tt ||
      (delete n.value, delete n.writable, (n.get = () => e[Le][t])),
    n
  );
}
function ms(e) {
  Tn() && en(Ln(e, Tt), hs)();
}
function ql(e) {
  return ms(e), Reflect.ownKeys(e);
}
const Zl = {
  get(e, t, n) {
    if (t === Pr) return e;
    if (t === Le) return n;
    if (t === $n) return ms(e), n;
    const r = Ln(e, Tt),
      i = r[t];
    let o = i ? i() : e[t];
    if (t === Tt || t === qe || t === "__proto__") return o;
    if (!i) {
      const s = Object.getOwnPropertyDescriptor(e, t);
      Tn() &&
        (typeof o != "function" || e.hasOwnProperty(t)) &&
        !(s && s.get) &&
        (o = en(r, t, o)());
    }
    return tt(o) ? gs(o) : o;
  },
  has(e, t) {
    return t === Pr ||
      t === Le ||
      t === $n ||
      t === Tt ||
      t === qe ||
      t === "__proto__"
      ? !0
      : (Tn() && en(Ln(e, qe), t)(), t in e);
  },
  set() {
    return !0;
  },
  deleteProperty() {
    return !0;
  },
  ownKeys: ql,
  getOwnPropertyDescriptor: jl
};
function Ie(e, t, n, r = !1) {
  if (!r && e[t] === n) return;
  const i = e[t],
    o = e.length;
  n === void 0
    ? (delete e[t], e[qe] && e[qe][t] && i !== void 0 && e[qe][t].$())
    : ((e[t] = n), e[qe] && e[qe][t] && i === void 0 && e[qe][t].$());
  let s = Ln(e, Tt),
    a;
  if (((a = en(s, t, i)) && a.$(() => n), Array.isArray(e) && e.length !== o)) {
    for (let l = e.length; l < o; l++) (a = s[l]) && a.$();
    (a = en(s, "length", o)) && a.$(e.length);
  }
  (a = s[hs]) && a.$();
}
function ps(e, t) {
  const n = Object.keys(t);
  for (let r = 0; r < n.length; r += 1) {
    const i = n[r];
    Ie(e, i, t[i]);
  }
}
function zl(e, t) {
  if ((typeof t == "function" && (t = t(e)), (t = gt(t)), Array.isArray(t))) {
    if (e === t) return;
    let n = 0,
      r = t.length;
    for (; n < r; n++) {
      const i = t[n];
      e[n] !== i && Ie(e, n, i);
    }
    Ie(e, "length", r);
  } else ps(e, t);
}
function zt(e, t, n = []) {
  let r,
    i = e;
  if (t.length > 1) {
    r = t.shift();
    const s = typeof r,
      a = Array.isArray(e);
    if (Array.isArray(r)) {
      for (let l = 0; l < r.length; l++) zt(e, [r[l]].concat(t), n);
      return;
    } else if (a && s === "function") {
      for (let l = 0; l < e.length; l++) r(e[l], l) && zt(e, [l].concat(t), n);
      return;
    } else if (a && s === "object") {
      const { from: l = 0, to: f = e.length - 1, by: u = 1 } = r;
      for (let c = l; c <= f; c += u) zt(e, [c].concat(t), n);
      return;
    } else if (t.length > 1) {
      zt(e[r], t, [r].concat(n));
      return;
    }
    (i = e[r]), (n = [r].concat(n));
  }
  let o = t[0];
  (typeof o == "function" && ((o = o(i, n)), o === i)) ||
    (r === void 0 && o == null) ||
    ((o = gt(o)),
    r === void 0 || (tt(i) && tt(o) && !Array.isArray(o))
      ? ps(i, o)
      : Ie(e, r, o));
}
function Wl(...[e, t]) {
  const n = gt(e || {}),
    r = Array.isArray(n),
    i = gs(n);
  function o(...s) {
    ft(() => {
      r && s.length === 1 ? zl(n, s[0]) : zt(n, s);
    });
  }
  return [i, o];
}
const Ir = Symbol("store-root");
function St(e, t, n, r, i) {
  const o = t[n];
  if (e === o) return;
  const s = Array.isArray(e);
  if (
    n !== Ir &&
    (!tt(e) || !tt(o) || s !== Array.isArray(o) || (i && e[i] !== o[i]))
  ) {
    Ie(t, n, e);
    return;
  }
  if (s) {
    if (e.length && o.length && (!r || (i && e[0] && e[0][i] != null))) {
      let f, u, c, d, g, m, p, b;
      for (
        c = 0, d = Math.min(o.length, e.length);
        c < d && (o[c] === e[c] || (i && o[c] && e[c] && o[c][i] === e[c][i]));
        c++
      )
        St(e[c], o, c, r, i);
      const $ = new Array(e.length),
        A = new Map();
      for (
        d = o.length - 1, g = e.length - 1;
        d >= c &&
        g >= c &&
        (o[d] === e[g] || (i && o[d] && e[g] && o[d][i] === e[g][i]));
        d--, g--
      )
        $[g] = o[d];
      if (c > g || c > d) {
        for (u = c; u <= g; u++) Ie(o, u, e[u]);
        for (; u < e.length; u++) Ie(o, u, $[u]), St(e[u], o, u, r, i);
        o.length > e.length && Ie(o, "length", e.length);
        return;
      }
      for (p = new Array(g + 1), u = g; u >= c; u--)
        (m = e[u]),
          (b = i && m ? m[i] : m),
          (f = A.get(b)),
          (p[u] = f === void 0 ? -1 : f),
          A.set(b, u);
      for (f = c; f <= d; f++)
        (m = o[f]),
          (b = i && m ? m[i] : m),
          (u = A.get(b)),
          u !== void 0 && u !== -1 && (($[u] = o[f]), (u = p[u]), A.set(b, u));
      for (u = c; u < e.length; u++)
        u in $ ? (Ie(o, u, $[u]), St(e[u], o, u, r, i)) : Ie(o, u, e[u]);
    } else for (let f = 0, u = e.length; f < u; f++) St(e[f], o, f, r, i);
    o.length > e.length && Ie(o, "length", e.length);
    return;
  }
  const a = Object.keys(e);
  for (let f = 0, u = a.length; f < u; f++) St(e[a[f]], o, a[f], r, i);
  const l = Object.keys(o);
  for (let f = 0, u = l.length; f < u; f++)
    e[l[f]] === void 0 && Ie(o, l[f], void 0);
}
function Xl(e, t = {}) {
  const { merge: n, key: r = "id" } = t,
    i = gt(e);
  return o => {
    if (!tt(o) || !tt(i)) return i;
    const s = St(i, { [Ir]: o }, Ir, n, r);
    return s === void 0 ? o : s;
  };
}
function Ql(e, t) {
  e && t && Fl(e, t);
}
const vs = ve(),
  Kl = ["title", "meta"],
  Bi = [],
  Ni = ["name", "http-equiv", "content", "charset", "media"].concat([
    "property"
  ]),
  Ri = (e, t) => {
    const n = Object.fromEntries(
      Object.entries(e.props)
        .filter(([r]) => t.includes(r))
        .sort()
    );
    return (
      (Object.hasOwn(n, "name") || Object.hasOwn(n, "property")) &&
        ((n.name = n.name || n.property), delete n.property),
      e.tag + JSON.stringify(n)
    );
  };
function Yl() {
  if (!C.context) {
    const n = document.head.querySelectorAll("[data-sm]");
    Array.prototype.forEach.call(n, r => r.parentNode.removeChild(r));
  }
  const e = new Map();
  function t(n) {
    if (n.ref) return n.ref;
    let r = document.querySelector(`[data-sm="${n.id}"]`);
    return (
      r
        ? (r.tagName.toLowerCase() !== n.tag &&
            (r.parentNode && r.parentNode.removeChild(r),
            (r = document.createElement(n.tag))),
          r.removeAttribute("data-sm"))
        : (r = document.createElement(n.tag)),
      r
    );
  }
  return {
    addTag(n) {
      if (Kl.indexOf(n.tag) !== -1) {
        const o = n.tag === "title" ? Bi : Ni,
          s = Ri(n, o);
        e.has(s) || e.set(s, []);
        let a = e.get(s),
          l = a.length;
        (a = [...a, n]), e.set(s, a);
        let f = t(n);
        (n.ref = f), Me(f, n.props);
        let u = null;
        for (var r = l - 1; r >= 0; r--)
          if (a[r] != null) {
            u = a[r];
            break;
          }
        return (
          f.parentNode != document.head && document.head.appendChild(f),
          u && u.ref && u.ref.parentNode && document.head.removeChild(u.ref),
          l
        );
      }
      let i = t(n);
      return (
        (n.ref = i),
        Me(i, n.props),
        i.parentNode != document.head && document.head.appendChild(i),
        -1
      );
    },
    removeTag(n, r) {
      const i = n.tag === "title" ? Bi : Ni,
        o = Ri(n, i);
      if (n.ref) {
        const s = e.get(o);
        if (s) {
          if (n.ref.parentNode) {
            n.ref.parentNode.removeChild(n.ref);
            for (let a = r - 1; a >= 0; a--)
              s[a] != null && document.head.appendChild(s[a].ref);
          }
          (s[r] = null), e.set(o, s);
        } else n.ref.parentNode && n.ref.parentNode.removeChild(n.ref);
      }
    }
  };
}
const Jl = e => {
    const t = Yl();
    return h(vs.Provider, {
      value: t,
      get children() {
        return e.children;
      }
    });
  },
  Gn = (e, t, n) => (
    ec({
      tag: e,
      props: t,
      setting: n,
      id: Dt(),
      get name() {
        return t.name || t.property;
      }
    }),
    null
  );
function ec(e) {
  const t = ie(vs);
  if (!t) throw new Error("<MetaProvider /> should be in the tree");
  D(() => {
    const n = t.addTag(e);
    U(() => t.removeTag(e, n));
  });
}
const tc = e => Gn("title", e, { escape: !0, close: !0 }),
  ti = e => Gn("style", e, { close: !0 }),
  nr = e => Gn("meta", e),
  wn = e => Gn("link", e);
function nc(e, t, n) {
  return e.addEventListener(t, n), () => e.removeEventListener(t, n);
}
function rc([e, t], n, r) {
  return [n ? () => n(e()) : e, r ? i => t(r(i)) : t];
}
function ic(e) {
  if (e === "#") return null;
  try {
    return document.querySelector(e);
  } catch {
    return null;
  }
}
function oc(e, t) {
  const n = ic(`#${e}`);
  n ? n.scrollIntoView() : t && window.scrollTo(0, 0);
}
function sc(e, t, n, r) {
  let i = !1;
  const o = a => (typeof a == "string" ? { value: a } : a),
    s = rc(
      L(o(e()), { equals: (a, l) => a.value === l.value }),
      void 0,
      a => (!i && t(a), a)
    );
  return (
    n &&
      U(
        n((a = e()) => {
          (i = !0), s[1](o(a)), (i = !1);
        })
      ),
    { signal: s, utils: r }
  );
}
function ac(e) {
  if (e) {
    if (Array.isArray(e)) return { signal: e };
  } else return { signal: L({ value: "" }) };
  return e;
}
function lc() {
  return sc(
    () => ({
      value:
        window.location.pathname +
        window.location.search +
        window.location.hash,
      state: history.state
    }),
    ({ value: e, replace: t, scroll: n, state: r }) => {
      t
        ? window.history.replaceState(r, "", e)
        : window.history.pushState(r, "", e),
        oc(window.location.hash.slice(1), n);
    },
    e => nc(window, "popstate", () => e()),
    { go: e => window.history.go(e) }
  );
}
function cc() {
  let e = new Set();
  function t(i) {
    return e.add(i), () => e.delete(i);
  }
  let n = !1;
  function r(i, o) {
    if (n) return !(n = !1);
    const s = {
      to: i,
      options: o,
      defaultPrevented: !1,
      preventDefault: () => (s.defaultPrevented = !0)
    };
    for (const a of e)
      a.listener({
        ...s,
        from: a.location,
        retry: l => {
          l && (n = !0), a.navigate(i, o);
        }
      });
    return !s.defaultPrevented;
  }
  return { subscribe: t, confirm: r };
}
const uc = /^(?:[a-z0-9]+:)?\/\//i,
  fc = /^\/+|(\/)\/+$/g;
function ut(e, t = !1) {
  const n = e.replace(fc, "$1");
  return n ? (t || /^[?#]/.test(n) ? n : "/" + n) : "";
}
function xn(e, t, n) {
  if (uc.test(t)) return;
  const r = ut(e),
    i = n && ut(n);
  let o = "";
  return (
    !i || t.startsWith("/")
      ? (o = r)
      : i.toLowerCase().indexOf(r.toLowerCase()) !== 0
      ? (o = r + i)
      : (o = i),
    (o || "/") + ut(t, !o)
  );
}
function dc(e, t) {
  if (e == null) throw new Error(t);
  return e;
}
function ys(e, t) {
  return ut(e).replace(/\/*(\*.*)?$/g, "") + ut(t);
}
function hc(e) {
  const t = {};
  return (
    e.searchParams.forEach((n, r) => {
      t[r] = n;
    }),
    t
  );
}
function gc(e, t, n) {
  const [r, i] = e.split("/*", 2),
    o = r.split("/").filter(Boolean),
    s = o.length;
  return a => {
    const l = a.split("/").filter(Boolean),
      f = l.length - s;
    if (f < 0 || (f > 0 && i === void 0 && !t)) return null;
    const u = { path: s ? "" : "/", params: {} },
      c = d => (n === void 0 ? void 0 : n[d]);
    for (let d = 0; d < s; d++) {
      const g = o[d],
        m = l[d],
        p = g[0] === ":",
        b = p ? g.slice(1) : g;
      if (p && rr(m, c(b))) u.params[b] = m;
      else if (p || !rr(m, g)) return null;
      u.path += `/${m}`;
    }
    if (i) {
      const d = f ? l.slice(-f).join("/") : "";
      if (rr(d, c(i))) u.params[i] = d;
      else return null;
    }
    return u;
  };
}
function rr(e, t) {
  const n = r => r.localeCompare(e, void 0, { sensitivity: "base" }) === 0;
  return t === void 0
    ? !0
    : typeof t == "string"
    ? n(t)
    : typeof t == "function"
    ? t(e)
    : Array.isArray(t)
    ? t.some(n)
    : t instanceof RegExp
    ? t.test(e)
    : !1;
}
function mc(e) {
  const [t, n] = e.pattern.split("/*", 2),
    r = t.split("/").filter(Boolean);
  return r.reduce(
    (i, o) => i + (o.startsWith(":") ? 2 : 3),
    r.length - (n === void 0 ? 0 : 1)
  );
}
function bs(e) {
  const t = new Map(),
    n = dt();
  return new Proxy(
    {},
    {
      get(r, i) {
        return (
          t.has(i) ||
            Jo(n, () =>
              t.set(
                i,
                k(() => e()[i])
              )
            ),
          t.get(i)()
        );
      },
      getOwnPropertyDescriptor() {
        return { enumerable: !0, configurable: !0 };
      },
      ownKeys() {
        return Reflect.ownKeys(e());
      }
    }
  );
}
function pc(e, t) {
  const n = new URLSearchParams(e);
  Object.entries(t).forEach(([i, o]) => {
    o == null || o === "" ? n.delete(i) : n.set(i, String(o));
  });
  const r = n.toString();
  return r ? `?${r}` : "";
}
function _s(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t) return [e];
  let n = e.slice(0, t.index),
    r = e.slice(t.index + t[0].length);
  const i = [n, (n += t[1])];
  for (; (t = /^(\/\:[^\/]+)\?/.exec(r)); )
    i.push((n += t[1])), (r = r.slice(t[0].length));
  return _s(r).reduce((o, s) => [...o, ...i.map(a => a + s)], []);
}
const vc = 100,
  ws = ve(),
  jn = ve(),
  yt = () => dc(ie(ws), "Make sure your app is wrapped in a <Router />");
let tn;
const qn = () => tn || ie(jn) || yt().base,
  yc = e => {
    const t = qn();
    return k(() => t.resolvePath(e()));
  },
  bc = e => {
    const t = yt();
    return k(() => {
      const n = e();
      return n !== void 0 ? t.renderPath(n) : n;
    });
  },
  Zn = () => yt().navigatorFactory(),
  sn = () => yt().location,
  ni = () => yt().isRouting,
  _c = () => qn().data,
  wc = () => {
    const e = sn(),
      t = Zn(),
      n = (r, i) => {
        const o = ne(() => e.pathname + pc(e.search, r) + e.hash);
        t(o, { scroll: !1, resolve: !1, ...i });
      };
    return [e.query, n];
  },
  xc = e => {
    const t = yt().beforeLeave.subscribe({
      listener: e,
      location: sn(),
      navigate: Zn()
    });
    U(t);
  };
function Ec(e, t = "", n) {
  const { component: r, data: i, children: o } = e,
    s = !o || (Array.isArray(o) && !o.length),
    a = {
      key: e,
      element: r
        ? () => h(r, {})
        : () => {
            const { element: l } = e;
            return l === void 0 && n ? h(n, {}) : l;
          },
      preload: e.component ? r.preload : e.preload,
      data: i
    };
  return xs(e.path).reduce((l, f) => {
    for (const u of _s(f)) {
      const c = ys(t, u),
        d = s ? c : c.split("/*", 1)[0];
      l.push({
        ...a,
        originalPath: u,
        pattern: d,
        matcher: gc(d, !s, e.matchFilters)
      });
    }
    return l;
  }, []);
}
function Sc(e, t = 0) {
  return {
    routes: e,
    score: mc(e[e.length - 1]) * 1e4 - t,
    matcher(n) {
      const r = [];
      for (let i = e.length - 1; i >= 0; i--) {
        const o = e[i],
          s = o.matcher(n);
        if (!s) return null;
        r.unshift({ ...s, route: o });
      }
      return r;
    }
  };
}
function xs(e) {
  return Array.isArray(e) ? e : [e];
}
function Es(e, t = "", n, r = [], i = []) {
  const o = xs(e);
  for (let s = 0, a = o.length; s < a; s++) {
    const l = o[s];
    if (l && typeof l == "object" && l.hasOwnProperty("path")) {
      const f = Ec(l, t, n);
      for (const u of f) {
        r.push(u);
        const c = Array.isArray(l.children) && l.children.length === 0;
        if (l.children && !c) Es(l.children, u.pattern, n, r, i);
        else {
          const d = Sc([...r], i.length);
          i.push(d);
        }
        r.pop();
      }
    }
  }
  return r.length ? i : i.sort((s, a) => a.score - s.score);
}
function Ac(e, t) {
  for (let n = 0, r = e.length; n < r; n++) {
    const i = e[n].matcher(t);
    if (i) return i;
  }
  return [];
}
function $c(e, t) {
  const n = new URL("http://sar"),
    r = k(
      l => {
        const f = e();
        try {
          return new URL(f, n);
        } catch {
          return console.error(`Invalid path ${f}`), l;
        }
      },
      n,
      { equals: (l, f) => l.href === f.href }
    ),
    i = k(() => r().pathname),
    o = k(() => r().search, !0),
    s = k(() => r().hash),
    a = k(() => "");
  return {
    get pathname() {
      return i();
    },
    get search() {
      return o();
    },
    get hash() {
      return s();
    },
    get state() {
      return t();
    },
    get key() {
      return a();
    },
    query: bs(De(o, () => hc(r())))
  };
}
function Cc(e, t = "", n, r) {
  const {
      signal: [i, o],
      utils: s = {}
    } = ac(e),
    a = s.parsePath || (G => G),
    l = s.renderPath || (G => G),
    f = s.beforeLeave || cc(),
    u = xn("", t),
    c = void 0;
  if (u === void 0) throw new Error(`${u} is not a valid base path`);
  u && !i().value && o({ value: u, replace: !0, scroll: !1 });
  const [d, g] = L(!1),
    m = async G => {
      g(!0);
      try {
        await Un(G);
      } finally {
        g(!1);
      }
    },
    [p, b] = L(i().value),
    [$, A] = L(i().state),
    N = $c(p, $),
    T = [],
    I = {
      pattern: u,
      params: {},
      path: () => u,
      outlet: () => null,
      resolvePath(G) {
        return xn(u, G);
      }
    };
  if (n)
    try {
      (tn = I),
        (I.data = n({
          data: void 0,
          params: {},
          location: N,
          navigate: re(I)
        }));
    } finally {
      tn = void 0;
    }
  function z(G, O, v) {
    ne(() => {
      if (typeof O == "number") {
        O &&
          (s.go
            ? f.confirm(O, v) && s.go(O)
            : console.warn(
                "Router integration does not support relative routing"
              ));
        return;
      }
      const { replace: y, resolve: w, scroll: _, state: W } = {
          replace: !1,
          resolve: !0,
          scroll: !0,
          ...v
        },
        B = w ? G.resolvePath(O) : xn("", O);
      if (B === void 0) throw new Error(`Path '${O}' is not a routable path`);
      if (T.length >= vc) throw new Error("Too many redirects");
      const Y = p();
      if ((B !== Y || W !== $()) && !On) {
        if (f.confirm(B, v)) {
          const ue = T.push({ value: Y, replace: y, scroll: _, state: $() });
          m(() => {
            b(B), A(W), ls();
          }).then(() => {
            T.length === ue && R({ value: B, state: W });
          });
        }
      }
    });
  }
  function re(G) {
    return (G = G || ie(jn) || I), (O, v) => z(G, O, v);
  }
  function R(G) {
    const O = T[0];
    O &&
      ((G.value !== O.value || G.state !== O.state) &&
        o({ ...G, replace: O.replace, scroll: O.scroll }),
      (T.length = 0));
  }
  D(() => {
    const { value: G, state: O } = i();
    ne(() => {
      G !== p() &&
        m(() => {
          b(G), A(O);
        });
    });
  });
  {
    let G = function(O) {
      if (
        O.defaultPrevented ||
        O.button !== 0 ||
        O.metaKey ||
        O.altKey ||
        O.ctrlKey ||
        O.shiftKey
      )
        return;
      const v = O.composedPath().find(
        Y => Y instanceof Node && Y.nodeName.toUpperCase() === "A"
      );
      if (!v || !v.hasAttribute("link")) return;
      const y = v.href;
      if (v.target || (!y && !v.hasAttribute("state"))) return;
      const w = (v.getAttribute("rel") || "").split(/\s+/);
      if (v.hasAttribute("download") || (w && w.includes("external"))) return;
      const _ = new URL(y);
      if (
        _.origin !== window.location.origin ||
        (u &&
          _.pathname &&
          !_.pathname.toLowerCase().startsWith(u.toLowerCase()))
      )
        return;
      const W = a(_.pathname + _.search + _.hash),
        B = v.getAttribute("state");
      O.preventDefault(),
        z(I, W, {
          resolve: !1,
          replace: v.hasAttribute("replace"),
          scroll: !v.hasAttribute("noscroll"),
          state: B && JSON.parse(B)
        });
    };
    Vn(["click"]),
      document.addEventListener("click", G),
      U(() => document.removeEventListener("click", G));
  }
  return {
    base: I,
    out: c,
    location: N,
    isRouting: d,
    renderPath: l,
    parsePath: a,
    navigatorFactory: re,
    beforeLeave: f
  };
}
function Tc(e, t, n, r, i) {
  const { base: o, location: s, navigatorFactory: a } = e,
    { pattern: l, element: f, preload: u, data: c } = r().route,
    d = k(() => r().path);
  u && u();
  const g = {
    parent: t,
    pattern: l,
    get child() {
      return n();
    },
    path: d,
    params: i,
    data: t.data,
    outlet: f,
    resolvePath(m) {
      return xn(o.path(), m, d());
    }
  };
  if (c)
    try {
      (tn = g),
        (g.data = c({ data: t.data, params: i, location: s, navigate: a(g) }));
    } finally {
      tn = void 0;
    }
  return g;
}
var Pc = S("<a link>");
const Ic = e => {
    const { source: t, url: n, base: r, data: i, out: o } = e,
      s = t || lc(),
      a = Cc(s, r, i);
    return h(ws.Provider, {
      value: a,
      get children() {
        return e.children;
      }
    });
  },
  Oc = e => {
    const t = yt(),
      n = qn(),
      r = mt(() => e.children),
      i = k(() => Es(r(), ys(n.pattern, e.base || ""), Lc)),
      o = k(() => Ac(i(), t.location.pathname)),
      s = bs(() => {
        const u = o(),
          c = {};
        for (let d = 0; d < u.length; d++) Object.assign(c, u[d].params);
        return c;
      });
    t.out &&
      t.out.matches.push(
        o().map(({ route: u, path: c, params: d }) => ({
          originalPath: u.originalPath,
          pattern: u.pattern,
          path: c,
          params: d
        }))
      );
    const a = [];
    let l;
    const f = k(
      De(o, (u, c, d) => {
        let g = c && u.length === c.length;
        const m = [];
        for (let p = 0, b = u.length; p < b; p++) {
          const $ = c && c[p],
            A = u[p];
          d && $ && A.route.key === $.route.key
            ? (m[p] = d[p])
            : ((g = !1),
              a[p] && a[p](),
              Oe(N => {
                (a[p] = N),
                  (m[p] = Tc(
                    t,
                    m[p - 1] || n,
                    () => f()[p + 1],
                    () => o()[p],
                    s
                  ));
              }));
        }
        return (
          a.splice(u.length).forEach(p => p()), d && g ? d : ((l = m[0]), m)
        );
      })
    );
    return h(Q, {
      get when() {
        return f() && l;
      },
      keyed: !0,
      children: u =>
        h(jn.Provider, {
          value: u,
          get children() {
            return u.outlet();
          }
        })
    });
  },
  Lc = () => {
    const e = qn();
    return h(Q, {
      get when() {
        return e.child;
      },
      keyed: !0,
      children: t =>
        h(jn.Provider, {
          value: t,
          get children() {
            return t.outlet();
          }
        })
    });
  };
function kc(e) {
  e = F({ inactiveClass: "inactive", activeClass: "active" }, e);
  const [, t] = le(e, [
      "href",
      "state",
      "class",
      "activeClass",
      "inactiveClass",
      "end"
    ]),
    n = yc(() => e.href),
    r = bc(n),
    i = sn(),
    o = k(() => {
      const s = n();
      if (s === void 0) return !1;
      const a = ut(s.split(/[?#]/, 1)[0]).toLowerCase(),
        l = ut(i.pathname).toLowerCase();
      return e.end ? a === l : l.startsWith(a);
    });
  return (() => {
    var s = E(Pc);
    return (
      Me(
        s,
        F(t, {
          get href() {
            return r() || e.href;
          },
          get state() {
            return JSON.stringify(e.state);
          },
          get classList() {
            return {
              ...(e.class && { [e.class]: !0 }),
              [e.inactiveClass]: !o(),
              [e.activeClass]: o(),
              ...t.classList
            };
          },
          get "aria-current"() {
            return o() ? "page" : void 0;
          }
        }),
        !1,
        !1
      ),
      vt(),
      s
    );
  })();
}
function p6(e) {
  const t = Zn(),
    n = sn(),
    { href: r, state: i } = e,
    o = typeof r == "function" ? r({ navigate: t, location: n }) : r;
  return t(o, { replace: !0, state: i }), null;
}
const Bc = sn,
  Ss = "$FETCH",
  As = ve({ $type: Ss }),
  zn = () => ie(As),
  Nc = kc,
  Rc = Oc,
  $s = Zn,
  Dc = wc;
function v6() {
  return _c();
}
const Ct = "Location",
  Cs = "content-type",
  Mc = "x-solidstart-response-type",
  Hc = "x-solidstart-content-type",
  Fc = "x-solidstart-origin",
  Uc = "application/json";
function Di(e, t = 302) {
  let n = t;
  typeof n == "number"
    ? (n = { status: n })
    : typeof n.status > "u" && (n.status = 302),
    e === "" && (e = "/");
  let r = new Headers(n.headers);
  return r.set(Ct, e), new Response(null, { ...n, headers: r });
}
const Vc = new Set([204, 301, 302, 303, 307, 308]);
function kn(e) {
  return e && e instanceof Response && Vc.has(e.status);
}
const Or = new Set(),
  ir = new Map();
function he(e, t = {}) {
  const n = $s(),
    r = zn();
  function i(f) {
    kn(f) &&
      Un(() => {
        let u = f.headers.get(Ct);
        u && u.startsWith("/")
          ? n(u, { replace: !0 })
          : u && (window.location.href = u);
      });
  }
  const o = async f => {
    try {
      let u = r,
        c = await e.call(u, f, u);
      if (c instanceof Response) {
        On || setTimeout(() => i(c), 0);
        return;
      }
      return c;
    } catch (u) {
      if (u instanceof Response) {
        setTimeout(() => i(u), 0);
        return;
      }
      throw u;
    }
  };
  function s(f) {
    return (u, c) => {
      if (
        c.refetching &&
        c.refetching !== !0 &&
        !qc(u, c.refetching) &&
        c.value
      )
        return c.value;
      if (u === !0) return f(u, c);
      let d = ir.get(u);
      return d || ((d = f(u, c)), ir.set(u, d), d.finally(() => ir.delete(u)));
    };
  }
  const [a, { refetch: l }] = Jr(t.key || !0, s(o), {
    storage: f => jc(f, t.reconcileOptions),
    ...t
  });
  return Or.add(l), U(() => Or.delete(l)), a;
}
function Gc(e) {
  return Un(() => {
    for (let t of Or) t(e);
  });
}
function jc(e, t) {
  const [n, r] = Wl({ value: e });
  return [
    () => n.value,
    i => {
      const o = ne(() => gt(n.value));
      return (
        typeof i == "function" && (i = i(o)), r("value", Xl(i, t)), n.value
      );
    }
  ];
}
function qc(e, t) {
  return Ts(Mi(e), Mi(t));
}
function Mi(e) {
  return Array.isArray(e) ? e : [e];
}
function Ts(e, t) {
  return e === t
    ? !0
    : typeof e != typeof t || (e.length && !t.length)
    ? !1
    : e && t && typeof e == "object" && typeof t == "object"
    ? !Object.keys(t).some(n => !Ts(e[n], t[n]))
    : !1;
}
class Ps extends Error {
  status;
  constructor(t, { status: n, stack: r } = {}) {
    super(t),
      (this.name = "ServerError"),
      (this.status = n || 400),
      r && (this.stack = r);
  }
}
class Is extends Ps {
  formError;
  fields;
  fieldErrors;
  constructor(t, { fieldErrors: n = {}, form: r, fields: i, stack: o } = {}) {
    super(t, { stack: o }),
      (this.formError = t),
      (this.name = "FormError"),
      (this.fields =
        i || Object.fromEntries(typeof r < "u" ? r.entries() : []) || {}),
      (this.fieldErrors = n);
  }
}
var Zc = S("<form>");
let zc = e => {
  let [t, n] = le(
      F(
        {
          reloadDocument: !1,
          replace: !1,
          method: "post",
          action: "/",
          encType: "application/x-www-form-urlencoded"
        },
        e
      ),
      [
        "reloadDocument",
        "replace",
        "method",
        "action",
        "encType",
        "onSubmission",
        "onSubmit",
        "children",
        "ref"
      ]
    ),
    r = Wc(a => {
      t.onSubmission && t.onSubmission(a);
    }),
    i = t.method.toLowerCase() === "get" ? "get" : "post",
    o = null,
    s = null;
  return (
    H(() => {
      if (!s) return;
      function a(l) {
        if (
          !(l.target instanceof HTMLElement || l.target instanceof SVGElement)
        )
          return;
        let f = l.target.closest("button,input[type=submit]");
        f && f.type === "submit" && (o = f);
      }
      s.addEventListener("click", a),
        U(() => {
          s && s.removeEventListener("click", a);
        });
    }, []),
    (() => {
      var a = E(Zc);
      return (
        ze(l => {
          (s = l), typeof t.ref == "function" && t.ref(l);
        }, a),
        oe(a, "method", i),
        Me(
          a,
          F(
            {
              get action() {
                return e.action;
              },
              get enctype() {
                return t.encType;
              },
              get onSubmit() {
                return t.reloadDocument
                  ? void 0
                  : l => {
                      t.onSubmit && t.onSubmit(l),
                        !l.defaultPrevented &&
                          (l.preventDefault(),
                          r(o || l.currentTarget, {
                            method: t.method,
                            replace: t.replace
                          }),
                          (o = null));
                    };
              }
            },
            n
          ),
          !1,
          !0
        ),
        x(a, () => t.children),
        vt(),
        a
      );
    })()
  );
};
function Wc(e) {
  return (t, n = {}) => {
    let r, i, o, s;
    if (Xc(t)) {
      let c = n.submissionTrigger;
      (r = n.method || t.method),
        (i = n.action || t.action),
        (o = n.encType || t.enctype),
        (s = new FormData(t)),
        c && c.name && s.append(c.name, c.value);
    } else if (
      Hi(t) ||
      (Qc(t) && (t.type === "submit" || t.type === "image"))
    ) {
      let c = t.form;
      if (c == null)
        throw new Error("Cannot submit a <button> without a <form>");
      (r = n.method || t.getAttribute("formmethod") || c.method),
        (i = n.action || t.getAttribute("formaction") || c.action),
        (o = n.encType || t.getAttribute("formenctype") || c.enctype),
        (s = new FormData(c)),
        t.name && s.set(t.name, t.value);
    } else {
      if (Wn(t))
        throw new Error(
          'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
        );
      if (
        ((r = n.method || "get"),
        (i = n.action || "/"),
        (o = n.encType || "application/x-www-form-urlencoded"),
        t instanceof FormData)
      )
        s = t;
      else if (((s = new FormData()), t instanceof URLSearchParams))
        for (let [c, d] of t) s.append(c, d);
      else if (t != null) for (let c of Object.keys(t)) s.append(c, t[c]);
    }
    let { protocol: a, host: l } = window.location,
      f = new URL(Hi(i) ? "/" : i, `${a}//${l}`);
    if (r.toLowerCase() === "get")
      for (let [c, d] of s)
        if (typeof d == "string") f.searchParams.append(c, d);
        else throw new Error("Cannot submit binary form data using GET");
    let u = {
      formData: s,
      action: f.pathname + f.search,
      method: r.toUpperCase(),
      encType: o
    };
    e(u);
  };
}
function Wn(e) {
  return e != null && typeof e.tagName == "string";
}
function Hi(e) {
  return Wn(e) && e.tagName.toLowerCase() === "button";
}
function Xc(e) {
  return Wn(e) && e.tagName.toLowerCase() === "form";
}
function Qc(e) {
  return Wn(e) && e.tagName.toLowerCase() === "input";
}
function ri(e, t = {}) {
  let n = Kc(e);
  const [r, i] = L(n.input),
    [o, s] = L(n.result),
    a = $s(),
    l = zn();
  let f = 0;
  function u(c) {
    let d;
    d = e(c, l);
    const g = ++f;
    return (
      ft(() => {
        s(void 0), i(() => c);
      }),
      d
        .then(
          async m => (
            g === f &&
              (m instanceof Response ? await Fi(m, a, t) : await Lr(m, t),
              !m || kn(m) ? i(void 0) : s({ data: m })),
            m
          )
        )
        .catch(async m => {
          g === f &&
            (m instanceof Response && (await Fi(m, a, t)),
            kn(m) ? i(void 0) : s({ error: m }));
        })
    );
  }
  return (
    (u.url = e.url),
    (u.Form = c => {
      let d = e.url;
      return h(
        zc,
        F(c, {
          action: d,
          onSubmission: g => {
            u(g.formData);
          },
          get children() {
            return c.children;
          }
        })
      );
    }),
    [
      {
        get pending() {
          return !!r() && !o();
        },
        get input() {
          return r();
        },
        get result() {
          return o()?.data;
        },
        get error() {
          return o()?.error;
        },
        clear() {
          ft(() => {
            i(void 0), s(void 0);
          });
        },
        retry() {
          const c = r();
          if (!c) throw new Error("No submission to retry");
          u(c);
        }
      },
      u
    ]
  );
}
function Lr(e, t = {}) {
  return Gc(typeof t.invalidate == "function" ? t.invalidate(e) : t.invalidate);
}
async function Fi(e, t, n) {
  if (e instanceof Response && kn(e)) {
    const r = e.headers.get("Location") || "/";
    return r.startsWith("http") ? (window.location.href = r) : t(r), Lr(e, n);
  } else
    e instanceof Response &&
      e.headers.get("Content-type") === "text/solid-diff" &&
      (await window.router.update(await e.text())) &&
      window.router.push(e.headers.get("x-solid-location") ?? "/", {});
  return Lr(e, n);
}
function Kc(e) {
  const [t] = Dc();
  let n = t.form ? JSON.parse(t.form) : null;
  if (!n || n.url !== e.url) return {};
  const r = new Map(n.entries);
  return {
    result: {
      error: n.error
        ? new Is(n.error.message, {
            fieldErrors: n.error.fieldErrors,
            stack: n.error.stack,
            form: n.error.form,
            fields: n.error.fields
          })
        : void 0
    },
    input: r
  };
}
async function Ui(e, t) {
  const n = t.headers.get(Hc) || t.headers.get(Cs) || "";
  if (n.includes("json")) return await t.json();
  if (n.includes("text")) return await t.text();
  if (n.includes("server-error")) {
    const r = await t.json();
    return new Ps(r.error.message, { stack: r.error.stack, status: t.status });
  } else if (n.includes("form-error")) {
    const r = await t.json();
    return new Is(r.error.message, {
      fieldErrors: r.error.fieldErrors,
      fields: r.error.fields,
      stack: r.error.stack
    });
  } else if (n.includes("error")) {
    const r = await t.json(),
      i = new Error(r.error.message);
    return r.error.stack && (i.stack = r.error.stack), i;
  } else {
    if (n.includes("response"))
      return t.status === 204 && t.headers.get(Ct)
        ? Di(t.headers.get(Ct) ?? "/")
        : t;
    if (t.status === 200) {
      const r = await t.text();
      try {
        return JSON.parse(r);
      } catch {}
    }
    return t.status === 204 && t.headers.get(Ct)
      ? Di(t.headers.get(Ct) ?? "/")
      : t;
  }
}
const se = e => {
  throw new Error("Should be compiled away");
};
function or(e, ...t) {
  let n,
    r = { [Fc]: "client", ...(e.headers ?? {}) };
  if (t[0] instanceof FormData) n = t[0];
  else {
    if (Array.isArray(t) && t.length > 2) {
      let i = t[1];
      typeof i == "object" &&
        "value" in i &&
        "refetching" in i &&
        (i.value = void 0);
    }
    (n = JSON.stringify(t, (i, o) =>
      o instanceof Headers
        ? { $type: "headers", values: [...o.entries()] }
        : o instanceof Request
        ? { $type: "request", url: o.url, method: o.method, headers: o.headers }
        : o
    )),
      (r[Cs] = Uc);
  }
  return { method: "POST", body: n, ...e, headers: new Headers({ ...r }) };
}
se.createFetcher = (e, t) => {
  let n = function(...r) {
    const i = t ? or({}, r[0]) : or({}, ...r);
    return se.exec(e, i);
  };
  return (
    (n.url = e),
    (n.fetch = (r, ...i) => {
      const o = or(r, ...i);
      se.exec(e, o);
    }),
    n
  );
};
se.exec = async function(e, t) {
  const n = new Request(new URL(e, window.location.href).href, t),
    r = await fetch(n);
  if (r.headers.get(Mc) === "throw") throw await Ui(n, r);
  return await Ui(n, r);
};
se.fetch = async function(e, t) {
  if (e instanceof URL || e.startsWith("http")) return await fetch(e, t);
  const n = new Request(new URL(e, window.location.href).href, t);
  return await fetch(n);
};
function Yc(e) {
  return zn(), U(() => {}), null;
}
const Jc = se.createFetcher("/_m/0e21c8a879/routeData", !0);
function eu() {
  return he(Jc);
}
const tu = se.createFetcher("/_m/1dc9d59806/routeData", !0);
function nu() {
  return he(tu);
}
const ru = se.createFetcher("/_m/fd9800a32d/routeData", !0);
function iu() {
  return he(ru);
}
const ou = se.createFetcher("/_m/0dbe216f23/page", !0),
  su = se.createFetcher("/_m/90d4313cf1/videoIntroLandscapeSrc", !0),
  au = se.createFetcher("/_m/34a106c003/videoLoopLandscapeSrc", !0),
  lu = se.createFetcher("/_m/688bbd5a7c/videoIntroPortraitSrc", !0),
  cu = se.createFetcher("/_m/38c1e00a88/videoLoopPortraitSrc", !0);
function uu() {
  return {
    page: he(ou),
    videoIntroLandscapeSrc: he(su, {
      key: () => "home-page-video-intro-landscape.mp4"
    }),
    videoLoopLandscapeSrc: he(au, {
      key: () => "home-page-video-loop-landscape.mp4"
    }),
    videoIntroPortraitSrc: he(lu, {
      key: () => "home-page-video-intro-portrait.mp4"
    }),
    videoLoopPortraitSrc: he(cu, {
      key: () => "home-page-video-loop-portrait.mp4"
    })
  };
}
const fu = se.createFetcher("/_m/54c96896f5/routeData", !0);
function du({ params: e }) {
  return he(fu, { key: () => e.slug });
}
const hu = se.createFetcher("/_m/7d69d00ea7/routeData", !0);
function gu() {
  return he(hu);
}
const mu = "_focusVisible_1l6mo_1",
  pu = "_focusChild_1l6mo_2",
  vu = "_borderButton_1l6mo_3",
  yu = "_verticalScroll_1l6mo_14",
  bu = "_horizontalScroll_1l6mo_18",
  _u = "_backgroundShadow_1l6mo_50",
  wu = "_hoverUnderline_1l6mo_93",
  xu = "_dialog_1l6mo_101",
  Eu = "_fixFlashing_1l6mo_122",
  ce = {
    focusVisible: mu,
    focusChild: pu,
    borderButton: vu,
    verticalScroll: yu,
    horizontalScroll: bu,
    backgroundShadow: _u,
    hoverUnderline: wu,
    dialog: xu,
    fixFlashing: Eu
  };
var Su = S(
  "<div><div><p id=error-message></p><button id=reset-errors>Clear errors and retry</button><pre>"
);
function Au(e) {
  return h(vl, {
    fallback: (t, n) =>
      h(Q, {
        get when() {
          return !e.fallback;
        },
        get fallback() {
          return k(() => !!e.fallback)() && e.fallback(t, n);
        },
        get children() {
          return h($u, { error: t });
        }
      }),
    get children() {
      return e.children;
    }
  });
}
function $u(e) {
  return (
    H(() => console.error(e.error)),
    console.log(e.error),
    (() => {
      var t = E(Su),
        n = t.firstChild,
        r = n.firstChild,
        i = r.nextSibling,
        o = i.nextSibling;
      return (
        t.style.setProperty("padding", "16px"),
        n.style.setProperty("background-color", "rgba(252, 165, 165)"),
        n.style.setProperty("color", "rgb(153, 27, 27)"),
        n.style.setProperty("border-radius", "5px"),
        n.style.setProperty("overflow", "scroll"),
        n.style.setProperty("padding", "16px"),
        n.style.setProperty("margin-bottom", "8px"),
        r.style.setProperty("font-weight", "bold"),
        x(r, () => e.error.message),
        cs(i, "click", ls, !0),
        i.style.setProperty("color", "rgba(252, 165, 165)"),
        i.style.setProperty("background-color", "rgb(153, 27, 27)"),
        i.style.setProperty("border-radius", "5px"),
        i.style.setProperty("padding", "4px 8px"),
        o.style.setProperty("margin-top", "8px"),
        o.style.setProperty("width", "100%"),
        x(o, () => e.error.stack),
        vt(),
        t
      );
    })()
  );
}
Vn(["click"]);
const Cu = !1,
  Tu = !1;
function Pu() {
  return Tu;
}
function Iu() {
  return Cu;
}
function Ou() {
  return (
    zn(),
    [
      h(Ml, {}),
      h(Dl, {
        get children() {
          return [h(Pu, {}), k(() => On)];
        }
      })
    ]
  );
}
function Lu() {
  return [h(Iu, {}), h(Ou, {})];
}
function ku(e) {
  return Me(document.documentElement, e, !1, !0), e.children;
}
function Bu(e) {
  return Me(document.head, e, !1, !0), e.children;
}
function Nu(e) {
  {
    let t = mt(() => e.children);
    return (
      Me(document.body, e, !1, !0),
      x(
        document.body,
        () => {
          let n = t();
          if (n) {
            if (Array.isArray(n)) {
              let r = n.filter(i => !!i);
              return r.length ? r : null;
            }
            return n;
          }
          return null;
        },
        null,
        [...document.body.childNodes]
      ),
      document.body
    );
  }
}
const Ru = se.createFetcher("/_m/318bed8b4b/routeData", !0);
function Du({ params: e }) {
  return he(Ru, { key: () => e.pageIndex });
}
const Mu = se.createFetcher("/_m/8ddf4c4d3b/routeData", !0);
function Hu() {
  return he(Mu);
}
const Fu = se.createFetcher("/_m/a76cf3408b/routeData", !0);
function Uu() {
  return he(Fu);
}
const Vu = [
    {
      component: Ae(() => $e(() => import("./_...404_-15fbfb3a.js"), [])),
      path: "/*404"
    },
    {
      data: eu,
      component: Ae(() =>
        $e(() => import("./about-dd827db0.js"), [
          "assets/about-dd827db0.js",
          "assets/PressArticleList-7a34ae27.js",
          "assets/PressArticleList-657cc8a6.css",
          "assets/index-a92d4678.js",
          "assets/FlexSpacer-38291285.js",
          "assets/PageMeta-2f851e2e.js",
          "assets/about-f64e8fdf.css"
        ])
      ),
      path: "/about"
    },
    {
      data: nu,
      component: Ae(() =>
        $e(() => import("./careers-45b89e82.js"), [
          "assets/careers-45b89e82.js",
          "assets/FlexSpacer-38291285.js",
          "assets/PageMeta-2f851e2e.js",
          "assets/careers-938df190.css"
        ])
      ),
      path: "/careers"
    },
    {
      data: iu,
      component: Ae(() =>
        $e(() => import("./events-52bbc87a.js"), [
          "assets/events-52bbc87a.js",
          "assets/FlexSpacer-38291285.js",
          "assets/PageMeta-2f851e2e.js",
          "assets/events-14613583.css"
        ])
      ),
      path: "/events"
    },
    {
      data: uu,
      component: Ae(() =>
        $e(() => import("./index-3ff7e4f4.js"), [
          "assets/index-3ff7e4f4.js",
          "assets/PageMeta-2f851e2e.js",
          "assets/index-5e904f67.css"
        ])
      ),
      path: "/"
    },
    {
      data: du,
      component: Ae(() =>
        $e(() => import("./_slug_-4c2cf160.js"), [
          "assets/_slug_-4c2cf160.js",
          "assets/FlexSpacer-38291285.js",
          "assets/index-a92d4678.js",
          "assets/popper-root-df9f2398.js",
          "assets/PageMeta-2f851e2e.js",
          "assets/_slug_-3bdd5465.css"
        ])
      ),
      path: "/menu/:slug"
    },
    {
      data: gu,
      component: Ae(() => $e(() => import("./index-ae14366f.js"), [])),
      path: "/menu/"
    },
    {
      data: Du,
      component: Ae(() =>
        $e(() => import("./_pageIndex_-2858bfbc.js"), [
          "assets/_pageIndex_-2858bfbc.js",
          "assets/PressArticleList-7a34ae27.js",
          "assets/PressArticleList-657cc8a6.css",
          "assets/FlexSpacer-38291285.js",
          "assets/PageMeta-2f851e2e.js",
          "assets/_pageIndex_-b0b64f76.css"
        ])
      ),
      path: "/press/:pageIndex"
    },
    {
      component: Ae(() => $e(() => import("./index-7aa8c610.js"), [])),
      path: "/press/"
    },
    {
      data: Hu,
      component: Ae(() =>
        $e(() => import("./privacypolicy-9e0ccc50.js"), [
          "assets/privacypolicy-9e0ccc50.js",
          "assets/FlexSpacer-38291285.js",
          "assets/PageMeta-2f851e2e.js",
          "assets/privacypolicy-4925ab9b.css"
        ])
      ),
      path: "/privacypolicy"
    },
    {
      data: Uu,
      component: Ae(() =>
        $e(() => import("./reserve-c9858a35.js"), [
          "assets/reserve-c9858a35.js",
          "assets/FlexSpacer-38291285.js",
          "assets/PageMeta-2f851e2e.js",
          "assets/reserve-33f35ce7.css"
        ])
      ),
      path: "/reserve"
    }
  ],
  Gu = () => Vu;
const ju = ve(() => {}),
  y6 = ve(),
  qu = ve({
    pageStyles: {
      backgroundColor: "var(--color-white)",
      textColor: "var(--color-black)",
      fillColor: "var(--color-black)"
    },
    useBackground: () => {}
  }),
  Qe = ve(() => {}),
  Zu = se.createFetcher("/_m/478a6089f8/site", !0);
function zu(e) {
  const t = he(Zu);
  return h(Qe.Provider, {
    value: t,
    get children() {
      return e.children;
    }
  });
}
function Wu(e) {
  return e !== null && (typeof e == "object" || typeof e == "function");
}
function Os(e) {
  return (...t) => {
    for (const n of e) n && n(...t);
  };
}
var j = e => (typeof e == "function" && !e.length ? e() : e),
  Xu = e => (Array.isArray(e) ? e : e ? [e] : []),
  Qu = (e, t) => {
    const n = j(e);
    typeof n != null && t(n);
  };
function kr(e, ...t) {
  return typeof e == "function" ? e(...t) : e;
}
function Ku(e, t, n) {
  if (C.context) {
    const [r, i] = L(e, n);
    return Be(() => i(() => t())), [r, i];
  }
  return L(t(), n);
}
function Ls(e, t = dt()) {
  let n = 0,
    r,
    i;
  return () => (
    n++,
    U(() => {
      n--,
        queueMicrotask(() => {
          !n && i && (i(), (i = r = void 0));
        });
    }),
    i || Oe(o => (r = e((i = o))), t),
    r
  );
}
var an = Ls;
function Yu(e) {
  const t = dt(),
    n = Ls(e, t);
  return () => (C.context ? Oe(e, t) : n());
}
function Mt() {
  const e = an(() => new Set());
  return () => {
    const t = e(),
      [n, r] = L(!1);
    H(() => {
      function o() {
        r(!1);
      }
      t.add(o),
        U(() => {
          t.delete(o);
        });
    });
    function i(o) {
      ft(() => {
        if (o) {
          for (const s of t) s();
          r(!0);
        } else r(!1);
      });
    }
    return [n, i];
  };
}
const Ju = !!bl,
  Vi = e => (typeof e == "function" && !e.length ? e() : e),
  Gi = e => (Array.isArray(e) ? e : e ? [e] : []),
  e1 = Ju ? e => (dt() ? U(e) : e) : U;
function ii(e, t, n, r) {
  return (
    e.addEventListener(t, n, r), e1(e.removeEventListener.bind(e, t, n, r))
  );
}
function b6(e, t, n, r) {
  const i = () => {
    Gi(Vi(e)).forEach(o => {
      o && Gi(Vi(t)).forEach(s => ii(o, s, n, r));
    });
  };
  typeof e == "function" ? H(i) : D(i);
}
var sr = Symbol("fallback");
function ji(e) {
  for (const t of e) t.dispose();
}
function t1(e, t, n, r = {}) {
  const i = new Map();
  return (
    U(() => ji(i.values())),
    () => {
      const s = e() || [];
      return (
        s[$n],
        ne(() => {
          if (!s.length)
            return (
              ji(i.values()),
              i.clear(),
              r.fallback
                ? [Oe(c => (i.set(sr, { dispose: c }), r.fallback()))]
                : []
            );
          const a = new Array(s.length),
            l = i.get(sr);
          if (!i.size || l) {
            l?.dispose(), i.delete(sr);
            for (let u = 0; u < s.length; u++) {
              const c = s[u],
                d = t(c, u);
              o(a, c, u, d);
            }
            return a;
          }
          const f = new Set(i.keys());
          for (let u = 0; u < s.length; u++) {
            const c = s[u],
              d = t(c, u);
            f.delete(d);
            const g = i.get(d);
            g
              ? ((a[u] = g.mapped), g.setIndex?.(u), g.setItem(() => c))
              : o(a, c, u, d);
          }
          for (const u of f) i.get(u)?.dispose(), i.delete(u);
          return a;
        })
      );
    }
  );
  function o(s, a, l, f) {
    Oe(u => {
      const [c, d] = L(a),
        g = { setItem: d, dispose: u };
      if (n.length > 1) {
        const [m, p] = L(l);
        (g.setIndex = p), (g.mapped = n(c, m));
      } else g.mapped = n(c);
      i.set(f, g), (s[l] = g.mapped);
    });
  }
}
function _6(e) {
  const { by: t } = e;
  return k(
    t1(
      () => e.each,
      typeof t == "function" ? t : n => n[t],
      e.children,
      "fallback" in e ? { fallback: () => e.fallback } : void 0
    )
  );
}
function oi(e) {
  const t =
    typeof e.on == "function" || Array.isArray(e.on) ? e.on : () => e.on;
  return k(
    De(t, (n, r) => {
      const i = e.children;
      return typeof i == "function" && i.length > 0 ? i(n, r) : i;
    })
  );
}
function Br(e) {
  const t = { ...e },
    n = { ...e },
    r = {},
    i = s => {
      let a = r[s];
      if (!a) {
        if (!Tn()) return t[s];
        (r[s] = a = L(t[s], { internal: !0 })), delete t[s];
      }
      return a[0]();
    };
  for (const s in e)
    Object.defineProperty(n, s, { get: () => i(s), enumerable: !0 });
  const o = (s, a) => {
    const l = r[s];
    if (l) return l[1](a);
    s in t && (t[s] = kr(a, [t[s]]));
  };
  return [
    n,
    (s, a) => {
      if (Wu(s)) {
        const l = ne(() => Object.entries(kr(s, n)));
        ft(() => {
          for (const [f, u] of l) o(f, () => u);
        });
      } else o(s, a);
      return n;
    }
  ];
}
function n1(e, t) {
  if (C.context) {
    const [n, r] = Br(e);
    return Be(() => r(t())), [n, r];
  }
  return Br(t());
}
function si(e, t = !1) {
  const n = window.matchMedia(e),
    [r, i] = Ku(t, () => n.matches);
  return ii(n, "change", () => i(n.matches)), r;
}
function r1(e) {
  return si("(prefers-color-scheme: dark)", e);
}
r1.bind(void 0, !1);
function gn() {
  return !0;
}
const i1 = {
  get(e, t, n) {
    return t === Le ? n : e.get(t);
  },
  has(e, t) {
    return e.has(t);
  },
  set: gn,
  deleteProperty: gn,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: gn,
      deleteProperty: gn
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function o1(e) {
  return (...t) => {
    for (const n of e) n && n(...t);
  };
}
function s1(e) {
  return (...t) => {
    for (let n = e.length - 1; n >= 0; n--) {
      const r = e[n];
      r && r(...t);
    }
  };
}
const Nr = e => (typeof e == "function" && !e.length ? e() : e),
  a1 = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;
function qi(e) {
  const t = {};
  let n;
  for (; (n = a1.exec(e)); ) t[n[1]] = n[2];
  return t;
}
function l1(e, t) {
  if (typeof e == "string") {
    if (typeof t == "string") return `${e};${t}`;
    e = qi(e);
  } else typeof t == "string" && (t = qi(t));
  return { ...e, ...t };
}
const ar = (e, t, n) => {
  let r;
  for (const i of e) {
    const o = Nr(i)[t];
    r ? o && (r = n(r, o)) : (r = o);
  }
  return r;
};
function c1(...e) {
  const t = Array.isArray(e[0]),
    n = t ? e[0] : e;
  if (n.length === 1) return n[0];
  const r = t && e[1]?.reverseEventHandlers ? s1 : o1,
    i = {};
  for (const s of n) {
    const a = Nr(s);
    for (const l in a)
      if (l[0] === "o" && l[1] === "n" && l[2]) {
        const f = a[l],
          u = l.toLowerCase(),
          c =
            typeof f == "function"
              ? f
              : Array.isArray(f)
              ? f.length === 1
                ? f[0]
                : f[0].bind(void 0, f[1])
              : void 0;
        c ? (i[u] ? i[u].push(c) : (i[u] = [c])) : delete i[u];
      }
  }
  const o = F(...n);
  return new Proxy(
    {
      get(s) {
        if (typeof s != "string") return Reflect.get(o, s);
        if (s === "style") return ar(n, "style", l1);
        if (s === "ref") {
          const a = [];
          for (const l of n) {
            const f = Nr(l)[s];
            typeof f == "function" && a.push(f);
          }
          return r(a);
        }
        if (s[0] === "o" && s[1] === "n" && s[2]) {
          const a = i[s.toLowerCase()];
          return a ? r(a) : Reflect.get(o, s);
        }
        return s === "class" || s === "className"
          ? ar(n, s, (a, l) => `${a} ${l}`)
          : s === "classList"
          ? ar(n, s, (a, l) => ({ ...a, ...l }))
          : Reflect.get(o, s);
      },
      has(s) {
        return Reflect.has(o, s);
      },
      keys() {
        return Object.keys(o);
      }
    },
    i1
  );
}
function bt(...e) {
  return Os(e);
}
var Zi = e => e instanceof Element;
function Rr(e, t) {
  if (t(e)) return e;
  if (typeof e == "function" && !e.length) return Rr(e(), t);
  if (Array.isArray(e))
    for (const n of e) {
      const r = Rr(n, t);
      if (r) return r;
    }
  return null;
}
function u1(e, t = Zi, n = Zi) {
  const r = k(e);
  return k(() => Rr(r(), t));
}
function zi(e, t) {
  const n = [...e],
    r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function w6(e) {
  return typeof e == "number";
}
function f1(e) {
  return Array.isArray(e);
}
function d1(e) {
  return Object.prototype.toString.call(e) === "[object String]";
}
function ks(e) {
  return typeof e == "function";
}
function ai(e) {
  return t => `${e()}-${t}`;
}
function Ze(e, t) {
  return e ? e === t || e.contains(t) : !1;
}
function Wt(e, t = !1) {
  const { activeElement: n } = Ue(e);
  if (!n?.nodeName) return null;
  if (Bs(n) && n.contentDocument) return Wt(n.contentDocument.body, t);
  if (t) {
    const r = n.getAttribute("aria-activedescendant");
    if (r) {
      const i = Ue(n).getElementById(r);
      if (i) return i;
    }
  }
  return n;
}
function h1(e) {
  return Ue(e).defaultView || window;
}
function Ue(e) {
  return e ? e.ownerDocument || e : document;
}
function Bs(e) {
  return e.tagName === "IFRAME";
}
var Ns = (e => (
  (e.Escape = "Escape"),
  (e.Enter = "Enter"),
  (e.Tab = "Tab"),
  (e.Space = " "),
  (e.ArrowDown = "ArrowDown"),
  (e.ArrowLeft = "ArrowLeft"),
  (e.ArrowRight = "ArrowRight"),
  (e.ArrowUp = "ArrowUp"),
  (e.End = "End"),
  (e.Home = "Home"),
  (e.PageDown = "PageDown"),
  (e.PageUp = "PageUp"),
  e
))(Ns || {});
function Rs(e) {
  return typeof window > "u" || window.navigator == null
    ? !1
    : window.navigator.userAgentData?.brands.some(t => e.test(t.brand)) ||
        e.test(window.navigator.userAgent);
}
function li(e) {
  return typeof window < "u" && window.navigator != null
    ? e.test(
        window.navigator.userAgentData?.platform || window.navigator.platform
      )
    : !1;
}
function ci() {
  return li(/^Mac/i);
}
function g1() {
  return li(/^iPhone/i);
}
function m1() {
  return li(/^iPad/i) || (ci() && navigator.maxTouchPoints > 1);
}
function Ds() {
  return g1() || m1();
}
function x6() {
  return ci() || Ds();
}
function E6() {
  return Rs(/AppleWebKit/i) && !p1();
}
function p1() {
  return Rs(/Chrome/i);
}
function Xn(e, t) {
  return t && (ks(t) ? t(e) : t[0](t[1], e)), e?.defaultPrevented;
}
function Dr(e) {
  return t => {
    for (const n of e) Xn(t, n);
  };
}
function v1(e) {
  return ci() ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey;
}
function je(e) {
  if (e)
    if (y1()) e.focus({ preventScroll: !0 });
    else {
      const t = b1(e);
      e.focus(), _1(t);
    }
}
var mn = null;
function y1() {
  if (mn == null) {
    mn = !1;
    try {
      document.createElement("div").focus({
        get preventScroll() {
          return (mn = !0), !0;
        }
      });
    } catch {}
  }
  return mn;
}
function b1(e) {
  let t = e.parentNode;
  const n = [],
    r = document.scrollingElement || document.documentElement;
  for (; t instanceof HTMLElement && t !== r; )
    (t.offsetHeight < t.scrollHeight || t.offsetWidth < t.scrollWidth) &&
      n.push({ element: t, scrollTop: t.scrollTop, scrollLeft: t.scrollLeft }),
      (t = t.parentNode);
  return (
    r instanceof HTMLElement &&
      n.push({ element: r, scrollTop: r.scrollTop, scrollLeft: r.scrollLeft }),
    n
  );
}
function _1(e) {
  for (const { element: t, scrollTop: n, scrollLeft: r } of e)
    (t.scrollTop = n), (t.scrollLeft = r);
}
var Ms = [
    "input:not([type='hidden']):not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    "a[href]",
    "area[href]",
    "[tabindex]",
    "iframe",
    "object",
    "embed",
    "audio[controls]",
    "video[controls]",
    "[contenteditable]:not([contenteditable='false'])"
  ],
  w1 = [...Ms, '[tabindex]:not([tabindex="-1"]):not([disabled])'],
  ui = Ms.join(":not([hidden]),") + ",[tabindex]:not([disabled]):not([hidden])",
  x1 = w1.join(':not([hidden]):not([tabindex="-1"]),');
function Hs(e, t) {
  const r = Array.from(e.querySelectorAll(ui)).filter(Wi);
  return (
    t && Wi(e) && r.unshift(e),
    r.forEach((i, o) => {
      if (Bs(i) && i.contentDocument) {
        const s = i.contentDocument.body,
          a = Hs(s, !1);
        r.splice(o, 1, ...a);
      }
    }),
    r
  );
}
function Wi(e) {
  return Fs(e) && !E1(e);
}
function Fs(e) {
  return e.matches(ui) && fi(e);
}
function E1(e) {
  return parseInt(e.getAttribute("tabindex") || "0", 10) < 0;
}
function fi(e, t) {
  return (
    e.nodeName !== "#comment" &&
    S1(e) &&
    A1(e, t) &&
    (!e.parentElement || fi(e.parentElement, e))
  );
}
function S1(e) {
  if (!(e instanceof HTMLElement) && !(e instanceof SVGElement)) return !1;
  const { display: t, visibility: n } = e.style;
  let r = t !== "none" && n !== "hidden" && n !== "collapse";
  if (r) {
    if (!e.ownerDocument.defaultView) return r;
    const { getComputedStyle: i } = e.ownerDocument.defaultView,
      { display: o, visibility: s } = i(e);
    r = o !== "none" && s !== "hidden" && s !== "collapse";
  }
  return r;
}
function A1(e, t) {
  return (
    !e.hasAttribute("hidden") &&
    (e.nodeName === "DETAILS" && t && t.nodeName !== "SUMMARY"
      ? e.hasAttribute("open")
      : !0)
  );
}
function $1(e, t) {
  return t.some(n => n.contains(e));
}
function S6(e, t, n) {
  const r = t?.tabbable ? x1 : ui,
    i = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode(o) {
        return t?.from?.contains(o)
          ? NodeFilter.FILTER_REJECT
          : o.matches(r) &&
            fi(o) &&
            (!n || $1(o, n)) &&
            (!t?.accept || t.accept(o))
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      }
    });
  return t?.from && (i.currentNode = t.from), i;
}
function C1() {}
function Ve(e, t) {
  return F(e, t);
}
var Vt = new Map(),
  Xi = new Set();
function Qi() {
  if (typeof window > "u") return;
  const e = n => {
      if (!n.target) return;
      let r = Vt.get(n.target);
      r ||
        ((r = new Set()),
        Vt.set(n.target, r),
        n.target.addEventListener("transitioncancel", t)),
        r.add(n.propertyName);
    },
    t = n => {
      if (!n.target) return;
      const r = Vt.get(n.target);
      if (
        r &&
        (r.delete(n.propertyName),
        r.size === 0 &&
          (n.target.removeEventListener("transitioncancel", t),
          Vt.delete(n.target)),
        Vt.size === 0)
      ) {
        for (const i of Xi) i();
        Xi.clear();
      }
    };
  document.body.addEventListener("transitionrun", e),
    document.body.addEventListener("transitionend", t);
}
typeof document < "u" &&
  (document.readyState !== "loading"
    ? Qi()
    : document.addEventListener("DOMContentLoaded", Qi));
function A6(e, t) {
  const n = Ki(e, t, "left"),
    r = Ki(e, t, "top"),
    i = t.offsetWidth,
    o = t.offsetHeight;
  let s = e.scrollLeft,
    a = e.scrollTop;
  const l = s + e.offsetWidth,
    f = a + e.offsetHeight;
  n <= s ? (s = n) : n + i > l && (s += n + i - l),
    r <= a ? (a = r) : r + o > f && (a += r + o - f),
    (e.scrollLeft = s),
    (e.scrollTop = a);
}
function Ki(e, t, n) {
  const r = n === "left" ? "offsetLeft" : "offsetTop";
  let i = 0;
  for (; t.offsetParent && ((i += t[r]), t.offsetParent !== e); ) {
    if (t.offsetParent.contains(e)) {
      i -= e[r];
      break;
    }
    t = t.offsetParent;
  }
  return i;
}
var T1 = {
  border: "0",
  clip: "rect(0 0 0 0)",
  "clip-path": "inset(50%)",
  height: "1px",
  margin: "0 -1px -1px 0",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  width: "1px",
  "white-space": "nowrap"
};
function Us(e) {
  const [t, n] = L(e.defaultValue?.()),
    r = k(() => e.value?.() !== void 0),
    i = k(() => (r() ? e.value?.() : t()));
  return [
    i,
    s => {
      ne(() => {
        const a = kr(s, i());
        return Object.is(a, i()) || (r() || n(a), e.onChange?.(a)), a;
      });
    }
  ];
}
function Vs(e) {
  const [t, n] = Us(e);
  return [() => t() ?? !1, n];
}
function P1(e = {}) {
  const [t, n] = Vs({
      value: () => j(e.open),
      defaultValue: () => !!j(e.defaultOpen),
      onChange: s => e.onOpenChange?.(s)
    }),
    r = () => {
      n(!0);
    },
    i = () => {
      n(!1);
    };
  return {
    isOpen: t,
    setIsOpen: n,
    open: r,
    close: i,
    toggle: () => {
      t() ? i() : r();
    }
  };
}
function I1(e) {
  const t = n => {
    n.key === Ns.Escape && e.onEscapeKeyDown?.(n);
  };
  H(() => {
    if (j(e.isDisabled)) return;
    const n = e.ownerDocument?.() ?? Ue();
    n.addEventListener("keydown", t),
      U(() => {
        n.removeEventListener("keydown", t);
      });
  });
}
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/dismissable/src/layer-stack.ts
 */ const Bn = "data-kb-top-layer";
let Gs,
  Mr = !1;
const We = [];
function nn(e) {
  return We.findIndex(t => t.node === e);
}
function O1(e) {
  return We[nn(e)];
}
function L1(e) {
  return We[We.length - 1].node === e;
}
function js() {
  return We.filter(e => e.isPointerBlocking);
}
function k1() {
  return [...js()].slice(-1)[0];
}
function di() {
  return js().length > 0;
}
function qs(e) {
  const t = nn(k1()?.node);
  return nn(e) < t;
}
function B1(e) {
  We.push(e);
}
function N1(e) {
  const t = nn(e);
  t < 0 || We.splice(t, 1);
}
function R1() {
  We.forEach(({ node: e }) => {
    e.style.pointerEvents = qs(e) ? "none" : "auto";
  });
}
function D1(e) {
  if (di() && !Mr) {
    const t = Ue(e);
    (Gs = document.body.style.pointerEvents),
      (t.body.style.pointerEvents = "none"),
      (Mr = !0);
  }
}
function M1(e) {
  if (di()) return;
  const t = Ue(e);
  (t.body.style.pointerEvents = Gs),
    t.body.style.length === 0 && t.body.removeAttribute("style"),
    (Mr = !1);
}
const Se = {
  layers: We,
  isTopMostLayer: L1,
  hasPointerBlockingLayer: di,
  isBelowPointerBlockingLayer: qs,
  addLayer: B1,
  removeLayer: N1,
  indexOf: nn,
  find: O1,
  assignPointerEventToLayers: R1,
  disableBodyPointerEvents: D1,
  restoreBodyPointerEvents: M1
};
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/focus-scope/src/FocusScope.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/focus-scope/src/focus-on-child-unmount.ts
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/focus-scope/src/focus-containment.ts
 */ const lr = "focusScope.autoFocusOnMount",
  cr = "focusScope.autoFocusOnUnmount",
  Yi = { bubbles: !1, cancelable: !0 },
  Ji = {
    stack: [],
    active() {
      return this.stack[0];
    },
    add(e) {
      e !== this.active() && this.active()?.pause(),
        (this.stack = zi(this.stack, e)),
        this.stack.unshift(e);
    },
    remove(e) {
      (this.stack = zi(this.stack, e)), this.active()?.resume();
    }
  };
function H1(e, t) {
  const [n, r] = L(!1),
    i = {
      pause() {
        r(!0);
      },
      resume() {
        r(!1);
      }
    };
  let o = null;
  const s = m => e.onMountAutoFocus?.(m),
    a = m => e.onUnmountAutoFocus?.(m),
    l = () => Ue(t()),
    f = () => {
      const m = l().createElement("span");
      return (
        m.setAttribute("data-focus-trap", ""),
        (m.tabIndex = 0),
        Object.assign(m.style, T1),
        m
      );
    },
    u = () => {
      const m = t();
      return m ? Hs(m, !0).filter(p => !p.hasAttribute("data-focus-trap")) : [];
    },
    c = () => {
      const m = u();
      return m.length > 0 ? m[0] : null;
    },
    d = () => {
      const m = u();
      return m.length > 0 ? m[m.length - 1] : null;
    },
    g = () => {
      const m = t();
      if (!m) return !1;
      const p = Wt(m);
      return !p || Ze(m, p) ? !1 : Fs(p);
    };
  H(() => {
    const m = t();
    if (!m) return;
    Ji.add(i);
    const p = Wt(m);
    if (!Ze(m, p)) {
      const $ = new CustomEvent(lr, Yi);
      m.addEventListener(lr, s),
        m.dispatchEvent($),
        $.defaultPrevented ||
          setTimeout(() => {
            je(c()), Wt(m) === p && je(m);
          }, 0);
    }
    U(() => {
      m.removeEventListener(lr, s),
        setTimeout(() => {
          const $ = new CustomEvent(cr, Yi);
          g() && $.preventDefault(),
            m.addEventListener(cr, a),
            m.dispatchEvent($),
            $.defaultPrevented || je(p ?? l().body),
            m.removeEventListener(cr, a),
            Ji.remove(i);
        }, 0);
    });
  }),
    H(() => {
      const m = t();
      if (!m || !j(e.trapFocus) || n()) return;
      const p = $ => {
          const A = $.target;
          A?.closest(`[${Bn}]`) || (Ze(m, A) ? (o = A) : je(o));
        },
        b = $ => {
          const N = $.relatedTarget ?? Wt(m);
          N?.closest(`[${Bn}]`) || Ze(m, N) || je(o);
        };
      l().addEventListener("focusin", p),
        l().addEventListener("focusout", b),
        U(() => {
          l().removeEventListener("focusin", p),
            l().removeEventListener("focusout", b);
        });
    }),
    H(() => {
      const m = t();
      if (!m || !j(e.trapFocus) || n()) return;
      const p = f();
      m.insertAdjacentElement("afterbegin", p);
      const b = f();
      m.insertAdjacentElement("beforeend", b);
      function $(N) {
        const T = c(),
          I = d();
        N.relatedTarget === T ? je(I) : je(T);
      }
      p.addEventListener("focusin", $), b.addEventListener("focusin", $);
      const A = new MutationObserver(N => {
        for (const T of N)
          T.previousSibling === b &&
            (b.remove(), m.insertAdjacentElement("beforeend", b)),
            T.nextSibling === p &&
              (p.remove(), m.insertAdjacentElement("afterbegin", p));
      });
      A.observe(m, { childList: !0, subtree: !1 }),
        U(() => {
          p.removeEventListener("focusin", $),
            b.removeEventListener("focusin", $),
            p.remove(),
            b.remove(),
            A.disconnect();
        });
    });
}
/*!
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the zag team:
 * https://github.com/chakra-ui/zag/blob/c1e6c7689b22bf58741ded7cf224dd9baec2a046/packages/utilities/form-utils/src/form.ts
 */ function F1(e, t) {
  H(
    De(e, n => {
      if (n == null) return;
      const r = U1(n);
      r != null &&
        (r.addEventListener("reset", t, { passive: !0 }),
        U(() => {
          r.removeEventListener("reset", t);
        }));
    })
  );
}
function U1(e) {
  return V1(e) ? e.form : e.closest("form");
}
function V1(e) {
  return e.matches("textarea, input, select, button");
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/live-announcer/src/LiveAnnouncer.tsx
 */ const G1 = "data-live-announcer";
/*!
 * This file is based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/ariaHideOutside.ts
 */ function j1(e) {
  H(() => {
    j(e.isDisabled) || U(q1(j(e.targets), j(e.root)));
  });
}
const Gt = new WeakMap(),
  Te = [];
function q1(e, t = document.body) {
  const n = new Set(e),
    r = new Set(),
    i = l => {
      for (const d of l.querySelectorAll(`[${G1}], [${Bn}]`)) n.add(d);
      const f = d => {
          if (
            n.has(d) ||
            (d.parentElement &&
              r.has(d.parentElement) &&
              d.parentElement.getAttribute("role") !== "row")
          )
            return NodeFilter.FILTER_REJECT;
          for (const g of n) if (d.contains(g)) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        },
        u = document.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, {
          acceptNode: f
        }),
        c = f(l);
      if (
        (c === NodeFilter.FILTER_ACCEPT && o(l), c !== NodeFilter.FILTER_REJECT)
      ) {
        let d = u.nextNode();
        for (; d != null; ) o(d), (d = u.nextNode());
      }
    },
    o = l => {
      const f = Gt.get(l) ?? 0;
      (l.getAttribute("aria-hidden") === "true" && f === 0) ||
        (f === 0 && l.setAttribute("aria-hidden", "true"),
        r.add(l),
        Gt.set(l, f + 1));
    };
  Te.length && Te[Te.length - 1].disconnect(), i(t);
  const s = new MutationObserver(l => {
    for (const f of l)
      if (
        !(f.type !== "childList" || f.addedNodes.length === 0) &&
        ![...n, ...r].some(u => u.contains(f.target))
      ) {
        for (const u of f.removedNodes)
          u instanceof Element && (n.delete(u), r.delete(u));
        for (const u of f.addedNodes)
          (u instanceof HTMLElement || u instanceof SVGElement) &&
          (u.dataset.liveAnnouncer === "true" ||
            u.dataset.reactAriaTopLayer === "true")
            ? n.add(u)
            : u instanceof Element && i(u);
      }
  });
  s.observe(t, { childList: !0, subtree: !0 });
  const a = {
    observe() {
      s.observe(t, { childList: !0, subtree: !0 });
    },
    disconnect() {
      s.disconnect();
    }
  };
  return (
    Te.push(a),
    () => {
      s.disconnect();
      for (const l of r) {
        const f = Gt.get(l);
        if (f == null) return;
        f === 1
          ? (l.removeAttribute("aria-hidden"), Gt.delete(l))
          : Gt.set(l, f - 1);
      }
      a === Te[Te.length - 1]
        ? (Te.pop(), Te.length && Te[Te.length - 1].observe())
        : Te.splice(Te.indexOf(a), 1);
    }
  );
}
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/interact-outside/src/index.ts
 */ const eo = "interactOutside.pointerDownOutside",
  to = "interactOutside.focusOutside";
function Z1(e, t) {
  let n,
    r = C1;
  const i = () => Ue(t()),
    o = c => e.onPointerDownOutside?.(c),
    s = c => e.onFocusOutside?.(c),
    a = c => e.onInteractOutside?.(c),
    l = c => {
      const d = c.target;
      return !(d instanceof HTMLElement) ||
        d.closest(`[${Bn}]`) ||
        !Ze(i(), d) ||
        Ze(t(), d)
        ? !1
        : !e.shouldExcludeElement?.(d);
    },
    f = c => {
      function d() {
        const g = t(),
          m = c.target;
        if (!g || !m || !l(c)) return;
        const p = Dr([o, a]);
        m.addEventListener(eo, p, { once: !0 });
        const b = new CustomEvent(eo, {
          bubbles: !1,
          cancelable: !0,
          detail: {
            originalEvent: c,
            isContextMenu: c.button === 2 || (v1(c) && c.button === 0)
          }
        });
        m.dispatchEvent(b);
      }
      c.pointerType === "touch"
        ? (i().removeEventListener("click", d),
          (r = d),
          i().addEventListener("click", d, { once: !0 }))
        : d();
    },
    u = c => {
      const d = t(),
        g = c.target;
      if (!d || !g || !l(c)) return;
      const m = Dr([s, a]);
      g.addEventListener(to, m, { once: !0 });
      const p = new CustomEvent(to, {
        bubbles: !1,
        cancelable: !0,
        detail: { originalEvent: c, isContextMenu: !1 }
      });
      g.dispatchEvent(p);
    };
  H(() => {
    j(e.isDisabled) ||
      ((n = window.setTimeout(() => {
        i().addEventListener("pointerdown", f, !0);
      }, 0)),
      i().addEventListener("focusin", u, !0),
      U(() => {
        window.clearTimeout(n),
          i().removeEventListener("click", r),
          i().removeEventListener("pointerdown", f, !0),
          i().removeEventListener("focusin", u, !0);
      }));
  });
}
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/presence/src/Presence.tsx
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/presence/src/useStateMachine.tsx
 */ function no(e) {
  const [t, n] = L();
  let r = {},
    i = e(),
    o = "none";
  const [s, a] = z1(e() ? "mounted" : "unmounted", {
    mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
    unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
    unmounted: { MOUNT: "mounted" }
  });
  return (
    H(
      De(s, l => {
        const f = pn(r);
        o = l === "mounted" ? f : "none";
      })
    ),
    H(
      De(e, l => {
        if (i === l) return;
        const f = pn(r);
        l
          ? a("MOUNT")
          : r?.display === "none"
          ? a("UNMOUNT")
          : a(i && o !== f ? "ANIMATION_OUT" : "UNMOUNT"),
          (i = l);
      })
    ),
    H(
      De(t, l => {
        if (l) {
          const f = c => {
              const g = pn(r).includes(c.animationName);
              c.target === l && g && a("ANIMATION_END");
            },
            u = c => {
              c.target === l && (o = pn(r));
            };
          l.addEventListener("animationstart", u),
            l.addEventListener("animationcancel", f),
            l.addEventListener("animationend", f),
            U(() => {
              l.removeEventListener("animationstart", u),
                l.removeEventListener("animationcancel", f),
                l.removeEventListener("animationend", f);
            });
        } else a("ANIMATION_END");
      })
    ),
    {
      isPresent: () => ["mounted", "unmountSuspended"].includes(s()),
      setRef: l => {
        l && (r = getComputedStyle(l)), n(l);
      }
    }
  );
}
function pn(e) {
  return e?.animationName || "none";
}
function z1(e, t) {
  const n = (s, a) => t[s][a] ?? s,
    [r, i] = L(e);
  return [
    r,
    s => {
      i(a => n(a, s));
    }
  ];
}
/*!
 * Portions of this file are based on code from floating-ui.
 * MIT Licensed, Copyright (c) 2021 Floating UI contributors.
 *
 * Credits to the Floating UI contributors:
 * https://github.com/floating-ui/floating-ui/blob/f7ce9420aa32c150eb45049f12cf3b5506715341/packages/react/src/components/FloatingOverlay.tsx
 *
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/5d8a1f047fcadcf117073c70359663a3946b73bf/packages/ariakit/src/dialog/__utils/use-prevent-body-scroll.ts
 */ const ur = "data-kb-scroll-lock";
function ro(e, t) {
  if (!e) return () => {};
  const n = e.style.cssText;
  return (
    Object.assign(e.style, t),
    () => {
      e.style.cssText = n;
    }
  );
}
function W1(e, t, n) {
  if (!e) return () => {};
  const r = e.style.getPropertyValue(t);
  return (
    e.style.setProperty(t, n),
    () => {
      r ? e.style.setProperty(t, r) : e.style.removeProperty(t);
    }
  );
}
function X1(e) {
  const t = e.getBoundingClientRect().left;
  return Math.round(t) + e.scrollLeft ? "paddingLeft" : "paddingRight";
}
function Q1(e) {
  H(() => {
    if (!j(e.ownerRef) || j(e.isDisabled)) return;
    const t = Ue(j(e.ownerRef)),
      n = h1(j(e.ownerRef)),
      { documentElement: r, body: i } = t;
    if (i.hasAttribute(ur)) return;
    i.setAttribute(ur, "");
    const s = n.innerWidth - r.clientWidth,
      a = () => W1(r, "--scrollbar-width", `${s}px`),
      l = X1(r),
      f = () => ro(i, { overflow: "hidden", [l]: `${s}px` }),
      u = () => {
        const { scrollX: d, scrollY: g, visualViewport: m } = n,
          p = m?.offsetLeft ?? 0,
          b = m?.offsetTop ?? 0,
          $ = ro(i, {
            position: "fixed",
            overflow: "hidden",
            top: `${-(g - Math.floor(b))}px`,
            left: `${-(d - Math.floor(p))}px`,
            right: "0",
            [l]: `${s}px`
          });
        return () => {
          $(), n.scrollTo(d, g);
        };
      },
      c = Os([a(), Ds() ? u() : f()]);
    U(() => {
      c(), i.removeAttribute(ur);
    });
  });
}
function ct(e) {
  return t => (e(t), () => e(void 0));
}
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the ariakit team:
 * https://github.com/ariakit/ariakit/blob/8a13899ff807bbf39f3d89d2d5964042ba4d5287/packages/ariakit-react-utils/src/hooks.ts
 */ function hi(e, t) {
  const [n, r] = L(io(t?.()));
  return (
    H(() => {
      r(e()?.tagName.toLowerCase() || io(t?.()));
    }),
    n
  );
}
function io(e) {
  return d1(e) ? e : void 0;
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a13802d8be6f83af1450e56f7a88527b10d9cadf/packages/@react-stately/toggle/src/useToggleState.ts
 */ function K1(e = {}) {
  const [t, n] = Vs({
    value: () => j(e.isSelected),
    defaultValue: () => !!j(e.defaultIsSelected),
    onChange: o => e.onSelectedChange?.(o)
  });
  return {
    isSelected: t,
    setIsSelected: o => {
      !j(e.isReadOnly) && !j(e.isDisabled) && n(o);
    },
    toggle: () => {
      !j(e.isReadOnly) && !j(e.isDisabled) && n(!t());
    }
  };
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/label/src/useField.ts
 */ const Y1 = [
  "id",
  "name",
  "validationState",
  "required",
  "disabled",
  "readOnly"
];
function J1(e) {
  const t = `form-control-${Dt()}`;
  e = Ve({ id: t }, e);
  const [n, r] = L(),
    [i, o] = L(),
    [s, a] = L(),
    [l, f] = L(),
    u = (m, p, b) => {
      const $ = b != null || n() != null;
      return (
        [b, n(), $ && p != null ? m : void 0].filter(Boolean).join(" ") ||
        void 0
      );
    },
    c = m => [s(), l(), m].filter(Boolean).join(" ") || void 0,
    d = k(() => ({
      "data-valid": j(e.validationState) === "valid" ? "" : void 0,
      "data-invalid": j(e.validationState) === "invalid" ? "" : void 0,
      "data-required": j(e.required) ? "" : void 0,
      "data-disabled": j(e.disabled) ? "" : void 0,
      "data-readonly": j(e.readOnly) ? "" : void 0
    }));
  return {
    formControlContext: {
      name: () => j(e.name) ?? j(e.id),
      dataset: d,
      validationState: () => j(e.validationState),
      isRequired: () => j(e.required),
      isDisabled: () => j(e.disabled),
      isReadOnly: () => j(e.readOnly),
      labelId: n,
      fieldId: i,
      descriptionId: s,
      errorMessageId: l,
      getAriaLabelledBy: u,
      getAriaDescribedBy: c,
      generateId: ai(() => j(e.id)),
      registerLabel: ct(r),
      registerField: ct(o),
      registerDescription: ct(a),
      registerErrorMessage: ct(f)
    }
  };
}
const Zs = ve();
function gi() {
  const e = ie(Zs);
  if (e === void 0)
    throw new Error(
      "[kobalte]: `useFormControlContext` must be used within a `FormControlContext.Provider` component"
    );
  return e;
}
const e0 = ["id", "aria-label", "aria-labelledby", "aria-describedby"];
function t0(e) {
  const t = gi();
  return (
    (e = Ve({ id: t.generateId("field") }, e)),
    H(() => U(t.registerField(j(e.id)))),
    {
      fieldProps: {
        id: () => j(e.id),
        ariaLabel: () => j(e["aria-label"]),
        ariaLabelledBy: () =>
          t.getAriaLabelledBy(
            j(e.id),
            j(e["aria-label"]),
            j(e["aria-labelledby"])
          ),
        ariaDescribedBy: () => t.getAriaDescribedBy(j(e["aria-describedby"]))
      }
    }
  );
}
function nt(e) {
  const [t, n] = le(e, ["asChild", "as", "children"]);
  if (!t.asChild)
    return h(
      we,
      F(
        {
          get component() {
            return t.as;
          }
        },
        n,
        {
          get children() {
            return t.children;
          }
        }
      )
    );
  const r = mt(() => t.children);
  if (oo(r())) {
    const i = so(n, r()?.props ?? {});
    return h(we, i);
  }
  if (f1(r())) {
    const i = r().find(oo);
    if (i) {
      const o = () =>
          h(fe, {
            get each() {
              return r();
            },
            children: a =>
              h(Q, {
                when: a === i,
                fallback: a,
                get children() {
                  return i.props.children;
                }
              })
          }),
        s = so(n, i?.props ?? {});
      return h(we, F(s, { children: o }));
    }
  }
  throw new Error(
    "[kobalte]: Component is expected to render `asChild` but no children `As` component was found."
  );
}
const n0 = Symbol("$$KobalteAsComponent");
function oo(e) {
  return e?.[n0] === !0;
}
function so(e, t) {
  return c1([e, t], { reverseEventHandlers: !0 });
}
function r0(e) {
  let t;
  const n = gi();
  e = Ve({ id: n.generateId("label") }, e);
  const [r, i] = le(e, ["ref"]),
    o = hi(
      () => t,
      () => "label"
    );
  return (
    H(() => U(n.registerLabel(i.id))),
    h(
      nt,
      F(
        {
          as: "label",
          ref(s) {
            var a = bt(l => (t = l), r.ref);
            typeof a == "function" && a(s);
          },
          get for() {
            return k(() => o() === "label")() ? n.fieldId() : void 0;
          }
        },
        () => n.dataset(),
        i
      )
    )
  );
}
const i0 = {
  "ar-AE": { dismiss: "تجاهل" },
  "bg-BG": { dismiss: "Отхвърляне" },
  "cs-CZ": { dismiss: "Odstranit" },
  "da-DK": { dismiss: "Luk" },
  "de-DE": { dismiss: "Schließen" },
  "el-GR": { dismiss: "Απόρριψη" },
  "en-US": { dismiss: "Dismiss" },
  "es-ES": { dismiss: "Descartar" },
  "et-EE": { dismiss: "Lõpeta" },
  "fi-FI": { dismiss: "Hylkää" },
  "fr-FR": { dismiss: "Rejeter" },
  "he-IL": { dismiss: "התעלם" },
  "hr-HR": { dismiss: "Odbaci" },
  "hu-HU": { dismiss: "Elutasítás" },
  "it-IT": { dismiss: "Ignora" },
  "ja-JP": { dismiss: "閉じる" },
  "ko-KR": { dismiss: "무시" },
  "lt-LT": { dismiss: "Atmesti" },
  "lv-LV": { dismiss: "Nerādīt" },
  "nb-NO": { dismiss: "Lukk" },
  "nl-NL": { dismiss: "Negeren" },
  "pl-PL": { dismiss: "Zignoruj" },
  "pt-BR": { dismiss: "Descartar" },
  "pt-PT": { dismiss: "Dispensar" },
  "ro-RO": { dismiss: "Revocare" },
  "ru-RU": { dismiss: "Пропустить" },
  "sk-SK": { dismiss: "Zrušiť" },
  "sl-SI": { dismiss: "Opusti" },
  "sr-SP": { dismiss: "Odbaci" },
  "sv-SE": { dismiss: "Avvisa" },
  "tr-TR": { dismiss: "Kapat" },
  "uk-UA": { dismiss: "Скасувати" },
  "zh-CN": { dismiss: "取消" },
  "zh-TW": { dismiss: "關閉" }
};
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/utils.ts
 */ const o0 = new Set([
    "Avst",
    "Arab",
    "Armi",
    "Syrc",
    "Samr",
    "Mand",
    "Thaa",
    "Mend",
    "Nkoo",
    "Adlm",
    "Rohg",
    "Hebr"
  ]),
  s0 = new Set([
    "ae",
    "ar",
    "arc",
    "bcc",
    "bqi",
    "ckb",
    "dv",
    "fa",
    "glk",
    "he",
    "ku",
    "mzn",
    "nqo",
    "pnb",
    "ps",
    "sd",
    "ug",
    "ur",
    "yi"
  ]);
function a0(e) {
  if (Intl.Locale) {
    const n = new Intl.Locale(e).maximize().script ?? "";
    return o0.has(n);
  }
  const t = e.split("-")[0];
  return s0.has(t);
}
function l0(e) {
  return a0(e) ? "rtl" : "ltr";
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useDefaultLocale.ts
 */ function zs() {
  let e =
    (typeof navigator < "u" &&
      (navigator.language || navigator.userLanguage)) ||
    "en-US";
  try {
    Intl.DateTimeFormat.supportedLocalesOf([e]);
  } catch {
    e = "en-US";
  }
  return { locale: e, direction: l0(e) };
}
let Hr = zs();
const Xt = new Set();
function ao() {
  Hr = zs();
  for (const e of Xt) e(Hr);
}
function c0() {
  const [e, t] = L(Hr),
    n = k(() => e());
  return (
    Be(() => {
      Xt.size === 0 && window.addEventListener("languagechange", ao),
        Xt.add(t),
        U(() => {
          Xt.delete(t),
            Xt.size === 0 && window.removeEventListener("languagechange", ao);
        });
    }),
    { locale: () => n().locale, direction: () => n().direction }
  );
}
const u0 = ve();
function f0() {
  const e = c0();
  return ie(u0) || e;
}
class d0 {
  getStringForLocale(t, n) {
    let r = this.messages[n];
    r ||
      ((r = h0(n, this.messages, this.defaultLocale)), (this.messages[n] = r));
    let i = r[t];
    if (!i) throw new Error(`Could not find intl message ${t} in ${n} locale`);
    return i;
  }
  constructor(t, n = "en-US") {
    (this.messages = Object.fromEntries(
      Object.entries(t).filter(([, r]) => r)
    )),
      (this.defaultLocale = n);
  }
}
function h0(e, t, n = "en-US") {
  if (t[e]) return t[e];
  let r = g0(e);
  if (t[r]) return t[r];
  for (let i in t) if (i.startsWith(r + "-")) return t[i];
  return t[n];
}
function g0(e) {
  return Intl.Locale ? new Intl.Locale(e).language : e.split("-")[0];
}
var Fr = function(e, t) {
  return (
    (Fr =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(n, r) {
          n.__proto__ = r;
        }) ||
      function(n, r) {
        for (var i in r)
          Object.prototype.hasOwnProperty.call(r, i) && (n[i] = r[i]);
      }),
    Fr(e, t)
  );
};
function Qn(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError(
      "Class extends value " + String(t) + " is not a constructor or null"
    );
  Fr(e, t);
  function n() {
    this.constructor = e;
  }
  e.prototype =
    t === null ? Object.create(t) : ((n.prototype = t.prototype), new n());
}
var ee = function() {
  return (
    (ee =
      Object.assign ||
      function(t) {
        for (var n, r = 1, i = arguments.length; r < i; r++) {
          n = arguments[r];
          for (var o in n)
            Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
        }
        return t;
      }),
    ee.apply(this, arguments)
  );
};
function m0(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) &&
      t.indexOf(r) < 0 &&
      (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++)
      t.indexOf(r[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
        (n[r[i]] = e[r[i]]);
  return n;
}
function fr(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, i = t.length, o; r < i; r++)
      (o || !(r in t)) &&
        (o || (o = Array.prototype.slice.call(t, 0, r)), (o[r] = t[r]));
  return e.concat(o || Array.prototype.slice.call(t));
}
function dr(e, t) {
  var n = t && t.cache ? t.cache : x0,
    r = t && t.serializer ? t.serializer : _0,
    i = t && t.strategy ? t.strategy : v0;
  return i(e, { cache: n, serializer: r });
}
function p0(e) {
  return e == null || typeof e == "number" || typeof e == "boolean";
}
function Ws(e, t, n, r) {
  var i = p0(r) ? r : n(r),
    o = t.get(i);
  return typeof o > "u" && ((o = e.call(this, r)), t.set(i, o)), o;
}
function Xs(e, t, n) {
  var r = Array.prototype.slice.call(arguments, 3),
    i = n(r),
    o = t.get(i);
  return typeof o > "u" && ((o = e.apply(this, r)), t.set(i, o)), o;
}
function mi(e, t, n, r, i) {
  return n.bind(t, e, r, i);
}
function v0(e, t) {
  var n = e.length === 1 ? Ws : Xs;
  return mi(e, this, n, t.cache.create(), t.serializer);
}
function y0(e, t) {
  return mi(e, this, Xs, t.cache.create(), t.serializer);
}
function b0(e, t) {
  return mi(e, this, Ws, t.cache.create(), t.serializer);
}
var _0 = function() {
    return JSON.stringify(arguments);
  },
  w0 = (function() {
    function e() {
      this.cache = Object.create(null);
    }
    return (
      (e.prototype.get = function(t) {
        return this.cache[t];
      }),
      (e.prototype.set = function(t, n) {
        this.cache[t] = n;
      }),
      e
    );
  })(),
  x0 = {
    create: function() {
      return new w0();
    }
  },
  hr = { variadic: y0, monadic: b0 },
  K;
(function(e) {
  (e[(e.EXPECT_ARGUMENT_CLOSING_BRACE = 1)] = "EXPECT_ARGUMENT_CLOSING_BRACE"),
    (e[(e.EMPTY_ARGUMENT = 2)] = "EMPTY_ARGUMENT"),
    (e[(e.MALFORMED_ARGUMENT = 3)] = "MALFORMED_ARGUMENT"),
    (e[(e.EXPECT_ARGUMENT_TYPE = 4)] = "EXPECT_ARGUMENT_TYPE"),
    (e[(e.INVALID_ARGUMENT_TYPE = 5)] = "INVALID_ARGUMENT_TYPE"),
    (e[(e.EXPECT_ARGUMENT_STYLE = 6)] = "EXPECT_ARGUMENT_STYLE"),
    (e[(e.INVALID_NUMBER_SKELETON = 7)] = "INVALID_NUMBER_SKELETON"),
    (e[(e.INVALID_DATE_TIME_SKELETON = 8)] = "INVALID_DATE_TIME_SKELETON"),
    (e[(e.EXPECT_NUMBER_SKELETON = 9)] = "EXPECT_NUMBER_SKELETON"),
    (e[(e.EXPECT_DATE_TIME_SKELETON = 10)] = "EXPECT_DATE_TIME_SKELETON"),
    (e[(e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11)] =
      "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"),
    (e[(e.EXPECT_SELECT_ARGUMENT_OPTIONS = 12)] =
      "EXPECT_SELECT_ARGUMENT_OPTIONS"),
    (e[(e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13)] =
      "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"),
    (e[(e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14)] =
      "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"),
    (e[(e.EXPECT_SELECT_ARGUMENT_SELECTOR = 15)] =
      "EXPECT_SELECT_ARGUMENT_SELECTOR"),
    (e[(e.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16)] =
      "EXPECT_PLURAL_ARGUMENT_SELECTOR"),
    (e[(e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17)] =
      "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"),
    (e[(e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18)] =
      "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"),
    (e[(e.INVALID_PLURAL_ARGUMENT_SELECTOR = 19)] =
      "INVALID_PLURAL_ARGUMENT_SELECTOR"),
    (e[(e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20)] =
      "DUPLICATE_PLURAL_ARGUMENT_SELECTOR"),
    (e[(e.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21)] =
      "DUPLICATE_SELECT_ARGUMENT_SELECTOR"),
    (e[(e.MISSING_OTHER_CLAUSE = 22)] = "MISSING_OTHER_CLAUSE"),
    (e[(e.INVALID_TAG = 23)] = "INVALID_TAG"),
    (e[(e.INVALID_TAG_NAME = 25)] = "INVALID_TAG_NAME"),
    (e[(e.UNMATCHED_CLOSING_TAG = 26)] = "UNMATCHED_CLOSING_TAG"),
    (e[(e.UNCLOSED_TAG = 27)] = "UNCLOSED_TAG");
})(K || (K = {}));
var ae;
(function(e) {
  (e[(e.literal = 0)] = "literal"),
    (e[(e.argument = 1)] = "argument"),
    (e[(e.number = 2)] = "number"),
    (e[(e.date = 3)] = "date"),
    (e[(e.time = 4)] = "time"),
    (e[(e.select = 5)] = "select"),
    (e[(e.plural = 6)] = "plural"),
    (e[(e.pound = 7)] = "pound"),
    (e[(e.tag = 8)] = "tag");
})(ae || (ae = {}));
var Lt;
(function(e) {
  (e[(e.number = 0)] = "number"), (e[(e.dateTime = 1)] = "dateTime");
})(Lt || (Lt = {}));
function lo(e) {
  return e.type === ae.literal;
}
function E0(e) {
  return e.type === ae.argument;
}
function Qs(e) {
  return e.type === ae.number;
}
function Ks(e) {
  return e.type === ae.date;
}
function Ys(e) {
  return e.type === ae.time;
}
function Js(e) {
  return e.type === ae.select;
}
function ea(e) {
  return e.type === ae.plural;
}
function S0(e) {
  return e.type === ae.pound;
}
function ta(e) {
  return e.type === ae.tag;
}
function na(e) {
  return !!(e && typeof e == "object" && e.type === Lt.number);
}
function Ur(e) {
  return !!(e && typeof e == "object" && e.type === Lt.dateTime);
}
var ra = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
  A0 = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function $0(e) {
  var t = {};
  return (
    e.replace(A0, function(n) {
      var r = n.length;
      switch (n[0]) {
        case "G":
          t.era = r === 4 ? "long" : r === 5 ? "narrow" : "short";
          break;
        case "y":
          t.year = r === 2 ? "2-digit" : "numeric";
          break;
        case "Y":
        case "u":
        case "U":
        case "r":
          throw new RangeError(
            "`Y/u/U/r` (year) patterns are not supported, use `y` instead"
          );
        case "q":
        case "Q":
          throw new RangeError("`q/Q` (quarter) patterns are not supported");
        case "M":
        case "L":
          t.month = ["numeric", "2-digit", "short", "long", "narrow"][r - 1];
          break;
        case "w":
        case "W":
          throw new RangeError("`w/W` (week) patterns are not supported");
        case "d":
          t.day = ["numeric", "2-digit"][r - 1];
          break;
        case "D":
        case "F":
        case "g":
          throw new RangeError(
            "`D/F/g` (day) patterns are not supported, use `d` instead"
          );
        case "E":
          t.weekday = r === 4 ? "long" : r === 5 ? "narrow" : "short";
          break;
        case "e":
          if (r < 4)
            throw new RangeError(
              "`e..eee` (weekday) patterns are not supported"
            );
          t.weekday = ["short", "long", "narrow", "short"][r - 4];
          break;
        case "c":
          if (r < 4)
            throw new RangeError(
              "`c..ccc` (weekday) patterns are not supported"
            );
          t.weekday = ["short", "long", "narrow", "short"][r - 4];
          break;
        case "a":
          t.hour12 = !0;
          break;
        case "b":
        case "B":
          throw new RangeError(
            "`b/B` (period) patterns are not supported, use `a` instead"
          );
        case "h":
          (t.hourCycle = "h12"), (t.hour = ["numeric", "2-digit"][r - 1]);
          break;
        case "H":
          (t.hourCycle = "h23"), (t.hour = ["numeric", "2-digit"][r - 1]);
          break;
        case "K":
          (t.hourCycle = "h11"), (t.hour = ["numeric", "2-digit"][r - 1]);
          break;
        case "k":
          (t.hourCycle = "h24"), (t.hour = ["numeric", "2-digit"][r - 1]);
          break;
        case "j":
        case "J":
        case "C":
          throw new RangeError(
            "`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead"
          );
        case "m":
          t.minute = ["numeric", "2-digit"][r - 1];
          break;
        case "s":
          t.second = ["numeric", "2-digit"][r - 1];
          break;
        case "S":
        case "A":
          throw new RangeError(
            "`S/A` (second) patterns are not supported, use `s` instead"
          );
        case "z":
          t.timeZoneName = r < 4 ? "short" : "long";
          break;
        case "Z":
        case "O":
        case "v":
        case "V":
        case "X":
        case "x":
          throw new RangeError(
            "`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead"
          );
      }
      return "";
    }),
    t
  );
}
var C0 = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
function T0(e) {
  if (e.length === 0) throw new Error("Number skeleton cannot be empty");
  for (
    var t = e.split(C0).filter(function(d) {
        return d.length > 0;
      }),
      n = [],
      r = 0,
      i = t;
    r < i.length;
    r++
  ) {
    var o = i[r],
      s = o.split("/");
    if (s.length === 0) throw new Error("Invalid number skeleton");
    for (var a = s[0], l = s.slice(1), f = 0, u = l; f < u.length; f++) {
      var c = u[f];
      if (c.length === 0) throw new Error("Invalid number skeleton");
    }
    n.push({ stem: a, options: l });
  }
  return n;
}
function P0(e) {
  return e.replace(/^(.*?)-/, "");
}
var co = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,
  ia = /^(@+)?(\+|#+)?[rs]?$/g,
  I0 = /(\*)(0+)|(#+)(0+)|(0+)/g,
  oa = /^(0+)$/;
function uo(e) {
  var t = {};
  return (
    e[e.length - 1] === "r"
      ? (t.roundingPriority = "morePrecision")
      : e[e.length - 1] === "s" && (t.roundingPriority = "lessPrecision"),
    e.replace(ia, function(n, r, i) {
      return (
        typeof i != "string"
          ? ((t.minimumSignificantDigits = r.length),
            (t.maximumSignificantDigits = r.length))
          : i === "+"
          ? (t.minimumSignificantDigits = r.length)
          : r[0] === "#"
          ? (t.maximumSignificantDigits = r.length)
          : ((t.minimumSignificantDigits = r.length),
            (t.maximumSignificantDigits =
              r.length + (typeof i == "string" ? i.length : 0))),
        ""
      );
    }),
    t
  );
}
function sa(e) {
  switch (e) {
    case "sign-auto":
      return { signDisplay: "auto" };
    case "sign-accounting":
    case "()":
      return { currencySign: "accounting" };
    case "sign-always":
    case "+!":
      return { signDisplay: "always" };
    case "sign-accounting-always":
    case "()!":
      return { signDisplay: "always", currencySign: "accounting" };
    case "sign-except-zero":
    case "+?":
      return { signDisplay: "exceptZero" };
    case "sign-accounting-except-zero":
    case "()?":
      return { signDisplay: "exceptZero", currencySign: "accounting" };
    case "sign-never":
    case "+_":
      return { signDisplay: "never" };
  }
}
function O0(e) {
  var t;
  if (
    (e[0] === "E" && e[1] === "E"
      ? ((t = { notation: "engineering" }), (e = e.slice(2)))
      : e[0] === "E" && ((t = { notation: "scientific" }), (e = e.slice(1))),
    t)
  ) {
    var n = e.slice(0, 2);
    if (
      (n === "+!"
        ? ((t.signDisplay = "always"), (e = e.slice(2)))
        : n === "+?" && ((t.signDisplay = "exceptZero"), (e = e.slice(2))),
      !oa.test(e))
    )
      throw new Error("Malformed concise eng/scientific notation");
    t.minimumIntegerDigits = e.length;
  }
  return t;
}
function fo(e) {
  var t = {},
    n = sa(e);
  return n || t;
}
function L0(e) {
  for (var t = {}, n = 0, r = e; n < r.length; n++) {
    var i = r[n];
    switch (i.stem) {
      case "percent":
      case "%":
        t.style = "percent";
        continue;
      case "%x100":
        (t.style = "percent"), (t.scale = 100);
        continue;
      case "currency":
        (t.style = "currency"), (t.currency = i.options[0]);
        continue;
      case "group-off":
      case ",_":
        t.useGrouping = !1;
        continue;
      case "precision-integer":
      case ".":
        t.maximumFractionDigits = 0;
        continue;
      case "measure-unit":
      case "unit":
        (t.style = "unit"), (t.unit = P0(i.options[0]));
        continue;
      case "compact-short":
      case "K":
        (t.notation = "compact"), (t.compactDisplay = "short");
        continue;
      case "compact-long":
      case "KK":
        (t.notation = "compact"), (t.compactDisplay = "long");
        continue;
      case "scientific":
        t = ee(
          ee(ee({}, t), { notation: "scientific" }),
          i.options.reduce(function(l, f) {
            return ee(ee({}, l), fo(f));
          }, {})
        );
        continue;
      case "engineering":
        t = ee(
          ee(ee({}, t), { notation: "engineering" }),
          i.options.reduce(function(l, f) {
            return ee(ee({}, l), fo(f));
          }, {})
        );
        continue;
      case "notation-simple":
        t.notation = "standard";
        continue;
      case "unit-width-narrow":
        (t.currencyDisplay = "narrowSymbol"), (t.unitDisplay = "narrow");
        continue;
      case "unit-width-short":
        (t.currencyDisplay = "code"), (t.unitDisplay = "short");
        continue;
      case "unit-width-full-name":
        (t.currencyDisplay = "name"), (t.unitDisplay = "long");
        continue;
      case "unit-width-iso-code":
        t.currencyDisplay = "symbol";
        continue;
      case "scale":
        t.scale = parseFloat(i.options[0]);
        continue;
      case "rounding-mode-floor":
        t.roundingMode = "floor";
        continue;
      case "rounding-mode-ceiling":
        t.roundingMode = "ceil";
        continue;
      case "rounding-mode-down":
        t.roundingMode = "trunc";
        continue;
      case "rounding-mode-up":
        t.roundingMode = "expand";
        continue;
      case "rounding-mode-half-even":
        t.roundingMode = "halfEven";
        continue;
      case "rounding-mode-half-down":
        t.roundingMode = "halfTrunc";
        continue;
      case "rounding-mode-half-up":
        t.roundingMode = "halfExpand";
        continue;
      case "integer-width":
        if (i.options.length > 1)
          throw new RangeError(
            "integer-width stems only accept a single optional option"
          );
        i.options[0].replace(I0, function(l, f, u, c, d, g) {
          if (f) t.minimumIntegerDigits = u.length;
          else {
            if (c && d)
              throw new Error(
                "We currently do not support maximum integer digits"
              );
            if (g)
              throw new Error(
                "We currently do not support exact integer digits"
              );
          }
          return "";
        });
        continue;
    }
    if (oa.test(i.stem)) {
      t.minimumIntegerDigits = i.stem.length;
      continue;
    }
    if (co.test(i.stem)) {
      if (i.options.length > 1)
        throw new RangeError(
          "Fraction-precision stems only accept a single optional option"
        );
      i.stem.replace(co, function(l, f, u, c, d, g) {
        return (
          u === "*"
            ? (t.minimumFractionDigits = f.length)
            : c && c[0] === "#"
            ? (t.maximumFractionDigits = c.length)
            : d && g
            ? ((t.minimumFractionDigits = d.length),
              (t.maximumFractionDigits = d.length + g.length))
            : ((t.minimumFractionDigits = f.length),
              (t.maximumFractionDigits = f.length)),
          ""
        );
      });
      var o = i.options[0];
      o === "w"
        ? (t = ee(ee({}, t), { trailingZeroDisplay: "stripIfInteger" }))
        : o && (t = ee(ee({}, t), uo(o)));
      continue;
    }
    if (ia.test(i.stem)) {
      t = ee(ee({}, t), uo(i.stem));
      continue;
    }
    var s = sa(i.stem);
    s && (t = ee(ee({}, t), s));
    var a = O0(i.stem);
    a && (t = ee(ee({}, t), a));
  }
  return t;
}
var vn = {
  "001": ["H", "h"],
  419: ["h", "H", "hB", "hb"],
  AC: ["H", "h", "hb", "hB"],
  AD: ["H", "hB"],
  AE: ["h", "hB", "hb", "H"],
  AF: ["H", "hb", "hB", "h"],
  AG: ["h", "hb", "H", "hB"],
  AI: ["H", "h", "hb", "hB"],
  AL: ["h", "H", "hB"],
  AM: ["H", "hB"],
  AO: ["H", "hB"],
  AR: ["h", "H", "hB", "hb"],
  AS: ["h", "H"],
  AT: ["H", "hB"],
  AU: ["h", "hb", "H", "hB"],
  AW: ["H", "hB"],
  AX: ["H"],
  AZ: ["H", "hB", "h"],
  BA: ["H", "hB", "h"],
  BB: ["h", "hb", "H", "hB"],
  BD: ["h", "hB", "H"],
  BE: ["H", "hB"],
  BF: ["H", "hB"],
  BG: ["H", "hB", "h"],
  BH: ["h", "hB", "hb", "H"],
  BI: ["H", "h"],
  BJ: ["H", "hB"],
  BL: ["H", "hB"],
  BM: ["h", "hb", "H", "hB"],
  BN: ["hb", "hB", "h", "H"],
  BO: ["h", "H", "hB", "hb"],
  BQ: ["H"],
  BR: ["H", "hB"],
  BS: ["h", "hb", "H", "hB"],
  BT: ["h", "H"],
  BW: ["H", "h", "hb", "hB"],
  BY: ["H", "h"],
  BZ: ["H", "h", "hb", "hB"],
  CA: ["h", "hb", "H", "hB"],
  CC: ["H", "h", "hb", "hB"],
  CD: ["hB", "H"],
  CF: ["H", "h", "hB"],
  CG: ["H", "hB"],
  CH: ["H", "hB", "h"],
  CI: ["H", "hB"],
  CK: ["H", "h", "hb", "hB"],
  CL: ["h", "H", "hB", "hb"],
  CM: ["H", "h", "hB"],
  CN: ["H", "hB", "hb", "h"],
  CO: ["h", "H", "hB", "hb"],
  CP: ["H"],
  CR: ["h", "H", "hB", "hb"],
  CU: ["h", "H", "hB", "hb"],
  CV: ["H", "hB"],
  CW: ["H", "hB"],
  CX: ["H", "h", "hb", "hB"],
  CY: ["h", "H", "hb", "hB"],
  CZ: ["H"],
  DE: ["H", "hB"],
  DG: ["H", "h", "hb", "hB"],
  DJ: ["h", "H"],
  DK: ["H"],
  DM: ["h", "hb", "H", "hB"],
  DO: ["h", "H", "hB", "hb"],
  DZ: ["h", "hB", "hb", "H"],
  EA: ["H", "h", "hB", "hb"],
  EC: ["h", "H", "hB", "hb"],
  EE: ["H", "hB"],
  EG: ["h", "hB", "hb", "H"],
  EH: ["h", "hB", "hb", "H"],
  ER: ["h", "H"],
  ES: ["H", "hB", "h", "hb"],
  ET: ["hB", "hb", "h", "H"],
  FI: ["H"],
  FJ: ["h", "hb", "H", "hB"],
  FK: ["H", "h", "hb", "hB"],
  FM: ["h", "hb", "H", "hB"],
  FO: ["H", "h"],
  FR: ["H", "hB"],
  GA: ["H", "hB"],
  GB: ["H", "h", "hb", "hB"],
  GD: ["h", "hb", "H", "hB"],
  GE: ["H", "hB", "h"],
  GF: ["H", "hB"],
  GG: ["H", "h", "hb", "hB"],
  GH: ["h", "H"],
  GI: ["H", "h", "hb", "hB"],
  GL: ["H", "h"],
  GM: ["h", "hb", "H", "hB"],
  GN: ["H", "hB"],
  GP: ["H", "hB"],
  GQ: ["H", "hB", "h", "hb"],
  GR: ["h", "H", "hb", "hB"],
  GT: ["h", "H", "hB", "hb"],
  GU: ["h", "hb", "H", "hB"],
  GW: ["H", "hB"],
  GY: ["h", "hb", "H", "hB"],
  HK: ["h", "hB", "hb", "H"],
  HN: ["h", "H", "hB", "hb"],
  HR: ["H", "hB"],
  HU: ["H", "h"],
  IC: ["H", "h", "hB", "hb"],
  ID: ["H"],
  IE: ["H", "h", "hb", "hB"],
  IL: ["H", "hB"],
  IM: ["H", "h", "hb", "hB"],
  IN: ["h", "H"],
  IO: ["H", "h", "hb", "hB"],
  IQ: ["h", "hB", "hb", "H"],
  IR: ["hB", "H"],
  IS: ["H"],
  IT: ["H", "hB"],
  JE: ["H", "h", "hb", "hB"],
  JM: ["h", "hb", "H", "hB"],
  JO: ["h", "hB", "hb", "H"],
  JP: ["H", "K", "h"],
  KE: ["hB", "hb", "H", "h"],
  KG: ["H", "h", "hB", "hb"],
  KH: ["hB", "h", "H", "hb"],
  KI: ["h", "hb", "H", "hB"],
  KM: ["H", "h", "hB", "hb"],
  KN: ["h", "hb", "H", "hB"],
  KP: ["h", "H", "hB", "hb"],
  KR: ["h", "H", "hB", "hb"],
  KW: ["h", "hB", "hb", "H"],
  KY: ["h", "hb", "H", "hB"],
  KZ: ["H", "hB"],
  LA: ["H", "hb", "hB", "h"],
  LB: ["h", "hB", "hb", "H"],
  LC: ["h", "hb", "H", "hB"],
  LI: ["H", "hB", "h"],
  LK: ["H", "h", "hB", "hb"],
  LR: ["h", "hb", "H", "hB"],
  LS: ["h", "H"],
  LT: ["H", "h", "hb", "hB"],
  LU: ["H", "h", "hB"],
  LV: ["H", "hB", "hb", "h"],
  LY: ["h", "hB", "hb", "H"],
  MA: ["H", "h", "hB", "hb"],
  MC: ["H", "hB"],
  MD: ["H", "hB"],
  ME: ["H", "hB", "h"],
  MF: ["H", "hB"],
  MG: ["H", "h"],
  MH: ["h", "hb", "H", "hB"],
  MK: ["H", "h", "hb", "hB"],
  ML: ["H"],
  MM: ["hB", "hb", "H", "h"],
  MN: ["H", "h", "hb", "hB"],
  MO: ["h", "hB", "hb", "H"],
  MP: ["h", "hb", "H", "hB"],
  MQ: ["H", "hB"],
  MR: ["h", "hB", "hb", "H"],
  MS: ["H", "h", "hb", "hB"],
  MT: ["H", "h"],
  MU: ["H", "h"],
  MV: ["H", "h"],
  MW: ["h", "hb", "H", "hB"],
  MX: ["h", "H", "hB", "hb"],
  MY: ["hb", "hB", "h", "H"],
  MZ: ["H", "hB"],
  NA: ["h", "H", "hB", "hb"],
  NC: ["H", "hB"],
  NE: ["H"],
  NF: ["H", "h", "hb", "hB"],
  NG: ["H", "h", "hb", "hB"],
  NI: ["h", "H", "hB", "hb"],
  NL: ["H", "hB"],
  NO: ["H", "h"],
  NP: ["H", "h", "hB"],
  NR: ["H", "h", "hb", "hB"],
  NU: ["H", "h", "hb", "hB"],
  NZ: ["h", "hb", "H", "hB"],
  OM: ["h", "hB", "hb", "H"],
  PA: ["h", "H", "hB", "hb"],
  PE: ["h", "H", "hB", "hb"],
  PF: ["H", "h", "hB"],
  PG: ["h", "H"],
  PH: ["h", "hB", "hb", "H"],
  PK: ["h", "hB", "H"],
  PL: ["H", "h"],
  PM: ["H", "hB"],
  PN: ["H", "h", "hb", "hB"],
  PR: ["h", "H", "hB", "hb"],
  PS: ["h", "hB", "hb", "H"],
  PT: ["H", "hB"],
  PW: ["h", "H"],
  PY: ["h", "H", "hB", "hb"],
  QA: ["h", "hB", "hb", "H"],
  RE: ["H", "hB"],
  RO: ["H", "hB"],
  RS: ["H", "hB", "h"],
  RU: ["H"],
  RW: ["H", "h"],
  SA: ["h", "hB", "hb", "H"],
  SB: ["h", "hb", "H", "hB"],
  SC: ["H", "h", "hB"],
  SD: ["h", "hB", "hb", "H"],
  SE: ["H"],
  SG: ["h", "hb", "H", "hB"],
  SH: ["H", "h", "hb", "hB"],
  SI: ["H", "hB"],
  SJ: ["H"],
  SK: ["H"],
  SL: ["h", "hb", "H", "hB"],
  SM: ["H", "h", "hB"],
  SN: ["H", "h", "hB"],
  SO: ["h", "H"],
  SR: ["H", "hB"],
  SS: ["h", "hb", "H", "hB"],
  ST: ["H", "hB"],
  SV: ["h", "H", "hB", "hb"],
  SX: ["H", "h", "hb", "hB"],
  SY: ["h", "hB", "hb", "H"],
  SZ: ["h", "hb", "H", "hB"],
  TA: ["H", "h", "hb", "hB"],
  TC: ["h", "hb", "H", "hB"],
  TD: ["h", "H", "hB"],
  TF: ["H", "h", "hB"],
  TG: ["H", "hB"],
  TH: ["H", "h"],
  TJ: ["H", "h"],
  TL: ["H", "hB", "hb", "h"],
  TM: ["H", "h"],
  TN: ["h", "hB", "hb", "H"],
  TO: ["h", "H"],
  TR: ["H", "hB"],
  TT: ["h", "hb", "H", "hB"],
  TW: ["hB", "hb", "h", "H"],
  TZ: ["hB", "hb", "H", "h"],
  UA: ["H", "hB", "h"],
  UG: ["hB", "hb", "H", "h"],
  UM: ["h", "hb", "H", "hB"],
  US: ["h", "hb", "H", "hB"],
  UY: ["h", "H", "hB", "hb"],
  UZ: ["H", "hB", "h"],
  VA: ["H", "h", "hB"],
  VC: ["h", "hb", "H", "hB"],
  VE: ["h", "H", "hB", "hb"],
  VG: ["h", "hb", "H", "hB"],
  VI: ["h", "hb", "H", "hB"],
  VN: ["H", "h"],
  VU: ["h", "H"],
  WF: ["H", "hB"],
  WS: ["h", "H"],
  XK: ["H", "hB", "h"],
  YE: ["h", "hB", "hb", "H"],
  YT: ["H", "hB"],
  ZA: ["H", "h", "hb", "hB"],
  ZM: ["h", "hb", "H", "hB"],
  ZW: ["H", "h"],
  "af-ZA": ["H", "h", "hB", "hb"],
  "ar-001": ["h", "hB", "hb", "H"],
  "ca-ES": ["H", "h", "hB"],
  "en-001": ["h", "hb", "H", "hB"],
  "en-HK": ["h", "hb", "H", "hB"],
  "en-IL": ["H", "h", "hb", "hB"],
  "en-MY": ["h", "hb", "H", "hB"],
  "es-BR": ["H", "h", "hB", "hb"],
  "es-ES": ["H", "h", "hB", "hb"],
  "es-GQ": ["H", "h", "hB", "hb"],
  "fr-CA": ["H", "h", "hB"],
  "gl-ES": ["H", "h", "hB"],
  "gu-IN": ["hB", "hb", "h", "H"],
  "hi-IN": ["hB", "h", "H"],
  "it-CH": ["H", "h", "hB"],
  "it-IT": ["H", "h", "hB"],
  "kn-IN": ["hB", "h", "H"],
  "ml-IN": ["hB", "h", "H"],
  "mr-IN": ["hB", "hb", "h", "H"],
  "pa-IN": ["hB", "hb", "h", "H"],
  "ta-IN": ["hB", "h", "hb", "H"],
  "te-IN": ["hB", "h", "H"],
  "zu-ZA": ["H", "hB", "hb", "h"]
};
function k0(e, t) {
  for (var n = "", r = 0; r < e.length; r++) {
    var i = e.charAt(r);
    if (i === "j") {
      for (var o = 0; r + 1 < e.length && e.charAt(r + 1) === i; ) o++, r++;
      var s = 1 + (o & 1),
        a = o < 2 ? 1 : 3 + (o >> 1),
        l = "a",
        f = B0(t);
      for ((f == "H" || f == "k") && (a = 0); a-- > 0; ) n += l;
      for (; s-- > 0; ) n = f + n;
    } else i === "J" ? (n += "H") : (n += i);
  }
  return n;
}
function B0(e) {
  var t = e.hourCycle;
  if (
    (t === void 0 &&
      e.hourCycles &&
      e.hourCycles.length &&
      (t = e.hourCycles[0]),
    t)
  )
    switch (t) {
      case "h24":
        return "k";
      case "h23":
        return "H";
      case "h12":
        return "h";
      case "h11":
        return "K";
      default:
        throw new Error("Invalid hourCycle");
    }
  var n = e.language,
    r;
  n !== "root" && (r = e.maximize().region);
  var i = vn[r || ""] || vn[n || ""] || vn["".concat(n, "-001")] || vn["001"];
  return i[0];
}
var gr,
  N0 = new RegExp("^".concat(ra.source, "*")),
  R0 = new RegExp("".concat(ra.source, "*$"));
function J(e, t) {
  return { start: e, end: t };
}
var D0 = !!String.prototype.startsWith && "_a".startsWith("a", 1),
  M0 = !!String.fromCodePoint,
  H0 = !!Object.fromEntries,
  F0 = !!String.prototype.codePointAt,
  U0 = !!String.prototype.trimStart,
  V0 = !!String.prototype.trimEnd,
  G0 = !!Number.isSafeInteger,
  j0 = G0
    ? Number.isSafeInteger
    : function(e) {
        return (
          typeof e == "number" &&
          isFinite(e) &&
          Math.floor(e) === e &&
          Math.abs(e) <= 9007199254740991
        );
      },
  Vr = !0;
try {
  var q0 = la("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  Vr = ((gr = q0.exec("a")) === null || gr === void 0 ? void 0 : gr[0]) === "a";
} catch {
  Vr = !1;
}
var ho = D0
    ? function(t, n, r) {
        return t.startsWith(n, r);
      }
    : function(t, n, r) {
        return t.slice(r, r + n.length) === n;
      },
  Gr = M0
    ? String.fromCodePoint
    : function() {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
        for (var r = "", i = t.length, o = 0, s; i > o; ) {
          if (((s = t[o++]), s > 1114111))
            throw RangeError(s + " is not a valid code point");
          r +=
            s < 65536
              ? String.fromCharCode(s)
              : String.fromCharCode(
                  ((s -= 65536) >> 10) + 55296,
                  (s % 1024) + 56320
                );
        }
        return r;
      },
  go = H0
    ? Object.fromEntries
    : function(t) {
        for (var n = {}, r = 0, i = t; r < i.length; r++) {
          var o = i[r],
            s = o[0],
            a = o[1];
          n[s] = a;
        }
        return n;
      },
  aa = F0
    ? function(t, n) {
        return t.codePointAt(n);
      }
    : function(t, n) {
        var r = t.length;
        if (!(n < 0 || n >= r)) {
          var i = t.charCodeAt(n),
            o;
          return i < 55296 ||
            i > 56319 ||
            n + 1 === r ||
            (o = t.charCodeAt(n + 1)) < 56320 ||
            o > 57343
            ? i
            : ((i - 55296) << 10) + (o - 56320) + 65536;
        }
      },
  Z0 = U0
    ? function(t) {
        return t.trimStart();
      }
    : function(t) {
        return t.replace(N0, "");
      },
  z0 = V0
    ? function(t) {
        return t.trimEnd();
      }
    : function(t) {
        return t.replace(R0, "");
      };
function la(e, t) {
  return new RegExp(e, t);
}
var jr;
if (Vr) {
  var mo = la("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  jr = function(t, n) {
    var r;
    mo.lastIndex = n;
    var i = mo.exec(t);
    return (r = i[1]) !== null && r !== void 0 ? r : "";
  };
} else
  jr = function(t, n) {
    for (var r = []; ; ) {
      var i = aa(t, n);
      if (i === void 0 || ca(i) || K0(i)) break;
      r.push(i), (n += i >= 65536 ? 2 : 1);
    }
    return Gr.apply(void 0, r);
  };
var W0 = (function() {
  function e(t, n) {
    n === void 0 && (n = {}),
      (this.message = t),
      (this.position = { offset: 0, line: 1, column: 1 }),
      (this.ignoreTag = !!n.ignoreTag),
      (this.locale = n.locale),
      (this.requiresOtherClause = !!n.requiresOtherClause),
      (this.shouldParseSkeletons = !!n.shouldParseSkeletons);
  }
  return (
    (e.prototype.parse = function() {
      if (this.offset() !== 0) throw Error("parser can only be used once");
      return this.parseMessage(0, "", !1);
    }),
    (e.prototype.parseMessage = function(t, n, r) {
      for (var i = []; !this.isEOF(); ) {
        var o = this.char();
        if (o === 123) {
          var s = this.parseArgument(t, r);
          if (s.err) return s;
          i.push(s.val);
        } else {
          if (o === 125 && t > 0) break;
          if (o === 35 && (n === "plural" || n === "selectordinal")) {
            var a = this.clonePosition();
            this.bump(),
              i.push({ type: ae.pound, location: J(a, this.clonePosition()) });
          } else if (o === 60 && !this.ignoreTag && this.peek() === 47) {
            if (r) break;
            return this.error(
              K.UNMATCHED_CLOSING_TAG,
              J(this.clonePosition(), this.clonePosition())
            );
          } else if (o === 60 && !this.ignoreTag && qr(this.peek() || 0)) {
            var s = this.parseTag(t, n);
            if (s.err) return s;
            i.push(s.val);
          } else {
            var s = this.parseLiteral(t, n);
            if (s.err) return s;
            i.push(s.val);
          }
        }
      }
      return { val: i, err: null };
    }),
    (e.prototype.parseTag = function(t, n) {
      var r = this.clonePosition();
      this.bump();
      var i = this.parseTagName();
      if ((this.bumpSpace(), this.bumpIf("/>")))
        return {
          val: {
            type: ae.literal,
            value: "<".concat(i, "/>"),
            location: J(r, this.clonePosition())
          },
          err: null
        };
      if (this.bumpIf(">")) {
        var o = this.parseMessage(t + 1, n, !0);
        if (o.err) return o;
        var s = o.val,
          a = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !qr(this.char()))
            return this.error(K.INVALID_TAG, J(a, this.clonePosition()));
          var l = this.clonePosition(),
            f = this.parseTagName();
          return i !== f
            ? this.error(K.UNMATCHED_CLOSING_TAG, J(l, this.clonePosition()))
            : (this.bumpSpace(),
              this.bumpIf(">")
                ? {
                    val: {
                      type: ae.tag,
                      value: i,
                      children: s,
                      location: J(r, this.clonePosition())
                    },
                    err: null
                  }
                : this.error(K.INVALID_TAG, J(a, this.clonePosition())));
        } else return this.error(K.UNCLOSED_TAG, J(r, this.clonePosition()));
      } else return this.error(K.INVALID_TAG, J(r, this.clonePosition()));
    }),
    (e.prototype.parseTagName = function() {
      var t = this.offset();
      for (this.bump(); !this.isEOF() && Q0(this.char()); ) this.bump();
      return this.message.slice(t, this.offset());
    }),
    (e.prototype.parseLiteral = function(t, n) {
      for (var r = this.clonePosition(), i = ""; ; ) {
        var o = this.tryParseQuote(n);
        if (o) {
          i += o;
          continue;
        }
        var s = this.tryParseUnquoted(t, n);
        if (s) {
          i += s;
          continue;
        }
        var a = this.tryParseLeftAngleBracket();
        if (a) {
          i += a;
          continue;
        }
        break;
      }
      var l = J(r, this.clonePosition());
      return { val: { type: ae.literal, value: i, location: l }, err: null };
    }),
    (e.prototype.tryParseLeftAngleBracket = function() {
      return !this.isEOF() &&
        this.char() === 60 &&
        (this.ignoreTag || !X0(this.peek() || 0))
        ? (this.bump(), "<")
        : null;
    }),
    (e.prototype.tryParseQuote = function(t) {
      if (this.isEOF() || this.char() !== 39) return null;
      switch (this.peek()) {
        case 39:
          return this.bump(), this.bump(), "'";
        case 123:
        case 60:
        case 62:
        case 125:
          break;
        case 35:
          if (t === "plural" || t === "selectordinal") break;
          return null;
        default:
          return null;
      }
      this.bump();
      var n = [this.char()];
      for (this.bump(); !this.isEOF(); ) {
        var r = this.char();
        if (r === 39)
          if (this.peek() === 39) n.push(39), this.bump();
          else {
            this.bump();
            break;
          }
        else n.push(r);
        this.bump();
      }
      return Gr.apply(void 0, n);
    }),
    (e.prototype.tryParseUnquoted = function(t, n) {
      if (this.isEOF()) return null;
      var r = this.char();
      return r === 60 ||
        r === 123 ||
        (r === 35 && (n === "plural" || n === "selectordinal")) ||
        (r === 125 && t > 0)
        ? null
        : (this.bump(), Gr(r));
    }),
    (e.prototype.parseArgument = function(t, n) {
      var r = this.clonePosition();
      if ((this.bump(), this.bumpSpace(), this.isEOF()))
        return this.error(
          K.EXPECT_ARGUMENT_CLOSING_BRACE,
          J(r, this.clonePosition())
        );
      if (this.char() === 125)
        return (
          this.bump(), this.error(K.EMPTY_ARGUMENT, J(r, this.clonePosition()))
        );
      var i = this.parseIdentifierIfPossible().value;
      if (!i)
        return this.error(K.MALFORMED_ARGUMENT, J(r, this.clonePosition()));
      if ((this.bumpSpace(), this.isEOF()))
        return this.error(
          K.EXPECT_ARGUMENT_CLOSING_BRACE,
          J(r, this.clonePosition())
        );
      switch (this.char()) {
        case 125:
          return (
            this.bump(),
            {
              val: {
                type: ae.argument,
                value: i,
                location: J(r, this.clonePosition())
              },
              err: null
            }
          );
        case 44:
          return (
            this.bump(),
            this.bumpSpace(),
            this.isEOF()
              ? this.error(
                  K.EXPECT_ARGUMENT_CLOSING_BRACE,
                  J(r, this.clonePosition())
                )
              : this.parseArgumentOptions(t, n, i, r)
          );
        default:
          return this.error(K.MALFORMED_ARGUMENT, J(r, this.clonePosition()));
      }
    }),
    (e.prototype.parseIdentifierIfPossible = function() {
      var t = this.clonePosition(),
        n = this.offset(),
        r = jr(this.message, n),
        i = n + r.length;
      this.bumpTo(i);
      var o = this.clonePosition(),
        s = J(t, o);
      return { value: r, location: s };
    }),
    (e.prototype.parseArgumentOptions = function(t, n, r, i) {
      var o,
        s = this.clonePosition(),
        a = this.parseIdentifierIfPossible().value,
        l = this.clonePosition();
      switch (a) {
        case "":
          return this.error(K.EXPECT_ARGUMENT_TYPE, J(s, l));
        case "number":
        case "date":
        case "time": {
          this.bumpSpace();
          var f = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var u = this.clonePosition(),
              c = this.parseSimpleArgStyleIfPossible();
            if (c.err) return c;
            var d = z0(c.val);
            if (d.length === 0)
              return this.error(
                K.EXPECT_ARGUMENT_STYLE,
                J(this.clonePosition(), this.clonePosition())
              );
            var g = J(u, this.clonePosition());
            f = { style: d, styleLocation: g };
          }
          var m = this.tryParseArgumentClose(i);
          if (m.err) return m;
          var p = J(i, this.clonePosition());
          if (f && ho(f?.style, "::", 0)) {
            var b = Z0(f.style.slice(2));
            if (a === "number") {
              var c = this.parseNumberSkeletonFromString(b, f.styleLocation);
              return c.err
                ? c
                : {
                    val: {
                      type: ae.number,
                      value: r,
                      location: p,
                      style: c.val
                    },
                    err: null
                  };
            } else {
              if (b.length === 0)
                return this.error(K.EXPECT_DATE_TIME_SKELETON, p);
              var $ = b;
              this.locale && ($ = k0(b, this.locale));
              var d = {
                  type: Lt.dateTime,
                  pattern: $,
                  location: f.styleLocation,
                  parsedOptions: this.shouldParseSkeletons ? $0($) : {}
                },
                A = a === "date" ? ae.date : ae.time;
              return {
                val: { type: A, value: r, location: p, style: d },
                err: null
              };
            }
          }
          return {
            val: {
              type:
                a === "number" ? ae.number : a === "date" ? ae.date : ae.time,
              value: r,
              location: p,
              style: (o = f?.style) !== null && o !== void 0 ? o : null
            },
            err: null
          };
        }
        case "plural":
        case "selectordinal":
        case "select": {
          var N = this.clonePosition();
          if ((this.bumpSpace(), !this.bumpIf(",")))
            return this.error(
              K.EXPECT_SELECT_ARGUMENT_OPTIONS,
              J(N, ee({}, N))
            );
          this.bumpSpace();
          var T = this.parseIdentifierIfPossible(),
            I = 0;
          if (a !== "select" && T.value === "offset") {
            if (!this.bumpIf(":"))
              return this.error(
                K.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,
                J(this.clonePosition(), this.clonePosition())
              );
            this.bumpSpace();
            var c = this.tryParseDecimalInteger(
              K.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,
              K.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE
            );
            if (c.err) return c;
            this.bumpSpace(),
              (T = this.parseIdentifierIfPossible()),
              (I = c.val);
          }
          var z = this.tryParsePluralOrSelectOptions(t, a, n, T);
          if (z.err) return z;
          var m = this.tryParseArgumentClose(i);
          if (m.err) return m;
          var re = J(i, this.clonePosition());
          return a === "select"
            ? {
                val: {
                  type: ae.select,
                  value: r,
                  options: go(z.val),
                  location: re
                },
                err: null
              }
            : {
                val: {
                  type: ae.plural,
                  value: r,
                  options: go(z.val),
                  offset: I,
                  pluralType: a === "plural" ? "cardinal" : "ordinal",
                  location: re
                },
                err: null
              };
        }
        default:
          return this.error(K.INVALID_ARGUMENT_TYPE, J(s, l));
      }
    }),
    (e.prototype.tryParseArgumentClose = function(t) {
      return this.isEOF() || this.char() !== 125
        ? this.error(
            K.EXPECT_ARGUMENT_CLOSING_BRACE,
            J(t, this.clonePosition())
          )
        : (this.bump(), { val: !0, err: null });
    }),
    (e.prototype.parseSimpleArgStyleIfPossible = function() {
      for (var t = 0, n = this.clonePosition(); !this.isEOF(); ) {
        var r = this.char();
        switch (r) {
          case 39: {
            this.bump();
            var i = this.clonePosition();
            if (!this.bumpUntil("'"))
              return this.error(
                K.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,
                J(i, this.clonePosition())
              );
            this.bump();
            break;
          }
          case 123: {
            (t += 1), this.bump();
            break;
          }
          case 125: {
            if (t > 0) t -= 1;
            else
              return {
                val: this.message.slice(n.offset, this.offset()),
                err: null
              };
            break;
          }
          default:
            this.bump();
            break;
        }
      }
      return { val: this.message.slice(n.offset, this.offset()), err: null };
    }),
    (e.prototype.parseNumberSkeletonFromString = function(t, n) {
      var r = [];
      try {
        r = T0(t);
      } catch {
        return this.error(K.INVALID_NUMBER_SKELETON, n);
      }
      return {
        val: {
          type: Lt.number,
          tokens: r,
          location: n,
          parsedOptions: this.shouldParseSkeletons ? L0(r) : {}
        },
        err: null
      };
    }),
    (e.prototype.tryParsePluralOrSelectOptions = function(t, n, r, i) {
      for (
        var o, s = !1, a = [], l = new Set(), f = i.value, u = i.location;
        ;

      ) {
        if (f.length === 0) {
          var c = this.clonePosition();
          if (n !== "select" && this.bumpIf("=")) {
            var d = this.tryParseDecimalInteger(
              K.EXPECT_PLURAL_ARGUMENT_SELECTOR,
              K.INVALID_PLURAL_ARGUMENT_SELECTOR
            );
            if (d.err) return d;
            (u = J(c, this.clonePosition())),
              (f = this.message.slice(c.offset, this.offset()));
          } else break;
        }
        if (l.has(f))
          return this.error(
            n === "select"
              ? K.DUPLICATE_SELECT_ARGUMENT_SELECTOR
              : K.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,
            u
          );
        f === "other" && (s = !0), this.bumpSpace();
        var g = this.clonePosition();
        if (!this.bumpIf("{"))
          return this.error(
            n === "select"
              ? K.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT
              : K.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,
            J(this.clonePosition(), this.clonePosition())
          );
        var m = this.parseMessage(t + 1, n, r);
        if (m.err) return m;
        var p = this.tryParseArgumentClose(g);
        if (p.err) return p;
        a.push([f, { value: m.val, location: J(g, this.clonePosition()) }]),
          l.add(f),
          this.bumpSpace(),
          (o = this.parseIdentifierIfPossible()),
          (f = o.value),
          (u = o.location);
      }
      return a.length === 0
        ? this.error(
            n === "select"
              ? K.EXPECT_SELECT_ARGUMENT_SELECTOR
              : K.EXPECT_PLURAL_ARGUMENT_SELECTOR,
            J(this.clonePosition(), this.clonePosition())
          )
        : this.requiresOtherClause && !s
        ? this.error(
            K.MISSING_OTHER_CLAUSE,
            J(this.clonePosition(), this.clonePosition())
          )
        : { val: a, err: null };
    }),
    (e.prototype.tryParseDecimalInteger = function(t, n) {
      var r = 1,
        i = this.clonePosition();
      this.bumpIf("+") || (this.bumpIf("-") && (r = -1));
      for (var o = !1, s = 0; !this.isEOF(); ) {
        var a = this.char();
        if (a >= 48 && a <= 57) (o = !0), (s = s * 10 + (a - 48)), this.bump();
        else break;
      }
      var l = J(i, this.clonePosition());
      return o
        ? ((s *= r), j0(s) ? { val: s, err: null } : this.error(n, l))
        : this.error(t, l);
    }),
    (e.prototype.offset = function() {
      return this.position.offset;
    }),
    (e.prototype.isEOF = function() {
      return this.offset() === this.message.length;
    }),
    (e.prototype.clonePosition = function() {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column
      };
    }),
    (e.prototype.char = function() {
      var t = this.position.offset;
      if (t >= this.message.length) throw Error("out of bound");
      var n = aa(this.message, t);
      if (n === void 0)
        throw Error(
          "Offset ".concat(t, " is at invalid UTF-16 code unit boundary")
        );
      return n;
    }),
    (e.prototype.error = function(t, n) {
      return {
        val: null,
        err: { kind: t, message: this.message, location: n }
      };
    }),
    (e.prototype.bump = function() {
      if (!this.isEOF()) {
        var t = this.char();
        t === 10
          ? ((this.position.line += 1),
            (this.position.column = 1),
            (this.position.offset += 1))
          : ((this.position.column += 1),
            (this.position.offset += t < 65536 ? 1 : 2));
      }
    }),
    (e.prototype.bumpIf = function(t) {
      if (ho(this.message, t, this.offset())) {
        for (var n = 0; n < t.length; n++) this.bump();
        return !0;
      }
      return !1;
    }),
    (e.prototype.bumpUntil = function(t) {
      var n = this.offset(),
        r = this.message.indexOf(t, n);
      return r >= 0
        ? (this.bumpTo(r), !0)
        : (this.bumpTo(this.message.length), !1);
    }),
    (e.prototype.bumpTo = function(t) {
      if (this.offset() > t)
        throw Error(
          "targetOffset "
            .concat(t, " must be greater than or equal to the current offset ")
            .concat(this.offset())
        );
      for (t = Math.min(t, this.message.length); ; ) {
        var n = this.offset();
        if (n === t) break;
        if (n > t)
          throw Error(
            "targetOffset ".concat(
              t,
              " is at invalid UTF-16 code unit boundary"
            )
          );
        if ((this.bump(), this.isEOF())) break;
      }
    }),
    (e.prototype.bumpSpace = function() {
      for (; !this.isEOF() && ca(this.char()); ) this.bump();
    }),
    (e.prototype.peek = function() {
      if (this.isEOF()) return null;
      var t = this.char(),
        n = this.offset(),
        r = this.message.charCodeAt(n + (t >= 65536 ? 2 : 1));
      return r ?? null;
    }),
    e
  );
})();
function qr(e) {
  return (e >= 97 && e <= 122) || (e >= 65 && e <= 90);
}
function X0(e) {
  return qr(e) || e === 47;
}
function Q0(e) {
  return (
    e === 45 ||
    e === 46 ||
    (e >= 48 && e <= 57) ||
    e === 95 ||
    (e >= 97 && e <= 122) ||
    (e >= 65 && e <= 90) ||
    e == 183 ||
    (e >= 192 && e <= 214) ||
    (e >= 216 && e <= 246) ||
    (e >= 248 && e <= 893) ||
    (e >= 895 && e <= 8191) ||
    (e >= 8204 && e <= 8205) ||
    (e >= 8255 && e <= 8256) ||
    (e >= 8304 && e <= 8591) ||
    (e >= 11264 && e <= 12271) ||
    (e >= 12289 && e <= 55295) ||
    (e >= 63744 && e <= 64975) ||
    (e >= 65008 && e <= 65533) ||
    (e >= 65536 && e <= 983039)
  );
}
function ca(e) {
  return (
    (e >= 9 && e <= 13) ||
    e === 32 ||
    e === 133 ||
    (e >= 8206 && e <= 8207) ||
    e === 8232 ||
    e === 8233
  );
}
function K0(e) {
  return (
    (e >= 33 && e <= 35) ||
    e === 36 ||
    (e >= 37 && e <= 39) ||
    e === 40 ||
    e === 41 ||
    e === 42 ||
    e === 43 ||
    e === 44 ||
    e === 45 ||
    (e >= 46 && e <= 47) ||
    (e >= 58 && e <= 59) ||
    (e >= 60 && e <= 62) ||
    (e >= 63 && e <= 64) ||
    e === 91 ||
    e === 92 ||
    e === 93 ||
    e === 94 ||
    e === 96 ||
    e === 123 ||
    e === 124 ||
    e === 125 ||
    e === 126 ||
    e === 161 ||
    (e >= 162 && e <= 165) ||
    e === 166 ||
    e === 167 ||
    e === 169 ||
    e === 171 ||
    e === 172 ||
    e === 174 ||
    e === 176 ||
    e === 177 ||
    e === 182 ||
    e === 187 ||
    e === 191 ||
    e === 215 ||
    e === 247 ||
    (e >= 8208 && e <= 8213) ||
    (e >= 8214 && e <= 8215) ||
    e === 8216 ||
    e === 8217 ||
    e === 8218 ||
    (e >= 8219 && e <= 8220) ||
    e === 8221 ||
    e === 8222 ||
    e === 8223 ||
    (e >= 8224 && e <= 8231) ||
    (e >= 8240 && e <= 8248) ||
    e === 8249 ||
    e === 8250 ||
    (e >= 8251 && e <= 8254) ||
    (e >= 8257 && e <= 8259) ||
    e === 8260 ||
    e === 8261 ||
    e === 8262 ||
    (e >= 8263 && e <= 8273) ||
    e === 8274 ||
    e === 8275 ||
    (e >= 8277 && e <= 8286) ||
    (e >= 8592 && e <= 8596) ||
    (e >= 8597 && e <= 8601) ||
    (e >= 8602 && e <= 8603) ||
    (e >= 8604 && e <= 8607) ||
    e === 8608 ||
    (e >= 8609 && e <= 8610) ||
    e === 8611 ||
    (e >= 8612 && e <= 8613) ||
    e === 8614 ||
    (e >= 8615 && e <= 8621) ||
    e === 8622 ||
    (e >= 8623 && e <= 8653) ||
    (e >= 8654 && e <= 8655) ||
    (e >= 8656 && e <= 8657) ||
    e === 8658 ||
    e === 8659 ||
    e === 8660 ||
    (e >= 8661 && e <= 8691) ||
    (e >= 8692 && e <= 8959) ||
    (e >= 8960 && e <= 8967) ||
    e === 8968 ||
    e === 8969 ||
    e === 8970 ||
    e === 8971 ||
    (e >= 8972 && e <= 8991) ||
    (e >= 8992 && e <= 8993) ||
    (e >= 8994 && e <= 9e3) ||
    e === 9001 ||
    e === 9002 ||
    (e >= 9003 && e <= 9083) ||
    e === 9084 ||
    (e >= 9085 && e <= 9114) ||
    (e >= 9115 && e <= 9139) ||
    (e >= 9140 && e <= 9179) ||
    (e >= 9180 && e <= 9185) ||
    (e >= 9186 && e <= 9254) ||
    (e >= 9255 && e <= 9279) ||
    (e >= 9280 && e <= 9290) ||
    (e >= 9291 && e <= 9311) ||
    (e >= 9472 && e <= 9654) ||
    e === 9655 ||
    (e >= 9656 && e <= 9664) ||
    e === 9665 ||
    (e >= 9666 && e <= 9719) ||
    (e >= 9720 && e <= 9727) ||
    (e >= 9728 && e <= 9838) ||
    e === 9839 ||
    (e >= 9840 && e <= 10087) ||
    e === 10088 ||
    e === 10089 ||
    e === 10090 ||
    e === 10091 ||
    e === 10092 ||
    e === 10093 ||
    e === 10094 ||
    e === 10095 ||
    e === 10096 ||
    e === 10097 ||
    e === 10098 ||
    e === 10099 ||
    e === 10100 ||
    e === 10101 ||
    (e >= 10132 && e <= 10175) ||
    (e >= 10176 && e <= 10180) ||
    e === 10181 ||
    e === 10182 ||
    (e >= 10183 && e <= 10213) ||
    e === 10214 ||
    e === 10215 ||
    e === 10216 ||
    e === 10217 ||
    e === 10218 ||
    e === 10219 ||
    e === 10220 ||
    e === 10221 ||
    e === 10222 ||
    e === 10223 ||
    (e >= 10224 && e <= 10239) ||
    (e >= 10240 && e <= 10495) ||
    (e >= 10496 && e <= 10626) ||
    e === 10627 ||
    e === 10628 ||
    e === 10629 ||
    e === 10630 ||
    e === 10631 ||
    e === 10632 ||
    e === 10633 ||
    e === 10634 ||
    e === 10635 ||
    e === 10636 ||
    e === 10637 ||
    e === 10638 ||
    e === 10639 ||
    e === 10640 ||
    e === 10641 ||
    e === 10642 ||
    e === 10643 ||
    e === 10644 ||
    e === 10645 ||
    e === 10646 ||
    e === 10647 ||
    e === 10648 ||
    (e >= 10649 && e <= 10711) ||
    e === 10712 ||
    e === 10713 ||
    e === 10714 ||
    e === 10715 ||
    (e >= 10716 && e <= 10747) ||
    e === 10748 ||
    e === 10749 ||
    (e >= 10750 && e <= 11007) ||
    (e >= 11008 && e <= 11055) ||
    (e >= 11056 && e <= 11076) ||
    (e >= 11077 && e <= 11078) ||
    (e >= 11079 && e <= 11084) ||
    (e >= 11085 && e <= 11123) ||
    (e >= 11124 && e <= 11125) ||
    (e >= 11126 && e <= 11157) ||
    e === 11158 ||
    (e >= 11159 && e <= 11263) ||
    (e >= 11776 && e <= 11777) ||
    e === 11778 ||
    e === 11779 ||
    e === 11780 ||
    e === 11781 ||
    (e >= 11782 && e <= 11784) ||
    e === 11785 ||
    e === 11786 ||
    e === 11787 ||
    e === 11788 ||
    e === 11789 ||
    (e >= 11790 && e <= 11798) ||
    e === 11799 ||
    (e >= 11800 && e <= 11801) ||
    e === 11802 ||
    e === 11803 ||
    e === 11804 ||
    e === 11805 ||
    (e >= 11806 && e <= 11807) ||
    e === 11808 ||
    e === 11809 ||
    e === 11810 ||
    e === 11811 ||
    e === 11812 ||
    e === 11813 ||
    e === 11814 ||
    e === 11815 ||
    e === 11816 ||
    e === 11817 ||
    (e >= 11818 && e <= 11822) ||
    e === 11823 ||
    (e >= 11824 && e <= 11833) ||
    (e >= 11834 && e <= 11835) ||
    (e >= 11836 && e <= 11839) ||
    e === 11840 ||
    e === 11841 ||
    e === 11842 ||
    (e >= 11843 && e <= 11855) ||
    (e >= 11856 && e <= 11857) ||
    e === 11858 ||
    (e >= 11859 && e <= 11903) ||
    (e >= 12289 && e <= 12291) ||
    e === 12296 ||
    e === 12297 ||
    e === 12298 ||
    e === 12299 ||
    e === 12300 ||
    e === 12301 ||
    e === 12302 ||
    e === 12303 ||
    e === 12304 ||
    e === 12305 ||
    (e >= 12306 && e <= 12307) ||
    e === 12308 ||
    e === 12309 ||
    e === 12310 ||
    e === 12311 ||
    e === 12312 ||
    e === 12313 ||
    e === 12314 ||
    e === 12315 ||
    e === 12316 ||
    e === 12317 ||
    (e >= 12318 && e <= 12319) ||
    e === 12320 ||
    e === 12336 ||
    e === 64830 ||
    e === 64831 ||
    (e >= 65093 && e <= 65094)
  );
}
function Zr(e) {
  e.forEach(function(t) {
    if ((delete t.location, Js(t) || ea(t)))
      for (var n in t.options)
        delete t.options[n].location, Zr(t.options[n].value);
    else
      (Qs(t) && na(t.style)) || ((Ks(t) || Ys(t)) && Ur(t.style))
        ? delete t.style.location
        : ta(t) && Zr(t.children);
  });
}
function Y0(e, t) {
  t === void 0 && (t = {}),
    (t = ee({ shouldParseSkeletons: !0, requiresOtherClause: !0 }, t));
  var n = new W0(e, t).parse();
  if (n.err) {
    var r = SyntaxError(K[n.err.kind]);
    throw ((r.location = n.err.location),
    (r.originalMessage = n.err.message),
    r);
  }
  return t?.captureLocation || Zr(n.val), n.val;
}
var kt;
(function(e) {
  (e.MISSING_VALUE = "MISSING_VALUE"),
    (e.INVALID_VALUE = "INVALID_VALUE"),
    (e.MISSING_INTL_API = "MISSING_INTL_API");
})(kt || (kt = {}));
var Kn = (function(e) {
    Qn(t, e);
    function t(n, r, i) {
      var o = e.call(this, n) || this;
      return (o.code = r), (o.originalMessage = i), o;
    }
    return (
      (t.prototype.toString = function() {
        return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
      }),
      t
    );
  })(Error),
  po = (function(e) {
    Qn(t, e);
    function t(n, r, i, o) {
      return (
        e.call(
          this,
          'Invalid values for "'
            .concat(n, '": "')
            .concat(r, '". Options are "')
            .concat(Object.keys(i).join('", "'), '"'),
          kt.INVALID_VALUE,
          o
        ) || this
      );
    }
    return t;
  })(Kn),
  J0 = (function(e) {
    Qn(t, e);
    function t(n, r, i) {
      return (
        e.call(
          this,
          'Value for "'.concat(n, '" must be of type ').concat(r),
          kt.INVALID_VALUE,
          i
        ) || this
      );
    }
    return t;
  })(Kn),
  e2 = (function(e) {
    Qn(t, e);
    function t(n, r) {
      return (
        e.call(
          this,
          'The intl string context variable "'
            .concat(n, '" was not provided to the string "')
            .concat(r, '"'),
          kt.MISSING_VALUE,
          r
        ) || this
      );
    }
    return t;
  })(Kn),
  be;
(function(e) {
  (e[(e.literal = 0)] = "literal"), (e[(e.object = 1)] = "object");
})(be || (be = {}));
function t2(e) {
  return e.length < 2
    ? e
    : e.reduce(function(t, n) {
        var r = t[t.length - 1];
        return (
          !r || r.type !== be.literal || n.type !== be.literal
            ? t.push(n)
            : (r.value += n.value),
          t
        );
      }, []);
}
function n2(e) {
  return typeof e == "function";
}
function En(e, t, n, r, i, o, s) {
  if (e.length === 1 && lo(e[0]))
    return [{ type: be.literal, value: e[0].value }];
  for (var a = [], l = 0, f = e; l < f.length; l++) {
    var u = f[l];
    if (lo(u)) {
      a.push({ type: be.literal, value: u.value });
      continue;
    }
    if (S0(u)) {
      typeof o == "number" &&
        a.push({ type: be.literal, value: n.getNumberFormat(t).format(o) });
      continue;
    }
    var c = u.value;
    if (!(i && c in i)) throw new e2(c, s);
    var d = i[c];
    if (E0(u)) {
      (!d || typeof d == "string" || typeof d == "number") &&
        (d = typeof d == "string" || typeof d == "number" ? String(d) : ""),
        a.push({
          type: typeof d == "string" ? be.literal : be.object,
          value: d
        });
      continue;
    }
    if (Ks(u)) {
      var g =
        typeof u.style == "string"
          ? r.date[u.style]
          : Ur(u.style)
          ? u.style.parsedOptions
          : void 0;
      a.push({ type: be.literal, value: n.getDateTimeFormat(t, g).format(d) });
      continue;
    }
    if (Ys(u)) {
      var g =
        typeof u.style == "string"
          ? r.time[u.style]
          : Ur(u.style)
          ? u.style.parsedOptions
          : r.time.medium;
      a.push({ type: be.literal, value: n.getDateTimeFormat(t, g).format(d) });
      continue;
    }
    if (Qs(u)) {
      var g =
        typeof u.style == "string"
          ? r.number[u.style]
          : na(u.style)
          ? u.style.parsedOptions
          : void 0;
      g && g.scale && (d = d * (g.scale || 1)),
        a.push({ type: be.literal, value: n.getNumberFormat(t, g).format(d) });
      continue;
    }
    if (ta(u)) {
      var m = u.children,
        p = u.value,
        b = i[p];
      if (!n2(b)) throw new J0(p, "function", s);
      var $ = En(m, t, n, r, i, o),
        A = b(
          $.map(function(I) {
            return I.value;
          })
        );
      Array.isArray(A) || (A = [A]),
        a.push.apply(
          a,
          A.map(function(I) {
            return {
              type: typeof I == "string" ? be.literal : be.object,
              value: I
            };
          })
        );
    }
    if (Js(u)) {
      var N = u.options[d] || u.options.other;
      if (!N) throw new po(u.value, d, Object.keys(u.options), s);
      a.push.apply(a, En(N.value, t, n, r, i));
      continue;
    }
    if (ea(u)) {
      var N = u.options["=".concat(d)];
      if (!N) {
        if (!Intl.PluralRules)
          throw new Kn(
            `Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,
            kt.MISSING_INTL_API,
            s
          );
        var T = n
          .getPluralRules(t, { type: u.pluralType })
          .select(d - (u.offset || 0));
        N = u.options[T] || u.options.other;
      }
      if (!N) throw new po(u.value, d, Object.keys(u.options), s);
      a.push.apply(a, En(N.value, t, n, r, i, d - (u.offset || 0)));
      continue;
    }
  }
  return t2(a);
}
function r2(e, t) {
  return t
    ? ee(
        ee(ee({}, e || {}), t || {}),
        Object.keys(e).reduce(function(n, r) {
          return (n[r] = ee(ee({}, e[r]), t[r] || {})), n;
        }, {})
      )
    : e;
}
function i2(e, t) {
  return t
    ? Object.keys(e).reduce(function(n, r) {
        return (n[r] = r2(e[r], t[r])), n;
      }, ee({}, e))
    : e;
}
function mr(e) {
  return {
    create: function() {
      return {
        get: function(t) {
          return e[t];
        },
        set: function(t, n) {
          e[t] = n;
        }
      };
    }
  };
}
function o2(e) {
  return (
    e === void 0 && (e = { number: {}, dateTime: {}, pluralRules: {} }),
    {
      getNumberFormat: dr(
        function() {
          for (var t, n = [], r = 0; r < arguments.length; r++)
            n[r] = arguments[r];
          return new ((t = Intl.NumberFormat).bind.apply(
            t,
            fr([void 0], n, !1)
          ))();
        },
        { cache: mr(e.number), strategy: hr.variadic }
      ),
      getDateTimeFormat: dr(
        function() {
          for (var t, n = [], r = 0; r < arguments.length; r++)
            n[r] = arguments[r];
          return new ((t = Intl.DateTimeFormat).bind.apply(
            t,
            fr([void 0], n, !1)
          ))();
        },
        { cache: mr(e.dateTime), strategy: hr.variadic }
      ),
      getPluralRules: dr(
        function() {
          for (var t, n = [], r = 0; r < arguments.length; r++)
            n[r] = arguments[r];
          return new ((t = Intl.PluralRules).bind.apply(
            t,
            fr([void 0], n, !1)
          ))();
        },
        { cache: mr(e.pluralRules), strategy: hr.variadic }
      )
    }
  );
}
var s2 = (function() {
  function e(t, n, r, i) {
    n === void 0 && (n = e.defaultLocale);
    var o = this;
    if (
      ((this.formatterCache = { number: {}, dateTime: {}, pluralRules: {} }),
      (this.format = function(l) {
        var f = o.formatToParts(l);
        if (f.length === 1) return f[0].value;
        var u = f.reduce(function(c, d) {
          return (
            !c.length ||
            d.type !== be.literal ||
            typeof c[c.length - 1] != "string"
              ? c.push(d.value)
              : (c[c.length - 1] += d.value),
            c
          );
        }, []);
        return u.length <= 1 ? u[0] || "" : u;
      }),
      (this.formatToParts = function(l) {
        return En(
          o.ast,
          o.locales,
          o.formatters,
          o.formats,
          l,
          void 0,
          o.message
        );
      }),
      (this.resolvedOptions = function() {
        var l;
        return {
          locale:
            ((l = o.resolvedLocale) === null || l === void 0
              ? void 0
              : l.toString()) ||
            Intl.NumberFormat.supportedLocalesOf(o.locales)[0]
        };
      }),
      (this.getAst = function() {
        return o.ast;
      }),
      (this.locales = n),
      (this.resolvedLocale = e.resolveLocale(n)),
      typeof t == "string")
    ) {
      if (((this.message = t), !e.__parse))
        throw new TypeError(
          "IntlMessageFormat.__parse must be set to process `message` of type `string`"
        );
      var s = i || {};
      s.formatters;
      var a = m0(s, ["formatters"]);
      this.ast = e.__parse(t, ee(ee({}, a), { locale: this.resolvedLocale }));
    } else this.ast = t;
    if (!Array.isArray(this.ast))
      throw new TypeError("A message must be provided as a String or AST.");
    (this.formats = i2(e.formats, r)),
      (this.formatters = (i && i.formatters) || o2(this.formatterCache));
  }
  return (
    Object.defineProperty(e, "defaultLocale", {
      get: function() {
        return (
          e.memoizedDefaultLocale ||
            (e.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale),
          e.memoizedDefaultLocale
        );
      },
      enumerable: !1,
      configurable: !0
    }),
    (e.memoizedDefaultLocale = null),
    (e.resolveLocale = function(t) {
      if (!(typeof Intl.Locale > "u")) {
        var n = Intl.NumberFormat.supportedLocalesOf(t);
        return n.length > 0
          ? new Intl.Locale(n[0])
          : new Intl.Locale(typeof t == "string" ? t : t[0]);
      }
    }),
    (e.__parse = Y0),
    (e.formats = {
      number: {
        integer: { maximumFractionDigits: 0 },
        currency: { style: "currency" },
        percent: { style: "percent" }
      },
      date: {
        short: { month: "numeric", day: "numeric", year: "2-digit" },
        medium: { month: "short", day: "numeric", year: "numeric" },
        long: { month: "long", day: "numeric", year: "numeric" },
        full: {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      },
      time: {
        short: { hour: "numeric", minute: "numeric" },
        medium: { hour: "numeric", minute: "numeric", second: "numeric" },
        long: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        },
        full: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        }
      }
    }),
    e
  );
})();
class a2 {
  format(t, n) {
    let r = this.cache[t];
    if (!r) {
      let o = this.messages.getStringForLocale(t, this.locale);
      if (!o)
        throw new Error(
          `Could not find intl message ${t} in ${this.locale} locale`
        );
      (r = new s2(o, this.locale)), (this.cache[t] = r);
    }
    let i;
    return (
      n &&
        (i = Object.keys(n).reduce(
          (o, s) => ((o[s] = n[s] == null ? !1 : n[s]), o),
          {}
        )),
      r.format(i)
    );
  }
  constructor(t, n) {
    (this.locale = t), (this.messages = n), (this.cache = {});
  }
}
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/23c3a91e7b87952f07da9da115188bd2abd99d77/packages/@react-aria/i18n/src/useMessageFormatter.ts
 */ const vo = new WeakMap();
function l2(e) {
  let t = vo.get(e);
  return t || ((t = new d0(e)), vo.set(e, t)), t;
}
function c2(e) {
  const { locale: t } = f0(),
    n = k(() => new a2(t(), l2(j(e))));
  return k(() => ({ format: (r, i) => n().format(r, i) }));
}
/*!
 * Portions of this file are based on code from ariakit
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the ariakit team:
 * https://github.com/hope-ui/hope-ui/blob/54125b130195f37161dbeeea0c21dc3b198bc3ac/packages/core/src/button/is-button.ts
 */ const u2 = ["button", "color", "file", "image", "reset", "submit"];
function f2(e) {
  const t = e.tagName.toLowerCase();
  return t === "button"
    ? !0
    : t === "input" && e.type
    ? u2.indexOf(e.type) !== -1
    : !1;
}
function Yn(e) {
  let t;
  e = Ve({ type: "button" }, e);
  const [n, r] = le(e, ["ref", "type", "disabled"]),
    i = hi(
      () => t,
      () => "button"
    ),
    o = k(() => {
      const l = i();
      return l == null ? !1 : f2({ tagName: l, type: n.type });
    }),
    s = k(() => i() === "input"),
    a = k(() => i() === "a" && t?.getAttribute("href") != null);
  return h(
    nt,
    F(
      {
        as: "button",
        ref(l) {
          var f = bt(u => (t = u), n.ref);
          typeof f == "function" && f(l);
        },
        get type() {
          return o() || s() ? n.type : void 0;
        },
        get role() {
          return !o() && !a() ? "button" : void 0;
        },
        get tabIndex() {
          return !o() && !a() && !n.disabled ? 0 : void 0;
        },
        get disabled() {
          return o() || s() ? n.disabled : void 0;
        },
        get "aria-disabled"() {
          return !o() && !s() && n.disabled ? !0 : void 0;
        },
        get "data-disabled"() {
          return n.disabled ? "" : void 0;
        }
      },
      r
    )
  );
}
const ua = ve();
function Ht() {
  const e = ie(ua);
  if (e === void 0)
    throw new Error(
      "[kobalte]: `useDialogContext` must be used within a `Dialog` component"
    );
  return e;
}
function Nn(e) {
  const t = Ht(),
    [n, r] = le(e, ["aria-label", "onClick"]),
    i = c2(() => i0);
  return h(
    Yn,
    F(
      {
        get "aria-label"() {
          return n["aria-label"] || i().format("dismiss");
        },
        onClick: s => {
          Xn(s, n.onClick), t.close();
        }
      },
      r
    )
  );
}
const fa = ve();
function d2() {
  return ie(fa);
}
function h2(e) {
  let t;
  const n = d2(),
    [r, i] = le(e, [
      "ref",
      "disableOutsidePointerEvents",
      "excludedElements",
      "onEscapeKeyDown",
      "onPointerDownOutside",
      "onFocusOutside",
      "onInteractOutside",
      "onDismiss",
      "bypassTopMostLayerCheck"
    ]),
    o = new Set([]),
    s = c => {
      o.add(c);
      const d = n?.registerNestedLayer(c);
      return () => {
        o.delete(c), d?.();
      };
    };
  Z1(
    {
      shouldExcludeElement: c =>
        t
          ? r.excludedElements?.some(d => Ze(d(), c)) ||
            [...o].some(d => Ze(d, c))
          : !1,
      onPointerDownOutside: c => {
        !t ||
          Se.isBelowPointerBlockingLayer(t) ||
          (!r.bypassTopMostLayerCheck && !Se.isTopMostLayer(t)) ||
          (r.onPointerDownOutside?.(c),
          r.onInteractOutside?.(c),
          c.defaultPrevented || r.onDismiss?.());
      },
      onFocusOutside: c => {
        r.onFocusOutside?.(c),
          r.onInteractOutside?.(c),
          c.defaultPrevented || r.onDismiss?.();
      }
    },
    () => t
  ),
    I1({
      ownerDocument: () => Ue(t),
      onEscapeKeyDown: c => {
        !t ||
          !Se.isTopMostLayer(t) ||
          (r.onEscapeKeyDown?.(c),
          !c.defaultPrevented &&
            r.onDismiss &&
            (c.preventDefault(), r.onDismiss()));
      }
    }),
    Be(() => {
      if (!t) return;
      Se.addLayer({
        node: t,
        isPointerBlocking: r.disableOutsidePointerEvents,
        dismiss: r.onDismiss
      });
      const c = n?.registerNestedLayer(t);
      Se.assignPointerEventToLayers(),
        Se.disableBodyPointerEvents(t),
        U(() => {
          t &&
            (Se.removeLayer(t),
            c?.(),
            Se.assignPointerEventToLayers(),
            Se.restoreBodyPointerEvents(t));
        });
    }),
    H(
      De(
        [() => t, () => r.disableOutsidePointerEvents],
        ([c, d]) => {
          if (!c) return;
          const g = Se.find(c);
          g &&
            g.isPointerBlocking !== d &&
            ((g.isPointerBlocking = d), Se.assignPointerEventToLayers()),
            d && Se.disableBodyPointerEvents(c),
            U(() => {
              Se.restoreBodyPointerEvents(c);
            });
        },
        { defer: !0 }
      )
    );
  const u = { registerNestedLayer: s };
  return h(fa.Provider, {
    value: u,
    get children() {
      return h(
        nt,
        F(
          {
            as: "div",
            ref(c) {
              var d = bt(g => (t = g), r.ref);
              typeof d == "function" && d(c);
            }
          },
          i
        )
      );
    }
  });
}
function pi(e) {
  let t;
  const n = Ht();
  e = Ve({ id: n.generateId("content") }, e);
  const [r, i] = le(e, [
    "ref",
    "onOpenAutoFocus",
    "onCloseAutoFocus",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside"
  ]);
  let o = !1,
    s = !1;
  const a = c => {
      r.onPointerDownOutside?.(c),
        n.modal() && c.detail.isContextMenu && c.preventDefault();
    },
    l = c => {
      r.onFocusOutside?.(c), n.modal() && c.preventDefault();
    },
    f = c => {
      r.onInteractOutside?.(c),
        !n.modal() &&
          (c.defaultPrevented ||
            ((o = !0),
            c.detail.originalEvent.type === "pointerdown" && (s = !0)),
          Ze(n.triggerRef(), c.target) && c.preventDefault(),
          c.detail.originalEvent.type === "focusin" && s && c.preventDefault());
    },
    u = c => {
      r.onCloseAutoFocus?.(c),
        n.modal()
          ? (c.preventDefault(), je(n.triggerRef()))
          : (c.defaultPrevented ||
              (o || je(n.triggerRef()), c.preventDefault()),
            (o = !1),
            (s = !1));
    };
  return (
    j1({
      isDisabled: () => !(n.isOpen() && n.modal()),
      targets: () => (t ? [t] : [])
    }),
    Q1({
      ownerRef: () => t,
      isDisabled: () => !(n.isOpen() && (n.modal() || n.preventScroll()))
    }),
    H1(
      {
        trapFocus: () => n.isOpen() && n.modal(),
        onMountAutoFocus: r.onOpenAutoFocus,
        onUnmountAutoFocus: u
      },
      () => t
    ),
    H(() => U(n.registerContentId(i.id))),
    h(Q, {
      get when() {
        return n.contentPresence.isPresent();
      },
      get children() {
        return h(
          h2,
          F(
            {
              ref(c) {
                var d = bt(g => {
                  n.contentPresence.setRef(g), (t = g);
                }, r.ref);
                typeof d == "function" && d(c);
              },
              role: "dialog",
              tabIndex: -1,
              get disableOutsidePointerEvents() {
                return k(() => !!n.modal())() && n.isOpen();
              },
              get excludedElements() {
                return [n.triggerRef];
              },
              get "aria-labelledby"() {
                return n.titleId();
              },
              get "aria-describedby"() {
                return n.descriptionId();
              },
              get "data-expanded"() {
                return n.isOpen() ? "" : void 0;
              },
              get "data-closed"() {
                return n.isOpen() ? void 0 : "";
              },
              onPointerDownOutside: a,
              onFocusOutside: l,
              onInteractOutside: f,
              get onDismiss() {
                return n.close;
              }
            },
            i
          )
        );
      }
    })
  );
}
function g2(e) {
  const t = Ht();
  e = Ve({ id: t.generateId("description") }, e);
  const [n, r] = le(e, ["id"]);
  return (
    H(() => U(t.registerDescriptionId(n.id))),
    h(
      nt,
      F(
        {
          as: "p",
          get id() {
            return n.id;
          }
        },
        r
      )
    )
  );
}
function ln(e) {
  const t = Ht();
  return h(Q, {
    get when() {
      return t.contentPresence.isPresent() || t.overlayPresence.isPresent();
    },
    get children() {
      return h(ds, e);
    }
  });
}
function cn(e) {
  const t = `dialog-${Dt()}`;
  e = Ve({ id: t, modal: !0, preventScroll: !1 }, e);
  const [n, r] = L(),
    [i, o] = L(),
    [s, a] = L(),
    [l, f] = L(),
    u = P1({
      open: () => e.open,
      defaultOpen: () => e.defaultOpen,
      onOpenChange: p => e.onOpenChange?.(p)
    }),
    c = () => e.forceMount || u.isOpen(),
    d = no(c),
    g = no(c),
    m = {
      isOpen: u.isOpen,
      modal: () => e.modal ?? !0,
      preventScroll: () => e.preventScroll ?? !1,
      contentId: n,
      titleId: i,
      descriptionId: s,
      triggerRef: l,
      overlayPresence: d,
      contentPresence: g,
      close: u.close,
      toggle: u.toggle,
      setTriggerRef: f,
      generateId: ai(() => e.id),
      registerContentId: ct(r),
      registerTitleId: ct(o),
      registerDescriptionId: ct(a)
    };
  return h(ua.Provider, {
    value: m,
    get children() {
      return e.children;
    }
  });
}
function m2(e) {
  const t = Ht();
  e = Ve({ id: t.generateId("title") }, e);
  const [n, r] = le(e, ["id"]);
  return (
    H(() => U(t.registerTitleId(n.id))),
    h(
      nt,
      F(
        {
          as: "h2",
          get id() {
            return n.id;
          }
        },
        r
      )
    )
  );
}
function Jn(e) {
  const t = Ht(),
    [n, r] = le(e, ["ref", "onClick"]);
  return h(
    Yn,
    F(
      {
        ref(o) {
          var s = bt(t.setTriggerRef, n.ref);
          typeof s == "function" && s(o);
        },
        "aria-haspopup": "dialog",
        get "aria-expanded"() {
          return t.isOpen();
        },
        get "aria-controls"() {
          return k(() => !!t.isOpen())() ? t.contentId() : void 0;
        },
        get "data-expanded"() {
          return t.isOpen() ? "" : void 0;
        },
        get "data-closed"() {
          return t.isOpen() ? void 0 : "";
        },
        onClick: o => {
          Xn(o, n.onClick), t.toggle();
        }
      },
      r
    )
  );
}
function p2(e) {
  let t;
  const [n, r] = le(e, ["ref", "type", "href", "disabled"]),
    i = hi(
      () => t,
      () => "a"
    );
  return h(
    nt,
    F(
      {
        as: "a",
        ref(o) {
          var s = bt(a => (t = a), n.ref);
          typeof s == "function" && s(o);
        },
        get role() {
          return i() !== "a" || n.disabled ? "link" : void 0;
        },
        get tabIndex() {
          return i() !== "a" && !n.disabled ? 0 : void 0;
        },
        get href() {
          return n.disabled ? void 0 : n.href;
        },
        get "aria-disabled"() {
          return n.disabled ? !0 : void 0;
        },
        get "data-disabled"() {
          return n.disabled ? "" : void 0;
        }
      },
      r
    )
  );
}
const da = ve();
function v2() {
  const e = ie(da);
  if (e === void 0)
    throw new Error(
      "[kobalte]: `useTextFieldContext` must be used within a `TextField` component"
    );
  return e;
}
function y2(e) {
  return h(b2, F({ type: "text" }, e));
}
function b2(e) {
  const t = gi(),
    n = v2();
  e = Ve({ id: n.generateId("input") }, e);
  const [r, i, o] = le(e, ["onInput"], e0),
    { fieldProps: s } = t0(i);
  return h(
    nt,
    F(
      {
        as: "input",
        get id() {
          return s.id();
        },
        get name() {
          return t.name();
        },
        get value() {
          return n.value();
        },
        get required() {
          return t.isRequired();
        },
        get disabled() {
          return t.isDisabled();
        },
        get readonly() {
          return t.isReadOnly();
        },
        get "aria-label"() {
          return s.ariaLabel();
        },
        get "aria-labelledby"() {
          return s.ariaLabelledBy();
        },
        get "aria-describedby"() {
          return s.ariaDescribedBy();
        },
        get "aria-invalid"() {
          return t.validationState() === "invalid" || void 0;
        },
        get "aria-required"() {
          return t.isRequired() || void 0;
        },
        get "aria-disabled"() {
          return t.isDisabled() || void 0;
        },
        get "aria-readonly"() {
          return t.isReadOnly() || void 0;
        },
        get onInput() {
          return Dr([r.onInput, n.onInput]);
        }
      },
      () => t.dataset(),
      o
    )
  );
}
function _2(e) {
  let t;
  const n = `textfield-${Dt()}`;
  e = Ve({ id: n }, e);
  const [r, i, o] = le(e, ["ref", "value", "defaultValue", "onChange"], Y1),
    [s, a] = Us({
      value: () => r.value,
      defaultValue: () => r.defaultValue,
      onChange: c => r.onChange?.(c)
    }),
    { formControlContext: l } = J1(i);
  F1(
    () => t,
    () => a(r.defaultValue ?? "")
  );
  const f = c => {
      if (l.isReadOnly() || l.isDisabled()) return;
      const d = c.target;
      a(d.value), (d.value = s() ?? "");
    },
    u = { value: s, generateId: ai(() => j(i.id)), onInput: f };
  return h(Zs.Provider, {
    value: l,
    get children() {
      return h(da.Provider, {
        value: u,
        get children() {
          return h(
            nt,
            F(
              {
                as: "div",
                ref(c) {
                  var d = bt(g => (t = g), r.ref);
                  typeof d == "function" && d(c);
                },
                role: "group",
                get id() {
                  return j(i.id);
                }
              },
              () => l.dataset(),
              o
            )
          );
        }
      });
    }
  });
}
function ha(e) {
  const [t, n] = le(e, [
      "children",
      "pressed",
      "defaultPressed",
      "onChange",
      "onClick"
    ]),
    r = K1({
      isSelected: () => t.pressed,
      defaultIsSelected: () => t.defaultPressed,
      onSelectedChange: o => t.onChange?.(o),
      isDisabled: () => n.disabled
    });
  return h(
    Yn,
    F(
      {
        get "aria-pressed"() {
          return r.isSelected();
        },
        get "data-pressed"() {
          return r.isSelected() ? "" : void 0;
        },
        onClick: o => {
          Xn(o, t.onClick), r.toggle();
        }
      },
      n,
      {
        get children() {
          return h(w2, {
            get state() {
              return { pressed: r.isSelected };
            },
            get children() {
              return t.children;
            }
          });
        }
      }
    )
  );
}
function w2(e) {
  const t = mt(() => {
    const n = e.children;
    return ks(n) ? n(e.state) : n;
  });
  return k(t);
}
function ga(e) {
  var t,
    n,
    r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object")
    if (Array.isArray(e))
      for (t = 0; t < e.length; t++)
        e[t] && (n = ga(e[t])) && (r && (r += " "), (r += n));
    else for (t in e) e[t] && (r && (r += " "), (r += t));
  return r;
}
function q() {
  for (var e, t, n = 0, r = ""; n < arguments.length; )
    (e = arguments[n++]) && (t = ga(e)) && (r && (r += " "), (r += t));
  return r;
}
function vi() {
  return h(ti, { children: "* { cursor: wait !important }" });
}
const x2 = "_sticky_1huux_1",
  E2 = "_isFixed_1huux_5",
  yo = { sticky: x2, isFixed: E2 };
function S2({ x: e, y: t }) {
  return `translate3d(${e}px, ${t}px, 0px)`;
}
function $6(e) {
  return `rotate(${e}rad)`;
}
function C6(e) {
  return `${e.toString()}%`;
}
var bo = S("<div>");
const ma = an(() => L(0));
function A2() {
  const [, e] = ma();
  H(() => {
    e(t => t + 1),
      U(() => {
        e(t => t - 1);
      });
  });
}
function pa(e) {
  const [t, n] = L(!1);
  return (
    H(() => {
      e() && A2(),
        queueMicrotask(() => {
          n(e());
        });
    }),
    t
  );
}
function va(e) {
  const [t] = ma(),
    n = () => t() > 0,
    [r, i] = L(),
    [o, s] = L();
  return (
    D(() => {
      n() && r() ? s(r().getBoundingClientRect()) : s(() => {});
    }),
    [
      (() => {
        var a = E(bo);
        return (
          D(
            l => {
              var f = o() != null && !e.fixed ? "block" : "none",
                u = `${o()?.height ?? 0}px`;
              return (
                f !== l.e &&
                  ((l.e = f) != null
                    ? a.style.setProperty("display", f)
                    : a.style.removeProperty("display")),
                u !== l.t &&
                  ((l.t = u) != null
                    ? a.style.setProperty("height", u)
                    : a.style.removeProperty("height")),
                l
              );
            },
            { e: void 0, t: void 0 }
          ),
          a
        );
      })(),
      (() => {
        var a = E(bo);
        return (
          ze(i, a),
          x(a, () => e.children),
          D(
            l => {
              var f = q(yo.sticky, e.class),
                u = { ...e.classList, [yo.isFixed]: o() != null || e.fixed },
                c = e.fixed ? "" : S2({ x: o()?.x ?? 0, y: o()?.y ?? 0 }),
                d = !e.fixed && o() != null ? "0" : "",
                g = !e.fixed && o() != null ? "auto" : "";
              return (
                f !== l.e && M(a, (l.e = f)),
                (l.t = pt(a, u, l.t)),
                c !== l.a &&
                  ((l.a = c) != null
                    ? a.style.setProperty("transform", c)
                    : a.style.removeProperty("transform")),
                d !== l.o &&
                  ((l.o = d) != null
                    ? a.style.setProperty("top", d)
                    : a.style.removeProperty("top")),
                g !== l.i &&
                  ((l.i = g) != null
                    ? a.style.setProperty("bottom", g)
                    : a.style.removeProperty("bottom")),
                l
              );
            },
            { e: void 0, t: void 0, a: void 0, o: void 0, i: void 0 }
          ),
          a
        );
      })()
    ]
  );
}
const $2 = Ae(() =>
    $e(() => import("./GalleryDialogContent-30c27124.js"), [
      "assets/GalleryDialogContent-30c27124.js",
      "assets/gesture-e9dbab06.js",
      "assets/GalleryDialogContent-b7fe9771.css"
    ])
  ),
  C2 = Mt();
function T2(e) {
  const [t, n] = C2(),
    r = pa(t);
  return h(cn, {
    get open() {
      return r();
    },
    onOpenChange: n,
    get children() {
      return [
        h(
          Jn,
          F(e, {
            get class() {
              return q(e.class, ce.focusVisible);
            }
          })
        ),
        h(ln, {
          get children() {
            return h(ei, {
              get fallback() {
                return h(vi, {});
              },
              get children() {
                return h($2, {});
              }
            });
          }
        })
      ];
    }
  });
}
const P2 = "_button_24mts_1",
  I2 = "_crossfade_24mts_10",
  O2 = "_picture_24mts_15",
  L2 = "_isFixed_24mts_20",
  pr = { button: P2, crossfade: I2, picture: O2, isFixed: L2 },
  k2 = "_picture_z2r5u_1",
  B2 = { picture: k2 };
var N2 =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
    ? window
    : typeof global < "u"
    ? global
    : typeof self < "u"
    ? self
    : {};
function ya(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var ba = { exports: {} };
(function(e, t) {
  (function(n, r) {
    e.exports = r();
  })(N2, function() {
    function n() {
      return (
        (n =
          Object.assign ||
          function(v) {
            for (var y = 1; y < arguments.length; y++) {
              var w = arguments[y];
              for (var _ in w)
                Object.prototype.hasOwnProperty.call(w, _) && (v[_] = w[_]);
            }
            return v;
          }),
        n.apply(this, arguments)
      );
    }
    function r(v, y) {
      if (v) {
        if (typeof v == "string") return i(v, y);
        var w = Object.prototype.toString.call(v).slice(8, -1);
        if (
          (w === "Object" && v.constructor && (w = v.constructor.name),
          w === "Map" || w === "Set")
        )
          return Array.from(v);
        if (
          w === "Arguments" ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(w)
        )
          return i(v, y);
      }
    }
    function i(v, y) {
      (y == null || y > v.length) && (y = v.length);
      for (var w = 0, _ = new Array(y); w < y; w++) _[w] = v[w];
      return _;
    }
    function o(v, y) {
      var w = (typeof Symbol < "u" && v[Symbol.iterator]) || v["@@iterator"];
      if (w) return (w = w.call(v)).next.bind(w);
      if (
        Array.isArray(v) ||
        (w = r(v)) ||
        (y && v && typeof v.length == "number")
      ) {
        w && (v = w);
        var _ = 0;
        return function() {
          return _ >= v.length ? { done: !0 } : { done: !1, value: v[_++] };
        };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var s = "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg";
    function a(v) {
      var y = v.split("-"),
        w = y[1],
        _ = y[2],
        W = y[3];
      if (!w || !_ || !W)
        throw new Error(
          "Malformed asset _ref '" + v + `'. Expected an id like "` + s + '".'
        );
      var B = _.split("x"),
        Y = B[0],
        ue = B[1],
        Ne = +Y,
        xe = +ue,
        Ee = isFinite(Ne) && isFinite(xe);
      if (!Ee)
        throw new Error(
          "Malformed asset _ref '" + v + `'. Expected an id like "` + s + '".'
        );
      return { id: w, width: Ne, height: xe, format: W };
    }
    var l = function(y) {
        var w = y;
        return w ? typeof w._ref == "string" : !1;
      },
      f = function(y) {
        var w = y;
        return w ? typeof w._id == "string" : !1;
      },
      u = function(y) {
        var w = y;
        return w && w.asset ? typeof w.asset.url == "string" : !1;
      };
    function c(v) {
      if (!v) return null;
      var y;
      if (typeof v == "string" && d(v)) y = { asset: { _ref: g(v) } };
      else if (typeof v == "string") y = { asset: { _ref: v } };
      else if (l(v)) y = { asset: v };
      else if (f(v)) y = { asset: { _ref: v._id || "" } };
      else if (u(v)) y = { asset: { _ref: g(v.asset.url) } };
      else if (typeof v.asset == "object") y = n({}, v);
      else return null;
      var w = v;
      return (
        w.crop && (y.crop = w.crop), w.hotspot && (y.hotspot = w.hotspot), m(y)
      );
    }
    function d(v) {
      return /^https?:\/\//.test("" + v);
    }
    function g(v) {
      var y = v.split("/").slice(-1);
      return ("image-" + y[0]).replace(/\.([a-z]+)$/, "-$1");
    }
    function m(v) {
      if (v.crop && v.hotspot) return v;
      var y = n({}, v);
      return (
        y.crop || (y.crop = { left: 0, top: 0, bottom: 0, right: 0 }),
        y.hotspot || (y.hotspot = { x: 0.5, y: 0.5, height: 1, width: 1 }),
        y
      );
    }
    var p = [
      ["width", "w"],
      ["height", "h"],
      ["format", "fm"],
      ["download", "dl"],
      ["blur", "blur"],
      ["sharpen", "sharp"],
      ["invert", "invert"],
      ["orientation", "or"],
      ["minHeight", "min-h"],
      ["maxHeight", "max-h"],
      ["minWidth", "min-w"],
      ["maxWidth", "max-w"],
      ["quality", "q"],
      ["fit", "fit"],
      ["crop", "crop"],
      ["saturation", "sat"],
      ["auto", "auto"],
      ["dpr", "dpr"],
      ["pad", "pad"]
    ];
    function b(v) {
      var y = n({}, v || {}),
        w = y.source;
      delete y.source;
      var _ = c(w);
      if (!_)
        throw new Error(
          "Unable to resolve image URL from source (" + JSON.stringify(w) + ")"
        );
      var W = _.asset._ref || _.asset._id || "",
        B = a(W),
        Y = Math.round(_.crop.left * B.width),
        ue = Math.round(_.crop.top * B.height),
        Ne = {
          left: Y,
          top: ue,
          width: Math.round(B.width - _.crop.right * B.width - Y),
          height: Math.round(B.height - _.crop.bottom * B.height - ue)
        },
        xe = (_.hotspot.height * B.height) / 2,
        Ee = (_.hotspot.width * B.width) / 2,
        Ge = _.hotspot.x * B.width,
        rt = _.hotspot.y * B.height,
        He = { left: Ge - Ee, top: rt - xe, right: Ge + Ee, bottom: rt + xe };
      return (
        y.rect ||
          y.focalPoint ||
          y.ignoreImageParams ||
          y.crop ||
          (y = n({}, y, A({ crop: Ne, hotspot: He }, y))),
        $(n({}, y, { asset: B }))
      );
    }
    function $(v) {
      var y = (v.baseUrl || "https://cdn.sanity.io").replace(/\/+$/, ""),
        w =
          v.asset.id +
          "-" +
          v.asset.width +
          "x" +
          v.asset.height +
          "." +
          v.asset.format,
        _ = y + "/images/" + v.projectId + "/" + v.dataset + "/" + w,
        W = [];
      if (v.rect) {
        var B = v.rect,
          Y = B.left,
          ue = B.top,
          Ne = B.width,
          xe = B.height,
          Ee =
            Y !== 0 ||
            ue !== 0 ||
            xe !== v.asset.height ||
            Ne !== v.asset.width;
        Ee && W.push("rect=" + Y + "," + ue + "," + Ne + "," + xe);
      }
      v.bg && W.push("bg=" + v.bg),
        v.focalPoint &&
          (W.push("fp-x=" + v.focalPoint.x), W.push("fp-y=" + v.focalPoint.y));
      var Ge = [v.flipHorizontal && "h", v.flipVertical && "v"]
        .filter(Boolean)
        .join("");
      return (
        Ge && W.push("flip=" + Ge),
        p.forEach(function(rt) {
          var He = rt[0],
            it = rt[1];
          typeof v[He] < "u"
            ? W.push(it + "=" + encodeURIComponent(v[He]))
            : typeof v[it] < "u" &&
              W.push(it + "=" + encodeURIComponent(v[it]));
        }),
        W.length === 0 ? _ : _ + "?" + W.join("&")
      );
    }
    function A(v, y) {
      var w,
        _ = y.width,
        W = y.height;
      if (!(_ && W)) return { width: _, height: W, rect: v.crop };
      var B = v.crop,
        Y = v.hotspot,
        ue = _ / W,
        Ne = B.width / B.height;
      if (Ne > ue) {
        var xe = Math.round(B.height),
          Ee = Math.round(xe * ue),
          Ge = Math.max(0, Math.round(B.top)),
          rt = Math.round((Y.right - Y.left) / 2 + Y.left),
          He = Math.max(0, Math.round(rt - Ee / 2));
        He < B.left
          ? (He = B.left)
          : He + Ee > B.left + B.width && (He = B.left + B.width - Ee),
          (w = { left: He, top: Ge, width: Ee, height: xe });
      } else {
        var it = B.width,
          dn = Math.round(it / ue),
          Ya = Math.max(0, Math.round(B.left)),
          Ja = Math.round((Y.bottom - Y.top) / 2 + Y.top),
          Ut = Math.max(0, Math.round(Ja - dn / 2));
        Ut < B.top
          ? (Ut = B.top)
          : Ut + dn > B.top + B.height && (Ut = B.top + B.height - dn),
          (w = { left: Ya, top: Ut, width: it, height: dn });
      }
      return { width: _, height: W, rect: w };
    }
    var N = ["clip", "crop", "fill", "fillmax", "max", "scale", "min"],
      T = ["top", "bottom", "left", "right", "center", "focalpoint", "entropy"],
      I = ["format"];
    function z(v) {
      return v && "config" in v ? typeof v.config == "function" : !1;
    }
    function re(v) {
      return v && "clientConfig" in v ? typeof v.clientConfig == "object" : !1;
    }
    function R(v) {
      for (var y = p, w = o(y), _; !(_ = w()).done; ) {
        var W = _.value,
          B = W[0],
          Y = W[1];
        if (v === B || v === Y) return B;
      }
      return v;
    }
    function G(v) {
      if (z(v)) {
        var y = v.config(),
          w = y.apiHost,
          _ = y.projectId,
          W = y.dataset,
          B = w || "https://api.sanity.io";
        return new O(null, {
          baseUrl: B.replace(/^https:\/\/api\./, "https://cdn."),
          projectId: _,
          dataset: W
        });
      }
      var Y = v;
      if (re(Y)) {
        var ue = Y.clientConfig,
          Ne = ue.apiHost,
          xe = ue.projectId,
          Ee = ue.dataset,
          Ge = Ne || "https://api.sanity.io";
        return new O(null, {
          baseUrl: Ge.replace(/^https:\/\/api\./, "https://cdn."),
          projectId: xe,
          dataset: Ee
        });
      }
      return new O(null, v);
    }
    var O = (function() {
      function v(w, _) {
        (this.options = void 0),
          (this.options = w ? n({}, w.options || {}, _ || {}) : n({}, _ || {}));
      }
      var y = v.prototype;
      return (
        (y.withOptions = function(_) {
          var W = _.baseUrl || this.options.baseUrl,
            B = { baseUrl: W };
          for (var Y in _)
            if (_.hasOwnProperty(Y)) {
              var ue = R(Y);
              B[ue] = _[Y];
            }
          return new v(this, n({ baseUrl: W }, B));
        }),
        (y.image = function(_) {
          return this.withOptions({ source: _ });
        }),
        (y.dataset = function(_) {
          return this.withOptions({ dataset: _ });
        }),
        (y.projectId = function(_) {
          return this.withOptions({ projectId: _ });
        }),
        (y.bg = function(_) {
          return this.withOptions({ bg: _ });
        }),
        (y.dpr = function(_) {
          return this.withOptions(_ && _ !== 1 ? { dpr: _ } : {});
        }),
        (y.width = function(_) {
          return this.withOptions({ width: _ });
        }),
        (y.height = function(_) {
          return this.withOptions({ height: _ });
        }),
        (y.focalPoint = function(_, W) {
          return this.withOptions({ focalPoint: { x: _, y: W } });
        }),
        (y.maxWidth = function(_) {
          return this.withOptions({ maxWidth: _ });
        }),
        (y.minWidth = function(_) {
          return this.withOptions({ minWidth: _ });
        }),
        (y.maxHeight = function(_) {
          return this.withOptions({ maxHeight: _ });
        }),
        (y.minHeight = function(_) {
          return this.withOptions({ minHeight: _ });
        }),
        (y.size = function(_, W) {
          return this.withOptions({ width: _, height: W });
        }),
        (y.blur = function(_) {
          return this.withOptions({ blur: _ });
        }),
        (y.sharpen = function(_) {
          return this.withOptions({ sharpen: _ });
        }),
        (y.rect = function(_, W, B, Y) {
          return this.withOptions({
            rect: { left: _, top: W, width: B, height: Y }
          });
        }),
        (y.format = function(_) {
          return this.withOptions({ format: _ });
        }),
        (y.invert = function(_) {
          return this.withOptions({ invert: _ });
        }),
        (y.orientation = function(_) {
          return this.withOptions({ orientation: _ });
        }),
        (y.quality = function(_) {
          return this.withOptions({ quality: _ });
        }),
        (y.forceDownload = function(_) {
          return this.withOptions({ download: _ });
        }),
        (y.flipHorizontal = function() {
          return this.withOptions({ flipHorizontal: !0 });
        }),
        (y.flipVertical = function() {
          return this.withOptions({ flipVertical: !0 });
        }),
        (y.ignoreImageParams = function() {
          return this.withOptions({ ignoreImageParams: !0 });
        }),
        (y.fit = function(_) {
          if (N.indexOf(_) === -1)
            throw new Error('Invalid fit mode "' + _ + '"');
          return this.withOptions({ fit: _ });
        }),
        (y.crop = function(_) {
          if (T.indexOf(_) === -1)
            throw new Error('Invalid crop mode "' + _ + '"');
          return this.withOptions({ crop: _ });
        }),
        (y.saturation = function(_) {
          return this.withOptions({ saturation: _ });
        }),
        (y.auto = function(_) {
          if (I.indexOf(_) === -1)
            throw new Error('Invalid auto mode "' + _ + '"');
          return this.withOptions({ auto: _ });
        }),
        (y.pad = function(_) {
          return this.withOptions({ pad: _ });
        }),
        (y.url = function() {
          return b(this.options);
        }),
        (y.toString = function() {
          return this.url();
        }),
        v
      );
    })();
    return G;
  });
})(ba);
var R2 = ba.exports;
const D2 = ya(R2);
function _o(e, t, n) {
  return e ? e * (1 - (t ?? 0) - (n ?? 0)) : void 0;
}
function M2({ asset: e, client: t, widths: n, crop: r, quality: i = 90 }) {
  const o = Array.from(n).sort((a, l) => a - l),
    s = D2(t)
      .image(e)
      .quality(i)
      .auto("format");
  return {
    src: s
      .width(o[0])
      .url()
      .toString(),
    srcset: o.map(a => `${s.width(a).url()} ${a}w`).join(","),
    placeholderSrc: e.metadata?.lqip,
    naturalWidth: _o(e.metadata?.dimensions?.width, r?.left, r?.right),
    naturalHeight: _o(e.metadata?.dimensions?.height, r?.top, r?.bottom)
  };
}
function T6(e) {
  return e
    .sort(([t], [n]) => n - t)
    .map(([t, n]) => `(min-width: ${t}px) ${n}`)
    .concat(["100vw"])
    .join(", ");
}
function wo({ naturalWidth: e, naturalHeight: t }) {
  return e && t ? `${e} / ${t}` : "auto";
}
const H2 = [400, 600, 900, 1200, 1800];
var F2 = S("<picture><style></style><!$><!/><img>", !0, !1, !1),
  U2 = S("<source>");
const zr = e => {
  let t;
  const [n, r] = L(!1),
    i = `picture-${Dt()}`,
    o = () => e.id ?? i;
  return (
    H(() => {
      t.complete && r(!0);
    }),
    (() => {
      var s = E(F2),
        a = s.firstChild,
        l = a.nextSibling,
        [f, u] = X(l.nextSibling),
        c = f.nextSibling;
      x(
        a,
        () =>
          `:where(#${o()}) { aspect-ratio: ${wo(e)}; } ${(e.sources ?? []).map(
            g =>
              `@media ${g.media} { :where(#${o()}) { aspect-ratio: ${wo(
                g
              )}; } }`
          )}`
      ),
        x(
          s,
          h(fe, {
            get each() {
              return e.sources;
            },
            children: g =>
              (() => {
                var m = E(U2);
                return Me(m, g, !1, !1), vt(), m;
              })()
          }),
          f,
          u
        ),
        c.addEventListener("load", g => r(!0, g));
      var d = t;
      return (
        typeof d == "function" ? ze(d, c) : (t = c),
        D(
          g => {
            var m = o(),
              p = q(B2.picture, e.class),
              b = e.classList,
              $ = F(e.style, { "--object-fit": e.objectFit ?? "cover" }),
              A = n() ? !0 : void 0,
              N = e.placeholderSrc ?? e.src,
              T = e.alt,
              I = e.srcset,
              z = e.sizes,
              re = e.loading ?? "lazy";
            return (
              m !== g.e && oe(s, "id", (g.e = m)),
              p !== g.t && M(s, (g.t = p)),
              (g.a = pt(s, b, g.a)),
              (g.o = It(s, $, g.o)),
              A !== g.i && oe(s, "data-loaded", (g.i = A)),
              N !== g.n && oe(c, "src", (g.n = N)),
              T !== g.s && oe(c, "alt", (g.s = T)),
              I !== g.h && oe(c, "srcset", (g.h = I)),
              z !== g.r && oe(c, "sizes", (g.r = z)),
              re !== g.d && oe(c, "loading", (g.d = re)),
              g
            );
          },
          {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0,
            h: void 0,
            r: void 0,
            d: void 0
          }
        ),
        s
      );
    })()
  );
};
function V(e) {
  for (
    var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1;
    r < t;
    r++
  )
    n[r - 1] = arguments[r];
  const i = e.length - 1;
  return e.slice(0, i).reduce((o, s, a) => o + s + n[a], "") + e[i];
}
var vr = encodeURIComponent,
  V2 = {}.hasOwnProperty,
  G2 = "api.sanity.io",
  j2 = "apicdn.sanity.io";
function Bt(e, t) {
  if (!(this instanceof Bt)) return new Bt(e);
  (this.clientConfig = e),
    (this.fetcher = t.fetch),
    (this.headers = t.headers || {});
}
[
  "clone",
  "create",
  "createIfNotExists",
  "createOrReplace",
  "delete",
  "listen",
  "mutate",
  "patch",
  "transaction"
].forEach(function(e) {
  Bt.prototype[e] = z2(e);
});
Bt.prototype.config = function(e) {
  return e
    ? ((this.clientConfig = Object.assign({}, this.clientConfig, e)), this)
    : this.clientConfig;
};
Bt.prototype.fetch = function(e, t) {
  var n = this.clientConfig,
    r = n.apiVersion ? "v".concat(n.apiVersion.replace(/^v/, "")) : "v1",
    i = Z2(e, t),
    o = i.length > 11264,
    s = n.token ? { Authorization: "Bearer ".concat(n.token) } : void 0,
    a = o ? { "content-type": "application/json" } : void 0,
    l = Object.assign({}, this.headers, s, a),
    f = n.useCdn ? j2 : G2,
    u = { headers: l, method: o ? "POST" : "GET" };
  o && (u.body = JSON.stringify({ query: e, params: t })),
    typeof window < "u" &&
      (u.credentials = n.withCredentials ? "include" : "omit");
  var c = "https://"
    .concat(n.projectId, ".")
    .concat(f, "/")
    .concat(r, "/data/query/")
    .concat(n.dataset);
  return this.fetcher("".concat(c).concat(o ? "" : i), u).then(q2);
};
function q2(e) {
  var t = e.headers.get("content-type") || "";
  if (!t.includes("json")) throw xo(e);
  return e.json().then(function(n) {
    if (e.status < 400) return n.result;
    throw xo(e, n);
  });
}
function xo(e, t) {
  var n = e.url,
    r = e.statusText;
  return (
    t &&
      t.error &&
      t.error.description &&
      ((n = t.error.description), (r = t.error.type || r)),
    new Error(
      "HTTP "
        .concat(e.status, " ")
        .concat(r, ": ")
        .concat(n)
    )
  );
}
function Z2(e, t) {
  var n = "?query=".concat(vr(e));
  if (!t) return n;
  for (var r in t)
    V2.call(t, r) &&
      (n += "&"
        .concat(vr("$".concat(r)), "=")
        .concat(vr(JSON.stringify(t[r]))));
  return n;
}
function z2(e) {
  return function() {
    throw new Error(
      'Method "'.concat(e, '" not implemented, use @sanity/client')
    );
  };
}
var W2 = Bt,
  X2 = W2,
  Q2 = function(e) {
    var t = function(r, i) {
      return fetch(r, i);
    };
    return new X2(e, { fetch: t });
  };
const K2 = ya(Q2),
  yr = {
    projectId: "29dvm6uk",
    dataset: {}.SANITY_STUDIO_DATASET || "production",
    apiVersion: "2022-12-01"
  },
  Ft = V`{
  en,
  zh
}`,
  Y2 = V`{
  _type,
  label ${Ft},
  href
}`,
  J2 = V`{
  _type,
  label ${Ft},
  action
}`,
  Wr = V`{
  _type == "link" => ${Y2},
  _type == "button" => ${J2}
}`,
  ef = V`{
  icon,
  href
}`,
  _a = V`{
  "name": _key,
  _type,
  label,
  required,
}`,
  wa = V`{
  "name": _key,
  _type,
  label,
  required,
}`,
  xa = V`{
  "name": _key,
  _type,
  label,
  required,
}`,
  Ea = V`{
  "name": _key,
  _type,
  label,
  required,
  inputType,
  min 
}`,
  tf = V`{
  "name": _key,
  _type,
  label,
  required
}`,
  Sa = V`{
  "name": _key,
  _type,
  label,
  required,
}`,
  nf = V`{
  _type,
  inputs[0..2] {
    _type == "dateInput" => ${_a},
    _type == "emailInput" => ${wa},
    _type == "phoneInput" => ${xa},
    _type == "textInput" => ${Ea},
    _type == "timeInput" => ${Sa},
    "name": ^._key + _key
  }
}`,
  rf = V`{
  "name": _key,
  _type,
  label,
  options,
}`,
  of = V`{
  "name": _key,
  _type,
  label,
  "options": *[_type == "location" 
    && (^.filterPartialBuyout != true || isPartialBuyoutAvailable == true) 
    && (^.filterFullBuyout != true || isFullBuyoutAvailable == true) 
  ] { "label": name.en, "value": _id, formSubmissionAddress, minPartialBuyout, maxPartialBuyout, minFullBuyout, maxFullBuyout},
}`,
  sf = V`{
  "name": _key,
  _type,
  label,
  "options": *[_type == "preFixePackages"] | order(name desc) { "label": name, "value": _id},
}`,
  Aa = V`{
  _id,
  title,
  useLocationSubmissionAddress,
  submissionAddress,
  inputs[]{
    _type == "dateInput" => ${_a},
    _type == "doubleInput" => ${nf},
    _type == "emailInput" => ${wa},
    _type == "selectInput" => ${rf},
    _type == "locationInput" => ${of},
    _type == "phoneInput" => ${xa},
    _type == "textAreaInput" => ${tf},
    _type == "textInput" => ${Ea},
    _type == "timeInput" => ${Sa},
    _type == "preFixePackagesInput" => ${sf}
  }
}`,
  Eo = V`{
  day,
  start,
  end
}`,
  $a = V`{
  name${Ft},
  venueId,
  formSubmissionAddress,
  backgroundColor,
  fillColor,
  notes,
  occupancyInfo,
  minPartialBuyout,
  maxPartialBuyout,
  minFullBuyout,
  maxFullBuyout,
  openHours[]${Eo},
  specialHours[]{
    title,
    hours[]${Eo}
  },
  venueImages[] { 
      alt, 
      ...asset->
  },
  showComingSoon
}`,
  So = V`{
  overlap,
  size,
  alignment
}`,
  Ao = V`{
  x,
  y,
}`,
  af = V`{
  image { alt, ...asset-> },
  borderColor,
  borderWidth,
  shape,
  verticalLayout ${So},
  horizontalLayout ${So},
  sticker {
    type,
    verticalLayout ${Ao},
    horizontalLayout ${Ao}
  }
}`,
  Ca = V`{
  title,
  source,
  date,
  href
}`,
  lf = V`{
  title ${Ft},
  type,
  location->{ name },
  body
}`,
  cf = V`{
  links[] ${Wr},
  dialogLinks[] ${Wr}
}`,
  uf = V`{
  links[] ${Wr},
  socialLinks[] ${ef},
  credits
}`,
  ff = V`{
  forms[]->${Aa}
}`,
  df = V`{
  forms[]->${Aa}
}`,
  hf = V`{
  locations[]->${$a}
}`,
  gf = V`{
  body
}`,
  mf = V`{
  "thumbnails": thumbnails[].asset->,
  pictures[] ${af}
}`;
V`{
  subtitles
}`;
const yi = V`{
  name,
  origin,
  description,
  price
}`,
  pf = V`{
  _type,
  title,
  options[]{
    title ${Ft},
    description
  }
}`,
  vf = V`{
  _type,
  title,
  items[]->${yi}
}`,
  yf = V`{
  _type,
  title,
  categories[]{
    title,
    items[]->${yi}
  }
}`,
  bf = V`{
  _type,
  title,
  subsections[]{
    _type == "menuComboSectionOptionsSubsection" => ${pf},
    _type == "menuComboSectionListSubsection" => ${vf},
    _type == "menuComboSectionCategoriesSubsection" => ${yf}
  },
  note {
    title,
    body
  }
}`,
  _f = V`{
  _type,
  title,
  items[]->${yi}
}`,
  wf = V`{
  title,
  "slug": slug.current
}`,
  xf = V`
  {
    title,
    "slug": slug.current,
    layout,
    backgroundColor,
    fillColor,
    sections[]{
      _type == "menuListSection" => ${_f},
      _type == "menuComboSection" => ${bf}
    }
  }
`;
V`{
  subtitles,
  menus[]->${wf},
  ingredientsIllustration {
    "landscape": landscape.asset->,
    "portrait": portrait.asset->,
    ingredients[] {
      name ${Ft},
      description,
      position { x, y }
    }
  },
  "menu": *[_type == "menu" && $slug == slug.current][0] ${xf}
}`;
V`{
  subtitles,
  intro,
  gallery[] { alt, ...asset-> },
  body,
  "pressArticles": *[_type == "pressArticle"] | order(date desc) [0...10] ${Ca},
  images {
    calligraphy {
      "landscape": landscape.asset->,
      "portrait": portrait.asset->
    },
    "decoration1": decoration1.asset->,
    "decoration2": decoration2.asset->,
    footer {
      "landscape": landscape.asset->,
      "portrait": portrait.asset->
    }
  }
}`;
V`{
  bookButton,
  bookingInfo {
    bookingInfoTitle,
    bookingInfoItems[] {
      title,
      body
    }
  },
  locations[]->${$a},
}`;
V`{
  subtitles,
  "posts": *[_type == "careersPost"] | order(_updatedAt desc) ${lf}
}`;
V`{
  subtitles,
  "articles": *[_type == "pressArticle"] | order(date desc) [$start...$end] ${Ca},
  "totalArticleCount": count(*[_type == "pressArticle"])
}`;
V`{
  body
}`;
V`{
  header ${cf},
  footer ${uf},
  inquireDialog ${ff},
  eventsDialog ${df},
  reserveDialog ${hf},
  newsletterDialog ${gf},
  galleryDialog ${mf},
}`;
const Ef = new K2({
  projectId: yr.projectId,
  dataset: yr.dataset,
  apiVersion: yr.apiVersion,
  useCdn: !0
});
V`*[_type == "site"] | order(_updatedAt desc) [0]`;
function Sf(e, t) {
  return M2({ asset: e, client: Ef, widths: H2, quality: t });
}
const Af = "_container_l5ne7_11",
  $f = "_child_l5ne7_16",
  Cf = "_withScaleAnimation_l5ne7_23",
  Tf = "_scale_l5ne7_1",
  Pf = "_isVisible_l5ne7_27",
  yn = {
    container: Af,
    child: $f,
    withScaleAnimation: Cf,
    scale: Tf,
    isVisible: Pf
  };
var Sn = (e, t, n) => {
    const r = n(e, t);
    return U(() => clearInterval(r));
  },
  Ta = (e, t, n) => {
    if (typeof t == "number") {
      Sn(e, t, n);
      return;
    }
    let r = !1,
      i = performance.now(),
      o = 0,
      s = !1;
    const a = () => {
      ne(e), (i = performance.now()), (r = n === setTimeout);
    };
    H(l => {
      if (r) return;
      const f = t();
      if (f === !1) return l && (o += (performance.now() - i) / l), f;
      if ((l === !1 && (i = performance.now()), s)) {
        if (
          (l && (o += (performance.now() - i) / l),
          (i = performance.now()),
          o >= 1)
        )
          (o = 0), a();
        else if (o > 0) {
          const [u, c] = L(void 0, { equals: !1 });
          return (
            u(),
            Sn(
              () => {
                (o = 0), (s = !1), c(), a();
              },
              (1 - o) * f,
              setTimeout
            ),
            f
          );
        }
      }
      return (s = !0), Sn(a, f, n), f;
    });
  };
function Pa(e, t, n, r) {
  const [i, o] = L(ne(e.bind(void 0, n)), r),
    s = () => o(e);
  return Ta(s, t, setInterval), Jt(s), i;
}
var Ia = (e, t) => Pa(n => n + 1, e, -1, t),
  $o = S("<div>");
function Oa(e) {
  const [t, n] = le(e, [
      "interval",
      "duration",
      "count",
      "children",
      "class",
      "style"
    ]),
    r = mt(() => t.children),
    i = k(() => r.toArray()),
    o = Ia(t.interval),
    s = () => e.count ?? o(),
    a = () => i().length;
  return (() => {
    var l = E($o);
    return (
      Me(
        l,
        F(n, {
          get class() {
            return q(yn.container, t.class);
          },
          get style() {
            return F(t.style, {
              "--duration": `${t.duration}ms`,
              "--scaleDuration": `${t.duration + t.interval}ms`
            });
          }
        }),
        !1,
        !0
      ),
      x(
        l,
        h(fe, {
          get each() {
            return i();
          },
          children: (f, u) =>
            h(oi, {
              get on() {
                return k(() => (e.scale ? Math.floor((s() - u()) / a()) : !1));
              },
              get children() {
                var c = E($o);
                return (
                  x(c, f),
                  D(
                    d => {
                      var g = yn.child,
                        m = {
                          [yn.withScaleAnimation]: e.scale,
                          [yn.isVisible]: u() === s() % a()
                        };
                      return (
                        g !== d.e && M(c, (d.e = g)), (d.t = pt(c, m, d.t)), d
                      );
                    },
                    { e: void 0, t: void 0 }
                  ),
                  c
                );
              }
            })
        })
      ),
      vt(),
      l
    );
  })();
}
function La(e) {
  const [t, n] = le(e, ["class", "children"]),
    r = ie(Qe);
  return h(
    T2,
    F(n, {
      get class() {
        return q(ce.borderButton, pr.button, t.class);
      },
      "aria-label": "Gallery",
      get children() {
        return [
          h(Q, {
            get when() {
              return r();
            },
            get children() {
              return h(Oa, {
                get class() {
                  return pr.crossfade;
                },
                interval: 3e3,
                duration: 2e3,
                scale: !0,
                get children() {
                  return h(fe, {
                    get each() {
                      return r().galleryDialog.thumbnails;
                    },
                    children: i =>
                      h(
                        zr,
                        F(() => Sf(i), {
                          get class() {
                            return pr.picture;
                          },
                          sizes: "130px",
                          alt: ""
                        })
                      )
                  });
                }
              });
            }
          }),
          k(() => t.children)
        ];
      }
    })
  );
}
const If = "_grid_3njni_13",
  Of = "_gridMaxWidth_3njni_21",
  Lf = "_insetGridColumn_3njni_29",
  kf = "_narrowGridColumn_3njni_29",
  Fe = {
    grid: If,
    gridMaxWidth: Of,
    insetGridColumn: Lf,
    narrowGridColumn: kf
  },
  Bf = "_sans_z7hcl_1",
  Nf = "_sansCaps_z7hcl_2",
  Rf = "_sansTitle_z7hcl_3",
  Df = "_sansSmallTitle_z7hcl_4",
  Mf = "_sansDisplay_z7hcl_5",
  Hf = "_body_z7hcl_6",
  Ff = "_sansSmall_z7hcl_4",
  Uf = "_sansNav_z7hcl_39",
  Vf = "_serif_z7hcl_70",
  Gf = "_serifTitle_z7hcl_71",
  jf = "_serifDisplay_z7hcl_72",
  pe = {
    sans: Bf,
    sansCaps: Nf,
    sansTitle: Rf,
    sansSmallTitle: Df,
    sansDisplay: Mf,
    body: Hf,
    sansSmall: Ff,
    sansNav: Uf,
    serif: Vf,
    serifTitle: Gf,
    serifDisplay: jf
  },
  qf = "_footer_lrdti_1",
  Zf = "_small_lrdti_22",
  zf = "_links_lrdti_29",
  Wf = "_link_lrdti_29",
  Xf = "_socialLinks_lrdti_55",
  Qf = "_credits_lrdti_61",
  Kf = "_marquee_lrdti_79",
  ot = {
    footer: qf,
    small: Zf,
    links: zf,
    link: Wf,
    socialLinks: Xf,
    credits: Qf,
    marquee: Kf
  };
function bi(e) {
  return e?.en ?? e?.zh ? e : !1;
}
function Nt(e) {
  return [
    h(Q, {
      get when() {
        return e.en;
      },
      get children() {
        return h(we, {
          get component() {
            return e.component ?? "span";
          },
          get children() {
            return e.en;
          }
        });
      }
    }),
    h(Q, {
      get when() {
        return e.zh;
      },
      get children() {
        return h(we, {
          get component() {
            return e.component ?? "span";
          },
          lang: "zh",
          get children() {
            return " " + e.zh;
          }
        });
      }
    })
  ];
}
const Yf = Ae(() =>
  $e(() => import("./FormDialogContent-d67fb82f.js"), [
    "assets/FormDialogContent-d67fb82f.js",
    "assets/gesture-e9dbab06.js",
    "assets/popper-root-df9f2398.js",
    "assets/FormDialogContent-17d246d4.css"
  ])
);
function _i(e) {
  const [t, n, r] = le(
      e,
      ["onOpenChange"],
      [
        "textColor",
        "fillColor",
        "titleChildren",
        "bodyChildren",
        "forms",
        "inputs",
        "component",
        "pending",
        "error",
        "result",
        "center"
      ]
    ),
    i = si("(max-width: 700px)");
  return h(oi, {
    get on() {
      return i();
    },
    get children() {
      return h(
        cn,
        F(
          {
            get open() {
              return e.isOpen;
            },
            get modal() {
              return i();
            }
          },
          t,
          {
            get children() {
              return [
                h(
                  Jn,
                  F(r, {
                    get class() {
                      return q(r.class, ce.focusVisible);
                    }
                  })
                ),
                h(ln, {
                  get children() {
                    return h(ei, {
                      get fallback() {
                        return h(vi, {});
                      },
                      get children() {
                        return h(Yf, n);
                      }
                    });
                  }
                })
              ];
            }
          }
        )
      );
    }
  });
}
function Jf(e) {
  const [t, n] = L(),
    r = e?.throw
      ? (d, g) => {
          throw (n(d instanceof Error ? d : new Error(g)), d);
        }
      : (d, g) => {
          n(d instanceof Error ? d : new Error(g));
        },
    i = e?.api
      ? Array.isArray(e.api)
        ? e.api
        : [e.api]
      : [globalThis.localStorage].filter(Boolean),
    o = e?.prefix ? `${e.prefix}.` : "",
    s = new Map(),
    a = new Proxy(
      {},
      {
        get(d, g) {
          let m = s.get(g);
          m || ((m = L(void 0, { equals: !1 })), s.set(g, m)), m[0]();
          const p = i.reduce((b, $) => {
            if (b !== null || !$) return b;
            try {
              return $.getItem(`${o}${g}`);
            } catch (A) {
              return r(A, `Error reading ${o}${g} from ${$.name}`), null;
            }
          }, null);
          return p !== null && e?.deserializer
            ? e.deserializer(p, g, e.options)
            : p;
        }
      }
    ),
    l = (d, g, m) => {
      const p = e?.serializer ? e.serializer(g, d, m ?? e.options) : g,
        b = `${o}${d}`;
      i.forEach(A => {
        try {
          A.getItem(b) !== p && A.setItem(b, p);
        } catch (N) {
          r(N, `Error setting ${o}${d} to ${p} in ${A.name}`);
        }
      });
      const $ = s.get(d);
      $ && $[1]();
    },
    f = d =>
      i.forEach(g => {
        try {
          g.removeItem(`${o}${d}`);
        } catch (m) {
          r(m, `Error removing ${o}${d} from ${g.name}`);
        }
      }),
    u = () =>
      i.forEach(d => {
        try {
          d.clear();
        } catch (g) {
          r(g, `Error clearing ${d.name}`);
        }
      }),
    c = () => {
      const d = {},
        g = (m, p) => {
          if (!d.hasOwnProperty(m)) {
            const b =
              p && e?.deserializer ? e.deserializer(p, m, e.options) : p;
            b && (d[m] = b);
          }
        };
      return (
        i.forEach(m => {
          if (typeof m.getAll == "function") {
            let p;
            try {
              p = m.getAll();
            } catch (b) {
              r(b, `Error getting all values from in ${m.name}`);
            }
            for (const b of p) g(b, p[b]);
          } else {
            let p = 0,
              b;
            try {
              for (; (b = m.key(p++)); )
                d.hasOwnProperty(b) || g(b, m.getItem(b));
            } catch ($) {
              r($, `Error getting all values from ${m.name}`);
            }
          }
        }),
        d
      );
    };
  return (
    e?.sync !== !1 &&
      Be(() => {
        const d = g => {
          let m = !1;
          i.forEach(p => {
            try {
              p !== g.storageArea &&
                g.key &&
                g.newValue !== p.getItem(g.key) &&
                (g.newValue
                  ? p.setItem(g.key, g.newValue)
                  : p.removeItem(g.key),
                (m = !0));
            } catch (b) {
              r(
                b,
                `Error synching api ${p.name} from storage event (${g.key}=${g.newValue})`
              );
            }
          }),
            m && g.key && s.get(g.key)?.[1]();
        };
        "addEventListener" in globalThis
          ? (globalThis.addEventListener("storage", d),
            U(() => globalThis.removeEventListener("storage", d)))
          : (i.forEach(g => g.addEventListener?.("storage", d)),
            U(() => i.forEach(g => g.removeEventListener?.("storage", d))));
      }),
    [a, l, { clear: u, error: t, remove: f, toJSON: c }]
  );
}
var ed = e => (
    typeof e.clear == "function" ||
      (e.clear = () => {
        let t;
        for (; (t = e.key(0)); ) e.removeItem(t);
      }),
    e
  ),
  Co = e => {
    if (!e) return "";
    let t = "";
    for (const n in e) {
      if (!e.hasOwnProperty(n)) continue;
      const r = e[n];
      t +=
        r instanceof Date
          ? `; ${n}=${r.toUTCString()}`
          : typeof r == "boolean"
          ? `; ${n}`
          : `; ${n}=${r}`;
    }
    return t;
  },
  Pe = ed({
    _cookies: [globalThis.document, "cookie"],
    getItem: e =>
      Pe._cookies[0][Pe._cookies[1]]
        .match("(^|;)\\s*" + e + "\\s*=\\s*([^;]+)")
        ?.pop() ?? null,
    setItem: (e, t, n) => {
      const r = Pe.getItem(e);
      Pe._cookies[0][Pe._cookies[1]] = `${e}=${t}${Co(n)}`;
      const i = Object.assign(new Event("storage"), {
        key: e,
        oldValue: r,
        newValue: t,
        url: globalThis.document.URL,
        storageArea: Pe
      });
      window.dispatchEvent(i);
    },
    removeItem: e => {
      Pe._cookies[0][Pe._cookies[1]] = `${e}=deleted${Co({
        expires: new Date(0)
      })}`;
    },
    key: e => {
      let t = null,
        n = 0;
      return (
        Pe._cookies[0][Pe._cookies[1]].replace(
          /(?:^|;)\s*(.+?)\s*=\s*[^;]+/g,
          (r, i) => (!t && i && n++ === e && (t = i), "")
        ),
        t
      );
    },
    get length() {
      let e = 0;
      return (
        Pe._cookies[0][Pe._cookies[1]].replace(
          /(?:^|;)\s*.+?\s*=\s*[^;]+/g,
          t => ((e += t ? 1 : 0), "")
        ),
        e
      );
    }
  });
const td = "mala-project",
  To = "isMuted",
  Po = "inquiryCount",
  Io = "isHeaderDialogRouteChange",
  Oo = "menuNavScrollPos",
  _t = an(() => {
    const [e, t] = Jf({ prefix: td });
    return {
      isMuted() {
        return e[To] === "true";
      },
      setIsMuted(n) {
        t(To, String(n));
      },
      inquiryCount() {
        const n = Number.parseInt(e[Po]);
        return Number.isNaN(n) ? 13978 : n;
      },
      setInquiryCount(n) {
        t(Po, String(n));
      },
      isHeaderDialogRouteChange() {
        return e[Io] === "false";
      },
      setHeaderDialogRouteChange(n) {
        t(Io, String(n));
      },
      menuNavScrollPos() {
        const n = Number.parseInt(e[Oo]);
        return Number.isNaN(n) ? 0 : n;
      },
      setMenuNavScrollPos(n) {
        t(Oo, String(n));
      }
    };
  });
var nd = S(
  '<svg viewBox="0 0 31 21"xmlns=http://www.w3.org/2000/svg><path fill=currentColor d="m25.7808.5c-2.856 0-5.1792 2.66075-5.1792 5.93084 0 3.27008 2.3232 5.93156 5.1792 5.93156 2.8561 0 5.1793-2.66074 5.1793-5.93156 0-3.27083-2.3232-5.93084-5.1793-5.93084zm0 10.7335c-1.5824 0-2.5268-1.79531-2.5268-4.80266 0-3.00736.9444-4.80197 2.5268-4.80197 1.5581 0 2.5268 1.83989 2.5268 4.80197 0 2.96207-.9687 4.80266-2.5268 4.80266z"></path><path fill=currentColor d="m.912084 20.2326h.111716c.8011-.1128 1.76978-.1959 2.62747-.2234.8577.0275 1.82638.1106 2.62895.2234.38733.0557.66367-.2234.66367-.5596 0-.3622-.24842-.5299-.52623-.6428l-2.01893-.7533v-13.57981h.02719l10.65248 15.08871c.1661.2234.4153.334.6365.334.3307 0 .6365-.2234.6365-.6702v-16.9865l2.0204-.75481c.2763-.11059.5247-.27906.5247-.64274 0-.306522-.2212-.557382-.5541-.557382h-.1095c-.8026.110586-1.772.193711-2.629.223399-.8577-.029688-1.8249-.112813-2.6275-.223399-.3873-.057149-.6636.223399-.6636.557382 0 .36368.2484.53141.5247.64274l2.0204.75481v11.9017h-.0272l-9.46403-13.383115c-.16463-.25086-.35866-.391134-.66367-.391134-.08231 0-.1661 0-.24842.027461-.49756.083125-.94148.112813-1.35673.112813-.77391 0-1.49417-.08461-2.406989-.167735-.414517-.028203-.690861.25086-.690861.55738 0 .2234.137437.47649.52476.64274l2.38053.95075v15.56294l-2.0204.7533c-.276344.1129-.52623.2806-.52623.6428 0 .308.221222.5596.554159.5596"></path><path fill=currentColor d="m25.7798 20.28c1.1385 0 2.0616-.9315 2.0616-2.0818 0-1.1504-.9224-2.0804-2.0616-2.0804s-2.0601.9314-2.0601 2.0804c0 1.1489.9209 2.0818 2.0601 2.0818z">'
);
function ka() {
  return (() => {
    var e = E(nd);
    return (
      e.style.setProperty("height", "0.75em"),
      e.style.setProperty("margin-bottom", "-0.06em"),
      e.style.setProperty("display", "inline"),
      e
    );
  })();
}
var rd = S("<span>Inquiry"),
  id = S("<span><!$><!/> <!$><!/>");
const od = Mt(),
  sd = se.createFetcher("/_m/3a1f0d262f/action", !0);
function ad(e) {
  const t = ie(Qe),
    [n, r] = od(),
    { inquiryCount: i, setInquiryCount: o } = _t();
  H(
    De(n, () => {
      n() && o(i() + 1);
    })
  );
  const s = () => t()?.inquireDialog?.forms ?? [],
    [a, { Form: l }] = ri(sd, { invalidate: [] });
  return (
    H(() => {
      n() && a.clear();
    }),
    h(
      _i,
      F(e, {
        get titleChildren() {
          return [
            E(rd),
            (() => {
              var f = E(id),
                u = f.firstChild,
                [c, d] = X(u.nextSibling),
                g = c.nextSibling,
                m = g.nextSibling,
                [p, b] = X(m.nextSibling);
              return x(f, h(ka, {}), c, d), x(f, i, p, b), f;
            })()
          ];
        },
        textColor: "var(--color-purple)",
        fillColor: "var(--color-palePurple)",
        get forms() {
          return s();
        },
        get isOpen() {
          return n();
        },
        onOpenChange: r,
        component: l,
        get pending() {
          return a.pending;
        },
        get error() {
          return a.error;
        },
        get result() {
          return a.result;
        }
      })
    )
  );
}
var ld = S("<span>Inquiry"),
  cd = S("<span><!$><!/> <!$><!/>");
const ud = Mt(),
  fd = se.createFetcher("/_m/b7205f45d7/action", !0);
function dd(e) {
  const t = ie(Qe),
    [n, r] = ud(),
    { inquiryCount: i, setInquiryCount: o } = _t();
  H(
    De(n, () => {
      n() && o(i() + 1);
    })
  );
  const s = () => t()?.eventsDialog?.forms ?? [],
    [a, { Form: l }] = ri(fd, { invalidate: [] });
  return (
    H(() => {
      n() && a.clear();
    }),
    h(
      _i,
      F(e, {
        get titleChildren() {
          return [
            E(ld),
            (() => {
              var f = E(cd),
                u = f.firstChild,
                [c, d] = X(u.nextSibling),
                g = c.nextSibling,
                m = g.nextSibling,
                [p, b] = X(m.nextSibling);
              return x(f, h(ka, {}), c, d), x(f, i, p, b), f;
            })()
          ];
        },
        textColor: "var(--color-purple)",
        fillColor: "var(--color-palePurple)",
        get forms() {
          return s();
        },
        get isOpen() {
          return n();
        },
        onOpenChange: r,
        component: l,
        get pending() {
          return a.pending;
        },
        get error() {
          return a.error;
        },
        get result() {
          return a.result;
        }
      })
    )
  );
}
const hd = "_dialogContainer_e0vxu_1",
  gd = "_dialog_e0vxu_1",
  md = "_header_e0vxu_14",
  pd = "_description_e0vxu_23",
  vd = "_locationsContainer_e0vxu_29",
  yd = "_locations_e0vxu_29",
  bd = "_smallX_e0vxu_50",
  _d = "_largeX_e0vxu_59",
  Ke = {
    dialogContainer: hd,
    dialog: gd,
    header: md,
    description: pd,
    locationsContainer: vd,
    locations: yd,
    smallX: bd,
    largeX: _d
  },
  wd = "_largeX_1m87u_1",
  xd = { largeX: wd };
var Ed = S(
  '<svg viewBox="0 0 87 87"fill=none xmlns=http://www.w3.org/2000/svg><path d="m2 2 83 83M2 85 85 2"stroke=currentColor stroke-width=4 vector-effect=non-scaling-stroke>'
);
function Sd(e) {
  return (() => {
    var t = E(Ed);
    return D(() => oe(t, "class", q(xd.largeX, e.class))), t;
  })();
}
const Ad = "_card_1yvq0_1",
  $d = "_wide_1yvq0_21",
  Cd = "_disabled_1yvq0_30",
  Td = "_comingSoonContainer_1yvq0_45",
  Pd = "_marquee_1yvq0_52",
  Id = "_titleContainer_1yvq0_76",
  Od = "_title_1yvq0_76",
  Ld = "_indicator_1yvq0_98",
  kd = "_closed_1yvq0_108",
  Bd = "_notes_1yvq0_112",
  Nd = "_sectionGroup_1yvq0_119",
  Rd = "_section_1yvq0_119",
  Dd = "_sectionTitle_1yvq0_130",
  Md = "_table_1yvq0_134",
  Hd = "_dialogContent_1yvq0_149",
  Fd = "_dialogOverlay_1yvq0_159",
  Ud = "_dialogPane_1yvq0_165",
  ge = {
    card: Ad,
    wide: $d,
    disabled: Cd,
    comingSoonContainer: Td,
    marquee: Pd,
    titleContainer: Id,
    title: Od,
    indicator: Ld,
    closed: kd,
    notes: Bd,
    sectionGroup: Nd,
    section: Rd,
    sectionTitle: Dd,
    table: Md,
    dialogContent: Hd,
    dialogOverlay: Fd,
    dialogPane: Ud
  },
  Vd = "_wrapper_pnta3_21",
  Gd = "_withMask_pnta3_28",
  jd = "_content_pnta3_40",
  qd = "_intro_pnta3_1",
  Zd = "_marquee_pnta3_1",
  zd = "_pauseOnHover_pnta3_50",
  jt = {
    wrapper: Vd,
    withMask: Gd,
    content: jd,
    intro: qd,
    marquee: Zd,
    pauseOnHover: zd
  };
var Wd = { width: 0, height: 0 };
function Lo() {
  return { width: window.innerWidth, height: window.innerHeight };
}
function P6() {
  const [e, t] = n1(Wd, Lo);
  return ii(window, "resize", () => t(Lo())), e;
}
var Ba = { width: null, height: null };
function Xd(e) {
  if (!e) return { ...Ba };
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Xr(e) {
  const [t, n] = Br(C.context ? Ba : Xd(j(e))),
    r = new ResizeObserver(([i]) => {
      const { width: o, height: s } = i.contentRect;
      n({ width: o, height: s });
    });
  return (
    U(() => r.disconnect()),
    H(() => {
      const i = j(e);
      i && (r.observe(i), U(() => r.unobserve(i)));
    }),
    t
  );
}
var Qd = S("<div><div></div><div>");
function Qr(e) {
  const [t, n] = le(e, ["class", "style", "children"]),
    [r, i] = L(),
    [o, s] = L();
  Xr(r);
  const a = Xr(o),
    l = e.fast ? 100 : 60;
  return h(oi, {
    on: () => a.width,
    get children() {
      var f = E(Qd),
        u = f.firstChild,
        c = u.nextSibling;
      return (
        ze(i, f),
        Me(
          f,
          F(n, {
            get class() {
              return q(jt.wrapper, t.class);
            },
            get classList() {
              return {
                [jt.withMask]: e.withMask,
                [jt.pauseOnHover]: e.pauseOnHover
              };
            },
            get style() {
              return {
                "--introDuration": "0s",
                "--marqueeDuration": `${(a.width ?? 1) / l}s`
              };
            }
          }),
          !1,
          !0
        ),
        ze(s, u),
        x(u, () => t.children),
        x(c, () => t.children),
        D(
          d => {
            var g = jt.content,
              m = q(jt.content, "clone");
            return (
              g !== d.e && M(u, (d.e = g)), m !== d.t && M(c, (d.t = m)), d
            );
          },
          { e: void 0, t: void 0 }
        ),
        vt(),
        f
      );
    }
  });
}
var Kd = S(
  '<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 683 165.475"><path d="M31.338 92.021c1.987 1.133 3.8 1.132 5.862-.326 4.473-3.563 9.808-8.421 15.841-14.574-.322 1.133-.689 2.428-.984 4.047-.276.971-.478 2.266-.846 3.561-2.236 10.198-5.829 21.691-10.733 34.319-.873 3.076.315 4.694 3.448 4.693 1.649 0 3.27-.487 4.773-1.135 1.805-1.134 2.832-2.429 3.246-3.886.965-3.4 1.885-6.638 2.685-10.037l14.177-.006c-.827 2.914-1.379 4.856-1.865 5.99-.662 2.913.316 4.693 3.118 4.693 1.319-.001 2.94-.488 4.37-1.459 1.594-.972 2.621-2.267 3.246-3.886 2.677-11.169 5.086-20.235 7.016-27.034.441-.971.789-1.619.881-1.942 0 0 .376-.162 1.173-.648 2.208-.81 4.059-2.106 4.921-3.402 1.284-1.619 1.295-3.4.106-5.018-1.619-2.427-3.421-4.206-5.545-4.853-1.775-1.294-3.681-.969-5.67.812-1.568 1.458-2.411 2.105-2.622 2.267-.422.324-1.292.486-2.611.487l-9.232.004c-1.386-1.052-3.661-2.526-6.744-4.156 1.15-1.255 2.456-2.748 3.904-4.421.936-.971 1.917-2.105 2.898-3.238l37.706.146c.988 0 1.153 0 1.272.161.12.162.074.324-.156 1.133-3.604 13.274-6.784 23.311-9.116 29.786-4.344 11.818-9.016 20.722-13.94 27.037-5.3 6.476-10.084 9.393-15.102 9.07-5.23-.159-11.411-1.614-18.139-4.039-2.052-.323-4.068.973-5.325 3.078-1.303 2.266-.984 4.047.554 5.017 8.899 2.91 13.247 5.012 13.822 6.468.457 1.295 1.757 1.943 3.57 1.942 1.505-.065 2.982-.231 4.436-.484-1.375.878-2.058 2.442-1.747 4.368.392 2.104 1.389 3.237 3.578 3.074 26.345-4.543 49.18-15.883 68.221-34.181 4.831 13.755 13.494 23.302 25.285 28.801 1.135.647 2.738.808 4.405.16 4.765-2.269 9.538-3.404 14.483-3.406.825 0 1.951-.486 2.722-1.458.724-.809 1.448-1.618 1.843-2.428.349-.648.414-1.457.432-2.105-.054-.971-.74-1.457-1.564-1.456-18.515-3.876-30.924-13.584-37.695-28.634 10.976-13.115 20.105-27.848 27.1-44.361l.533-1.295c2.565-.325 4.489-1.297 5.562-2.754.913-1.223.949-2.439.131-3.399l12.539-.005c3.838-.163 6.514-1.459 7.249-4.05.414-1.456.26-3.237-.224-5.017-1.461-3.56-3.932-6.473-7.244-8.738-2.106-1.293-4.249-1.292-6.687.327-2.997 2.429-6.086 5.182-8.892 8.097-.678.648-1.429.971-3.243.973l-25.717.01c5.687-8.419 11.254-17 16.822-25.581 1.212-1.943 2.055-2.59 2.925-2.753 3.481-.649 5.827-1.945 6.9-3.402 1.376-1.942.727-3.724-1.945-5.341-2.343-1.617-6.143-2.748-10.621-3.233-1.227-.323-2.189.163-2.611.487-.422.324-.935.971-1.468 2.267-1.313 4.047-2.819 7.608-4.379 10.199-5.836 10.685-11.211 19.751-16.174 27.361-7.515 11.402-15.285 21.676-23.526 30.726.467-1.646.928-3.302 1.379-4.981.479-2.266.873-3.076 1.038-3.076.257-.323 1.054-.81 3.309-1.782 3.005-1.296 5.443-2.916 6.113-4.697.67-1.78.068-3.723-1.642-5.826-1.922-1.942-3.862-3.235-5.61-4.044-2.225-1.456-4.67-.969-7.127 1.297-.422.324-.889.81-1.311 1.134-.375.162-.632.486-.843.648-.257.324-.751.324-1.576.324l-33.254-.148.56-.81c.771-.971 1.238-1.457 1.66-1.781.421-.324.797-.486 1.411-.325 2.921.16 5.083-.488 6.202-2.107 1.284-1.619.846-3.561-1.404-5.503-.475-.464-1.062-.864-1.682-1.241.224-.11.444-.232.658-.377 1.806-1.134 2.833-2.429 3.174-4.21.351-1.235.664-2.36.904-3.561l13.625-.006c-.91 3.204-1.863 6.527-2.922 9.713-.709 3.075.434 4.855 3.191 5.016 1.319 0 2.94-.487 4.443-1.135 1.595-.972 2.668-2.429 3.174-4.209l2.203-9.389 23.378-.009c3.178-.163 5.313-1.297 5.864-3.24.441-.971.552-1.943.333-2.914-1.021-4.531-2.694-7.93-5.063-10.033-1.875-2.104-4.421-2.426-6.878-.159-2.108 1.62-4.025 3.724-6.244 6.315-.724.81-1.146 1.134-1.897 1.458v-.003c-.376.162-1.081.325-2.235.325l-5.111.002 2.666-9.389c.368-1.296.835-1.781 1.962-2.267 2.96-1.134 5.351-2.592 6.114-4.697.46-1.619-.702-2.751-3.678-3.883-2.288-.647-5.118-1.131-8.204-1.291-2.263-.162-3.509.163-4.398.973-.724.81-.927 2.105-.892 3.723.035 1.618-.16 4.047-.96 7.446-.76 3.23-1.628 6.313-2.502 9.389l-13.847.005.689-2.428c1.103-3.885 1.701-5.99 2.095-6.799.46-1.619.881-1.942 1.844-2.428 3.078-.972 5.233-2.754 5.922-5.182.203-1.295-.913-2.589-3.651-3.397-2.289-.647-5.119-1.131-8.205-1.291-1.932-.161-3.343.163-4.114 1.135-.724.81-1.046 1.943-1.011 3.561.043 2.752-.243 5.504-.979 8.094l-2.39 8.418c-6.337-.321-13.407-.965-21.328-2.095-2.381-.323-3.591 1.62-2.46 5.18 1.04 3.884 2.989 6.312 5.186 7.282.613.162 1.108.161 1.438.161l14.424-1.462c-.327 1.135-.651 2.189-1.082 3.238l-.322 1.133.613.162c-2.124-.646-4.048.326-4.903 2.754-1.762 3.885-2.901 6.152-3.46 6.961-8.998 13.114-20.331 25.745-34.21 38.052-1.613 1.619-1.46 3.4.435 4.856Zm112.086-38.892 19.948-.008c-.755 3.238-1.628 6.313-2.904 9.066-5.003 11.818-11.169 22.503-18.002 32.056-2.818-12.139-2.419-25.735.958-41.114Zm-32.738 29.236c.102.079.189.164.306.237 1.656 1.132 3.607.646 5.807-1.297 6.053-5.613 11.559-11.808 16.769-18.382-2.953 15.67-3.01 29.837-.537 42.492-16.679 17.977-37.268 29.824-61.674 35.284 7.239-2.615 13.784-7.785 19.633-15.52 4.622-5.829 9.154-14.248 13.296-24.77 2.299-5.562 4.421-11.629 6.4-18.044Zm-49.393 2.847c.487-1.133.955-1.619 2.292-2.267l10.716-.005c1.814-.001 1.933.161 1.703.971l-4.688 16.512-14.507.006c2.666-9.389 4.09-14.407 4.485-15.217ZM291.798 134.322c-2.657.649-7.676.327-15.596-.803-1.722-.323-3.289 1.135-4.473 3.563-1.184 2.429-.49 4.047.856 4.532 1.722.323 3.278.646 4.835.97 3.7.321 5.897 1.291 6.591 2.91.667 1.133 2.178 1.618 4.294 1.131 10.187-1.622 16.603-6.805 18.92-15.546 5.472-22.177 9.279-36.747 11.42-43.707.808-2.267 1.34-3.562 1.597-3.885.046-.163.422-.324 1.457-.487 4.252-1.62 6.57-3.401 6.581-5.182.341-1.782-.848-3.4-2.742-4.856-2.37-2.102-4.31-3.397-5.491-3.881-2.005-.485-4.121.001-6.156 1.944-.798.487-1.641 1.134-2.109 1.62-.724.81-1.64 1.134-3.288 1.134l-28.026.012c-4.329-2.75-7.78-4.529-10.444-5.014-1.392-.323-2.454-.646-3.297.002-.633.486-.863 1.296-1.092 2.105-.961 7.446-3.591 18.454-7.847 32.861-4.623 15.702-9.17 28.815-13.944 39.824-1.129 3.399-.078 5.503 2.843 5.664 1.768.161 3.838-.164 5.597-1.136 2.253-.973 3.583-2.754 4.3-4.696l7.261-25.577 36.269-.015c-1.517 5.342-2.62 9.227-3.428 11.493-1.039 3.076-2.277 4.534-4.887 5.02Zm-18.201-49.683c.276-.972.955-1.62 2.622-2.268l.211-.162 31.487-.012c1.649 0 1.933.16 1.611 1.294-.617 2.752-1.352 5.341-2.133 8.094l-35.938.015c.67-1.781 1.314-4.047 2.141-6.961Zm-7.269 24.444c.992-2.914 1.82-5.828 2.647-8.741l35.938-.016c-.432 2.105-1.259 5.019-2.316 8.742l-36.269.015ZM271.359 34.463c.284.161.943.161 1.108.161h.165c9.105-1.299 17.037-1.95 24.291-1.952h3.792c-.433 2.103-1.26 5.016-2.271 8.578h-2.473c-6.924.004-15.312-.64-25.495-1.931-2.922-.161-4.581 1.621-3.496 5.343 1.198 2.751 2.579 4.855 4.776 5.825.449.161 1.062.323 1.767.161 5.762-1.135 12.494-1.623 20.242-1.627h2.473l-2.298 8.093-6.594.003c-13.307-.156-25.442-.961-36.733-2.413-3.086-.161-4.956 1.782-3.587 5.666.894 3.236 2.677 5.664 5.159 6.796.449.161 1.227.323 1.932.161 9.884-1.137 20.288-1.789 30.885-1.955l63.634-.026c3.672-.163 6.137-1.298 6.707-3.888.184-.648.296-1.619.315-2.267-1.589-4.855-3.591-8.253-6.337-10.195-2.132-1.779-4.724-1.94-6.924.003-2.648 1.782-5.224 3.887-8.103 6.479-1.311 1.133-2.768 1.619-5.076 1.62l-24.728.01c.708-3.076 1.325-5.828 1.968-8.094l28.521-.012c3.507-.163 5.597-1.135 6.432-2.916.44-.971.643-2.266.232-3.723-1.626-3.56-3.528-6.149-5.752-7.605-1.94-1.295-4.321-1.617-6.594.003-2.108 1.62-4.052 3.239-5.83 4.858-.843.647-1.43.971-2.016 1.295-.706.162-1.576.325-2.73.325l-10.056.004 2.436-8.579 33.465-.014c3.508-.163 5.597-1.136 6.479-3.078.44-.971.597-2.104.214-3.076-1.489-4.046-3.703-7.282-6.329-9.062-2.462-1.779-4.888-1.941-7.418.003-1.43.972-3.868 2.591-6.747 5.182-1.521 1.296-1.778 1.619-1.778 1.619-.587.324-1.292.486-2.775.487l-12.859.005c.624-1.619 1.084-3.238 1.498-4.695.551-1.942 1.268-3.885 1.865-5.989.276-.972.743-1.457 1.989-1.782 3.783-1.135 5.562-2.754 5.903-4.534.129-1.619-.748-2.59-2.543-3.236-2.527-.97-6.63-1.616-11.859-1.776-1.153 0-2.116.487-2.373.81-.375.162-1.027 1.296-1.275 2.753-.306 3.399-.804 6.313-1.375 8.903-.846 3.561-1.6 6.799-2.381 9.551h-3.627c-10.716.006-20.377-.8-29.69-2.253-2.922-.16-4.911 1.621-3.422 5.667 1.224 3.237 3.053 5.502 5.296 6.311ZM197.691 67.514c.711 3.883 2.026 6.797 4.507 7.93.732.323 1.511.485 2.216.322 3.408-.972 6.678-1.459 10.47-1.461l6.759-.003c1.648 0 1.959.647 1.361 2.751-5.285 18.616-9.173 31.729-11.498 39.337-.69 2.429-1.973 4.048-4.649 5.344-1.265.971-4.014 1.943-8.292 3.078-.705.163-1.337.648-1.548.81-.843.648-.79 1.619-.571 2.59h.001c.538 2.752 1.899 5.503 3.802 8.092 1.902 2.589 3.532 3.236 5.245 2.426 1.127-.487 2.154-1.781 3.365-3.725.954-1.619 1.211-1.942 1.046-1.942 20.462-10.529 33.694-17.657 39.578-21.544 1.805-1.134 2.686-3.077 1.965-5.181-.511-2.265-2.259-3.074-4.559-1.94-5.957 3.563-14.241 7.775-24.97 12.474 6.71-23.635 10.23-35.452 10.652-35.776.716-1.943 1.203-3.076 1.551-3.724.514-.647.679-.647 1.384-.809 3.454-1.135 5.965-2.431 7.249-4.05s.965-3.399-.178-5.18c-2.35-2.75-5.096-4.692-8.309-6.147-1.795-.646-3.838.163-5.946 1.783-.421.324-.678.648-.889.81-1.054.81-1.522 1.296-1.522 1.296-.962.485-1.503.647-2.492.648l-6.1.003c-2.802.001-8.342-.805-17.16-2.259-1.438-.161-3.197.811-2.468 4.048ZM225.346 18.295c6.323 5.015 10.63 11.326 13.159 19.256 1.542 5.017 4.242 7.121 7.65 6.148 2.821-.649 4.903-2.754 6.224-5.668 1.322-2.914 1.206-5.989-.558-9.064-3.364-6.149-9.952-11.974-19.718-17.635-1.135-.646-2.876-.322-5.241 1.621-2.668 2.429-2.843 4.209-1.516 5.342ZM379.661 120.367c2.876.322 5.395.16 7.035-.974 2.016-1.296 2.284-3.4.217-5.989-1.143-1.781-3.962-4.045-8.218-6.472-1.61-1.294-3.278-.646-4.351.811-1.586 2.105-3.713 4.372-6.638 7.125-4.235 3.886-9.222 8.097-14.703 12.308-8.222 6.316-15.609 10.851-22.343 14.253-2.017 1.296-2.614 3.4-1.444 5.666 1.005 2.265 2.964 2.913 5.264 1.779 7.559-3.403 15.743-8.423 24.743-14.578 6.984-4.859 12.676-9.231 17.03-12.956 1.1-.972 2.016-1.296 3.408-.973Z"></path><path d="M375.264 41.218c4.186-.811 9.105-1.299 14.756-1.463l-15.718 55.363c-10.175-.157-18.847-.963-26.274-2.093-2.546-.323-3.592 1.62-1.746 6.151 1.791 3.561 3.877 5.502 6.066 5.339 7.741-1.136 15.132-1.624 22.221-1.627l55.886-.024c.781-.038 1.49-.134 2.134-.276-2.819 4.098-5.832 7.866-9.051 11.286-3.092 3.295-6.446 6.328-10.053 9.113.123-.328.237-.665.337-1.016.689-2.428.317-5.179-1.018-7.445-1.473-1.78-4.007-3.883-7.624-5.662-3.12-1.779-6.261-2.911-8.88-3.557-1.392-.324-3.224.325-5.094 2.268-2.127 2.267-1.927 3.885-.463 4.532 4.659 2.75 8.218 6.471 10.42 11.488 1.332 2.542 2.762 4.219 4.34 4.872-9.638 5.894-20.801 10.314-33.557 13.269-2.3 1.133-3.629 2.915-3.449 5.18.392 2.105 1.389 3.237 3.367 3.236 20.41-4.54 37.618-12.316 50.919-23.167 11.779-9.556 21.463-22.185 28.797-37.565l26.376-.01c-3.769 13.274-7.472 25.739-10.855 37.071-.984 4.047-2.973 5.828-7.232 6.316-4.424.487-12.035.005-23.16-1.447-1.722-.324-3.289 1.134-4.566 3.886-.992 2.914-.416 4.371 1.186 4.532 5.211.807 8.819 1.453 10.494 1.938.659 0 .943.162 1.273.161 3.727.809 5.429 1.779 6.05 3.074.694 1.618 1.995 2.265 3.359 2.103 6.659-.813 12.505-3.405 16.951-7.453 3.721-3.239 6.144-7.125 7.082-11.01 7.716-31.243 16.781-64.914 27.36-101.013.762-2.105 1.295-3.4 1.809-4.047 0 0 .375-.162 1.291-.487 3.592-1.62 5.746-3.401 6.297-5.344.506-1.781-.354-3.399-2.202-5.017-1.967-1.779-4.191-3.236-6.461-4.53-1.675-.484-3.718.325-5.167 1.945-.422.323-.889.81-1.311 1.133-.422.323-.843.648-1.265.971-.468.486-1.008.648-2.162.649l-19.947.008c-2.608-2.427-6.132-4.53-10.334-5.984-1.419-.809-2.876-.322-3.481.649-.468.486-.744 1.457-.855 2.428-.271 5.018-1.357 11.169-2.885 18.292-2.347 11.169-4.978 22.177-8.011 32.862-3.864 13.608-8.781 25.369-14.722 35.38-1.364-3.917-3.166-6.858-5.72-8.664-1.776-1.294-3.992-1.617-6.054-.159-1.99 1.781-3.933 3.4-5.922 5.182-1.779 1.619-3.281 2.267-5.095 2.268h-.165l15.719-55.364 15.661-.006c3.508-.163 5.808-1.297 6.379-3.887.183-.648.249-1.457-.016-2.266-1.278-4.208-3.088-7.121-5.504-9.062-2.132-1.779-4.487-1.617-6.403.488-.586.324-2.365 1.943-5.454 4.696-.77.972-1.449 1.62-2.319 1.782 1.471-5.18 2.785-9.227 3.823-12.303.413-1.457.927-2.105 2.054-2.59 2.959-1.135 5.232-2.755 5.949-4.697.67-1.781-.4-3.237-3.329-4.531-3.14-1.131-6.419-1.778-9.34-1.938-1.768-.161-3.06.325-3.949 1.134-.679.648-1.092 2.105-1.433 3.885-.095 3.237-.73 6.637-1.668 10.522-.755 3.237-1.601 6.799-2.75 10.846l-18.299.007c1.977-6.961 3.126-11.008 3.704-12.465.624-1.619 1.184-2.428 2.1-2.752 3.5-1.296 5.865-3.24 6.298-5.344.13-1.619-1.151-2.913-3.678-3.883-2.857-.97-6.135-1.616-9.175-1.938-1.438-.161-2.895.325-3.738.972-1.054.81-1.513 2.429-1.69 4.209-.122 2.752-.638 6.313-1.457 10.36-.709 3.076-1.601 6.799-2.75 10.846-7.043-.159-13.947-.803-20.715-1.934-2.216-.323-3.38 1.458-1.984 5.828 1.416 3.722 3.172 5.664 5.691 5.501Zm95.973-16.388c.459-1.619 1.019-2.428 2.073-3.238l22.255-.009c1.154 0 1.273.161.951 1.295-1.149 4.047-2.133 8.094-3.282 12.141-1.011 3.561-2.068 7.284-2.915 10.846l-24.233.01c1.536-5.99 3.347-12.951 5.151-21.045Zm-9.352 36.424 1.838-6.475 24.069-.01-7.262 25.577-25.058.011c2.268-5.666 4.436-12.142 6.413-19.103Zm-58.898 33.853-18.463.008 4.366-15.379 18.629-.008c-1.471 5.181-2.942 10.361-4.532 15.379Zm-2.745-55.355 18.629-.008-3.263 11.493-18.629.008 3.263-11.494Zm-5.653 19.911 18.629-.008-3.355 11.817-18.629.008 3.355-11.817ZM572.424 46.962c1.238-1.457 2.2-1.943 3.189-1.943 3.562.808 5.843.321 7.2-.974 1.614-1.619 1.505-3.561-.113-5.989-1.948-2.427-4.438-4.692-7.888-6.471-1.181-.486-1.913-.809-2.756-.161-.212.163-.889.81-1.403 1.458-1.303 2.267-3.477 4.695-6.401 7.449-8.022 7.935-16.401 15.384-25.347 22.509-13.465 10.85-25.819 18.949-37.438 24.457-2.273 1.62-2.825 3.562-1.892 5.504.977 1.78 2.89 2.589 5.145 1.616 13.194-5.832 26.84-14.416 41.267-25.752l-.551 1.943c-2.428 9.712-6.251 22.015-11.349 37.071-4.153 12.303-8.313 23.473-12.455 33.996-1.057 3.723.113 5.988 3.034 6.15 1.933.16 3.93-.488 5.854-1.46 2.136-1.134 3.465-2.915 4.228-5.02 7.25-23.796 14.547-47.755 21.844-71.713.67-1.78 1.394-2.59 2.356-3.076 6.249-2.269 6.206-5.02 3.863-6.638h.002c-.97-.649-2.27-1.295-3.946-1.78 2.108-1.62 4.052-3.239 5.995-4.859 2.411-2.105 4.986-4.21 7.562-6.316ZM529.447 50.866c7.322-3.726 15.551-8.909 24.057-15.063 7.662-5.507 14.665-11.012 21.054-16.68 2.109-1.62 3.071-2.106 3.355-1.944 2.783.646 5.183.321 6.916-1.136 1.988-1.781 2.092-3.886.619-5.665-2.47-2.913-5.17-5.016-7.888-6.471-.925-.809-1.703-.97-2.546-.322-.422.323-1.1.972-1.449 1.619-.908 1.456-2.871 3.724-5.722 6.8-4.419 4.535-10.295 9.554-17.93 15.547-9.111 7.126-17.057 12.471-24.635 16.52-1.924.972-2.43 2.753-.977 5.18 1.262 1.942 3.057 2.588 5.146 1.616Z"></path><path d="M653.872 71.856c-2.133-1.779-4.513-2.102-7.043-.159-1.054.81-3.629 2.915-7.654 6.64h.001c-1.733 1.457-3.4 2.105-5.049 2.106h-2.967l.827-2.913c.368-1.294.881-1.942 1.843-2.428 3.784-1.135 5.847-2.592 6.325-4.859.084-1.457-.868-2.751-3.065-3.721-2.737-.809-6.51-1.455-11.318-1.938-.705.162-1.621.486-2.043.81-.633.486-.908 1.457-1.111 2.752-1.29 7.446-2.017 11.169-2.063 11.331l-.276.972-15.002.006c-13.518.006-26.687-.636-39.956-2.088-2.381-.323-3.592 1.62-2.004 6.476 1.582 3.722 3.411 5.987 5.673 6.148h.494c9.765-1.299 20.334-1.951 32.039-1.955l16.485-.007c-3.512 12.95-7.281 26.224-11.609 40.308-1.222 3.723-3.66 5.343-8.579 5.83-2.023.163-7.985-.32-18.049-1.449-1.557-.323-3.125 1.134-4.355 3.725-1.183 2.428-.819 4.047.692 4.532.943.161 1.886.323 2.994.484 7.922 1.13 11.794 2.585 12.442 4.365.741 1.457 2.04 2.104 3.24 1.942 6.165-.812 11.425-3.08 15.476-6.319 3.63-2.916 6.006-6.64 6.944-10.525 2.347-11.169 6.061-25.415 11.189-42.898l25.223-.01c3.179-.163 5.149-1.297 5.893-2.755.394-.809.67-1.78.735-2.59-1.121-5.341-3.27-9.386-6.372-11.813Z"></path><path d="M668.819 54.046c-1.626-3.56-3.409-5.988-5.231-7.12-2.462-1.78-4.725-1.941-7.254.003-2.319 1.782-4.849 3.725-7.516 6.154-1.448 1.618-2.951 2.266-5.094 2.267l-23.244.01 4.504-15.864 30.498-.013c3.178-.164 5.267-1.136 6.057-2.755.394-.809.413-1.457.524-2.428-1.351-4.532-3.518-7.93-6.501-10.195-2.132-1.78-4.724-1.94-7.254.003-1.851 1.296-4.17 3.077-6.416 5.183-1.238 1.457-2.576 2.105-4.884 2.106l-9.727.004c2.344-8.256 4.071-13.76 5.063-16.674.809-2.266 1.533-3.076 2.239-3.239 3.829-1.296 6.267-2.916 7.313-4.859.671-1.781-.399-3.237-3.658-4.53-2.976-1.132-6.584-1.778-10.448-2.1-2.097-.16-3.343.163-4.232.973-.724.81-1.092 2.105-1.149 4.047-.26 3.237-.915 7.284-1.78 11.493-.57 2.59-1.83 7.608-3.898 14.893h-.33c-7.749.004-16.962-.639-27.593-2.092-2.757-.16-4.133 1.782-2.314 5.828 1.818 4.046 3.977 6.311 6.99 6.148h.33c5.011-.812 11.459-1.462 18.969-1.789h1.649c-1.471 5.179-3.033 10.683-4.669 15.863l-7.583.003c-12.199.005-23.675-.799-34.966-2.252-2.38-.323-3.545 1.458-2.194 5.99 1.178 3.398 2.961 5.826 5.085 6.472.283.162.943.162 1.273.162 11.037-1.138 19.959-1.789 27.047-1.792l64.953-.027c5.276-.002 8.786-3.079 5.441-9.875ZM586.958 117.692c3.402 4.854 7.156 6.147 10.804 2.585 1.522-1.295 2.45-3.4 2.763-5.666.479-2.267-.197-4.533-1.742-6.636-5.17-5.016-12.804-8.898-22.903-11.645-1.603-.161-3.481.649-5.187 2.592-1.962 2.267-2.019 4.209-.389 4.856 8.229 4.691 13.701 9.221 16.654 13.914ZM.18 165.598l645.954-.265 2.345-8.257-645.955.265-2.344 8.257z">'
);
function Yd() {
  return E(Kd);
}
var Jd = S(
  '<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 923 152.257"><path d=m58.374,121.508c27.756-.01,55.104-27.601,57.027-34.374.563-1.981-.454-3.137-2.136-3.136-1.346,0-2.879.661-4.311,2.148-12.574,12.887-26.359,21.15-41.33,21.155-14.13.005-25.173-12.048-18.511-35.505,7.975-28.08,37.657-62.115,63.562-62.123,11.607-.004,18.721,6.931,19.099,19.813.016,2.314,1.538,3.469,3.389,3.468,2.186-.001,4.936-1.983,5.37-5.286.538-5.452,1.179-10.076,2.68-15.362.563-1.983,1.294-3.965,2.073-6.112,1.227-3.138-.275-4.955-2.798-4.954-.841,0-1.945.332-3.095.827l-9.94,4.794c-4.398-3.468-9.863-4.952-15.246-4.95-35.831.011-74.197,36.195-84.424,72.205h0c-7.083,24.941.835,47.401,28.591,47.392Z></path><path d=m118.873,89.116c-5.301,18.666,2.244,32.372,19.235,32.366,24.055-.007,53.523-26.774,60.841-52.542,5.348-18.831-2.197-32.537-19.187-32.532-24.055.008-53.524,26.775-60.889,52.708Zm59.807-45.936c7.402-.002,9.965,5.778,6.775,17.01-5.536,19.491-28.266,54.515-46.265,54.52-7.402.003-9.965-5.777-6.775-17.01,5.536-19.491,28.266-54.514,46.265-54.52Z></path><path d=m206.697,67.119c1.346,0,2.926-.826,4.236-2.479,8.003-10.408,14.784-16.521,19.158-16.522,2.019,0,2.868,1.155,2.352,2.972-.282.992-.899,1.983-1.564,3.139l-38.843,60.959c-1.236,1.983-.676,2.973,1.006,2.972l8.748-.002c1.346-.001,2.496-.497,3.712-1.818l52.129-57.991c4.172-4.625,10.422-11.233,15.469-11.235,3.365,0,4.774,2.145,3.601,6.274-.61,2.147-2.127,5.121-4.411,8.425l-35.966,53.195c-1.451,2.148-.723,3.138.96,3.137l8.747-.002c1.346,0,2.496-.497,3.497-1.653l49.837-55.842c9.657-10.904,14.781-13.548,17.977-13.549,2.691,0,4.072,1.65,2.993,5.448-.75,2.644-2.577,6.113-5.909,10.739l-26.04,36.015c-1.881,2.478-3.136,5.121-3.84,7.598h.001c-2.017,7.103.574,13.379,9.995,13.376,11.271-.003,23.834-11.074,30.17-19.169,2.312-2.808,3.856-5.286,4.185-6.443.609-2.147-.866-3.468-2.716-3.467-1.346,0-2.879.662-4.236,2.478-6.693,8.756-14.578,15.201-19.12,15.202-2.187,0-2.989-1.32-2.426-3.302.282-.992,1.209-2.478,2.042-3.635l28.398-38.989c2.761-3.8,4.681-7.598,5.666-11.067,2.487-8.755-.805-15.526-10.393-15.523-8.243.003-16.219,3.804-31.79,21.317l-20.96,23.461-2.484-1.321,8.815-10.904c8.722-10.574,11.671-15.034,12.891-19.328,2.158-7.599-2.471-13.214-10.714-13.211-9.42.003-18.96,6.944-31.789,21.317l-20.96,23.461-2.531-1.156,15.816-20.155c3.191-4.13,5.279-7.93,6.218-11.234,2.064-7.267-1.286-12.056-8.015-12.054-12.112.004-23.85,8.762-35.008,24.952-.88,1.321-1.236,1.982-1.377,2.477-.516,1.818.791,3.138,2.473,3.137Z></path><path d=m344.895,66.745c1.346,0,2.879-.661,4.236-2.479,8.264-10.738,14.69-16.191,18.896-16.192,2.019-.001,2.821,1.32,2.399,2.807-.235.825-.9,1.982-1.471,2.809l-32.688,47.578c-2.021,2.973-3.324,5.781-3.98,8.093h0c-1.971,6.939,1.567,11.067,8.632,11.065,8.916-.003,21.472-5.128,35.466-24.787.571-.827.927-1.487,1.115-2.147.563-1.983-.744-3.303-2.426-3.303-1.346,0-2.88.661-4.237,2.479-8.264,10.739-14.69,16.191-18.896,16.193-2.018,0-2.82-1.321-2.445-2.643.328-1.156.899-1.982,1.779-3.304l32.426-47.248c2.022-2.973,3.324-5.782,3.981-8.095,1.97-6.937-1.521-11.23-8.586-11.228-8.915.003-21.519,5.294-35.512,24.952-.572.826-.928,1.488-1.115,2.148-.563,1.981.744,3.303,2.426,3.302Z></path><path d=m394.224,20.979c5.888-.003,11.912-4.629,13.601-10.576,1.642-5.782-1.755-10.405-7.643-10.403-6.055.002-12.079,4.628-13.721,10.41-1.689,5.946,1.708,10.571,7.763,10.569Z></path><path d=m391.477,61.444c-.88,1.321-1.236,1.982-1.376,2.477-.517,1.818.79,3.138,2.473,3.137,1.345,0,2.925-.826,4.235-2.479,8.003-10.408,14.785-16.521,19.158-16.522,2.019,0,2.701,1.155,2.137,3.138-.281.99-.778,2.146-1.396,3.138l-38.795,60.793c-1.236,1.983-.677,2.974,1.006,2.973l8.747-.003c1.346,0,2.496-.496,3.497-1.653l49.837-55.842c9.657-10.904,14.781-13.548,17.977-13.548,2.691-.001,4.073,1.65,2.994,5.448-.751,2.643-2.577,6.113-5.909,10.739l-26.04,36.015c-1.881,2.478-3.137,5.12-3.84,7.598h0c-2.018,7.101.573,13.377,9.994,13.374,11.271-.003,23.834-11.074,30.17-19.169,2.312-2.808,3.857-5.286,4.185-6.442.61-2.148-.865-3.469-2.716-3.468-1.345,0-2.879.662-4.236,2.479-6.692,8.756-14.577,15.201-19.119,15.202-2.187,0-2.942-1.486-2.473-3.138.328-1.156,1.04-2.478,2.089-3.799l28.398-38.989c2.761-3.8,4.681-7.598,5.666-11.067,2.486-8.755-.805-15.526-10.394-15.523-9.42.003-18.96,6.944-31.789,21.317l-20.96,23.461-2.484-1.321,15.769-19.99c3.191-4.13,5.28-7.93,6.218-11.234,2.064-7.267-1.286-12.056-8.015-12.054-12.111.004-23.85,8.762-35.008,24.952Z></path><path d=m525.35,126.641c2.205-7.764-1.265-12.718-10.609-15.357l-31.11-8.909.047-.165,9.168-8.592c3.353,1.816,7.54,2.475,11.745,2.473,16.99-.005,38.809-14.052,44.156-32.881,2.487-8.755.467-15.857-3.986-20.314,3.125-3.305,5.969-5.618,10.186-7.437-.359,3.635,2.376,6.441,6.076,6.44,4.374-.002,9.369-3.968,10.682-8.592,1.22-4.295-1.214-8.754-7.27-8.752-5.382.002-13.554,3.308-23.54,15.368-3.184-1.816-7.108-2.806-11.145-2.804-19.682.006-39.524,18.346-44.215,34.864-2.487,8.754-.858,14.866,2.773,18.663l-17.004,11.898c-2.104,1.487-3.488,2.808-4.051,4.791-.516,1.817.192,3.468,2.481,4.293l10.481,3.961-.047.165c-16.452,4.845-26.579,10.791-30.209,16.36l-443.766.146-2.345,8.257,444.985-.146c2.535,7.102,14.283,11.891,30.219,11.886,13.935-.005,27.876-4.29,36.957-11.908l375.362-.123,2.345-8.257-370.67.122c.98-1.722,1.761-3.539,2.304-5.45Zm-25.709-51.028c3.472-12.224,17.305-30.727,29.08-30.731,6.898-.002,8.377,5.448,6.313,12.716-3.471,12.224-17.304,30.726-28.911,30.73-7.065.003-8.546-5.448-6.482-12.715Zm-12.897,42.451l18.553,6.932c4.629,1.726,6.234,3.905,5.532,7.099l-46.133.015c2.426-4.508,8.678-8.907,22.048-14.046Zm-5.862,27.749c-7.435.003-13.168-2.165-15.784-5.447l38.595-.013c-6.004,3.5-14.784,5.458-22.812,5.46Z></path><path d=m566.708,113.083c-.563,1.982.434,3.799,2.789,3.798,2.019,0,3.525-1.157,5.844-2.809l9.493-6.775c4.552,8.257,11.994,14.035,26.797,14.03,19.009-.006,41.708-15.374,47.056-34.204,3.471-12.224-.556-21.141-6.586-27.745l-11.453-12.384c-6.682-7.266-8.292-14.037-6.134-21.635,2.815-9.911,12.355-16.852,23.289-16.855,12.785-.004,20.446,9.738,18.673,24.274-.34,2.973.846,4.128,3.033,4.127,2.187,0,4.217-1.818,5.398-4.792,2.764-6.771,7.746-16.023,13.026-23.952.927-1.487,1.497-2.313,1.826-3.469.516-1.818-.576-3.303-2.595-3.303-1.177,0-2.374.661-3.403,1.322l-11.84,7.932c-3.126-3.798-9.465-9.907-20.904-9.904-21.363.008-39.368,13.062-44.2,30.076-3.19,11.232-.258,21.636,7.638,30.553l8.55,9.577c5.908,6.438,8.789,12.88,6.303,21.634-3.566,12.553-15.77,19.99-27.377,19.994-11.775.004-23.271-8.085-20.489-29.723.433-3.303-1.351-4.129-3.033-4.128-2.523.001-4.506,1.653-5.472,4.461-4.051,11.894-8.04,18.832-14.853,27.422-.571.826-1.142,1.652-1.376,2.478Z></path><path d=m666.075,88.936c-5.301,18.666,2.244,32.373,19.234,32.367,24.056-.008,53.524-26.774,60.842-52.543,5.348-18.831-2.197-32.537-19.187-32.531-24.055.008-53.524,26.774-60.889,52.707Zm59.807-45.935c7.402-.003,9.965,5.778,6.775,17.01-5.536,19.491-28.266,54.514-46.265,54.52-7.402.002-9.965-5.778-6.775-17.01,5.536-19.491,28.266-54.514,46.265-54.52Z></path><path d=m764.201,121.277c24.055-.009,53.523-26.774,60.842-52.543,5.348-18.831-2.197-32.537-19.188-32.532-24.055.008-53.523,26.775-60.888,52.708-5.301,18.666,2.244,32.372,19.234,32.367Zm-5.692-23.782c5.535-19.492,28.265-54.515,46.265-54.52,7.401-.003,9.964,5.777,6.774,17.009-5.535,19.492-28.265,54.515-46.264,54.521-7.402.002-9.965-5.778-6.775-17.01Z></path><path d=m907.961,36.167c-9.421.003-18.961,6.944-31.79,21.317l-20.959,23.461-2.485-1.32,15.77-19.991c3.191-4.13,5.28-7.93,6.218-11.233,2.064-7.267-1.285-12.057-8.015-12.055-12.111.005-23.849,8.763-35.007,24.952-.881,1.322-1.236,1.983-1.377,2.478-.516,1.818.79,3.138,2.473,3.138,1.346,0,2.926-.827,4.236-2.479,8.002-10.408,14.785-16.521,19.158-16.523,2.019,0,2.7,1.155,2.137,3.138-.282.991-.778,2.147-1.396,3.138l-38.795,60.794c-1.237,1.983-.677,2.973,1.006,2.972l8.747-.002c1.346-.001,2.496-.497,3.497-1.653l49.837-55.842c9.657-10.905,14.78-13.548,17.977-13.549,2.691-.001,4.073,1.65,2.994,5.448-.751,2.644-2.577,6.113-5.909,10.739l-26.04,36.015c-1.881,2.478-3.137,5.121-3.84,7.598l-.002-.002c-2.017,7.103.574,13.379,9.994,13.375,11.271-.003,23.834-11.073,30.17-19.169,2.312-2.808,3.857-5.286,4.185-6.442.61-2.147-.865-3.468-2.715-3.468-1.346,0-2.879.662-4.236,2.479-6.692,8.756-14.578,15.201-19.12,15.202-2.187.002-2.942-1.485-2.473-3.137.329-1.157,1.041-2.478,2.089-3.8l28.398-38.989c2.761-3.799,4.681-7.598,5.666-11.067,2.487-8.755-.805-15.526-10.393-15.523Z>'
);
function eh() {
  return E(Jd);
}
var th = 6e4;
function nh(e = th / 2) {
  const [t, n] = L(void 0, { equals: !1 });
  return [
    Pa(() => (t(), new Date()), e, void 0, {
      equals: (i, o) => i.getTime() === o.getTime()
    }),
    n
  ];
}
const rh = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  [ih] = nh(6e4);
function oh(e) {
  const t = e.toLocaleString("en-US", { timeZone: "America/New_York" });
  return new Date(t);
}
function Rn(e) {
  const t = e.match(/(\d+):(\d+)/);
  if (t)
    return { hours: Number.parseInt(t[1]), minutes: Number.parseInt(t[2]) };
}
function sh(e, t) {
  if (rh[e.getDay()] !== t.day) return !1;
  const r = Rn(t.start),
    i = Rn(t.end);
  if (!r || !i) return !1;
  const o = e.getHours() * 60 + e.getMinutes(),
    s = r.hours * 60 + r.minutes;
  let a = i.hours * 60 + i.minutes;
  return a < s ? o >= s || o < a : o >= s && o < a;
}
function ah(e) {
  const [t, n] = L(!1);
  return (
    Be(() => n(!0)),
    k(() => {
      if (!t() || !e) return !1;
      const r = oh(ih());
      return e.some(i => sh(r, i));
    })
  );
}
var lh = S("<table><tbody>"),
  ch = S("<tr>"),
  uh = S("<td>"),
  fh = S("<div><!$><!/><!$><!/>"),
  ko = S("<h2>"),
  Bo = S("<div>"),
  dh = S("<section>"),
  hh = S(
    "<article><!$><!/><div><!$><!/><!$><!/></div><!$><!/><!$><!/><!$><!/>"
  ),
  gh = S("<p>"),
  mh = S("<section><h3></h3><!$><!/>");
function ph(e, t) {
  return e.setHours(t.hours), e.setMinutes(t.minutes), e;
}
function No(e) {
  const t = new Date();
  ph(t, e);
  const n = t.toLocaleTimeString("en-US", { timeStyle: "short" });
  return vh(n);
}
function vh(e) {
  const [t, n] = e.split(":"),
    r = n.slice(0, 2),
    i = n.slice(2).trim();
  return r === "00" ? `${t} ${i}` : `${t}:${r} ${i}`;
}
function yh(e) {
  const t = [];
  let n = null;
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    n
      ? n.start === i.start &&
        n.end === i.end &&
        r ===
          e.findIndex(
            o => o.day === i.day && o.start === i.start && o.end === i.end
          )
        ? (n.dayRange = n.dayRange.split("–")[0] + "–" + i.day)
        : (t.push(n), (n = { ...i, dayRange: i.day }))
      : (n = { ...i, dayRange: i.day }),
      r === e.length - 1 && t.push(n);
  }
  return t.map(r => {
    const { day: i, ...o } = r;
    return o;
  });
}
function Ro(e) {
  const t = yh(e.ranges),
    n = k(() =>
      t.reduce((r, { dayRange: i, start: o, end: s }) => {
        const a = Rn(o),
          l = Rn(s);
        if (a && l) {
          const f = [i, `${No(a)}–${No(l)}`];
          return [...r, f];
        } else return r;
      }, [])
    );
  return (() => {
    var r = E(lh),
      i = r.firstChild;
    return (
      x(
        i,
        h(fe, {
          get each() {
            return n();
          },
          children: o =>
            (() => {
              var s = E(ch);
              return (
                x(
                  s,
                  h(fe, {
                    each: o,
                    children: a =>
                      (() => {
                        var l = E(uh);
                        return x(l, a), l;
                      })()
                  })
                ),
                s
              );
            })()
        })
      ),
      D(() => M(r, ge.table)),
      r
    );
  })();
}
function bh() {
  const e = document.querySelectorAll("iframe");
  for (const t of e)
    if (new URL(t.src).hostname === "widgets.resy.com") return t;
}
function _h(e) {
  function t() {
    try {
      if (e.location) {
        window.resyWidget.openModal({
          venueId: e.location.venueId,
          apiKey: "EZWE1zfVffWCEzlANgrWSYHEGvIv1uRg"
        });
        const n = bh();
        n && (n.title = `Reserve at ${e.location.name.en}`),
          document.body.style.removeProperty("pointer-events");
        const r = document.getElementById("backdrop");
        r != null && (r.style.display = "none");
      }
    } catch (n) {
      console.error(n);
    }
  }
  return h(Q, {
    get when() {
      return e.location;
    },
    keyed: !0,
    children: n => {
      const r = ah(n.openHours);
      return (() => {
        var i = E(hh),
          o = i.firstChild,
          [s, a] = X(o.nextSibling),
          l = s.nextSibling,
          f = l.firstChild,
          [u, c] = X(f.nextSibling),
          d = u.nextSibling,
          [g, m] = X(d.nextSibling),
          p = l.nextSibling,
          [b, $] = X(p.nextSibling),
          A = b.nextSibling,
          [N, T] = X(A.nextSibling),
          I = N.nextSibling,
          [z, re] = X(I.nextSibling);
        return (
          (i.$$click = t),
          x(
            i,
            h(Q, {
              get when() {
                return n.showComingSoon;
              },
              get children() {
                var R = E(fh),
                  G = R.firstChild,
                  [O, v] = X(G.nextSibling),
                  y = O.nextSibling,
                  [w, _] = X(y.nextSibling);
                return (
                  x(
                    R,
                    h(Qr, {
                      fast: !0,
                      get class() {
                        return ge.marquee;
                      },
                      get children() {
                        return h(eh, {});
                      }
                    }),
                    O,
                    v
                  ),
                  x(
                    R,
                    h(Qr, {
                      get class() {
                        return ge.marquee;
                      },
                      get children() {
                        return h(Yd, {});
                      }
                    }),
                    w,
                    _
                  ),
                  D(() => M(R, ge.comingSoonContainer)),
                  R
                );
              }
            }),
            s,
            a
          ),
          x(
            l,
            h(Q, {
              get when() {
                return !n.showComingSoon;
              },
              get fallback() {
                return (() => {
                  var R = E(ko);
                  return (
                    x(
                      R,
                      h(
                        Nt,
                        F(() => n.name)
                      )
                    ),
                    D(() => M(R, q(pe.serifTitle, ge.title))),
                    R
                  );
                })();
              },
              get children() {
                return h(za, {
                  onClick: t,
                  get children() {
                    var R = E(ko);
                    return (
                      x(
                        R,
                        h(
                          Nt,
                          F(() => n.name)
                        )
                      ),
                      D(() => M(R, q(pe.serifTitle, ge.title))),
                      R
                    );
                  }
                });
              }
            }),
            u,
            c
          ),
          x(
            l,
            h(Q, {
              get when() {
                return !n.showComingSoon;
              },
              get children() {
                var R = E(Bo);
                return (
                  x(R, () => (r() ? "Open now" : "Closed")),
                  D(() =>
                    M(R, q(ge.indicator, { [ge.open]: r(), [ge.closed]: !r() }))
                  ),
                  R
                );
              }
            }),
            g,
            m
          ),
          x(
            i,
            h(Q, {
              get when() {
                return n.notes;
              },
              get children() {
                var R = E(dh);
                return (
                  x(
                    R,
                    h(fe, {
                      get each() {
                        return n.notes?.split(`

`);
                      },
                      children: G =>
                        (() => {
                          var O = E(gh);
                          return x(O, () => G.trim()), O;
                        })()
                    })
                  ),
                  D(() => M(R, ge.notes)),
                  R
                );
              }
            }),
            b,
            $
          ),
          x(
            i,
            h(Q, {
              get when() {
                return n.openHours?.length;
              },
              get children() {
                return h(Ro, {
                  get ranges() {
                    return n.openHours;
                  }
                });
              }
            }),
            N,
            T
          ),
          x(
            i,
            h(Q, {
              get when() {
                return n.specialHours?.length;
              },
              get children() {
                var R = E(Bo);
                return (
                  x(
                    R,
                    h(fe, {
                      get each() {
                        return n.specialHours;
                      },
                      children: ({ title: G, hours: O }) =>
                        (() => {
                          var v = E(mh),
                            y = v.firstChild,
                            w = y.nextSibling,
                            [_, W] = X(w.nextSibling);
                          return (
                            x(y, G),
                            x(v, h(Ro, { ranges: O }), _, W),
                            D(
                              B => {
                                var Y = ge.section,
                                  ue = ge.sectionTitle;
                                return (
                                  Y !== B.e && M(v, (B.e = Y)),
                                  ue !== B.t && M(y, (B.t = ue)),
                                  B
                                );
                              },
                              { e: void 0, t: void 0 }
                            ),
                            v
                          );
                        })()
                    })
                  ),
                  D(() => M(R, ge.sectionGroup)),
                  R
                );
              }
            }),
            z,
            re
          ),
          D(
            R => {
              var G = q(ce.focusVisible, ge.card, {
                  [ge.disabled]: n.showComingSoon,
                  [ge.wide]: e.desktopNonScrollingWidth
                }),
                O = n.backgroundColor,
                v = n.fillColor,
                y = ge.titleContainer;
              return (
                G !== R.e && M(i, (R.e = G)),
                O !== R.t &&
                  ((R.t = O) != null
                    ? i.style.setProperty("--backgroundColor", O)
                    : i.style.removeProperty("--backgroundColor")),
                v !== R.a &&
                  ((R.a = v) != null
                    ? i.style.setProperty("--fillColor", v)
                    : i.style.removeProperty("--fillColor")),
                y !== R.o && M(l, (R.o = y)),
                R
              );
            },
            { e: void 0, t: void 0, a: void 0, o: void 0 }
          ),
          vt(),
          i
        );
      })();
    }
  });
}
Vn(["click"]);
var wh = S(
  '<svg viewBox="0 0 25 25"fill=none xmlns=http://www.w3.org/2000/svg><path d="m1 1 23 23M1 24 24 1"stroke=currentColor stroke-width=2>'
);
function Na(e) {
  return (() => {
    var t = E(wh);
    return (
      t.style.setProperty("width", "1.4rem"),
      t.style.setProperty("height", "1.4rem"),
      D(() => oe(t, "class", e.class)),
      t
    );
  })();
}
var xh = S("<br>"),
  Eh = S("<div><header><!$><!/><!$><!/></header><div><div>");
const Sh = Mt();
function Ah(e) {
  const t = ie(Qe),
    [n, r] = Sh(),
    i = pa(n),
    o = Dt(),
    a = (t()?.reserveDialog?.locations?.length ?? 0) <= 4;
  return h(ju.Provider, {
    value: r,
    get children() {
      return h(cn, {
        get open() {
          return i();
        },
        onOpenChange: r,
        modal: !0,
        get children() {
          return [
            h(
              Jn,
              F(e, {
                get class() {
                  return q(e.class, ce.focusVisible);
                },
                get children() {
                  return e.children;
                }
              })
            ),
            h(ln, {
              get children() {
                return h(pi, {
                  onPointerDownOutside: l => {
                    l.preventDefault();
                  },
                  onInteractOutside: l => {
                    l.preventDefault();
                  },
                  get class() {
                    return q(ce.verticalScroll, ce.dialog, Ke.dialogContainer);
                  },
                  get children() {
                    var l = E(Eh),
                      f = l.firstChild,
                      u = f.firstChild,
                      [c, d] = X(u.nextSibling),
                      g = c.nextSibling,
                      [m, p] = X(g.nextSibling),
                      b = f.nextSibling,
                      $ = b.firstChild;
                    return (
                      x(
                        f,
                        h(g2, {
                          as: "h1",
                          id: o,
                          get class() {
                            return q(pe.serifDisplay, Ke.description);
                          },
                          get children() {
                            return [
                              h(Nn, {
                                get class() {
                                  return q(ce.focusVisible, Ke.smallX);
                                },
                                get children() {
                                  return h(Na, {});
                                }
                              }),
                              "Pick a Location",
                              E(xh),
                              "to Reserve Your Table:"
                            ];
                          }
                        }),
                        c,
                        d
                      ),
                      x(
                        f,
                        h(Nn, {
                          get class() {
                            return q(ce.borderButton, Ke.largeX);
                          },
                          get children() {
                            return h(Sd, {});
                          }
                        }),
                        m,
                        p
                      ),
                      x(
                        $,
                        h(fe, {
                          get each() {
                            return t()?.reserveDialog.locations;
                          },
                          children: A =>
                            h(_h, { location: A, desktopNonScrollingWidth: a })
                        })
                      ),
                      D(
                        A => {
                          var N = Ke.dialog,
                            T = Ke.header,
                            I = q(ce.horizontalScroll, Ke.locationsContainer),
                            z = Ke.locations;
                          return (
                            N !== A.e && M(l, (A.e = N)),
                            T !== A.t && M(f, (A.t = T)),
                            I !== A.a && M(b, (A.a = I)),
                            z !== A.o && M($, (A.o = z)),
                            A
                          );
                        },
                        { e: void 0, t: void 0, a: void 0, o: void 0 }
                      ),
                      l
                    );
                  }
                });
              }
            })
          ];
        }
      });
    }
  });
}
const $h = "_fieldContainer_xts0k_1",
  Ch = "_doubleFieldContainer_xts0k_5",
  Th = "_field_xts0k_1",
  Ph = "_area_xts0k_11",
  Ih = "_body_xts0k_12",
  Oh = "_input_xts0k_49",
  Lh = "_label_xts0k_62",
  An = {
    fieldContainer: $h,
    doubleFieldContainer: Ch,
    field: Th,
    area: Ph,
    body: Ih,
    input: Oh,
    label: Lh
  };
function kh(e) {
  return h(_2, {
    get class() {
      return An.field;
    },
    get name() {
      return e.name;
    },
    get children() {
      return [
        h(r0, {
          get class() {
            return An.label;
          },
          get children() {
            return e.label;
          }
        }),
        h(y2, {
          type: "email",
          get required() {
            return e.required;
          },
          get class() {
            return An.input;
          }
        })
      ];
    }
  });
}
function Do(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function(i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Mo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Do(Object(n), !0).forEach(function(r) {
          Bh(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
      : Do(Object(n)).forEach(function(r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
        });
  }
  return e;
}
function Bh(e, t, n) {
  return (
    (t = Nh(t)),
    t in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        })
      : (e[t] = n),
    e
  );
}
function Nh(e) {
  var t = Rh(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
function Rh(e, t) {
  if (typeof e != "object" || e === null) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t || "default");
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Dn(e) {
  return (
    e._type === "span" &&
    "text" in e &&
    typeof e.text == "string" &&
    (typeof e.marks > "u" ||
      (Array.isArray(e.marks) && e.marks.every(t => typeof t == "string")))
  );
}
function Ra(e) {
  return (
    typeof e._type == "string" &&
    e._type[0] !== "@" &&
    (!("markDefs" in e) ||
      (Array.isArray(e.markDefs) &&
        e.markDefs.every(t => typeof t._key == "string"))) &&
    "children" in e &&
    Array.isArray(e.children) &&
    e.children.every(t => typeof t == "object" && "_type" in t)
  );
}
function Da(e) {
  return (
    Ra(e) &&
    "listItem" in e &&
    typeof e.listItem == "string" &&
    (typeof e.level > "u" || typeof e.level == "number")
  );
}
function Ma(e) {
  return e._type === "@list";
}
function Ha(e) {
  return e._type === "@span";
}
function Fa(e) {
  return e._type === "@text";
}
const Ho = ["strong", "em", "code", "underline", "strike-through"];
function Dh(e, t, n) {
  if (!Dn(e) || !e.marks) return [];
  if (!e.marks.length) return [];
  const r = e.marks.slice(),
    i = {};
  return (
    r.forEach(o => {
      i[o] = 1;
      for (let s = t + 1; s < n.length; s++) {
        const a = n[s];
        if (a && Dn(a) && Array.isArray(a.marks) && a.marks.indexOf(o) !== -1)
          i[o]++;
        else break;
      }
    }),
    r.sort((o, s) => Mh(i, o, s))
  );
}
function Mh(e, t, n) {
  const r = e[t],
    i = e[n];
  if (r !== i) return i - r;
  const o = Ho.indexOf(t),
    s = Ho.indexOf(n);
  return o !== s ? o - s : t.localeCompare(n);
}
function Hh(e) {
  var t;
  const { children: n, markDefs: r = [] } = e;
  if (!n || !n.length) return [];
  const i = n.map(Dh),
    o = { _type: "@span", children: [], markType: "<unknown>" };
  let s = [o];
  for (let a = 0; a < n.length; a++) {
    const l = n[a];
    if (!l) continue;
    const f = i[a] || [];
    let u = 1;
    if (s.length > 1)
      for (u; u < s.length; u++) {
        const d = ((t = s[u]) == null ? void 0 : t.markKey) || "",
          g = f.indexOf(d);
        if (g === -1) break;
        f.splice(g, 1);
      }
    s = s.slice(0, u);
    let c = s[s.length - 1];
    if (c) {
      for (const d of f) {
        const g = r.find(b => b._key === d),
          m = g ? g._type : d,
          p = {
            _type: "@span",
            _key: l._key,
            children: [],
            markDef: g,
            markType: m,
            markKey: d
          };
        c.children.push(p), s.push(p), (c = p);
      }
      if (Dn(l)) {
        const d = l.text.split(`
`);
        for (let g = d.length; g-- > 1; )
          d.splice(
            g,
            0,
            `
`
          );
        c.children = c.children.concat(
          d.map(g => ({ _type: "@text", text: g }))
        );
      } else c.children = c.children.concat(l);
    }
  }
  return o.children;
}
function Fh(e, t) {
  const n = [];
  let r;
  for (let i = 0; i < e.length; i++) {
    const o = e[i];
    if (o) {
      if (!Da(o)) {
        n.push(o), (r = void 0);
        continue;
      }
      if (!r) {
        (r = bn(o, i, t)), n.push(r);
        continue;
      }
      if (Uh(o, r)) {
        r.children.push(o);
        continue;
      }
      if ((o.level || 1) > r.level) {
        const s = bn(o, i, t);
        if (t === "html") {
          const a = r.children[r.children.length - 1],
            l = Mo(Mo({}, a), {}, { children: [...a.children, s] });
          r.children[r.children.length - 1] = l;
        } else r.children.push(s);
        r = s;
        continue;
      }
      if ((o.level || 1) < r.level) {
        const s = n[n.length - 1],
          a = s && Kr(s, o);
        if (a) {
          (r = a), r.children.push(o);
          continue;
        }
        (r = bn(o, i, t)), n.push(r);
        continue;
      }
      if (o.listItem !== r.listItem) {
        const s = n[n.length - 1],
          a = s && Kr(s, { level: o.level || 1 });
        if (a && a.listItem === o.listItem) {
          (r = a), r.children.push(o);
          continue;
        } else {
          (r = bn(o, i, t)), n.push(r);
          continue;
        }
      }
      console.warn("Unknown state encountered for block", o), n.push(o);
    }
  }
  return n;
}
function Uh(e, t) {
  return (e.level || 1) === t.level && e.listItem === t.listItem;
}
function bn(e, t, n) {
  return {
    _type: "@list",
    _key: "".concat(e._key || "".concat(t), "-parent"),
    mode: n,
    level: e.level || 1,
    listItem: e.listItem,
    children: [e]
  };
}
function Kr(e, t) {
  const n = t.level || 1,
    r = t.listItem || "normal",
    i = typeof t.listItem == "string";
  if (Ma(e) && (e.level || 1) === n && i && (e.listItem || "normal") === r)
    return e;
  if (!("children" in e)) return;
  const o = e.children[e.children.length - 1];
  return o && !Dn(o) ? Kr(o, t) : void 0;
}
function Ua(e) {
  let t = "";
  return (
    e.children.forEach(n => {
      Fa(n) ? (t += n.text) : Ha(n) && (t += Ua(n));
    }),
    t
  );
}
const Vh = "html";
function Gh(e, t) {
  const { block: n, list: r, listItem: i, marks: o, types: s, ...a } = t;
  return {
    ...e,
    block: qt(e, t, "block"),
    list: qt(e, t, "list"),
    listItem: qt(e, t, "listItem"),
    marks: qt(e, t, "marks"),
    types: qt(e, t, "types"),
    ...a
  };
}
function qt(e, t, n) {
  const r = t[n],
    i = e[n];
  return typeof r == "function" || (r && typeof i == "function")
    ? r
    : r
    ? { ...i, ...r }
    : i;
}
var jh = S("<a>"),
  qh = S("<em>"),
  Zh = S("<strong>"),
  zh = S("<code>"),
  Wh = S("<span>"),
  Xh = S("<del>");
const Qh = ({ children: e, value: t }) => {
    const n = t?.href?.startsWith("http") ? "_blank" : "_self";
    return (() => {
      var r = E(jh);
      return oe(r, "target", n), x(r, e), D(() => oe(r, "href", t?.href)), r;
    })();
  },
  Kh = { textDecoration: "underline" },
  Yh = {
    em: ({ children: e }) =>
      (() => {
        var t = E(qh);
        return x(t, e), t;
      })(),
    strong: ({ children: e }) =>
      (() => {
        var t = E(Zh);
        return x(t, e), t;
      })(),
    code: ({ children: e }) =>
      (() => {
        var t = E(zh);
        return x(t, e), t;
      })(),
    underline: ({ children: e }) =>
      (() => {
        var t = E(Wh);
        return It(t, Kh), x(t, e), t;
      })(),
    "strike-through": ({ children: e }) =>
      (() => {
        var t = E(Xh);
        return x(t, e), t;
      })(),
    link: Qh
  };
var Jh = S("<ol>"),
  e3 = S("<ul>"),
  t3 = S("<li>");
const n3 = {
    number: ({ children: e }) =>
      (() => {
        var t = E(Jh);
        return x(t, e), t;
      })(),
    bullet: ({ children: e }) =>
      (() => {
        var t = E(e3);
        return x(t, e), t;
      })()
  },
  r3 = ({ children: e }) =>
    (() => {
      var t = E(t3);
      return x(t, e), t;
    })(),
  un = (e, t) =>
    `[@portabletext/react] Unknown ${e}, specify a component for it in the \`components.${t}\` prop`,
  Va = e => un(`block type "${e}"`, "types"),
  i3 = e => un(`mark type "${e}"`, "marks"),
  o3 = e => un(`block style "${e}"`, "block"),
  s3 = e => un(`list style "${e}"`, "list"),
  a3 = e => un(`list item style "${e}"`, "listItem");
function l3(e) {
  console.warn(e);
}
var Ga = S("<span>"),
  c3 = S("<div>"),
  u3 = S("<p>"),
  f3 = S("<ul>"),
  d3 = S("<li>");
const Fo = { display: "none" },
  h3 = ({ value: e, isInline: t }) => {
    const n = Va(e._type);
    return t
      ? (() => {
          var r = E(Ga);
          return It(r, Fo), x(r, n), r;
        })()
      : (() => {
          var r = E(c3);
          return It(r, Fo), x(r, n), r;
        })();
  },
  g3 = ({ markType: e, children: t }) =>
    (() => {
      var n = E(Ga);
      return M(n, `unknown__pt__mark__${e}`), x(n, t), n;
    })(),
  m3 = ({ children: e }) =>
    (() => {
      var t = E(u3);
      return x(t, e), t;
    })(),
  p3 = ({ children: e }) =>
    (() => {
      var t = E(f3);
      return x(t, e), t;
    })(),
  v3 = ({ children: e }) =>
    (() => {
      var t = E(d3);
      return x(t, e), t;
    })();
var y3 = S("<br>"),
  b3 = S("<p>"),
  _3 = S("<blockquote>"),
  w3 = S("<h1>"),
  x3 = S("<h2>"),
  E3 = S("<h3>"),
  S3 = S("<h4>"),
  A3 = S("<h5>"),
  $3 = S("<h6>");
const C3 = () => E(y3),
  T3 = {
    normal: ({ children: e }) =>
      (() => {
        var t = E(b3);
        return x(t, e), t;
      })(),
    blockquote: ({ children: e }) =>
      (() => {
        var t = E(_3);
        return x(t, e), t;
      })(),
    h1: ({ children: e }) =>
      (() => {
        var t = E(w3);
        return x(t, e), t;
      })(),
    h2: ({ children: e }) =>
      (() => {
        var t = E(x3);
        return x(t, e), t;
      })(),
    h3: ({ children: e }) =>
      (() => {
        var t = E(E3);
        return x(t, e), t;
      })(),
    h4: ({ children: e }) =>
      (() => {
        var t = E(S3);
        return x(t, e), t;
      })(),
    h5: ({ children: e }) =>
      (() => {
        var t = E(A3);
        return x(t, e), t;
      })(),
    h6: ({ children: e }) =>
      (() => {
        var t = E($3);
        return x(t, e), t;
      })()
  },
  Yr = {
    types: {},
    block: T3,
    marks: Yh,
    list: n3,
    listItem: r3,
    hardBreak: C3,
    unknownType: h3,
    unknownMark: g3,
    unknownList: p3,
    unknownListItem: v3,
    unknownBlockStyle: m3
  };
function ja() {}
const wt = ve({ handleMissingComponent: ja, components: Yr });
function qa(e) {
  const t = () => (e.onMissingComponent ?? l3) || ja,
    n = () => (Array.isArray(e.value) ? e.value : [e.value]),
    r = () => Fh(n(), e.listNestingMode ?? Vh),
    i = k(() => (e.components ? Gh(Yr, e.components) : Yr));
  return h(wt.Provider, {
    value: {
      get components() {
        return i();
      },
      get handleMissingComponent() {
        return t();
      }
    },
    get children() {
      return h(fe, {
        get each() {
          return r();
        },
        children: (o, s) =>
          h(_e, {
            node: o,
            get index() {
              return s();
            },
            isInline: !1,
            renderNode: _e
          })
      });
    }
  });
}
function _e(e) {
  const t = () => e.node._key || `node-${e.index}`;
  return h(as, {
    get fallback() {
      return h(B3, {
        get node() {
          return e.node;
        },
        get index() {
          return e.index;
        },
        get key() {
          return t();
        },
        get isInline() {
          return e.isInline;
        }
      });
    },
    get children() {
      return [
        h(lt, {
          get when() {
            return Ma(e.node) ? e.node : !1;
          },
          keyed: !0,
          children: n =>
            h(O3, {
              node: n,
              get index() {
                return e.index;
              },
              get key() {
                return t();
              }
            })
        }),
        h(lt, {
          get when() {
            return Da(e.node) ? e.node : !1;
          },
          keyed: !0,
          children: n =>
            h(I3, {
              node: n,
              get index() {
                return e.index;
              },
              get key() {
                return t();
              }
            })
        }),
        h(lt, {
          get when() {
            return Ha(e.node) ? e.node : !1;
          },
          keyed: !0,
          children: n =>
            h(P3, {
              node: n,
              get index() {
                return e.index;
              },
              get key() {
                return t();
              }
            })
        }),
        h(lt, {
          get when() {
            return Ra(e.node) ? e.node : !1;
          },
          keyed: !0,
          children: n =>
            h(k3, {
              node: n,
              get index() {
                return e.index;
              },
              get key() {
                return t();
              },
              get isInline() {
                return e.isInline;
              }
            })
        }),
        h(lt, {
          get when() {
            return Fa(e.node) ? e.node : !1;
          },
          keyed: !0,
          children: n =>
            h(L3, {
              node: n,
              get key() {
                return t();
              }
            })
        })
      ];
    }
  });
}
function P3(e) {
  const t = ie(wt),
    n = () => t.components.marks[e.node.markType] ?? t.components.unknownMark;
  return (
    H(() => {
      n() === t.components.unknownMark &&
        t.handleMissingComponent(i3(e.node.markType), {
          nodeType: "mark",
          type: e.node.markType
        });
    }),
    h(we, {
      get component() {
        return n();
      },
      get text() {
        return Ua(e.node);
      },
      get value() {
        return e.node.markDef;
      },
      get markType() {
        return e.node.markType;
      },
      get markKey() {
        return e.node.markKey;
      },
      renderNode: _e,
      get children() {
        return h(fe, {
          get each() {
            return e.node.children;
          },
          children: (r, i) =>
            h(_e, {
              node: r,
              isInline: !0,
              get index() {
                return i();
              },
              renderNode: _e
            })
        });
      }
    })
  );
}
function I3(e) {
  const t = ie(wt),
    n = k(() =>
      Za({ node: e.node, index: e.index, isInline: !1, renderNode: _e })
    ),
    r = () => {
      const i = t.components.listItem;
      return typeof i == "function"
        ? i
        : i[e.node.listItem] || t.components.unknownListItem;
    };
  return (
    H(() => {
      if (r() === t.components.unknownListItem) {
        const i = e.node.listItem || "bullet";
        t.handleMissingComponent(a3(i), { nodeType: "listItemStyle", type: i });
      }
    }),
    h(we, {
      get component() {
        return r();
      },
      get value() {
        return e.node;
      },
      get index() {
        return e.index;
      },
      isInline: !1,
      renderNode: _e,
      get children() {
        return h(Q, {
          get when() {
            return e.node.style != null && e.node.style !== "normal";
          },
          get fallback() {
            return n().children;
          },
          get children() {
            return h(_e, {
              get node() {
                return e.node;
              },
              get index() {
                return e.index;
              },
              isInline: !1,
              renderNode: _e
            });
          }
        });
      }
    })
  );
}
function O3(e) {
  const t = ie(wt),
    n = () => {
      const r = t.components.list;
      return typeof r == "function"
        ? r
        : r[e.node.listItem] || t.components.unknownList;
    };
  return (
    H(() => {
      if (n() === t.components.unknownList) {
        const r = e.node.listItem || "bullet";
        t.handleMissingComponent(s3(r), { nodeType: "listStyle", type: r });
      }
    }),
    h(we, {
      get component() {
        return n();
      },
      get value() {
        return e.node;
      },
      get index() {
        return e.index;
      },
      isInline: !1,
      renderNode: _e,
      get children() {
        return h(fe, {
          get each() {
            return e.node.children;
          },
          children: (r, i) =>
            h(_e, {
              get node() {
                return k(() => !!r._key)()
                  ? r
                  : { ...r, _key: `li-${e.index}-${i()}` };
              },
              get index() {
                return e.index;
              },
              isInline: !1,
              renderNode: _e
            })
        });
      }
    })
  );
}
function L3(e) {
  const t = ie(wt),
    n = () => t.components.hardBreak || void 0;
  return h(Q, {
    get when() {
      return (
        e.node.text ===
        `
`
      );
    },
    get fallback() {
      return e.node.text;
    },
    get children() {
      return h(Q, {
        get when() {
          return n();
        },
        fallback: "\\n",
        get children() {
          return h(we, {
            get component() {
              return n();
            }
          });
        }
      });
    }
  });
}
function k3(e) {
  const t = ie(wt),
    n = k(() =>
      Za({ node: e.node, index: e.index, isInline: e.isInline, renderNode: _e })
    ),
    r = () => e.node.style ?? "normal",
    i = () =>
      (typeof t.components.block == "function"
        ? t.components.block
        : t.components.block[r()]) ?? t.components.unknownBlockStyle;
  return (
    H(() => {
      i() === t.components.unknownBlockStyle &&
        t.handleMissingComponent(o3(r()), {
          nodeType: "blockStyle",
          type: r()
        });
    }),
    h(Q, {
      get when() {
        return e.key;
      },
      keyed: !0,
      get children() {
        return h(we, {
          get component() {
            return i();
          },
          get index() {
            return n().index;
          },
          get isInline() {
            return n().isInline;
          },
          get value() {
            return n().node;
          },
          renderNode: _e,
          get children() {
            return n().children;
          }
        });
      }
    })
  );
}
function B3(e) {
  const t = ie(wt),
    n = () => t.components.types[e.node._type] ?? t.components.unknownType;
  return (
    H(() => {
      n() ||
        t.handleMissingComponent(Va(e.node._type), {
          nodeType: "block",
          type: e.node._type
        });
    }),
    h(we, {
      get component() {
        return n();
      },
      get value() {
        return e.node;
      },
      get isInline() {
        return e.isInline;
      },
      get index() {
        return e.index;
      },
      renderNode: _e
    })
  );
}
function Za(e) {
  const { node: t, index: n, isInline: r, renderNode: i } = e,
    o = Hh(t),
    s = h(fe, {
      each: o,
      children: (a, l) =>
        h(i, {
          node: a,
          isInline: !0,
          get index() {
            return l();
          },
          renderNode: i
        })
    });
  return {
    _key: t._key || `block-${n}`,
    children: s,
    index: n,
    isInline: r,
    node: t
  };
}
var N3 = S("<div>");
const R3 = Mt(),
  D3 = se.createFetcher("/_m/94ab32eb33/action", !0);
function M3(e) {
  const t = ie(Qe),
    [n, r] = R3(),
    i = () => t()?.newsletterDialog?.body ?? [],
    [o, { Form: s }] = ri(D3, { invalidate: [] });
  return (
    H(() => {
      o.result && r(!1);
    }),
    H(() => {
      n() && o.clear();
    }),
    h(
      _i,
      F(e, {
        titleChildren: "MáLà Mail",
        textColor: "var(--color-green)",
        fillColor: "var(--color-paleGreen)",
        get inputs() {
          return [
            h(Q, {
              get when() {
                return i().length > 0;
              },
              get children() {
                var a = E(N3);
                return (
                  x(
                    a,
                    h(qa, {
                      get value() {
                        return i();
                      }
                    })
                  ),
                  D(() => M(a, An.body)),
                  a
                );
              }
            }),
            h(kh, { name: "email", label: "Email", required: !0 })
          ];
        },
        get pending() {
          return o.pending;
        },
        get error() {
          return o.error;
        },
        component: s,
        get isOpen() {
          return n();
        },
        onOpenChange: r,
        center: !0
      })
    )
  );
}
const H3 = {
  openInquireDialog: ad,
  openEventsDialog: dd,
  openReserveDialog: Ah,
  openNewsletterDialog: M3
};
function za(e) {
  const [t, n] = le(e, ["label", "action", "_type", "children"]);
  return h(
    we,
    F(
      {
        get component() {
          return H3[t.action ?? ""] ?? Yn;
        }
      },
      n,
      {
        get children() {
          return h(Q, {
            get when() {
              return bi(t.label);
            },
            get fallback() {
              return t.children;
            },
            get children() {
              return h(
                Nt,
                F(() => t.label)
              );
            }
          });
        }
      }
    )
  );
}
function fn(e) {
  const [t, n] = le(e, ["label", "children"]),
    r = !n.href.startsWith("/");
  return h(
    p2,
    F({ as: Nc }, n, {
      get class() {
        return q(n.class, ce.focusVisible);
      },
      target: r ? "_blank" : void 0,
      rel: r ? "noopener noreferrer" : void 0,
      get noScroll() {
        return e.noScrollToTop != null && e.noScrollToTop ? !0 : void 0;
      },
      get children() {
        return h(Q, {
          get when() {
            return bi(t.label);
          },
          get fallback() {
            return t.children;
          },
          get children() {
            return h(
              Nt,
              F(() => t.label)
            );
          }
        });
      }
    })
  );
}
function Mn(e) {
  return h(as, {
    get children() {
      return [
        h(lt, {
          get when() {
            return e._type === "link" ? e : !1;
          },
          keyed: !0,
          children: t => h(fn, t)
        }),
        h(lt, {
          get when() {
            return e._type === "button" ? e : !1;
          },
          keyed: !0,
          children: t => h(za, t)
        })
      ];
    }
  });
}
const F3 = "_link_8zwut_1",
  U3 = { link: F3 };
var V3 = S(
  '<svg viewBox="0 0 24 14"fill=none xmlns=http://www.w3.org/2000/svg><path d="M3.064 12.79c.343 0 .668.019.975.091-.108-.614-.144-1.066-.144-1.97V8.745c0-.325 0-.74-.055-1.012.271.054.687.054.994.054h2.873c.903 0 1.355.037 1.969.145a4.261 4.261 0 0 1-.09-.976v-.903c0-.343.018-.668.09-.975-.614.108-1.066.144-1.97.144H4.835c-.307 0-.723 0-.994.054.055-.27.055-.686.055-.993v-.633c0-.307 0-.74-.055-1.011.271.054.687.054.994.054h3.848c.903 0 1.355.036 1.97.144a4.265 4.265 0 0 1-.091-.975V.976c0-.344.018-.669.09-.976-.614.108-1.066.145-1.969.145H1.691c-.344 0-.669-.019-.976-.09C.823.667.86 1.12.86 2.022v8.889c0 .903-.037 1.355-.145 1.969a4.26 4.26 0 0 1 .976-.09h1.373ZM18.907 12.79c2.565 0 4.173-1.39 4.173-3.576 0-1.699-.94-2.764-2.457-3.144v-.036c.94-.325 1.86-1.391 1.86-2.764 0-1.86-1.408-3.125-3.648-3.125h-4.59c-.884 0-1.336-.037-1.95-.145.072.307.09.632.09.976v9.936c0 .903-.036 1.355-.144 1.969a4.26 4.26 0 0 1 .975-.09h5.69ZM15.42 3.488c0-.307 0-.741-.054-1.012.27.054.686.054.994.054h1.463c.994 0 1.572.398 1.572 1.247 0 .83-.506 1.373-1.68 1.373H16.36c-.308 0-.723 0-.994.054.054-.271.054-.687.054-.994v-.722Zm0 4.878c0-.326 0-.741-.054-1.012.27.054.686.054.994.054h1.68c1.156 0 1.842.452 1.842 1.5 0 .975-.668 1.499-1.788 1.499H16.36c-.308 0-.723 0-.994.054.054-.27.054-.704.054-1.012V8.365Z"fill=currentColor>'
);
function G3() {
  return E(V3);
}
var j3 = S(
  '<svg viewBox="0 0 18 14"fill=none xmlns=http://www.w3.org/2000/svg><path d="M2.349 12.917c.343 0 .668.018.975.09-.108-.614-.144-1.065-.144-1.969V2.15c0-.903.036-1.355.144-1.97-.307.073-.632.091-.975.091H.976C.632.271.307.253 0 .181.108.795.145 1.247.145 2.15v8.888c0 .904-.037 1.355-.145 1.97.307-.073.632-.09.976-.09h1.373ZM17.57 5.673h-4.119c-.903 0-1.354-.036-1.969-.145.073.307.09.632.09.976v.813c0 .343-.017.668-.09.975.615-.108 1.066-.144 1.97-.144h.289c.325 0 .722 0 .975-.073l.018.019a2.662 2.662 0 0 0-.09.47c-.072 1.065-.976 2.131-2.8 2.131-1.97 0-3.343-1.572-3.343-4.083 0-2.493 1.337-4.191 3.343-4.191 1.084 0 1.879.47 2.24 1.192.126.199.199.398.235.632l.018.019c.524-.073.957-.09 1.553-.09.578 0 1.048.017 1.59.09l.018-.019a5.92 5.92 0 0 0-.253-1.011C16.577 1.319 14.698 0 11.825 0c-3.902 0-6.63 2.728-6.63 6.648 0 4.191 2.638 6.54 5.89 6.54 2.06 0 3.27-.994 3.74-1.879l.072.018c-.018.723-.054 1.139-.145 1.68.307-.072.633-.09.976-.09h1.011c.344 0 .669.018.976.09-.108-.614-.145-1.065-.145-1.969V5.673Z"fill=currentColor>'
);
function q3() {
  return E(j3);
}
var Z3 = S(
  '<svg viewBox="0 0 25 14"fill=none xmlns=http://www.w3.org/2000/svg><path d="M11.931 1.951c.398-.65.94-1.373 1.337-1.879L13.25.054c-.47.072-.903.09-1.897.09-.777 0-1.427-.018-2.06-.09l-.017.018c-.073.524-.307.994-.705 1.662l-.976 1.68c-.415.723-.668 1.193-.812 1.663h-.037c-.144-.47-.397-.94-.83-1.663l-.994-1.662c-.38-.65-.65-1.138-.759-1.68L4.145.054c-.632.072-1.156.09-1.897.09C1.272.145.748.127.08.055v.018c.416.488.795.994 1.3 1.77l3.813 5.999v3.07c0 .904-.036 1.356-.145 1.97a4.26 4.26 0 0 1 .976-.09h1.355c.343 0 .668.018.975.09-.108-.614-.144-1.066-.144-1.97V7.914L11.93 1.95ZM19.908 12.79c.343 0 .668.019.976.091a11.573 11.573 0 0 1-.145-1.97V3.686c0-.325 0-.74-.054-1.011.27.054.705.054 1.012.054h1.174c.885 0 1.337.036 1.951.144a4.265 4.265 0 0 1-.09-.975V.976c0-.344.018-.669.09-.976-.614.108-1.066.145-1.951.145h-7.299c-.885 0-1.337-.037-1.95-.145.071.307.09.632.09.976v.92c0 .344-.019.67-.09.976.613-.108 1.065-.144 1.95-.144h1.175c.307 0 .74 0 1.011-.054-.054.27-.054.686-.054 1.011v7.227c0 .903-.054 1.355-.145 1.969a4.26 4.26 0 0 1 .976-.09h1.373Z"fill=currentColor>'
);
function z3() {
  return E(Z3);
}
const W3 = { instagram: q3, facebook: G3, youtube: z3 };
function X3(e) {
  return h(fn, {
    get href() {
      return e.href;
    },
    get "aria-label"() {
      return e.icon;
    },
    get class() {
      return U3.link;
    },
    get children() {
      return h(we, {
        get component() {
          return W3[e.icon];
        }
      });
    }
  });
}
var Uo = S("<nav>"),
  Q3 = S("<div role=region aria-label=Credits><!$><!/><!$><!/>"),
  K3 = S(
    "<footer><!$><!/><!$><!/><div><div>©<!$><!/> MáLà Project.</div><!$><!/>"
  );
function Y3() {
  const [e, t] = L(!1),
    n = ie(Qe),
    r = new Date().getFullYear();
  return (() => {
    var i = E(K3),
      o = i.firstChild,
      [s, a] = X(o.nextSibling),
      l = s.nextSibling,
      [f, u] = X(l.nextSibling),
      c = f.nextSibling,
      d = c.firstChild,
      g = d.firstChild,
      m = g.nextSibling,
      [p, b] = X(m.nextSibling);
    p.nextSibling;
    var $ = d.nextSibling,
      [A, N] = X($.nextSibling);
    return (
      x(
        i,
        h(Q, {
          get when() {
            return n()?.footer?.links?.length ?? 0 > 0;
          },
          get children() {
            var T = E(Uo);
            return (
              x(
                T,
                h(fe, {
                  get each() {
                    return n()?.footer?.links;
                  },
                  children: I =>
                    h(
                      Mn,
                      F(I, {
                        get class() {
                          return ot.link;
                        }
                      })
                    )
                })
              ),
              D(() => M(T, ot.links)),
              T
            );
          }
        }),
        s,
        a
      ),
      x(
        i,
        h(Q, {
          get when() {
            return n()?.footer?.socialLinks?.length ?? 0 > 0;
          },
          get children() {
            var T = E(Uo);
            return (
              x(
                T,
                h(fe, {
                  get each() {
                    return n()?.footer?.socialLinks;
                  },
                  children: I => h(X3, I)
                })
              ),
              D(() => M(T, ot.socialLinks)),
              T
            );
          }
        }),
        f,
        u
      ),
      x(d, r, p, b),
      x(
        c,
        h(Q, {
          get when() {
            return n()?.footer?.credits;
          },
          get children() {
            var T = E(Q3),
              I = T.firstChild,
              [z, re] = X(I.nextSibling),
              R = z.nextSibling,
              [G, O] = X(R.nextSibling);
            return (
              x(
                T,
                h(ha, {
                  get pressed() {
                    return e();
                  },
                  onChange: t,
                  get class() {
                    return ce.focusVisible;
                  },
                  children: v =>
                    h(Q, {
                      get when() {
                        return v.pressed();
                      },
                      fallback: "Credits",
                      children: "Close"
                    })
                }),
                z,
                re
              ),
              x(
                T,
                h(Q, {
                  get when() {
                    return e();
                  },
                  get children() {
                    return h(Qr, {
                      withMask: !0,
                      pauseOnHover: !0,
                      get class() {
                        return ot.marquee;
                      },
                      get children() {
                        return h(qa, {
                          get value() {
                            return n()?.footer?.credits ?? [];
                          }
                        });
                      }
                    });
                  }
                }),
                G,
                O
              ),
              D(() => M(T, q(pe.sansSmall, ot.credits))),
              T
            );
          }
        }),
        A,
        N
      ),
      D(
        T => {
          var I = q(Fe.grid, ot.footer),
            z = q(pe.sansSmall, ot.small);
          return I !== T.e && M(i, (T.e = I)), z !== T.t && M(c, (T.t = z)), T;
        },
        { e: void 0, t: void 0 }
      ),
      i
    );
  })();
}
const J3 = "_header_uqaal_1",
  e4 = "_fixed_uqaal_15",
  t4 = "_tempFixed_uqaal_16",
  n4 = "_spacer_uqaal_25",
  r4 = "_title_uqaal_31",
  Zt = { header: J3, fixed: e4, tempFixed: t4, spacer: n4, title: r4 },
  i4 = "_hamburger_gd51x_1",
  o4 = "_spacer_gd51x_6",
  Vo = { hamburger: i4, spacer: o4 };
var s4 = S(
    '<svg viewBox="0 0 15 14"fill=none xmlns=http://www.w3.org/2000/svg><path fill-rule=evenodd clip-rule=evenodd d="M15 1.75H0V.25h15v1.5ZM15 13.75H0v-1.5h15v1.5ZM15 7.75H0v-1.5h15v1.5Z"fill=currentColor>'
  ),
  a4 = S("<div>");
function l4(e) {
  return (() => {
    var t = E(a4);
    return (
      x(
        t,
        h(Q, {
          get when() {
            return !e.spacer;
          },
          get children() {
            var n = E(s4);
            return D(() => oe(n, "class", Vo.hamburger)), n;
          }
        })
      ),
      D(n => pt(t, { [Vo.spacer]: e.spacer }, n)),
      t
    );
  })();
}
const br = {
  switch: "_switch_b16qd_1",
  "left-keyframe-0": "_left-keyframe-0_b16qd_21",
  "left-keyframe-2": "_left-keyframe-2_b16qd_25",
  "left-keyframe-1": "_left-keyframe-1_b16qd_29",
  "right-keyframe-1": "_right-keyframe-1_b16qd_33",
  "right-keyframe-0": "_right-keyframe-0_b16qd_37",
  "right-keyframe-2": "_right-keyframe-2_b16qd_37"
};
var c4 = S(
  '<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 40 40"fill=currentColor><g><path d=m6,12.536c.949.106,2.073.098,3.35.072,1.171-.024,2.04-.041,2.339.583.079.165.119.673-.256,1.462-.044.092-.16.373-.16.373l1.496,1.018.271-.451c.541-.901.907-1.716,1.088-2.422.195-.761.185-1.429-.032-1.985-.334-.86-1.103-1.468-2.285-1.807-1.076-.309-2.546-.405-4.362-.28-1.21.071-1.775-.008-2.03-.086-.342-.111-.752-.41-1.219-.889l-.235-.241-1.879.698,6.531,16.799c-1.353-.276-2.627-.217-3.803.156C1.227,26.675-.207,29.215.024,30.468c.295,1.604,1.884,1.816,3.14,1.816.981,0,2.167-.229,3.599-.694,1.57-.509,2.783-1.151,3.606-1.911.891-.828,1.309-1.667,1.241-2.491-.019-.232-.117-.572-.311-1.07l-5.3-13.582Z></path><path d=m32.943,5.7c-.805-.778-2.058-1.554-3.72-2.295-1.102-.506-1.563-.84-1.752-1.029-.25-.258-.471-.715-.659-1.357l-.095-.323-1.987-.266-2.122,17.898c-1.065-.879-2.217-1.425-3.431-1.648-3.7-.678-6.158.891-6.544,2.106-.493,1.554.81,2.488,1.919,3.078.866.461,2.021.816,3.503,1.077,1.625.288,2.997.29,4.082.006,1.176-.313,1.938-.857,2.266-1.617.093-.214.165-.56.228-1.091l1.698-14.48c.788.539,1.785,1.06,2.924,1.636,1.045.529,1.82.922,1.791,1.613-.008.183-.211.65-.913,1.17-.081.06-.316.254-.316.254l.842,1.601.45-.271c.901-.541,1.607-1.089,2.098-1.627.53-.58.834-1.175.904-1.767.109-.916-.284-1.814-1.169-2.668Z>'
);
function Wa(e) {
  const [t, n] = le(e, ["class"]),
    [r, i] = L(0),
    [o, s] = L(!1),
    { isMuted: a, setIsMuted: l } = _t();
  let f;
  return (
    Be(() => {
      s(!0), a() || (f = setInterval(() => i((r() + 1) % 3), 673));
    }),
    H(() => {
      window.clearInterval(f),
        (f = void 0),
        a() || (f = setInterval(() => i((r() + 1) % 3), 673));
    }),
    h(
      ha,
      F(n, {
        "aria-label": "Mute",
        get class() {
          return q(t.class, br.switch, ce.focusVisible);
        },
        get pressed() {
          return k(() => !!o())() && a();
        },
        onChange: l,
        get children() {
          var u = E(c4),
            c = u.firstChild,
            d = c.firstChild,
            g = d.nextSibling;
          return (
            D(
              m => {
                var p = br[`left-keyframe-${r()}`],
                  b = br[`right-keyframe-${r()}`];
                return (
                  p !== m.e && oe(d, "class", (m.e = p)),
                  b !== m.t && oe(g, "class", (m.t = b)),
                  m
                );
              },
              { e: void 0, t: void 0 }
            ),
            u
          );
        }
      })
    )
  );
}
function u4(e, t, n) {
  let r, i;
  const o = typeof window < "u" && "MutationObserver" in window;
  typeof t == "function" ? ((r = {}), (i = t)) : ((r = t), (i = n));
  const s = o ? new MutationObserver(i) : void 0,
    a = (u, c) => s?.observe(u, j(c) ?? r),
    l = () => {
      Xu(j(e)).forEach(u => {
        u instanceof Node ? a(u, r) : a(u[0], u[1]);
      });
    },
    f = () => s?.disconnect();
  return Be(l), U(f), [a, { start: l, stop: f, instance: s, isSupported: o }];
}
function f4(e) {
  u4(
    () => document.documentElement,
    { attributes: !0 },
    t => {
      for (let n of t)
        n.attributeName === "style" &&
          n.target instanceof HTMLElement &&
          e(n.target.style);
    }
  );
}
const wi = an(() => {
  const [e, t] = L(void 0),
    [n, r] = L(void 0);
  return (
    f4(i => {
      t(i.paddingRight), r(i.overflow);
    }),
    { paddingRight: e, overflow: n }
  );
});
var d4 = S(
  '<svg viewBox="0 0 165 19"fill=currentColor xmlns=http://www.w3.org/2000/svg aria-label="MÁLÀ PROJECT"><path d=m15.091,5.331c.026-.284.065-.581.116-.892-.271.065-.621.097-1.047.097h-2.191c-.401,0-.705-.038-.911-.116,0,.245-.029.485-.087.717-.058.233-.152.536-.281.912l-.058.213-2.113,6.069c-.349,1.034-.562,1.939-.64,2.714h-.058c-.039-.465-.116-.914-.233-1.347-.116-.433-.271-.941-.466-1.522l-2.327-6.806-.019-.039c-.052-.168-.1-.336-.146-.504-.045-.168-.061-.323-.049-.466-.22.078-.443.126-.669.146-.226.019-.527.029-.902.029h-1.571c-.426,0-.775-.032-1.047-.097.065.311.107.608.126.892.02.285.029.627.029,1.028v9.927c0,.4-.009.743-.029,1.027-.019.284-.061.582-.126.892.272-.065.621-.097,1.047-.097h.795c.426,0,.775.032,1.047.097-.065-.31-.107-.608-.126-.892-.02-.284-.029-.627-.029-1.027v-5.507c0-1.086-.032-2.159-.097-3.219h.058c.233,1.085.511,2.088.834,3.006l2.017,5.816c.013.052.029.097.049.136.019.038.035.084.048.136.129.362.223.657.281.882.058.226.087.455.087.689.194-.078.498-.117.912-.117h.989c.413,0,.717.039.912.117,0-.233.029-.462.087-.689.058-.226.152-.52.281-.882.013-.052.029-.097.049-.136.02-.039.036-.084.049-.136l2.017-5.816c.194-.543.362-1.057.504-1.542.142-.485.252-.967.33-1.444h.058c-.065,1.099-.097,2.165-.097,3.199v5.507c0,.4-.013.743-.039,1.027-.026.284-.065.582-.116.892.271-.065.621-.097,1.047-.097h.776c.426,0,.776.032,1.047.097-.052-.31-.09-.608-.116-.892-.026-.284-.039-.627-.039-1.027V6.36c0-.401.013-.743.039-1.028Z></path><path d=m26.065,6.282c-.117-.323-.226-.659-.33-1.009-.104-.349-.162-.62-.175-.814l-.019-.02c-.466.065-1.079.097-1.842.097-.75,0-1.331-.032-1.745-.097l-.02.02c-.026.194-.09.465-.194.814-.104.349-.213.679-.33.989l-3.587,9.675c-.336.93-.659,1.674-.969,2.23l.02.02c.375-.052.911-.078,1.609-.078.543,0,1.027.026,1.454.078l.019-.02c.052-.31.107-.585.165-.824.058-.239.158-.546.301-.921l.291-.854c.09-.245.168-.516.233-.814.233.038.543.058.93.058h3.529c.413,0,.73-.02.95-.058.026.193.097.465.214.814l.271.814c.103.298.194.589.272.873.078.284.142.588.194.911l.019.02c.453-.052.963-.078,1.532-.078.711,0,1.261.026,1.648.078l.02-.02c-.323-.529-.653-1.273-.989-2.23l-3.471-9.656Zm-.466,6.321c-.31-.026-.627-.038-.95-.038h-1.959c-.375,0-.691.013-.95.038l-.02-.019c.142-.272.258-.556.349-.854l.814-2.191c.414-1.176.685-2.061.814-2.656h.058c.103.595.362,1.487.776,2.676l.737,2.152c.116.337.233.627.349.873l-.02.019Z></path><path d=m23.816,2.811c.427,0,.763.013,1.008.038h.02c.026-.103.09-.226.194-.368l1.202-1.668.194-.271c.142-.194.291-.369.446-.524l-.02-.019c-.31.026-.801.038-1.474.038-.646,0-1.137-.013-1.473-.038l-.02.019c-.026.155-.078.323-.155.504l-.679,1.726c-.09.233-.188.433-.291.601h.02c.22-.026.562-.038,1.027-.038Z></path><path d=m42.63,15.569c-.311.052-.608.091-.892.117-.285.026-.627.039-1.028.039h-4.149c-.453,0-.775.019-.969.058.039-.194.058-.511.058-.95V6.36c0-.401.013-.743.039-1.028.026-.284.064-.581.116-.892-.271.065-.62.097-1.047.097h-.93c-.427,0-.775-.032-1.047-.097.064.311.107.608.126.892.02.285.029.627.029,1.028v9.927c0,.4-.01.743-.029,1.027-.019.284-.061.582-.126.892.272-.065.62-.097,1.047-.097h6.883c.401,0,.743.013,1.028.039.284.025.581.064.892.116-.065-.272-.097-.62-.097-1.047v-.601c0-.427.032-.776.097-1.048Z></path><path d=m52.83,6.282c-.117-.323-.226-.659-.33-1.009-.103-.349-.162-.62-.175-.814l-.02-.02c-.465.065-1.079.097-1.842.097-.749,0-1.331-.032-1.745-.097l-.02.02c-.026.194-.091.465-.194.814s-.213.679-.329.989l-3.587,9.675c-.336.93-.659,1.674-.969,2.23l.02.02c.374-.052.911-.078,1.609-.078.543,0,1.027.026,1.454.078l.02-.02c.051-.31.106-.585.164-.824.059-.239.159-.546.301-.921l.291-.854c.09-.245.168-.516.233-.814.233.038.543.058.931.058h3.529c.413,0,.73-.02.95-.058.026.193.097.465.214.814l.271.814c.103.298.194.589.272.873.078.284.142.588.193.911l.02.02c.453-.052.963-.078,1.532-.078.711,0,1.261.026,1.648.078l.02-.02c-.323-.529-.653-1.273-.989-2.23l-3.471-9.656Zm-.465,6.321c-.311-.026-.627-.038-.951-.038h-1.958c-.375,0-.692.013-.951.038l-.019-.019c.142-.272.258-.556.349-.854l.814-2.191c.413-1.176.685-2.061.814-2.656h.058c.103.595.362,1.487.776,2.676l.737,2.152c.116.337.233.627.349.873l-.019.019Z></path><path d=m47.905.814l1.202,1.668c.103.142.168.265.194.368h.019c.246-.026.582-.038,1.009-.038.465,0,.807.013,1.027.038h.02c-.104-.168-.2-.368-.291-.601l-.678-1.726c-.078-.181-.129-.349-.155-.504l-.02-.019c-.336.026-.828.038-1.474.038-.672,0-1.163-.013-1.473-.038l-.02.019c.155.155.303.33.446.524l.194.271Z></path><path d=m81.921,5.089c-.659-.368-1.454-.552-2.385-.552h-4.479c-.388,0-.727-.013-1.018-.038-.291-.026-.592-.065-.902-.117.064.272.097.621.097,1.047v10.859c0,.4-.01.743-.029,1.027-.02.284-.061.582-.126.892.271-.065.62-.097,1.047-.097h.93c.427,0,.776.032,1.047.097-.052-.31-.091-.608-.116-.892-.027-.284-.039-.627-.039-1.027v-2.288c0-.453-.02-.775-.058-.969.193.039.517.058.969.058h2.598c1.396,0,2.488-.378,3.277-1.134.789-.756,1.183-1.819,1.183-3.189,0-.801-.168-1.522-.504-2.162-.337-.64-.834-1.144-1.493-1.513Zm-1.406,5.245c-.356.349-.921.524-1.697.524h-1.958c-.453,0-.776.02-.969.058.038-.193.058-.511.058-.95v-2.269c0-.439-.02-.756-.058-.95.193.038.517.058.969.058h2.055c.711,0,1.244.168,1.6.504.356.336.534.834.534,1.493,0,.673-.178,1.183-.534,1.532Z></path><path d=m97.043,13.96c-.065-.724-.265-1.289-.601-1.697-.336-.407-.807-.668-1.415-.785v-.02c.685-.233,1.247-.623,1.687-1.173.439-.549.659-1.244.659-2.084,0-1.164-.365-2.065-1.095-2.705-.731-.64-1.774-.96-3.132-.96h-4.983c-.388,0-.727-.013-1.018-.038-.291-.026-.592-.065-.902-.117.064.272.097.621.097,1.047v10.859c0,.4-.01.743-.029,1.027-.02.284-.061.582-.126.892.271-.065.62-.097,1.047-.097h.93c.427,0,.776.032,1.047.097-.052-.31-.091-.608-.116-.892-.027-.284-.039-.627-.039-1.027v-2.715c0-.439-.02-.756-.058-.95.193.039.517.058.969.058h2.094c.801,0,1.363.175,1.687.524.323.349.511.912.562,1.687l.078,1.493c.026.414.078.766.155,1.057.078.291.187.54.33.747l.02.02c.374-.065.892-.097,1.551-.097.608,0,1.092.032,1.454.097l.02-.02c-.362-.453-.582-1.092-.659-1.919l-.213-2.308Zm-3.103-3.994c-.374.336-.905.504-1.59.504h-2.385c-.453,0-.776.019-.969.058.038-.194.058-.511.058-.95v-1.901c0-.452-.02-.775-.058-.969.193.039.517.059.969.059h2.443c.685,0,1.206.152,1.561.455.356.304.534.759.534,1.367,0,.582-.188,1.041-.563,1.377Z></path><path d=m110.089,5.148c-1.021-.601-2.184-.902-3.49-.902-1.28,0-2.433.3-3.461.902-1.028.601-1.833,1.448-2.414,2.54-.582,1.092-.873,2.35-.873,3.771,0,1.332.281,2.524.844,3.578.562,1.054,1.357,1.878,2.385,2.472,1.028.595,2.201.892,3.52.892,1.331,0,2.511-.297,3.538-.892,1.027-.594,1.822-1.418,2.385-2.472.562-1.053.844-2.246.844-3.578,0-1.421-.291-2.679-.872-3.771-.582-1.092-1.384-1.939-2.405-2.54Zm-.038,8.667c-.31.717-.763,1.277-1.357,1.677-.595.401-1.293.601-2.094.601s-1.497-.2-2.084-.601c-.589-.4-1.038-.96-1.348-1.677-.31-.717-.465-1.548-.465-2.491,0-.982.165-1.832.495-2.549s.789-1.267,1.377-1.648c.588-.381,1.264-.572,2.026-.572.775,0,1.457.191,2.045.572.588.381,1.047.931,1.377,1.648.33.717.495,1.567.495,2.549,0,.944-.155,1.774-.465,2.491Z></path><path d=m121.611,4.537c-.426,0-.775-.032-1.047-.097.065.311.107.608.126.892.02.285.029.627.029,1.028v7.852c0,.659-.142,1.148-.426,1.464-.285.317-.673.475-1.164.475-.504,0-.898-.165-1.183-.495-.285-.33-.427-.83-.427-1.502v-.078c0-.284.006-.514.02-.688.013-.175.045-.333.097-.476l-.02-.019c-.323.064-.808.096-1.454.096-.62,0-1.099-.032-1.435-.096l-.02.019c.038.168.064.349.078.543.013.193.02.433.02.717v.116c0,1.306.358,2.318,1.076,3.035s1.748,1.076,3.093,1.076c1.435,0,2.531-.346,3.286-1.037.756-.691,1.134-1.729,1.134-3.112v-7.891c0-.401.013-.743.039-1.028.026-.284.064-.581.116-.892-.271.065-.62.097-1.047.097h-.892Z></path><path d=m137.091,15.647c-.31.052-.608.09-.892.116s-.627.039-1.027.039h-4.595c-.453,0-.776.019-.969.058.038-.194.058-.517.058-.969v-1.726c0-.439-.02-.756-.058-.95.193.039.517.058.969.058h3.819c.388,0,.727.01,1.018.029.291.02.585.061.882.126-.065-.271-.097-.62-.097-1.047v-.485c0-.426.032-.775.097-1.047-.298.065-.592.107-.882.126-.291.02-.63.029-1.018.029h-3.819c-.453,0-.776.02-.969.059.038-.194.058-.511.058-.95v-1.358c0-.452-.02-.775-.058-.969.193.039.517.059.969.059h4.343c.4,0,.743.013,1.027.038s.582.065.892.117c-.065-.272-.097-.621-.097-1.047v-.524c0-.426.032-.775.097-1.047-.31.052-.608.091-.892.117s-.627.038-1.027.038h-6.147c-.401,0-.743-.013-1.027-.038s-.582-.065-.892-.117c.064.272.097.621.097,1.047v11.789c0,.427-.033.775-.097,1.047.31-.052.608-.091.892-.116.284-.027.627-.039,1.027-.039h6.399c.4,0,.743.013,1.027.039.284.025.582.064.892.116-.065-.272-.097-.62-.097-1.047v-.523c0-.427.032-.776.097-1.047Z></path><path d=m150.614,12.816c-.569,0-1.047-.032-1.435-.097l-.019.02c.025.09.038.2.038.33,0,.517-.126,1.011-.378,1.483-.252.472-.627.856-1.125,1.154-.498.298-1.096.446-1.794.446-.75,0-1.415-.193-1.997-.582-.582-.388-1.034-.946-1.357-1.677-.323-.73-.485-1.593-.485-2.589s.161-1.861.485-2.598c.323-.737.782-1.299,1.376-1.687.594-.388,1.28-.582,2.056-.582.646,0,1.212.149,1.697.446.485.298.837.691,1.057,1.183.142.284.233.569.271.853l.02.02c.362-.065.827-.097,1.396-.097.555,0,1.027.032,1.415.097l.02-.02c-.065-.427-.161-.821-.291-1.183-.363-1.086-1.021-1.939-1.978-2.56-.956-.62-2.146-.93-3.567-.93-1.319,0-2.498.291-3.539.872-1.041.582-1.852,1.416-2.433,2.501-.582,1.086-.873,2.359-.873,3.82,0,1.435.288,2.676.863,3.723.575,1.047,1.373,1.845,2.394,2.394,1.021.55,2.197.824,3.529.824,1.59,0,2.899-.385,3.927-1.154,1.027-.769,1.697-1.774,2.007-3.015.129-.465.193-.956.193-1.473l-.019-.02c-.388.065-.873.097-1.454.097Z></path><path d=m164.699,5.429c0-.426.032-.775.096-1.047-.31.052-.608.091-.892.117s-.627.038-1.027.038h-7.833c-.401,0-.743-.013-1.027-.038s-.582-.065-.892-.117c.065.272.097.621.097,1.047v.543c0,.427-.032.776-.097,1.048.31-.052.608-.091.892-.117.284-.026.627-.039,1.027-.039h1.648c.452,0,.775-.019.969-.058-.039.194-.058.518-.058.969v8.512c0,.4-.013.743-.039,1.027-.026.284-.065.582-.116.892.271-.065.62-.097,1.047-.097h.93c.427,0,.775.032,1.047.097-.065-.31-.107-.608-.126-.892-.02-.284-.029-.627-.029-1.027V7.775c0-.452-.02-.775-.058-.969.193.039.511.058.95.058h1.667c.401,0,.743.013,1.027.039.284.026.582.065.892.117-.064-.272-.096-.621-.096-1.048v-.543Z>'
);
function Xa() {
  return (() => {
    var e = E(d4);
    return e.style.setProperty("aspect-ratio", "165 / 19"), e;
  })();
}
const h4 = "_dialog_nhxtj_1",
  g4 = "_nav_nhxtj_6",
  m4 = "_link_nhxtj_12",
  p4 = "_footer_nhxtj_20",
  v4 = "_footerSeal_nhxtj_25",
  y4 = "_rotating_nhxtj_1",
  b4 = "_galleryDialogButton_nhxtj_31",
  Et = {
    dialog: h4,
    nav: g4,
    link: m4,
    footer: p4,
    footerSeal: v4,
    rotating: y4,
    galleryDialogButton: b4
  },
  _4 = "_sealContainer_1cyp4_1",
  w4 = "_seal_1cyp4_1",
  x4 = "_sealBg_1cyp4_17",
  _r = { sealContainer: _4, seal: w4, sealBg: x4 },
  E4 = "/assets/seal-83f26237.png",
  S4 = "/assets/seal-bg-5162a377.gif";
var A4 = S("<div><!$><!/><!$><!/>");
function $4(e) {
  return (() => {
    var t = E(A4),
      n = t.firstChild,
      [r, i] = X(n.nextSibling),
      o = r.nextSibling,
      [s, a] = X(o.nextSibling);
    return (
      x(
        t,
        h(zr, {
          src: S4,
          get class() {
            return _r.sealBg;
          },
          alt: "Pink and red gradient background"
        }),
        r,
        i
      ),
      x(
        t,
        h(zr, {
          src: E4,
          get class() {
            return _r.seal;
          },
          alt: "MáLà Project brand seal"
        }),
        s,
        a
      ),
      D(
        l => {
          var f = q(e.class, _r.sealContainer),
            u = e.style;
          return f !== l.e && M(t, (l.e = f)), (l.t = It(t, u, l.t)), l;
        },
        { e: void 0, t: void 0 }
      ),
      t
    );
  })();
}
var C4 = S("<nav>"),
  T4 = S("<div>Enter"),
  P4 = S("<div lang=zh>进入"),
  I4 = S("<footer><!$><!/><!$><!/>");
const O4 = Mt();
function L4(e) {
  const t = ni(),
    { setHeaderDialogRouteChange: n } = _t(),
    r = ie(Qe),
    i = () => r()?.header?.links ?? [],
    o = () => r()?.header?.dialogLinks ?? [],
    s = si("(max-width: 700px)"),
    [a, l] = O4();
  return (
    H(() => {
      (!s() || !t()) && l(!1);
    }),
    H(() => {
      n(!a());
    }),
    h(cn, {
      get open() {
        return a();
      },
      onOpenChange: l,
      modal: !0,
      preventScroll: !0,
      get children() {
        return [
          h(
            Jn,
            F(e, {
              get class() {
                return q(e.class, ce.focusVisible);
              }
            })
          ),
          h(ln, {
            get children() {
              return h(pi, {
                get class() {
                  return q(
                    ce.verticalScroll,
                    ce.dialog,
                    ce.fixFlashing,
                    Et.dialog
                  );
                },
                get children() {
                  return [
                    h(Qa, { withCloseButton: !0 }),
                    h(m2, { class: "visually-hidden", children: "Navigation" }),
                    (() => {
                      var f = E(C4);
                      return (
                        x(
                          f,
                          h(fe, {
                            get each() {
                              return [...o(), ...i()];
                            },
                            children: u =>
                              h(
                                Mn,
                                F(
                                  {
                                    get class() {
                                      return q(pe.sansDisplay, Et.link);
                                    }
                                  },
                                  u
                                )
                              )
                          })
                        ),
                        D(() => M(f, q(Et.nav, Fe.grid))),
                        f
                      );
                    })(),
                    (() => {
                      var f = E(I4),
                        u = f.firstChild,
                        [c, d] = X(u.nextSibling),
                        g = c.nextSibling,
                        [m, p] = X(g.nextSibling);
                      return (
                        x(
                          f,
                          h(Q, {
                            get when() {
                              return r();
                            },
                            get children() {
                              return h($4, {
                                get class() {
                                  return Et.footerSeal;
                                }
                              });
                            }
                          }),
                          c,
                          d
                        ),
                        x(
                          f,
                          h(La, {
                            get class() {
                              return Et.galleryDialogButton;
                            },
                            get children() {
                              return h(Oa, {
                                get class() {
                                  return pe.sansDisplay;
                                },
                                interval: 1500,
                                duration: 0,
                                get children() {
                                  return [E(T4), E(P4)];
                                }
                              });
                            }
                          }),
                          m,
                          p
                        ),
                        D(() => M(f, q(Et.footer, Fe.grid))),
                        f
                      );
                    })()
                  ];
                }
              });
            }
          })
        ];
      }
    })
  );
}
var k4 = S("<div>"),
  B4 = S("<header><!$><!/><!$><!/><!$><!/><!$><!/>");
let wr;
const Qa = e => {
    const t = wi(),
      [n, r] = L(),
      i = !e.withCloseButton && !e.fixed;
    H(() => {
      t.overflow() === "hidden" && i && r(o());
    });
    function o() {
      return wr.getBoundingClientRect().height;
    }
    return (
      Be(() => {
        r(o());
      }),
      (() => {
        var s = E(B4),
          a = s.firstChild,
          [l, f] = X(a.nextSibling),
          u = l.nextSibling,
          [c, d] = X(u.nextSibling),
          g = c.nextSibling,
          [m, p] = X(g.nextSibling),
          b = m.nextSibling,
          [$, A] = X(b.nextSibling),
          N = wr;
        return (
          typeof N == "function" ? ze(N, s) : (wr = s),
          x(
            s,
            h(Q, {
              get when() {
                return t.overflow() === "hidden" && i;
              },
              get children() {
                return h(ds, {
                  get mount() {
                    return document.getElementById("pageSpacer") ?? void 0;
                  },
                  get children() {
                    var T = E(k4);
                    return (
                      D(
                        I => {
                          var z = q(Zt.spacer),
                            re = `${n()}px`;
                          return (
                            z !== I.e && M(T, (I.e = z)),
                            re !== I.t &&
                              ((I.t = re) != null
                                ? T.style.setProperty("height", re)
                                : T.style.removeProperty("height")),
                            I
                          );
                        },
                        { e: void 0, t: void 0 }
                      ),
                      T
                    );
                  }
                });
              }
            }),
            l,
            f
          ),
          x(
            s,
            h(Q, {
              get when() {
                return e.withCloseButton;
              },
              get fallback() {
                return h(L4, {
                  "aria-label": "Navigation",
                  get children() {
                    return h(l4, {});
                  }
                });
              },
              get children() {
                return h(Nn, {
                  get class() {
                    return ce.focusVisible;
                  },
                  get children() {
                    return h(Na, {});
                  }
                });
              }
            }),
            c,
            d
          ),
          x(
            s,
            h(we, {
              get component() {
                return e.withHeading ? "h1" : "div";
              },
              get children() {
                return h(fn, {
                  href: "/",
                  get class() {
                    return Zt.title;
                  },
                  get children() {
                    return h(Xa, {});
                  }
                });
              }
            }),
            m,
            p
          ),
          x(s, h(Wa, {}), $, A),
          D(
            T => {
              var I = q(ce.backgroundShadow, pe.sansNav, Zt.header),
                z = {
                  [Zt.fixed]: e.fixed,
                  [Zt.tempFixed]: t.overflow() === "hidden" && i
                };
              return I !== T.e && M(s, (T.e = I)), (T.t = pt(s, z, T.t)), T;
            },
            { e: void 0, t: void 0 }
          ),
          s
        );
      })()
    );
  },
  N4 = "_header_lu6a5_1",
  R4 = "_fixed_lu6a5_6",
  D4 = "_layout_lu6a5_10",
  M4 = "_start_lu6a5_26",
  H4 = "_center_lu6a5_33",
  F4 = "_end_lu6a5_40",
  U4 = "_title_lu6a5_47",
  V4 = "_withExtendedTitle_lu6a5_84",
  Ye = {
    header: N4,
    fixed: R4,
    layout: D4,
    start: M4,
    center: H4,
    end: F4,
    title: U4,
    withExtendedTitle: V4
  },
  G4 = "/assets/header-title-extended-1e1bf12d.png";
var j4 = S("<img aria-label=麻辣计划>"),
  q4 = S("<header><div><!$><!/><!$><!/><!$><!/>");
const Z4 = 14,
  z4 = e => {
    const t = ie(Qe),
      n = () => t()?.header?.links,
      r = () => Math.min(n()?.length ?? 0, 8),
      i = () => Math.ceil(r() / 2),
      o = () => n()?.slice(0, i()),
      s = () => n()?.slice(i(), r());
    return h(va, {
      get fixed() {
        return e.fixed;
      },
      get class() {
        return q(ce.backgroundShadow, pe.sansNav, Ye.header);
      },
      get classList() {
        return { [Ye.fixed]: e.fixed };
      },
      get children() {
        var a = E(q4),
          l = a.firstChild,
          f = l.firstChild,
          [u, c] = X(f.nextSibling),
          d = u.nextSibling,
          [g, m] = X(d.nextSibling),
          p = g.nextSibling,
          [b, $] = X(p.nextSibling);
        return (
          x(
            l,
            h(fe, {
              get each() {
                return o();
              },
              children: A =>
                h(
                  Mn,
                  F(
                    {
                      get class() {
                        return Ye.start;
                      }
                    },
                    A
                  )
                )
            }),
            u,
            c
          ),
          x(
            l,
            h(we, {
              get component() {
                return e.withHeading ? "h1" : "div";
              },
              get class() {
                return q(Ye.center, pe.sansCaps);
              },
              get classList() {
                return { [Ye.withExtendedTitle]: e.withExtendedTitle };
              },
              get children() {
                return h(fn, {
                  href: "/",
                  get class() {
                    return Ye.title;
                  },
                  get children() {
                    return [
                      h(Xa, {}),
                      h(Q, {
                        get when() {
                          return e.withExtendedTitle;
                        },
                        get children() {
                          var A = E(j4);
                          return (
                            oe(A, "src", G4),
                            A.style.setProperty("aspect-ratio", "357 / 115"),
                            A
                          );
                        }
                      })
                    ];
                  }
                });
              }
            }),
            g,
            m
          ),
          x(
            l,
            h(fe, {
              get each() {
                return s();
              },
              children: (A, N) =>
                h(
                  Mn,
                  F(
                    {
                      get class() {
                        return Ye.end;
                      },
                      get style() {
                        return {
                          "grid-column-start": N() + Z4 + 1 - (s()?.length ?? 0)
                        };
                      }
                    },
                    A
                  )
                )
            }),
            b,
            $
          ),
          D(
            A => {
              var N = ce.horizontalScroll,
                T = q(Fe.grid, Ye.layout);
              return (
                N !== A.e && M(a, (A.e = N)), T !== A.t && M(l, (A.t = T)), A
              );
            },
            { e: void 0, t: void 0 }
          ),
          a
        );
      }
    });
  },
  W4 = e => [h(Qa, e), h(z4, e)],
  X4 = "_footer_l85ey_1",
  Q4 = "_fixed_l85ey_7",
  K4 = "_button_l85ey_11",
  Go = { footer: X4, fixed: Q4, button: K4 };
var Y4 = S("<footer>");
function J4(e) {
  return h(va, {
    get fixed() {
      return e.fixed;
    },
    get class() {
      return Go.footer;
    },
    get children() {
      var t = E(Y4);
      return (
        x(
          t,
          h(Wa, {
            get class() {
              return Go.button;
            }
          })
        ),
        D(() => M(t, Fe.grid)),
        t
      );
    }
  });
}
const e5 = "_article_1ftae_1",
  t5 = "_grid_1ftae_6",
  n5 = "_illustration_1ftae_23",
  xr = { article: e5, grid: t5, illustration: n5 },
  r5 = "/assets/error-illustration-d803c085.svg";
var i5 = S("<p>"),
  o5 = S("<section><div><h1></h1><!$><!/><!$><!/><img>");
function s5(e) {
  return (() => {
    var t = E(o5),
      n = t.firstChild,
      r = n.firstChild,
      i = r.nextSibling,
      [o, s] = X(i.nextSibling),
      a = o.nextSibling,
      [l, f] = X(a.nextSibling),
      u = l.nextSibling;
    return (
      x(r, () =>
        e.error.status ? `Error ${e.error.status}` : "Unknown error"
      ),
      x(
        n,
        h(Q, {
          get when() {
            return bi(e.error.localizedMessage);
          },
          get children() {
            var c = E(i5);
            return (
              x(
                c,
                h(
                  Nt,
                  F(() => e.error.localizedMessage)
                )
              ),
              c
            );
          }
        }),
        o,
        s
      ),
      x(
        n,
        h(Q, {
          get when() {
            return e.error.returnLink;
          },
          keyed: !0,
          children: c =>
            h(
              fn,
              F(c, {
                get class() {
                  return pe.sansTitle;
                }
              })
            )
        }),
        l,
        f
      ),
      oe(u, "src", r5),
      D(
        c => {
          var d = q(Fe.grid, Fe.gridMaxWidth, xr.article),
            g = q(Fe.grid, Fe.narrowGridColumn, xr.grid),
            m = pe.serifTitle,
            p = xr.illustration;
          return (
            d !== c.e && M(t, (c.e = d)),
            g !== c.t && M(n, (c.t = g)),
            m !== c.a && M(r, (c.a = m)),
            p !== c.o && M(u, (c.o = p)),
            c
          );
        },
        { e: void 0, t: void 0, a: void 0, o: void 0 }
      ),
      t
    );
  })();
}
const a5 = "_subtitles_1x5la_1",
  l5 = "_lineGroup_1x5la_10",
  c5 = "_line_1x5la_10",
  u5 = "_isGraphicVisible_1x5la_71",
  Pt = { subtitles: a5, lineGroup: l5, line: c5, isGraphicVisible: u5 },
  f5 = "_background_10me8_1",
  d5 = "_content_10me8_2",
  h5 = "_hasInteracted_10me8_26",
  g5 = "_closeButton_10me8_30",
  _n = { background: f5, content: d5, hasInteracted: h5, closeButton: g5 };
var m5 = S("<div>");
const [Kt, Er] = L(!1);
function p5() {
  const { isMuted: e } = _t();
  return (
    H(() => {
      e() && Er(!0);
    }),
    [
      (() => {
        var t = E(m5);
        return (
          D(
            n => {
              var r = !Kt() || void 0,
                i = q(_n.background, { [_n.hasInteracted]: Kt() });
              return (
                r !== n.e && oe(t, "data-expanded", (n.e = r)),
                i !== n.t && M(t, (n.t = i)),
                n
              );
            },
            { e: void 0, t: void 0 }
          ),
          t
        );
      })(),
      h(cn, {
        get open() {
          return !Kt();
        },
        onOpenChange: () => Er(!0),
        get children() {
          return h(ln, {
            get children() {
              return h(pi, {
                get class() {
                  return q(ce.focusVisible, _n.content);
                },
                onClick: [Er, !0],
                onOpenAutoFocus: t => {
                  t.preventDefault();
                },
                get children() {
                  return h(Nn, {
                    get class() {
                      return q(ce.focusVisible, pe.sansNav, _n.closeButton);
                    },
                    get children() {
                      return h(Nt, {
                        en: "Iris x John",
                        zh: "Click anywhere to enter"
                      });
                    }
                  });
                }
              });
            }
          });
        }
      })
    ]
  );
}
var v5 = S(
    "<svg xmlns=http://www.w3.org/2000/svg tabIndex=-1><text x=50% y=50% dominant-baseline=middle text-anchor=middle>"
  ),
  y5 = S("<div><div></div><!$><!/>"),
  b5 = S("<div> "),
  Ka = S("<div><!$><!/><!$><!/>"),
  _5 = S("<div role=presentation>");
const w5 = 4e3,
  [Sr, jo] = L([]),
  x5 = an(() => {
    const [e, t] = L(0);
    Ta(
      () => {
        t(i => i + 1);
      },
      () => (Kt() ? w5 : !1),
      setInterval
    );
    const [n, r] = L();
    return (
      H(
        De(e, () => {
          r(i => {
            const o = i ? Sr().indexOf(i) : -1;
            return Sr()[(o + 1) % Sr().length];
          });
        })
      ),
      n
    );
  });
function Hn(e) {
  const [t, n] = L(),
    r = Xr(t),
    i = () => r.width != null && r.height != null;
  return h(Q, {
    get when() {
      return e.text;
    },
    get fallback() {
      return (() => {
        var o = E(b5);
        return D(() => M(o, q(pe.sansDisplay, Pt.line))), o;
      })();
    },
    get children() {
      var o = E(y5),
        s = o.firstChild,
        a = s.nextSibling,
        [l, f] = X(a.nextSibling);
      return (
        ze(n, s),
        x(s, () => e.text),
        x(
          o,
          h(Q, {
            get when() {
              return i();
            },
            get children() {
              var u = E(v5),
                c = u.firstChild;
              return (
                x(c, () => e.text),
                D(
                  d => {
                    var g = `0 0 ${r.width ?? 0} ${r.height ?? 0}`,
                      m = e.lang;
                    return (
                      g !== d.e && oe(u, "viewBox", (d.e = g)),
                      m !== d.t && oe(c, "lang", (d.t = m)),
                      d
                    );
                  },
                  { e: void 0, t: void 0 }
                ),
                u
              );
            }
          }),
          l,
          f
        ),
        D(
          u => {
            var c = q(pe.sansDisplay, Pt.line),
              d = { [Pt.isGraphicVisible]: i() },
              g = e.lang;
            return (
              c !== u.e && M(o, (u.e = c)),
              (u.t = pt(o, d, u.t)),
              g !== u.a && oe(s, "lang", (u.a = g)),
              u
            );
          },
          { e: void 0, t: void 0, a: void 0 }
        ),
        o
      );
    }
  });
}
function E5(e) {
  return (() => {
    var t = E(Ka),
      n = t.firstChild,
      [r, i] = X(n.nextSibling),
      o = r.nextSibling,
      [s, a] = X(o.nextSibling);
    return (
      x(
        t,
        h(Hn, {
          get text() {
            return e.en;
          }
        }),
        r,
        i
      ),
      x(
        t,
        h(Hn, {
          get text() {
            return e.zh;
          },
          lang: "zh"
        }),
        s,
        a
      ),
      D(() => M(t, Pt.lineGroup)),
      t
    );
  })();
}
function S5(e) {
  return (
    Be(() => {
      jo(t => [...t, e]);
    }),
    U(() => {
      jo(t => t.filter(n => n !== e));
    }),
    []
  );
}
function A5() {
  const e = x5();
  return (() => {
    var t = E(_5);
    return (
      x(
        t,
        h(Q, {
          get when() {
            return e();
          },
          keyed: !0,
          get fallback() {
            return (() => {
              var n = E(Ka),
                r = n.firstChild,
                [i, o] = X(r.nextSibling),
                s = i.nextSibling,
                [a, l] = X(s.nextSibling);
              return (
                x(n, h(Hn, {}), i, o),
                x(n, h(Hn, {}), a, l),
                D(() => M(n, Pt.lineGroup)),
                n
              );
            })();
          },
          children: n => h(E5, n)
        })
      ),
      D(() => M(t, Pt.subtitles)),
      t
    );
  })();
}
const $5 = "_pageContainer_1ulfp_1",
  C5 = "_mounted_1ulfp_9",
  T5 = "_page_1ulfp_1",
  P5 = "_backgroundContainer_1ulfp_23",
  I5 = "_background_1ulfp_23",
  O5 = "_menuPage_1ulfp_77",
  L5 = "_aboutPage_1ulfp_81",
  k5 = "_pageSpacer_1ulfp_95",
  Je = {
    pageContainer: $5,
    mounted: C5,
    page: T5,
    backgroundContainer: P5,
    background: I5,
    menuPage: O5,
    aboutPage: L5,
    pageSpacer: k5
  };
var B5 = (e => ((e.condensed = "condensed"), (e.extended = "extended"), e))(
    B5 || {}
  ),
  At = (e => (
    (e.top = "top"), (e.bottom = "bottom"), (e.middle = "middle"), e
  ))(At || {}),
  N5 = S("<div><div id=pageSpacer></div><main><div></div><!$><!/>"),
  R5 = S("<div>");
function D5(e) {
  const [t, n] = le(e, ["backgroundColor", "textColor", "fillColor"]);
  wi();
  const { isHeaderDialogRouteChange: r } = _t(),
    [i, o] = L([]),
    [s, a] = L("");
  function l(m) {
    H(() => {
      o(p => [...p, m]),
        U(() => {
          o(p => p.filter(b => b !== m));
        });
    });
  }
  const f = k(() => i().find(m => m.position() === At.middle)),
    [u, c] = L(e.backgroundColor),
    [d, g] = L(!1);
  return (
    Jt(m => {
      const p = f();
      if (
        (p?.position() === At.middle && m === At.bottom) ||
        (p?.position() === At.top && m === At.middle)
      ) {
        const b = p.color();
        Sn(
          () => {
            c(b);
          },
          200,
          setTimeout
        );
      } else c(p?.color() ?? e.backgroundColor);
      return p?.position();
    }),
    Be(() => {
      g(!0),
        document.documentElement.style.setProperty(
          "--backgroundColor",
          e.backgroundColor
        );
    }),
    U(() => {
      g(!1);
    }),
    xc(m => {
      const p = /\/([^\/]+)/,
        b = m.from.pathname.match(p)?.[1],
        $ = String(m.to).match(p)?.[1];
      a(b != $ ? $ : "");
    }),
    (() => {
      var m = E(N5),
        p = m.firstChild,
        b = p.nextSibling,
        $ = b.firstChild,
        A = $.nextSibling,
        [N, T] = X(A.nextSibling);
      return (
        x(
          $,
          h(fe, {
            get each() {
              return i();
            },
            children: ({ color: I, position: z }) =>
              (() => {
                var re = E(R5);
                return (
                  D(
                    R => {
                      var G = Je.background,
                        O = I(),
                        v = z();
                      return (
                        G !== R.e && M(re, (R.e = G)),
                        O !== R.t &&
                          ((R.t = O) != null
                            ? re.style.setProperty("--backgroundColor", O)
                            : re.style.removeProperty("--backgroundColor")),
                        v !== R.a && oe(re, "data-position", (R.a = v)),
                        R
                      );
                    },
                    { e: void 0, t: void 0, a: void 0 }
                  ),
                  re
                );
              })()
          })
        ),
        x(
          b,
          h(qu.Provider, {
            value: { pageStyles: t, useBackground: l },
            get children() {
              return n.children;
            }
          }),
          N,
          T
        ),
        D(
          I => {
            var z = q(Je.pageContainer, {
                [Je.mounted]: d(),
                [Je.menuPage]: s() === "menu",
                [Je.aboutPage]: s() === "about"
              }),
              re = r(),
              R = Je.pageSpacer,
              G = Je.page,
              O = u(),
              v = t.textColor,
              y = t.fillColor,
              w = Je.backgroundContainer;
            return (
              z !== I.e && M(m, (I.e = z)),
              re !== I.t && oe(m, "data-dialogroutechange", (I.t = re)),
              R !== I.a && M(p, (I.a = R)),
              G !== I.o && M(b, (I.o = G)),
              O !== I.i &&
                ((I.i = O) != null
                  ? b.style.setProperty("--backgroundColor", O)
                  : b.style.removeProperty("--backgroundColor")),
              v !== I.n &&
                ((I.n = v) != null
                  ? b.style.setProperty("--textColor", v)
                  : b.style.removeProperty("--textColor")),
              y !== I.s &&
                ((I.s = y) != null
                  ? b.style.setProperty("--fillColor", y)
                  : b.style.removeProperty("--fillColor")),
              w !== I.h && M($, (I.h = w)),
              I
            );
          },
          {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0,
            h: void 0
          }
        ),
        m
      );
    })()
  );
}
function M5(e) {
  return (
    H(() => {
      console.error(e.error);
    }),
    h(D5, {
      backgroundColor: "var(--color-teal)",
      textColor: "var(--color-black)",
      fillColor: "currentColor",
      get children() {
        return [
          h(Yc, {
            get code() {
              return e.error.status;
            }
          }),
          h(W4, { withExtendedTitle: !0 }),
          h(s5, {
            get error() {
              return e.error;
            }
          }),
          h(J4, {}),
          h(Y3, {}),
          h(S5, { en: "[inaudible]", zh: "[听不清]" }),
          h(A5, {})
        ];
      }
    })
  );
}
const H5 = "_corner_1frsu_1",
  F5 = "_layout_1frsu_9",
  qo = { corner: H5, layout: F5 };
var U5 = S("<div><footer>");
const [I6, V5] = L();
function G5(e) {
  return (() => {
    var t = E(U5),
      n = t.firstChild;
    return (
      ze(V5, n),
      x(n, () => e.children),
      D(
        r => {
          var i = q(Fe.grid, qo.corner),
            o = qo.layout;
          return i !== r.e && M(t, (r.e = i)), o !== r.t && M(n, (r.t = o)), r;
        },
        { e: void 0, t: void 0 }
      ),
      t
    );
  })();
}
const st = (e, t, n) => Math.min(Math.max(n, e), t),
  ye = (e, t, n) => -n * e + n * t + e;
function at(e, t, n) {
  return `@keyframes ${e} { ${[...new Array(t + 1)]
    .map((r, i) => `${(i / t) * 100}% { ${n(i / t)} }`)
    .join(" ")} }`;
}
function j5() {
  return h(ti, {
    get children() {
      return (
        at("wipe-out", 20, e => {
          const t = ye(100, -10, e),
            n = `linear-gradient(to right, #000000FF ${t}%, #00000000 ${t +
              10}%)`;
          return `-webkit-mask-image: ${n}; mask-image: ${n}`;
        }) +
        " " +
        at("wipe-in", 20, e => {
          const t = ye(100, -10, e),
            n = `linear-gradient(to right, #00000000 ${t}%, #000000FF ${t +
              10}%)`;
          return `-webkit-mask-image: ${n}; mask-image: ${n}`;
        }) +
        " " +
        at("aperture-out", 30, e => {
          const t = st(0, 100, ye(-10, 100, e)),
            n = ye(0, 110, e),
            i = `radial-gradient(farthest-corner circle, rgba(0,0,0,${st(
              0,
              1,
              ye(1, 0, ye(0, 11, e))
            )}) ${t}%, rgba(0,0,0,1) ${n}%)`;
          return `-webkit-mask-image: ${i}; mask-image: ${i}`;
        }) +
        " " +
        at("split-out", 20, e => {
          const t = st(0, 1, ye(1, 0, ye(0, 6, e))),
            n = st(-10, 50, ye(50, -10, e)),
            r = st(0, 50, ye(60, 0, e)),
            i = st(50, 100, ye(40, 100, e)),
            o = st(50, 110, ye(50, 110, e)),
            s = `linear-gradient(to right, rgba(0,0,0,1) ${n}%, rgba(0,0,0,${t}) ${r}%, rgba(0,0,0,${t}) ${i}%, rgba(0,0,0,1) ${o}%)`;
          return `-webkit-mask-image: ${s}; mask-image: ${s}`;
        }) +
        " " +
        at("vertical-wipe-down", 20, e => {
          const t = ye(-10, 100, e),
            n = `linear-gradient(to bottom, #00000000 ${t}%, #000000FF ${t +
              10}%)`;
          return `-webkit-mask-image: ${n}; mask-image: ${n}`;
        }) +
        " " +
        at("vertical-wipe-up", 20, e => {
          const t = ye(-10, 100, e),
            n = `linear-gradient(to top, #00000000 ${t}%, #000000FF ${t +
              10}%)`;
          return `-webkit-mask-image: ${n}; mask-image: ${n}`;
        }) +
        " " +
        at("slant-wipe-out", 30, e => {
          const t = ye(-10, 100, e),
            n = `linear-gradient(-35deg, #00000000 ${t}%, #000000FF ${t +
              10}%)`;
          return `-webkit-mask-image: ${n}; mask-image: ${n}`;
        })
      );
    }
  });
}
var q5 = () => {},
  Zo = (e, t) => t();
function Z5(e, t) {
  const n = ne(e),
    r = n ? [n] : [],
    { onEnter: i = Zo, onExit: o = Zo } = t,
    [s, a] = L(t.appear ? [] : r),
    [l] = sl();
  let f,
    u = !1;
  function c(m, p) {
    if (!m) return p && p();
    (u = !0),
      o(m, () => {
        ft(() => {
          (u = !1), a(b => b.filter($ => $ !== m)), p && p();
        });
      });
  }
  function d(m) {
    const p = f;
    if (!p) return m && m();
    (f = void 0), a(b => [p, ...b]), i(p, m ?? q5);
  }
  const g =
    t.mode === "out-in"
      ? m => u || c(m, d)
      : t.mode === "in-out"
      ? m => d(() => c(m))
      : m => {
          d(), c(m);
        };
  return (
    Jt(
      m => {
        const p = e();
        return ne(l)
          ? (l(), m)
          : (p !== m && ((f = p), ft(() => ne(() => g(m)))), p);
      },
      t.appear ? void 0 : n
    ),
    s
  );
}
function z5(e) {
  const t = ni(),
    n = u1(() => e.children),
    r = Z5(n, {
      onExit(i, o) {
        if (i instanceof HTMLElement) {
          const s = i.getBoundingClientRect();
          i.style.setProperty("--width", `${s.width}px`),
            i.style.setProperty("--height", `${s.height}px`),
            i.style.setProperty("--left", `${-window.scrollX}px`),
            i.style.setProperty("--top", `${-window.scrollY}px`),
            (i.dataset.exiting = "false"),
            queueMicrotask(() => {
              Oe(a => {
                H(() => {
                  t() ||
                    ((i.dataset.exiting = "true"),
                    i.setAttribute("aria-hidden", "true"),
                    parseFloat(
                      window
                        .getComputedStyle(i)
                        .getPropertyValue("animation-duration")
                    ) > 0
                      ? (i.addEventListener("animationend", o),
                        U(() => {
                          i.removeEventListener("animationend", o);
                        }))
                      : o(),
                    a());
                });
              });
            });
        } else o();
      }
    });
  return k(r);
}
const W5 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAeFBMVEUAAAD/UJ//VZf/VZb/VZf/VZf/VpX/Vpn/VZb/VJf/V5b/U5b/UI//WJf/VZj/VZj/Vpf/VZf/Vpj/WJf/Vpj/V5j/VZf/Vpf/Vpf/VJf/VZj/VZj/U5n/VZf/VZf/VZX/Vpb/VJX/Vpn/VZr/U5f/VJf/Vpf/VJku3yFXAAAAKHRSTlMAEL/vn/+Ar8+AcFAQQJ/P39+PIK9vsH+AQL/vUGCQMK+AfzCQoKBwyKdQPAAAAQ9JREFUeAG9klXCwjAQhCcySDVhg7vf/4S41l5++aC6Plv8LkobY9GA5YUW6mnzQqexRjeKFRpI0ijLnTO+J6ggDYZPKhz6L6tzHJSKDx/mMBrfnvGFPMyTaIwqHK/47kddyaOP1nlhGn1lHVF/VhhLxBk+CfT4Yv7oWx6JJkVB40eE5eLR1qKgEae36Rzv2zQsiJmQMo8y89SwvDXD8eSuhQCpvt4sC1pEiEekx/i+kR6+mVy76pM+NXfdxiWHAeRmClArclqW29+/uDVwsRd1wobMhHfDhlciKQzBraXfkWpDH91q2U+XbjaHyyVx+ZJeEBj2htMZSigk+Qg48HKaO6KOA7OrvHPUcXRz/B9naj8OuNX1AAYAAAAASUVORK5CYII=",
  X5 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAb1BMVEUAAADvACDxAB7vACDzACDyAB7xAB7xAB7zAB7yAB/xAB/xAB7vACDvAB7vACDyAB3zAB7xAB/yAB/0AB7vACDvAB7xAB/xAB7vACDvACDxAB7yAB3xAB7vAB7wAB/wAB/xAB70ACDxAB7vAB3vAB0Uu39EAAAAJXRSTlMAIM9AQJ//33+v3+8QgDBQj8+/b3CQ73BgUIBgkHCvwKAwsFBgRAz/VwAAAU5JREFUeAF90OGO2jAQxPExIX+DvQTiguHMtaWl7/+MlQOixFHv98mSZ0er1Ytbdf/eay318Ep4NlrwsNVTIJoa613YDnrawl4Na9o6fZEwQK1N9IMe7ABju8EKiE7VEIGkmW8A/dFq1DMZZvUAJ1UHIGfYLebZO8kSpKNlOC/+wZtS3pnkALxecu4vVB8qrg5EyO+HMJONYybotQWXzKCZPfFaf0NiWyC2h3CeabEMp0fHp2bOQB3yUHqqopkEkKTCU9Dcd5+hDLLtD6qfplbG4yXZzWeCqXUAiJrc6NVaUx1lv6ZAUesKcKpHPNTAWS0bAdMNGFT41GaVrk5vSsw8io668lsJYPMeCWBygKkjygWqu17+EEwDrCTLdPUJs2U+7tPFO0mJaNoBdJrr+rGWdlPRJeSTFqzcnTn/mDUtqUtjBLjof9xxl3Lq9PQXqYoSBzyO1fIAAAAASUVORK5CYII=",
  Q5 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAXVBMVEUAAAAA17MA168A17MA1rMA17QA1rQA1rMA17MA2rUA1rIA17cA17IA368Az68A2LMA2LMA2LIA2bIA1bUA2LMA17QA17IA2LMA17MA2bQA1rIA17UA1rIA1rUA17MozpyaAAAAHnRSTlMAQCCA799wkL8wUCBgEBDvr49QMM+foG9/n3BgsK8T/p5gAAAA50lEQVR4Xr2SwW6DMBQEn7GxDYEAgSRN2s7/f2YrkLF4Ej700LnuaGWtn/yRqR4vRSFCKApArYOqbSRhgEHnDsakdEBUQg251gP2mF8dAP0mWMCIwinhpt/w8tanNwTgUwo8gNJS1QKAOcufjpXh2GGsX0vbmsRbMlXcZnhGdpYc9x9bayOWRN31e/kWA5c0GGDVRMFBTE/IQh52Xgvkt6OzYTwueX3cG2lhEpm+9t/UOwUwciecCt8MfYTbqRDB7QfRAo0SAsDQ5oPRDQbASxaMKCz4bGc5Y8zhAF9SIsBcFKplln/jB3STGcnZdPK6AAAAAElFTkSuQmCC",
  K5 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAY1BMVEUAAAAAd9AAeM8AgM8Ads8AdtAAeM8AdtAAdtAAds8Adc8Ads8Ads8AcM8Ad9AAeM8Adc8Ad9AAdc8AdtEAd9AAes8Ad88AdtEAec8Ad9EAdtAAd9AAedEAd9EAdtEAd88AdtAylsxhAAAAIHRSTlMAvyAQUN9Az++AYKBwEN9gMJ+Qf88wsF9Qb6+vX4+PkGw0BfsAAAEYSURBVHhevdLZbuwgEATQ6mb1usySPffW/39lDB6Pwa+Rct5KaqBA4DcW9qg4B3iP3TtZT7S8YSBDi2zmSlBwFFiuDBLh6qXagIIhktQUlaug1QacgJ5R9nm2KMyPpWqQCbmg1JByt5PuOZBvKAnpuLLY5LKlyE2DzJMRB6MNN8EUdzo4PnRaVMKh40a06DyhYAPJOAGvKelniqhctnfxNHr9YBJR6Ul6aOR9ryuotGlgdhzTUOZQsSSFuZl2ZHDnI+bymYyiO5c0TLpyR4+D8Y71BxuOlq2EkUm9Rp6xZyanm9kj2o4Un5/qiietLmqA7Tt+PbL9Tgk1y9VVAfOP2Q0ndsw9BsfNf5zpJYQmlQrjKEtj8Dd+AEB4ICRCCmm1AAAAAElFTkSuQmCC",
  zo = [W5, X5, Q5, K5];
function Y5() {
  const e = Ia(1e3);
  return h(wn, {
    rel: "icon",
    get href() {
      return "/favicon.svg";
    },
    type: "image/svg+xml"
  });
}
function J5() {
  const [e, t] = L(!1);
  return (
    Be(() => {
      t(!0);
      function n() {
        t(document.visibilityState === "visible");
      }
      document.addEventListener("visibilitychange", n),
        U(() => {
          document.removeEventListener("visibilitychange", n);
        });
    }),
    [
      h(wn, {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
      }),
      h(Q, {
        get when() {
          return e();
        },
        get fallback() {
          return [
            h(wn, { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }),
            h(wn, {
              rel: "icon",
              type: "image/png",
              sizes: "32x32",
              href: "/favicon.png"
            })
          ];
        },
        get children() {
          return h(Y5, {});
        }
      })
    ]
  );
}
const e6 = 28.2,
  t6 = 0.5;
function n6(e) {
  const { isMuted: t } = _t();
  H(() => {
    Qu(e, n => {
      if (n) {
        let r = function(a) {
          const l = i.createBufferSource();
          return (
            (l.buffer = a),
            (l.loopStart = e6),
            (l.loopEnd = a.duration),
            (l.loop = !0),
            l.connect(o),
            l.start(),
            U(() => {
              l.stop(), l.disconnect();
            }),
            l
          );
        };
        const i = new AudioContext(),
          o = i.createGain();
        o.gain.setValueAtTime(t6, i.currentTime),
          o.connect(i.destination),
          U(() => {
            o.disconnect();
          });
        const [s] = Jr(async () => {
          const a = await fetch(n, { mode: "cors" });
          if (a.ok) {
            const l = await a.arrayBuffer();
            return i.decodeAudioData(l);
          }
        });
        H(() => {
          const a = s();
          a && !t() && Kt() && r(a);
        });
      }
    });
  });
}
const r6 = { siteUrl: "https://irisxjohn.com" };
var i6 = S("<meta charset=utf-8>"),
  o6 = S('<meta name=viewport content="width=device-width, initial-scale=1">'),
  s6 = S(
    '<script async src="https://www.googletagmanager.com/gtag/js?id=G-4Z27K9CL1F">'
  ),
  a6 = S("<script>"),
  l6 = S("<script async src=https://widgets.resy.com/embed.js>");
const c6 = se.createFetcher("/_m/084cedba0c/musicSrc", !0),
  u6 = se.createFetcher("/_m/d2ccc70fb3/heiMediumSrc", !0),
  f6 = se.createFetcher("/_m/0cbd6ba5bd/heiRegularSrc", !0),
  d6 = se.createFetcher("/_m/01f1c4bdab/zhuZiGuDianSrc", !0);
function h6() {
  const e = he(c6, { key: () => "home-page-audio-merged-v2.mp3" }),
    t = he(u6, { key: () => "FZ_Hei_MP_Medium.subset.woff2" }),
    n = he(f6, { key: () => "FZ_Hei_MP_Regular.subset.woff2" }),
    r = he(d6, { key: () => "FZFW_ZhuZiGuDian_MP_Regular.subset.woff2" });
  n6(e);
  const i = ni(),
    o = Bc(),
    s = wi();
  return h(ku, {
    lang: "en",
    get style() {
      return { "--documentPaddingRight": s.paddingRight() };
    },
    get classList() {
      return { overflowHidden: s.overflow() === "hidden" };
    },
    get children() {
      return [
        h(Bu, {
          get children() {
            return [
              h(tc, { children: "MÁLÀ PROJECT" }),
              E(i6),
              E(o6),
              h(nr, {
                property: "og:url",
                get content() {
                  return `${r6.siteUrl}${o.pathname}`;
                }
              }),
              h(nr, { property: "og:type", content: "website" }),
              h(nr, { name: "twitter:card", content: "summary_large_image" }),
              h(j5, {}),
              E(s6),
              (() => {
                var a = E(a6);
                return (
                  Il(
                    a,
                    "innerHTML",
                    "window.dataLayer = window.dataLayer || [];"
                  ),
                  a
                );
              })(),
              E(l6),
              h(J5, {})
            ];
          }
        }),
        h(Nu, {
          get class() {
            return pe.sans;
          },
          get children() {
            return [
              h(ei, {
                get children() {
                  return h(zu, {
                    get children() {
                      return h(Au, {
                        fallback: a => h(M5, { error: a }),
                        get children() {
                          return [
                            h(Q, {
                              get when() {
                                return k(() => !!(t() && n()))() && r();
                              },
                              get children() {
                                return h(ti, {
                                  get children() {
                                    return `
                  @font-face {
                    font-family: "Hei";
                    src: url("${t()}")
                      format("woff2");
                    font-weight: 500;
                    font-display: swap;
                  }

                  @font-face {
                    font-family: "Hei";
                    src: url("${n()}")
                      format("woff2");
                    font-weight: 400;
                    font-display: swap;
                  }

                  @font-face {
                    font-family: "ZhuZi GuDian";
                    src: url("${r()}")
                      format("woff2");
                    font-weight: 400;
                    font-display: swap;
                  }
                `;
                                  }
                                });
                              }
                            }),
                            h(z5, {
                              get children() {
                                return h(Rc, {
                                  get children() {
                                    return h(Gu, {});
                                  }
                                });
                              }
                            }),
                            h(G5, {
                              get children() {
                                return h(La, {});
                              }
                            }),
                            h(p5, {}),
                            h(Q, {
                              get when() {
                                return i();
                              },
                              get children() {
                                return h(vi, {});
                              }
                            })
                          ];
                        }
                      });
                    }
                  });
                }
              }),
              h(Lu, {})
            ];
          }
        })
      ];
    }
  });
}
const Wo = Object.values(Object.assign({}))[0],
  g6 = Wo ? Wo.default : void 0,
  m6 = ({ routerProps: e } = {}) => {
    let t = {
      get request() {},
      get clientAddress() {},
      get locals() {},
      get prevUrl() {},
      get responseHeaders() {},
      get tags() {},
      get env() {},
      get routerContext() {},
      setStatusCode(o) {},
      getStatusCode() {},
      $type: Ss,
      fetch,
      $islands: new Set(),
      mutation: !1
    };
    function n(o) {
      return h(Ic, o);
    }
    const r = "/";
    let i = r;
    if (r.startsWith("http"))
      try {
        i = new URL(r).pathname;
      } catch {
        console.warn(
          "BASE_URL starts with http, but `new URL` failed to parse it. Please check your BASE_URL:",
          r
        );
      }
    return h(As.Provider, {
      value: t,
      get children() {
        return h(Jl, {
          get children() {
            return h(
              n,
              F({ base: i, data: g6 }, e, {
                get children() {
                  return h(h6, {});
                }
              })
            );
          }
        });
      }
    });
  };
Ql(() => h(m6, {}), document);
export {
  Qu as $,
  Ht as A,
  le as B,
  Oa as C,
  nt as D,
  M5 as E,
  fe as F,
  bt as G,
  W4 as H,
  Xn as I,
  ln as J,
  pi as K,
  Nt as L,
  Nn as M,
  Sd as N,
  m2 as O,
  qu as P,
  cn as Q,
  za as R,
  Ps as S,
  k as T,
  ah as U,
  At as V,
  ge as W,
  vt as X,
  Vn as Y,
  Wl as Z,
  H as _,
  L as a,
  It as a$,
  U as a0,
  oe as a1,
  Il as a2,
  Kt as a3,
  si as a4,
  Be as a5,
  as as a6,
  lt as a7,
  Ve as a8,
  h1 as a9,
  p6 as aA,
  _h as aB,
  tc as aC,
  nr as aD,
  Qe as aE,
  Xr as aF,
  Qa as aG,
  S2 as aH,
  $4 as aI,
  $6 as aJ,
  Me as aK,
  C6 as aL,
  d1 as aM,
  w6 as aN,
  De as aO,
  f0 as aP,
  Us as aQ,
  x6 as aR,
  ci as aS,
  b6 as aT,
  A6 as aU,
  S6 as aV,
  Jt as aW,
  E6 as aX,
  Dr as aY,
  _6 as aZ,
  gi as a_,
  ve as aa,
  j1 as ab,
  Q1 as ac,
  H1 as ad,
  h2 as ae,
  je as af,
  Ze as ag,
  ds as ah,
  Dt as ai,
  P1 as aj,
  no as ak,
  ai as al,
  ct as am,
  Yn as an,
  bi as ao,
  y6 as ap,
  I6 as aq,
  pt as ar,
  B5 as as,
  _t as at,
  xc as au,
  Qr as av,
  va as aw,
  fn as ax,
  j as ay,
  ne as az,
  ze as b,
  T1 as b0,
  r0 as b1,
  Y1 as b2,
  ks as b3,
  J1 as b4,
  F1 as b5,
  Zs as b6,
  e0 as b7,
  t0 as b8,
  mt as b9,
  v2 as ba,
  b2 as bb,
  An as bc,
  y2 as bd,
  _2 as be,
  kh as bf,
  Ia as bg,
  hl as bh,
  Na as bi,
  we as bj,
  st as bk,
  ye as bl,
  P6 as bm,
  h as c,
  X as d,
  qa as e,
  zr as f,
  E as g,
  Sf as h,
  x as i,
  q as j,
  D as k,
  Fe as l,
  F as m,
  M as n,
  ce as o,
  pe as p,
  J4 as q,
  Y3 as r,
  T6 as s,
  S as t,
  ie as u,
  S5 as v,
  A5 as w,
  D5 as x,
  v6 as y,
  Q as z
};
