import { closeModalUserlogin } from "@/utlis/aside";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context";

export default function CustomerLogin() {
  const { loginCustomer, registerCustomer, customer } = useContextElement();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const pageOverlay = document.getElementById("pageOverlay");
    pageOverlay.addEventListener("click", closeModalUserlogin);
    return () => pageOverlay.removeEventListener("click", closeModalUserlogin);
  }, []);

  useEffect(() => {
    if (customer) closeModalUserlogin();
  }, [customer]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result =
      mode === "login"
        ? await loginCustomer({ email: data.email, password: data.password })
        : await registerCustomer({
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
          });
    setBusy(false);
    if (result.error) setError(result.error);
    else closeModalUserlogin();
  };

  return (
    <div id="userAside" className="aside aside_right overflow-hidden customer-forms ">
      <div className="customer-forms__wrapper d-flex position-relative">
        <div className={mode === "login" ? "customer__login" : "customer__login d-none"}>
          <div className="aside-header d-flex align-items-center">
            <h3 className="text-uppercase fs-6 mb-0">Connexion</h3>
            <button onClick={() => closeModalUserlogin()} className="btn-close-lg js-close-aside ms-auto" />
          </div>
          <form onSubmit={onSubmit} className="aside-content">
            <div className="form-floating mb-3">
              <input name="email" type="email" className="form-control form-control_gray" placeholder="name@example.com" required defaultValue="client@tunishop.tn" />
              <label>E-mail *</label>
            </div>
            <div className="form-label-fixed mb-3">
              <label className="form-label">Mot de passe *</label>
              <input name="password" className="form-control form-control_gray" type="password" placeholder="********" required defaultValue="client123" />
            </div>
            {error ? <p className="text-danger">{error}</p> : null}
            <button className="btn btn-primary w-100 text-uppercase" type="submit" disabled={busy}>
              Se connecter
            </button>
            <div className="customer-option mt-4 text-center">
              <span className="text-secondary">Pas encore de compte ?</span>{" "}
              <button type="button" className="btn-text" onClick={() => { setMode("register"); setError(""); }}>
                Créer un compte
              </button>
            </div>
          </form>
        </div>

        <div className={mode === "register" ? "customer__register" : "customer__register d-none"}>
          <div className="aside-header d-flex align-items-center">
            <h3 className="text-uppercase fs-6 mb-0">Créer un compte</h3>
            <button onClick={() => closeModalUserlogin()} className="btn-close-lg js-close-aside ms-auto" />
          </div>
          <form onSubmit={onSubmit} className="aside-content">
            <div className="form-floating mb-3">
              <input name="name" type="text" className="form-control form-control_gray" placeholder="Nom" required />
              <label>Nom complet *</label>
            </div>
            <div className="form-floating mb-3">
              <input name="email" type="email" className="form-control form-control_gray" placeholder="name@example.com" required />
              <label>E-mail *</label>
            </div>
            <div className="form-floating mb-3">
              <input name="phone" type="tel" className="form-control form-control_gray" placeholder="20000000" />
              <label>Téléphone</label>
            </div>
            <div className="form-label-fixed mb-3">
              <label className="form-label">Mot de passe *</label>
              <input name="password" className="form-control form-control_gray" type="password" minLength={6} required />
            </div>
            {error ? <p className="text-danger">{error}</p> : null}
            <button className="btn btn-primary w-100 text-uppercase" type="submit" disabled={busy}>
              S’inscrire
            </button>
            <div className="customer-option mt-4 text-center">
              <span className="text-secondary">Déjà un compte ?</span>{" "}
              <button type="button" className="btn-text" onClick={() => { setMode("login"); setError(""); }}>
                Se connecter
              </button>
              {" · "}
              <Link to="/login_register" onClick={() => closeModalUserlogin()} className="btn-text">
                Page complète
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
