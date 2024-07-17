export async function onRequest(context) {
  const { MYKV } = context.env;
 let counterValue = await MYKVget('counter');
  counterValue = parseInt(counterValue) || 0;
  counterValue += 1;
  await MYKV.put('counter', counterValue);
  return new Response(counterValue);
}