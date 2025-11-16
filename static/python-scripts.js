// GET request the chatlog
async function GETchatlog(url) {
  const response = await fetch("http://localhost:5000/api/v0/chats/1234");
  var chatlog = await response.json();
  console.log(chatlog);
}