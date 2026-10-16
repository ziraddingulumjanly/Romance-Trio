/** Tiny, locally synthesized interface sounds. No external audio files or services. */
let ctx: AudioContext | null = null;
const getContext = () => {
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  try {ctx ??= new window.AudioContext(); if (ctx.state === 'suspended') void ctx.resume(); return ctx;}
  catch {return null;}
};
function tone(frequency:number, delay:number, duration:number, volume:number, type:OscillatorType='sine') {
  const ac=getContext(); if(!ac)return;
  const oscillator=ac.createOscillator(); const gain=ac.createGain();
  const start=ac.currentTime+delay;
  oscillator.type=type; oscillator.frequency.setValueAtTime(frequency,start);
  gain.gain.setValueAtTime(0.0001,start);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),start+.006);
  gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  oscillator.connect(gain);gain.connect(ac.destination);
  oscillator.start(start);oscillator.stop(start+duration+.01);
}
export function playUiSound(kind:'key'|'correct'|'wrong'|'select',enabled:boolean) {
 if(!enabled)return;
 switch(kind){
  case 'key':tone(620+Math.random()*180,0,.028,.007,'triangle');break;
  case 'correct':tone(523,0,.14,.048);tone(659,.11,.14,.043);tone(784,.22,.24,.04);break;
  case 'wrong':tone(285,0,.16,.036,'triangle');tone(230,.15,.22,.027,'triangle');break;
  case 'select':tone(740,0,.065,.017,'sine');break;
 }
}
