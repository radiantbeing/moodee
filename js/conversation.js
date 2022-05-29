async function getConversationAll(db_path) {
  const res = await fetch(db_path);
  const data = await res.json();
  return data;
}

async function getCustomizedConversation(db_path) {
  let conversation = await getConversationAll(db_path);
  const current_hour = new Date().getHours();
  if (current_hour >= 0 && current_hour < 6) conversation = conversation["새벽"];
  else if (current_hour >= 6 && current_hour < 12) conversation = conversation["아침"];
  else if (current_hour >= 12 && current_hour < 18) conversation = conversation["점심"];
  else if (current_hour >= 18 && current_hour < 24) conversation = conversation["저녁"];
  const rand = Math.floor(getRandomArbitrary(0, 3));
  const header = conversation.header[rand];
  const description = conversation.description[rand];
  return {
    header: header,
    description: description,
  };
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

(async function main() {
  const conversation = await getCustomizedConversation("db/conversation.json");
  const header = document.getElementById("conversation_header");
  const description = document.getElementById("conversation_description");
  header.textContent = conversation.header;
  description.innerHTML = conversation.description;
})();
