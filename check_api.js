async function check() {
  const res = await fetch('https://api.mangadex.org/manga/d0cbdfbc-42ed-4e20-9ee4-c9c43a411132/feed?limit=500&translatedLanguage[]=en&order[chapter]=desc');
  const data = await res.json();
  const chapters = data.data;
  console.log("Total EN chapters found:", chapters.length);
  
  if (chapters.length > 0) {
    console.log("Top 5 chapters:");
    for (let i = 0; i < 5; i++) {
      if (chapters[i]) {
        console.log(`Chapter ${chapters[i].attributes.chapter}: pages=${chapters[i].attributes.pages}, externalUrl=${chapters[i].attributes.externalUrl}`);
      }
    }
  }
}

check();
