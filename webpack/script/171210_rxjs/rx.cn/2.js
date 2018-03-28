const { Observable } = Rx;

const speechRecognition$ = new Observable(observer => {
   const speech = new webkitSpeechRecognition();

   speech.onresult = (event) => {
     observer.next(event);
     observer.complete();
   };

   speech.start();

   return () => {
     speech.stop();
   }
});

const say = (text) => new Observable(observer => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = (e) => {
    observer.next(e);
    observer.complete();
  };
  speechSynthesis.speak(utterance);
});


const button = document.querySelector("button");

const heyClick$ = Observable.fromEvent(button, 'click');

heyClick$
  .switchMap(e => speechRecognition$)
  .map(e => e.results[0][0].transcript)
  .map(text => {
    switch (text) {
      case 'I want':
        return 'candy';
      case 'hi':
      case 'ice ice':
        return 'baby';
      case 'hello':
        return 'Is it me you are looking for';
      case 'make me a sandwich':
      case 'get me a sandwich':
        return 'do it yo damn self';
      case 'why are you being so sexist':
        return 'you made me that way';
      default:
        return `I don't understand: "${text}"`;
    }
  })
  .concatMap(say)
  .subscribe(e => console.log(e));
