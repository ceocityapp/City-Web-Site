"use client";

import { useState } from "react";

/**
 * "Bring City App to your city" — the petition form.
 *
 * Four fields on open ground rather than a boxed corporate form: the labels sit
 * above hairline-underlined inputs, and the whole thing shares the page's
 * measure so it reads as a section, not a widget.
 *
 * Submissions currently reach a route that logs and returns ok — see the TODO
 * in `api/waitlist`. The success state deliberately promises only that the
 * message was received.
 */
type State = "idle" | "sending" | "sent" | "error";

export function Bring() {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const data = new FormData(event.currentTarget);
    setState("sending");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          city: data.get("city"),
          email: data.get("email"),
          message: data.get("message"),
          locale: "en",
        }),
      });
      setState(response.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="ca-sec" data-tone="light" id="bring" aria-labelledby="ca-bring-title">
      <div className="ca-shell">
        <div className="ca-bring">
          <div className="ca-bring__intro">
            <p className="ca-eyebrow">Get in touch</p>
            <h2 id="ca-bring-title" className="ca-h2">
              Bring City App to your city
            </h2>
            <p className="ca-lead">
              For councils, associations, businesses and anyone who thinks their
              city deserves one. Tell us where you are and we will take it from
              there.
            </p>
          </div>

          {state === "sent" ? (
            <div className="ca-bring__done" role="status">
              <span className="ca-bring__tick" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className="ca-h3">Thank you — we have it.</h3>
              <p className="ca-body">
                We read every one of these. If your city is a fit, you will hear
                from us directly.
              </p>
            </div>
          ) : (
            <form className="ca-form" onSubmit={onSubmit} noValidate={false}>
              <div className="ca-form__row">
                <div className="ca-field">
                  <label htmlFor="ca-name">Name</label>
                  <input id="ca-name" name="name" type="text" required autoComplete="name" placeholder="Your name" />
                </div>
                <div className="ca-field">
                  <label htmlFor="ca-city">City</label>
                  <input id="ca-city" name="city" type="text" required autoComplete="address-level2" placeholder="Where you are" />
                </div>
              </div>

              <div className="ca-field">
                <label htmlFor="ca-email">Email</label>
                <input id="ca-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
              </div>

              <div className="ca-field">
                <label htmlFor="ca-message">Message</label>
                <textarea id="ca-message" name="message" rows={3} placeholder="Anything you want us to know (optional)" />
              </div>

              <div className="ca-form__foot">
                <button className="ca-btn ca-btn--primary ca-btn--lg" type="submit" disabled={state === "sending"}>
                  {state === "sending" ? "Sending…" : "Bring City App to your city"}
                </button>
                {state === "error" ? (
                  <p className="ca-small ca-form__error" role="alert">
                    That did not go through. Please try again, or email us directly.
                  </p>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
