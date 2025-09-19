import React, { useState } from 'react';
import Navbarlol from '../components/ui/navbarlol';
import '../styles/BoostingLol.css';


function BoostingLol () {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const services = [
    {
      id: 1,
      title: 'Rank Boost',
      description: 'Un jugador de Challenger te hará Boost hasta el rango que desees.',
      icon: '⭐',
      color: 'blue',
      url: '/boostinglolPay',
    },
    {
      id: 2,
      title: 'Ganar Boost',
      description: 'El mejor para ganar fuera una realidad... ¿o lo es?',
      icon: '🏆',
      color: 'gold',
      url: '/boostinglolPay',
    },
    {
      id: 3,
      title: 'Paquetes de Boost',
      description: 'Ahorra hasta 30% con nuestros paquetes de boost de LoL',
      icon: '📦',
      color: 'multi',
      url: '/boostinglolPay'
    },
    {
      id: 4,
      title: 'Placements Boost',
      description: 'Asegura tu nueva cuenta con el MMR perfecto!',
      icon: '🛡️',
      color: 'gray',
      url: '/boostinglolPay'
    },
    {
      id: 5,
      title: 'Boost de la Temporada 15',
      description: 'Obtén un inicio perfecto para la nueva temporada!',
      icon: '🔮',
      color: 'purple',
      isNew: true,
      url: '/boostinglolPay'
    },
    {
      id: 6,
      title: 'Arena Boost',
      description: 'Obtén la cantidad de victorias en la Arena de LoL necesarias!',
      icon: '⚔️',
      color: 'purple-dark',
      url: '/boostinglolPay'
    },
    {
      id: 7,
      title: 'Partidas normales',
      description: 'Contrata a nuestros boosters para partidas normales de League!',
      icon: '🎮',
      color: 'multi-small',
      url: '/boostinglolPay'
    },
    {
      id: 8,
      title: 'Maestría del Campeón',
      description: 'Demuestra tus puntos de maestría más fácilmente que nunca.',
      icon: '👑',
      color: 'champion',
      url: '/boostinglolPay'
    }
  ];

  const faqs = [
    {
      question: '¿Cómo funciona el Boosting en LoL?',
      answer: 'Es muy fácil: solo elige el servicio que desees y cualquier opción extra, luego completa tu compra. Después de eso, nuestros boosters recogerán tu pedido y se pondrán a trabajar.'
    },
    {
      question: '¿Cuánto tarda en comenzar?',
      answer: 'Una vez que haces un pedido, nuestros boosters son rápidos para empezar a jugar de inmediato.'
    },
    {
      question: '¿Cuándo se completará mi pedido?',
      answer: 'Depende del tamaño del pedido, pero la mayoría de los pedidos de LoL se completan rápidamente!'
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (

    <div className="boosting-container">
      <div className='navbar-container-boosting'> <Navbarlol /></div>
      {/* Header */}
      <div className="boosting-header">
        
        <div className="header-icon-boosting"><img className="header-icon" src="https://cdn.gameboost.com/boost-forms/icons/dark/LoLRankBoost.svg" alt="icono boosting" /></div>
        <div className="header-content-boosting">
          <h1>LoL Boosting</h1>
          <p>¡El mejor Boosting de League of Legends en el mercado!</p>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section-boosting">
        <h2>Elige tu servicio de aumento de LoL</h2>
        <p>¡Elige el servicio de aumento de Liga que necesitas!</p>

        <div className="services-grid-boosting">
          {services.map((service) => (
            <a className='service-link-boosting' href={service.url}>
              <div key={service.id} className={`service-card-boosting ${service.color}`} >
                {service.isNew && <div className="new-badge">NUEVO</div>}
                <div className="service-icon-boosting">
                  <div className={`icon-wrapper ${service.color}`}>
                    {service.icon}
                  </div>
                </div>
                <div className="service-content-boosting">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Preguntas frecuentes sobre el boosting de LoL</h2>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className="faq-question"
                onClick={() => toggleFaq(index)}
              >
                <h3>{faq.question}</h3>
                <span className={`faq-arrow ${expandedFaq === index ? 'expanded' : ''}`}>
                  ▼ 
                </span>
              </div>
              <div className={`faq-answer ${expandedFaq === index ? 'expanded' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoostingLol;