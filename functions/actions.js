export async function onRequest(context) {
    const { MYKVSTORE } = context.env;
    const { searchParams } = new URL(context.request.url);
    const action = searchParams.get('action');

    let counterValue = await MYKVSTORE.get('counter');
    counterValue = parseFloat(counterValue) || 0;

    if (action ==='increment') {
        counterValue += 1;
    } else if(action === 'decrement'){
        counterValue -= 1;
    } else if(action ==='half'){
        counterValue = counterValue/2;
    } else if (action ==='double'){
        counterValue = counterValue*2;
    } else if(action === 'reset'){
        counterValue = 0;
    } else if (action == 'getvalue') {
        return new Response(counterValue);
    }

    await MYKVSTORE.put('counter',counterValue);
    return new Response(counterValue);
}