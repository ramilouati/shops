/* eslint-disable no-undef */
import { useEffect, useRef } from "react";

export default function NewsLetter() {
  const modalElement = useRef(null);

  useEffect(() => {
    let timer;
    let myModal;
    import("bootstrap").then((bootstrap) => {
      myModal = new bootstrap.Modal(
        document.getElementById("newsletterPopup"),
        {
          keyboard: false,
        }
      );

      // Delay so the hero videos are visible first.
      timer = window.setTimeout(() => myModal.show(), 12000);
      modalElement.current?.addEventListener("hidden.bs.modal", () => {
        myModal.hide();
      });
    });
    return () => {
      window.clearTimeout(timer);
      myModal?.hide();
    };
  }, []);

  return (
    <div
      className="modal fade"
      id="newsletterPopup"
      ref={modalElement}
      tabIndex="-1"
      data-bs-backdrop={"true"}
      aria-hidden="true"
    >
      <div className="modal-dialog newsletter-popup modal-dialog-centered">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div className="row p-0 m-0">
            <div className="col-md-6 p-0 d-none d-md-block">
              <div className="newsletter-popup__bg h-100 w-100">
                <img
                  width={450}
                  height={550}
                  style={{ height: "fit-content" }}
                  loading="lazy"
                  src="/assets/images/newsletter-popup.jpg"
                  className="h-100 w-100 object-fit-cover d-block"
                  alt="image"
                />
              </div>
            </div>
            <div className="col-md-6 p-0 d-flex align-items-center">
              <div className="block-newsletter w-100">
                <h3 className="block__title">Inscrivez-vous à notre newsletter</h3>
                <p>
                  Soyez les premiers informés des tendances, des promotions
                  et bien plus encore !
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="footer-newsletter__form position-relative bg-body"
                >
                  <input
                    className="form-control border-2"
                    type="email"
                    name="email"
                    placeholder="Votre adresse e-mail"
                  />
                  <input
                    className="btn-link fw-medium bg-transparent position-absolute top-0 end-0 h-100"
                    type="submit"
                    defaultValue="S'INSCRIRE"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
