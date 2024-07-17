export async function onRequest(context) {
  const {COUNTER_NAMESPACE} = context.env;
  let counterValue = 0;
  await COUNTER.put( 'counter',counterValue);
  return new Response("counterValue");
}