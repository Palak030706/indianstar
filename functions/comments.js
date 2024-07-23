export async function onRequest(context) {
    const { request, env } = context;
    const { MYKV } = env;
    const url = new URL(request.url);
    const pathname = url.pathname;
  
    if (request.method === 'GET' && pathname === '/comments') {
      // Fetch and return all comments
      const comments = await MYKV.get('comments');
      return new Response(comments || '', {
        headers: { 'Content-Type': 'text/plain' }
      });
  
    } else if (request.method === 'POST' && pathname === '/comments') {
      // Add a new comment
      const comment = await request.text();
      if (!comment) {
        return new Response('Invalid comment', { status: 400 });
      }
  
      // Get the existing comments
      const comments = await MYKV.get('comments');
      const commentsArray = comments ? comments.split('\n') : [];
  
      // Add the new comment to the array
      commentsArray.push(comment);
  
      // Save the updated comments back to KV
      await MYKV.put('comments', commentsArray.join('\n'));
  
      return new Response('Comment added', { status: 201 });
    }
  
    return new Response('Not found', { status: 404 });
  }
  