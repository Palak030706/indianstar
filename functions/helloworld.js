export async function onRequest(context) {
  const { MYKV } = context.env;
  const counterValue = await MYKVSTORE.get('Counter');
  let counterValue = await MYKVSTORE.get('Counter');
  counterValue = parseInt(counterValue) || 0;
  counterValue += 1;
  await MYKVSTORE.put('Counter', counterValue);
}