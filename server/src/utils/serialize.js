export function toClientDoc(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  o.id = String(o._id);
  delete o._id;
  delete o.__v;

  // Backwards-compatible alias used by older frontend code.
  if (!o.image) {
    const first = Array.isArray(o.images) && o.images.length > 0 ? o.images[0] : null;
    if (first) o.image = first;
  }

  if (!Array.isArray(o.images)) {
    o.images = o.image ? [o.image] : [];
  }
  return o;
}

export function toClientList(docs) {
  return docs.map((d) => toClientDoc(d));
}
