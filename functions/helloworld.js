export async function onRequest(context) {
  const {COUNTER_NAMESPACE} = context.env;
  let counterValue = 0;
  await COUNTER_NAMESPACE.PUT( 'counter',counterValue);
  return new Response("counterValue");
}