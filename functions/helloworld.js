export async function onRequest(context) {
  const { MYKV } = context.env;
const counterValue = await MYKVget('counter');
  counterValue += 1;
  await MYKV.put('counter', counterValue);
  return new Response(counterValue);
}