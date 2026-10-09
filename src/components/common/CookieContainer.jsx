import { useState } from "react";

export default function CookieContainer() {
  const [show, setShow] = useState(true);
  return (
    <>
      {show && (
        <div
          className="cookieConsentContainer"
          style={{ opacity: 1, display: "block" }}
        >
          <div className="cookieDesc">
            <p>
              Afin de vous offrir une expérience d’achat personnalisée, notre
              site utilise des cookies. En poursuivant votre navigation, vous
              acceptez notre politique de cookies.
            </p>
          </div>
          <div className="cookieButton">
            <a onClick={() => setShow(false)}>Accepter</a>
          </div>
        </div>
      )}
    </>
  );
}
