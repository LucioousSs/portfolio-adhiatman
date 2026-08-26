export class HeroSection {
  render() {

    const sparkles = [
      { char: '✦', top: '14%', left: '12%', dur: '12s', delay: '0s', cls: 'animate-float-diagonal' },
      { char: '·', top: '22%', left: '26%', dur: '14s', delay: '2s', cls: 'animate-float-vertical' },
      { char: '✦', top: '10%', left: '72%', dur: '11s', delay: '4s', cls: 'animate-float-vertical' },
      { char: '·', top: '30%', left: '88%', dur: '15s', delay: '5s', cls: 'animate-float-diagonal' },
      { char: '✦', top: '38%', left: '6%', dur: '12s', delay: '3s', cls: 'animate-float-diagonal' },
      { char: '·', top: '45%', left: '20%', dur: '13s', delay: '1s', cls: 'animate-float-vertical' },
      { char: '✦', top: '55%', left: '80%', dur: '11s', delay: '6s', cls: 'animate-float-vertical' },
      { char: '·', top: '62%', left: '12%', dur: '14s', delay: '2.5s', cls: 'animate-float-diagonal' },
      { char: '✦', top: '70%', left: '32%', dur: '12s', delay: '4.5s', cls: 'animate-float-diagonal' },
      { char: '·', top: '76%', left: '90%', dur: '15s', delay: '3.5s', cls: 'animate-float-vertical' },
      { char: '✦', top: '82%', left: '60%', dur: '13s', delay: '0.5s', cls: 'animate-float-vertical' },
      { char: '·', top: '88%', left: '40%', dur: '12s', delay: '5.5s', cls: 'animate-float-diagonal' },
      { char: '✦', top: '26%', left: '50%', dur: '11s', delay: '1.5s', cls: 'animate-float-diagonal' },
      { char: '·', top: '64%', left: '55%', dur: '15s', delay: '4s', cls: 'animate-float-vertical' },
    ];

    const sparkleTags = sparkles
      .map(
        (s) => `
          <span class="pointer-events-none select-none absolute z-0 text-zinc-400/60 ${s.cls}"
                style="top:${s.top};left:${s.left};animation-duration:${s.dur};animation-delay:${s.delay}">
            ${s.char}
          </span>`
      )
      .join('');

    return `
      <section id="home" class="relative min-h-screen w-full bg-black text-white flex flex-col justify-center pt-16 pb-8 px-6 overflow-hidden">

        <div class="pointer-events-none select-none absolute top-1/4 left-10 w-72 h-72 bg-zinc-700/20 rounded-full blur-3xl animate-pulse z-0"></div>

        <div class="pointer-events-none select-none absolute bottom-1/4 right-10 w-96 h-96 bg-zinc-500/10 rounded-full blur-3xl animate-float z-0"></div>

        ${sparkleTags}

        <div class="pointer-events-none select-none absolute inset-0 flex items-center overflow-hidden opacity-10 z-0">
          <div class="whitespace-nowrap animate-marquee text-6xl sm:text-7xl md:text-8xl font-black uppercase text-white">
            <span>UI/UX DESIGNER &bull; FRONTEND DEVELOPER &bull; IT STUDENT &bull; CREATIVE CODE &bull; </span>
            <span>UI/UX DESIGNER &bull; FRONTEND DEVELOPER &bull; IT STUDENT &bull; CREATIVE CODE &bull; </span>
          </div>
        </div>

        <div class="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center">

          <h1 class="z-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-center leading-none text-white drop-shadow-[4px_4px_0px_rgba(63,63,70,0.8)] select-none">
            DIGITAL<br>DESIGNER
          </h1>

          <div class="relative z-20 -mt-40 sm:-mt-52 md:-mt-64 lg:-mt-72 w-80 sm:w-96 md:w-[450px] flex justify-center">

            <div class="absolute inset-0 bg-zinc-600/20 blur-3xl rounded-full -z-10"></div>

            <img
              src="./assets/images/portfoliocih.png"
              alt="Foto Profil"
              class="w-full h-auto max-h-[68vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] transition-transform duration-500 ease-out hover:scale-105 will-change-transform cursor-pointer"
            />
          </div>

        </div>

        <div class="relative z-30 w-full max-w-6xl mx-auto flex items-center justify-center md:justify-end gap-4 mt-4">
          <a href="#projects" class="px-6 py-2.5 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-sm shadow-lg relative z-30">
            Explore My Works
          </a>
        </div>

      </section>
    `;
  }
}
