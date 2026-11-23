const $ = (id) => document.getElementById(id);
const choices = {
  atmosphere: ["Dark","Industrial","Underground","Futuristic","Hypnotic","Mysterious","Atmospheric","Raw","Mechanical"],
  sound: ["Acid Bass","Deep Bass","Industrial Bass","Rolling Bass","Distorted Bass","Rumble Bass","Analog Synths","Metallic Percussion","Industrial Drums"],
  arrangement: ["Long Intro","Gradual Build-up","Powerful Drop","Continuous Groove","Extended Breakdown","No Breakdown","Long Outro","DJ-friendly Arrangement"]
};
function addChecks(containerId, values) {
  $(containerId).innerHTML = values.map(v => `<label class="choice"><input type="checkbox" value="${v.replaceAll('"','&quot;')}"><span>${v}</span></label>`).join("");
}
addChecks("atmosphereOptions", choices.atmosphere);
addChecks("soundOptions", choices.sound);
addChecks("arrangementOptions", choices.arrangement);

let current = null;
const STORE = {favorites:"tpg_favorites_v1",history:"tpg_history_v1",settings:"tpg_settings_v1"};
function selected(containerId){return [...$(containerId).querySelectorAll('input:checked')].map(x=>x.value)}
function getSettings(){
  return {
    mainGenre:$("mainGenre").value, secondaryGenre:$("secondaryGenre").value,
    bpm:Number($("bpm").value), style:document.querySelector('input[name="style"]:checked')?.value || "Deep",
    excludes:selected("excludeOptions"), duration:Number($("duration").value),
    title:$("trackTitle").value.trim(), vocal:$("vocalMode").value, vocalCharacter:$("vocalCharacter").value,
    atmosphere:selected("atmosphereOptions"), sound:selected("soundOptions"), arrangement:selected("arrangementOptions")
  };
}
function setSettings(s){
  if(!s)return;
  $("mainGenre").value=s.mainGenre||"Dark Techno"; $("secondaryGenre").value=s.secondaryGenre||"";
  $("bpm").value=s.bpm||130; document.querySelector(`input[name="style"][value="${CSS.escape(s.style||"Deep")}"]`).checked=true;
  $("duration").value=s.duration||6; $("trackTitle").value=s.title||"";
  $("vocalMode").value=s.vocal||"Instrumental"; $("vocalCharacter").value=s.vocalCharacter||"Atmospheric";
  ["excludeOptions","atmosphereOptions","soundOptions","arrangementOptions"].forEach((id,i)=>{
    const arr=[s.excludes,s.atmosphere,s.sound,s.arrangement][i]||[];
    $(id).querySelectorAll('input').forEach(el=>el.checked=arr.includes(el.value));
  });
  updateNumbers(); updateWarning(); persistSettings();
}
function updateNumbers(){$("bpmValue").textContent=$("bpm").value+" BPM";$("durationValue").textContent=$("duration").value+" min"}
function updateWarning(){
  const vocal=$("vocalMode").value!=="Instrumental";
  const excluded=selected("excludeOptions").includes("Vocals");
  $("vocalWarning").style.display=vocal&&excluded?"block":"none";
}
function buildPrompt(s){
  const parts=[];
  parts.push(`${s.mainGenre}${s.secondaryGenre && s.secondaryGenre!==s.mainGenre ? " with "+s.secondaryGenre.toLowerCase()+" influences" : ""}.`);
  parts.push(`${s.style} techno, ${s.bpm} BPM.`);
  if(s.vocal==="Instrumental") parts.push("Instrumental track, no vocals.");
  else {
    const voice=s.vocal==="Male"?"male":s.vocal==="Female"?"female":"male and female";
    parts.push(`Featuring ${voice} vocals with a ${s.vocalCharacter.toLowerCase()} delivery.`);
  }
  if(s.atmosphere.length) parts.push(`Atmosphere: ${s.atmosphere.join(", ").toLowerCase()}.`);
  if(s.sound.length) parts.push(`Sound design: ${s.sound.join(", ").toLowerCase()}.`);
  if(s.arrangement.length) parts.push(`Arrangement: ${s.arrangement.join(", ").toLowerCase()}.`);
  parts.push(`Target duration: approximately ${s.duration} minutes. Develop a coherent, evolving arrangement that suits the selected style and remains musically engaging throughout.`);
  parts.push("Professional electronic music production, tight low-end, controlled dynamics, clear mix, and a cohesive club-ready sound.");
  return parts.join(" ");
}
function buildExclude(s){return s.excludes.length?s.excludes.join(", "):""}
function render(){
  current=getSettings();
  const prompt=buildPrompt(current);
  $("promptOutput").textContent=prompt;
  $("promptOutput").classList.remove("empty");
  $("copyStatus").textContent="Prompt erstellt. Du kannst Style, Exclude und Titel separat kopieren.";
  updateWarning(); addHistory({settings:current,prompt,exclude:buildExclude(current),created:new Date().toISOString()});
}
async function copy(text,label){
  if(!text){$("copyStatus").textContent=`Kein ${label} vorhanden.`;return}
  try{
    if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    else {const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();const ok=document.execCommand("copy");ta.remove();if(!ok)throw new Error("Copy failed");}
    $("copyStatus").textContent=`${label} in die Zwischenablage kopiert.`;
  }catch(e){$("copyStatus").textContent="Kopieren nicht möglich. Bitte den Text markieren und manuell kopieren."}
}
function readStore(k){try{return JSON.parse(localStorage.getItem(k)||"[]")}catch{return []}}
function writeStore(k,v){localStorage.setItem(k,JSON.stringify(v))}
function addHistory(item){const h=readStore(STORE.history);h.unshift(item);writeStore(STORE.history,h.slice(0,20));renderLists()}
function renderLists(){
  const fav=readStore(STORE.favorites), hist=readStore(STORE.history);
  $("favoritesList").innerHTML=fav.length?fav.map((x,i)=>`<li><span>${escapeHtml(x.settings.title||x.settings.mainGenre+" · "+x.settings.bpm+" BPM")}</span><button data-fav="${i}">Laden</button></li>`).join(""):'<li class="muted">Noch keine Favoriten gespeichert.</li>';
  $("historyList").innerHTML=hist.length?hist.slice(0,8).map((x,i)=>`<li><span>${escapeHtml(x.settings.title||x.settings.mainGenre+" · "+x.settings.bpm+" BPM")}</span><button data-hist="${i}">Laden</button></li>`).join(""):'<li class="muted">Noch kein Verlauf vorhanden.</li>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function persistSettings(){try{localStorage.setItem(STORE.settings,JSON.stringify(getSettings()))}catch{}}
function randomize(){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const maybe=a=>a.filter(()=>Math.random()<.32);
  const genres=["Dark Techno","Hypnotic Techno","Peak Time Techno","Driving Underground","Techno Ambient","Afterhour Techno"];
  const bpm=Math.floor(118+Math.random()*29);
  const styles=["Deep","Heavy","Continuous","Energetic"];
  const atmos=maybe(choices.atmosphere), sounds=maybe(choices.sound), arr=maybe(choices.arrangement);
  // Avoid contradictory arrangement choices.
  if(arr.includes("No Breakdown")&&arr.includes("Extended Breakdown")) arr.splice(arr.indexOf("Extended Breakdown"),1);
  const s={
    mainGenre:pick(genres),secondaryGenre:Math.random()<.35?pick(genres.filter(g=>g!==undefined)): "",
    bpm,style:pick(styles),excludes:maybe(["Vocals","Melodic elements","Harsh sizzling high frequencies","Breakdowns","Pauses and moments of silence"]),
    duration:3+Math.floor(Math.random()*8),title:$("trackTitle").value.trim(),
    vocal:Math.random()<.65?"Instrumental":pick(["Male","Female","Both"]),vocalCharacter:pick(["Atmospheric","Dark","Spoken Words","Sung Vocals","Chopped Vocal Samples","Chant"]),
    atmosphere:atmos,sound:sounds,arrangement:arr
  };
  if(s.secondaryGenre===s.mainGenre)s.secondaryGenre="";
  // Do not make vocal and exclude contradict unless the user explicitly chooses it later.
  if(s.vocal!=="Instrumental")s.excludes=s.excludes.filter(x=>x!=="Vocals");
  setSettings(s);render();$("copyStatus").textContent="Neue, musikalisch abgestimmte Zufallskombination erstellt.";
}
$("bpm").addEventListener("input",updateNumbers);$("duration").addEventListener("input",updateNumbers);
document.addEventListener("change",e=>{if(e.target.matches("input,select")){updateWarning();persistSettings()}});
$("generateBtn").addEventListener("click",render);
$("copyStyleBtn").addEventListener("click",()=>copy(current?buildPrompt(current):$("promptOutput").textContent,"Style-Prompt"));
$("copyExcludeBtn").addEventListener("click",()=>copy(buildExclude(getSettings()),"Exclude-Liste"));
$("copyTitleBtn").addEventListener("click",()=>copy($("trackTitle").value.trim(),"Titel"));
$("randomBtn").addEventListener("click",randomize);
$("resetBtn").addEventListener("click",()=>{localStorage.removeItem(STORE.settings);setSettings({mainGenre:"Dark Techno",secondaryGenre:"",bpm:130,style:"Deep",excludes:[],duration:6,title:"",vocal:"Instrumental",vocalCharacter:"Atmospheric",atmosphere:[],sound:[],arrangement:[]});current=null;$("promptOutput").textContent="Noch kein Prompt erstellt. Wähle deine Einstellungen und klicke auf „Generate Prompt“.";$("promptOutput").classList.add("empty");});
$("saveFavoriteBtn").addEventListener("click",()=>{const s=getSettings(),p=buildPrompt(s),f=readStore(STORE.favorites);f.unshift({settings:s,prompt:p,exclude:buildExclude(s)});writeStore(STORE.favorites,f.slice(0,30));renderLists();$("copyStatus").textContent="Favorit lokal gespeichert."});
$("clearHistoryBtn").addEventListener("click",()=>{writeStore(STORE.history,[]);renderLists()});
document.addEventListener("click",e=>{
  if(e.target.dataset.fav!==undefined){const x=readStore(STORE.favorites)[Number(e.target.dataset.fav)];setSettings(x.settings);current=x.settings;$("promptOutput").textContent=x.prompt;$("promptOutput").classList.remove("empty")}
  if(e.target.dataset.hist!==undefined){const x=readStore(STORE.history)[Number(e.target.dataset.hist)];setSettings(x.settings);current=x.settings;$("promptOutput").textContent=x.prompt;$("promptOutput").classList.remove("empty")}
});
try{const saved=JSON.parse(localStorage.getItem(STORE.settings)||"null");if(saved)setSettings(saved);else updateNumbers()}catch{updateNumbers()}
renderLists();updateWarning();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
