import { closeModalUserlogin } from "@/utlis/aside";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function CustomerLogin() {
  useEffect(() => {
    const pageOverlay = document.getElementById("pageOverlay");

    pageOverlay.addEventListener("click", closeModalUserlogin);

    return () => {
      pageOverlay.removeEventListener("click", closeModalUserlogin);
    };
  }, []);

  return (
    <div
      id="userAside"
      className="aside aside_right overflow-hidden customer-forms "
    >
      <div className="customer-forms__wrapper d-flex position-relative">
        <div className="customer__login">
          <div className="aside-header d-flex align-items-center">
            <h3 className="text-uppercase fs-6 mb-0">Connexion</h3>
            <button
              onClick={() => closeModalUserlogin()}
              className="btn-close-lg js-close-aside ms-auto"
            />
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="aside-content">
            <div className="form-floating mb-3">
              <input
                name="email"
                type="email"
                className="form-control form-control_gray"
                placeholder="name@example.com"
              />
              <label>Nom d’utilisateur ou e-mail *</label>
            </div>
            <div className="pb-3" />
            <div className="form-label-fixed mb-3">
              <label className="form-label">Mot de passe *</label>
              <input
                name="password"
                className="form-control form-control_gray"
                type="password"
                placeholder="********"
              />
            </div>
            <div className="d-flex align-items-center mb-3 pb-2">
              <div className="form-check mb-0">
                <input
                  name="remember"
                  className="form-check-input form-check-input_fill"
                  type="checkbox"
                  defaultValue
                />
                <label className="form-check-label text-secondary">
                  Se souvenir de moi
                </label>
              </div>
              <Link to="/reset_password" className="btn-text ms-auto">
                Mot de passe oublié ?
              </Link>
            </div>
            <button
              className="btn btn-primary w-100 text-uppercase"
              type="submit"
            >
              Se connecter
            </button>
            <div className="customer-option mt-4 text-center">
              <span className="text-secondary">Pas encore de compte ?</span>{" "}
              <Link
                to="/login_register#register-tab"
                className="btn-text js-show-register"
              >
                Créer un compte
              </Link>
            </div>
          </form>
        </div>
        <div className="customer__register">
          <div className="aside-header d-flex align-items-center">
            <h3 className="text-uppercase fs-6 mb-0">Créer un compte</h3>
            <button className="btn-close-lg js-close-aside btn-close-aside ms-auto" />
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="aside-content">
            <div className="form-floating mb-4">
              <input
                name="username"
                type="text"
                className="form-control form-control_gray"
                placeholder="Nom d'utilisateur"
              />
              <label>Nom d’utilisateur</label>
            </div>
            <div className="pb-1" />
            <div className="form-floating mb-4">
              <input
                name="email"
                type="email"
                className="form-control form-control_gray"
                placeholder="user@company.com"
              />
              <label>Adresse e-mail *</label>
            </div>
            <div className="pb-1" />
            <div className="form-label-fixed mb-4">
              <label className="form-label">Mot de passe *</label>
              <input
                name="password"
                className="form-control form-control_gray"
                type="password"
                placeholder="*******"
              />
            </div>
            <p className="text-secondary mb-4">
              Vos données personnelles seront utilisées pour améliorer votre
              expérience sur ce site, gérer l’accès à votre compte et à d’autres
              fins décrites dans notre politique de confidentialité.
            </p>
            <button
              className="btn btn-primary w-100 text-uppercase"
              type="submit"
            >
              S’inscrire
            </button>
            <div className="customer-option mt-4 text-center">
              <span className="text-secondary">Vous avez déjà un compte ?</span>
              <a href="#" className="btn-text js-show-login">
                Se connecter
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
