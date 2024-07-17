export async function onRequest(context) {
  const {MYKV} = context.env;
  let counterValue = 0;
  await MYKV.put( 'counter',counterValue);
  return new Response("counterValue");
}