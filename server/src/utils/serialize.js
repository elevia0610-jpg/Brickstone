export function toClientDoc(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  o.id = String(o._id);
  delete o._id;
  delete o.__v;
  return o;
}

export function toClientList(docs) {
  return docs.map((d) => toClientDoc(d));
}
