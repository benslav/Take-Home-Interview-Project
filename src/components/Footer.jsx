import React from "react";

export default function Footer() {
  return (
    <div className="row footer__row">
      <a href="#" className="footer__anchor">
        <figure className="footer__logo">
          <img src={`${import.meta.env.BASE_URL}assets/cineradar-badge-icon-only.svg`} className="footer__logo--img" alt="CineRadar" />
        </figure>
        <span className="footer__logo--popper">
          Top <i className="fa-solid fa-arrow-up"></i>
        </span>
      </a>
      <div className="footer__copyright">Copyright © 2026 Benjamin Slaven</div>
    </div>
  );
}
