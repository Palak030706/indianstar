export async function onRequest(context) {
    console.log("Function started")
    const { MYKV } = context.env;
    const { searchParams } = new URL(context.request.url);
    const comment = searchParams.get('comment');
    console.log(comment);

    if (comment) {
        console.log("line 2")
        try {
            
            // Store the message in KV store with a unique key
            await MYKVSTORE.put('comment', comment);
            console.log("line 8")

            return new Response('Message saved successfully', { status: 200 });
            console.log("line 9")
        } catch (error) {
            console.log("line 10")
            return new Response('Invalid request', { status: 400 });
            console.log("line 11")
        }
    } else {
        console.log("line 12")
        return new Response('Invalid action', { status: 400 });
    }
}