import type { CSSProperties } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { comparisonTracks, extraTracks } from './data/tracks';

const features = [
  ['〽', 'Afinación inteligente', 'Detecta desviaciones de tono y muestra dónde ajustar sin apagar tu identidad vocal.'],
  ['🎙', 'Técnica vocal', 'Feedback sobre respiración, apoyo, dicción y estabilidad en frases largas.'],
  ['🔊', 'Tono y calidad', 'Compara brillo, cuerpo, resonancia y claridad para una mezcla más limpia.'],
  ['📈', 'Progreso real', 'Guarda sesiones y compara tu evolución entre tomas, ensayos y versiones finales.'],
  ['♛', 'Hecho en Valpo', 'Una identidad visual callejera, musical y chilena para artistas con flow propio.']
];

const steps = [
  ['01', 'Graba o sube', 'Carga una toma vocal en WAV, MP3, M4A u OGG directamente desde la página.'],
  ['02', 'Analizamos', 'La IA calcula afinación, estabilidad, tono, expresión y puntos críticos por sección.'],
  ['03', 'Escucha el antes/después', 'Reproduce el audio original y la versión mejorada con IA lado a lado.'],
  ['04', 'Mejora y repite', 'Recibe ejercicios concretos para acercarte a tu mejor interpretación.']
];

const testimonials = [
  {
    name: 'Nico Freestyle',
    city: 'Valparaíso, Chile',
    image: '/assets/team-hipertensia.jpg',
    quote: 'La comparación sin IA y con IA deja clarísimo dónde tengo que ajustar el tono.'
  },
  {
    name: 'Lota Rap',
    city: 'Valparaíso, Chile',
    image: '/assets/team-hipertensia.jpg',
    quote: 'Los ejercicios son concretos. No es solo verse bonito: se entiende cómo mejorar.'
  },
  {
    name: 'Vale Beats',
    city: 'Valparaíso, Chile',
    image: '/assets/team-hipertensia.jpg',
    quote: 'Sirve para producción y para dar feedback real a cantantes antes de grabar final.'
  },
  {
    name: 'MC Vaipo',
    city: 'Valparaíso, Chile',
    image: '/assets/mc-vaipo-review.jpg',
    quote: 'HipertensIA funciona como entrenador vocal: ve detalles que uno no nota al cantar.'
  }
];

function Header() {
  return (
    <header className="header">
      <a className="logo" href="#inicio" aria-label="Ir al inicio">
        <span>Hipertens</span><strong>IA</strong><i>♕</i>
      </a>
      <nav>
        <a href="#inicio" className="is-active">Inicio</a>
        <a href="#funciones">Funciones</a>
        <a href="#como-funciona">Cómo funciona</a>
        <a href="#audio">Audio</a>
        <a href="#comunidad">Comunidad</a>
      </nav>
      <div className="header__actions">
        <a href="#comunidad" className="login">Iniciar sesión</a>
        <a href="#audio" className="button button--yellow">Probar gratis →</a>
      </div>
    </header>
  );
}

function DashboardMock() {
  const pitchPoints = [
    [38, 73], [79, 48], [118, 66], [164, 38], [208, 57], [252, 32], [294, 45]
  ].map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <div className="dashboard-card" aria-label="Vista previa del dashboard HipertensIA">
      <aside>
        <div className="dashboard-card__brand">Hipertens<strong>IA</strong></div>
        {['Resumen', 'Sesiones', 'Análisis', 'Ejercicios', 'Progreso', 'Playlists', 'Ajustes'].map((item, index) => (
          <span key={item} className={index === 0 ? 'selected' : ''}>{item}</span>
        ))}
        <div className="dashboard-card__user">
          <img src="/assets/mc-vaipo-review.jpg" alt="Avatar MC Vaipo" />
          <div><strong>MC Vaipo</strong><small>Nivel 12</small></div>
        </div>
      </aside>
      <main>
        <div className="dashboard-card__title">
          <div>
            <span>Resumen de sesión</span>
            <small>Hoy · 14:35</small>
          </div>
          <button>Sesión 23 ▾</button>
        </div>
        <div className="score-grid">
          {[
            ['Puntuación vocal', '86'], ['Afinación', '88'], ['Técnica', '82'], ['Tono', '89'], ['Expresión', '84']
          ].map(([label, score]) => (
            <div className="score-card" key={label}>
              <span>{label}</span>
              <strong>{score}</strong><small>/100</small>
            </div>
          ))}
        </div>
        <div className="dashboard-wave">
          <button aria-label="Reproducir preview">▶</button>
          <div className="bars" aria-hidden="true">{Array.from({ length: 48 }).map((_, index) => <i key={index} style={{ '--h': `${22 + ((index * 17) % 58)}%` } as CSSProperties} />)}</div>
          <span>02:36 / 03:28</span>
        </div>
        <div className="dashboard-bottom">
          <div className="pitch-card">
            <h4>Análisis de afinación</h4>
            <svg viewBox="0 0 330 110" role="img" aria-label="Gráfico de afinación">
              <path d="M15 80 C55 35 83 54 115 62 S175 87 205 38 265 36 315 25" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="8" strokeLinecap="round" />
              <polyline points={pitchPoints} fill="none" stroke="#19f0d5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="38,79 79,57 118,61 164,42 208,59 252,40 294,38" fill="none" stroke="#ff4d7d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="ai-card">
            <h4>Comentarios de la IA</h4>
            <p>Buen progreso: cuida la estabilidad en notas largas y evita ataques forzados en frases agudas.</p>
            <span>Confianza IA 92%</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section id="inicio" className="hero section-shell">
      <div className="hero__copy">
        <p className="eyebrow">Valpo flow · rap · freestyle · vocal coach IA</p>
        <h1><em>Mejora</em><span>tu voz</span><small>con</small><strong>IA</strong></h1>
        <p className="hero__lead">Feedback inteligente para llevar tu voz al siguiente nivel: afinación, técnica, tono y calidad vocal con inteligencia artificial.</p>
        <div className="hero__actions">
          <a className="button button--yellow" href="#audio">🎙 Sube o graba tu voz</a>
          <a className="button button--ghost" href="#audio">▶ Probar demo</a>
        </div>
        <div className="hero__proof">
          <span>⚡ Análisis preciso</span>
          <span>🎯 Entrenamiento personalizado</span>
          <span>🔒 Audio privado</span>
        </div>
        <div className="team-polaroid">
          <img src="/assets/team-hipertensia.jpg" alt="Equipo HipertensIA trabajando en una sesión musical" />
          <span>Sesión real · laboratorio vocal</span>
        </div>
      </div>
      <DashboardMock />
    </section>
  );
}

function FeatureGrid() {
  return (
    <section id="funciones" className="features">
      <div className="graffiti-crown">♕</div>
      {features.map(([icon, title, text]) => (
        <article className="feature-card" key={title}>
          <div>{icon}</div>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
      <div className="valpo-tag">Valpo<br />Flow</div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="how section-shell">
      <div className="rapper-panel">
        <span>+ Flow<br />− Miedo</span>
      </div>
      <div className="how__content">
        <h2>Cómo funciona</h2>
        <div className="steps">
          {steps.map(([number, title, text]) => (
            <article className="step" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="valpo-stairs" aria-hidden="true" />
    </section>
  );
}

function AudioComparison() {
  return (
    <section id="audio" className="audio-section section-shell">
      <div className="section-heading">
        <p className="eyebrow">Antes / después</p>
        <h2>Compara tu evolución</h2>
        <p>Los audios quedan visibles directamente en la landing para que cualquiera pueda escuchar la diferencia entre la toma original y la versión con IA.</p>
      </div>
      <div className="comparison-grid">
        <AudioPlayer track={comparisonTracks.original} variant="hot" />
        <div className="vs-badge">VS</div>
        <AudioPlayer track={comparisonTracks.enhanced} variant="cool" />
      </div>
      <div className="extra-audios">
        {extraTracks.map((track) => <AudioPlayer key={track.id} track={track} variant="compact" />)}
      </div>
    </section>
  );
}

function Recommendations() {
  return (
    <section className="recommendations section-shell">
      <div className="recommendations__panel">
        <div>
          <p className="eyebrow">Coach vocal personalizado</p>
          <h2>Recomendaciones personalizadas</h2>
          <ul>
            <li><strong>Estabilidad en notas largas</strong><span>Practica sostener notas afinadas por más tiempo.</span></li>
            <li><strong>Resonancia en agudos</strong><span>Abre espacio vocal y evita tensión en ataques altos.</span></li>
            <li><strong>Dicción y claridad</strong><span>Trabaja consonantes rápidas para freestyle y rap.</span></li>
          </ul>
        </div>
        <div className="exercise-card">
          <span>Ejercicio recomendado · 5 min</span>
          <h3>Sostén de nota con apoyo</h3>
          <p>Mejora tu control del aire y afinación en notas largas.</p>
          <div className="mini-wave">{Array.from({ length: 30 }).map((_, i) => <i key={i} style={{ '--h': `${18 + ((i * 23) % 66)}%` } as CSSProperties} />)}</div>
          <a href="#audio">Iniciar ejercicio</a>
        </div>
        <div className="radar-card">
          <h3>Análisis detallado</h3>
          <svg viewBox="0 0 250 230" role="img" aria-label="Radar de análisis vocal">
            <polygon points="125,18 226,91 187,207 63,207 24,91" fill="none" stroke="rgba(255,255,255,.12)" />
            <polygon points="125,48 197,99 168,178 82,178 53,99" fill="none" stroke="rgba(255,255,255,.12)" />
            <polygon points="125,75 168,109 153,151 96,165 78,106" fill="rgba(19,240,216,.25)" stroke="#13f0d8" strokeWidth="3" />
            <text x="112" y="14">Afinación</text><text x="205" y="84">Tono</text><text x="173" y="222">Técnica</text><text x="40" y="222">Expresión</text><text x="0" y="84">Respiración</text>
          </svg>
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section id="comunidad" className="community section-shell">
      <div className="community__intro">
        <h2>Somos comunidad</h2>
        <p>Artistas reales. Calles reales. Voces que inspiran.</p>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((item, index) => (
          <article className="testimonial" key={item.name}>
            <img src={item.image} alt={`Foto de ${item.name}`} className={index < 3 ? 'object-left' : ''} />
            <div>
              <h3>{item.name}</h3>
              <span>{item.city}</span>
              <p>“{item.quote}”</p>
              <strong>★★★★★</strong>
            </div>
          </article>
        ))}
      </div>
      <div className="community-stat"><strong>+10K</strong><span>artistas entrenando cada semana</span></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <a className="logo" href="#inicio"><span>Hipertens</span><strong>IA</strong></a>
        <p>Tu voz. Tu flow. Tu evolución.</p>
        <small>Hecho en Valparaíso, Chile 🇨🇱</small>
      </div>
      <div><h4>Producto</h4><a>Funciones</a><a>Cómo funciona</a><a>Planes y precios</a></div>
      <div><h4>Comunidad</h4><a>Artistas</a><a>Eventos</a><a>Embajadores</a></div>
      <div><h4>Recursos</h4><a>Blog</a><a>Guías</a><a>Soporte</a></div>
      <div className="footer__badge">Tu voz<br />es tu<br />poder</div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureGrid />
        <HowItWorks />
        <AudioComparison />
        <Recommendations />
        <Community />
      </main>
      <Footer />
    </>
  );
}
