export async function onRequest(context) {
  const { MYKV } = context.env;
  const counterValue = await MYKV.get('Counter');
  return new Response(counterValue);
}