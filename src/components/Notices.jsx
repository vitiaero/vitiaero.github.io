// Mentions communes aux formulaires : formulaire ferme en pre-lancement, et
// rappel que l'estimation ou la demande n'est pas une commande.
import { LAUNCH, business } from '../launch.js';
import { useI18n } from '../i18n/index.jsx';

export function FormsClosed({ id }) {
  const { t } = useI18n();
  const f = t.formsClosed;
  const mail = business.identity.email;
  return (
    <div className="alert alert-info forms-closed" role="status" id={id}>
      <strong>{f.title}</strong>
      <p>{LAUNCH.ready ? f.unavailable : f.prelaunch}</p>
      <p>
        {f.write} <a href={`mailto:${mail}`}>{mail}</a>
        {f.after(business.commercial.responseTimeHours)}
      </p>
    </div>
  );
}

export function NoOrderNotice({ variant = 'request', className = '' }) {
  const { t } = useI18n();
  return (
    <div className={`no-order ${className}`} role="note">
      <strong>{t.noOrder.title}</strong>
      <p>{variant === 'estimate' ? t.noOrder.estimate : t.noOrder.request}</p>
    </div>
  );
}
