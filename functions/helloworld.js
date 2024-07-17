export async function onRequest(context) {
  const { MYKVSTORE } = context.env;
  const counterValue = await MYKVS.get('Counter');
  return new Response(counterValue);
}