import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import MetaComponent from "@/components/common/MetaComponent";
import { useContextElement } from "@/context/Context";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const metadata = {
  title: "Connexion || TuniShop",
  description: "TuniShop",
};

export default function LoginPage() {
  const { loginCustomer, registerCustomer, customer, authReady } = useContextElement();
  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (authReady && customer) return <Navigate to="/compte" replace />;

  const onLogin = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = await loginCustomer(data);
    if (result.error) setError(result.error);
    else navigate("/compte");
  };

  const onRegister = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = await registerCustomer(data);
    if (result.error) setError(result.error);
    else navigate("/compte");
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header5 solid />
      <main className="page-wrapper">
        <section className="container pt-5 mt-5 pb-5" style={{ maxWidth: 520 }}>
          <h1 className="h2 mb-4">Mon compte</h1>
          <div className="d-flex gap-3 mb-4">
            <button type="button" className={`btn ${tab === "login" ? "btn-primary" : "btn-light"}`} onClick={() => { setTab("login"); setError(""); }}>
              Connexion
            </button>
            <button type="button" className={`btn ${tab === "register" ? "btn-primary" : "btn-light"}`} onClick={() => { setTab("register"); setError(""); }}>
              Créer un compte
            </button>
          </div>
          {error ? <p className="text-danger">{error}</p> : null}
          {tab === "login" ? (
            <form onSubmit={onLogin} className="d-grid gap-3">
              <label>
                E-mail
                <input className="form-control" name="email" type="email" required defaultValue="client@tunishop.tn" />
              </label>
              <label>
                Mot de passe
                <input className="form-control" name="password" type="password" required defaultValue="client123" />
              </label>
              <button type="submit" className="btn btn-primary">
                Se connecter
              </button>
            </form>
          ) : (
            <form onSubmit={onRegister} className="d-grid gap-3">
              <label>
                Nom
                <input className="form-control" name="name" required />
              </label>
              <label>
                E-mail
                <input className="form-control" name="email" type="email" required />
              </label>
              <label>
                Téléphone
                <input className="form-control" name="phone" />
              </label>
              <label>
                Mot de passe
                <input className="form-control" name="password" type="password" minLength={6} required />
              </label>
              <button type="submit" className="btn btn-primary">
                S’inscrire
              </button>
            </form>
          )}
          <p className="mt-4 mb-0">
            <Link to="/shop-1">Retour à la boutique</Link>
          </p>
        </section>
      </main>
      <Footer5 parentClass="footer footer_type_2 dark" />
    </>
  );
}
