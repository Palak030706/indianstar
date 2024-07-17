export async function onRequest(context) {
  const { MYKV } = context.env;
  const counterValue = await MYKV.get('counter');
  return new Response(counterValue);
}