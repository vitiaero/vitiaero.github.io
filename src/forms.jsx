// Validation des formulaires, cote navigateur.
// Trois principes, communs aux quatre formulaires du site :
//   1. le champ est verifie quand on le quitte, pas seulement a l'envoi ;
//   2. le message s'affiche sous le champ concerne et lui est rattache
//      (aria-invalid et aria-describedby), pour les lecteurs d'ecran ;
//   3. un envoi refuse affiche un resume en haut du formulaire, qui prend le
//      focus et dont chaque ligne mene au champ fautif.
// Le serveur revalide tout : ces controles sont un confort, jamais une securite.
import { useCallback, useRef, useState } from 'react';
import { useI18n } from './i18n/index.jsx';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// `rules` : { champ: (valeur, toutesLesValeurs, textes) => message | null }
export function useFormValidation(rules) {
  const { t } = useI18n();
  const texts = t.validation;
  const [errors, setErrors] = useState({});
  const summaryRef = useRef(null);

  const run = useCallback(
    (name, values) => {
      const rule = rules[name];
      if (!rule) return null;
      return rule(values[name], values, texts) || null;
    },
    [rules, texts]
  );

  // A la sortie d'un champ : on signale son erreur, jamais celle des autres.
  const validateField = useCallback(
    (name, values) => {
      const message = run(name, values);
      setErrors((previous) => ({ ...previous, [name]: message }));
      return message;
    },
    [run]
  );

  // Efface l'erreur d'un champ pendant la saisie : corriger doit soulager.
  const clearField = useCallback((name) => {
    setErrors((previous) => (previous[name] ? { ...previous, [name]: null } : previous));
  }, []);

  const validateAll = useCallback(
    (values) => {
      const next = {};
      for (const name of Object.keys(rules)) {
        const message = run(name, values);
        if (message) next[name] = message;
      }
      setErrors(next);
      const ok = Object.keys(next).length === 0;
      if (!ok) setTimeout(() => summaryRef.current?.focus(), 0);
      return ok;
    },
    [rules, run]
  );

  const reset = useCallback(() => setErrors({}), []);

  // Attributs a poser sur le champ, pour relier le message a son controle.
  const fieldProps = useCallback(
    (name, id, values) => ({
      onBlur: () => validateField(name, values),
      onInput: () => clearField(name),
      'aria-invalid': errors[name] ? 'true' : undefined,
      'aria-describedby': errors[name] ? `${id}-error` : undefined,
    }),
    [errors, validateField, clearField]
  );

  return { errors, setErrors, validateField, validateAll, fieldProps, summaryRef, reset };
}

// Message d'erreur d'un champ. L'identifiant reprend celui du champ suivi de
// "-error" : c'est lui que pointe aria-describedby.
export function FieldError({ id, message }) {
  if (!message) return null;
  return <p className="field-error" id={`${id}-error`}>{message}</p>;
}

// Resume place en haut du formulaire. Il prend le focus apres un envoi refuse
// et chaque ligne amene au champ concerne.
export function FormErrorSummary({ errors, fields, summaryRef }) {
  const { t } = useI18n();
  const list = fields.filter((f) => errors[f.name]);
  if (list.length === 0) return null;

  return (
    <div className="alert alert-error error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
      <strong>{t.validation.summaryTitle}</strong>
      <ul>
        {list.map((f) => (
          <li key={f.name}>
            <a
              href={`#${f.id}`}
              onClick={(ev) => {
                ev.preventDefault();
                const field = document.getElementById(f.id);
                field?.focus();
                field?.scrollIntoView({ block: 'center', behavior: 'smooth' });
              }}
            >
              {f.label} : {errors[f.name]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Regles reutilisables -------------------------------------------------
// `message` recoit les textes traduits (t.validation) et renvoie la phrase.
export const required = (message) => (value, values, texts) =>
  (typeof value === 'string' ? value.trim() : value) ? null : message(texts);

export const emailRule = (value, values, texts) => {
  const v = String(value || '').trim();
  if (!v) return texts.emailRequired;
  return EMAIL_RE.test(v) ? null : texts.emailInvalid;
};
