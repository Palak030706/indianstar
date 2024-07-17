export async function onRequest(context) {
  const {MYKV} = context.env;
  let counterValue;
  await MYKV.put( 'counter',counterValue);
  return new Response(MYKV);
}